const db = require('../../db_config');

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Lấy giỏ hàng của user
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Giỏ hàng của user
 */
const getCart = async (req, res) => {
  try {
    const userId = req.user.Id;

    const query = `
      SELECT 
        ci."Id",
        ci."ProductId",
        ci."Qty",
        p."Name" as "ProductName",
        p."Image" as "ProductImage",
        p."Price",
        (ci."Qty" * p."Price") as "Subtotal"
      FROM "CartItems" ci
      JOIN "Products" p ON ci."ProductId" = p."Id"
      WHERE ci."UserId" = $1
      ORDER BY ci."Id" DESC
    `;

    const result = await db.query(query, [userId]);

    // Tính tổng tiền
    const total = result.rows.reduce((sum, item) => sum + parseFloat(item.Subtotal), 0);

    res.json({
      cartItems: result.rows,
      total: total
    });

  } catch (error) {
    console.error('Lỗi getCart:', error);
    res.status(500).json({ error: 'Lỗi server khi lấy giỏ hàng!' });
  }
};

/**
 * @swagger
 * /api/cart/items:
 *   post:
 *     summary: Thêm sản phẩm vào giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *               qty:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Đã thêm vào giỏ hàng
 */
const addToCart = async (req, res) => {
  try {
    const userId = req.user.Id;
    const { productId, qty = 1 } = req.body;

    // Validate
    if (!productId) {
      return res.status(400).json({ error: 'Thiếu thông tin sản phẩm!' });
    }

    // Kiểm tra sản phẩm tồn tại
    const productCheck = await db.query(
      'SELECT "Id", "Stock" FROM "Products" WHERE "Id" = $1 AND "IsActive" = true',
      [productId]
    );

    if (productCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Sản phẩm không tồn tại!' });
    }

    // Kiểm tra tồn kho
    if (productCheck.rows[0].Stock < qty) {
      return res.status(400).json({ error: 'Sản phẩm không đủ số lượng trong kho!' });
    }

    // Kiểm tra sản phẩm đã có trong giỏ chưa
    const existingItem = await db.query(
      'SELECT "Id", "Qty" FROM "CartItems" WHERE "UserId" = $1 AND "ProductId" = $2',
      [userId, productId]
    );

    if (existingItem.rows.length > 0) {
      // Update số lượng nếu đã có
      const newQty = existingItem.rows[0].Qty + qty;
      
      await db.query(
        'UPDATE "CartItems" SET "Qty" = $1 WHERE "Id" = $2',
        [newQty, existingItem.rows[0].Id]
      );

      return res.json({ 
        message: 'Đã cập nhật số lượng trong giỏ hàng!',
        cartItemId: existingItem.rows[0].Id
      });
    }

    // Thêm mới vào giỏ
    const insertQuery = `
      INSERT INTO "CartItems" ("UserId", "ProductId", "Qty")
      VALUES ($1, $2, $3)
      RETURNING "Id"
    `;

    const result = await db.query(insertQuery, [userId, productId, qty]);

    res.json({ 
      message: 'Đã thêm vào giỏ hàng!',
      cartItemId: result.rows[0].Id
    });

  } catch (error) {
    console.error('Lỗi addToCart:', error);
    res.status(500).json({ error: 'Lỗi server khi thêm vào giỏ hàng!' });
  }
};

/**
 * @swagger
 * /api/cart/items/{id}:
 *   patch:
 *     summary: Cập nhật số lượng sản phẩm trong giỏ
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               qty:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Đã cập nhật giỏ hàng
 */
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.Id;
    const { id } = req.params;
    const { qty } = req.body;

    if (!qty || qty < 1) {
      return res.status(400).json({ error: 'Số lượng không hợp lệ!' });
    }

    // Kiểm tra cart item thuộc user
    const checkQuery = `
      SELECT ci."Id", ci."ProductId", p."Stock"
      FROM "CartItems" ci
      JOIN "Products" p ON ci."ProductId" = p."Id"
      WHERE ci."Id" = $1 AND ci."UserId" = $2
    `;
    
    const checkResult = await db.query(checkQuery, [id, userId]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm trong giỏ hàng!' });
    }

    // Kiểm tra tồn kho
    if (checkResult.rows[0].Stock < qty) {
      return res.status(400).json({ error: 'Sản phẩm không đủ số lượng trong kho!' });
    }

    // Update số lượng
    await db.query(
      'UPDATE "CartItems" SET "Qty" = $1 WHERE "Id" = $2',
      [qty, id]
    );

    res.json({ message: 'Đã cập nhật giỏ hàng!' });

  } catch (error) {
    console.error('Lỗi updateCartItem:', error);
    res.status(500).json({ error: 'Lỗi server khi cập nhật giỏ hàng!' });
  }
};

/**
 * @swagger
 * /api/cart/items/{id}:
 *   delete:
 *     summary: Xóa sản phẩm khỏi giỏ hàng
 *     tags: [Cart]
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
 *         description: Đã xóa khỏi giỏ hàng
 */
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.Id;
    const { id } = req.params;

    // Kiểm tra cart item thuộc user
    const checkResult = await db.query(
      'SELECT "Id" FROM "CartItems" WHERE "Id" = $1 AND "UserId" = $2',
      [id, userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm trong giỏ hàng!' });
    }

    // Xóa
    await db.query('DELETE FROM "CartItems" WHERE "Id" = $1', [id]);

    res.json({ message: 'Đã xóa khỏi giỏ hàng!' });

  } catch (error) {
    console.error('Lỗi removeFromCart:', error);
    res.status(500).json({ error: 'Lỗi server khi xóa khỏi giỏ hàng!' });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart
};
