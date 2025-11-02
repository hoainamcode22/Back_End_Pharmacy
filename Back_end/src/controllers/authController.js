const db = require("../../db_config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";
const TOKEN_EXPIRES = "1d";

// Helper query
const dbQuery = async (sql, params) => {
  if (db?.query) return db.query(sql, params);
  if (db?.pool?.query) return db.pool.query(sql, params);
  throw new Error("DB chưa export đúng, không tìm thấy query");
};

// Tạo token - Dùng Id và Role (PascalCase) để đồng bộ với controllers
const generateToken = (id, role) =>
  jwt.sign({ Id: id, Role: role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });

// Loại bỏ password khi trả về
const excludePassword = ({ Password, ...user }) => user;

// Kiểm tra tồn tại
const checkExists = async (field, value) => {
  const result = await dbQuery(
    `SELECT "Id" FROM public."Users" WHERE "${field}"=$1`,
    [value]
  );
  return result.rows.length > 0;
};

// ================= REGISTER =================
const registerUser = async (req, res) => {
  try {
    let { username, fullname, email, phone, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Thiếu email hoặc mật khẩu" });

    email = email.toLowerCase().trim();

    if (await checkExists("Email", email))
      return res.status(400).json({ message: "Email đã tồn tại" });

    const hashed = await bcrypt.hash(password, 10);
    const finalUsername = username?.trim() || email.split("@")[0];

    const sql = `
      INSERT INTO public."Users" ("Username","Password","Fullname","Email","Phone","Role")
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *;
    `;
    const result = await dbQuery(sql, [
      finalUsername,
      hashed,
      fullname || "(Chưa cập nhật)",
      email,
      phone || null,
      "customer",
    ]);
    const user = result.rows[0];

    res.status(201).json({
      message: "Đăng ký thành công",
      user: excludePassword(user),
      token: generateToken(user.Id, user.Role),
    });
  } catch (err) {
    console.error("❌ Lỗi register:", err);
    res.status(500).json({ message: "Lỗi server khi đăng ký" });
  }
};

// ================= LOGIN =================
const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Thiếu email hoặc mật khẩu" });

    email = email.toLowerCase().trim();

    const result = await dbQuery(
      'SELECT * FROM public."Users" WHERE LOWER("Email")=$1',
      [email]
    );

    if (!result.rows.length)
      return res.status(401).json({ message: "Email hoặc mật khẩu không chính xác" });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.Password);

    if (!isMatch)
      return res.status(401).json({ message: "Email hoặc mật khẩu không chính xác" });

    res.status(200).json({
      message: "Đăng nhập thành công",
      token: generateToken(user.Id, user.Role),
      user: {
        id: user.Id,
        username: user.Username,
        fullname: user.Fullname,
        email: user.Email,
        role: user.Role,
      },
    });
  } catch (err) {
    console.error("❌ Lỗi login:", err);
    res.status(500).json({ message: "Lỗi server khi đăng nhập" });
  }
};

// ================= CREATE ADMIN =================
const createAdmin = async (req, res) => {
  try {
    let { email, password, fullname } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Thiếu email hoặc mật khẩu" });

    email = email.toLowerCase().trim();

    if (await checkExists("Role", "admin"))
      return res.status(409).json({ message: "Admin đã tồn tại" });

    const hashed = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO public."Users" ("Username","Password","Fullname","Email","Phone","Role")
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *;
    `;
    const result = await dbQuery(sql, [
      "admin",
      hashed,
      fullname || "Quản trị viên",
      email,
      null,
      "admin",
    ]);

    const admin = result.rows[0];
    res.status(201).json({
      message: "Admin đã tạo",
      admin: excludePassword(admin),
      token: generateToken(admin.Id, admin.Role),
    });
  } catch (err) {
    console.error("❌ Lỗi createAdmin:", err);
    res.status(500).json({ message: "Lỗi server khi tạo admin" });
  }
};

module.exports = { registerUser, loginUser, createAdmin };
