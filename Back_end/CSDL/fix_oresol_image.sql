-- =============================================
-- FIX: Sửa ảnh trùng cho sản phẩm Oresol
-- Date: 2025-11-06
-- Problem: Oresol và Siro ho đang dùng chung ảnh ibuprofen.jpg
-- Solution: Đổi Oresol sang dùng cephalexin.jpg
-- =============================================

-- Cập nhật ảnh cho sản phẩm Oresol
UPDATE public."Products" 
SET "Image" = 'cephalexin.jpg'
WHERE "Slug" = 'oresol-bu-nuoc';

-- Kiểm tra kết quả
SELECT "Id", "Name", "Image" 
FROM public."Products" 
WHERE "Slug" IN ('oresol-bu-nuoc', 'siro-ho-tre-em')
ORDER BY "Id";

-- Thông báo hoàn tất
DO $$ 
BEGIN 
  RAISE NOTICE '✅ Đã sửa ảnh cho sản phẩm Oresol: cephalexin.jpg';
  RAISE NOTICE '✅ Siro ho trẻ em: ibuprofen.jpg';
END $$;
