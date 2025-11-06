# ✅ CHECKLIST - HƯỚNG DẪN TRIỂN KHAI

## 📋 BƯỚC 1: CHUẨN BỊ DATABASE

### 1.1 Kết nối PostgreSQL
```bash
# Mở Command Prompt hoặc PowerShell
psql -U postgres
```

### 1.2 Tạo Database Mới
```sql
-- Xóa database cũ (nếu có)
DROP DATABASE IF EXISTS pharmacy_db;

-- Tạo database mới
CREATE DATABASE pharmacy_db;

-- Kết nối vào database
\c pharmacy_db
```

### 1.3 Import File SQL
```sql
-- Chạy file SQL (thay đổi đường dẫn cho phù hợp)
\i 'E:/Project/Back_End_Pharmacy/Back_end/CSDL/pharmacy_db_v2.sql'

-- HOẶC copy toàn bộ nội dung file SQL và paste vào psql
```

### 1.4 Kiểm Tra Database
```sql
-- Kiểm tra số lượng sản phẩm
SELECT COUNT(*) FROM "Products";
-- Kết quả mong đợi: 30

-- Xem 5 sản phẩm đầu tiên
SELECT "Id", "Name", "Image", "Price" FROM "Products" LIMIT 5;

-- Kiểm tra cấu trúc bảng
\dt

-- Thoát khỏi psql
\q
```

---

## 📋 BƯỚC 2: KIỂM TRA FILE ẢNH

### 2.1 Đảm Bảo Có 30 File Ảnh
Kiểm tra folder: `Back_end/public/images/`

**Danh sách file bắt buộc:**
- [ ] paracetamol.jpg
- [ ] vitamin-c.jpg
- [ ] ibuprofen.jpg
- [ ] amoxicillin.jpg
- [ ] azithromycin.jpg
- [ ] aspirin.jpg
- [ ] diclofenac.jpg
- [ ] mefenamic.jpg
- [ ] naproxen.jpg
- [ ] doxycycline.jpg
- [ ] ciprofloxacin.jpg
- [ ] metronidazole.jpg
- [ ] vitamin-d3.jpg
- [ ] calcium.jpg
- [ ] omega3.jpg
- [ ] collagen.jpg
- [ ] multivitamin.jpg
- [ ] anti-dandruff.jpg
- [ ] cleanser.jpg
- [ ] sunscreen.jpg
- [ ] face-mask.jpg
- [ ] toothpaste.jpg
- [ ] shampoo.jpg
- [ ] mouthwash.jpg
- [ ] nebulizer.jpg
- [ ] first-aid.jpg
- [ ] glucose-meter.jpg
- [ ] bp-monitor.jpg
- [ ] thermometer.jpg
- [ ] default.jpg *(quan trọng - ảnh fallback)*

### 2.2 Tạo File default.jpg (Nếu Chưa Có)
- Tạo 1 ảnh placeholder 400x400px
- Lưu tên: `default.jpg`
- Đặt trong: `Back_end/public/images/`

---

## 📋 BƯỚC 3: KHỞI ĐỘNG BACKEND

### 3.1 Cài Đặt Dependencies
```bash
cd Back_end
npm install
```

### 3.2 Kiểm Tra File .env
Tạo hoặc kiểm tra file `.env` trong folder `Back_end`:
```env
PORT=5001
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=pharmacy_db
DB_PASSWORD=your_password_here
DB_PORT=5432
JWT_SECRET=your_secret_key_here
```

### 3.3 Khởi Động Server
```bash
node index.js
```

**Kết quả mong đợi:**
```
🚀 Server chạy tại http://localhost:5001
📑 Swagger Docs: http://localhost:5001/api-docs
```

### 3.4 Test Backend API
Mở trình duyệt và test:
- [ ] http://localhost:5001/ - Trang chủ backend
- [ ] http://localhost:5001/api-docs - Swagger UI
- [ ] http://localhost:5001/images/paracetamol.jpg - Test ảnh
- [ ] http://localhost:5001/api/products - Test API sản phẩm

---

## 📋 BƯỚC 4: KHỞI ĐỘNG FRONTEND

### 4.1 Cài Đặt Dependencies
```bash
# Mở terminal mới
cd Front_end
npm install
```

### 4.2 Kiểm Tra File .env
Tạo hoặc kiểm tra file `.env` trong folder `Front_end`:
```env
VITE_API_BASE=http://localhost:5001/api
```

### 4.3 Khởi Động Frontend
```bash
npm run dev
```

**Kết quả mong đợi:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 📋 BƯỚC 5: TEST CHỨC NĂNG

### 5.1 Test Trang Shop
- [ ] Truy cập: http://localhost:5173/shop
- [ ] **Kiểm tra:** Có hiển thị 30 sản phẩm?
- [ ] **Kiểm tra:** Tất cả ảnh có hiển thị đúng?
- [ ] **Kiểm tra:** Có 4 danh mục: Thuốc, Vitamin, Chăm sóc, Thiết bị?
- [ ] **Kiểm tra:** Mỗi danh mục hiển thị 5 sản phẩm đầu tiên?

### 5.2 Test Tìm Kiếm
- [ ] Nhập "Paracetamol" vào ô tìm kiếm
- [ ] **Kiểm tra:** Có hiển thị kết quả?
- [ ] **Kiểm tra:** Ảnh sản phẩm có hiển thị?

### 5.3 Test Filter Danh Mục
- [ ] Click vào danh mục "Thuốc"
- [ ] **Kiểm tra:** Chỉ hiển thị sản phẩm thuốc?
- [ ] **Kiểm tra:** Tổng số sản phẩm đúng (13)?

### 5.4 Test Đăng Nhập
- [ ] Truy cập: http://localhost:5173/login
- [ ] Đăng nhập với tài khoản test
- [ ] **Kiểm tra:** Token được lưu trong localStorage?

### 5.5 Test Giỏ Hàng
- [ ] Thêm sản phẩm vào giỏ hàng
- [ ] Truy cập: http://localhost:5173/cart
- [ ] **Kiểm tra:** Ảnh sản phẩm có hiển thị?
- [ ] **Kiểm tra:** Tăng/Giảm số lượng hoạt động?
- [ ] **Kiểm tra:** Tổng tiền tính đúng?
- [ ] **Kiểm tra:** Xóa sản phẩm hoạt động?

### 5.6 Test Checkout
- [ ] Click "Tiến hành thanh toán" từ giỏ hàng
- [ ] Điền đầy đủ thông tin giao hàng
- [ ] Chọn phương thức thanh toán
- [ ] Click "Đặt hàng"
- [ ] **Kiểm tra:** Có thông báo thành công?
- [ ] **Kiểm tra:** Giỏ hàng được xóa?

### 5.7 Test Chi Tiết Đơn Hàng
- [ ] Truy cập: http://localhost:5173/orders
- [ ] Click vào đơn hàng vừa tạo
- [ ] **Kiểm tra:** Ảnh sản phẩm có hiển thị?
- [ ] **Kiểm tra:** Thông tin đơn hàng đầy đủ?
- [ ] **Kiểm tra:** Trạng thái đơn hàng đúng?

---

## 📋 BƯỚC 6: KIỂM TRA DATABASE SAU KHI TEST

```sql
-- Kết nối database
psql -U postgres -d pharmacy_db

-- Kiểm tra đơn hàng
SELECT * FROM "Orders" ORDER BY "CreatedAt" DESC LIMIT 5;

-- Kiểm tra chi tiết đơn hàng
SELECT o."Code", oi."ProductName", oi."Qty", oi."Price"
FROM "Orders" o
JOIN "OrderItems" oi ON o."Id" = oi."OrderId"
ORDER BY o."CreatedAt" DESC
LIMIT 10;

-- Kiểm tra giỏ hàng (của user đang login)
SELECT u."Username", p."Name", ci."Qty"
FROM "CartItems" ci
JOIN "Users" u ON ci."UserId" = u."Id"
JOIN "Products" p ON ci."ProductId" = p."Id";
```

---

## 🐛 TROUBLESHOOTING

### Lỗi: "Ảnh không hiển thị"
**Giải pháp:**
1. Mở F12 Console xem URL ảnh
2. Copy URL và paste vào trình duyệt
3. Nếu lỗi 404: Kiểm tra file ảnh có tồn tại
4. Nếu lỗi CORS: Kiểm tra backend có chạy không

### Lỗi: "Cannot connect to database"
**Giải pháp:**
1. Kiểm tra PostgreSQL đang chạy
2. Kiểm tra thông tin trong file `.env`
3. Test kết nối: `psql -U postgres -d pharmacy_db`

### Lỗi: "Port 5001 already in use"
**Giải pháp:**
```bash
# Windows
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# Hoặc đổi port trong .env
PORT=5002
```

### Lỗi: "Token expired"
**Giải pháp:**
1. Xóa localStorage: `localStorage.clear()`
2. Đăng nhập lại

---

## ✅ HOÀN THÀNH

Sau khi hoàn thành tất cả checklist:
- [ ] Backend chạy ổn định
- [ ] Frontend chạy ổn định
- [ ] Tất cả 30 sản phẩm hiển thị ảnh đúng
- [ ] Giỏ hàng hoạt động
- [ ] Đặt hàng thành công
- [ ] Chi tiết đơn hàng hiển thị đầy đủ
- [ ] Database lưu thông tin đúng

**🎉 CHÚC MỪNG! Project đã hoàn thành!**

---

## 📞 HỖ TRỢ

Nếu gặp lỗi, kiểm tra:
1. File `SUMMARY_FIXES.md` - Tóm tắt tất cả sửa đổi
2. File `PRODUCT_LIST.md` - Danh sách 30 sản phẩm
3. Console log (F12) - Xem lỗi JavaScript
4. Backend terminal - Xem lỗi server
5. PostgreSQL log - Xem lỗi database

---

**Ngày tạo:** 06/11/2025  
**Version:** 1.0  
**Status:** ✅ SẴN SÀNG TRIỂN KHAI
