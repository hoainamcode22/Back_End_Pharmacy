# 🔧 FIX: Ảnh bị trùng giữa 2 sản phẩm

## ❌ **Vấn đề:**
- **Siro ho trẻ em Bảo Thanh** - dùng ảnh `ibuprofen.jpg`
- **Oresol - Bù nước điện giải** - cũng dùng ảnh `ibuprofen.jpg` ❌ (TRÙNG!)

## ✅ **Giải pháp:**
Đổi ảnh Oresol sang dùng **`cephalexin.jpg`** (ảnh chưa được sử dụng)

---

## 📋 **Cách sửa:**

### **Option 1: Chạy file SQL fix (Khuyến nghị)**
```bash
# Vào thư mục CSDL
cd Back_end/CSDL

# Chạy file fix
psql -U postgres -d pharmacy_db -f fix_oresol_image.sql
```

### **Option 2: Chạy SQL trực tiếp trong pgAdmin hoặc psql**
```sql
UPDATE public."Products" 
SET "Image" = 'cephalexin.jpg'
WHERE "Slug" = 'oresol-bu-nuoc';
```

### **Option 3: Import lại toàn bộ database**
```bash
# Drop database cũ
psql -U postgres -c "DROP DATABASE IF EXISTS pharmacy_db;"

# Tạo database mới
psql -U postgres -c "CREATE DATABASE pharmacy_db;"

# Import file SQL đã sửa
psql -U postgres -d pharmacy_db -f pharmacy_db_v2.sql
```

---

## 🎯 **Kết quả sau khi sửa:**

| Sản phẩm | Ảnh cũ | Ảnh mới |
|----------|--------|---------|
| Siro ho trẻ em | `ibuprofen.jpg` | `ibuprofen.jpg` (giữ nguyên) |
| Oresol - Bù nước | `ibuprofen.jpg` ❌ | `cephalexin.jpg` ✅ |

---

## 📝 **Danh sách ảnh trong thư mục:**
```
Back_end/public/images/
├── ibuprofen.jpg        (Siro ho)
├── cephalexin.jpg       (Oresol) ← ẢNH MỚI
├── paracetamol.jpg
├── vitamin-c.jpg
├── amoxicillin.jpg
└── ... (27 ảnh khác)
```

---

## ⚠️ **Lưu ý:**
- Sau khi update database, **restart backend server** để áp dụng thay đổi
- Frontend sẽ tự động lấy ảnh mới từ backend
- Không cần sửa code frontend

---

## 🔍 **Kiểm tra kết quả:**
```sql
-- Xem 2 sản phẩm này
SELECT "Id", "Name", "Image" 
FROM public."Products" 
WHERE "Slug" IN ('oresol-bu-nuoc', 'siro-ho-tre-em');
```

Kết quả mong đợi:
```
 Id |           Name           |     Image      
----+--------------------------+----------------
  3 | Siro ho trẻ em Bảo Thanh | ibuprofen.jpg
  4 | Oresol - Bù nước điện giải | cephalexin.jpg
```
