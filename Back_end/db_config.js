require('dotenv').config();
const { Pool } = require('pg');

// Hỗ trợ cả DATABASE_URL (ưu tiên) hoặc các biến DB_*
const poolConfig = process.env.DATABASE_URL
  ? { 
      connectionString: process.env.DATABASE_URL,
      client_encoding: 'UTF8' // <--- THÊM VÀO ĐÂY
    }
  : {
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'pharmacy_db',
      password: process.env.DB_PASS || '123456',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      options: '-c search_path=public',
      client_encoding: 'UTF8' // <--- VÀ THÊM VÀO ĐÂY
    };

// Tạo Pool kết nối PostgreSQL
const pool = new Pool(poolConfig);

// Kiểm tra kết nối ngay khi khởi động
pool.connect()
  .then(client => {
    console.log('✅ Connected to PostgreSQL database!');
    client.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    console.error('❌ Check DATABASE_URL or DB_* environment variables');
    process.exit(1);
  });

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};