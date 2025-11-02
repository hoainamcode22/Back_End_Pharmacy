require('dotenv').config();
const { Pool } = require('pg');

// Tạo Pool kết nối PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'pharmacy_db',
  password: process.env.DB_PASS || '2208',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  options: '-c search_path=public'   
});

// Kiểm tra kết nối ngay khi khởi động
pool.connect()
  .then(() => console.log('✅ Connected to PostgreSQL database!'))
  .catch(err => {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  });

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
