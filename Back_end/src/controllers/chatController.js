// Chat Controller - API endpoints cho chat
const db = require('../../db_config');
const chatService = require('../services/chatService');

const chatController = {
  
  /**
   * @swagger
   * /api/chat/admin/threads:
   *   get:
   *     summary: Lấy tất cả chat threads (Admin only)
   *     tags: [Chat]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Danh sách tất cả threads và thống kê
   */
  getAllThreads: async (req, res) => {
    try {
      const userRole = req.user.Role; // Sử dụng Role viết hoa

      if (userRole !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          message: 'Chỉ admin mới có thể xem tất cả cuộc hội thoại' 
        });
      }

      // Lấy tất cả threads với thông tin user
      const threadsQuery = `
        SELECT 
          ct.*,
          u.name as user_name,
          u.email as user_email,
          u.username as username,
          (SELECT COUNT(*) FROM chatmessages WHERE thread_id = ct.id) as message_count,
          (SELECT cm.content FROM chatmessages cm WHERE cm.thread_id = ct.id ORDER BY cm.created_at DESC LIMIT 1) as last_message,
          (SELECT cm.created_at FROM chatmessages cm WHERE cm.thread_id = ct.id ORDER BY cm.created_at DESC LIMIT 1) as last_message_at
        FROM chatthreads ct
        JOIN users u ON ct.user_id = u.id
        ORDER BY 
          CASE WHEN ct.status = 'active' THEN 0 ELSE 1 END,
          COALESCE((SELECT cm.created_at FROM chatmessages cm WHERE cm.thread_id = ct.id ORDER BY cm.created_at DESC LIMIT 1), ct.created_at) DESC
      `;

      const threadsResult = await db.query(threadsQuery);

      // Lấy thống kê
      const statsQueries = await Promise.all([
        db.query('SELECT COUNT(*) as total FROM chatthreads'),
        db.query('SELECT COUNT(*) as active FROM chatthreads WHERE status = $1', ['active']),
        db.query('SELECT COUNT(*) as closed FROM chatthreads WHERE status = $1', ['closed'])
      ]);

      const stats = {
        total: parseInt(statsQueries[0].rows[0].total),
        active: parseInt(statsQueries[1].rows[0].active),
        closed: parseInt(statsQueries[2].rows[0].closed)
      };

      res.json({
        success: true,
        threads: threadsResult.rows,
        stats: stats
      });

    } catch (error) {
      console.error('Lỗi lấy tất cả threads:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Không thể lấy danh sách cuộc hội thoại' 
      });
    }
  },

  /**
   * @swagger
   * /api/chat/threads:
   *   get:
   *     summary: Lấy danh sách chat threads của user
   *     tags: [Chat]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Danh sách threads thành công
   */
  getUserThreads: async (req, res) => {
    try {
      const userId = req.user.Id; // Sử dụng Id viết hoa
      const userRole = req.user.Role; // Sử dụng Role viết hoa

      let query;
      let params;

      if (userRole === 'admin') {
        // Admin xem tất cả threads
        query = `
          SELECT 
            ct.*,
            u."Fullname" as "UserName",
            u."Username" as "Username",
            (SELECT COUNT(*) FROM public."ChatMessages" WHERE "ThreadId" = ct."Id") as "MessageCount",
            (SELECT cm."Content" FROM public."ChatMessages" cm WHERE cm."ThreadId" = ct."Id" ORDER BY cm."CreatedAt" DESC LIMIT 1) as "LastMessage",
            (SELECT cm."CreatedAt" FROM public."ChatMessages" cm WHERE cm."ThreadId" = ct."Id" ORDER BY cm."CreatedAt" DESC LIMIT 1) as "LastMessageAt"
          FROM public."ChatThreads" ct
          JOIN public."Users" u ON ct."UserId" = u."Id"
          ORDER BY ct."UpdatedAt" DESC
        `;
        params = [];
      } else {
        // User chỉ xem threads của mình
        query = `
          SELECT 
            ct.*,
            (SELECT COUNT(*) FROM public."ChatMessages" WHERE "ThreadId" = ct."Id") as "MessageCount",
            (SELECT cm."Content" FROM public."ChatMessages" cm WHERE cm."ThreadId" = ct."Id" ORDER BY cm."CreatedAt" DESC LIMIT 1) as "LastMessage",
            (SELECT cm."CreatedAt" FROM public."ChatMessages" cm WHERE cm."ThreadId" = ct."Id" ORDER BY cm."CreatedAt" DESC LIMIT 1) as "LastMessageAt"
          FROM public."ChatThreads" ct
          WHERE ct."UserId" = $1
          ORDER BY ct."UpdatedAt" DESC
        `;
        params = [userId];
      }

      const result = await db.query(query, params);
      
      res.json({
        success: true,
        threads: result.rows
      });

    } catch (error) {
      console.error('Lỗi lấy threads:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Không thể lấy danh sách cuộc hội thoại' 
      });
    }
  },

  /**
   * @swagger
   * /api/chat/threads:
   *   post:
   *     summary: Tạo thread chat mới
   *     tags: [Chat]
   *     security:
   *       - bearerAuth: []
   */
  createThread: async (req, res) => {
    try {
      const { title, attachmentType, attachmentId } = req.body;
      const userId = req.user.Id; // Sử dụng Id viết hoa

      const query = `
        INSERT INTO public."ChatThreads" ("UserId", "Title", "AttachmentType", "AttachmentId")
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;

      const result = await db.query(query, [
        userId,
        title || 'Hỏi ý kiến bác sĩ',
        attachmentType || 'general',
        attachmentId || null
      ]);

      const thread = result.rows[0];

      // Thông báo cho admin qua Socket.IO
      const io = req.app.get('io');
      io.to('admin_room').emit('new_thread_notification', {
        threadId: thread.Id,
        userName: req.user.name,
        title: thread.Title,
        createdAt: thread.CreatedAt
      });

      res.json({
        success: true,
        thread: thread
      });

    } catch (error) {
      console.error('Lỗi tạo thread:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Không thể tạo cuộc hội thoại' 
      });
    }
  },

  /**
   * @swagger
   * /api/chat/threads/{threadId}/messages:
   *   get:
   *     summary: Lấy tin nhắn trong thread
   *     tags: [Chat]
   *     security:
   *       - bearerAuth: []
   */
  getThreadMessages: async (req, res) => {
    try {
      const { threadId } = req.params;
      const userId = req.user.Id; // Sử dụng Id viết hoa
      const userRole = req.user.Role; // Sử dụng Role viết hoa

      // Kiểm tra quyền truy cập
      if (userRole !== 'admin') {
        const accessCheck = await db.query(
          'SELECT 1 FROM public."ChatThreads" WHERE "Id" = $1 AND "UserId" = $2',
          [threadId, userId]
        );
        
        if (accessCheck.rows.length === 0) {
          return res.status(403).json({ 
            success: false, 
            message: 'Không có quyền truy cập cuộc hội thoại này' 
          });
        }
      }

      const query = `
        SELECT 
          cm.*,
          u."Fullname" as "SenderName",
          u."Username" as "SenderUsername"
        FROM public."ChatMessages" cm
        JOIN public."Users" u ON cm."SenderId" = u."Id"
        WHERE cm."ThreadId" = $1
        ORDER BY cm."CreatedAt" ASC
      `;

      const result = await db.query(query, [threadId]);

      res.json({
        success: true,
        messages: result.rows
      });

    } catch (error) {
      console.error('Lỗi lấy tin nhắn:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Không thể lấy tin nhắn' 
      });
    }
  },

  /**
   * @swagger
   * /api/chat/threads/{threadId}/messages:
   *   post:
   *     summary: Gửi tin nhắn mới
   *     tags: [Chat]
   *     security:
   *       - bearerAuth: []
   */
  sendMessage: async (req, res) => {
    try {
      const { threadId } = req.params;
      const { content } = req.body;
      const userId = req.user.Id; // Sử dụng Id viết hoa
      const userRole = req.user.Role; // Sử dụng Role viết hoa

      if (!content || content.trim() === '') {
        return res.status(400).json({ 
          success: false, 
          message: 'Nội dung tin nhắn không được để trống' 
        });
      }

      // Kiểm tra quyền truy cập thread
      if (userRole !== 'admin') {
        const accessCheck = await db.query(
          'SELECT 1 FROM public."ChatThreads" WHERE "Id" = $1 AND "UserId" = $2',
          [threadId, userId]
        );
        
        if (accessCheck.rows.length === 0) {
          return res.status(403).json({ 
            success: false, 
            message: 'Không có quyền truy cập cuộc hội thoại này' 
          });
        }
      }

      // Tạo tin nhắn
      const messageQuery = `
        INSERT INTO public."ChatMessages" ("ThreadId", "SenderId", "SenderRole", "Content")
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;

      const messageResult = await db.query(messageQuery, [threadId, userId, userRole, content.trim()]);
      const message = messageResult.rows[0];

      // Cập nhật thời gian thread
      await db.query(
        'UPDATE public."ChatThreads" SET "UpdatedAt" = NOW() WHERE "Id" = $1',
        [threadId]
      );

      // Gửi realtime qua Socket.IO
      const io = req.app.get('io');
      io.to(`thread_${threadId}`).emit('new_message', {
        ...message,
        SenderName: req.user.name
      });

      res.json({
        success: true,
        message: message
      });

    } catch (error) {
      console.error('Lỗi gửi tin nhắn:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Không thể gửi tin nhắn' 
      });
    }
  },

  /**
   * @swagger
   * /api/chat/threads/{threadId}/close:
   *   patch:
   *     summary: Đóng thread chat (chỉ admin)
   *     tags: [Chat]
   *     security:
   *       - bearerAuth: []
   */
  closeThread: async (req, res) => {
    try {
      const { threadId } = req.params;
      const userRole = req.user.Role; // Sử dụng Role viết hoa

      if (userRole !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          message: 'Chỉ admin mới có thể đóng cuộc hội thoại' 
        });
      }

      await db.query(
        'UPDATE public."ChatThreads" SET "Status" = $1, "UpdatedAt" = NOW() WHERE "Id" = $2',
        ['closed', threadId]
      );

      // Thông báo qua Socket.IO
      const io = req.app.get('io');
      io.to(`thread_${threadId}`).emit('thread_closed', {
        threadId,
        closedBy: req.user.name
      });

      res.json({
        success: true,
        message: 'Đã đóng cuộc hội thoại'
      });

    } catch (error) {
      console.error('Lỗi đóng thread:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Không thể đóng cuộc hội thoại' 
      });
    }
  },

  /**
   * @swagger
   * /api/chat/stats:
   *   get:
   *     summary: Thống kê chat (chỉ admin)
   *     tags: [Chat]
   *     security:
   *       - bearerAuth: []
   */
  getChatStats: async (req, res) => {
    try {
      const userRole = req.user.Role; // Sử dụng Role viết hoa

      if (userRole !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          message: 'Chỉ admin mới có thể xem thống kê' 
        });
      }

      const stats = await Promise.all([
        // Tổng số threads
        db.query('SELECT COUNT(*) as total FROM public."ChatThreads"'),
        // Threads đang hoạt động
        db.query('SELECT COUNT(*) as active FROM public."ChatThreads" WHERE "Status" = $1', ['active']),
        // Threads hôm nay
        db.query('SELECT COUNT(*) as today FROM public."ChatThreads" WHERE DATE("CreatedAt") = CURRENT_DATE'),
        // Tổng tin nhắn
        db.query('SELECT COUNT(*) as total FROM public."ChatMessages"'),
        // Threads chưa trả lời (chỉ có tin nhắn từ customer)
        db.query(`
          SELECT COUNT(*) as unanswered FROM public."ChatThreads" ct
          WHERE ct."Status" = 'active' 
          AND NOT EXISTS (
            SELECT 1 FROM public."ChatMessages" cm 
            WHERE cm."ThreadId" = ct."Id" AND cm."SenderRole" = 'admin'
          )
        `)
      ]);

      res.json({
        success: true,
        stats: {
          totalThreads: parseInt(stats[0].rows[0].total),
          activeThreads: parseInt(stats[1].rows[0].active),
          todayThreads: parseInt(stats[2].rows[0].today),
          totalMessages: parseInt(stats[3].rows[0].total),
          unansweredThreads: parseInt(stats[4].rows[0].unanswered)
        }
      });

    } catch (error) {
      console.error('Lỗi lấy thống kê:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Không thể lấy thống kê' 
      });
    }
  }
};

module.exports = chatController;