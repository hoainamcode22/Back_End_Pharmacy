# 📋 HƯỚNG DẪN DESIGN TRANG SHOP - PHARMACY

## 🎯 MỤC TIÊU

Design xong sườn (giao diện) trước, sau đó mới gắn API vào

---

## 📁 CÁC FILE CẦN DESIGN

### 1️⃣ **TRANG CHÍNH - SHOP (Danh sách sản phẩm)**

**File:** `Front_end/src/pages/user/Shop.jsx`

- **Mục đích:** Hiển thị danh sách tất cả sản phẩm thuốc
- **Các thành phần cần design:**
  - ✅ Thanh tìm kiếm sản phẩm
  - ✅ Bộ lọc (danh mục, giá, loại thuốc)
  - ✅ Grid sản phẩm (hiển thị dạng thẻ/card)
  - ✅ Card sản phẩm: ảnh, tên, giá, nút "Thêm vào giỏ"
  - ✅ Phân trang (pagination)

**Dữ liệu giả cần chuẩn bị:**

```javascript
const mockProducts = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    price: 15000,
    image: "/images/product1.jpg",
    category: "Thuốc giảm đau",
    description: "Giảm đau, hạ sốt",
  },
  // ... thêm 10-20 sản phẩm
];
```

---

### 2️⃣ **CHI TIẾT SẢN PHẨM**

**File:** `Front_end/src/pages/user/ProductDetail.jsx`

- **Mục đích:** Hiển thị thông tin chi tiết 1 sản phẩm
- **Các thành phần cần design:**
  - ✅ Ảnh lớn sản phẩm (có thể zoom)
  - ✅ Tên, giá, mô tả chi tiết
  - ✅ Thành phần, công dụng, hướng dẫn sử dụng
  - ✅ Chọn số lượng
  - ✅ Nút "Thêm vào giỏ hàng"
  - ✅ Sản phẩm liên quan

**Route cần thêm:** `/product/:id`

---

### 3️⃣ **GIỎ HÀNG**

**File:** `Front_end/src/pages/user/Cart.jsx`

- **Mục đích:** Quản lý giỏ hàng
- **Các thành phần cần design:**
  - ✅ Danh sách sản phẩm trong giỏ
  - ✅ Tăng/giảm số lượng
  - ✅ Xóa sản phẩm
  - ✅ Tổng tiền
  - ✅ Nút "Thanh toán"
  - ✅ Trạng thái giỏ trống

---

### 4️⃣ **COMPONENTS PHỤ TRỢ**

#### a) **ProductCard Component**

**File mới:** `Front_end/src/components/ProductCard.jsx`

- Card hiển thị 1 sản phẩm trong grid
- Props: `{ id, name, price, image, onAddToCart }`

#### b) **SearchBar Component**

**File mới:** `Front_end/src/components/SearchBar.jsx`

- Thanh tìm kiếm sản phẩm
- Props: `{ onSearch, placeholder }`

#### c) **FilterSidebar Component**

**File mới:** `Front_end/src/components/FilterSidebar.jsx`

- Bộ lọc sản phẩm theo danh mục, giá
- Props: `{ categories, onFilter }`

---

## 🎨 CSS - FILE CẦN TẠO/SỬA

### 1️⃣ **File CSS riêng cho Shop**

**File mới:** `Front_end/src/pages/user/Shop.css`

```css
/* Grid sản phẩm */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

/* Card sản phẩm */
.product-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

/* Search & Filter */
.search-filter-section {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
}

/* ... thêm các style khác */
```

### 2️⃣ **Cập nhật index.css**

**File:** `Front_end/src/index.css`

- Thêm các utility classes chung
- Style cho button, input, card chung

---

## 🖼️ ASSETS CẦN CHUẨN BỊ

### **Thư mục ảnh:**

`Front_end/public/images/products/`

- Chuẩn bị 10-20 ảnh sản phẩm thuốc (placeholder)
- Kích thước khuyến nghị: 400x400px
- Format: JPG/PNG

### **Icons:**

- Icon giỏ hàng, tìm kiếm, filter
- Có thể dùng: Font Awesome, Material Icons, hoặc SVG

---

## 📝 CÁCH TỔ CHỨC CODE

### **Cấu trúc Shop.jsx:**

```jsx
import React, { useState } from "react";
import "./Shop.css";

export default function Shop() {
  // 1. State management
  const [products, setProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // 2. Handle functions
  const handleSearch = (term) => {
    /* ... */
  };
  const handleFilter = (category) => {
    /* ... */
  };
  const handleAddToCart = (productId) => {
    /* ... */
  };

  // 3. Render UI
  return (
    <div className="shop-page">
      {/* Search Bar */}
      {/* Filter Sidebar */}
      {/* Products Grid */}
    </div>
  );
}

// Mock data ở cuối file
const mockProducts = [
  /* ... */
];
```

---

## 🔄 FLOW DESIGN

### **Bước 1: Design Shop (List Products)**

1. Tạo mock data (10-20 sản phẩm)
2. Design layout: Search + Filter + Grid
3. Design ProductCard component
4. Thêm CSS cho responsive

### **Bước 2: Design ProductDetail**

1. Tạo mock data chi tiết 1 sản phẩm
2. Design layout 2 cột: ảnh | thông tin
3. Thêm nút số lượng, thêm giỏ hàng
4. Route `/product/:id`

### **Bước 3: Design Cart**

1. Tạo mock data giỏ hàng
2. Design danh sách items
3. Tính tổng tiền
4. Nút checkout

### **Bước 4: Connect API (SAU CÙNG)**

- Mở comment trong `api.jsx`
- Thay mock data bằng API calls
- Test với backend

---

## 📌 GHI CHÚ QUAN TRỌNG

### ✅ **LÀM TRƯỚC:**

- Design giao diện với **mock data**
- CSS/Style hoàn chỉnh
- Responsive design
- Tương tác UI (hover, click)

### ⏳ **LÀM SAU:**

- Kết nối API thật
- State management phức tạp
- Error handling
- Loading states

### 🎯 **MOCK DATA FORMAT:**

```javascript
// Product
{
  id: 1,
  name: "Tên thuốc",
  price: 50000,
  image: "/images/product.jpg",
  category: "Danh mục",
  description: "Mô tả",
  stock: 100,
  unit: "Hộp"
}

// Cart Item
{
  id: 1,
  productId: 1,
  product: { /* product object */ },
  qty: 2
}
```

---

## 📦 DANH SÁCH FILE CẦN TẠO/SỬA

### **Tạo mới:**

- ✅ `src/pages/user/Shop.css`
- ✅ `src/components/ProductCard.jsx`
- ✅ `src/components/SearchBar.jsx`
- ✅ `src/components/FilterSidebar.jsx`
- ✅ `public/images/products/` (folder)

### **Sửa:**

- ✅ `src/pages/user/Shop.jsx` - Design giao diện shop
- ✅ `src/pages/user/ProductDetail.jsx` - Design chi tiết SP
- ✅ `src/pages/user/Cart.jsx` - Mở comment + design
- ✅ `src/index.css` - Thêm utility classes
- ✅ `src/App.jsx` - Thêm route `/product/:id`

### **Giữ nguyên (chưa động):**

- ❌ `src/api.jsx` - Chưa mở API
- ❌ Backend - Chưa cần chạy

---

## 🚀 BƯỚC TIẾP THEO

1. **Tạo mock data** trong Shop.jsx
2. **Design layout** cho Shop page
3. **Tạo ProductCard component**
4. **Test giao diện** trên browser
5. **Design ProductDetail** và Cart
6. **Sau cùng:** Gắn API vào

---

**Lưu ý:** File này chỉ là hướng dẫn. Bạn có thể tùy chỉnh design theo ý thích!
