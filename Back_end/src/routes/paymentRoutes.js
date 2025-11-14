const express = require('express');
const { handleMomoIPN } = require('../controllers/paymentController');

const router = express.Router();

// Đây là link chúng ta khai báo trong .env (MOMO_IPN_URL)
// MoMo sẽ POST về link này khi thanh toán thành công
router.post('/momo-ipn', handleMomoIPN);

module.exports = router;