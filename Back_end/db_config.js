require('dotenv').config();
const { Pool } = require('pg');

console.log("DEBUG CONNECT INFO:");
console.log("User:", process.env.DB_USER || 'postgres');
console.log("Pass (độ dài):", (process.env.DB_PASS || '753159').length); // Chỉ in độ dài để bảo mật
console.log("Pass (giá trị thực):", process.env.DB_PASS || '753159'); // <--- In ra để soi kỹ
console.log("Host:", process.env.DB_HOST || 'localhost');

// Hỗ trợ cả DATABASE_URL (ưu tiên) hoặc các biến DB_*
const poolConfig = process.env.DATABASE_URL
  ? { 
      connectionString: process.env.DATABASE_URL,
      client_encoding: 'UTF8'
    }
  : {
      user: process.env.DB_USER || 'postgres',
      host: '127.0.0.1', // <--- QUAN TRỌNG: Đổi 'localhost' thành '127.0.0.1' để ép dùng IPv4
      database: process.env.DB_NAME || 'pharmacy_db',
      password: process.env.DB_PASS || '753159',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
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