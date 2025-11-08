-- Thêm cột Avatar vào bảng Users
-- Chạy file này trong PostgreSQL để fix lỗi Profile

-- Thêm cột Avatar (TEXT để lưu base64 hoặc URL)
ALTER TABLE "Users" 
ADD COLUMN IF NOT EXISTS "Avatar" TEXT DEFAULT NULL;

-- Thêm cột UpdatedAt nếu chưa có
ALTER TABLE "Users" 
ADD COLUMN IF NOT EXISTS "UpdatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Tạo trigger để auto-update UpdatedAt
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW."UpdatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger cũ nếu có
DROP TRIGGER IF EXISTS trigger_update_users_updated_at ON "Users";

-- Tạo trigger mới
CREATE TRIGGER trigger_update_users_updated_at
    BEFORE UPDATE ON "Users"
    FOR EACH ROW
    EXECUTE FUNCTION update_users_updated_at();

-- Verify
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'Users' 
AND column_name IN ('Avatar', 'UpdatedAt')
ORDER BY column_name;

-- Test data (optional) - Thêm avatar mẫu cho user ID 1
-- UPDATE "Users" 
-- SET "Avatar" = 'https://ui-avatars.com/api/?name=Nguyen+Hoai+Nam&background=10b981&color=fff&size=200'
-- WHERE "Id" = 1;

COMMIT;
