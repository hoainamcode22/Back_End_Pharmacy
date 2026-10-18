// Back_end/migrate_to_render.js
require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// 1. Cấu hình kết nối (Lấy từ biến môi trường)
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error("❌ LỖI: Chưa cấu hình DATABASE_URL trong file .env");
    process.exit(1);
}

const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false } // Render yêu cầu SSL
});

async function migrate() {
    try {
        console.log('🔌 Đang kết nối tới Database mới...');
        await client.connect();
        console.log('✅ Kết nối thành công!');

        // 2. Đọc file SQL chính
        const sqlPath = path.join(__dirname, 'CSDL', 'pharmacy_db_v2.sql');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');

        console.log('🚀 Đang tạo bảng và dữ liệu mẫu từ pharmacy_db_v2.sql...');
        await client.query(sqlContent);
        console.log('✅ Đã tạo xong cấu trúc bảng chính.');

        // 3. Đọc file Migration (Thêm cột chat)
        const migrationPath = path.join(__dirname, 'CSDL', 'migration_add_product_to_chat.sql');
        if (fs.existsSync(migrationPath)) {
             console.log('🔄 Đang chạy migration...');
             const migrationContent = fs.readFileSync(migrationPath, 'utf8');
             await client.query(migrationContent);
             console.log('✅ Migration hoàn tất.');
        }

        console.log('\n🎉 KHỞI TẠO DATABASE THÀNH CÔNG!');
        
    } catch (err) {
        console.error('❌ Lỗi migration:', err);
    } finally {
        await client.end();
    }
}

migrate();