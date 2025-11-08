-- Thêm cột Avatar vào bảng Users
ALTER TABLE public."Users" 
ADD COLUMN IF NOT EXISTS "Avatar" TEXT;

-- Comment
COMMENT ON COLUMN public."Users"."Avatar" IS 'Ảnh đại diện (base64 hoặc URL)';
