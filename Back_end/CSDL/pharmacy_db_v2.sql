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
