# 📋 TÀI LIỆU ĐẶC TẢ API - PHARMACY SYSTEM

**Base URL:** `http://localhost:5001`  
**API Version:** 1.0  
**Database:** PostgreSQL (pharmacy_db)

---

## 🔐 AUTHENTICATION APIs

### 1. Đăng ký tài khoản (Customer)

**POST** `/api/auth/register`

**Body (JSON):**

```json
{
  "username": "customer01",
  "password": "123456",
  "fullname": "Nguyễn Văn A",
  "email": "customer01@gmail.com",
  "phone": "0901234567"
}
```

**Response 201 (Success):**

```json
{
  "message": "Đăng ký thành công!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "Id": 2,
    "Username": "customer01",
    "Fullname": "Nguyễn Văn A",
    "Email": "customer01@gmail.com",
    "Phone": "0901234567",
    "Role": "customer"
  }
}
```

**Response 400 (Email đã tồn tại):**

```json
{
  "error": "Email đã được sử dụng!"
}
```

---

### 2. Đăng nhập

**POST** `/api/auth/login`

**Body (JSON):**

```json
{
  "email": "customer01@gmail.com",
  "password": "123456"
}
```

**Response 200 (Success):**

```json
{
  "message": "Đăng nhập thành công!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "Id": 2,
    "Username": "customer01",
    "Fullname": "Nguyễn Văn A",
    "Email": "customer01@gmail.com",
    "Phone": "0901234567",
    "Role": "customer"
  }
}
```

**Response 401 (Sai mật khẩu):**

```json
{
  "error": "Thông tin đăng nhập không chính xác!"
}
```

---

### 3. Tạo tài khoản Admin (One-time only)

**POST** `/api/auth/admin-init`

**Body (JSON):**

```json
{
  "username": "admin",
  "password": "admin123",
  "email": "admin@pharmacy.com"
}
```

**Response 201 (Success):**

```json
{
  "message": "Admin account created!",
  "user": {
    "Id": 1,
    "Username": "admin",
    "Email": "admin@pharmacy.com",
    "Role": "admin"
  }
}
```

---

## 🛍️ PRODUCTS APIs

### 4. Lấy danh sách sản phẩm

**GET** `/api/products`

**Query Parameters:**

- `category` (optional): Lọc theo danh mục (thuoc, vitamin, cham-soc, thiet-bi)
- `search` (optional): Tìm kiếm theo tên
- `page` (optional): Số trang (default: 1)
- `limit` (optional): Số sản phẩm/trang (default: 20)

**Example:** `GET /api/products?category=thuoc&page=1&limit=10`

**Response 200:**

```json
{
  "products": [
    {
      "Id": 1,
      "Name": "Paracetamol 500mg",
      "ShortDesc": "Hạ sốt, giảm đau",
      "Category": "thuoc",
      "Brand": "Generic",
      "Image": "/images/paracetamol.jpg",
      "Price": 15000,
      "Stock": 100,
      "IsActive": true
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalItems": 15,
    "itemsPerPage": 10
  }
}
```

---

### 5. Lấy chi tiết sản phẩm

**GET** `/api/products/:id`

**Example:** `GET /api/products/1`

**Response 200:**

```json
{
  "Id": 1,
  "Name": "Paracetamol 500mg",
  "ShortDesc": "Hạ sốt, giảm đau",
  "Description": "Thuốc giảm đau hạ sốt thông dụng. Dùng cho cả người lớn và trẻ em...",
  "Category": "thuoc",
  "Brand": "Generic",
  "Image": "/images/paracetamol.jpg",
  "Price": 15000,
  "Stock": 100,
  "IsActive": true,
  "CreatedAt": "2025-10-25T13:01:51.932Z"
}
```

**Response 404:**

```json
{
  "error": "Sản phẩm không tồn tại!"
}
```

---

## 🛒 CART APIs (Yêu cầu Authentication)

**Headers:**

```
Authorization: Bearer <token>
```

### 6. Lấy giỏ hàng của user

**GET** `/api/cart`

**Response 200:**

```json
{
  "cartItems": [
    {
      "Id": 1,
      "ProductId": 1,
      "ProductName": "Paracetamol 500mg",
      "ProductImage": "/images/paracetamol.jpg",
      "Price": 15000,
      "Qty": 2,
      "Subtotal": 30000
    }
  ],
  "total": 30000
}
```

---

### 7. Thêm sản phẩm vào giỏ hàng

**POST** `/api/cart/items`

**Body (JSON):**

```json
{
  "productId": 1,
  "qty": 2
}
```

**Response 200:**

```json
{
  "message": "Đã thêm vào giỏ hàng!",
  "cartItem": {
    "Id": 1,
    "UserId": 2,
    "ProductId": 1,
    "Qty": 2
  }
}
```

---

### 8. Cập nhật số lượng trong giỏ hàng

**PATCH** `/api/cart/items/:id`

**Body (JSON):**

```json
{
  "qty": 5
}
```

**Response 200:**

```json
{
  "message": "Đã cập nhật giỏ hàng!"
}
```

---

### 9. Xóa sản phẩm khỏi giỏ hàng

**DELETE** `/api/cart/items/:id`

**Response 200:**

```json
{
  "message": "Đã xóa khỏi giỏ hàng!"
}
```

---

## 📦 ORDERS APIs (Yêu cầu Authentication)

### 10. Tạo đơn hàng (Checkout)

**POST** `/api/orders/checkout`

**Body (JSON):**

```json
{
  "address": "123 Nguyễn Trãi, Quận 1, TP.HCM",
  "phone": "0901234567",
  "note": "Giao giờ hành chính",
  "paymentMethod": "COD"
}
```

**Response 201:**

```json
{
  "message": "Đặt hàng thành công!",
  "order": {
    "Id": 1,
    "Code": "ORD20251028001",
    "Total": 157000,
    "Status": "pending",
    "Address": "123 Nguyễn Trãi, Quận 1, TP.HCM",
    "PaymentMethod": "COD",
    "CreatedAt": "2025-10-28T10:30:00.000Z"
  }
}
```

---

### 11. Lấy danh sách đơn hàng của user

**GET** `/api/orders`

**Query Parameters:**

- `status` (optional): pending, confirmed, shipping, delivered, cancelled

**Response 200:**

```json
{
  "orders": [
    {
      "Id": 1,
      "Code": "ORD20251028001",
      "Total": 157000,
      "Status": "pending",
      "CreatedAt": "2025-10-28T10:30:00.000Z",
      "itemsCount": 3
    }
  ]
}
```

---

### 12. Lấy chi tiết đơn hàng

**GET** `/api/orders/:id`

**Response 200:**

```json
{
  "Id": 1,
  "Code": "ORD20251028001",
  "Status": "pending",
  "Total": 157000,
  "Address": "123 Nguyễn Trãi, Quận 1, TP.HCM",
  "Note": "Giao giờ hành chính",
  "PaymentMethod": "COD",
  "CreatedAt": "2025-10-28T10:30:00.000Z",
  "items": [
    {
      "ProductId": 1,
      "ProductName": "Paracetamol 500mg",
      "ProductImage": "/images/paracetamol.jpg",
      "Qty": 2,
      "Price": 15000,
      "Subtotal": 30000
    }
  ]
}
```

---

### 13. Hủy đơn hàng

**PATCH** `/api/orders/:id/cancel`

**Response 200:**

```json
{
  "message": "Đã hủy đơn hàng!"
}
```

**Response 400 (Không thể hủy):**

```json
{
  "error": "Không thể hủy đơn hàng đang giao!"
}
```

---

## 👤 USER PROFILE APIs (Yêu cầu Authentication)

### 14. Lấy thông tin cá nhân

**GET** `/api/users/me`

**Response 200:**

```json
{
  "Id": 2,
  "Username": "customer01",
  "Fullname": "Nguyễn Văn A",
  "Email": "customer01@gmail.com",
  "Phone": "0901234567",
  "Address": "123 Nguyễn Trãi, Quận 1, TP.HCM",
  "Role": "customer",
  "CreatedAt": "2025-10-28T10:00:00.000Z"
}
```

---

### 15. Cập nhật thông tin cá nhân

**PATCH** `/api/users/me`

**Body (JSON):**

```json
{
  "fullname": "Nguyễn Văn B",
  "phone": "0909999999",
  "address": "456 Lê Lợi, Quận 3, TP.HCM"
}
```

**Response 200:**

```json
{
  "message": "Cập nhật thông tin thành công!",
  "user": {
    "Id": 2,
    "Fullname": "Nguyễn Văn B",
    "Phone": "0909999999",
    "Address": "456 Lê Lợi, Quận 3, TP.HCM"
  }
}
```

---

### 16. Đổi mật khẩu

**PATCH** `/api/users/change-password`

**Body (JSON):**

```json
{
  "currentPassword": "123456",
  "newPassword": "newpass123"
}
```

**Response 200:**

```json
{
  "message": "Đổi mật khẩu thành công!"
}
```

**Response 400:**

```json
{
  "error": "Mật khẩu hiện tại không đúng!"
}
```

---

## 💬 SUPPORT CHAT APIs (Yêu cầu Authentication)

### 17. Lấy danh sách chat threads

**GET** `/api/chat/threads`

**Response 200:**

```json
{
  "threads": [
    {
      "Id": 1,
      "Title": "Hỏi về sản phẩm Paracetamol",
      "LastMessage": "Sản phẩm này dùng cho trẻ em được không?",
      "UpdatedAt": "2025-10-28T15:30:00.000Z"
    }
  ]
}
```

---

### 18. Tạo chat thread mới

**POST** `/api/chat/threads`

**Body (JSON):**

```json
{
  "title": "Hỏi về sản phẩm Paracetamol",
  "attachmentType": "product",
  "attachmentId": "1"
}
```

**Response 201:**

```json
{
  "message": "Tạo cuộc hội thoại thành công!",
  "thread": {
    "Id": 1,
    "Title": "Hỏi về sản phẩm Paracetamol",
    "AttachmentType": "product",
    "AttachmentId": "1"
  }
}
```

---

## 🔍 DISEASE ENCYCLOPEDIA (Public)

### 19. Tìm kiếm bệnh

**GET** `/api/diseases/search?q=tiểu đường`

**Response 200:**

```json
{
  "results": [
    {
      "name": "Bệnh tiểu đường type 2",
      "category": "noi-tiet",
      "symptoms": "Khát nước nhiều, tiểu nhiều, mệt mỏi...",
      "description": "Bệnh rối loạn chuyển hóa glucose..."
    }
  ]
}
```

---

## ⚙️ ERROR CODES

| Code | Meaning                                          |
| ---- | ------------------------------------------------ |
| 200  | Success                                          |
| 201  | Created                                          |
| 400  | Bad Request (Dữ liệu không hợp lệ)               |
| 401  | Unauthorized (Chưa đăng nhập hoặc token hết hạn) |
| 403  | Forbidden (Không có quyền truy cập)              |
| 404  | Not Found (Không tìm thấy tài nguyên)            |
| 409  | Conflict (Dữ liệu trùng lặp)                     |
| 500  | Internal Server Error                            |

---

## 🧪 POSTMAN TEST COLLECTION

### Test Flow Đề Xuất:

1. **Tạo Admin** → POST `/api/auth/admin-init`
2. **Đăng ký Customer** → POST `/api/auth/register`
3. **Đăng nhập** → POST `/api/auth/login` (Lưu token)
4. **Xem sản phẩm** → GET `/api/products`
5. **Chi tiết sản phẩm** → GET `/api/products/1`
6. **Thêm vào giỏ** → POST `/api/cart/items` (Headers: Authorization)
7. **Xem giỏ hàng** → GET `/api/cart`
8. **Đặt hàng** → POST `/api/orders/checkout`
9. **Xem đơn hàng** → GET `/api/orders`
10. **Cập nhật profile** → PATCH `/api/users/me`

### Environment Variables (Postman):

```
BASE_URL = http://localhost:5001
TOKEN = <paste token sau khi login>
```

### Global Headers:

```
Content-Type: application/json
Authorization: Bearer {{TOKEN}}  # Cho các API yêu cầu auth
```

---

## 📝 NOTES

- Tất cả API trả về JSON format
- Token JWT có thời hạn 1 ngày (1d)
- Cart tự động xóa sau khi checkout thành công
- Chỉ có thể hủy đơn hàng ở trạng thái `pending`
- Số lượng sản phẩm tự động trừ khi checkout
- Bảng Prescriptions vẫn tồn tại trong DB nhưng không có API (deprecated)
