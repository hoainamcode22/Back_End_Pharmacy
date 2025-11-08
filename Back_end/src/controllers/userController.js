const db = require('../../db_config');
const bcrypt = require('bcryptjs');

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Lấy thông tin cá nhân
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin user
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user.Id;

    const query = `
      SELECT 
        "Id", "Username", "Fullname", "Email", 
        "Phone", "Address", "Role", "Avatar", "CreatedAt"
      FROM "Users"
      WHERE "Id" = $1
    `;

    const result = await db.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy thông tin người dùng!' });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Lỗi getProfile:', error);
    res.status(500).json({ error: 'Lỗi server khi lấy thông tin cá nhân!' });
  }
};

/**
 * @swagger
 * /api/users/me:
 *   patch:
 *     summary: Cập nhật thông tin cá nhân
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.Id;
    const { fullname, phone, address, avatar } = req.body;

    // Build query động
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (fullname !== undefined) {
      updates.push(`"Fullname" = $${paramIndex}`);
      values.push(fullname);
      paramIndex++;
    }

    if (phone !== undefined) {
      updates.push(`"Phone" = $${paramIndex}`);
      values.push(phone);
      paramIndex++;
    }

    if (address !== undefined) {
      updates.push(`"Address" = $${paramIndex}`);
      values.push(address);
      paramIndex++;
    }

    // Thêm avatar (base64)
    if (avatar !== undefined) {
      updates.push(`"Avatar" = $${paramIndex}`);
      values.push(avatar);
      paramIndex++;
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Không có thông tin để cập nhật!' });
    }

    values.push(userId);

    const query = `
      UPDATE "Users"
      SET ${updates.join(', ')}, "UpdatedAt" = NOW()
      WHERE "Id" = $${paramIndex}
      RETURNING "Id", "Fullname", "Phone", "Address", "Avatar"
    `;

    const result = await db.query(query, values);

    res.json({
      message: 'Cập nhật thông tin thành công!',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Lỗi updateProfile:', error);
    res.status(500).json({ error: 'Lỗi server khi cập nhật thông tin!' });
  }
};

/**
 * @swagger
 * /api/users/change-password:
 *   patch:
 *     summary: Đổi mật khẩu
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 */
const changePassword = async (req, res) => {
  try {
    const userId = req.user.Id;
    const { currentPassword, newPassword } = req.body;

    // Validate
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Thiếu thông tin mật khẩu!' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Mật khẩu mới phải có ít nhất 6 ký tự!' });
    }

    // Lấy mật khẩu hiện tại
    const query = 'SELECT "Password" FROM "Users" WHERE "Id" = $1';
    const result = await db.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng!' });
    }

    // Kiểm tra mật khẩu hiện tại
    const isMatch = await bcrypt.compare(currentPassword, result.rows[0].Password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Mật khẩu hiện tại không đúng!' });
    }

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu
    await db.query(
      'UPDATE "Users" SET "Password" = $1, "UpdatedAt" = NOW() WHERE "Id" = $2',
      [hashedPassword, userId]
    );

    res.json({ message: 'Đổi mật khẩu thành công!' });

  } catch (error) {
    console.error('Lỗi changePassword:', error);
    res.status(500).json({ error: 'Lỗi server khi đổi mật khẩu!' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword
};
