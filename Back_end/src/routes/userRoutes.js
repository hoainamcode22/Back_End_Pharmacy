const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, changePassword } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

// Tất cả routes đều cần authentication
router.use(authenticateToken);

// GET /api/users/me - Thông tin cá nhân
router.get('/me', getProfile);

// PATCH /api/users/me - Cập nhật thông tin
router.patch('/me', updateProfile);

// PATCH /api/users/change-password - Đổi mật khẩu
router.patch('/change-password', changePassword);

module.exports = router;
