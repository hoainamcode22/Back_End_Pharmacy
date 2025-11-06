const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticate } = require('../middleware/auth');

// ✅ GET /api/comments/check/:productId - Kiểm tra quyền đánh giá (cần đăng nhập)
// ⚠️ PHẢI ĐẶT TRƯỚC /:productId để không bị nhầm
router.get('/check/:productId', authenticate, commentController.checkCanReview);

// ✅ GET /api/comments/:productId - Lấy tất cả đánh giá của sản phẩm (public)
router.get('/:productId', commentController.getCommentsByProduct);

// ✅ POST /api/comments - Thêm đánh giá mới (cần đăng nhập)
router.post('/', authenticate, commentController.addComment);

// ✅ DELETE /api/comments/:id - Xóa đánh giá (admin hoặc chủ comment)
router.delete('/:id', authenticate, commentController.deleteComment);

module.exports = router;
