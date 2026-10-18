// Back_end/pull_images_from_cloud.js
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const { Pool } = require('pg');

// 1. CẤU HÌNH (Dùng thông tin bạn đã cung cấp)
cloudinary.config({
  cloud_name: 'dd1onmi19',
  api_key: '697521727136735',
  api_secret: 'U25GYEZbqBvbnFA8McAXtlamZVI'
});

// Lấy chuỗi kết nối từ biến môi trường
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    console.error("❌ LỖI: Không tìm thấy DATABASE_URL trong file .env");
    process.exit(1);
}

const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false } // Bắt buộc cho Supabase/Render
});

async function syncCloudToDb() {
    console.log('🚀 Bắt đầu đồng bộ: Cloudinary -> Database...');

    try {
        // 2. Lấy danh sách tất cả ảnh từ Cloudinary
        // Lưu ý: API này lấy tối đa 500 ảnh một lần (đủ cho quy mô hiện tại)
        console.log('☁️ Đang tải danh sách ảnh từ Cloudinary...');
        const cloudResult = await cloudinary.api.resources({
            type: 'upload',
            max_results: 500,
            prefix: '' // Lấy tất cả folder
        });

        const cloudImages = cloudResult.resources;
        console.log(`📦 Tìm thấy ${cloudImages.length} ảnh trên Cloud.`);

        // Tạo Map để tra cứu nhanh: [tên_file_không_đuôi] -> [url_cloudinary]
        // Ví dụ: "paracetamol" -> "https://res.cloudinary.com/.../paracetamol.jpg"
        const imageMap = new Map();
        
        cloudImages.forEach(img => {
            // Lấy phần tên cuối cùng của public_id (bỏ folder)
            // vd: pharmacy_products/paracetamol -> paracetamol
            const cleanName = img.public_id.split('/').pop().toLowerCase();
            imageMap.set(cleanName, img.secure_url);
        });

        // 3. Lấy danh sách sản phẩm từ Database
        const dbRes = await pool.query('SELECT "Id", "Name", "Image" FROM public."Products"');
        const products = dbRes.rows;

        console.log(`🔍 Đang đối chiếu với ${products.length} sản phẩm trong Database...`);
        let updatedCount = 0;

        for (const product of products) {
            const { Id, Name, Image } = product;
            
            if (!Image) continue;

            // Chuẩn hóa tên file từ DB (bỏ đuôi .jpg, .png nếu có)
            // vd: "Paracetamol.jpg" -> "paracetamol"
            const dbImageName = Image.split('.')[0].toLowerCase();

            // 4. Tìm link tương ứng trong Map
            if (imageMap.has(dbImageName)) {
                const newUrl = imageMap.get(dbImageName);

                // Cập nhật vào DB
                await pool.query(
                    'UPDATE public."Products" SET "ImageURL" = $1 WHERE "Id" = $2',
                    [newUrl, Id]
                );
                console.log(`✅ Đã khớp: [${Name}] -> ${newUrl}`);
                updatedCount++;
            } else {
                console.warn(`⚠️ Không tìm thấy ảnh trên Cloud cho: ${Name} (File gốc: ${Image})`);
            }
        }

        console.log(`\n🎉 HOÀN TẤT! Đã cập nhật thành công ${updatedCount} sản phẩm.`);
        process.exit(0);

    } catch (error) {
        console.error('❌ Có lỗi xảy ra:', error);
        process.exit(1);
    }
}

syncCloudToDb();    