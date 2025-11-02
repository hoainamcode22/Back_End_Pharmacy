# 📸 HƯỚNG DẪN THÊM HÌNH ẢNH SẢN PHẨM

## 🎯 Mục đích

File này hướng dẫn cách thêm hình ảnh sản phẩm cho trang Shop của Pharmacy E-commerce.

---

## 📁 Cấu trúc thư mục

```
Front_end/
└── public/
    └── images/
        └── products/          👈 Thêm hình ở đây
            ├── paracetamol.jpg
            ├── ibuprofen.jpg
            ├── aspirin.jpg
            └── ... (30 hình tổng cộng)
```

---

## 📋 DANH SÁCH 30 HÌNH CẦN THÊM

### 💊 Danh mục 1: Thuốc giảm đau - Hạ sốt (6 ảnh)

1. `paracetamol.jpg` - Paracetamol 500mg
2. `ibuprofen.jpg` - Ibuprofen 400mg
3. `aspirin.jpg` - Aspirin 100mg
4. `diclofenac.jpg` - Diclofenac 50mg
5. `mefenamic.jpg` - Mefenamic Acid 500mg
6. `naproxen.jpg` - Naproxen 250mg

### 🌿 Danh mục 2: Vitamin & Thực phẩm chức năng (6 ảnh)

7. `vitamin-c.jpg` - Vitamin C 1000mg
8. `vitamin-d3.jpg` - Vitamin D3 2000IU
9. `omega3.jpg` - Omega-3 Fish Oil
10. `multivitamin.jpg` - Multivitamin tổng hợp
11. `calcium.jpg` - Calcium + D3
12. `collagen.jpg` - Collagen peptide

### 💉 Danh mục 3: Thuốc kháng sinh (6 ảnh)

13. `amoxicillin.jpg` - Amoxicillin 500mg
14. `cephalexin.jpg` - Cephalexin 500mg
15. `azithromycin.jpg` - Azithromycin 250mg
16. `ciprofloxacin.jpg` - Ciprofloxacin 500mg
17. `doxycycline.jpg` - Doxycycline 100mg
18. `metronidazole.jpg` - Metronidazole 250mg

### 🧴 Danh mục 4: Chăm sóc cá nhân (6 ảnh)

19. `shampoo.jpg` - Dầu gội đầu dược liệu
20. `sunscreen.jpg` - Kem chống nắng SPF50
21. `mouthwash.jpg` - Nước súc miệng Listerine
22. `toothpaste.jpg` - Kem đánh răng Sensodyne
23. `cleanser.jpg` - Sữa rửa mặt La Roche
24. `anti-dandruff.jpg` - Dầu gội trị gàu

### 🩺 Danh mục 5: Dụng cụ y tế (6 ảnh)

25. `thermometer.jpg` - Nhiệt kế điện tử
26. `bp-monitor.jpg` - Máy đo huyết áp
27. `glucose-meter.jpg` - Máy đo đường huyết
28. `face-mask.jpg` - Khẩu trang y tế (Hộp 50c)
29. `first-aid.jpg` - Bộ sơ cứu gia đình
30. `nebulizer.jpg` - Máy xông mũi họng

---

## ✅ YÊU CẦU HÌNH ẢNH

### Kích thước khuyến nghị:

- **Width:** 400-800px
- **Height:** 400-800px
- **Tỷ lệ:** 1:1 (vuông) hoặc 3:4 (dọc)
- **Format:** JPG (nén tốt, dung lượng nhỏ)
- **Dung lượng:** < 200KB/ảnh

### Chất lượng:

- ✅ Sản phẩm nổi bật, rõ nét
- ✅ Nền trắng hoặc nền sáng
- ✅ Không có watermark
- ✅ Hình thật của sản phẩm (tránh mockup)

---

## 🚀 CÁCH THÊM HÌNH

### Bước 1: Tải hình về

Tìm hình trên Google Images hoặc các trang:

- unsplash.com
- pexels.com
- freepik.com (tìm từ khóa "medicine", "vitamin", "medical device")

### Bước 2: Đổi tên file

Đổi tên file theo đúng danh sách trên (ví dụ: `paracetamol.jpg`)

### Bước 3: Copy vào thư mục

Copy tất cả 30 file vào: `Front_end/public/images/products/`

### Bước 4: Khởi động lại server

```bash
npm run dev
```

### Bước 5: Kiểm tra

Mở trình duyệt: `http://localhost:5173/shop`

---

## 🔧 TROUBLESHOOTING

### ❌ Hình không hiển thị?

1. Kiểm tra tên file khớp với danh sách (lowercase, không dấu)
2. Kiểm tra đường dẫn: `public/images/products/`
3. Refresh lại trình duyệt (Ctrl + F5)
4. Xem Console log có lỗi không (F12)

### ❌ Hình bị vỡ layout?

1. Resize hình về 600x600px
2. Nén hình bằng TinyPNG.com
3. Convert sang định dạng JPG

---

## 📌 LƯU Ý QUAN TRỌNG

⚠️ **KHÔNG** thay đổi tên file trong code
⚠️ **KHÔNG** đặt hình vào thư mục `src/assets`
⚠️ **PHẢI** đặt trong `public/images/products/`
✅ Tên file **PHẢI KHỚP CHÍNH XÁC** với danh sách trên

---

## 🎨 KẾT QUẢ MONG ĐỢI

Sau khi thêm đủ 30 hình, trang Shop sẽ hiển thị:

- ✅ 5 danh mục thuốc
- ✅ 6 sản phẩm/danh mục = 30 sản phẩm
- ✅ Grid layout 6 cột trên desktop
- ✅ Responsive trên mobile
- ✅ Hover effects trên từng sản phẩm
- ✅ Giá + giảm giá + badge stock

---

**Tạo bởi:** GitHub Copilot  
**Ngày:** 27/10/2025  
**Version:** 1.0
