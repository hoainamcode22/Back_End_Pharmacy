# 📋 TÓM TẮT SỬA LỖI HIỂN THỊ ẢNH & GIỎ HÀNG

## ✅ CÁC VẤN ĐỀ ĐÃ SỬA

### 1. **LỖI HIỂN THỊ ẢNH TRONG /shop**
**Nguyên nhân:** 
- Database lưu đường dẫn `/images/paracetamol.jpg` nhưng cần lưu chỉ tên file `paracetamol.jpg`
- Backend chưa build URL tuyệt đối đúng cách
- Frontend cộng thêm baseURL hai lần gây sai đường dẫn

**Đã sửa:**
- ✅ Cập nhật database: Lưu chỉ **tên file** (vd: `paracetamol.jpg`)
- ✅ Backend tự động build URL: `http://localhost:5001/images/paracetamol.jpg`
- ✅ Frontend sử dụng URL tuyệt đối từ backend

### 2. **LỖI HIỂN THỊ ẢNH TRONG CHI TIẾT ĐƠN HÀNG**
**Nguyên nhân:**
- API `getOrderById` trả về relative path
- Frontend cộng thêm baseURL gây duplicate

**Đã sửa:**
- ✅ Backend build URL tuyệt đối trong `getOrderById`
- ✅ Frontend dùng trực tiếp URL từ backend

### 3. **LỖI HIỂN THỊ ẢNH TRONG GIỎ HÀNG**
**Nguyên nhân:**
- API `getCart` chưa build URL tuyệt đối

**Đã sửa:**
- ✅ Backend build URL tuyệt đối trong `getCart`
- ✅ Frontend dùng trực tiếp URL từ backend

### 4. **GIỎ HÀNG ĐÃ LƯU ĐẦY ĐỦ VÀO DATABASE**
**Trạng thái:** ✅ **ĐÃ HOÀN CHỈNH**
- Bảng `Orders`: Lưu thông tin đơn hàng (địa chỉ, SĐT, tổng tiền, trạng thái)
- Bảng `OrderItems`: Lưu chi tiết sản phẩm trong đơn
- Code backend đã xử lý đầy đủ

---

## 📁 CÁC FILE ĐÃ SỬA

### **BACKEND** (4 files)

1. **`Back_end/CSDL/pharmacy_db_v2.sql`**
   - Cập nhật cột `Image` lưu chỉ tên file (không có `/images/`)
   - Có **30 sản phẩm** khớp với 30 file ảnh

2. **`Back_end/src/controllers/productController.js`**
   - Hàm `getProducts()`: Build URL tuyệt đối
   - Hàm `getProductById()`: Build URL tuyệt đối
   - Xử lý 3 format: absolute URL, `/images/xxx`, `xxx.jpg`

3. **`Back_end/src/controllers/cartController.js`**
   - Hàm `getCart()`: Build URL tuyệt đối cho ảnh
   - Trả về `ProductImage` dạng absolute URL

4. **`Back_end/src/controllers/orderController.js`**
   - Hàm `getOrderById()`: Build URL tuyệt đối cho ảnh trong OrderItems
   - Hàm `checkout()`: Đã lưu đầy đủ thông tin vào DB

### **FRONTEND** (3 files)

5. **`Front_end/src/pages/user/Shop/Shop.jsx`**
   - Sử dụng `imageUrl` từ backend (đã là absolute URL)

6. **`Front_end/src/pages/user/Cart/Cart.jsx`**
   - Sử dụng `ProductImage` từ backend trực tiếp

7. **`Front_end/src/pages/user/OrderDetail/OrderDetail.jsx`**
   - Sử dụng `ProductImage` từ backend trực tiếp

---

## 🗂️ CẤU TRÚC THƯ MỤC ẢNH

```
Back_end/
  └── public/
      └── images/
          ├── paracetamol.jpg
          ├── vitamin-c.jpg
          ├── amoxicillin.jpg
          ├── azithromycin.jpg
          ├── aspirin.jpg
          ├── diclofenac.jpg
          ├── mefenamic.jpg
          ├── naproxen.jpg
          ├── doxycycline.jpg
          ├── ciprofloxacin.jpg
          ├── metronidazole.jpg
          ├── ibuprofen.jpg
          ├── cephalexin.jpg (nếu có)
          ├── vitamin-d3.jpg
          ├── calcium.jpg
          ├── omega3.jpg
          ├── collagen.jpg
          ├── multivitamin.jpg
          ├── anti-dandruff.jpg
          ├── cleanser.jpg
          ├── sunscreen.jpg
          ├── face-mask.jpg
          ├── toothpaste.jpg
          ├── shampoo.jpg
          ├── mouthwash.jpg
          ├── nebulizer.jpg
          ├── first-aid.jpg
          ├── glucose-meter.jpg
          ├── bp-monitor.jpg
          ├── thermometer.jpg
          └── default.jpg (ảnh mặc định)
```

---

## 🔧 CÁCH XỬ LÝ URL ẢNH

### **Backend Logic:**
```javascript
const baseUrl = `${req.protocol}://${req.get('host')}`; // http://localhost:5001
const image = row.Image; // "paracetamol.jpg"

let imageUrl;
if (image.startsWith('http')) {
  imageUrl = image; // Already absolute
} else if (image.startsWith('/images/')) {
  imageUrl = `${baseUrl}${image}`; // /images/xxx.jpg
} else {
  imageUrl = `${baseUrl}/images/${image}`; // xxx.jpg -> http://localhost:5001/images/xxx.jpg
}
```

### **Frontend Logic:**
```javascript
// Backend đã trả về absolute URL, dùng luôn
const imageUrl = product.imageUrl || product.ImageUrl;
<img src={imageUrl} />
```

---

## 📊 DATABASE - 30 SẢN PHẨM

| Danh mục | Số lượng |
|----------|----------|
| Thuốc (thuoc) | 13 sản phẩm |
| Vitamin (vitamin) | 5 sản phẩm |
| Chăm sóc (cham-soc) | 7 sản phẩm |
| Thiết bị y tế (thiet-bi) | 5 sản phẩm |
| **TỔNG** | **30 sản phẩm** |

---

## 🎯 HƯỚNG DẪN IMPORT DATABASE

```bash
# Kết nối PostgreSQL
psql -U postgres

# Tạo database (nếu chưa có)
CREATE DATABASE pharmacy_db;

# Kết nối vào database
\c pharmacy_db

# Import file SQL
\i 'E:/Project/Back_End_Pharmacy/Back_end/CSDL/pharmacy_db_v2.sql'

# Kiểm tra
SELECT COUNT(*) FROM "Products"; -- Kết quả: 30
```

---

## 🚀 CÁCH CHẠY PROJECT

### **1. Backend:**
```bash
cd Back_end
npm install
node index.js
# Server chạy tại: http://localhost:5001
# API Docs: http://localhost:5001/api-docs
```

### **2. Frontend:**
```bash
cd Front_end
npm install
npm run dev
# Frontend chạy tại: http://localhost:5173
```

---

## 📋 DANH SÁCH FILES LIÊN QUAN ĐẾN /shop

### **Core Files:**
1. `Front_end/src/pages/user/Shop/Shop.jsx` - Trang shop chính
2. `Front_end/src/pages/user/Shop/Shop.css` - CSS trang shop
3. `Front_end/src/components/ProductCard/ProductCard.jsx` - Card sản phẩm
4. `Front_end/src/components/ProductCard/ProductCard.css` - CSS card
5. `Front_end/src/components/SearchBar/SearchBar.jsx` - Thanh tìm kiếm
6. `Front_end/src/components/SearchBar/SearchBar.css` - CSS search
7. `Back_end/src/controllers/productController.js` - API lấy sản phẩm
8. `Back_end/src/routes/productRoutes.js` - Routes sản phẩm

### **Related Files:**
9. `Front_end/src/api.jsx` - Axios config & API calls
10. `Front_end/src/config.js` - Config API base URL
11. `Back_end/CSDL/pharmacy_db_v2.sql` - Database schema
12. `Back_end/public/images/` - Thư mục chứa ảnh
13. `Back_end/index.js` - Server entry point

---

## ✅ CHECKLIST SAU KHI IMPORT DATABASE

- [ ] Import file `pharmacy_db_v2.sql` vào PostgreSQL
- [ ] Kiểm tra 30 sản phẩm: `SELECT COUNT(*) FROM "Products";`
- [ ] Đảm bảo 30 file ảnh có trong `Back_end/public/images/`
- [ ] Khởi động backend: `cd Back_end && node index.js`
- [ ] Khởi động frontend: `cd Front_end && npm run dev`
- [ ] Test hiển thị ảnh tại: http://localhost:5173/shop
- [ ] Test giỏ hàng: Thêm sản phẩm và kiểm tra
- [ ] Test đặt hàng: Thanh toán và xem chi tiết đơn hàng

---

## 🐛 TROUBLESHOOTING

### **Ảnh không hiển thị:**
1. Kiểm tra file ảnh có trong `Back_end/public/images/`
2. Kiểm tra backend đang chạy: http://localhost:5001
3. Kiểm tra console F12 xem URL ảnh
4. Thử truy cập trực tiếp: http://localhost:5001/images/paracetamol.jpg

### **Giỏ hàng trống:**
1. Đảm bảo đã đăng nhập
2. Kiểm tra token trong localStorage: `ph_auth`
3. Kiểm tra API response trong Network tab

### **Database lỗi:**
1. Xóa database cũ: `DROP DATABASE IF EXISTS pharmacy_db;`
2. Tạo mới: `CREATE DATABASE pharmacy_db;`
3. Import lại file SQL

---

**Ngày cập nhật:** 06/11/2025
**Version:** 2.0
**Status:** ✅ HOÀN THÀNH
