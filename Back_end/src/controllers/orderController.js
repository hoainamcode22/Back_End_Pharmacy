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

    // ✅ Lưu thông tin người nhận (tùy chọn): sử dụng SAVEPOINT để tránh làm hỏng transaction
    // Nếu bảng OrderRecipients chưa tồn tại, ta rollback về savepoint và tiếp tục bình thường
    await client.query('SAVEPOINT sp_recipients');
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
      // Rollback về savepoint để không làm hỏng transaction chính
      await client.query('ROLLBACK TO SAVEPOINT sp_recipients');
      console.warn('⚠️ Bỏ qua lưu OrderRecipients (bảng có thể chưa tồn tại)');
    } finally {
      await client.query('RELEASE SAVEPOINT sp_recipients');
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
      order: {
        Id: order.Id,
        Code: order.Code,
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

/**
 * ============== ADMIN FUNCTIONS ==============
 */

/**
 * @swagger
 * /api/orders/admin/all:
 *   get:
 *     summary: Lấy tất cả đơn hàng (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Lọc theo trạng thái (pending, confirmed, shipping, delivered, cancelled)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng
 */
const getAllOrders = async (req, res) => {
  try {
    // Check admin role
    if (req.user.Role !== 'admin') {
      return res.status(403).json({ error: 'Chỉ admin mới có quyền truy cập!' });
    }

    const { status, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    // Build query
    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;

    if (status) {
      whereConditions.push(`o."Status" = $${paramIndex}`);
      queryParams.push(status);
      paramIndex++;
    }

    if (search) {
      whereConditions.push(`(
        LOWER(u."Fullname") LIKE LOWER($${paramIndex}) OR 
        LOWER(u."Email") LIKE LOWER($${paramIndex}) OR 
        o."Code" LIKE $${paramIndex}
      )`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    // Count total
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM "Orders" o
      LEFT JOIN "Users" u ON o."UserId" = u."Id"
      ${whereClause}
    `;
    const countResult = await db.query(countQuery, queryParams);
    const totalItems = parseInt(countResult.rows[0].total);

    // Get orders
    queryParams.push(limit, offset);
    const ordersQuery = `
      SELECT 
        o."Id", o."Code", o."UserId", o."Total", o."Status", 
        o."Address", o."Phone", o."PaymentMethod", o."CreatedAt", o."UpdatedAt",
        u."Fullname" as "CustomerName",
        u."Email" as "CustomerEmail",
        COUNT(oi."Id") as "ItemsCount"
      FROM "Orders" o
      LEFT JOIN "Users" u ON o."UserId" = u."Id"
      LEFT JOIN "OrderItems" oi ON o."Id" = oi."OrderId"
      ${whereClause}
      GROUP BY o."Id", u."Id"
      ORDER BY o."CreatedAt" DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const result = await db.query(ordersQuery, queryParams);

    res.json({
      orders: result.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalItems / limit),
        totalItems: totalItems,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Lỗi getAllOrders:', error);
    res.status(500).json({ error: 'Lỗi server khi lấy danh sách đơn hàng!' });
  }
};

/**
 * @swagger
 * /api/orders/admin/:id:
 *   get:
 *     summary: Lấy chi tiết đơn hàng (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chi tiết đơn hàng
 */
const getOrderByIdAdmin = async (req, res) => {
  try {
    // Check admin role
    if (req.user.Role !== 'admin') {
      return res.status(403).json({ error: 'Chỉ admin mới có quyền truy cập!' });
    }

    const { id } = req.params;

    const orderQuery = `
      SELECT 
        o.*,
        u."Id" as "CustomerId",
        u."Fullname" as "CustomerName",
        u."Email" as "CustomerEmail",
        u."Phone" as "CustomerPhone"
      FROM "Orders" o
      LEFT JOIN "Users" u ON o."UserId" = u."Id"
      WHERE o."Id" = $1
    `;
    const orderResult = await db.query(orderQuery, [id]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng!' });
    }

    const order = orderResult.rows[0];

    const itemsQuery = `
      SELECT 
        "ProductId", "ProductName", "ProductImage", 
        "Qty", "Price", ("Qty" * "Price") as "Subtotal"
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

    res.json({ 
      ...order, 
      items: itemsWithAbsoluteUrls 
    });

  } catch (error) {
    console.error('Lỗi getOrderByIdAdmin:', error);
    res.status(500).json({ error: 'Lỗi server khi lấy chi tiết đơn hàng!' });
  }
};

/**
 * @swagger
 * /api/orders/admin/:id/status:
 *   patch:
 *     summary: Cập nhật trạng thái đơn hàng (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, shipping, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
const updateOrderStatus = async (req, res) => {
  try {
    // Check admin role
    if (req.user.Role !== 'admin') {
      return res.status(403).json({ error: 'Chỉ admin mới có quyền cập nhật!' });
    }

    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Trạng thái không hợp lệ! Các trạng thái hợp lệ: ' + validStatuses.join(', ')
      });
    }

    const query = `
      UPDATE "Orders"
      SET "Status" = $1, "UpdatedAt" = NOW()
      WHERE "Id" = $2
      RETURNING "Id", "Code", "Status"
    `;

    const result = await db.query(query, [status, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng!' });
    }

    res.json({ 
      message: 'Đã cập nhật trạng thái đơn hàng!',
      order: result.rows[0]
    });

  } catch (error) {
    console.error('Lỗi updateOrderStatus:', error);
    res.status(500).json({ error: 'Lỗi server khi cập nhật trạng thái!' });
  }
};

/**
 * @swagger
 * /api/orders/admin/statistics:
 *   get:
 *     summary: Thống kê đơn hàng (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thống kê đơn hàng
 */
const getOrderStatistics = async (req, res) => {
  try {
    // Check admin role
    if (req.user.Role !== 'admin') {
      return res.status(403).json({ error: 'Chỉ admin mới có quyền truy cập!' });
    }

    // Get statistics
    const stats = await Promise.all([
      // Total orders
      db.query('SELECT COUNT(*) as total FROM "Orders"'),
      
      // Orders by status
      db.query(`
        SELECT "Status", COUNT(*) as count
        FROM "Orders"
        GROUP BY "Status"
      `),
      
      // Total revenue (delivered orders only)
      db.query(`
        SELECT SUM("Total") as revenue
        FROM "Orders"
        WHERE "Status" = 'delivered'
      `),
      
      // Orders today
      db.query(`
        SELECT COUNT(*) as today
        FROM "Orders"
        WHERE DATE("CreatedAt") = CURRENT_DATE
      `),
      
      // Orders this month
      db.query(`
        SELECT COUNT(*) as this_month
        FROM "Orders"
        WHERE EXTRACT(MONTH FROM "CreatedAt") = EXTRACT(MONTH FROM CURRENT_DATE)
        AND EXTRACT(YEAR FROM "CreatedAt") = EXTRACT(YEAR FROM CURRENT_DATE)
      `),
      
      // Revenue this month
      db.query(`
        SELECT SUM("Total") as revenue_month
        FROM "Orders"
        WHERE "Status" = 'delivered'
        AND EXTRACT(MONTH FROM "CreatedAt") = EXTRACT(MONTH FROM CURRENT_DATE)
        AND EXTRACT(YEAR FROM "CreatedAt") = EXTRACT(YEAR FROM CURRENT_DATE)
      `)
    ]);

    const statusCounts = {};
    stats[1].rows.forEach(row => {
      statusCounts[row.Status] = parseInt(row.count);
    });

    res.json({
      totalOrders: parseInt(stats[0].rows[0].total),
      byStatus: statusCounts,
      totalRevenue: parseFloat(stats[2].rows[0].revenue || 0),
      ordersToday: parseInt(stats[3].rows[0].today),
      ordersThisMonth: parseInt(stats[4].rows[0].this_month),
      revenueThisMonth: parseFloat(stats[5].rows[0].revenue_month || 0)
    });

  } catch (error) {
    console.error('Lỗi getOrderStatistics:', error);
    res.status(500).json({ error: 'Lỗi server khi lấy thống kê!' });
  }
};

module.exports = { 
  checkout, 
  getOrders, 
  getOrderById, 
  cancelOrder,
  // Admin functions
  getAllOrders,
  getOrderByIdAdmin,
  updateOrderStatus,
  getOrderStatistics
};
