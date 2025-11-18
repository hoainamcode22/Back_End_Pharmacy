# Hướng dẫn tích hợp ảnh vào hệ thống

## 📋 Tổng quan

Hệ thống đã được cập nhật để hỗ trợ ảnh trong các phần:
- ✅ Danh sách bệnh (Diseases)
- ✅ Chi tiết bệnh (Disease Detail)
- ✅ Sản phẩm (Product Cards)
- ✅ Chi tiết sản phẩm (Product Detail)

---

## 🔧 Backend Setup

### 1. Chạy Migration Database

```bash
cd Back_end
# Chạy file migration để thêm cột ImageUrl vào bảng Diseases
psql -U postgres -d pharmacy_db < CSDL/migration_add_image_to_disease.sql
```

**Hoặc chạy thủ công trên pgAdmin:**
```sql
ALTER TABLE public."Diseases" 
ADD COLUMN "ImageUrl" VARCHAR(500);
```

### 2. Cập nhật API Endpoints

**GET /diseases** - Danh sách bệnh (với ImageUrl)
```json
{
  "success": true,
  "diseases": [
    {
      "Id": 1,
      "Name": "Cảm cúm",
      "Slug": "cam-cum",
      "ImageUrl": "https://cloudinary.com/image.jpg",
      ...
    }
  ]
}
```

**GET /diseases/slug/{slug}** - Chi tiết bệnh (với ImageUrl)
```json
{
  "success": true,
  "disease": {
    "Id": 1,
    "Name": "Cảm cúm",
    "ImageUrl": "https://cloudinary.com/disease-image.jpg",
    ...
  }
}
```

**PATCH /diseases/{id}/image** - Cập nhật ảnh (Admin only)
```bash
curl -X PATCH http://localhost:5000/api/diseases/1/image \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{"imageUrl": "https://cloudinary.com/new-image.jpg"}'
```

---

## 🎨 Frontend Components

### 1. DiseaseDetail Page
**File:** `Front_end/src/pages/user/DiseaseDetail/DiseaseDetail.jsx`

✅ Hiển thị ảnh featured bên phải
✅ Hiển thị placeholder nếu không có ảnh
✅ Animation fade-in khi ảnh load

**Cách sử dụng:**
- Ảnh tự động load từ `disease.ImageUrl`
- Nếu ảnh load lỗi → hiển thị placeholder với text

### 2. Diseases List Page
**File:** `Front_end/src/pages/user/Diseases/Diseases.jsx`

✅ Mỗi card bệnh có ảnh 200px
✅ Ảnh cover toàn bộ card
✅ Zoom effect khi hover

**Cách sử dụng:**
- Danh sách bệnh hiển thị ảnh ở trên
- Klik vào card → chuyển đến trang chi tiết

### 3. ProductCard Component
**File:** `Front_end/src/components/ProductCard/ProductCard.jsx`

✅ Ảnh sản phẩm 220px (cover)
✅ Gradient background
✅ Smooth zoom on hover

**Cách sử dụng:**
- Tự động lấy ảnh từ `product.imageUrl` hoặc `product.ImageUrl`
- Fallback → placeholder

### 4. ProductDetail Page
**File:** `Front_end/src/pages/user/ProductDetail/ProductDetail.jsx`

✅ Gallery lớn với discount badge
✅ Thumbnails bên dưới
✅ Fallback placeholder

---

## 📸 Cloudinary Integration

### Cấu hình Cloudinary (đã có sẵn)

**File:** `Back_end/src/config/cloudinaryConfig.js`

```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
```

### Upload ảnh lên Cloudinary

**Endpoint:** `POST /upload/product`
```bash
curl -X POST http://localhost:5000/api/upload/product \
  -F "image=@/path/to/image.jpg" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "url": "https://res.cloudinary.com/...",
  "publicId": "pharmacy/product/..."
}
```

---

## 🌐 URLs Mẫu (Testing)

Sử dụng placeholder images từ `placeholder.com`:

```
https://via.placeholder.com/500x400?text=Disease+Name
https://via.placeholder.com/300x200?text=Product+Name
```

Hoặc sử dụng ảnh thực từ Cloudinary:

```
https://res.cloudinary.com/[cloud_name]/image/upload/v[version]/[public_id]
```

---

## 🛠️ Cách update ảnh cho bệnh

### Cách 1: Update SQL trực tiếp
```sql
UPDATE public."Diseases"
SET "ImageUrl" = 'https://cloudinary.com/disease-image.jpg'
WHERE "Slug" = 'cam-cum';
```

### Cách 2: Dùng API
```javascript
// Frontend
const response = await fetch('/api/diseases/1/image', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    imageUrl: 'https://cloudinary.com/new-image.jpg'
  })
});
```

### Cách 3: Admin Dashboard (future)
- Tạo UI để upload ảnh
- Gọi endpoint `/upload/product`
- Save URL vào database

---

## ✅ Checklist

- [x] Migration database thêm cột ImageUrl
- [x] Backend return ImageUrl trong API
- [x] Frontend render ảnh từ ImageUrl
- [x] Fallback placeholder khi không có ảnh
- [x] Error handling cho ảnh load fail
- [x] Animation & styling cho ảnh
- [x] Responsive design
- [x] Cloudinary integration (sẵn có)

---

## 🚀 Next Steps

1. **Chạy migration:** 
   ```bash
   psql -U postgres -d pharmacy_db < CSDL/migration_add_image_to_disease.sql
   ```

2. **Upload ảnh Cloudinary:**
   - Admin dashboard upload
   - Hoặc cron job tự động

3. **Update ImageUrl cho từng bệnh:**
   - SQL: `UPDATE Diseases SET ImageUrl = '...' WHERE ...`
   - Hoặc dùng PATCH endpoint

4. **Test frontend:**
   - Mở `http://localhost:5173/diseases`
   - Kiểm tra ảnh hiển thị
   - Test disease detail page

---

## 📝 Notes

- Ảnh tự động có `object-fit: cover` → crop toàn bộ container
- Fallback placeholder là SVG (không cần request)
- Support error handling → ảnh fail load = placeholder
- Responsive trên mobile (stack layout)
- Animations mượt mà (CSS transitions)

---

**Support:** Nếu có vấn đề, check:
1. Database có cột `ImageUrl` chưa?
2. API return `ImageUrl` chưa?
3. Frontend console có error không?
4. Ảnh URL có valid không?
