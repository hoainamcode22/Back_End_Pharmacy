require('dotenv').config();
const { Pool } = require('pg');

// Tạo Pool kết nối PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',         // từ .env
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'pharmacy_db',  // chú ý trùng DB_NAME trong .env
  password: process.env.DB_PASS || '2208',         // phải là string
  port: parseInt(process.env.DB_PORT, 10) || 5432,
});

// Kiểm tra kết nối ngay khi khởi động
pool.connect()
  .then(() => console.log('✅ Connected to PostgreSQL database!'))
  .catch(err => {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  });

// Xuất query function và pool
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
