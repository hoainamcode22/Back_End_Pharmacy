// Chat Service - Xử lý Socket.IO và realtime messaging
const jwt = require('jsonwebtoken');
const db = require('../../db_config');

class ChatService {
  constructor() {
    this.connectedUsers = new Map(); // userId -> socketId
    this.adminSockets = new Set(); // Tập hợp socket của admin
  }

  // Khởi tạo Socket.IO
  initializeSocketIO(io) {
    this.io = io;

    io.on('connection', async (socket) => {
      console.log(`👤 User kết nối: ${socket.id}`);

      // Xác thực user khi kết nối
      socket.on('authenticate', async (token) => {
        try {
          // --- (PHẦN SỬA) ---
          // Thêm fallback 'secretkey' để đồng bộ với file auth.js
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
          // --- (HẾT PHẦN SỬA) ---
          
          const user = await this.getUserById(decoded.id);
          
          if (user) {
            socket.userId = user.Id;
            socket.userRole = user.Role;
            socket.userName = user.Fullname || user.Username;

            // Lưu thông tin user
            this.connectedUsers.set(user.Id, socket.id);
            
            if (user.Role === 'admin') {
              this.adminSockets.add(socket.id);
              socket.join('admin_room');
              console.log(`👨‍💼 Admin ${user.Username} joined admin_room`);
            }

            socket.emit('authenticated', {
              success: true,
              user: {
                id: user.Id,
                name: user.Fullname || user.Username,
                role: user.Role
              }
            });

            console.log(`✅ User ${user.Username} (${user.Role}) đã xác thực, Socket ID: ${socket.id}`);
          }
        } catch (error) {
          socket.emit('authenticated', { success: false, error: 'Token không hợp lệ' });
        }
      });

      // Tạo chat thread mới
      socket.on('create_chat_thread', async (data) => {
        try {
          if (!socket.userId) return;

          const thread = await this.createChatThread({
            userId: socket.userId,
            title: data.title || 'Hỏi ý kiến bác sĩ',
            attachmentType: data.attachmentType || 'general',
            attachmentId: data.attachmentId || null
          });

          socket.join(`thread_${thread.Id}`);
          socket.emit('thread_created', thread);

          // Thông báo cho admin có thread mới
          console.log(`📢 Broadcasting new_thread_notification to admin_room. Thread ID: ${thread.Id}`);
          console.log(`👥 Admin sockets count: ${this.adminSockets.size}`);
          
          socket.broadcast.to('admin_room').emit('new_thread_notification', {
            threadId: thread.Id,
            userName: socket.userName,
            title: thread.Title,
            createdAt: thread.CreatedAt
          });

        } catch (error) {
          console.error('❌ Error creating chat thread:', error);
          socket.emit('error', { message: 'Không thể tạo cuộc hội thoại' });
        }
      });

      // Join thread
      socket.on('join_thread', async (threadId) => {
        try {
          if (!socket.userId) return;

          // Kiểm tra quyền truy cập thread
          const hasAccess = await this.checkThreadAccess(threadId, socket.userId, socket.userRole);
          if (!hasAccess) {
            socket.emit('error', { message: 'Không có quyền truy cập cuộc hội thoại này' });
            return;
          }

          socket.join(`thread_${threadId}`);
          
          // Lấy lịch sử tin nhắn
          const messages = await this.getThreadMessages(threadId);
          socket.emit('thread_messages', { threadId, messages });

        } catch (error) {
          socket.emit('error', { message: 'Không thể tham gia cuộc hội thoại' });
        }
      });

      // Gửi tin nhắn
      socket.on('send_message', async (data) => {
        try {
          if (!socket.userId) return;

          const message = await this.createMessage({
            threadId: data.threadId,
            senderId: socket.userId,
            senderRole: socket.userRole,
            content: data.content
          });

          // Gửi tin nhắn cho tất cả thành viên trong thread
          io.to(`thread_${data.threadId}`).emit('new_message', {
            ...message,
            senderName: socket.userName
          });

          console.log(`💬 Tin nhắn mới từ ${socket.userName} trong thread ${data.threadId}`);

        } catch (error) {
          socket.emit('error', { message: 'Không thể gửi tin nhắn' });
        }
      });

      // Admin join all active threads
      socket.on('admin_join_all_threads', async () => {
        try {
          if (socket.userRole !== 'admin') return;

          const activeThreads = await this.getActiveThreads();
          activeThreads.forEach(thread => {
            socket.join(`thread_${thread.Id}`);
          });

          socket.emit('admin_threads_joined', activeThreads);
        } catch (error) {
          socket.emit('error', { message: 'Không thể tham gia các cuộc hội thoại' });
        }
      });

      // Typing indicator
      socket.on('typing', (data) => {
        socket.broadcast.to(`thread_${data.threadId}`).emit('user_typing', {
          userId: socket.userId,
          userName: socket.userName,
          threadId: data.threadId
        });
      });

      socket.on('stop_typing', (data) => {
        socket.broadcast.to(`thread_${data.threadId}`).emit('user_stop_typing', {
          userId: socket.userId,
          threadId: data.threadId
        });
      });

      // Disconnect
      socket.on('disconnect', () => {
        console.log(`👋 User ngắt kết nối: ${socket.id}`);
        
        if (socket.userId) {
          this.connectedUsers.delete(socket.userId);
        }
        
        if (socket.userRole === 'admin') {
          this.adminSockets.delete(socket.id);
        }
      });
    });
  }

  // Database methods
  async getUserById(userId) {
    const result = await db.query('SELECT * FROM public."Users" WHERE "Id" = $1', [userId]);
    return result.rows[0];
  }

  async createChatThread(data) {
    const query = `
      INSERT INTO public."ChatThreads" ("UserId", "Title", "AttachmentType", "AttachmentId")
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await db.query(query, [data.userId, data.title, data.attachmentType, data.attachmentId]);
    return result.rows[0];
  }

  async createMessage(data) {
    const query = `
      INSERT INTO public."ChatMessages" ("ThreadId", "SenderId", "SenderRole", "Content")
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await db.query(query, [data.threadId, data.senderId, data.senderRole, data.content]);
    return result.rows[0];
  }

  async getThreadMessages(threadId) {
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
    return result.rows;
  }

  async checkThreadAccess(threadId, userId, userRole) {
    if (userRole === 'admin') return true;
    
    const query = 'SELECT 1 FROM public."ChatThreads" WHERE "Id" = $1 AND "UserId" = $2';
    const result = await db.query(query, [threadId, userId]);
    return result.rows.length > 0;
  }

  async getActiveThreads() {
    const query = `
      SELECT 
        ct.*,
        u."Fullname" as "UserName",
        u."Username" as "Username"
      FROM public."ChatThreads" ct
      JOIN public."Users" u ON ct."UserId" = u."Id"
      WHERE ct."Status" = 'active'
      ORDER BY ct."UpdatedAt" DESC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  // Utility methods
  sendNotificationToAdmins(event, data) {
    this.adminSockets.forEach(socketId => {
      this.io.to(socketId).emit(event, data);
    });
  }

  getUserSocketId(userId) {
    return this.connectedUsers.get(userId);
  }

  isUserOnline(userId) {
    return this.connectedUsers.has(userId);
  }
}

module.exports = new ChatService();