require('dotenv').config();
const { Pool } = require('pg');

// Hỗ trợ cả DATABASE_URL (ưu tiên) hoặc các biến DB_*
const poolConfig = process.env.DATABASE_URL
  ? { 
      connectionString: process.env.DATABASE_URL,
      client_encoding: 'UTF8',
      ssl: { 
          rejectUnauthorized: false
      }
    }
  : {
      // Khối này sẽ được sử dụng khi chạy trên Render
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'pharmacy_db',
      password: process.env.DB_PASS || '123456',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      // THÊM SSL/TLS CHO KẾT NỐI SỬ DỤNG BIẾN RIÊNG LẺ
      ssl: { 
          rejectUnauthorized: false
      },
      options: '-c search_path=public',
      client_encoding: 'UTF8'
    };

// Tạo Pool kết nối PostgreSQL
const pool = new Pool(poolConfig);

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