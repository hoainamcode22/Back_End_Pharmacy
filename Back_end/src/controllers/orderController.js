const db = require('../../db_config');

/**
 * @swagger
 * /api/orders/checkout:
 *   post:
 *     summary: Đặt hàng (Checkout)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               note:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *                 default: COD
 *     responses:
 *       201:
 *         description: Đặt hàng thành công
 */
const checkout = async (req, res) => {
  const client = await db.pool.connect();
  
  try {
    const userId = req.user.Id;
    const { address, phone, note = '', paymentMethod = 'COD' } = req.body;

    // Validate
    if (!address || !phone) {
      return res.status(400).json({ error: 'Thiếu địa chỉ hoặc số điện thoại!' });
    }

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

    // Kiểm tra tồn kho
    for (const item of cartResult.rows) {
      if (item.Stock < item.Qty) {
        await client.query('ROLLBACK');
        return res.status(400).json({ 
          error: `Sản phẩm "${item.ProductName}" không đủ số lượng trong kho!` 
        });
      }
    }

    // Tính tổng tiền
    const total = cartResult.rows.reduce((sum, item) => {
      return sum + (parseFloat(item.Price) * item.Qty);
    }, 0);

    // Tạo đơn hàng
    const orderQuery = `
      INSERT INTO "Orders" ("UserId", "Total", "Address", "Phone", "Note", "PaymentMethod", "Status")
      VALUES ($1, $2, $3, $4, $5, $6, 'pending')
      RETURNING "Id", "Code", "Total", "Status", "CreatedAt"
    `;

    const orderResult = await client.query(orderQuery, [
      userId, total, address, phone, note, paymentMethod
    ]);

    const order = orderResult.rows[0];

    // Thêm OrderItems (với snapshot sản phẩm)
    for (const item of cartResult.rows) {
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
        PaymentMethod: paymentMethod,
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

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Lấy danh sách đơn hàng của user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Lọc theo trạng thái (pending, confirmed, shipping, delivered, cancelled)
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng
 */
const getOrders = async (req, res) => {
  try {
    const userId = req.user.Id;
    const { status } = req.query;

    let query = `
      SELECT 
        o."Id",
        o."Code",
        o."Total",
        o."Status",
        o."Address",
        o."Phone",
        o."PaymentMethod",
        o."CreatedAt",
        COUNT(oi."Id") as "ItemsCount"
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

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Lấy chi tiết đơn hàng
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chi tiết đơn hàng
 */
const getOrderById = async (req, res) => {
  try {
    const userId = req.user.Id;
    const { id } = req.params;

    // Lấy thông tin đơn hàng
    const orderQuery = `
      SELECT 
        "Id", "Code", "Status", "Total", "Address", "Phone",
        "Note", "PaymentMethod", "ETA", "CreatedAt", "UpdatedAt"
      FROM "Orders"
      WHERE "Id" = $1 AND "UserId" = $2
    `;

    const orderResult = await db.query(orderQuery, [id, userId]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng!' });
    }

    const order = orderResult.rows[0];

    // Lấy chi tiết sản phẩm trong đơn
    const itemsQuery = `
      SELECT 
        "ProductId",
        "ProductName",
        "ProductImage",
        "Qty",
        "Price",
        ("Qty" * "Price") as "Subtotal"
      FROM "OrderItems"
      WHERE "OrderId" = $1
    `;

    const itemsResult = await db.query(itemsQuery, [id]);

    res.json({
      ...order,
      items: itemsResult.rows
    });

  } catch (error) {
    console.error('Lỗi getOrderById:', error);
    res.status(500).json({ error: 'Lỗi server khi lấy chi tiết đơn hàng!' });
  }
};

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   patch:
 *     summary: Hủy đơn hàng
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Đã hủy đơn hàng
 */
const cancelOrder = async (req, res) => {
  const client = await db.pool.connect();

  try {
    const userId = req.user.Id;
    const { id } = req.params;

    await client.query('BEGIN');

    // Kiểm tra đơn hàng
    const checkQuery = `
      SELECT "Id", "Status"
      FROM "Orders"
      WHERE "Id" = $1 AND "UserId" = $2
    `;

    const checkResult = await client.query(checkQuery, [id, userId]);

    if (checkResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng!' });
    }

    const currentStatus = checkResult.rows[0].Status;

    // Chỉ cho phép hủy đơn ở trạng thái pending
    if (currentStatus !== 'pending') {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        error: 'Chỉ có thể hủy đơn hàng đang chờ xác nhận!' 
      });
    }

    // Hoàn lại số lượng tồn kho
    const itemsQuery = `
      SELECT "ProductId", "Qty"
      FROM "OrderItems"
      WHERE "OrderId" = $1
    `;

    const itemsResult = await client.query(itemsQuery, [id]);

    for (const item of itemsResult.rows) {
      await client.query(
        'UPDATE "Products" SET "Stock" = "Stock" + $1 WHERE "Id" = $2',
        [item.Qty, item.ProductId]
      );
    }

    // Cập nhật trạng thái đơn hàng
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
