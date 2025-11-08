-- =============================================
-- XÓA DỮ LIỆU CŨ VÀ INSERT LẠI PRODUCTS + ANNOUNCEMENTS
-- =============================================

-- 1. Xóa dữ liệu cũ
DELETE FROM public."Products";
DELETE FROM public."Announcements";

-- Reset sequence để ID bắt đầu từ 1
ALTER SEQUENCE public."Products_Id_seq" RESTART WITH 1;
ALTER SEQUENCE public."Announcements_Id_seq" RESTART WITH 1;

-- =============================================
-- 2. INSERT LẠI PRODUCTS (30 sản phẩm)
-- =============================================
INSERT INTO public."Products" ("Name", "Slug", "ShortDesc", "Description", "Category", "Brand", "Image", "Price", "Stock") VALUES
('Paracetamol 500mg', 'paracetamol-500mg', 'Ha sot, giam dau', 'Thuoc giam dau ha sot thong dung, an toan cho ca nguoi lon va tre em. Su dung khi sot, dau dau, dau rang.', 'thuoc', 'Generic', 'paracetamol.jpg', 15000, 100),
('Vitamin C 1000mg', 'vitamin-c-1000', 'Tang cuong de khang', 'Vien uong bo sung Vitamin C giup tang cuong he mien dich, chong oxy hoa, lam dep da.', 'vitamin', 'Vitamin World', 'vitamin-c.jpg', 65000, 200),
('Siro ho tre em Bao Thanh', 'siro-ho-tre-em', 'Giam ho, diu hong', 'Siro ho an toan cho tre em, giam ho, long dom, diu hong. Thanh phan thao duoc tu nhien.', 'thuoc', 'Bao Thanh', 'ibuprofen.jpg', 42000, 120),
('Oresol - Bu nuoc dien giai', 'oresol-bu-nuoc', 'Bu nuoc khi tieu chay', 'Dung dich bu nuoc va dien giai khi tieu chay, non mua, mat nuoc do sot hoac van dong manh.', 'thuoc', 'Generic', 'cephalexin.jpg', 22000, 300),
('Amoxicillin 500mg', 'amoxicillin-500mg', 'Khang sinh pho rong', 'Thuoc khang sinh Amoxicillin 500mg, dieu tri nhiem khuan duong ho hap, tieu hoa. Thanh phan: Amoxicillin trihydrate.', 'thuoc', 'Thai Pho', 'amoxicillin.jpg', 28000, 120),
('Azithromycin 500mg', 'azithromycin-500mg', 'Khang sinh the he moi', 'Thuoc khang sinh macrolide, hieu qua cao voi nhieu chung vi khuan. Dieu tri viem phe quan, nhiem khuan tai.', 'thuoc', 'Domesco', 'azithromycin.jpg', 45000, 80),
('Aspirin 500mg', 'aspirin-500mg', 'Giam dau ha sot', 'Aspirin nguyen chat 500mg, giam dau, ha sot, chong viem. Su dung cho dau dau, dau co, dau khop.', 'thuoc', 'Bayer', 'aspirin.jpg', 18000, 200),
('Diclofenac 50mg', 'diclofenac-50mg', 'Chong viem, giam dau', 'Thuoc chong viem khong steroid Diclofenac, giam dau cap tinh, man tinh, sot.', 'thuoc', 'Novartis', 'diclofenac.jpg', 22000, 150),
('Mefenamic Acid 500mg', 'mefenamic-acid-500mg', 'Chong viem hieu qua', 'Acid Mefenamic 500mg, chong viem, giam dau nhuc, dau bung kinh nguyet.', 'thuoc', 'Sanofi', 'mefenamic.jpg', 24000, 140),
('Naproxen 500mg', 'naproxen-500mg', 'Giam dau lau dai', 'Naproxen 500mg, chong viem NSAID, giam dau keo dai, ha sot. An toan voi da day.', 'thuoc', 'Roche', 'naproxen.jpg', 26000, 130),
('Doxycycline 100mg', 'doxycycline-100mg', 'Khang sinh rong pho', 'Thuoc khang sinh Doxycycline, dieu tri nhiem khuan, mun trung ca, benh Lyme.', 'thuoc', 'Farma', 'doxycycline.jpg', 32000, 110),
('Ciprofloxacin 500mg', 'ciprofloxacin-500mg', 'Khang sinh Fluoroquinolone', 'Thuoc khang sinh Ciprofloxacin 500mg, dieu tri nhiem khuan tieu hoa, tiet nieu.', 'thuoc', 'Cipla', 'ciprofloxacin.jpg', 38000, 95),
('Metronidazole 250mg', 'metronidazole-250mg', 'Khang sinh dac biet', 'Metronidazole 250mg, dieu tri nhiem khuan gay amoeba, trichomonas, Giardia.', 'thuoc', 'Biofarma', 'metronidazole.jpg', 20000, 200),
('Vitamin D3 1000IU', 'vitamin-d3-1000iu', 'Manh xuong, mien dich', 'Vitamin D3 1000 don vi quoc te, ho tro hap thu canxi, manh xuong, tang mien dich.', 'vitamin', 'Nutricost', 'vitamin-d3.jpg', 52000, 180),
('Calcium + Vitamin D', 'calcium-vitamin-d', 'Cai thien xuong khop', 'Canxi + Vitamin D3, ho tro suc khoe xuong, phong chong loang xuong cho nguoi lon tuoi.', 'vitamin', 'Nature Made', 'calcium.jpg', 58000, 160),
('Omega 3 Fish Oil', 'omega-3-fish-oil', 'Bao ve tim mach', 'Dau ca Omega 3, bao ve tim mach, giam cholesterol, tot cho nao bo.', 'vitamin', 'Kirkland', 'omega3.jpg', 48000, 140),
('Collagen Type I + II', 'collagen-type-1-2', 'Lam dep da, khop', 'Collagen thuy phan, ho tro da san chac, khop linh hoat, toc mong khoe.', 'vitamin', 'EFAVIT', 'collagen.jpg', 62000, 100),
('Vien Multivitamin hang ngay', 'multivitamin-daily', 'Bo sung vitamin tong hop', 'Vien nen tong hop 13 vitamin + khoang chat, bo sung nang luong hang ngay.', 'vitamin', 'Centrum', 'multivitamin.jpg', 72000, 160),
('Dau goi Chong gau', 'dau-goi-chong-gau', 'Khu gau hieu qua', 'Dau goi dac tri, khu gau, ngua da dau, nuoi duong toc mem muot.', 'cham-soc', 'Sunsilk', 'anti-dandruff.jpg', 32000, 250),
('Sua rua mat Cleanser', 'sua-rua-mat-cleanser', 'Sach sau, min da', 'Sua rua mat diu nhe, loai bo bui ban, makeup, duong am da mat.', 'cham-soc', 'Cetaphil', 'cleanser.jpg', 45000, 200),
('Kem chong nang SPF 50', 'kem-chong-nang-spf50', 'Bao ve 8 tieng', 'Kem chong nang SPF 50+ PA+++, bao ve da khoi tia UV, khong nhon, de tay rua.', 'cham-soc', 'Sunplay', 'sunscreen.jpg', 55000, 180),
('Mat na cham soc da Face Mask', 'face-mask-care', 'Duong am sau', 'Mat na giay chua serum duong chat, cap am, sang da, su dung 2-3 lan/tuan.', 'cham-soc', 'Nature Republic', 'face-mask.jpg', 38000, 300),
('Kem danh rang Fluoride', 'kem-danh-rang-fluoride', 'Bao ve sau rang', 'Kem danh rang chua Fluoride, ngan ngua sau rang, lam sang men rang.', 'cham-soc', 'Colgate', 'toothpaste.jpg', 25000, 400),
('Dau goi va xa 2 in 1 Shampoo', 'shampoo-2-in-1', 'Muot va bong toc', 'Dau goi xa 2 trong 1, giau vitamin E, nuoi duong toc mem muot, chong gau.', 'cham-soc', 'Pantene', 'shampoo.jpg', 36000, 280),
('Nuoc suc mieng Mouthwash', 'mouthwash-antiseptic', 'Diet khuan, tuoi mieng', 'Nuoc suc mieng sat trung, giam viem loi, hoi mieng, thom tho suot ngay.', 'cham-soc', 'Listerine', 'mouthwash.jpg', 68000, 200),
('May xong hoi Nebulizer', 'may-xong-hoi-nebulizer', 'Chua hen, ho', 'May xong hoi tao hat min, hieu qua dieu tri hen suyen, ho man tinh. De su dung.', 'thiet-bi', 'Medel', 'nebulizer.jpg', 380000, 30),
('Hop so cuu First Aid', 'hop-so-cuu-first-aid', 'San sang ung cuu', 'Hop so cuu day du tieu chuan, chua bang, gac, thuoc sat trung, bong y te.', 'thiet-bi', 'Viet Health', 'first-aid.jpg', 85000, 120),
('May do duong huyet Glucose Meter', 'glucose-meter', 'Do duong huyet nhanh', 'May do duong huyet chinh xac cao, ket qua trong 5 giay, kem 10 que test.', 'thiet-bi', 'Accu-Chek', 'glucose-meter.jpg', 250000, 50),
('Huyet ap ke dien tu BP Monitor', 'bp-monitor-digital', 'Do huyet ap di dong', 'May do huyet ap canh tay nho gon, pin lau 60h, man hinh LED ro rang.', 'thiet-bi', 'SENCOR', 'bp-monitor.jpg', 320000, 40),
('Nhiet ke hong ngoai Thermometer', 'thermometer-infrared', 'Do nhiet do khong tiep xuc', 'Nhiet ke hong ngoai do nhanh 1 giay, khong can tiep xuc, man hinh LED.', 'thiet-bi', 'Beurer', 'thermometer.jpg', 180000, 60);

-- =============================================
-- 3. INSERT LẠI ANNOUNCEMENTS (2 thông báo)
-- =============================================
INSERT INTO public."Announcements" ("Title", "Content", "Url") VALUES
('Chao mung den hieu thuoc truc tuyen', 'Mua sam an toan - Giao nhanh toan quoc.', 'http://localhost:5173/shop'),
('Khuyen mai tuan nay: Giam 20% Vitamin C', 'Ap dung den Chu nhat cho san pham Vitamin C.', 'http://localhost:5173/product/2');

-- =============================================
-- 4. THÔNG BÁO HOÀN THÀNH
-- =============================================
DO $$
BEGIN
    RAISE NOTICE '✅ ĐÃ XÓA VÀ INSERT LẠI THÀNH CÔNG!';
    RAISE NOTICE '📦 Products: 30 sản phẩm (không có ký tự đặc biệt)';
    RAISE NOTICE '📢 Announcements: 2 thông báo';
    RAISE NOTICE '🔧 Encoding đã được sửa để tránh lỗi hiển thị';
END $$;