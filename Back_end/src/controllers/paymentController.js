const db = require('../../db_config');
const crypto = require('crypto');

// Lấy key từ .env để xác thực chữ ký của MoMo
const secretKey = process.env.MOMO_SECRET_KEY;

/**
 * Xử lý IPN (Instant Payment Notification) từ MoMo
 * Đây là nơi MoMo gọi ngầm để xác nhận thanh toán
 */
const handleMomoIPN = async (req, res) => {
  const {
    partnerCode,
    orderId, // Đây là orderId của MoMo (ví dụ: MOMO_123_timestamp)
    requestId, // Đây là requestId (cũng là MoMo orderId)
    amount,
    orderInfo,
    orderType,
    transId,
    resultCode,
    message,
    payType,
    responseTime,
    extraData,
    signature // Chữ ký của MoMo gửi qua
  } = req.body;

  console.log("MoMo IPN Received:", req.body);

  // 1. Tạo chữ ký (giống hệt lúc tạo link) để XÁC THỰC
  // Chú ý: accessKey không có trong IPN, ta phải lấy từ .env
  const accessKey = process.env.MOMO_ACCESS_KEY;
  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${process.env.MOMO_IPN_URL}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&redirectUrl=${process.env.MOMO_REDIRECT_URL}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
  
  const expectedSignature = crypto
    .createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');

  // 2. So sánh chữ ký
  if (signature !== expectedSignature) {
    console.error("MoMo IPN Signature Invalid!");
    // Báo lỗi cho MoMo, họ sẽ không gửi lại
    return res.status(400).json({ resultCode: 99, message: 'Invalid Signature' });
  }

  // 3. Xử lý Logic nghiệp vụ (Trừ kho, Xóa giỏ)
  // Chỉ xử lý khi thanh toán thành công (resultCode == 0)
  if (resultCode === 0) {
    console.log(`Thanh toán MoMo thành công cho đơn hàng (requestId): ${requestId}`);
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      // 3a. Tìm đơn hàng trong CSDL bằng MomoRequestId
      const orderResult = await client.query(
        'SELECT * FROM "Orders" WHERE "MomoRequestId" = $1 AND "Status" = $2',
        [requestId, 'pending'] // Chỉ tìm đơn hàng 'pending'
      );

      if (orderResult.rows.length === 0) {
        // Đơn hàng không tồn tại hoặc đã được xử lý
        console.warn(`MoMo IPN: Không tìm thấy đơn hàng ${requestId} hoặc đã xử lý.`);
        await client.query('ROLLBACK');
        // Vẫn trả 200 để MoMo không gửi lại
        return res.status(200).json({ resultCode: 0, message: 'Order processed or not found' });
      }

      const order = orderResult.rows[0];
      const orderId_internal = order.Id; // ID đơn hàng trong hệ thống
      const userId = order.UserId;

      // 3b. Lấy các sản phẩm trong đơn hàng
      const itemsResult = await client.query(
        'SELECT "ProductId", "Qty" FROM "OrderItems" WHERE "OrderId" = $1',
        [orderId_internal]
      );
      const orderItems = itemsResult.rows;

      // 3c. TRỪ KHO
      for (const item of orderItems) {
        await client.query(
          'UPDATE "Products" SET "Stock" = "Stock" - $1 WHERE "Id" = $2',
          [item.Qty, item.ProductId]
        );
      }
      
      // 3d. XÓA GIỎ HÀNG
      await client.query('DELETE FROM "CartItems" WHERE "UserId" = $1', [userId]);

      // 3e. CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG
      await client.query(
        'UPDATE "Orders" SET "Status" = $1, "MomoTransId" = $2 WHERE "Id" = $3',
        ['confirmed', transId.toString(), orderId_internal] // Chuyển sang 'confirmed'
      );
      
      await client.query('COMMIT');
      console.log(`Xử lý thành công đơn hàng ${orderId_internal} từ MoMo.`);
      
      // Trả về 200 cho MoMo (bắt buộc)
      return res.status(200).json({ resultCode: 0, message: 'Success' });

    } catch (error) {
      console.error("Lỗi khi xử lý IPN:", error);
      await client.query('ROLLBACK');
      // Trả 500 để MoMo biết và gửi lại IPN
      return res.status(500).json({ resultCode: 99, message: 'Server Error' });
    } finally {
      client.release();
    }
    
  } else {
    // Thanh toán thất bại (resultCode != 0)
    console.warn(`Thanh toán MoMo thất bại cho ${requestId}, resultCode: ${resultCode}`);
    // Cập nhật trạng thái đơn hàng (ví dụ: 'cancelled') (Tùy chọn)
    await db.query('UPDATE "Orders" SET "Status" = $1 WHERE "MomoRequestId" = $2', ['cancelled', requestId]);
    
    // Vẫn trả 200 cho MoMo
    return res.status(200).json({ resultCode: 0, message: 'Failed transaction logged' });
  }
};

module.exports = {
  handleMomoIPN
};