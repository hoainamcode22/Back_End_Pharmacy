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

// Tạo token
const generateToken = (id, role) => jwt.sign({ id, role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });

// ====================
// Register
// ====================
const registerUser = async (req, res) => {
  try {
    const { username, fullname, email, phone, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Thiếu email hoặc mật khẩu" });

    const exist = await dbQuery('SELECT "Id" FROM "USERS" WHERE "Email"=$1', [email]);
    if (exist.rows.length) return res.status(400).json({ message: "Email đã tồn tại" });

    const hashed = await bcrypt.hash(password, 10);
    const finalUsername = username?.trim() || email.split("@")[0];

    const sql = `INSERT INTO "USERS" ("Username","Password","Fullname","Email","Phone","Role")
                 VALUES ($1,$2,$3,$4,$5,$6)
                 RETURNING *`;
    const result = await dbQuery(sql, [finalUsername, hashed, fullname||null, email, phone||null, "user"]);
    const user = result.rows[0];

    return res.status(201).json({ message: "Đăng ký thành công", user, token: generateToken(user.Id, user.Role) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Lỗi server khi đăng ký" });
  }
};

// ====================
// Login
// ====================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Thiếu email hoặc mật khẩu" });

    const q = await dbQuery('SELECT * FROM "USERS" WHERE "Email"=$1', [email]);
    if (!q.rows.length) return res.status(401).json({ message: "Email hoặc mật khẩu không chính xác" });

    const user = q.rows[0];
    if (!(await bcrypt.compare(password, user.Password)))
      return res.status(401).json({ message: "Email hoặc mật khẩu không chính xác" });

    return res.status(200).json({
      message: "Đăng nhập thành công",
      token: generateToken(user.Id, user.Role),
      user: { id: user.Id, username: user.Username, fullname: user.Fullname, email: user.Email, role: user.Role },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Lỗi server khi đăng nhập" });
  }
};

// ====================
// Create Admin
// ====================
const createAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Thiếu email hoặc mật khẩu" });

    const exist = await dbQuery('SELECT "Id" FROM "USERS" WHERE "Role"=$1', ["admin"]);
    if (exist.rows.length) return res.status(409).json({ message: "Admin đã tồn tại" });

    const hashed = await bcrypt.hash(password, 10);
    const sql = `INSERT INTO "USERS" ("Username","Password","Fullname","Email","Phone","Role")
                 VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`;
    const r = await dbQuery(sql, ["admin", hashed, "Quản trị viên", email, null, "admin"]);
    const admin = r.rows[0];

    return res.status(201).json({ message: "Admin đã tạo", admin, token: generateToken(admin.Id, admin.Role) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Lỗi server khi tạo admin" });
  }
};

module.exports = { registerUser, loginUser, createAdmin };
