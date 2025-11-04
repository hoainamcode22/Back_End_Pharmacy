const db = require('../../db_config');

// THAY ĐỔI 1: Thêm hàm helper để map giá trị
const mapPaymentMethod = (method) => {
  const lowerMethod = String(method).toLowerCase();
  if (lowerMethod === 'bank' || lowerMethod === 'banking') return 'Banking';
  if (lowerMethod === 'momo') return 'Momo';
  return 'COD'; // Mặc định là COD
};

// Checkout - Đặt hàng
const checkout = async (req, res) => {
  const client = await db.pool.connect();
  
  try {
    const userId = req.user.Id;
    const { address, phone, note = '', paymentMethod = 'COD' } = req.body;

    // Validate
    if (!address || !phone) {
      return res.status(400).json({ error: 'Thiếu địa chỉ hoặc số điện thoại!' });
    }

    // Lấy Origin của backend
    const host = req.get('host');
    const protocol = req.protocol;
    const baseUrl = `${protocol}://${host}`; 

    await client.query('BEGIN');

    // Lấy giỏ hàng
    const cartQuery = `
      SELECT 
        ci."Id" as "CartItemId",
        ci."ProductId",
        ci."Qty",
        p."Name" as "ProductName",
        p."Image" as "ProductImage",
        p."Price",
        p."Stock"
      FROM "CartItems" ci
      JOIN "Products" p ON ci."ProductId" = p."Id"
      WHERE ci."UserId" = $1
    `;

    const cartResult = await client.query(cartQuery, [userId]);

    if (cartResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Giỏ hàng trống!' });
    }

    const itemsWithUrls = [];
    let subtotal = 0;

    for (const item of cartResult.rows) {
      // Kiểm tra tồn kho
      if (item.Stock < item.Qty) {
        await client.query('ROLLBACK');
        return res.status(400).json({ 
          error: `Sản phẩm "${item.ProductName}" không đủ số lượng trong kho!` 
        });
      }

      // Tạo URL ảnh tuyệt đối
      const imageUrl = item.ProductImage.startsWith('/') 
        ? item.ProductImage 
        : `/${item.ProductImage}`;
      const absoluteImageUrl = `${baseUrl}${imageUrl}`;
      
      itemsWithUrls.push({
        ...item,
        ProductImageUrl: absoluteImageUrl
      });

      subtotal += parseFloat(item.Price) * item.Qty;
    }

    // Tính tổng cuối cùng (bao gồm ship)
    const shippingFee = 30000;
    const finalTotal = subtotal + shippingFee;

    // THAY ĐỔI 2: Sử dụng hàm helper để lấy giá trị đúng
    const dbPaymentMethod = mapPaymentMethod(paymentMethod);

    // Tạo đơn hàng
    const orderQuery = `
      INSERT INTO "Orders" ("UserId", "Total", "Address", "Phone", "Note", "PaymentMethod", "Status")
      VALUES ($1, $2, $3, $4, $5, $6, 'pending')
      RETURNING "Id", "Code", "Total", "Status", "CreatedAt"
    `;

    const orderResult = await client.query(orderQuery, [
      userId, finalTotal, address, phone, note, dbPaymentMethod // Sử dụng giá trị đã map
    ]);

    const order = orderResult.rows[0];

    // Thêm OrderItems
    for (const item of itemsWithUrls) {
      await client.query(`
        INSERT INTO "OrderItems" ("OrderId", "ProductId", "ProductName", "ProductImage", "Qty", "Price")
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [order.Id, item.ProductId, item.ProductName, item.ProductImage, item.Qty, item.Price]); 

      // Trừ số lượng tồn kho
      await client.query(
        'UPDATE "Products" SET "Stock" = "Stock" - $1 WHERE "Id" = $2',
        [item.Qty, item.ProductId]
      );
    }

    // Xóa giỏ hàng
    await client.query('DELETE FROM "CartItems" WHERE "UserId" = $1', [userId]);

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Đặt hàng thành công!',
      order: {
        Id: order.Id,
        Code: order.Code,
        Total: order.Total,
        Status: order.Status,
        Address: address,
        Phone: phone,
        PaymentMethod: dbPaymentMethod,
        CreatedAt: order.CreatedAt
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Lỗi checkout:', error); // Dòng này đã in ra lỗi cho bạn
    res.status(500).json({ error: 'Lỗi server khi đặt hàng!' });
  } finally {
    client.release();
  }
};

/* --- CÁC HÀM KHÁC (getOrders, getOrderById, cancelOrder) --- */
/* (Giữ nguyên các hàm getOrders, getOrderById, cancelOrder như file cũ) */
/* (Copy 3 hàm đó từ file cũ của bạn dán vào đây) */
/* (Nếu bạn không chắc, mình sẽ gửi lại cả 3 hàm đó) */

// Lấy danh sách đơn hàng
const getOrders = async (req, res) => {
  try {
    const userId = req.user.Id;
    const { status } = req.query;

    let query = `
      SELECT 
        o."Id", o."Code", o."Total", o."Status", o."Address", o."Phone",
        o."PaymentMethod", o."CreatedAt", COUNT(oi."Id") as "ItemsCount"
      FROM "Orders" o
      LEFT JOIN "OrderItems" oi ON o."Id" = oi."OrderId"
      WHERE o."UserId" = $1
    `;
    const params = [userId];
    if (status) {
      query += ` AND o."Status" = $2`;
      params.push(status);
    }
    query += ` GROUP BY o."Id" ORDER BY o."CreatedAt" DESC`;
    const result = await db.query(query, params);
    res.json({ orders: result.rows });
  } catch (error) {
    console.error('Lỗi getOrders:', error);
    res.status(500).json({ error: 'Lỗi server khi lấy danh sách đơn hàng!' });
  }
};

// Lấy chi tiết đơn hàng
const getOrderById = async (req, res) => {
  try {
    const userId = req.user.Id;
    const { id } = req.params;
    const orderQuery = `
      SELECT "Id", "Code", "Status", "Total", "Address", "Phone",
             "Note", "PaymentMethod", "ETA", "CreatedAt", "UpdatedAt"
      FROM "Orders"
      WHERE "Id" = $1 AND "UserId" = $2
    `;
    const orderResult = await db.query(orderQuery, [id, userId]);
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng!' });
    }
    const order = orderResult.rows[0];
    const itemsQuery = `
      SELECT "ProductId", "ProductName", "ProductImage", "Qty", "Price", ("Qty" * "Price") as "Subtotal"
      FROM "OrderItems"
      WHERE "OrderId" = $1
    `;
    const itemsResult = await db.query(itemsQuery, [id]);
    res.json({ ...order, items: itemsResult.rows });
  } catch (error) {
    console.error('Lỗi getOrderById:', error);
    res.status(500).json({ error: 'Lỗi server khi lấy chi tiết đơn hàng!' });
  }
};

// Hủy đơn hàng
const cancelOrder = async (req, res) => {
  const client = await db.pool.connect();
  try {
    const userId = req.user.Id;
    const { id } = req.params;
    await client.query('BEGIN');
    const checkQuery = `SELECT "Id", "Status" FROM "Orders" WHERE "Id" = $1 AND "UserId" = $2`;
    const checkResult = await client.query(checkQuery, [id, userId]);
    if (checkResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng!' });
    }
    const currentStatus = checkResult.rows[0].Status;
    if (currentStatus !== 'pending') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Chỉ có thể hủy đơn hàng đang chờ xác nhận!' });
    }
    const itemsQuery = `SELECT "ProductId", "Qty" FROM "OrderItems" WHERE "OrderId" = $1`;
    const itemsResult = await client.query(itemsQuery, [id]);
    for (const item of itemsResult.rows) {
      await client.query(
        'UPDATE "Products" SET "Stock" = "Stock" + $1 WHERE "Id" = $2',
        [item.Qty, item.ProductId]
      );
    }
    await client.query(
      'UPDATE "Orders" SET "Status" = $1 WHERE "Id" = $2',
      ['cancelled', id]
    );
    await client.query('COMMIT');
    res.json({ message: 'Đã hủy đơn hàng thành công!' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Lỗi cancelOrder:', error);
    res.status(500).json({ error: 'Lỗi server khi hủy đơn hàng!' });
  } finally {
    client.release();
  }
};

module.exports = {
  checkout,
  getOrders,
  getOrderById,
  cancelOrder
};