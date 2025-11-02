const fs = require('fs');
const path = require('path');

// Đường dẫn
const frontendImagesDir = path.join(__dirname, '..', 'Front_end', 'public', 'images', 'products');
const backendImagesDir = path.join(__dirname, 'public', 'images');

// Tạo thư mục backend nếu chưa có
if (!fs.existsSync(backendImagesDir)) {
    fs.mkdirSync(backendImagesDir, { recursive: true });
    console.log('✓ Đã tạo thư mục:', backendImagesDir);
}

// Danh sách file cần copy (chỉ .jpg, không copy .md)
const imagesToCopy = [
    'paracetamol.jpg',
    'vitamin-c.jpg',
    'ibuprofen.jpg',
    'aspirin.jpg',
    'diclofenac.jpg',
    'mefenamic.jpg',
    'naproxen.jpg',
    'vitamin-d3.jpg',
    'omega3.jpg',
    'multivitamin.jpg',
    'calcium.jpg',
    'collagen.jpg',
    'amoxicillin.jpg',
    'cephalexin.jpg',
    'azithromycin.jpg',
    'ciprofloxacin.jpg',
    'doxycycline.jpg',
    'metronidazole.jpg',
    'shampoo.jpg',
    'sunscreen.jpg',
    'mouthwash.jpg',
    'toothpaste.jpg',
    'cleanser.jpg',
    'anti-dandruff.jpg',
    'thermometer.jpg',
    'bp-monitor.jpg',
    'glucose-meter.jpg',
    'face-mask.jpg',
    'first-aid.jpg',
    'nebulizer.jpg'
];

console.log('🚀 Bắt đầu copy ảnh từ Frontend sang Backend...\n');

let copiedCount = 0;
let skippedCount = 0;
let errorCount = 0;

imagesToCopy.forEach(fileName => {
    const sourcePath = path.join(frontendImagesDir, fileName);
    const destPath = path.join(backendImagesDir, fileName);

    try {
        // Kiểm tra file nguồn có tồn tại không
        if (!fs.existsSync(sourcePath)) {
            console.log(`⚠️  Không tìm thấy: ${fileName}`);
            errorCount++;
            return;
        }

        // Kiểm tra file đích đã có chưa
        if (fs.existsSync(destPath)) {
            console.log(`⏭️  Đã tồn tại: ${fileName}`);
            skippedCount++;
            return;
        }

        // Copy file
        fs.copyFileSync(sourcePath, destPath);
        console.log(`✓ Đã copy: ${fileName}`);
        copiedCount++;

    } catch (error) {
        console.error(`✗ Lỗi copy ${fileName}:`, error.message);
        errorCount++;
    }
});

console.log('\n' + '='.repeat(50));
console.log('📊 KẾT QUẢ:');
console.log(`✓ Đã copy: ${copiedCount} file`);
console.log(`⏭️  Đã tồn tại: ${skippedCount} file`);
console.log(`✗ Lỗi: ${errorCount} file`);
console.log('='.repeat(50));

if (copiedCount > 0 || skippedCount > 0) {
    console.log('\n✅ Hoàn tất! Backend đã có đủ ảnh.');
    console.log(`📁 Vị trí: ${backendImagesDir}`);
    console.log('\n💡 Bước tiếp theo:');
    console.log('   1. Chạy server backend: cd Back_end && npm start');
    console.log('   2. Kiểm tra ảnh: http://localhost:5001/images/paracetamol.jpg');
    console.log('   3. Database đã đúng đường dẫn: /images/paracetamol.jpg');
} else {
    console.log('\n⚠️  Không có file nào được copy.');
}
