-- Tạo bảng Chat cho Real-time Chat System
-- Tương thích với schema hiện tại (lowercase)

-- Tạo bảng ChatThreads
CREATE TABLE IF NOT EXISTS chatthreads (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL DEFAULT 'Hỏi ý kiến bác sĩ',
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed')),
    attachment_type VARCHAR(50) DEFAULT 'general' CHECK (attachment_type IN ('product', 'order', 'general')),
    attachment_id INTEGER DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng ChatMessages
CREATE TABLE IF NOT EXISTS chatmessages (
    id SERIAL PRIMARY KEY,
    thread_id INTEGER NOT NULL REFERENCES chatthreads(id) ON DELETE CASCADE,
    sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sender_role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (sender_role IN ('user', 'admin')),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo indexes để tối ưu performance
CREATE INDEX IF NOT EXISTS idx_chatthreads_user_id ON chatthreads(user_id);
CREATE INDEX IF NOT EXISTS idx_chatthreads_status ON chatthreads(status);
CREATE INDEX IF NOT EXISTS idx_chatthreads_created_at ON chatthreads(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_chatmessages_thread_id ON chatmessages(thread_id);
CREATE INDEX IF NOT EXISTS idx_chatmessages_sender_id ON chatmessages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chatmessages_created_at ON chatmessages(created_at ASC);

-- Tạo trigger để auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER IF NOT EXISTS update_chatthreads_updated_at 
    BEFORE UPDATE ON chatthreads 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Comments để mô tả bảng
COMMENT ON TABLE chatthreads IS 'Cuộc hội thoại chat hỗ trợ khách hàng';
COMMENT ON COLUMN chatthreads.attachment_type IS 'product: Chat về sản phẩm | order: Chat về đơn hàng | general: Chat chung';
COMMENT ON COLUMN chatthreads.status IS 'active: Đang hoạt động | closed: Đã đóng';

COMMENT ON TABLE chatmessages IS 'Tin nhắn trong cuộc hội thoại chat';
COMMENT ON COLUMN chatmessages.sender_role IS 'user: Khách hàng | admin: Quản trị viên/Bác sĩ';

-- Thêm dữ liệu mẫu (optional)
-- INSERT INTO chatthreads (user_id, subject, status) VALUES 
-- (1, 'Tư vấn về thuốc giảm đau', 'active'),
-- (2, 'Hỏi về tác dụng phụ của thuốc', 'active');

-- INSERT INTO chatmessages (thread_id, sender_id, sender_role, content) VALUES
-- (1, 1, 'user', 'Xin chào, tôi muốn hỏi về thuốc giảm đau phù hợp cho người cao tuổi.'),
-- (1, 1, 'admin', 'Chào bạn! Tôi sẽ tư vấn cho bạn. Bạn có thể cho biết tuổi và tình trạng sức khỏe hiện tại không?');

COMMIT;