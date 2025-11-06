# 📚 HƯỚNG DẪN CƠ SỞ DỮ LIỆU PHARMACY SYSTEM

## 📋 Tổng quan

Hệ thống sử dụng **PostgreSQL** với 8 bảng chính để quản lý toàn bộ hoạt động của website bán thuốc trực tuyến.

---

## 🗂️ CẤU TRÚC CƠ SỞ DỮ LIỆU

### **1. Bảng `Users` - Quản lý người dùng**

**Mục đích:** Lưu trữ thông tin tài khoản người dùng (Admin & Khách hàng)

**Cấu trúc:**
```sql
CREATE TABLE public."Users" (
    "Id" BIGSERIAL PRIMARY KEY,
    "Username" VARCHAR(100) NOT NULL UNIQUE,
    "Password" TEXT NOT NULL,                    -- Mã hóa bằng bcrypt
    "Fullname" VARCHAR(200) DEFAULT '(Chưa cập nhật)',
    "Email" VARCHAR(200) NOT NULL UNIQUE,
    "Phone" VARCHAR(20),
    "Address" TEXT,
    "Role" VARCHAR(20) DEFAULT 'customer',       -- 'admin' hoặc 'customer'
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Chức năng trong hệ thống:**
- Đăng ký/Đăng nhập (JWT authentication)
- Phân quyền Admin/Customer
- Quản lý thông tin cá nhân (Profile)
- Liên kết với: CartItems, Orders, Comments, ChatThreads

**Dữ liệu mẫu:**
```sql
-- Cần đăng ký qua giao diện /register để tạo user
-- Password sẽ được hash tự động bởi backend
```

---

### **2. Bảng `Products` - Quản lý sản phẩm**

**Mục đích:** Lưu trữ thông tin sản phẩm (thuốc, vitamin, thiết bị y tế)

**Cấu trúc:**
```sql
CREATE TABLE public."Products" (
    "Id" BIGSERIAL PRIMARY KEY,
    "Name" VARCHAR(255) NOT NULL,
    "Slug" VARCHAR(255) UNIQUE,                  -- URL-friendly name
    "ShortDesc" VARCHAR(500),                     -- Mô tả ngắn
    "Description" TEXT,                           -- Mô tả đầy đủ
    "Category" VARCHAR(120),                      -- thuoc, vitamin, cham-soc, thiet-bi
    "Brand" VARCHAR(120),                         -- Thương hiệu
    "Image" TEXT,                                 -- Tên file ảnh (vd: paracetamol.jpg)
    "Price" NUMERIC(12,2) DEFAULT 0,              -- Giá bán
    "Stock" INTEGER DEFAULT 0,                    -- Số lượng tồn kho
    "IsActive" BOOLEAN DEFAULT TRUE,              -- Đang bán hay không
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Chức năng trong hệ thống:**
- Hiển thị danh sách sản phẩm (/shop)
- Tìm kiếm & lọc theo category
- Chi tiết sản phẩm (/product/:id)
- Quản lý tồn kho
- Backend tự động build URL ảnh: `http://localhost:5001/images/paracetamol.jpg`

**Dữ liệu mẫu:** 30 sản phẩm đã có trong file `pharmacy_db_v2.sql`

**Danh mục (Category):**
- `thuoc` - Thuốc chữa bệnh (13 sản phẩm)
- `vitamin` - Vitamin & thực phẩm chức năng (5 sản phẩm)
- `cham-soc` - Chăm sóc sức khỏe (7 sản phẩm)
- `thiet-bi` - Thiết bị y tế (5 sản phẩm)

---

### **3. Bảng `CartItems` - Giỏ hàng**

**Mục đích:** Lưu trữ sản phẩm trong giỏ hàng của từng user

**Cấu trúc:**
```sql
CREATE TABLE public."CartItems" (
    "Id" BIGSERIAL PRIMARY KEY,
    "UserId" BIGINT NOT NULL REFERENCES "Users"("Id") ON DELETE CASCADE,
    "ProductId" BIGINT NOT NULL REFERENCES "Products"("Id") ON DELETE CASCADE,
    "Qty" INTEGER DEFAULT 1 CHECK ("Qty" > 0),
    "AddedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE("UserId", "ProductId")                 -- 1 user không thể thêm 1 sản phẩm 2 lần
);
```

**Chức năng trong hệ thống:**
- Thêm sản phẩm vào giỏ (/api/cart/items)
- Cập nhật số lượng
- Xóa khỏi giỏ
- Hiển thị trang giỏ hàng (/cart)
- **Quan trọng:** User phải TỒN TẠI trong bảng Users trước khi thêm vào giỏ (Foreign Key)

**Quy trình:**
1. User đăng nhập → Có UserId
2. Click "Thêm vào giỏ" → INSERT vào CartItems
3. Checkout → Chuyển sang Orders → XÓA CartItems

---

### **4. Bảng `Orders` - Đơn hàng**

**Mục đích:** Lưu trữ thông tin tổng quan đơn hàng

**Cấu trúc:**
```sql
CREATE TABLE public."Orders" (
    "Id" BIGSERIAL PRIMARY KEY,
    "Code" VARCHAR(50) UNIQUE,                    -- Mã đơn: ORD20251106XXXX (auto-generated)
    "UserId" BIGINT NOT NULL REFERENCES "Users"("Id"),
    "Status" VARCHAR(30) DEFAULT 'pending',       -- pending, confirmed, shipping, delivered, cancelled
    "Total" NUMERIC(12,2) DEFAULT 0,              -- Tổng tiền (bao gồm ship)
    "Address" TEXT NOT NULL,                      -- Địa chỉ giao hàng đầy đủ
    "Phone" VARCHAR(20) NOT NULL,
    "Note" TEXT,                                  -- Ghi chú của khách
    "PaymentMethod" VARCHAR(20) DEFAULT 'COD',    -- COD, Banking, Momo
    "ETA" DATE,                                   -- Dự kiến giao hàng
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Trạng thái đơn hàng (Status):**
- `pending` - Chờ xác nhận (mới tạo)
- `confirmed` - Đã xác nhận (admin duyệt)
- `shipping` - Đang giao hàng
- `delivered` - Đã giao thành công → **Có thể đánh giá**
- `cancelled` - Đã hủy (user hoặc admin hủy)

**Chức năng trong hệ thống:**
- Tạo đơn hàng từ giỏ (/api/orders/checkout)
- Xem danh sách đơn (/orders)
- Chi tiết đơn hàng (/order/:id)
- Hủy đơn (chỉ khi status = pending)
- Admin quản lý đơn hàng

**Trigger tự động:**
- Khi INSERT → Tự động tạo `Code` = "ORD" + ngày + số thứ tự

---

### **5. Bảng `OrderItems` - Chi tiết sản phẩm trong đơn**

**Mục đích:** Lưu "snapshot" sản phẩm tại thời điểm mua (giá, tên, ảnh cố định)

**Cấu trúc:**
```sql
CREATE TABLE public."OrderItems" (
    "Id" BIGSERIAL PRIMARY KEY,
    "OrderId" BIGINT NOT NULL REFERENCES "Orders"("Id") ON DELETE CASCADE,
    "ProductId" BIGINT NOT NULL REFERENCES "Products"("Id"),
    "ProductName" VARCHAR(255) NOT NULL,          -- Lưu tên tại thời điểm mua
    "ProductImage" TEXT,                          -- Lưu URL ảnh tuyệt đối
    "Qty" INTEGER NOT NULL,
    "Price" NUMERIC(12,2) NOT NULL                -- Lưu giá tại thời điểm mua
);
```

**Tại sao cần bảng này?**
- ✅ Giá sản phẩm có thể thay đổi → Lưu giá cũ để tránh nhầm lẫn
- ✅ Tên sản phẩm có thể đổi → Lưu tên cũ
- ✅ Ảnh có thể xóa → Lưu URL ảnh cố định
- ✅ Admin có thể xóa sản phẩm → Order vẫn giữ nguyên lịch sử

**Ví dụ:**
```
Hôm nay: Paracetamol giá 15,000đ
User mua 2 viên → OrderItems lưu: "Paracetamol", Qty=2, Price=15000
Ngày mai: Admin tăng giá lên 20,000đ
→ Đơn hàng cũ vẫn hiển thị 15,000đ (đúng với lúc mua)
```

---

### **6. Bảng `Comments` - Đánh giá sản phẩm**

**Mục đích:** Lưu trữ đánh giá & rating của khách hàng

**Cấu trúc:**
```sql
CREATE TABLE public."Comments" (
    "Id" BIGSERIAL PRIMARY KEY,
    "UserId" BIGINT NOT NULL REFERENCES "Users"("Id") ON DELETE CASCADE,
    "ProductId" BIGINT NOT NULL REFERENCES "Products"("Id") ON DELETE CASCADE,
    "Rating" INTEGER CHECK ("Rating" >= 1 AND "Rating" <= 5),  -- 1-5 sao
    "Content" TEXT NOT NULL,                      -- Nội dung đánh giá
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Chức năng trong hệ thống:**
- Hiển thị đánh giá trong ProductDetail
- Tính điểm trung bình (Average Rating)
- Chỉ cho phép đánh giá nếu:
  - ✅ User đã mua sản phẩm
  - ✅ Đơn hàng đã giao (status = 'delivered')
  - ✅ Chưa đánh giá sản phẩm này trước đó
- Viết đánh giá từ:
  - Product Detail → Tab "Đánh giá"
  - Order Detail → Nút "⭐ Đánh giá" trên từng sản phẩm

**API Endpoints:**
- `GET /api/comments/:productId` - Lấy danh sách đánh giá
- `POST /api/comments` - Thêm đánh giá mới
- `GET /api/comments/check/:productId` - Kiểm tra quyền đánh giá
- `DELETE /api/comments/:id` - Xóa đánh giá (admin/chủ comment)

---

### **7. Bảng `ChatThreads` - Cuộc trò chuyện hỗ trợ**

**Mục đích:** Quản lý các cuộc hội thoại giữa khách hàng và admin

**Cấu trúc:**
```sql
CREATE TABLE public."ChatThreads" (
    "Id" BIGSERIAL PRIMARY KEY,
    "UserId" BIGINT NOT NULL REFERENCES "Users"("Id") ON DELETE CASCADE,
    "Status" VARCHAR(20) DEFAULT 'open',          -- open, closed
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Chức năng trong hệ thống:**
- User click "💬 Hỗ trợ" → Tạo ChatThread
- 1 User chỉ có 1 thread active (status='open')
- Admin có thể đóng thread (status='closed')

---

### **8. Bảng `ChatMessages` - Tin nhắn hỗ trợ**

**Mục đích:** Lưu trữ nội dung tin nhắn trong từng thread

**Cấu trúc:**
```sql
CREATE TABLE public."ChatMessages" (
    "Id" BIGSERIAL PRIMARY KEY,
    "ThreadId" BIGINT NOT NULL REFERENCES "ChatThreads"("Id") ON DELETE CASCADE,
    "SenderId" BIGINT NOT NULL REFERENCES "Users"("Id"),
    "Message" TEXT NOT NULL,
    "SentAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Chức năng trong hệ thống:**
- User gửi tin nhắn → INSERT vào ChatMessages
- Admin trả lời → INSERT với SenderId = admin
- Hiển thị lịch sử chat theo ThreadId
- Real-time chat (có thể dùng Socket.io hoặc polling)

---

## 🔗 QUAN HỆ GIỮA CÁC BẢNG

```
Users (1) ──────< (N) CartItems (N) >────── (1) Products
  │                                              │
  │                                              │
  ├──────< (N) Orders                           │
  │            │                                 │
  │            └──────< (N) OrderItems >────────┘
  │                                              │
  ├──────< (N) Comments >──────────────────────┘
  │
  ├──────< (N) ChatThreads
  │            │
  │            └──────< (N) ChatMessages
  │
  └──────< (N) ChatMessages (SenderId)
```

**Giải thích:**
- 1 User có nhiều CartItems, Orders, Comments, ChatThreads
- 1 Product có nhiều CartItems, OrderItems, Comments
- 1 Order có nhiều OrderItems
- 1 ChatThread có nhiều ChatMessages
- 1 User (Admin) có thể gửi nhiều ChatMessages

---

## 🔄 QUY TRÌNH NGHIỆP VỤ

### **Quy trình MUA HÀNG:**

```
1. User đăng ký tài khoản
   → INSERT INTO Users

2. User duyệt sản phẩm
   → SELECT * FROM Products WHERE IsActive=true

3. User thêm vào giỏ
   → INSERT INTO CartItems (UserId, ProductId, Qty)

4. User checkout
   → BEGIN TRANSACTION
   → INSERT INTO Orders (UserId, Total, Address, ...)
   → INSERT INTO OrderItems (OrderId, ProductId, ProductName, Price, ...)
   → UPDATE Products SET Stock = Stock - Qty
   → DELETE FROM CartItems WHERE UserId = ?
   → COMMIT

5. Admin xác nhận đơn
   → UPDATE Orders SET Status='confirmed'

6. Shipper giao hàng
   → UPDATE Orders SET Status='shipping'
   → UPDATE Orders SET Status='delivered'

7. User đánh giá sản phẩm
   → INSERT INTO Comments (UserId, ProductId, Rating, Content)
```

### **Quy trình HỦY ĐƠN:**

```
1. User hủy đơn (chỉ khi Status='pending')
   → BEGIN TRANSACTION
   → SELECT OrderItems WHERE OrderId=?
   → UPDATE Products SET Stock = Stock + Qty (hoàn lại kho)
   → UPDATE Orders SET Status='cancelled'
   → COMMIT
```

---

## ⚙️ TRIGGER & FUNCTION TỰ ĐỘNG

### **1. Auto-generate Order Code**

```sql
CREATE OR REPLACE FUNCTION generate_order_code()
RETURNS TRIGGER AS $$
BEGIN
    NEW."Code" := 'ORD' || TO_CHAR(NOW(), 'YYYYMMDD') || 
                  LPAD(nextval('order_code_seq')::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_code
    BEFORE INSERT ON "Orders"
    FOR EACH ROW
    EXECUTE FUNCTION generate_order_code();
```

**Kết quả:** Mã đơn tự động: `ORD20251106XXXX`

### **2. Auto-update UpdatedAt**

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."UpdatedAt" = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Áp dụng cho nhiều bảng
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON "Users"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

---

## 📊 QUERY MẪU THƯỜNG DÙNG

### **1. Lấy top 10 sản phẩm bán chạy:**

```sql
SELECT 
    p."Name",
    p."Price",
    COUNT(oi."Id") as "TotalSold",
    SUM(oi."Qty") as "TotalQuantity"
FROM "Products" p
JOIN "OrderItems" oi ON p."Id" = oi."ProductId"
JOIN "Orders" o ON oi."OrderId" = o."Id"
WHERE o."Status" = 'delivered'
GROUP BY p."Id", p."Name", p."Price"
ORDER BY "TotalQuantity" DESC
LIMIT 10;
```

### **2. Thống kê doanh thu theo tháng:**

```sql
SELECT 
    TO_CHAR("CreatedAt", 'YYYY-MM') as "Month",
    COUNT(*) as "TotalOrders",
    SUM("Total") as "Revenue"
FROM "Orders"
WHERE "Status" = 'delivered'
GROUP BY TO_CHAR("CreatedAt", 'YYYY-MM')
ORDER BY "Month" DESC;
```

### **3. Danh sách khách hàng mua nhiều nhất:**

```sql
SELECT 
    u."Username",
    u."Email",
    COUNT(o."Id") as "TotalOrders",
    SUM(o."Total") as "TotalSpent"
FROM "Users" u
JOIN "Orders" o ON u."Id" = o."UserId"
WHERE o."Status" = 'delivered'
GROUP BY u."Id", u."Username", u."Email"
ORDER BY "TotalSpent" DESC
LIMIT 20;
```

### **4. Sản phẩm có rating cao nhất:**

```sql
SELECT 
    p."Name",
    p."Price",
    AVG(c."Rating") as "AvgRating",
    COUNT(c."Id") as "TotalReviews"
FROM "Products" p
LEFT JOIN "Comments" c ON p."Id" = c."ProductId"
GROUP BY p."Id", p."Name", p."Price"
HAVING COUNT(c."Id") >= 5  -- Ít nhất 5 đánh giá
ORDER BY "AvgRating" DESC, "TotalReviews" DESC
LIMIT 10;
```

---

## 🔒 BẢO MẬT & RÀNG BUỘC

### **Foreign Key Constraints:**
- Tự động XÓA dữ liệu liên quan khi xóa user (CASCADE)
- Đảm bảo tính toàn vẹn dữ liệu

### **CHECK Constraints:**
- `Rating` phải từ 1-5
- `Qty` phải > 0
- `Price`, `Stock` phải >= 0
- `Status`, `Role`, `PaymentMethod` chỉ nhận giá trị hợp lệ

### **UNIQUE Constraints:**
- `Username`, `Email` không được trùng
- 1 User chỉ thêm 1 sản phẩm vào giỏ 1 lần
- `Order Code` không trùng lặp

### **Indexes:**
- Tăng tốc tìm kiếm: Username, Email, Category, ProductName
- Tối ưu JOIN: UserId, ProductId, OrderId

---

## 🛠️ IMPORT DATABASE

### **Bước 1: Tạo database mới**
```bash
psql -U postgres
CREATE DATABASE pharmacy_db;
\q
```

### **Bước 2: Import file SQL**
```bash
psql -U postgres -d pharmacy_db -f pharmacy_db_v2.sql
```

### **Bước 3: Kiểm tra**
```sql
\c pharmacy_db
\dt  -- Liệt kê các bảng
SELECT COUNT(*) FROM "Products";  -- Phải trả về 30
```

---

## 📦 DỮ LIỆU MẪU

### **Products: 30 sản phẩm**
- 13 thuốc (Paracetamol, Amoxicillin, Aspirin...)
- 5 vitamin (Vitamin C, D, E, Omega-3...)
- 7 sản phẩm chăm sóc (Khẩu trang, nước rửa tay...)
- 5 thiết bị y tế (Nhiệt kế, huyết áp...)

### **Users: 0 (Cần đăng ký)**
- Truy cập: `http://localhost:5173/register`
- Nhập: Username, Email, Password
- Backend tự động hash password

---

## ⚠️ LƯU Ý QUAN TRỌNG

### **1. User phải tồn tại trước khi:**
- Thêm vào giỏ hàng
- Đặt hàng
- Viết đánh giá
- Chat hỗ trợ

### **2. Không được:**
- Xóa sản phẩm đang có trong đơn hàng
- Sửa giá sản phẩm trong OrderItems (đã snapshot)
- Xóa user khi còn đơn hàng pending

### **3. Backup định kỳ:**
```bash
pg_dump -U postgres pharmacy_db > backup_$(date +%Y%m%d).sql
```

---

## 📞 HỖ TRỢ

**File SQL gốc:** `Back_end/CSDL/pharmacy_db_v2.sql`

**Tài liệu API:** http://localhost:5001/api-docs

**Kiến trúc hệ thống:** `Back_end/PROJECT_STRUCTURE.md`

---

**Phiên bản:** 2.0  
**Cập nhật:** 06/11/2025  
**Database:** PostgreSQL 14+  
**Encoding:** UTF-8  
**Timezone:** Asia/Ho_Chi_Minh
