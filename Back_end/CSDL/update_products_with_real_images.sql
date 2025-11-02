-- =============================================
-- CẬP NHẬT ẢNH SẢN PHẨM - KHỚP VỚI FILE THỰC TẾ
-- =============================================

-- Xóa dữ liệu cũ (nếu cần reset hoàn toàn)
-- TRUNCATE TABLE "Products" CASCADE;

-- XÓA sản phẩm cũ để thêm lại với ảnh đúng
DELETE FROM "Products";

-- THÊM LẠI 30 SẢN PHẨM VỚI ẢNH THỰC TẾ
INSERT INTO public."Products" ("Name", "Slug", "ShortDesc", "Description", "Category", "Brand", "Image", "Price", "Stock") VALUES

-- THUỐC (10 sản phẩm)
('Paracetamol 500mg', 'paracetamol-500mg', 'Hạ sốt, giảm đau', 'Thuốc giảm đau hạ sốt thông dụng, an toàn cho cả người lớn và trẻ em. Sử dụng khi sốt, đau đầu, đau răng.', 'thuoc', 'Generic', '/images/paracetamol.jpg', 15000, 100),

('Ibuprofen 400mg', 'ibuprofen-400mg', 'Giảm đau, hạ sốt', 'Thuốc chống viêm không steroid, giảm đau, hạ sốt hiệu quả. Dùng cho đau đầu, đau răng, đau cơ.', 'thuoc', 'Generic', '/images/ibuprofen.jpg', 25000, 150),

('Aspirin 500mg', 'aspirin-500mg', 'Giảm đau hạ sốt', 'Aspirin nguyên chất 500mg, giảm đau, hạ sốt, chống viêm. Sử dụng cho đau đầu, đau cơ, đau khớp.', 'thuoc', 'Bayer', '/images/aspirin.jpg', 18000, 200),

('Diclofenac 50mg', 'diclofenac-50mg', 'Chống viêm, giảm đau', 'Thuốc chống viêm không steroid Diclofenac, giảm đau cấp tính, mạn tính, sốt.', 'thuoc', 'Novartis', '/images/diclofenac.jpg', 22000, 150),

('Mefenamic Acid 500mg', 'mefenamic-acid-500mg', 'Chống viêm hiệu quả', 'Acid Mefenamic 500mg, chống viêm, giảm đau nhức, đau bụng kinh nguyệt.', 'thuoc', 'Sanofi', '/images/mefenamic.jpg', 24000, 140),

('Naproxen 500mg', 'naproxen-500mg', 'Giảm đau lâu dài', 'Naproxen 500mg, chống viêm NSAID, giảm đau kéo dài, hạ sốt. An toàn với dạ dày.', 'thuoc', 'Roche', '/images/naproxen.jpg', 26000, 130),

('Amoxicillin 500mg', 'amoxicillin-500mg', 'Kháng sinh phổ rộng', 'Thuốc kháng sinh Amoxicillin 500mg, điều trị nhiễm khuẩn đường hô hấp, tiêu hóa. Thành phần: Amoxicillin trihydrate.', 'thuoc', 'Thái Phố', '/images/amoxicillin.jpg', 28000, 120),

('Cephalexin 500mg', 'cephalexin-500mg', 'Kháng sinh Cephalosporin', 'Kháng sinh Cephalexin 500mg, điều trị viêm nhiễm da, mô mềm, đường tiêu hóa. Được bác sĩ kê đơn.', 'thuoc', 'Abbott', '/images/cephalexin.jpg', 35000, 100),

('Azithromycin 500mg', 'azithromycin-500mg', 'Kháng sinh thế hệ mới', 'Thuốc kháng sinh macrolide, hiệu quả cao với nhiều chủng vi khuẩn. Điều trị viêm phế quản, nhiễm khuẩn tai.', 'thuoc', 'Domesco', '/images/azithromycin.jpg', 45000, 80),

('Ciprofloxacin 500mg', 'ciprofloxacin-500mg', 'Kháng sinh Fluoroquinolone', 'Thuốc kháng sinh Ciprofloxacin 500mg, điều trị nhiễm khuẩn tiêu hóa, tiết niệu.', 'thuoc', 'Cipla', '/images/ciprofloxacin.jpg', 38000, 95),

('Doxycycline 100mg', 'doxycycline-100mg', 'Kháng sinh rộng phổ', 'Thuốc kháng sinh Doxycycline, điều trị nhiễm khuẩn, mụn trứng cá, bệnh Lyme.', 'thuoc', 'Farma', '/images/doxycycline.jpg', 32000, 110),

('Metronidazole 250mg', 'metronidazole-250mg', 'Kháng sinh đặc biệt', 'Metronidazole 250mg, điều trị nhiễm khuẩn gây amoeba, trichomonas, Giardia.', 'thuoc', 'Biofarma', '/images/metronidazole.jpg', 20000, 200),

-- VITAMIN (5 sản phẩm)
('Vitamin C 1000mg', 'vitamin-c-1000', 'Tăng cường đề kháng', 'Viên uống bổ sung Vitamin C giúp tăng cường hệ miễn dịch, chống oxy hóa, làm đẹp da.', 'vitamin', 'Vitamin World', '/images/vitamin-c.jpg', 65000, 200),

('Vitamin D3 1000IU', 'vitamin-d3-1000iu', 'Mạnh xương, miễn dịch', 'Vitamin D3 1000 đơn vị quốc tế, hỗ trợ hấp thu canxi, mạnh xương, tăng miễn dịch.', 'vitamin', 'Nutricost', '/images/vitamin-d3.jpg', 52000, 180),

('Omega 3 Fish Oil', 'omega-3-fish-oil', 'Bảo vệ tim mạch', 'Dầu cá Omega 3, bảo vệ tim mạch, giảm cholesterol, tốt cho não bộ.', 'vitamin', 'Kirkland', '/images/omega3.jpg', 48000, 140),

('Viên Multivitamin hàng ngày', 'multivitamin-daily', 'Bổ sung vitamin tổng hợp', 'Viên kép tổng hợp 13 vitamin + khoáng chất, bổ sung năng lượng hàng ngày.', 'vitamin', 'Centrum', '/images/multivitamin.jpg', 72000, 160),

('Calcium + Vitamin D', 'calcium-vitamin-d', 'Cải thiện xương khớp', 'Canxi + Vitamin D3, hỗ trợ sức khỏe xương, phòng chứng loãng xương cho người lớn tuổi.', 'vitamin', 'Nature Made', '/images/calcium.jpg', 58000, 160),

('Collagen Type I + II', 'collagen-type-1-2', 'Làm đẹp da, khớp', 'Collagen thủy phân, hỗ trợ da săn chắc, khớp linh hoạt, tóc móng khỏe.', 'vitamin', 'EFAVIT', '/images/collagen.jpg', 62000, 100),

-- CHĂM SÓC SỨC KHỎE (8 sản phẩm)
('Dầu gội và xả 2 in 1', 'shampoo-2-in-1', 'Mượt và bóng tóc', 'Dầu gội xả 2 trong 1, giàu vitamin E, nuôi dưỡng tóc mềm mượt, chống gàu.', 'cham-soc', 'Pantene', '/images/shampoo.jpg', 36000, 280),

('Kem chống nắng SPF 50', 'kem-chong-nang-spf50', 'Bảo vệ 8 tiếng', 'Kem chống nắng SPF 50+ PA+++, bảo vệ da khỏi tia UV, không nhờn, dễ tẩy rửa.', 'cham-soc', 'Sunplay', '/images/sunscreen.jpg', 55000, 180),

('Nước súc miệng Mouthwash', 'mouthwash-antiseptic', 'Diệt khuẩn, tươi miệng', 'Nước súc miệng sát trùng, giảm mụn lở miệng, hơi thở thơm tho.', 'cham-soc', 'Listerine', '/images/mouthwash.jpg', 68000, 200),

('Kem đánh răng Fluoride', 'kem-danh-rang-fluoride', 'Bảo vệ sâu răng', 'Kem đánh răng chứa Fluoride, ngăn ngừa sâu răng, làm sáng răng.', 'cham-soc', 'Colgate', '/images/toothpaste.jpg', 25000, 400),

('Sữa rửa mặt Cleanser', 'sua-rua-mat-cleanser', 'Sạch sâu, mịn da', 'Sữa rửa mặt dịu nhẹ, loại bỏ bụi bẩn, makeup, dưỡng ẩm da mặt.', 'cham-soc', 'Cetaphil', '/images/cleanser.jpg', 45000, 200),

('Dầu gội Chống gàu', 'dau-goi-chong-gau', 'Khử gàu hiệu quả', 'Dầu gội đặc trị, khử gàu, ngứa da đầu, nuôi dưỡng tóc mềm mượt.', 'cham-soc', 'Sunsilk', '/images/anti-dandruff.jpg', 32000, 250),

('Mặt nạ chăm sóc da Face Mask', 'face-mask-care', 'Dưỡng ẩm sâu', 'Mặt nạ giấy chứa serum dưỡng chất, cấp ẩm, sáng da, sử dụng 2-3 lần/tuần.', 'cham-soc', 'Nature Republic', '/images/face-mask.jpg', 38000, 300),

-- THIẾT BỊ Y TẾ (5 sản phẩm)
('Nhiệt kế hồng ngoại', 'thermometer-infrared', 'Đo nhiệt độ không tiếp xúc', 'Nhiệt kế hồng ngoại đo nhanh 1 giây, không cần tiếp xúc, màn hình LED.', 'thiet-bi', 'Beurer', '/images/thermometer.jpg', 180000, 60),

('Huyết áp kế điện tử', 'bp-monitor-digital', 'Đo huyết áp di động', 'Máy đo huyết áp cơ tay nhỏ gọn, pin lâu 60h, màn hình LED rõ ràng.', 'thiet-bi', 'SENCOR', '/images/bp-monitor.jpg', 320000, 40),

('Máy đo đường huyết', 'glucose-meter', 'Đo đường huyết nhanh', 'Máy đo đường huyết chính xác cao, kết quả trong 5 giây, kèm 10 que test.', 'thiet-bi', 'Accu-Chek', '/images/glucose-meter.jpg', 250000, 50),

('Hộp sơ cứu First Aid', 'hop-so-cuu-first-aid', 'Sẵn sàng ứng cứu', 'Hộp sơ cứu đầy đủ tiêu chuẩn, chứa băng, gạc, thuốc sát trùng, bông y tế.', 'thiet-bi', 'Viet Health', '/images/first-aid.jpg', 85000, 120),

('Máy xông hơi Nebulizer', 'may-xong-hoi-nebulizer', 'Chữa hen, ho', 'Máy xông hơi tạo hạt mịn, hiệu quả điều trị hen suyễn, ho mạn tính. Dễ sử dụng.', 'thiet-bi', 'Medel', '/images/nebulizer.jpg', 380000, 30);

-- =============================================
-- THÔNG BÁO KẾT QUẢ
-- =============================================
DO $$
DECLARE
    product_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO product_count FROM "Products";
    RAISE NOTICE '';
    RAISE NOTICE '✅ CẬP NHẬT THÀNH CÔNG!';
    RAISE NOTICE '📦 Tổng số sản phẩm: %', product_count;
    RAISE NOTICE '🖼️  Tất cả ảnh đã được cập nhật đúng đường dẫn';
    RAISE NOTICE '📁 Đường dẫn: /images/[tên-sản-phẩm].jpg';
    RAISE NOTICE '';
    RAISE NOTICE '💡 Kiểm tra:';
    RAISE NOTICE '   1. Backend: http://localhost:5001/images/paracetamol.jpg';
    RAISE NOTICE '   2. API: http://localhost:5001/api/products';
    RAISE NOTICE '   3. Frontend: http://localhost:5173/shop';
    RAISE NOTICE '';
END $$;
