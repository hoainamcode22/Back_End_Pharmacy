const db = require('../../db_config');

// =================== GET COMMENTS BY PRODUCT ===================
const getCommentsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const query = `
      SELECT 
        c."Id",
        c."UserId",
        c."ProductId",
        c."Rating",
        c."Content",
        c."CreatedAt",
        u."Username",
        u."Fullname"
      FROM "Comments" c
      JOIN "Users" u ON c."UserId" = u."Id"
      WHERE c."ProductId" = $1
      ORDER BY c."CreatedAt" DESC
    `;

    const result = await db.query(query, [productId]);

    const avgQuery = `
      SELECT 
        COALESCE(AVG("Rating"), 0) as "AverageRating",
        COUNT(*) as "TotalComments"
      FROM "Comments"
      WHERE "ProductId" = $1
    `;
    const avgResult = await db.query(avgQuery, [productId]);

    res.json({
      comments: result.rows,
      averageRating: parseFloat(avgResult.rows[0].AverageRating).toFixed(1),
      totalComments: parseInt(avgResult.rows[0].TotalComments)
    });
  } catch (error) {
    console.error('Lỗi getCommentsByProduct:', error);
    res.status(500).json({ error: 'Lỗi server khi lấy đánh giá!' });
  }
};

// =================== ADD COMMENT ===================
const addComment = async (req, res) => {
  try {
    const userId = req.user.Id;
    const { productId, rating, content } = req.body;

    if (!productId || !rating || !content) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin đánh giá!' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Số sao phải từ 1 đến 5!' });
    }

    const productCheck = await db.query(
      'SELECT "Id" FROM "Products" WHERE "Id" = $1',
      [productId]
    );
    if (productCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm!' });
    }

    const purchaseCheck = await db.query(`
      SELECT o."Id"
      FROM "Orders" o
      JOIN "OrderItems" oi ON o."Id" = oi."OrderId"
      WHERE o."UserId" = $1 
        AND oi."ProductId" = $2 
        AND o."Status" = 'delivered'
      LIMIT 1
    `, [userId, productId]);

    if (purchaseCheck.rows.length === 0) {
      return res.status(403).json({ 
        error: 'Bạn chỉ có thể đánh giá sản phẩm đã mua và nhận hàng thành công!' 
      });
    }

    const existingComment = await db.query(
      'SELECT "Id" FROM "Comments" WHERE "UserId" = $1 AND "ProductId" = $2',
      [userId, productId]
    );
    if (existingComment.rows.length > 0) {
      return res.status(400).json({ error: 'Bạn đã đánh giá sản phẩm này rồi!' });
    }

    const insertQuery = `
      INSERT INTO "Comments" ("UserId", "ProductId", "Rating", "Content")
      VALUES ($1, $2, $3, $4)
      RETURNING "Id", "Rating", "Content", "CreatedAt"
    `;
    const result = await db.query(insertQuery, [userId, productId, rating, content]);

    res.status(201).json({
      message: 'Thêm đánh giá thành công!',
      comment: result.rows[0]
    });
  } catch (error) {
    console.error('Lỗi addComment:', error);
    res.status(500).json({ error: 'Lỗi server khi thêm đánh giá!' });
  }
};

// =================== CHECK CAN REVIEW ===================
const checkCanReview = async (req, res) => {
  try {
    const userId = req.user.Id;
    const { productId } = req.params;

    const purchaseCheck = await db.query(`
      SELECT o."Id"
      FROM "Orders" o
      JOIN "OrderItems" oi ON o."Id" = oi."OrderId"
      WHERE o."UserId" = $1 
        AND oi."ProductId" = $2 
        AND o."Status" = 'delivered'
      LIMIT 1
    `, [userId, productId]);

    const hasPurchased = purchaseCheck.rows.length > 0;

    const reviewCheck = await db.query(
      'SELECT "Id" FROM "Comments" WHERE "UserId" = $1 AND "ProductId" = $2',
      [userId, productId]
    );

    const hasReviewed = reviewCheck.rows.length > 0;

    res.json({
      canReview: hasPurchased && !hasReviewed,
      hasPurchased,
      hasReviewed
    });
  } catch (error) {
    console.error('Lỗi checkCanReview:', error);
    res.status(500).json({ error: 'Lỗi server khi kiểm tra quyền đánh giá!' });
  }
};

// =================== DELETE COMMENT ===================
const deleteComment = async (req, res) => {
  try {
    const userId = req.user.Id;
    const userRole = req.user.Role;
    const { id } = req.params;

    const commentCheck = await db.query(
      'SELECT "Id", "UserId" FROM "Comments" WHERE "Id" = $1',
      [id]
    );

    if (commentCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy đánh giá!' });
    }

    const comment = commentCheck.rows[0];

    if (userRole !== 'admin' && comment.UserId !== userId) {
      return res.status(403).json({ error: 'Bạn không có quyền xóa đánh giá này!' });
    }

    await db.query('DELETE FROM "Comments" WHERE "Id" = $1', [id]);

    res.json({ message: 'Xóa đánh giá thành công!' });
  } catch (error) {
    console.error('Lỗi deleteComment:', error);
    res.status(500).json({ error: 'Lỗi server khi xóa đánh giá!' });
  }
};

module.exports = {
  getCommentsByProduct,
  addComment,
  checkCanReview,
  deleteComment
};
