const db = require('../../db_config');

// Helper: map phương thức thanh toán
const mapPaymentMethod = (method) => {
  const lowerMethod = String(method || '').toLowerCase();
  if (lowerMethod === 'bank' || lowerMethod === 'banking') return 'Banking';
  if (lowerMethod === 'momo') return 'Momo';
  return 'COD';
};

// =================== CHECKOUT ===================
const checkout = async (req, res) => {
  const client = await db.pool.connect();

  try {
    const userId = req.user.Id;
    const {
      fullName = '',
      email = '',
      address = '',
      phone = '',
      note = '',
      city = '',
      district = '',
      ward = '',
      paymentMethod = 'COD'
    } = req.body;

    // Validate cơ bản
    if (!address || !phone) {
      return res.status(400).json({ error: 'Thiếu địa chỉ hoặc số điện thoại!' });
    }

    // Build địa chỉ đầy đủ
    const fullAddress = `${address}, ${ward || ''}, ${district || ''}, ${city || ''}`
      .replace(/(,\s*)+/g, ', ')
      .trim();

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

    // Xử lý từng item
    const itemsWithUrls = [];
    let subtotal = 0;

    for (const item of cartResult.rows) {
      if (item.Stock < item.Qty) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          error: `Sản phẩm "${item.ProductName}" không đủ số lượng trong kho!`
        });
      }

      // ✅ build URL ảnh đúng tuyệt đối, không đổi logic
      let imageUrl = `${baseUrl}/images/default.jpg`;
      const img = item.ProductImage;
      if (img) {
        if (img.startsWith('http')) imageUrl = img;
        else imageUrl = `${baseUrl}/images/${img.replace(/^\/+/, '')}`;
      }

      itemsWithUrls.push({
        ...item,
        ProductImage: imageUrl
      });

      subtotal += parseFloat(item.Price) * item.Qty;
    }

    const shippingFee = 30000;
    const finalTotal = subtotal + shippingFee;
    const dbPaymentMethod = mapPaymentMethod(paymentMethod);

    // ✅ Tạo đơn hàng
    const orderQuery = `
      INSERT INTO "Orders" 
        ("UserId", "Total", "Address", "Phone", "Note", "PaymentMethod", "Status", "CreatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, 'pending', NOW())
      RETURNING "Id", "Total", "Status", "CreatedAt"
    `;
    const orderResult = await client.query(orderQuery, [
      userId, finalTotal, fullAddress, phone, note, dbPaymentMethod
    ]);
    const order = orderResult.rows[0];

    // ✅ Lưu thông tin người nhận (chỉ khi bảng OrderRecipients tồn tại)
    try {
      await client.query(`
        INSERT INTO "OrderRecipients"
        ("OrderId", "FullName", "Email", "Phone", "Address", "City", "District", "Ward")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        order.Id,
        fullName || '(Chưa nhập)',
        email || null,
        phone,
        address,
        city,
        district,
        ward
      ]);
    } catch (e) {
      console.warn('⚠️ Bỏ qua lưu OrderRecipients (bảng có thể chưa tồn tại)');
    }

    // ✅ Thêm OrderItems
    for (const item of itemsWithUrls) {
      await client.query(`
        INSERT INTO "OrderItems" 
        ("OrderId", "ProductId", "ProductName", "ProductImage", "Qty", "Price")
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [order.Id, item.ProductId, item.ProductName, item.ProductImage, item.Qty, item.Price]);

      // Cập nhật kho
      await client.query(
        'UPDATE "Products" SET "Stock" = "Stock" - $1 WHERE "Id" = $2',
        [item.Qty, item.ProductId]
      );
    }

    // ✅ Xóa giỏ hàng
    await client.query('DELETE FROM "CartItems" WHERE "UserId" = $1', [userId]);

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Đặt hàng thành công!',
      order: {
        Id: order.Id,
        Total: order.Total,
        Status: order.Status,
        Address: fullAddress,
        Phone: phone,
        PaymentMethod: dbPaymentMethod,
        CreatedAt: order.CreatedAt
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Lỗi checkout:', error);
    res.status(500).json({ error: 'Lỗi server khi đặt hàng!' });
  } finally {
    client.release();
  }
};

// =================== GET ORDERS ===================
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

// =================== GET ORDER BY ID ===================
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

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const itemsWithAbsoluteUrls = itemsResult.rows.map(item => {
      const imageUrl = item.ProductImage?.startsWith('http')
        ? item.ProductImage
        : `${baseUrl}/images/${item.ProductImage?.replace(/^\/+/, '') || 'default.jpg'}`;
      return { ...item, ProductImage: imageUrl };
    });

    res.json({ ...order, items: itemsWithAbsoluteUrls });
  } catch (error) {
    console.error('Lỗi getOrderById:', error);
    res.status(500).json({ error: 'Lỗi server khi lấy chi tiết đơn hàng!' });
  }
};

// =================== CANCEL ORDER ===================
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

module.exports = { checkout, getOrders, getOrderById, cancelOrder };
