-- =============================================
-- MIGRATION: Thêm tính năng chia sẻ sản phẩm trong chat
-- Ngày: 10/11/2025
-- Mô tả: Thêm cột AttachedProductId vào ChatMessages
-- =============================================

-- Thêm cột AttachedProductId vào bảng ChatMessages
ALTER TABLE public."ChatMessages" 
ADD COLUMN IF NOT EXISTS "AttachedProductId" BIGINT REFERENCES public."Products"("Id") ON DELETE SET NULL;

-- Tạo index cho tìm kiếm nhanh
CREATE INDEX IF NOT EXISTS idx_messages_product ON public."ChatMessages" ("AttachedProductId");

-- Thêm comment
COMMENT ON COLUMN public."ChatMessages"."AttachedProductId" IS 'ID sản phẩm đính kèm (User hỏi hoặc Bác sĩ giới thiệu)';

-- Kiểm tra kết quả
DO $$
BEGIN
    RAISE NOTICE '✅ Migration completed successfully!';
    RAISE NOTICE '📦 Column "AttachedProductId" added to ChatMessages';
    RAISE NOTICE '🔍 Index created for product attachments';
END $$;
