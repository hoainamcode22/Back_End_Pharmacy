const express = require('express');
const router = express.Router();
const { getProducts, getProductById } = require('../controllers/productController');

// GET /api/products - Danh sách sản phẩm
router.get('/', getProducts);

// GET /api/products/:id - Chi tiết sản phẩm
router.get('/:id', getProductById);

module.exports = router;
