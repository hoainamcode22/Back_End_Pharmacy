const https = require('https');
const fs = require('fs');
const path = require('path');

// Danh sách sản phẩm cần tải ảnh
const products = [
    'paracetamol', 'vitamin-c', 'men-tieu-hoa', 'siro-ho', 'oresol',
    'xit-mui', 'elevit', 'ensure', 'mieng-dan', 'que-thu-thai',
    'nhiet-ke', 'may-do-huyet-ap', 'khau-trang', 'nuoc-suc-mieng',
    'dau-gio', 'amoxicillin', 'azithromycin', 'cephalexin', 'aspirin',
    'diclofenac', 'mefenamic', 'naproxen', 'vitamin-d3', 'calcium',
    'omega3', 'collagen', 'anti-dandruff', 'cleanser', 'sunscreen',
    'nebulizer', 'first-aid', 'glucose-meter', 'face-mask', 'toothpaste',
    'shampoo', 'bp-monitor', 'thermometer', 'mouthwash', 'multivitamin',
    'doxycycline', 'ciprofloxacin', 'metronidazole'
];

const imagesDir = path.join(__dirname, 'public', 'images');

// Tạo thư mục nếu chưa có
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Hàm tải ảnh từ placehold.co
function downloadImage(productName) {
    const fileName = `${productName}.jpg`;
    const filePath = path.join(imagesDir, fileName);

    // Nếu đã có file, bỏ qua
    if (fs.existsSync(filePath)) {
        console.log(`✓ ${fileName} đã tồn tại`);
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        const url = `https://placehold.co/400x400/e8f5f4/00a859.jpg?text=${encodeURIComponent(productName)}`;

        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${fileName}: ${response.statusCode}`));
                return;
            }

            const fileStream = fs.createWriteStream(filePath);
            response.pipe(fileStream);

            fileStream.on('finish', () => {
                fileStream.close();
                console.log(`✓ Đã tải ${fileName}`);
                resolve();
            });

            fileStream.on('error', (err) => {
                fs.unlink(filePath, () => { }); // Xóa file lỗi
                reject(err);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

// Tải tuần tự để tránh quá tải
async function downloadAll() {
    console.log('🚀 Bắt đầu tải ảnh placeholder...\n');

    for (const product of products) {
        try {
            await downloadImage(product);
            // Delay ngắn giữa các request
            await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error) {
            console.error(`✗ Lỗi tải ${product}:`, error.message);
        }
    }

    console.log('\n✅ Hoàn tất!');
    console.log(`📁 Đã tải ${products.length} ảnh vào: ${imagesDir}`);
    console.log('\n💡 Lưu ý: Đây là ảnh placeholder. Thay thế bằng ảnh thật để có chất lượng tốt hơn!');
}

downloadAll();
