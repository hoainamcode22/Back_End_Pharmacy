const express = require('express');
const router = express.Router();
const { checkout, getOrders, getOrderById, cancelOrder } = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/auth');

// Tất cả routes đều cần authentication
router.use(authenticateToken);

// POST /api/orders/checkout - Đặt hàng
router.post('/checkout', checkout);

// GET /api/orders - Danh sách đơn hàng
router.get('/', getOrders);

// GET /api/orders/:id - Chi tiết đơn hàng
router.get('/:id', getOrderById);

// PATCH /api/orders/:id/cancel - Hủy đơn hàng
router.patch('/:id/cancel', cancelOrder);

module.exports = router;
