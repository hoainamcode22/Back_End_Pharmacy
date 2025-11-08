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
-- 0. BẢNG DISEASES (Bệnh tra cứu)
-- =============================================
CREATE TABLE public."Diseases" (
    "Id" BIGSERIAL PRIMARY KEY,
    "Name" VARCHAR(255) NOT NULL,
    "Slug" VARCHAR(255) UNIQUE,
    "Overview" TEXT,
    "Symptoms" TEXT,
    "Causes" TEXT,
    "Treatment" TEXT,
    "Prevention" TEXT,
    "Category" VARCHAR(100),
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "UpdatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_diseases_slug ON public."Diseases" ("Slug");
CREATE INDEX idx_diseases_category ON public."Diseases" ("Category");

COMMENT ON TABLE public."Diseases" IS 'Bách khoa toàn thư bệnh - Tra cứu thông tin bệnh';
COMMENT ON COLUMN public."Diseases"."Slug" IS 'URL-friendly identifier';

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
    "Name" VARCHAR(255) NOT NULL,
    "Slug" VARCHAR(255) UNIQUE,
    "ShortDesc" VARCHAR(500),
    "Description" TEXT,
    "Category" VARCHAR(120) CHECK ("Category" IN ('thuoc', 'vitamin', 'cham-soc', 'thiet-bi')),
    "Brand" VARCHAR(120),
    "Image" TEXT,
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
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_messages_thread ON public."ChatMessages" ("ThreadId");
CREATE INDEX idx_messages_created ON public."ChatMessages" ("CreatedAt" ASC);

COMMENT ON TABLE public."ChatMessages" IS 'Tin nhắn trong cuộc hội thoại chat';

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

-- Sản phẩm mẫu - 30 sản phẩm khớp với 30 file ảnh trong Back_end/public/images/
INSERT INTO public."Products" ("Name", "Slug", "ShortDesc", "Description", "Category", "Brand", "Image", "Price", "Stock") VALUES
('Paracetamol 500mg', 'paracetamol-500mg', 'Hạ sốt, giảm đau', 'Thuốc giảm đau hạ sốt thông dụng, an toàn cho cả người lớn và trẻ em. Sử dụng khi sốt, đau đầu, đau răng.', 'thuoc', 'Generic', 'paracetamol.jpg', 15000, 100),
('Vitamin C 1000mg', 'vitamin-c-1000', 'Tăng cường đề kháng', 'Viên uống bổ sung Vitamin C giúp tăng cường hệ miễn dịch, chống oxy hóa, làm đẹp da.', 'vitamin', 'Vitamin World', 'vitamin-c.jpg', 65000, 200),
('Siro ho trẻ em Bảo Thanh', 'siro-ho-tre-em', 'Giảm ho, dịu họng', 'Siro ho an toàn cho trẻ em, giảm ho, long đờm, dịu họng. Thành phần thảo dược tự nhiên.', 'thuoc', 'Bảo Thanh', 'ibuprofen.jpg', 42000, 120),
('Oresol - Bù nước điện giải', 'oresol-bu-nuoc', 'Bù nước khi tiêu chảy', 'Dung dịch bù nước và điện giải khi tiêu chảy, nôn mửa, mất nước do sốt hoặc vận động mạnh.', 'thuoc', 'Generic', 'cephalexin.jpg', 22000, 300),
('Amoxicillin 500mg', 'amoxicillin-500mg', 'Kháng sinh phổ rộng', 'Thuốc kháng sinh Amoxicillin 500mg, điều trị nhiễm khuẩn đường hô hấp, tiêu hóa. Thành phần: Amoxicillin trihydrate.', 'thuoc', 'Thái Phố', 'amoxicillin.jpg', 28000, 120),
('Azithromycin 500mg', 'azithromycin-500mg', 'Kháng sinh thế hệ mới', 'Thuốc kháng sinh macrolide, hiệu quả cao với nhiều chủng vi khuẩn. Điều trị viêm phế quản, nhiễm khuẩn tai.', 'thuoc', 'Domesco', 'azithromycin.jpg', 45000, 80),
('Aspirin 500mg', 'aspirin-500mg', 'Giảm đau hạ sốt', 'Aspirin nguyên chất 500mg, giảm đau, hạ sốt, chống viêm. Sử dụng cho đau đầu, đau cơ, đau khớp.', 'thuoc', 'Bayer', 'aspirin.jpg', 18000, 200),
('Diclofenac 50mg', 'diclofenac-50mg', 'Chống viêm, giảm đau', 'Thuốc chống viêm không steroid Diclofenac, giảm đau cấp tính, mạn tính, sốt.', 'thuoc', 'Novartis', 'diclofenac.jpg', 22000, 150),
('Mefenamic Acid 500mg', 'mefenamic-acid-500mg', 'Chống viêm hiệu quả', 'Acid Mefenamic 500mg, chống viêm, giảm đau nhức, đau bụng kinh nguyệt.', 'thuoc', 'Sanofi', 'mefenamic.jpg', 24000, 140),
('Naproxen 500mg', 'naproxen-500mg', 'Giảm đau lâu dài', 'Naproxen 500mg, chống viêm NSAID, giảm đau kéo dài, hạ sốt. An toàn với dạ dày.', 'thuoc', 'Roche', 'naproxen.jpg', 26000, 130),
('Doxycycline 100mg', 'doxycycline-100mg', 'Kháng sinh rộng phổ', 'Thuốc kháng sinh Doxycycline, điều trị nhiễm khuẩn, mụn trứng cá, bệnh Lyme.', 'thuoc', 'Farma', 'doxycycline.jpg', 32000, 110),
('Ciprofloxacin 500mg', 'ciprofloxacin-500mg', 'Kháng sinh Fluoroquinolone', 'Thuốc kháng sinh Ciprofloxacin 500mg, điều trị nhiễm khuẩn tiêu hóa, tiết niệu.', 'thuoc', 'Cipla', 'ciprofloxacin.jpg', 38000, 95),
('Metronidazole 250mg', 'metronidazole-250mg', 'Kháng sinh đặc biệt', 'Metronidazole 250mg, điều trị nhiễm khuẩn gây amoeba, trichomonas, Giardia.', 'thuoc', 'Biofarma', 'metronidazole.jpg', 20000, 200),
('Vitamin D3 1000IU', 'vitamin-d3-1000iu', 'Mạnh xương, miễn dịch', 'Vitamin D3 1000 đơn vị quốc tế, hỗ trợ hấp thu canxi, mạnh xương, tăng miễn dịch.', 'vitamin', 'Nutricost', 'vitamin-d3.jpg', 52000, 180),
('Calcium + Vitamin D', 'calcium-vitamin-d', 'Cải thiện xương khớp', 'Canxi + Vitamin D3, hỗ trợ sức khỏe xương, phòng chống loãng xương cho người lớn tuổi.', 'vitamin', 'Nature Made', 'calcium.jpg', 58000, 160),
('Omega 3 Fish Oil', 'omega-3-fish-oil', 'Bảo vệ tim mạch', 'Dầu cá Omega 3, bảo vệ tim mạch, giảm cholesterol, tốt cho não bộ.', 'vitamin', 'Kirkland', 'omega3.jpg', 48000, 140),
('Collagen Type I + II', 'collagen-type-1-2', 'Làm đẹp da, khớp', 'Collagen thủy phân, hỗ trợ da săn chắc, khớp linh hoạt, tóc móng khỏe.', 'vitamin', 'EFAVIT', 'collagen.jpg', 62000, 100),
('Viên Multivitamin hàng ngày', 'multivitamin-daily', 'Bổ sung vitamin tổng hợp', 'Viên nén tổng hợp 13 vitamin + khoáng chất, bổ sung năng lượng hàng ngày.', 'vitamin', 'Centrum', 'multivitamin.jpg', 72000, 160),
('Dầu gội Chống gàu', 'dau-goi-chong-gau', 'Khử gàu hiệu quả', 'Dầu gội đặc trị, khử gàu, ngứa da đầu, nuôi dưỡng tóc mềm mượt.', 'cham-soc', 'Sunsilk', 'anti-dandruff.jpg', 32000, 250),
('Sữa rửa mặt Cleanser', 'sua-rua-mat-cleanser', 'Sạch sâu, mịn da', 'Sữa rửa mặt dịu nhẹ, loại bỏ bụi bẩn, makeup, dưỡng ẩm da mặt.', 'cham-soc', 'Cetaphil', 'cleanser.jpg', 45000, 200),
('Kem chống nắng SPF 50', 'kem-chong-nang-spf50', 'Bảo vệ 8 tiếng', 'Kem chống nắng SPF 50+ PA+++, bảo vệ da khỏi tia UV, không nhờn, dễ tẩy rửa.', 'cham-soc', 'Sunplay', 'sunscreen.jpg', 55000, 180),
('Mặt nạ chăm sóc da Face Mask', 'face-mask-care', 'Dưỡng ẩm sâu', 'Mặt nạ giấy chứa serum dưỡng chất, cấp ẩm, sáng da, sử dụng 2-3 lần/tuần.', 'cham-soc', 'Nature Republic', 'face-mask.jpg', 38000, 300),
('Kem đánh răng Fluoride', 'kem-danh-rang-fluoride', 'Bảo vệ sâu răng', 'Kem đánh răng chứa Fluoride, ngăn ngừa sâu răng, làm sáng men răng.', 'cham-soc', 'Colgate', 'toothpaste.jpg', 25000, 400),
('Dầu gội và xả 2 in 1 Shampoo', 'shampoo-2-in-1', 'Mượt và bóng tóc', 'Dầu gội xả 2 trong 1, giàu vitamin E, nuôi dưỡng tóc mềm mượt, chống gàu.', 'cham-soc', 'Pantene', 'shampoo.jpg', 36000, 280),
('Nước súc miệng Mouthwash', 'mouthwash-antiseptic', 'Diệt khuẩn, tươi miệng', 'Nước súc miệng sát trùng, giảm viêm lợi, hôi miệng, thơm tho suốt ngày.', 'cham-soc', 'Listerine', 'mouthwash.jpg', 68000, 200),
('Máy xông hơi Nebulizer', 'may-xong-hoi-nebulizer', 'Chữa hen, ho', 'Máy xông hơi tạo hạt mịn, hiệu quả điều trị hen suyễn, ho mạn tính. Dễ sử dụng.', 'thiet-bi', 'Medel', 'nebulizer.jpg', 380000, 30),
('Hộp sơ cứu First Aid', 'hop-so-cuu-first-aid', 'Sẵn sàng ứng cứu', 'Hộp sơ cứu đầy đủ tiêu chuẩn, chứa băng, gạc, thuốc sát trùng, bông y tế.', 'thiet-bi', 'Viet Health', 'first-aid.jpg', 85000, 120),
('Máy đo đường huyết Glucose Meter', 'glucose-meter', 'Đo đường huyết nhanh', 'Máy đo đường huyết chính xác cao, kết quả trong 5 giây, kèm 10 que test.', 'thiet-bi', 'Accu-Chek', 'glucose-meter.jpg', 250000, 50),
('Huyết áp kế điện tử BP Monitor', 'bp-monitor-digital', 'Đo huyết áp di động', 'Máy đo huyết áp cánh tay nhỏ gọn, pin lâu 60h, màn hình LED rõ ràng.', 'thiet-bi', 'SENCOR', 'bp-monitor.jpg', 320000, 40),
('Nhiệt kế hồng ngoại Thermometer', 'thermometer-infrared', 'Đo nhiệt độ không tiếp xúc', 'Nhiệt kế hồng ngoại đo nhanh 1 giây, không cần tiếp xúc, màn hình LED.', 'thiet-bi', 'Beurer', 'thermometer.jpg', 180000, 60);

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
('Khuyến mại tuần này: Giảm 20% Vitamin C', 'Áp dụng đến Chủ nhật cho sản phẩm Vitamin C.', 'http://localhost:5173/product/2');

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
    RAISE NOTICE '🔧 Triggers và functions đã được cài đặt';
    RAISE NOTICE '';
    RAISE NOTICE '📝 LƯU Ý QUAN TRỌNG:';
    RAISE NOTICE '- Cột Image lưu TÊN FILE (vd: paracetamol.jpg)';
    RAISE NOTICE '- Backend sẽ tự động build thành URL: http://localhost:5001/images/paracetamol.jpg';
    RAISE NOTICE '- Đảm bảo các file ảnh có trong: Back_end/public/images/';
    RAISE NOTICE '- Đơn hàng và giỏ hàng đã được tích hợp đầy đủ';
    RAISE NOTICE '- Sản phẩm mẫu từ 18,000đ - 380,000đ';
    RAISE NOTICE '- Danh mục: Thuốc (13), Vitamin (5), Chăm sóc (7), Thiết bị y tế (5)';
END $$;

-- =============================================
-- 15. INSERT ĐẦY ĐỦ 40 BỆNH VÀO DATABASE
-- =============================================

INSERT INTO public."Diseases" 
("Name", "Slug", "Overview", "Symptoms", "Causes", "Treatment", "Prevention", "Category") 
VALUES
-- === BỆNH HÔ HẤP (5) ===
('Viêm phế quản','viem-phe-quan','Viêm phế quản là tình trạng viêm lớp niêm mạc của các ống phế quản, đường dẫn khí đến phổi.','Ho có đờm, Khó thở, Thở khò khè, Mệt mỏi, Sốt nhẹ, Tức ngực','Chủ yếu do virus. Hút thuốc lá. Tiếp xúc với khói bụi, ô nhiễm.','Nghỉ ngơi, Uống nhiều nước, Thuốc long đờm giảm ho, Kháng sinh nếu do vi khuẩn.','Tránh hút thuốc lá, Rửa tay thường xuyên, Tiêm phòng cúm hàng năm.','Bệnh hô hấp'),
('Hen suyễn (Hen phế quản)','hen-suyen','Hen suyễn là một bệnh mạn tính làm viêm và thu hẹp đường thở, gây khó thở.','Khó thở, Thở khò khè, Ho, Nặng ngực','Yếu tố di truyền, Dị ứng, Nhiễm trùng hô hấp, Không khí lạnh, Vận động mạnh.','Thuốc hít cắt cơn và dự phòng, Tránh yếu tố kích phát.','Kiểm soát dị ứng, Tránh khói thuốc, Theo dõi chức năng hô hấp.','Bệnh hô hấp'),
('Viêm phổi','viem-phoi','Viêm phổi là tình trạng nhiễm trùng làm viêm các túi khí ở phổi.','Sốt cao, Ho có đờm, Khó thở, Đau ngực khi hít sâu.','Vi khuẩn, Virus, Nấm.','Kháng sinh, Thuốc kháng virus, Hạ sốt, Nghỉ ngơi, Bù nước.','Tiêm phòng phế cầu, Giữ vệ sinh, Không hút thuốc.','Bệnh hô hấp'),
('Bệnh phổi tắc nghẽn mạn tính (COPD)','copd','COPD là bệnh phổi mạn tính gây cản trở luồng khí thở ra khỏi phổi.','Khó thở tăng dần, Ho mạn tính, Khạc đờm thường xuyên.','Hút thuốc lá, Tiếp xúc khói bụi, Di truyền.','Ngừng hút thuốc lá, Thuốc giãn phế quản dạng hít, Liệu pháp oxy.','Không hút thuốc, Tránh ô nhiễm không khí.','Bệnh hô hấp'),
('Viêm xoang','viem-xoang','Viêm xoang là tình trạng viêm hoặc sưng lớp niêm mạc của các xoang cạnh mũi.','Đau nhức mặt, Nghẹt mũi, Chảy nước mũi, Giảm khứu giác, Ho.','Virus, Dị ứng, Lệch vách ngăn, Nhiễm khuẩn.','Rửa mũi, Thuốc xịt mũi, Thuốc giảm đau, Kháng sinh nếu cần.','Tránh tác nhân dị ứng, Giữ ẩm không khí.','Bệnh hô hấp'),
-- === BỆNH TIÊU HÓA (5) ===
('Trào ngược dạ dày thực quản (GERD)','trao-nguoc-da-day-thuc-quan-gerd','GERD là tình trạng acid từ dạ dày trào ngược lên thực quản.','Ợ nóng, Ợ chua, Đau ngực, Khó nuốt, Ho khan.','Cơ thắt thực quản dưới yếu, Thoát vị hoành, Béo phì, Ăn uống không khoa học.','Thay đổi lối sống, Thuốc kháng acid, PPI.','Tránh thức ăn cay nóng, Giữ cân nặng hợp lý.','Bệnh tiêu hóa'),
('Hội chứng ruột kích thích (IBS)','hoi-chung-ruot-kich-thich-ibs','IBS là rối loạn phổ biến ảnh hưởng đến ruột già.','Đau bụng, Thay đổi thói quen đại tiện, Đầy hơi, Chướng bụng.','Nguyên nhân chưa rõ, Stress, Rối loạn thần kinh ruột.','Thay đổi chế độ ăn, Quản lý stress, Thuốc điều hòa tiêu hóa.','Tập thể dục, Ngủ đủ, Tránh thực phẩm kích thích.','Bệnh tiêu hóa'),
('Bệnh Crohn','benh-crohn','Bệnh Crohn là bệnh viêm ruột mạn tính gây loét đường tiêu hóa.','Tiêu chảy kéo dài, Đau bụng, Sụt cân, Mệt mỏi.','Rối loạn miễn dịch, Di truyền.','Thuốc chống viêm, Ức chế miễn dịch, Phẫu thuật nếu nặng.','Không hút thuốc, Theo dõi dinh dưỡng.','Bệnh tiêu hóa'),
('Sỏi mật','soi-mat','Sỏi mật là sỏi cứng hình thành trong túi mật.','Đau bụng trên bên phải, Buồn nôn, Đau lan vai phải.','Cholesterol cao, Túi mật không rỗng đúng cách.','Phẫu thuật cắt túi mật, Thuốc tan sỏi (ít hiệu quả).','Duy trì cân nặng, Ăn ít chất béo.','Bệnh tiêu hóa'),
('Viêm tụy cấp','viem-tuy-cap','Viêm tụy cấp là tình trạng viêm đột ngột của tuyến tụy.','Đau bụng dữ dội, Buồn nôn, Nôn, Sốt.','Sỏi mật, Rượu, Mỡ máu cao.','Nhịn ăn, Truyền dịch, Giảm đau, Điều trị nguyên nhân.','Giảm rượu bia, Duy trì lối sống lành mạnh.','Bệnh tiêu hóa'),
-- === BỆNH TIM MẠCH (5) ===
('Tăng huyết áp (Cao huyết áp)','tang-huyet-ap','Tăng huyết áp là tình trạng áp lực máu lên thành động mạch cao.','Đau đầu, Chóng mặt, Khó thở, Ù tai.','Di truyền, Tuổi tác, Ăn mặn, Lười vận động.','Thay đổi lối sống, Thuốc hạ huyết áp.','Ăn nhạt, Tập thể dục, Giữ cân nặng.','Bệnh tim mạch'),
('Bệnh mạch vành','benh-mach-vanh','Bệnh mạch vành do tích tụ mảng xơ vữa trong động mạch nuôi tim.','Đau thắt ngực, Khó thở, Mệt mỏi.','Xơ vữa động mạch, Tăng mỡ máu, Hút thuốc.','Thuốc statin, Aspirin, Nong mạch, Đặt stent.','Kiểm soát huyết áp, Mỡ máu, Không hút thuốc.','Bệnh tim mạch'),
('Suy tim','suy-tim','Suy tim là tình trạng tim không bơm đủ máu cho cơ thể.','Khó thở, Mệt mỏi, Phù chân, Ho dai dẳng.','Bệnh mạch vành, Tăng huyết áp, Van tim.','Thuốc lợi tiểu, Ức chế men chuyển, Chẹn beta, Máy tạo nhịp.','Kiểm soát bệnh nền, Ăn nhạt, Tập nhẹ.','Bệnh tim mạch'),
('Rối loạn nhịp tim','roi-loan-nhip-tim','Rối loạn nhịp tim là nhịp tim không đều quá nhanh quá chậm hoặc bất thường.','Hồi hộp, Choáng, Ngất, Đau ngực.','Tổn thương tim, Caffeine, Stress.','Thuốc chống loạn nhịp, Sốc điện, Máy tạo nhịp.','Giảm caffeine, Tránh stress, Điều trị bệnh nền.','Bệnh tim mạch'),
('Đột quỵ (Tai biến mạch máu não)','dot-quy','Đột quỵ là khi máu lên não bị gián đoạn hoặc mạch máu não vỡ.','Méo miệng, Yếu tay chân, Nói ngọng, Ngất.','Tắc mạch máu, Xuất huyết não, Huyết áp cao.','Cấp cứu khẩn cấp, Thuốc tiêu sợi huyết, Phẫu thuật.','Kiểm soát huyết áp, Tiểu đường, Không hút thuốc.','Bệnh tim mạch'),
-- === BỆNH DA LIỄU (5) ===
('Bệnh vẩy nến','benh-vay-nen','Vẩy nến là bệnh da mạn tính tự miễn làm tế bào da tăng sinh nhanh.','Da đỏ, Có vảy trắng bạc, Ngứa, Nứt nẻ.','Rối loạn miễn dịch, Di truyền, Stress.','Kem bôi steroid, Vitamin D, Quang trị liệu, Thuốc sinh học.','Giữ ẩm da, Quản lý stress, Tránh tổn thương da.','Bệnh da liễu'),
('Bệnh chàm (Eczema)','benh-cham-eczema','Eczema là tình trạng viêm da cơ địa gây ngứa và khô da.','Ngứa dữ dội, Da đỏ, Khô, Rỉ dịch.','Di truyền, Hàng rào da yếu, Dị nguyên.','Dưỡng ẩm, Kem steroid, Kháng histamin.','Dưỡng ẩm hàng ngày, Tắm nước ấm nhẹ.','Bệnh da liễu'),
('Nấm da (Hắc lào, Lang ben)','nam-da','Nấm da là nhiễm trùng da do vi nấm phổ biến ở vùng ẩm ướt.','Da đỏ, Ngứa, Đốm đổi màu.','Vi nấm, Môi trường ẩm, Vệ sinh kém.','Thuốc kháng nấm bôi hoặc uống.','Giữ da khô sạch, Mặc đồ thoáng.','Bệnh da liễu'),
('Mề đay (Mày đay)','me-day','Mề đay là phản ứng dị ứng gây nổi sẩn phù ngứa.','Sẩn ngứa, Đỏ, Sưng tạm thời.','Dị ứng, Nhiệt độ, Stress.','Thuốc kháng histamin, Tránh tác nhân dị ứng.','Tránh yếu tố kích ứng, Quản lý stress.','Bệnh da liễu'),
('Bạch biến','bach-bien','Bạch biến là bệnh tự miễn làm mất tế bào sắc tố da.','Mảng da trắng, Lông tóc bạc tại vùng tổn thương.','Tự miễn, Di truyền, Stress, Cháy nắng.','Kem steroid, Quang trị liệu, Che phủ thẩm mỹ.','Dùng kem chống nắng, Bảo vệ da.','Bệnh da liễu'),
-- === BỆNH TRUYỀN NHIỄM (5) ===
('Cúm mùa','cum-mua','Cúm là bệnh nhiễm trùng hô hấp cấp do virus cúm.','Sốt cao, Đau đầu, Đau mỏi cơ, Ho, Mệt.','Virus cúm, Lây qua giọt bắn.','Nghỉ ngơi, Hạ sốt, Thuốc kháng virus.','Tiêm vắc-xin cúm, Rửa tay, Che miệng khi ho.','Bệnh truyền nhiễm'),
('Thủy đậu (Trái rạ)','thuy-dau','Thủy đậu là bệnh truyền nhiễm cấp tính do virus Varicella-Zoster.','Sốt nhẹ, Mụn nước, Ngứa toàn thân.','Virus VZV, Lây qua đường hô hấp.','Hạ sốt, Kháng histamin, Kháng virus.','Tiêm vắc-xin, Cách ly người bệnh.','Bệnh truyền nhiễm'),
('Bệnh Sởi','benh-soi','Sởi là bệnh truyền nhiễm cấp do virus sởi.','Sốt cao, Ho, Mắt đỏ, Phát ban lan toàn thân.','Virus sởi, Lây qua hô hấp.','Nghỉ ngơi, Bổ sung vitamin A, Hạ sốt.','Tiêm vắc-xin MMR.','Bệnh truyền nhiễm'),
('Quai bị','quai-bi','Quai bị là bệnh do virus quai bị gây sưng tuyến mang tai.','Sưng hàm, Đau khi nuốt, Sốt, Mệt mỏi.','Virus Mumps, Lây qua hô hấp.','Nghỉ ngơi, Chườm ấm, Giảm đau.','Tiêm vắc-xin MMR.','Bệnh truyền nhiễm'),
('Sốt rét (Malaria)','sot-ret','Sốt rét là bệnh do ký sinh trùng Plasmodium lây qua muỗi.','Sốt, Rét run, Vã mồ hôi, Thiếu máu.','Ký sinh trùng Plasmodium, Muỗi Anopheles.','Thuốc chống sốt rét, Bù nước.','Ngủ màn, Diệt muỗi, Uống thuốc dự phòng.','Bệnh truyền nhiễm'),
-- === BỆNH NỘI TIẾT (5) ===
('Tiểu đường tuýp 1','tieu-duong-tuyp-1','Tiểu đường tuýp 1 là bệnh tự miễn cơ thể không sản xuất insulin.','Ăn nhiều, Uống nhiều, Tiểu nhiều, Gầy nhiều, Mệt mỏi.','Tự miễn, Di truyền, Môi trường.','Tiêm insulin, Ăn kiêng, Tập luyện.','Không có cách phòng ngừa hiệu quả.','Bệnh nội tiết'),
('Tiểu đường tuýp 2','tieu-duong-tuyp-2','Tiểu đường tuýp 2 là tình trạng kháng insulin.','Khát nước, Đi tiểu nhiều, Mệt mỏi, Vết thương lâu lành.','Béo phì, Lối sống ít vận động, Di truyền.','Giảm cân, Thuốc Metformin, Insulin.','Ăn uống lành mạnh, Tập thể dục.','Bệnh nội tiết'),
('Bệnh Basedow (Cường giáp)','benh-basedow-cuong-giap','Bệnh Basedow là bệnh tự miễn gây cường giáp.','Tim đập nhanh, Run tay, Sụt cân, Lồi mắt.','Kháng thể kích thích tuyến giáp.','Thuốc kháng giáp, I-ốt phóng xạ, Phẫu thuật.','Quản lý stress, Không hút thuốc.','Bệnh nội tiết'),
('Suy giáp','suy-giap','Suy giáp là tình trạng tuyến giáp sản xuất không đủ hormone.','Mệt mỏi, Tăng cân, Da khô, Tóc rụng.','Viêm tuyến giáp Hashimoto, Thiếu i-ốt.','Bổ sung hormone Levothyroxine.','Ăn muối i-ốt đủ.','Bệnh nội tiết'),
('Hội chứng Cushing','hoi-chung-cushing','Cushing xảy ra khi cơ thể có quá nhiều cortisol.','Tăng cân, Mặt tròn, Rạn da, Huyết áp cao.','Dùng corticosteroid lâu dài, U tuyến yên.','Giảm hoặc ngưng thuốc, Phẫu thuật, Xạ trị.','Dùng thuốc steroid đúng chỉ định.','Bệnh nội tiết'),
-- === BỆNH THẦN KINH (5) ===
('Đau nửa đầu Migraine','dau-nua-dau-migraine','Migraine là chứng đau đầu mạn tính dữ dội.','Đau một bên đầu, Nhạy sáng, Buồn nôn.','Di truyền, Hoạt động não bất thường.','Thuốc giảm đau, Triptan, Dự phòng bằng thuốc.','Tránh stress, Ngủ đủ, Tập thể dục.','Bệnh thần kinh'),
('Bệnh Alzheimer','benh-alzheimer','Alzheimer gây suy giảm trí nhớ nhận thức và hành vi.','Quên sự kiện, Lú lẫn, Thay đổi tính cách.','Tích tụ mảng amyloid, Tuổi cao.','Thuốc ức chế cholinesterase, Chăm sóc hỗ trợ.','Tập luyện trí não, Lối sống lành mạnh.','Bệnh thần kinh'),
('Bệnh Parkinson','benh-parkinson','Parkinson là bệnh thoái hóa thần kinh gây run và cứng cơ.','Run tay, Cứng cơ, Cử động chậm, Mất thăng bằng.','Thiếu dopamine, Di truyền, Tuổi tác.','Thuốc Levodopa, Vật lý trị liệu, Kích thích não sâu.','Tập thể dục, Ăn uống khoa học.','Bệnh thần kinh'),
('Động kinh (Co giật)','dong-kinh','Động kinh là rối loạn thần kinh đặc trưng bởi các cơn co giật tái phát.','Co giật, Mất ý thức, Rối loạn cảm giác.','Tổn thương não, Di truyền, Không rõ nguyên nhân.','Thuốc chống động kinh, Phẫu thuật nếu cần.','Tránh mất ngủ, Ánh sáng nhấp nháy.','Bệnh thần kinh'),
('Đa xơ cứng (MS)','da-xo-cung','Đa xơ cứng là bệnh tự miễn phá hủy vỏ myelin của sợi thần kinh.','Yếu cơ, Tê bì, Mệt mỏi, Mất thăng bằng.','Tự miễn, Thiếu vitamin D, Di truyền.','Thuốc điều hòa miễn dịch, Corticoid, Vật lý trị liệu.','Không có cách phòng ngừa cụ thể.','Bệnh thần kinh'),
-- === BỆNH CƠ XƯƠNG KHỚP (5) ===
('Viêm khớp dạng thấp (RA)','viem-khop-dang-thap','RA là bệnh tự miễn gây viêm đối xứng nhiều khớp.','Đau, Sưng, Nóng đỏ khớp, Cứng khớp buổi sáng.','Tự miễn, Di truyền, Hút thuốc lá.','Thuốc DMARDs, Sinh học, Giảm đau.','Không hút thuốc, Tập vận động.','Bệnh cơ xương khớp'),
('Thoái hóa khớp (OA)','thoai-hoa-khop','Thoái hóa khớp là tổn thương sụn khớp và xương dưới sụn.','Đau khớp, Cứng khớp, Lạo xạo khi cử động.','Tuổi tác, Béo phì, Chấn thương.','Thuốc giảm đau, Vật lý trị liệu, Giảm cân.','Tập thể dục đều, Giữ cân nặng.','Bệnh cơ xương khớp'),
('Bệnh Gout (Gút)','benh-gout','Gout là viêm khớp do tích tụ acid uric.','Đau khớp dữ dội, Sưng, Nóng đỏ.','Acid uric cao, Ăn nhiều purine.','Thuốc giảm đau, Hạ acid uric máu.','Giảm rượu bia, Hạn chế thịt đỏ.','Bệnh cơ xương khớp'),
('Loãng xương','loang-xuong','Loãng xương là xương giòn yếu dễ gãy.','Đau lưng, Giảm chiều cao, Gù lưng.','Thiếu canxi, Thiếu vitamin D, Tuổi tác.','Bổ sung canxi, Vitamin D, Tập thể dục.','Ăn uống đủ chất, Không hút thuốc.','Bệnh cơ xương khớp'),
('Đau lưng dưới cấp tính','dau-lung-duoi-cap','Đau lưng cấp tính là đau đột ngột vùng thắt lưng.','Đau nhói, Co cơ, Đau khi cử động.','Căng cơ, Sai tư thế, Chấn thương.','Nghỉ ngơi ngắn, Chườm lạnh, Thuốc giảm đau.','Tập cơ lưng, Giữ tư thế đúng.','Bệnh cơ xương khớp');

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅ ĐÃ INSERT XONG 40 BỆNH TRA CỨU';
    RAISE NOTICE '';
    RAISE NOTICE '📊 THỐNG KÊ BỆNH:';
    RAISE NOTICE '- Bệnh hô hấp: 5';
    RAISE NOTICE '- Bệnh tiêu hóa: 5';
    RAISE NOTICE '- Bệnh tim mạch: 5';
    RAISE NOTICE '- Bệnh da liễu: 5';
    RAISE NOTICE '- Bệnh truyền nhiễm: 5';
    RAISE NOTICE '- Bệnh nội tiết: 5';
    RAISE NOTICE '- Bệnh thần kinh: 5';
    RAISE NOTICE '- Bệnh cơ xương khớp: 5';
    RAISE NOTICE '';
END $$;
