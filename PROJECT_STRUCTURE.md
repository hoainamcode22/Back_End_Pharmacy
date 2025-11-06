# 🏗️ CẤU TRÚC PROJECT PHARMACY - FULL STACK

## 📁 CẤU TRÚC THƯ MỤC

```
Back_End_Pharmacy/
│
├── 📂 Back_end/                          # BACKEND - Node.js + Express + PostgreSQL
│   ├── 📂 CSDL/
│   │   └── pharmacy_db_v2.sql           # Script tạo database & sample data
│   │
│   ├── 📂 public/
│   │   └── 📂 images/                    # Thư mục chứa ảnh sản phẩm (30 files)
│   │       ├── paracetamol.jpg
│   │       ├── vitamin-c.jpg
│   │       ├── amoxicillin.jpg
│   │       ├── ... (27 files khác)
│   │       └── default.jpg              # Ảnh mặc định khi lỗi
│   │
│   ├── 📂 src/
│   │   ├── 📂 controllers/              # Business Logic
│   │   │   ├── authController.js        # Đăng ký, Đăng nhập
│   │   │   ├── productController.js     # Lấy sản phẩm, Chi tiết SP
│   │   │   ├── cartController.js        # Giỏ hàng (CRUD)
│   │   │   ├── orderController.js       # Đặt hàng, Lịch sử đơn
│   │   │   ├── userController.js        # Profile, Đổi mật khẩu
│   │   │   └── announcementController.js # Thông báo
│   │   │
│   │   ├── 📂 middleware/
│   │   │   └── auth.js                  # Xác thực JWT token
│   │   │
│   │   └── 📂 routes/                   # API Routes
│   │       ├── authRoutes.js            # POST /api/auth/register, /login
│   │       ├── productRoutes.js         # GET /api/products, /products/:id
│   │       ├── cartRoutes.js            # GET/POST/PATCH/DELETE /api/cart
│   │       ├── orderRoutes.js           # POST /api/orders/checkout, GET /orders
│   │       ├── userRoutes.js            # GET/PATCH /api/users/me
│   │       └── announcementRoutes.js    # GET /api/announcements
│   │
│   ├── db_config.js                     # Cấu hình kết nối PostgreSQL
│   ├── index.js                         # Server entry point (Express app)
│   ├── package.json                     # Dependencies
│   └── .env                             # Environment variables
│
│
├── 📂 Front_end/                         # FRONTEND - React + Vite
│   ├── 📂 public/
│   │   └── 📂 images/
│   │       ├── 📂 categories/           # Icon danh mục
│   │       └── 📂 products/             # (Không dùng - ảnh từ backend)
│   │
│   ├── 📂 src/
│   │   ├── 📂 assets/                   # Static assets
│   │   │
│   │   ├── 📂 components/               # Reusable Components
│   │   │   ├── 📂 Header/
│   │   │   │   ├── Header.jsx          # Menu điều hướng, Logo
│   │   │   │   └── Header.css
│   │   │   │
│   │   │   ├── 📂 Footer/
│   │   │   │   └── Footer.jsx          # Footer
│   │   │   │
│   │   │   ├── 📂 SearchBar/
│   │   │   │   ├── SearchBar.jsx       # Thanh tìm kiếm
│   │   │   │   └── SearchBar.css
│   │   │   │
│   │   │   ├── 📂 ProductCard/
│   │   │   │   ├── ProductCard.jsx     # Card hiển thị sản phẩm
│   │   │   │   └── ProductCard.css
│   │   │   │
│   │   │   ├── 📂 ProtectedRoute/
│   │   │   │   └── ProtectedRoute.jsx  # Route yêu cầu đăng nhập
│   │   │   │
│   │   │   ├── 📂 UserLayout/
│   │   │   │   └── UserLayout.jsx      # Layout cho user (Header + Content)
│   │   │   │
│   │   │   ├── 📂 AdminLayout/
│   │   │   │   └── AdminLayout.jsx     # Layout cho admin
│   │   │   │
│   │   │   └── 📂 FloatingChatButton/
│   │   │       ├── FloatingChatButton.jsx  # Nút chat nổi
│   │   │       └── FloatingChatButton.css
│   │   │
│   │   ├── 📂 context/                  # React Context (State Management)
│   │   │   ├── 📂 AuthContext/
│   │   │   │   └── AuthContext.jsx     # Quản lý auth state
│   │   │   │
│   │   │   └── 📂 ChatContext/
│   │   │       └── ChatContext.jsx     # Quản lý chat state
│   │   │
│   │   ├── 📂 pages/                    # Pages/Screens
│   │   │   │
│   │   │   ├── 📂 auth/                 # Authentication Pages
│   │   │   │   └── 📂 Login/
│   │   │   │       ├── Login.jsx       # Đăng nhập
│   │   │   │       └── Register.jsx    # Đăng ký
│   │   │   │
│   │   │   ├── 📂 user/                 # User Pages
│   │   │   │   ├── 📂 Shop/            ⭐ TRANG CHÍNH - SHOP
│   │   │   │   │   ├── Shop.jsx        # Hiển thị danh sách SP
│   │   │   │   │   └── Shop.css
│   │   │   │   │
│   │   │   │   ├── 📂 ProductDetail/
│   │   │   │   │   ├── ProductDetail.jsx  # Chi tiết sản phẩm
│   │   │   │   │   └── ProductDetail.css
│   │   │   │   │
│   │   │   │   ├── 📂 Cart/            🛒 GIỎ HÀNG
│   │   │   │   │   ├── Cart.jsx        # Xem/Sửa giỏ hàng
│   │   │   │   │   └── Cart.css
│   │   │   │   │
│   │   │   │   ├── 📂 Checkout/        💳 THANH TOÁN
│   │   │   │   │   ├── Checkout.jsx    # Form đặt hàng
│   │   │   │   │   └── Checkout.css
│   │   │   │   │
│   │   │   │   ├── 📂 Orders/          📦 LỊCH SỬ ĐƠN HÀNG
│   │   │   │   │   ├── Orders.jsx      # Danh sách đơn hàng
│   │   │   │   │   └── Orders.css
│   │   │   │   │
│   │   │   │   ├── 📂 OrderDetail/     📋 CHI TIẾT ĐƠN HÀNG
│   │   │   │   │   ├── OrderDetail.jsx # Chi tiết 1 đơn
│   │   │   │   │   └── OrderDetail.css
│   │   │   │   │
│   │   │   │   ├── 📂 Profile/         👤 HỒ SƠ
│   │   │   │   │   ├── Profile.jsx     # Thông tin cá nhân
│   │   │   │   │   └── Profile.css
│   │   │   │   │
│   │   │   │   ├── 📂 SupportChat/     💬 HỖ TRỢ
│   │   │   │   │   ├── SupportChat.jsx # Chat với admin
│   │   │   │   │   └── SupportChat.css
│   │   │   │   │
│   │   │   │   └── 📂 Diseases/        🏥 TRA CỨU BỆNH
│   │   │   │       ├── Diseases.jsx
│   │   │   │       └── Diseases.css
│   │   │   │
│   │   │   └── 📂 admin/                # Admin Pages
│   │   │       └── 📂 AdminDashboard/
│   │   │           ├── AdminDashboard.jsx    # Trang tổng quan
│   │   │           └── MedicineManagement.jsx # Quản lý thuốc
│   │   │
│   │   ├── api.jsx                      # Axios instance & API calls
│   │   ├── config.js                    # API base URL config
│   │   ├── App.jsx                      # Root component (Router)
│   │   ├── App.css                      # Global styles
│   │   ├── main.jsx                     # Entry point (render App)
│   │   └── index.css                    # Global CSS reset
│   │
│   ├── index.html                       # HTML template
│   ├── package.json                     # Dependencies
│   ├── vite.config.js                   # Vite config
│   └── .env                             # Environment variables
│
│
├── 📄 SUMMARY_FIXES.md                  # Tóm tắt các sửa đổi
├── 📄 PRODUCT_LIST.md                   # Danh sách 30 sản phẩm
├── 📄 DEPLOYMENT_CHECKLIST.md           # Hướng dẫn triển khai
└── 📄 TEST_VERIFICATION.md              # Xác nhận các file đã sửa
```

---

## 🔥 CÁC CHỨC NĂNG CHÍNH

### 👤 **1. AUTHENTICATION (Xác thực)**

**Frontend:**
- `Login.jsx` - Đăng nhập
- `Register.jsx` - Đăng ký tài khoản mới
- `AuthContext.jsx` - Quản lý trạng thái đăng nhập

**Backend:**
- `authController.js`
  - `POST /api/auth/register` - Đăng ký
  - `POST /api/auth/login` - Đăng nhập (trả về JWT token)
  - `POST /api/auth/admin-init` - Tạo tài khoản admin

**Database:**
- Bảng `Users`: Lưu thông tin user (Username, Email, Password hash, Role)

**Flow:**
```
User điền form → Frontend gọi API → Backend validate → 
Bcrypt hash password → Lưu DB → Trả về JWT token → 
Frontend lưu token vào localStorage → Tự động set Authorization header
```

---

### 🛍️ **2. PRODUCT MANAGEMENT (Quản lý sản phẩm)**

**Frontend:**
- `Shop.jsx` - Hiển thị danh sách sản phẩm (có filter, search)
- `ProductCard.jsx` - Card hiển thị từng sản phẩm
- `ProductDetail.jsx` - Chi tiết 1 sản phẩm
- `SearchBar.jsx` - Tìm kiếm sản phẩm

**Backend:**
- `productController.js`
  - `GET /api/products` - Lấy danh sách (có filter category, search, pagination)
  - `GET /api/products/:id` - Lấy chi tiết 1 sản phẩm

**Database:**
- Bảng `Products`: 30 sản phẩm (Id, Name, Image, Price, Stock, Category...)

**Flow:**
```
Frontend gọi API → Backend query DB → Build absolute image URL → 
Trả về JSON → Frontend hiển thị → Click sản phẩm → 
Navigate đến /product/:id → Gọi API detail → Hiển thị chi tiết
```

**Xử lý ảnh:**
```
Database: "paracetamol.jpg"
Backend: Build URL → "http://localhost:5001/images/paracetamol.jpg"
Frontend: Hiển thị <img src="{absolute URL}" />
```

---

### 🛒 **3. SHOPPING CART (Giỏ hàng)**

**Frontend:**
- `Cart.jsx` - Xem giỏ hàng, tăng/giảm số lượng, xóa sản phẩm
- `ProductCard.jsx` - Nút "Thêm vào giỏ"

**Backend:**
- `cartController.js`
  - `GET /api/cart` - Lấy giỏ hàng của user
  - `POST /api/cart/items` - Thêm sản phẩm vào giỏ
  - `PATCH /api/cart/items/:id` - Cập nhật số lượng
  - `DELETE /api/cart/items/:id` - Xóa sản phẩm khỏi giỏ

**Database:**
- Bảng `CartItems`: Lưu giỏ hàng (UserId, ProductId, Qty)

**Flow:**
```
User click "Thêm vào giỏ" → Frontend gọi POST /api/cart/items → 
Backend kiểm tra stock → Thêm vào DB → 
User vào /cart → Gọi GET /api/cart → Hiển thị danh sách → 
User tăng/giảm số lượng → Gọi PATCH → Update DB
```

---

### 💳 **4. CHECKOUT & ORDERS (Đặt hàng)**

**Frontend:**
- `Checkout.jsx` - Form đặt hàng (3 bước: Thông tin → Thanh toán → Xác nhận)
- `Orders.jsx` - Danh sách đơn hàng đã đặt
- `OrderDetail.jsx` - Chi tiết 1 đơn hàng

**Backend:**
- `orderController.js`
  - `POST /api/orders/checkout` - Tạo đơn hàng từ giỏ
  - `GET /api/orders` - Lấy danh sách đơn hàng
  - `GET /api/orders/:id` - Chi tiết đơn hàng
  - `PATCH /api/orders/:id/cancel` - Hủy đơn hàng

**Database:**
- Bảng `Orders`: Đơn hàng (UserId, Total, Address, Phone, Status, PaymentMethod)
- Bảng `OrderItems`: Chi tiết SP trong đơn (OrderId, ProductId, Qty, Price, ProductImage)

**Flow:**
```
User click "Thanh toán" → Navigate /checkout → 
Điền form (địa chỉ, SĐT) → Chọn phương thức thanh toán → 
Xác nhận → Frontend gọi POST /api/orders/checkout → 

BACKEND XỬ LÝ:
1. BEGIN TRANSACTION
2. Lấy giỏ hàng từ CartItems
3. Kiểm tra tồn kho
4. Tạo Order mới (tự động sinh Code)
5. Tạo OrderItems (lưu ProductName, ProductImage, Price tại thời điểm mua)
6. Trừ Stock trong Products
7. Xóa CartItems
8. COMMIT TRANSACTION

→ Trả về thông tin đơn hàng → Frontend chuyển đến /orders → 
User click xem chi tiết → Gọi GET /api/orders/:id → 
Backend build absolute URL cho ảnh → Hiển thị chi tiết đơn
```

---

### 👤 **5. USER PROFILE (Hồ sơ cá nhân)**

**Frontend:**
- `Profile.jsx` - Xem/Sửa thông tin cá nhân, đổi mật khẩu

**Backend:**
- `userController.js`
  - `GET /api/users/me` - Lấy thông tin user hiện tại
  - `PATCH /api/users/me` - Cập nhật thông tin
  - `PATCH /api/users/change-password` - Đổi mật khẩu

**Database:**
- Bảng `Users`: Fullname, Email, Phone, Address

**Flow:**
```
User vào /profile → Gọi GET /api/users/me → Hiển thị form → 
User sửa thông tin → Click "Cập nhật" → Gọi PATCH /api/users/me → 
Backend validate → Update DB → Trả về thành công
```

---

### 💬 **6. SUPPORT CHAT (Hỗ trợ)**

**Frontend:**
- `SupportChat.jsx` - Chat với admin
- `FloatingChatButton.jsx` - Nút chat nổi
- `ChatContext.jsx` - Quản lý trạng thái chat

**Backend:**
- `chatController.js` (nếu có)
  - Tạo thread chat
  - Gửi/Nhận tin nhắn

**Database:**
- Bảng `ChatThreads`: Cuộc hội thoại
- Bảng `ChatMessages`: Tin nhắn

---

### 🏥 **7. DISEASE LOOKUP (Tra cứu bệnh)**

**Frontend:**
- `Diseases.jsx` - Tra cứu thông tin bệnh

**Backend:**
- API tra cứu bệnh (nếu có)

---

### 🔧 **8. ADMIN PANEL (Quản trị)**

**Frontend:**
- `AdminDashboard.jsx` - Tổng quan
- `MedicineManagement.jsx` - Quản lý thuốc

**Backend:**
- Admin routes (CRUD products, users, orders)

---

## 🔄 LUỒNG DỮ LIỆU TỔNG QUAN

### **A. FLOW MUA HÀNG (E-COMMERCE)**

```
1. USER VÀO TRANG SHOP
   Frontend: Shop.jsx → Gọi GET /api/products
   Backend: productController.getProducts() → Query Products table
   Response: { products: [...], pagination: {...} }
   Frontend: Hiển thị ProductCard cho mỗi sản phẩm

2. USER CLICK SẢN PHẨM
   Frontend: Navigate /product/:id → Gọi GET /api/products/:id
   Backend: productController.getProductById() → Query 1 product
   Response: { id, name, price, image, description, stock... }
   Frontend: Hiển thị chi tiết

3. USER THÊM VÀO GIỎ HÀNG
   Frontend: Click "Chọn sản phẩm" → Gọi POST /api/cart/items
   Backend: cartController.addToCart()
     - Kiểm tra product tồn tại
     - Kiểm tra stock đủ không
     - Nếu đã có trong giỏ → Update số lượng
     - Nếu chưa có → Insert mới vào CartItems
   Response: { message: "Đã thêm vào giỏ hàng!" }

4. USER VÀO GIỎ HÀNG
   Frontend: Navigate /cart → Gọi GET /api/cart
   Backend: cartController.getCart()
     - JOIN CartItems với Products
     - Build absolute image URL
     - Tính subtotal
   Response: { cartItems: [...], total: 150000 }
   Frontend: Hiển thị danh sách + tổng tiền

5. USER TĂNG/GIẢM SỐ LƯỢNG
   Frontend: Click +/- → Gọi PATCH /api/cart/items/:id
   Backend: cartController.updateCartItem()
     - Kiểm tra stock
     - Update Qty trong CartItems
   Response: { message: "Đã cập nhật!" }

6. USER THANH TOÁN
   Frontend: Click "Thanh toán" → Navigate /checkout
   Step 1: Điền địa chỉ, SĐT
   Step 2: Chọn phương thức thanh toán (COD/Banking/Momo)
   Step 3: Xác nhận → Gọi POST /api/orders/checkout
   
   Backend: orderController.checkout()
     - BEGIN TRANSACTION
     - Query CartItems + Products
     - Validate stock
     - INSERT vào Orders (tự động sinh Code = ORD20251106XXXX)
     - INSERT vào OrderItems (lưu ProductName, ProductImage, Price)
     - UPDATE Products.Stock (trừ số lượng)
     - DELETE CartItems (xóa giỏ hàng)
     - COMMIT
   
   Response: { message: "Đặt hàng thành công!", order: {...} }
   Frontend: Navigate /orders

7. USER XEM LỊCH SỬ ĐƠN HÀNG
   Frontend: Navigate /orders → Gọi GET /api/orders
   Backend: orderController.getOrders()
     - Query Orders WHERE UserId = current user
     - JOIN với OrderItems để đếm số lượng sản phẩm
   Response: { orders: [...] }
   Frontend: Hiển thị danh sách đơn

8. USER XEM CHI TIẾT ĐƠN HÀNG
   Frontend: Click đơn hàng → Navigate /orders/:id → Gọi GET /api/orders/:id
   Backend: orderController.getOrderById()
     - Query Orders WHERE Id = :id AND UserId = current user
     - Query OrderItems WHERE OrderId = :id
     - Build absolute image URL cho từng item
   Response: { ...order, items: [...] }
   Frontend: Hiển thị chi tiết đơn + danh sách sản phẩm + ảnh

9. USER HỦY ĐƠN HÀNG (NẾU STATUS = PENDING)
   Frontend: Click "Hủy đơn" → Gọi PATCH /api/orders/:id/cancel
   Backend: orderController.cancelOrder()
     - BEGIN TRANSACTION
     - Kiểm tra status = 'pending'
     - UPDATE Orders.Status = 'cancelled'
     - UPDATE Products.Stock (hoàn lại số lượng)
     - COMMIT
   Response: { message: "Đã hủy đơn hàng!" }
```

---

### **B. FLOW XÁC THỰC (AUTHENTICATION)**

```
1. ĐĂNG KÝ
   Frontend: Register.jsx → User điền form → POST /api/auth/register
   Backend: authController.register()
     - Validate email chưa tồn tại
     - Hash password bằng bcrypt
     - INSERT vào Users (Role = 'customer')
   Response: { message: "Đăng ký thành công!" }

2. ĐĂNG NHẬP
   Frontend: Login.jsx → User điền email, password → POST /api/auth/login
   Backend: authController.login()
     - Query Users WHERE Email = ?
     - Compare password với bcrypt
     - Tạo JWT token (payload: { Id, Username, Email, Role })
     - Token expire: 7 days
   Response: { token: "eyJhbGc...", user: {...} }
   
   Frontend:
     - Lưu vào localStorage: { token, user }
     - Set axios default header: Authorization: Bearer {token}
     - Navigate đến /shop

3. AUTO-LOGIN (KHI REFRESH PAGE)
   Frontend: App.jsx → useEffect()
     - Đọc localStorage
     - Nếu có token → Set axios header
     - Set AuthContext state

4. PROTECTED ROUTES
   Frontend: ProtectedRoute.jsx
     - Kiểm tra có token không
     - Nếu không → Redirect /login
     - Nếu có → Render component

5. API CALLS (VỚI TOKEN)
   Frontend: Mọi API call → Axios tự động thêm header
   Backend: middleware/auth.js
     - Đọc header Authorization
     - Verify JWT token
     - Nếu hợp lệ → req.user = decoded payload → next()
     - Nếu không → 401 Unauthorized

6. TOKEN HẾT HẠN
   Backend: Token verify fail → 401
   Frontend: Axios interceptor
     - Bắt lỗi 401
     - Xóa localStorage
     - Alert "Phiên đăng nhập hết hạn"
     - Redirect /login
```

---

### **C. FLOW XỬ LÝ ẢNH (IMAGE HANDLING)**

```
1. LƯU ẢNH TRONG DATABASE
   Database: Products.Image = "paracetamol.jpg" (chỉ tên file)

2. BACKEND BUILD URL TUYỆT ĐỐI
   productController.getProducts():
     const baseUrl = `${req.protocol}://${req.get('host')}`;
     // baseUrl = "http://localhost:5001"
     
     const image = row.Image; // "paracetamol.jpg"
     
     if (image.startsWith('http')) {
       imageUrl = image; // Already absolute
     } else if (image.startsWith('/images/')) {
       imageUrl = `${baseUrl}${image}`; // /images/xxx.jpg
     } else {
       imageUrl = `${baseUrl}/images/${image}`; // xxx.jpg
     }
     // imageUrl = "http://localhost:5001/images/paracetamol.jpg"

3. BACKEND TRẢ VỀ FRONTEND
   Response: {
     id: 1,
     name: "Paracetamol",
     image: "paracetamol.jpg",
     imageUrl: "http://localhost:5001/images/paracetamol.jpg"
   }

4. FRONTEND HIỂN THỊ
   Shop.jsx:
     const product = response.products[0];
     <img src={product.imageUrl} /> 
     // Trình duyệt request: http://localhost:5001/images/paracetamol.jpg

5. BACKEND SERVE ẢNH
   index.js:
     app.use('/images', express.static('public/images'));
   
   Express tự động serve file từ: Back_end/public/images/paracetamol.jpg
```

---

## 🗄️ DATABASE SCHEMA

```sql
Users (Người dùng)
├── Id (PK)
├── Username
├── Password (bcrypt hash)
├── Email
├── Phone
├── Address
├── Role (admin/customer)
└── CreatedAt, UpdatedAt

Products (Sản phẩm)
├── Id (PK)
├── Name
├── Slug
├── ShortDesc
├── Description
├── Category (thuoc/vitamin/cham-soc/thiet-bi)
├── Brand
├── Image (tên file: "paracetamol.jpg")
├── Price
├── Stock
├── IsActive
└── CreatedAt, UpdatedAt

CartItems (Giỏ hàng)
├── Id (PK)
├── UserId (FK → Users)
├── ProductId (FK → Products)
├── Qty
└── AddedAt

Orders (Đơn hàng)
├── Id (PK)
├── Code (auto: ORD20251106XXXX)
├── UserId (FK → Users)
├── Status (pending/confirmed/shipping/delivered/cancelled)
├── Total
├── Address
├── Phone
├── Note
├── PaymentMethod (COD/Banking/Momo)
├── ETA
└── CreatedAt, UpdatedAt

OrderItems (Chi tiết đơn hàng)
├── Id (PK)
├── OrderId (FK → Orders)
├── ProductId (FK → Products)
├── ProductName (snapshot tại thời điểm mua)
├── ProductImage (snapshot tại thời điểm mua)
├── Qty
└── Price (snapshot tại thời điểm mua)

ChatThreads (Cuộc hội thoại)
├── Id (PK)
├── UserId (FK → Users)
├── Title
├── AttachmentType (product/order/general)
├── Status (active/closed)
└── CreatedAt, UpdatedAt

ChatMessages (Tin nhắn)
├── Id (PK)
├── ThreadId (FK → ChatThreads)
├── SenderId (FK → Users)
├── SenderRole (admin/customer)
├── Content
└── CreatedAt

Comments (Đánh giá)
├── Id (PK)
├── UserId (FK → Users)
├── ProductId (FK → Products)
├── Rating (1-5)
├── Content
└── CreatedAt
```

---

## 🚀 TECH STACK

### **Backend:**
- **Runtime:** Node.js v22
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT (jsonwebtoken)
- **Password:** bcrypt
- **Documentation:** Swagger (swagger-jsdoc, swagger-ui-express)
- **Environment:** dotenv
- **CORS:** cors

### **Frontend:**
- **Framework:** React 18
- **Build Tool:** Vite
- **Router:** React Router DOM v6
- **HTTP Client:** Axios
- **State Management:** React Context API
- **Styling:** CSS Modules / Plain CSS

---

## 🌐 API ENDPOINTS

```
AUTH
├── POST   /api/auth/register          Đăng ký
├── POST   /api/auth/login             Đăng nhập
└── POST   /api/auth/admin-init        Tạo admin

PRODUCTS
├── GET    /api/products                Danh sách sản phẩm
└── GET    /api/products/:id            Chi tiết sản phẩm

CART
├── GET    /api/cart                    Lấy giỏ hàng
├── POST   /api/cart/items              Thêm sản phẩm
├── PATCH  /api/cart/items/:id          Cập nhật số lượng
└── DELETE /api/cart/items/:id          Xóa sản phẩm

ORDERS
├── POST   /api/orders/checkout         Đặt hàng
├── GET    /api/orders                  Danh sách đơn hàng
├── GET    /api/orders/:id              Chi tiết đơn hàng
└── PATCH  /api/orders/:id/cancel       Hủy đơn hàng

USERS
├── GET    /api/users/me                Thông tin cá nhân
├── PATCH  /api/users/me                Cập nhật thông tin
└── PATCH  /api/users/change-password   Đổi mật khẩu

ANNOUNCEMENTS
└── GET    /api/announcements           Thông báo
```

---

## 📦 DEPENDENCIES

### **Backend (package.json):**
```json
{
  "dependencies": {
    "express": "^4.x",
    "pg": "^8.x",
    "bcrypt": "^5.x",
    "jsonwebtoken": "^9.x",
    "dotenv": "^16.x",
    "cors": "^2.x",
    "swagger-jsdoc": "^6.x",
    "swagger-ui-express": "^5.x"
  }
}
```

### **Frontend (package.json):**
```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "react-router-dom": "^6.x",
    "axios": "^1.x"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.x",
    "vite": "^5.x"
  }
}
```

---

**Ngày tạo:** 06/11/2025  
**Version:** 1.0  
**Status:** 📚 DOCUMENTATION COMPLETE
