-- =============================================
-- PHARMACY DATABASE SCHEMA - VERSION 2.0
-- Cập nhật: 28/10/2025
-- Đồng bộ với giao diện Front-end
-- =============================================

-- Drop existing tables (nếu có)
DROP TABLE IF EXISTS public."ChatMessages" CASCADE;
DROP TABLE IF EXISTS public."ChatThreads" CASCADE;
DROP TABLE IF EXISTS public."Comments" CASCADE;
DROP TABLE IF EXISTS public."OrderItems" CASCADE;
DROP TABLE IF EXISTS public."Orders" CASCADE;
DROP TABLE IF EXISTS public."CartItems" CASCADE;
DROP TABLE IF EXISTS public."Products" CASCADE;
DROP TABLE IF EXISTS public."Users" CASCADE;
DROP TABLE IF EXISTS public."Announcements" CASCADE;
DROP TABLE IF EXISTS public."Diseases" CASCADE;

-- =============================================
-- 1. BẢNG USERS (Người dùng)
-- =============================================
CREATE TABLE public."Users" (
    "Id" BIGSERIAL PRIMARY KEY,
    "Username" VARCHAR(100) NOT NULL UNIQUE,
    "Password" TEXT NOT NULL,
    "Fullname" VARCHAR(200) DEFAULT '(Chưa cập nhật)',
    "Email" VARCHAR(200) NOT NULL UNIQUE,
    "Phone" VARCHAR(20),
    "Address" TEXT,
    "Avatar" TEXT,
    "Role" VARCHAR(20) DEFAULT 'customer' NOT NULL CHECK ("Role" IN ('admin', 'customer')),
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "UpdatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Index cho tìm kiếm nhanh
CREATE INDEX idx_users_email ON public."Users" (LOWER("Email"));
CREATE INDEX idx_users_role ON public."Users" ("Role");

COMMENT ON TABLE public."Users" IS 'Quản lý tài khoản người dùng (Admin + Customer)';
COMMENT ON COLUMN public."Users"."Role" IS 'admin: Quản trị viên | customer: Khách hàng';

-- =============================================
-- 2. BẢNG PRODUCTS (Sản phẩm)
-- =============================================
CREATE TABLE public."Products" (
    "Id" BIGSERIAL PRIMARY KEY,
    "ProductName" VARCHAR(255) NOT NULL,
    "Name" VARCHAR(255) NOT NULL,
    "Slug" VARCHAR(255) UNIQUE,
    "ShortDesc" VARCHAR(500),
    "Description" TEXT,
    "Category" VARCHAR(120) CHECK ("Category" IN ('thuoc', 'vitamin', 'cham-soc', 'thiet-bi')),
    "Brand" VARCHAR(120),
    "Image" TEXT,
    "ImageURL" TEXT,
    "Price" NUMERIC(12,2) DEFAULT 0 NOT NULL CHECK ("Price" >= 0),
    "Stock" INTEGER DEFAULT 0 NOT NULL CHECK ("Stock" >= 0),
    "IsActive" BOOLEAN DEFAULT TRUE NOT NULL,
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "UpdatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Index cho search và filter
CREATE INDEX idx_products_name ON public."Products" ("Name");
CREATE INDEX idx_products_category ON public."Products" (LOWER("Category"));
CREATE INDEX idx_products_active ON public."Products" ("IsActive");

COMMENT ON TABLE public."Products" IS 'Danh sách sản phẩm thuốc và thiết bị y tế';
COMMENT ON COLUMN public."Products"."ProductName" IS 'Tên sản phẩm (dùng cho chat và API mới)';
COMMENT ON COLUMN public."Products"."Name" IS 'Tên sản phẩm (tương thích code cũ)';
COMMENT ON COLUMN public."Products"."Image" IS 'Tên file ảnh (dùng cho code cũ)';
COMMENT ON COLUMN public."Products"."ImageURL" IS 'Tên file ảnh (dùng cho chat và API mới)';
COMMENT ON COLUMN public."Products"."Category" IS 'thuoc: Thuốc | vitamin: Thực phẩm chức năng | cham-soc: Chăm sóc sức khỏe | thiet-bi: Thiết bị y tế';

-- =============================================
-- 3. BẢNG CART ITEMS (Giỏ hàng)
-- =============================================
CREATE TABLE public."CartItems" (
    "Id" BIGSERIAL PRIMARY KEY,
    "UserId" BIGINT NOT NULL REFERENCES public."Users"("Id") ON DELETE CASCADE,
    "ProductId" BIGINT NOT NULL REFERENCES public."Products"("Id") ON DELETE CASCADE,
    "Qty" INTEGER DEFAULT 1 NOT NULL CHECK ("Qty" > 0),
    "AddedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE("UserId", "ProductId")
);

CREATE INDEX idx_cartitems_user ON public."CartItems" ("UserId");

COMMENT ON TABLE public."CartItems" IS 'Giỏ hàng của khách hàng';

-- =============================================
-- 4. BẢNG ORDERS (Đơn hàng)
-- =============================================
CREATE TABLE public."Orders" (
    "Id" BIGSERIAL PRIMARY KEY,
    "Code" VARCHAR(50) UNIQUE,
    "UserId" BIGINT NOT NULL REFERENCES public."Users"("Id") ON DELETE CASCADE,
    "Status" VARCHAR(30) DEFAULT 'pending' NOT NULL CHECK ("Status" IN ('pending', 'confirmed', 'shipping', 'delivered', 'cancelled')),
    "Total" NUMERIC(12,2) DEFAULT 0 NOT NULL CHECK ("Total" >= 0),
    "Address" TEXT NOT NULL,
    "Phone" VARCHAR(20) NOT NULL,
    "Note" TEXT,
    "PaymentMethod" VARCHAR(20) DEFAULT 'COD' NOT NULL CHECK ("PaymentMethod" IN ('COD', 'Banking', 'Momo')),
    "ETA" DATE,
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "UpdatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_orders_user ON public."Orders" ("UserId");
CREATE INDEX idx_orders_status ON public."Orders" ("Status");
CREATE INDEX idx_orders_created ON public."Orders" ("CreatedAt" DESC);

COMMENT ON TABLE public."Orders" IS 'Đơn hàng của khách hàng';
COMMENT ON COLUMN public."Orders"."Status" IS 'pending: Chờ xác nhận | confirmed: Đã xác nhận | shipping: Đang giao | delivered: Đã giao | cancelled: Đã hủy';
COMMENT ON COLUMN public."Orders"."PaymentMethod" IS 'COD: Tiền mặt | Banking: Chuyển khoản | Momo: Ví điện tử';

-- =============================================
-- 5. BẢNG ORDER ITEMS (Chi tiết đơn hàng)
-- =============================================
CREATE TABLE public."OrderItems" (
    "Id" BIGSERIAL PRIMARY KEY,
    "OrderId" BIGINT NOT NULL REFERENCES public."Orders"("Id") ON DELETE CASCADE,
    "ProductId" BIGINT NOT NULL REFERENCES public."Products"("Id"),
    "ProductName" VARCHAR(255) NOT NULL,
    "ProductImage" TEXT,
    "Qty" INTEGER DEFAULT 1 NOT NULL CHECK ("Qty" > 0),
    "Price" NUMERIC(12,2) DEFAULT 0 NOT NULL CHECK ("Price" >= 0)
);

CREATE INDEX idx_orderitems_order ON public."OrderItems" ("OrderId");

COMMENT ON TABLE public."OrderItems" IS 'Chi tiết sản phẩm trong đơn hàng';
COMMENT ON COLUMN public."OrderItems"."ProductName" IS 'Lưu tên sản phẩm tại thời điểm mua';
COMMENT ON COLUMN public."OrderItems"."Price" IS 'Giá sản phẩm tại thời điểm mua';

-- =============================================
-- 6. BẢNG CHAT THREADS (Cuộc hội thoại hỗ trợ)
-- =============================================
CREATE TABLE public."ChatThreads" (
    "Id" BIGSERIAL PRIMARY KEY,
    "UserId" BIGINT NOT NULL REFERENCES public."Users"("Id") ON DELETE CASCADE,
    "Title" VARCHAR(255) NOT NULL,
    "AttachmentType" VARCHAR(20) CHECK ("AttachmentType" IN ('product', 'order', 'general')),
    "AttachmentId" VARCHAR(100),
    "Status" VARCHAR(20) DEFAULT 'active' CHECK ("Status" IN ('active', 'closed')),
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "UpdatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_threads_user ON public."ChatThreads" ("UserId");
CREATE INDEX idx_threads_status ON public."ChatThreads" ("Status");

COMMENT ON TABLE public."ChatThreads" IS 'Cuộc hội thoại chat hỗ trợ khách hàng';
COMMENT ON COLUMN public."ChatThreads"."AttachmentType" IS 'product: Chat về sản phẩm | order: Chat về đơn hàng | general: Chat chung';

-- =============================================
-- 7. BẢNG CHAT MESSAGES (Tin nhắn chat)
-- =============================================
CREATE TABLE public."ChatMessages" (
    "Id" BIGSERIAL PRIMARY KEY,
    "ThreadId" BIGINT NOT NULL REFERENCES public."ChatThreads"("Id") ON DELETE CASCADE,
    "SenderId" BIGINT NOT NULL REFERENCES public."Users"("Id"),
    "SenderRole" VARCHAR(20) NOT NULL CHECK ("SenderRole" IN ('admin', 'customer')),
    "Content" TEXT NOT NULL,
    "AttachedProductId" BIGINT REFERENCES public."Products"("Id") ON DELETE SET NULL,
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_messages_thread ON public."ChatMessages" ("ThreadId");
CREATE INDEX idx_messages_created ON public."ChatMessages" ("CreatedAt" ASC);
CREATE INDEX idx_messages_product ON public."ChatMessages" ("AttachedProductId");

COMMENT ON TABLE public."ChatMessages" IS 'Tin nhắn trong cuộc hội thoại chat';
COMMENT ON COLUMN public."ChatMessages"."AttachedProductId" IS 'ID sản phẩm đính kèm (User hỏi hoặc Bác sĩ giới thiệu)';

-- =============================================
-- 8. BẢNG COMMENTS (Đánh giá sản phẩm)
-- =============================================
CREATE TABLE public."Comments" (
    "Id" BIGSERIAL PRIMARY KEY,
    "UserId" BIGINT NOT NULL REFERENCES public."Users"("Id") ON DELETE CASCADE,
    "ProductId" BIGINT NOT NULL REFERENCES public."Products"("Id") ON DELETE CASCADE,
    "Rating" INTEGER CHECK ("Rating" >= 1 AND "Rating" <= 5),
    "Content" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_comments_product ON public."Comments" ("ProductId");
CREATE INDEX idx_comments_user ON public."Comments" ("UserId");

COMMENT ON TABLE public."Comments" IS 'Đánh giá và bình luận sản phẩm';

-- =============================================
-- 9. DỮ LIỆU MẪU (SAMPLE DATA)
-- =============================================

INSERT INTO public."Products" 
("ProductName", "Name", "Slug", "ShortDesc", "Description", "Category", "Brand", "Image", "ImageURL", "Price", "Stock") 
VALUES
('Paracetamol 500mg', 'Paracetamol 500mg', 'paracetamol-500mg', 'Hạ sốt, giảm đau', 'Thuốc giảm đau hạ sốt thông dụng, an toàn cho cả người lớn và trẻ em. Sử dụng khi sốt, đau đầu, đau răng.', 'thuoc', 'Generic', 'paracetamol.jpg', 'paracetamol.jpg', 15000, 100),
('Vitamin C 1000mg', 'Vitamin C 1000mg', 'vitamin-c-1000', 'Tăng cường đề kháng', 'Viên uống bổ sung Vitamin C giúp tăng cường hệ miễn dịch, chống oxy hóa, làm đẹp da.', 'vitamin', 'Vitamin World', 'vitamin-c.jpg', 'vitamin-c.jpg', 65000, 200),
('Siro ho trẻ em Bảo Thanh', 'Siro ho trẻ em Bảo Thanh', 'siro-ho-tre-em', 'Giảm ho, dịu họng', 'Siro ho an toàn cho trẻ em, giảm ho, long đờm, dịu họng. Thành phần thảo dược tự nhiên.', 'thuoc', 'Bảo Thanh', 'ibuprofen.jpg', 'ibuprofen.jpg', 42000, 120),
('Oresol - Bù nước điện giải', 'Oresol - Bù nước điện giải', 'oresol-bu-nuoc', 'Bù nước khi tiêu chảy', 'Dung dịch bù nước và điện giải khi tiêu chảy, nôn mửa, mất nước do sốt hoặc vận động mạnh.', 'thuoc', 'Generic', 'cephalexin.jpg', 'cephalexin.jpg', 22000, 300),
('Amoxicillin 500mg', 'Amoxicillin 500mg', 'amoxicillin-500mg', 'Kháng sinh phổ rộng', 'Thuốc kháng sinh Amoxicillin 500mg, điều trị nhiễm khuẩn đường hô hấp, tiêu hóa. Thành phần: Amoxicillin trihydrate.', 'thuoc', 'Thái Phố', 'amoxicillin.jpg', 'amoxicillin.jpg', 28000, 120),
('Azithromycin 500mg', 'Azithromycin 500mg', 'azithromycin-500mg', 'Kháng sinh thế hệ mới', 'Thuốc kháng sinh nhóm macrolide, hiệu quả cao với nhiều chủng vi khuẩn. Điều trị viêm phế quản, nhiễm khuẩn tai.', 'thuoc', 'Domesco', 'azithromycin.jpg', 'azithromycin.jpg', 45000, 80),
('Aspirin 500mg', 'Aspirin 500mg', 'aspirin-500mg', 'Giảm đau, hạ sốt', 'Aspirin nguyên chất 500mg, giảm đau, hạ sốt, chống viêm. Sử dụng cho đau đầu, đau cơ, đau khớp.', 'thuoc', 'Bayer', 'aspirin.jpg', 'aspirin.jpg', 18000, 200),
('Diclofenac 50mg', 'Diclofenac 50mg', 'diclofenac-50mg', 'Chống viêm, giảm đau', 'Thuốc chống viêm không steroid Diclofenac, giảm đau cấp và mãn tính, hạ sốt.', 'thuoc', 'Novartis', 'diclofenac.jpg', 'diclofenac.jpg', 22000, 150),
('Mefenamic Acid 500mg', 'Mefenamic Acid 500mg', 'mefenamic-acid-500mg', 'Chống viêm hiệu quả', 'Acid Mefenamic 500mg, chống viêm, giảm đau nhức, đau bụng kinh nguyệt.', 'thuoc', 'Sanofi', 'mefenamic.jpg', 'mefenamic.jpg', 24000, 140),
('Naproxen 500mg', 'Naproxen 500mg', 'naproxen-500mg', 'Giảm đau lâu dài', 'Naproxen 500mg, thuốc chống viêm NSAID, giảm đau kéo dài, hạ sốt. An toàn với dạ dày.', 'thuoc', 'Roche', 'naproxen.jpg', 'naproxen.jpg', 26000, 130),
('Doxycycline 100mg', 'Doxycycline 100mg', 'doxycycline-100mg', 'Kháng sinh phổ rộng', 'Thuốc kháng sinh Doxycycline, điều trị nhiễm khuẩn, mụn trứng cá, bệnh Lyme.', 'thuoc', 'Farma', 'doxycycline.jpg', 'doxycycline.jpg', 32000, 110),
('Ciprofloxacin 500mg', 'Ciprofloxacin 500mg', 'ciprofloxacin-500mg', 'Kháng sinh Fluoroquinolone', 'Thuốc kháng sinh Ciprofloxacin 500mg, điều trị nhiễm khuẩn tiêu hóa, tiết niệu.', 'thuoc', 'Cipla', 'ciprofloxacin.jpg', 'ciprofloxacin.jpg', 38000, 95),
('Metronidazole 250mg', 'Metronidazole 250mg', 'metronidazole-250mg', 'Kháng sinh đặc biệt', 'Metronidazole 250mg, điều trị nhiễm khuẩn do amoeba, trichomonas, Giardia.', 'thuoc', 'Biofarma', 'metronidazole.jpg', 'metronidazole.jpg', 20000, 200),
('Vitamin D3 1000IU', 'Vitamin D3 1000IU', 'vitamin-d3-1000iu', 'Mạnh xương, miễn dịch', 'Vitamin D3 1000 đơn vị quốc tế, hỗ trợ hấp thu canxi, giúp xương chắc khỏe, tăng miễn dịch.', 'vitamin', 'Nutricost', 'vitamin-d3.jpg', 'vitamin-d3.jpg', 52000, 180),
('Calcium + Vitamin D', 'Calcium + Vitamin D', 'calcium-vitamin-d', 'Cải thiện xương khớp', 'Canxi + Vitamin D3, hỗ trợ sức khỏe xương, phòng chống loãng xương cho người lớn tuổi.', 'vitamin', 'Nature Made', 'calcium.jpg', 'calcium.jpg', 58000, 160),
('Omega 3 Fish Oil', 'Omega 3 Fish Oil', 'omega-3-fish-oil', 'Bảo vệ tim mạch', 'Dầu cá Omega 3 giúp bảo vệ tim mạch, giảm cholesterol, tốt cho não bộ.', 'vitamin', 'Kirkland', 'omega3.jpg', 'omega3.jpg', 48000, 140),
('Collagen Type I + II', 'Collagen Type I + II', 'collagen-type-1-2', 'Làm đẹp da, khớp', 'Collagen thủy phân, giúp da săn chắc, khớp linh hoạt, tóc và móng khỏe.', 'vitamin', 'EFAVIT', 'collagen.jpg', 'collagen.jpg', 62000, 100),
('Viên Multivitamin hằng ngày', 'Viên Multivitamin hằng ngày', 'multivitamin-daily', 'Bổ sung vitamin tổng hợp', 'Viên nén tổng hợp 13 vitamin và khoáng chất, bổ sung năng lượng hằng ngày.', 'vitamin', 'Centrum', 'multivitamin.jpg', 'multivitamin.jpg', 72000, 160),
('Dầu gội chống gàu', 'Dầu gội chống gàu', 'dau-goi-chong-gau', 'Khử gàu hiệu quả', 'Dầu gội đặc trị, khử gàu, ngứa da đầu, nuôi dưỡng tóc mềm mượt.', 'cham-soc', 'Sunsilk', 'anti-dandruff.jpg', 'anti-dandruff.jpg', 32000, 250),
('Sữa rửa mặt Cleanser', 'Sữa rửa mặt Cleanser', 'sua-rua-mat-cleanser', 'Sạch sâu, mịn da', 'Sữa rửa mặt dịu nhẹ, loại bỏ bụi bẩn, trang điểm, dưỡng ẩm da mặt.', 'cham-soc', 'Cetaphil', 'cleanser.jpg', 'cleanser.jpg', 45000, 200),
('Kem chống nắng SPF 50', 'Kem chống nắng SPF 50', 'kem-chong-nang-spf50', 'Bảo vệ 8 tiếng', 'Kem chống nắng SPF 50+ PA+++, bảo vệ da khỏi tia UV, không nhờn, dễ rửa trôi.', 'cham-soc', 'Sunplay', 'sunscreen.jpg', 'sunscreen.jpg', 55000, 180),
('Mặt nạ chăm sóc da', 'Mặt nạ chăm sóc da', 'face-mask-care', 'Dưỡng ẩm sâu', 'Mặt nạ giấy chứa serum dưỡng chất, cấp ẩm, sáng da, dùng 2-3 lần/tuần.', 'cham-soc', 'Nature Republic', 'face-mask.jpg', 'face-mask.jpg', 38000, 300),
('Kem đánh răng Fluoride', 'Kem đánh răng Fluoride', 'kem-danh-rang-fluoride', 'Bảo vệ men răng', 'Kem đánh răng chứa Fluoride, ngăn ngừa sâu răng, làm sáng men răng.', 'cham-soc', 'Colgate', 'toothpaste.jpg', 'toothpaste.jpg', 25000, 400),
('Dầu gội xả 2 trong 1', 'Dầu gội xả 2 trong 1', 'shampoo-2-in-1', 'Mượt và bóng tóc', 'Dầu gội xả 2 trong 1, giàu vitamin E, nuôi dưỡng tóc mềm mượt, chống gàu.', 'cham-soc', 'Pantene', 'shampoo.jpg', 'shampoo.jpg', 36000, 280),
('Nước súc miệng kháng khuẩn', 'Nước súc miệng kháng khuẩn', 'mouthwash-antiseptic', 'Diệt khuẩn, thơm miệng', 'Nước súc miệng sát trùng, giảm viêm lợi, hôi miệng, thơm tho suốt ngày.', 'cham-soc', 'Listerine', 'mouthwash.jpg', 'mouthwash.jpg', 68000, 200),
('Máy xông hơi Nebulizer', 'Máy xông hơi Nebulizer', 'may-xong-hoi-nebulizer', 'Chữa hen, ho', 'Máy xông hơi tạo hạt mịn, hiệu quả điều trị hen suyễn, ho mãn tính. Dễ sử dụng.', 'thiet-bi', 'Medel', 'nebulizer.jpg', 'nebulizer.jpg', 380000, 30),
('Hộp sơ cứu First Aid', 'Hộp sơ cứu First Aid', 'hop-so-cuu-first-aid', 'Sẵn sàng ứng cứu', 'Hộp sơ cứu đầy đủ tiêu chuẩn, chứa băng, gạc, thuốc sát trùng, bông y tế.', 'thiet-bi', 'Viet Health', 'first-aid.jpg', 'first-aid.jpg', 85000, 120),
('Máy đo đường huyết', 'Máy đo đường huyết', 'glucose-meter', 'Đo đường huyết nhanh', 'Máy đo đường huyết chính xác cao, kết quả trong 5 giây, kèm 10 que test.', 'thiet-bi', 'Accu-Chek', 'glucose-meter.jpg', 'glucose-meter.jpg', 250000, 50),
('Máy đo huyết áp điện tử', 'Máy đo huyết áp điện tử', 'bp-monitor-digital', 'Đo huyết áp di động', 'Máy đo huyết áp cánh tay nhỏ gọn, pin lâu 60 giờ, màn hình LED rõ ràng.', 'thiet-bi', 'SENCOR', 'bp-monitor.jpg', 'bp-monitor.jpg', 320000, 40),
('Nhiệt kế hồng ngoại', 'Nhiệt kế hồng ngoại', 'thermometer-infrared', 'Đo nhiệt độ không tiếp xúc', 'Nhiệt kế hồng ngoại đo nhanh 1 giây, không cần tiếp xúc, màn hình LED.', 'thiet-bi', 'Beurer', 'thermometer.jpg', 'thermometer.jpg', 180000, 60);

-- =============================================
-- 9b. BẢNG ANNOUNCEMENTS (Thông báo)
-- =============================================
CREATE TABLE public."Announcements" (
    "Id" BIGSERIAL PRIMARY KEY,
    "Title" VARCHAR(255) NOT NULL,
    "Content" TEXT,
    "Url" TEXT,
    "IsActive" BOOLEAN DEFAULT TRUE NOT NULL,
    "PublishedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "UpdatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public."Announcements" IS 'Thông báo hiển thị ở trang đăng nhập hoặc trang chủ';

-- Seed 2 announcements khớp với FE (có URL để click)
INSERT INTO public."Announcements" ("Title", "Content", "Url") VALUES
('Chào mừng đến hiệu thuốc trực tuyến', 'Mua sắm an toàn - Giao nhanh toàn quốc.', 'http://localhost:5173/shop'),
('Khuyến mãi tuần này: Giảm 20% Vitamin C', 'Áp dụng đến Chủ nhật cho sản phẩm Vitamin C.', 'http://localhost:5173/product/2');

-- =============================================
-- 9c. BẢNG DISEASES (Bách khoa toàn thư bệnh)
-- =============================================
CREATE TABLE public."Diseases" (
    "Id" BIGSERIAL PRIMARY KEY,
    "Name" VARCHAR(255) NOT NULL,
    "Slug" VARCHAR(255) UNIQUE NOT NULL,
    "Overview" TEXT,
    "Symptoms" TEXT,
    "Causes" TEXT,
    "Treatment" TEXT,
    "Prevention" TEXT,
    "Category" VARCHAR(100),
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "UpdatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_diseases_name ON public."Diseases" (LOWER("Name"));
CREATE INDEX idx_diseases_slug ON public."Diseases" ("Slug");
CREATE INDEX idx_diseases_category ON public."Diseases" ("Category");

COMMENT ON TABLE public."Diseases" IS 'Bách khoa toàn thư bệnh - Tra cứu thông tin y tế';
COMMENT ON COLUMN public."Diseases"."Slug" IS 'Định danh URL thân thiện (vd: cum-a, viem-gan-b)';
COMMENT ON COLUMN public."Diseases"."Overview" IS 'Tổng quan về bệnh';
COMMENT ON COLUMN public."Diseases"."Symptoms" IS 'Triệu chứng';
COMMENT ON COLUMN public."Diseases"."Causes" IS 'Nguyên nhân';
COMMENT ON COLUMN public."Diseases"."Treatment" IS 'Điều trị';
COMMENT ON COLUMN public."Diseases"."Prevention" IS 'Phòng ngừa';

-- Seed dữ liệu mẫu bệnh
INSERT INTO public."Diseases" ("Name", "Slug", "Overview", "Symptoms", "Causes", "Treatment", "Prevention", "Category") VALUES
('Cảm cúm', 'cam-cum', 
'Cảm cúm là bệnh nhiễm trùng đường hô hấp do vi-rút cúm gây ra. Bệnh lây lan nhanh qua giọt bắn khi ho, hắt hơi.', 
'Sốt cao, đau đầu, đau cơ, mệt mỏi, sổ mũi, ho, đau họng',
'Vi-rút cúm (Influenza A, B, C) lây qua đường hô hấp',
'Nghỉ ngơi, uống nhiều nước, dùng thuốc hạ sốt (Paracetamol), thuốc kháng vi-rút nếu cần',
'Tiêm vắc-xin cúm hàng năm, rửa tay thường xuyên, đeo khẩu trang nơi đông người',
'Hô hấp'),

('Sốt xuất huyết', 'sot-xuat-huyet',
'Sốt xuất huyết Dengue là bệnh truyền nhiễm cấp tính do vi-rút Dengue gây ra, lây truyền qua muỗi Aedes Aegypti.',
'Sốt cao đột ngột, đau đầu dữ dội, đau nhức xương khớp, buồn nôn, nôn, xuất huyết dưới da',
'Vi-rút Dengue có 4 type (DEN-1, DEN-2, DEN-3, DEN-4) lây qua muỗi vằn',
'Không có thuốc đặc hiệu, điều trị hỗ trợ: bù nước, hạ sốt bằng Paracetamol, theo dõi sát',
'Diệt muỗi và bọ gậy, không để nước đọng, ngủ màn, mặc quần áo dài tay',
'Nhiễm trùng'),

('Viêm gan B', 'viem-gan-b',
'Viêm gan B là bệnh nhiễm trùng gan do vi-rút HBV gây ra, có thể trở thành mãn tính và dẫn đến xơ gan, ung thư gan.',
'Mệt mỏi, chán ăn, buồn nôn, vàng da, vàng mắt, đau bụng vùng gan, nước tiểu sẫm màu',
'Vi-rút viêm gan B (HBV) lây qua đường máu, quan hệ tình dục, từ mẹ sang con',
'Viêm gan B cấp tự khỏi, viêm gan mãn tính dùng thuốc kháng vi-rút (Tenofovir, Entecavir)',
'Tiêm vắc-xin viêm gan B (3 mũi), dùng bao cao su, không dùng chung kim tiêm',
'Gan mật'),

('Tiểu đường type 2', 'tieu-duong-type-2',
'Đái tháo đường type 2 là bệnh rối loạn chuyển hóa mãn tính, cơ thể không sử dụng insulin hiệu quả.',
'Khát nước nhiều, đi tiểu nhiều, mệt mỏi, giảm cân, vết thương lâu lành, mờ mắt',
'Béo phì, thiếu vận động, di truyền, tuổi cao, chế độ ăn nhiều đường',
'Thay đổi lối sống, chế độ ăn, tập thể dục, thuốc hạ đường huyết (Metformin, Glibenclamide)',
'Giữ cân nặng hợp lý, tập thể dục đều đặn, hạn chế đường và tinh bột tinh chế',
'Chuyển hóa'),

('Cao huyết áp', 'cao-huyet-ap',
'Tăng huyết áp là tình trạng huyết áp động mạch tăng cao liên tục trên 140/90 mmHg.',
'Thường không có triệu chứng, đôi khi đau đầu, chóng mặt, mệt mỏi, đánh trống ngực',
'Béo phì, ăn mặn, stress, thiếu vận động, di truyền, tuổi cao',
'Thay đổi lối sống, giảm muối, thuốc hạ áp (lợi tiểu, chẹn beta, ức chế ACE)',
'Chế độ ăn ít muối, tập thể dục, giảm stress, hạn chế rượu bia',
'Tim mạch'),

('Hen suyễn', 'hen-suyen',
'Hen phế quản là bệnh viêm mãn tính đường thở, gây co thắt phế quản và khó thở.',
'Khó thở, thở khò khè, ho (đặc biệt ban đêm), tức ngực',
'Dị ứng (phấn hoa, bụi, lông thú), khói bụi, không khí lạnh, stress, di truyền',
'Thuốc giãn phế quản (Salbutamol - xịt hít), thuốc chống viêm (Corticosteroid)',
'Tránh các yếu tố kích thích, giữ nhà sạch sẽ, không hút thuốc',
'Hô hấp'),

('Loét dạ dày', 'loet-da-day',
'Loét dạ dày là tổn thương niêm mạc dạ dày, gây đau và chảy máu.',
'Đau thượng vị, đói bụng, ợ hơi, buồn nôn, đầy hơi, ợ chua',
'Vi khuẩn Helicobacter pylori, dùng NSAID lâu dài, stress, hút thuốc, rượu',
'Thuốc ức chế bơm proton (Omeprazole, Lansoprazole), kháng sinh diệt H. pylori',
'Ăn uống điều độ, tránh cay nóng, không hút thuốc, giảm stress',
'Tiêu hóa'),

('Sỏi thận', 'soi-than',
'Sỏi thận là các cục sỏi hình thành trong thận từ các chất khoáng trong nước tiểu.',
'Đau thắt lưng dữ dội, đau lan xuống bụng dưới, đi tiểu khó, tiểu ra máu, buồn nôn',
'Uống ít nước, chế độ ăn nhiều muối, calcium, protein, di truyền',
'Uống nhiều nước, thuốc giảm đau, sỏi lớn cần tán sỏi hoặc phẫu thuật',
'Uống đủ nước (2-3 lít/ngày), hạn chế muối, giảm protein động vật',
'Tiết niệu'),

('Gout', 'gout',
'Gout (bệnh thống phong) là bệnh viêm khớp do lắng đọng tinh thể acid uric trong khớp.',
'Đau khớp cấp tính (thường ngón chân cái), sưng đỏ nóng, đau dữ dội ban đêm',
'Acid uric cao trong máu do ăn nhiều purin (nội tạng, hải sản, bia)',
'Thuốc giảm đau (Colchicine, NSAID), thuốc hạ acid uric (Allopurinol)',
'Kiêng đồ ăn giàu purin, uống nhiều nước, giảm rượu bia, giảm cân',
'Xương khớp'),

('Viêm xoang', 'viem-xoang',
'Viêm xoang là viêm niêm mạc các xoang mũi, thường do nhiễm trùng hoặc dị ứng.',
'Đau đầu, đau vùng má, mũi nghẹt, chảy mũi đục, giảm khứu giác',
'Vi khuẩn, vi-rút, nấm, dị ứng, polyp mũi, vẹo vách ngăn',
'Kháng sinh (nếu do vi khuẩn), rửa mũi bằng nước muối, thuốc thông mũi',
'Rửa mũi thường xuyên, tránh khói bụi, điều trị dị ứng',
'Tai mũi họng'),

('Trĩ', 'tri',
'Trĩ (bệnh trĩ) là tình trạng tĩnh mạch vùng hậu môn sưng to, gây đau và chảy máu.',
'Đau hậu môn khi đi vệ sinh, chảy máu tươi, ngứa hậu môn, sa búi trĩ',
'Táo bón, ngồi lâu, mang vác nặng, thai sản, di truyền',
'Ăn nhiều chất xơ, uống nhiều nước, thuốc bôi trĩ, trĩ nặng cần phẫu thuật',
'Tránh táo bón, không ngồi lâu, vệ sinh hậu môn sạch sẽ',
'Tiêu hóa'),

('Viêm amidan', 'viem-amidan',
'Viêm amidan là tình trạng viêm nhiễm các hạch amidan ở họng.',
'Đau họng, khó nuốt, sốt, sưng amidan, có mủ, hạch cổ to',
'Vi khuẩn (Streptococcus), vi-rút, miễn dịch yếu',
'Kháng sinh (nếu do vi khuẩn), thuốc giảm đau, súc họng, cắt amidan nếu tái phát nhiều',
'Giữ vệ sinh răng miệng, tránh lạnh, tăng cường đề kháng',
'Tai mũi họng'),

('Viêm phế quản', 'viem-phe-quan',
'Viêm phế quản là viêm niêm mạc phế quản, gây ho và khó thở.',
'Ho có đờm, khó thở, tức ngực, thở khò khè, mệt mỏi',
'Vi-rút, vi khuẩn, khói thuốc, khói bụi, ô nhiễm không khí',
'Nghỉ ngơi, uống nhiều nước, thuốc long đờm, kháng sinh nếu nhiễm khuẩn',
'Không hút thuốc, tránh khói bụi, giữ ấm cơ thể',
'Hô hấp'),

('Zona', 'zona',
'Zona (herpes zoster) là bệnh do vi-rút thuỷ đậu tái hoạt động, gây phát ban và đau dây thần kinh.',
'Đau rát vùng da, nổi ban nước theo đường dây thần kinh, mệt mỏi, sốt nhẹ',
'Vi-rút Varicella-Zoster (gây thuỷ đậu) tái hoạt khi miễn dịch yếu',
'Thuốc kháng vi-rút (Acyclovir, Valacyclovir), thuốc giảm đau',
'Tiêm vắc-xin zona (người > 50 tuổi), tăng cường miễn dịch',
'Nhiễm trùng'),

('Chàm (Eczema)', 'cham-eczema',
'Chàm là bệnh da viêm mãn tính, gây ngứa, khô da, và phát ban.',
'Ngứa da, da khô, nứt nẻ, đỏ, nổi mẩn nước, rỉ dịch',
'Di truyền, dị ứng, da nhạy cảm, stress, thời tiết khô',
'Dưỡng ẩm da, thuốc bôi corticosteroid, tránh các chất kích ứng',
'Dưỡng ẩm thường xuyên, tránh xà phòng mạnh, mặc quần áo cotton',
'Da liễu'),

('Viêm dạ dày', 'viem-da-day',
'Viêm dạ dày là tình trạng viêm niêm mạc dạ dày gây đau và khó tiêu.',
'Đau bụng trên, buồn nôn, chướng bụng, ợ hơi, ăn không tiêu',
'Vi khuẩn H. pylori, stress, ăn uống bất thường, thuốc giảm đau',
'Thuốc kháng acid, thuốc ức chế bơm proton, điều chỉnh chế độ ăn',
'Ăn đúng giờ, tránh thức ăn cay nóng, giảm stress',
'Tiêu hóa'),

('Thiếu máu', 'thieu-mau',
'Thiếu máu là tình trạng giảm hồng cầu hoặc hemoglobin trong máu.',
'Mệt mỏi, da xanh xao, chóng mặt, đánh trống ngực, khó thở',
'Thiếu sắt, thiếu vitamin B12, mất máu, bệnh mãn tính',
'Bổ sung sắt, vitamin B12, axit folic, điều trị nguyên nhân',
'Ăn nhiều thực phẩm giàu sắt, kiểm tra sức khỏe định kỳ',
'Máu'),

('Viêm khớp dạng thấp', 'viem-khop-dang-thap',
'Viêm khớp dạng thấp là bệnh tự miễn viêm khớp mãn tính.',
'Đau khớp, sưng khớp, cứng khớp buổi sáng, mệt mỏi',
'Rối loạn hệ miễn dịch, di truyền, yếu tố môi trường',
'Thuốc kháng viêm, thuốc điều hòa miễn dịch, vật lý trị liệu',
'Tập thể dục nhẹ nhàng, giữ cân nặng hợp lý, tránh stress',
'Xương khớp'),

('Sốt rét', 'sot-ret',
'Sốt rét là bệnh nhiễm ký sinh trùng Plasmodium do muỗi Anopheles truyền.',
'Sốt cao chu kỳ, rét run, đau đầu, buồn nôn, vàng da',
'Ký sinh trùng Plasmodium lây qua muỗi Anopheles cái',
'Thuốc chống sốt rét (Chloroquine, Artemisinin), điều trị hỗ trợ',
'Ngủ màn, xịt thuốc diệt muỗi, mặc quần áo dài tay',
'Nhiễm trùng'),

('Lao phổi', 'lao-phoi',
'Lao phổi là bệnh nhiễm trùng phổi do vi khuẩn Mycobacterium tuberculosis.',
'Ho kéo dài > 2 tuần, ho ra máu, sốt nhẹ, gầy sút cân, đổ mồ hôi đêm',
'Vi khuẩn lao lây qua đường hô hấp từ người bệnh',
'Uống thuốc kháng lao 6-9 tháng (Rifampicin, Isoniazid, Ethambutol)',
'Tiêm vắc-xin BCG, tránh tiếp xúc người bệnh, tăng cường miễn dịch',
'Hô hấp'),

('Viêm ruột thừa', 'viem-ruot-thua',
'Viêm ruột thừa là viêm nhiễm ruột thừa, cần phẫu thuật cấp cứu.',
'Đau bụng vùng hố chậu phải, buồn nôn, nôn, sốt, táo bón',
'Tắc nghẽn ruột thừa, nhiễm khuẩn',
'Phẫu thuật cắt bỏ ruột thừa, kháng sinh',
'Không có cách phòng ngừa cụ thể, khám ngay khi đau bụng',
'Tiêu hóa'),

('Suy tim', 'suy-tim',
'Suy tim là tình trạng tim không bơm đủ máu cho cơ thể.',
'Khó thở, mệt mỏi, phù chân, ho, đánh trống ngực',
'Bệnh tim mạch, cao huyết áp, van tim, nhồi máu cơ tim',
'Thuốc lợi tiểu, ức chế men chuyển, chẹn beta, thay van tim nếu cần',
'Kiểm soát huyết áp, ăn ít muối, tập thể dục vừa phải',
'Tim mạch'),

('Tai biến mạch máu não', 'tai-bien-mach-mau-nao',
'Tai biến mạch máu não (đột quỵ) là tắc hoặc vỡ mạch máu não.',
'Liệt nửa người, méo miệng, nói khó, chóng mặt, đau đầu dữ dội',
'Tắc mạch máu não, vỡ mạch máu não, cao huyết áp',
'Cấp cứu ngay, thuốc tiêu huyết khối, phẫu thuật não nếu cần',
'Kiểm soát huyết áp, không hút thuốc, tập thể dục, ăn lành mạnh',
'Tim mạch'),

('Viêm phổi', 'viem-phoi',
'Viêm phổi là nhiễm trùng phổi do vi khuẩn, vi-rút hoặc nấm.',
'Ho có đờm, sốt cao, khó thở, đau ngực khi thở sâu',
'Vi khuẩn phế cầu, vi-rút, nấm, hít phải dị vật',
'Kháng sinh (nếu do vi khuẩn), nghỉ ngơi, uống nhiều nước',
'Tiêm vắc-xin phế cầu, cúm, rửa tay, tránh khói thuốc',
'Hô hấp'),

('Viêm gan C', 'viem-gan-c',
'Viêm gan C là bệnh gan do vi-rút HCV, có thể gây xơ gan.',
'Mệt mỏi, vàng da, đau bụng phải, buồn nôn, nước tiểu sẫm',
'Vi-rút HCV lây qua máu, kim tiêm, quan hệ tình dục',
'Thuốc kháng vi-rút trực tiếp (DAA), điều trị 8-12 tuần',
'Không dùng chung kim tiêm, dùng bao cao su, xét nghiệm máu',
'Gan mật'),

('Sỏi mật', 'soi-mat',
'Sỏi mật là các cục sỏi hình thành trong túi mật.',
'Đau vùng gan, buồn nôn, nôn, vàng da, sốt',
'Mật có nhiều cholesterol, nhiễm trùng túi mật, béo phì',
'Phẫu thuật cắt túi mật, thuốc tiêu sỏi, tán sỏi',
'Giảm cân, ăn ít mỡ, tập thể dục đều đặn',
'Gan mật'),

('Viêm tụy cấp', 'viem-tuy-cap',
'Viêm tụy cấp là viêm tuyến tụy đột ngột, có thể nguy hiểm.',
'Đau bụng trên dữ dội, buồn nôn, nôn, sốt, bụng chướng',
'Sỏi mật, rượu, mỡ máu cao, thuốc, chấn thương',
'Nhịn ăn, truyền dịch, giảm đau, điều trị nguyên nhân',
'Hạn chế rượu, ăn ít mỡ, kiểm soát mỡ máu',
'Tiêu hóa'),

('Viêm đại tràng', 'viem-dai-trang',
'Viêm đại tràng là viêm niêm mạc đại tràng gây tiêu chảy.',
'Đi ngoài phân lỏng, đau bụng, phân có máu nhầy, sốt',
'Vi khuẩn, vi-rút, ký sinh trùng, bệnh tự miễn',
'Uống nhiều nước, kháng sinh (nếu do vi khuẩn), thuốc tiêu chảy',
'Rửa tay sạch sẽ, ăn uống vệ sinh, nước sạch',
'Tiêu hóa'),

('Lupus ban đỏ', 'lupus-ban-do',
'Lupus là bệnh tự miễn hệ thống ảnh hưởng nhiều cơ quan.',
'Ban đỏ má, mệt mỏi, đau khớp, sốt, rụng tóc',
'Rối loạn hệ miễn dịch, di truyền, hormone, môi trường',
'Thuốc ức chế miễn dịch, corticosteroid, hydroxychloroquine',
'Tránh ánh nắng mặt trời, giảm stress, nghỉ ngơi đủ',
'Tự miễn'),

('Viêm màng não', 'viem-mang-nao',
'Viêm màng não là nhiễm trùng màng bao quanh não và tủy sống.',
'Sốt cao, đau đầu dữ dội, cứng gáy, buồn nôn, nôn',
'Vi khuẩn, vi-rút, nấm lây qua đường hô hấp',
'Kháng sinh mạnh ngay lập tức, điều trị hỗ trợ tích cực',
'Tiêm vắc-xin viêm màng não, tránh tiếp xúc người bệnh',
'Nhiễm trùng'),

('Xơ gan', 'xo-gan',
'Xơ gan là tình trạng gan bị xơ hóa do tổn thương mãn tính.',
'Mệt mỏi, vàng da, chảy máu cam, phù bụng, sút cân',
'Rượu, viêm gan B/C, gan nhiễm mỡ, thuốc độc',
'Ngừng rượu, điều trị nguyên nhân, ghép gan nếu nặng',
'Không uống rượu, tiêm vắc-xin viêm gan, ăn lành mạnh',
'Gan mật'),

('Bệnh Parkinson', 'benh-parkinson',
'Bệnh Parkinson là rối loạn thần kinh gây run và cứng cơ.',
'Run tay chân, cứng cơ, chậm chạp, mất thăng bằng',
'Thoái hóa tế bào não sản xuất dopamine, tuổi cao',
'Thuốc tăng dopamine (Levodopa), vật lý trị liệu, phẫu thuật',
'Tập thể dục, ăn nhiều rau quả, tránh chấn thương đầu',
'Thần kinh'),

('Suy thận mãn tính', 'suy-than-man-tinh',
'Suy thận mãn tính là giảm dần chức năng thận theo thời gian.',
'Mệt mỏi, phù chân, buồn nôn, ít đi tiểu, ngứa da',
'Tiểu đường, cao huyết áp, viêm thận, thuốc độc thận',
'Kiểm soát huyết áp đường huyết, thuốc bảo vệ thận, lọc máu',
'Kiểm soát tiểu đường, huyết áp, uống đủ nước, không dùng thuốc tùy tiện',
'Tiết niệu'),

('Bệnh Alzheimer', 'benh-alzheimer',
'Bệnh Alzheimer là bệnh thoái hóa não gây mất trí nhớ.',
'Quên, rối loạn định hướng, thay đổi tính cách, lú lẫn',
'Tuổi cao, di truyền, tổn thương tế bào não',
'Thuốc ức chế cholinesterase, chăm sóc hỗ trợ, tập luyện trí nhớ',
'Tập thể dục, tập trí óc, ăn lành mạnh, giao tiếp xã hội',
'Thần kinh'),

('Viêm khớp gout cấp', 'gout-cap',
'Cơn gout cấp là đau khớp dữ dội do lắng đọng tinh thể acid uric.',
'Đau khớp ngón chân cái dữ dội ban đêm, sưng đỏ nóng',
'Acid uric cao đột ngột, ăn nhiều purin, uống rượu',
'Colchicine, NSAID, chườm lạnh, uống nhiều nước',
'Kiêng đồ ăn giàu purin ngay, uống nhiều nước, giảm rượu',
'Xương khớp'),

('Viêm dây thần kinh tọa', 'viem-day-than-kinh-toa',
'Viêm dây thần kinh tọa gây đau lan từ lưng xuống chân.',
'Đau lưng lan xuống mông và chân, tê chân, khó đi',
'Thoát vị đĩa đệm, chèn ép dây thần kinh, thoái hóa cột sống',
'Giảm đau, vật lý trị liệu, nghỉ ngơi, phẫu thuật nếu nặng',
'Tư thế đúng, tập cơ lưng, không mang vác nặng',
'Thần kinh'),

('Viêm họng', 'viem-hong',
'Viêm họng là viêm nhiễm họng gây đau và khó nuốt.',
'Đau họng, nuốt đau, khàn giọng, ho, sốt nhẹ',
'Vi-rút, vi khuẩn, dị ứng, không khí khô',
'Nghỉ ngơi, uống nhiều nước, súc họng nước muối, thuốc giảm đau',
'Rửa tay, tránh tiếp xúc người bệnh, giữ ấm cổ họng',
'Tai mũi họng'),

('Mề đay (Urticaria)', 'me-day-urticaria',
'Mề đay là phản ứng da gây ngứa và nổi mẩn đỏ.',
'Nổi mẩn đỏ ngứa, sưng da, di chuyển vị trí',
'Dị ứng thực phẩm, thuốc, côn trùng cắn, stress',
'Thuốc kháng histamine, tránh yếu tố kích ứng',
'Tránh thực phẩm dị ứng, giảm stress, mặc quần áo thoáng',
'Da liễu'),

('Rối loạn lo âu', 'roi-loan-lo-au',
'Rối loạn lo âu là tình trạng lo lắng quá mức kéo dài.',
'Lo lắng thường xuyên, bồn chồn, khó ngủ, đánh trống ngực',
'Stress, di truyền, rối loạn hóa chất não',
'Thuốc chống lo âu, tâm lý trị liệu, thư giãn',
'Tập thể dục, thiền, giảm stress, ngủ đủ giấc',
'Tâm thần');

-- =============================================
-- 9d. DỮ LIỆU USERS VÀ CHAT (Để trống)
-- =============================================

-- Bảng Users: Để trống, user sẽ tự đăng ký
-- Bảng ChatThreads: Để trống, tạo khi user nhắn tin lần đầu
-- Bảng ChatMessages: Để trống, chat realtime qua Socket.IO

-- =============================================
-- 10. TRIGGER TỰ ĐỘNG CẬP NHẬT THỜI GIAN
-- =============================================

-- Function cập nhật UpdatedAt
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."UpdatedAt" = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger cho Users
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public."Users"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger cho Products
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public."Products"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger cho Orders
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public."Orders"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger cho ChatThreads
CREATE TRIGGER update_chatthreads_updated_at BEFORE UPDATE ON public."ChatThreads"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger cho Announcements
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON public."Announcements"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger cho Diseases
CREATE TRIGGER update_diseases_updated_at BEFORE UPDATE ON public."Diseases"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 11. FUNCTION TỰ ĐỘNG TẠO MÃ ĐỢN HÀNG
-- =============================================

CREATE OR REPLACE FUNCTION generate_order_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW."Code" IS NULL THEN
        NEW."Code" = 'ORD' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(NEW."Id"::TEXT, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_order_code 
BEFORE INSERT ON public."Orders"
FOR EACH ROW EXECUTE FUNCTION generate_order_code();

-- =============================================
-- HOÀN THÀNH DATABASE SETUP
-- =============================================

-- Thông báo
DO $$
BEGIN
    RAISE NOTICE '✅ Database schema đã được tạo thành công!';
    RAISE NOTICE '📦 Đã thêm 30 sản phẩm mẫu (khớp với 30 hình ảnh trong Back_end/public/images/)';
    RAISE NOTICE '🏥 Đã thêm 15 bệnh mẫu vào Bách khoa toàn thư';
    RAISE NOTICE '🔧 Triggers và functions đã được cài đặt';
    RAISE NOTICE '';
    RAISE NOTICE '📝 LƯU Ý QUAN TRỌNG:';
    RAISE NOTICE '- Cột Image lưu TÊN FILE (vd: paracetamol.jpg)';
    RAISE NOTICE '- Backend sẽ tự động build thành URL: http://localhost:5001/images/paracetamol.jpg';
    RAISE NOTICE '- Đảm bảo các file ảnh có trong: Back_end/public/images/';
    RAISE NOTICE '- Đơn hàng và giỏ hàng đã được tích hợp đầy đủ';
    RAISE NOTICE '- Sản phẩm mẫu từ 15,000đ - 380,000đ';
    RAISE NOTICE '- Danh mục: Thuốc (13), Vitamin (5), Chăm sóc (7), Thiết bị y tế (5)';
    RAISE NOTICE '- Bảng Diseases có 15 bệnh phổ biến với đầy đủ thông tin';
    RAISE NOTICE '';
    RAISE NOTICE '📊 TỔNG QUAN CÁC BẢNG:';
    RAISE NOTICE '1. Users - Người dùng (có Avatar)';
    RAISE NOTICE '2. Products - Sản phẩm (30 items)';
    RAISE NOTICE '3. CartItems - Giỏ hàng';
    RAISE NOTICE '4. Orders - Đơn hàng (5 trạng thái)';
    RAISE NOTICE '5. OrderItems - Chi tiết đơn hàng';
    RAISE NOTICE '6. ChatThreads - Cuộc hội thoại chat';
    RAISE NOTICE '7. ChatMessages - Tin nhắn chat';
    RAISE NOTICE '8. Comments - Đánh giá sản phẩm';
    RAISE NOTICE '9. Announcements - Thông báo (2 items)';
    RAISE NOTICE '10. Diseases - Bách khoa toàn thư bệnh (15 items)';
END $$;
