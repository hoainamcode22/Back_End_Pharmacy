-- =====================================================
-- INSERT DỮ LIỆU DEMO CHO CHAT SYSTEM (PascalCase)
-- Tương thích với code Backend đang sử dụng
-- =====================================================

-- LƯU Ý: Thay đổi UserId phù hợp với database của bạn
-- User ID 1: Khách hàng thường
-- User ID 2: Admin hoặc khách hàng khác

-- Xóa dữ liệu cũ (nếu có)
TRUNCATE TABLE "ChatMessages" CASCADE;
TRUNCATE TABLE "ChatThreads" RESTART IDENTITY CASCADE;

-- =====================================================
-- INSERT DEMO CHAT THREADS
-- =====================================================

-- Thread 1: Tư vấn về thuốc giảm đau (ACTIVE)
INSERT INTO "ChatThreads" ("UserId", "Title", "Status", "AttachmentType", "AttachmentId", "CreatedAt", "UpdatedAt") 
VALUES 
(1, 'Tư vấn về thuốc giảm đau cho người cao tuổi', 'active', 'general', NULL, 
 NOW() - INTERVAL '2 hours', NOW() - INTERVAL '10 minutes');

-- Thread 2: Hỏi về sản phẩm (ACTIVE)
INSERT INTO "ChatThreads" ("UserId", "Title", "Status", "AttachmentType", "AttachmentId", "CreatedAt", "UpdatedAt") 
VALUES 
(1, 'Hỏi về tác dụng phụ của Paracetamol', 'active', 'product', 1, 
 NOW() - INTERVAL '1 hour', NOW() - INTERVAL '5 minutes');

-- Thread 3: Vấn đề đơn hàng (CLOSED)
INSERT INTO "ChatThreads" ("UserId", "Title", "Status", "AttachmentType", "AttachmentId", "CreatedAt", "UpdatedAt") 
VALUES 
(1, 'Đơn hàng #123 bị chậm giao', 'closed', 'order', 1, 
 NOW() - INTERVAL '1 day', NOW() - INTERVAL '12 hours');

-- Thread 4: Tư vấn sức khỏe (ACTIVE - CHƯA CÓ TRẢ LỜI ADMIN)
INSERT INTO "ChatThreads" ("UserId", "Title", "Status", "AttachmentType", "AttachmentId", "CreatedAt", "UpdatedAt") 
VALUES 
(1, 'Tư vấn về bệnh tiểu đường', 'active', 'general', NULL, 
 NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '2 minutes');

-- =====================================================
-- INSERT DEMO CHAT MESSAGES
-- =====================================================

-- Messages cho Thread 1 (ID = 1)
INSERT INTO "ChatMessages" ("ThreadId", "SenderId", "SenderRole", "Content", "CreatedAt") 
VALUES 
-- User hỏi
(1, 1, 'user', 'Xin chào bác sĩ, tôi muốn hỏi về thuốc giảm đau phù hợp cho người cao tuổi.', 
 NOW() - INTERVAL '2 hours'),

-- Admin trả lời (giả sử admin có ID = 2, nếu khác thì sửa SenderId)
(1, 2, 'admin', 'Chào bạn! Tôi là Bác sĩ Nguyễn Văn A. Bạn có thể cho biết người cao tuổi đó bao nhiêu tuổi và có bệnh lý nền không?', 
 NOW() - INTERVAL '1 hour 50 minutes'),

(1, 1, 'user', 'Dạ, ông tôi 75 tuổi, có huyết áp cao và đang uống thuốc huyết áp đều đặn ạ.', 
 NOW() - INTERVAL '1 hour 45 minutes'),

(1, 2, 'admin', 'Với người cao tuổi có huyết áp cao, tôi khuyên dùng Paracetamol 500mg. Liều dùng: 1-2 viên, không quá 3g/ngày. Tránh dùng các thuốc nhóm NSAID như Ibuprofen vì có thể làm tăng huyết áp.', 
 NOW() - INTERVAL '1 hour 40 minutes'),

(1, 1, 'user', 'Cảm ơn bác sĩ nhiều ạ! Vậy có cần kiêng khem gì không ạ?', 
 NOW() - INTERVAL '1 hour 35 minutes'),

(1, 2, 'admin', 'Nên uống thuốc sau khi ăn, tránh uống rượu bia. Nếu đau dai dẳng quá 3 ngày thì nên đi khám bác sĩ trực tiếp nhé!', 
 NOW() - INTERVAL '1 hour 30 minutes'),

(1, 1, 'user', 'Dạ em cảm ơn bác sĩ ạ! 🙏', 
 NOW() - INTERVAL '10 minutes');

-- Messages cho Thread 2 (ID = 2)
INSERT INTO "ChatMessages" ("ThreadId", "SenderId", "SenderRole", "Content", "CreatedAt") 
VALUES 
(2, 1, 'user', 'Cho em hỏi Paracetamol có tác dụng phụ gì không ạ?', 
 NOW() - INTERVAL '1 hour'),

(2, 2, 'admin', 'Paracetamol khá an toàn khi dùng đúng liều. Tác dụng phụ hiếm gặp: buồn nôn, dị ứng da. Lưu ý: KHÔNG dùng quá 4g/ngày vì có thể gây độc gan nghiêm trọng!', 
 NOW() - INTERVAL '55 minutes'),

(2, 1, 'user', 'Em uống 2 viên 500mg một lần có sao không ạ?', 
 NOW() - INTERVAL '50 minutes'),

(2, 2, 'admin', 'Được bạn, nhưng khoảng cách giữa 2 lần uống phải tối thiểu 4-6 giờ. Tối đa 6 viên/ngày (3g). Nếu còn đau sau 3 ngày thì nên đi khám nhé!', 
 NOW() - INTERVAL '45 minutes'),

(2, 1, 'user', 'Cảm ơn bác sĩ! 😊', 
 NOW() - INTERVAL '5 minutes');

-- Messages cho Thread 3 (ID = 3) - Đã đóng
INSERT INTO "ChatMessages" ("ThreadId", "SenderId", "SenderRole", "Content", "CreatedAt") 
VALUES 
(3, 1, 'user', 'Đơn hàng #123 của em đã 5 ngày rồi mà chưa nhận được hàng ạ.', 
 NOW() - INTERVAL '1 day'),

(3, 2, 'admin', 'Em cho anh xem mã đơn hàng để anh kiểm tra giúp em nhé!', 
 NOW() - INTERVAL '23 hours'),

(3, 1, 'user', 'Dạ mã đơn hàng là #123 ạ. Em đặt ngày 4/11.', 
 NOW() - INTERVAL '22 hours'),

(3, 2, 'admin', 'Anh đã kiểm tra, đơn hàng đang ở bưu cục gần nhà em. Shipper sẽ giao trong hôm nay. Anh xin lỗi vì sự chậm trễ này!', 
 NOW() - INTERVAL '20 hours'),

(3, 1, 'user', 'Dạ em cảm ơn anh! Em đã nhận được hàng rồi ạ. ✅', 
 NOW() - INTERVAL '12 hours');

-- Messages cho Thread 4 (ID = 4) - Chưa có admin trả lời
INSERT INTO "ChatMessages" ("ThreadId", "SenderId", "SenderRole", "Content", "CreatedAt") 
VALUES 
(4, 1, 'user', 'Bác sĩ ơi, mẹ em bị tiểu đường type 2, em nên lưu ý gì ạ?', 
 NOW() - INTERVAL '30 minutes'),

(4, 1, 'user', 'Mẹ em đang uống Metformin 500mg mỗi ngày ạ.', 
 NOW() - INTERVAL '20 minutes'),

(4, 1, 'user', 'Bác sĩ có thể tư vấn giúp em được không ạ? 🙏', 
 NOW() - INTERVAL '2 minutes');

-- =====================================================
-- VERIFY DATA
-- =====================================================

-- Kiểm tra số lượng
SELECT 
    'Threads' as type,
    COUNT(*) as count,
    COUNT(CASE WHEN "Status" = 'active' THEN 1 END) as active,
    COUNT(CASE WHEN "Status" = 'closed' THEN 1 END) as closed
FROM "ChatThreads"
UNION ALL
SELECT 
    'Messages' as type,
    COUNT(*) as count,
    COUNT(CASE WHEN "SenderRole" = 'user' THEN 1 END) as from_user,
    COUNT(CASE WHEN "SenderRole" = 'admin' THEN 1 END) as from_admin
FROM "ChatMessages";

-- Xem chi tiết threads
SELECT 
    "Id",
    "UserId",
    "Title",
    "Status",
    "AttachmentType",
    TO_CHAR("CreatedAt", 'DD/MM/YYYY HH24:MI') as "Created",
    TO_CHAR("UpdatedAt", 'DD/MM/YYYY HH24:MI') as "Updated"
FROM "ChatThreads" 
ORDER BY "UpdatedAt" DESC;

-- Xem messages của từng thread
SELECT 
    t."Id" as "ThreadId",
    t."Title",
    m."SenderRole",
    LEFT(m."Content", 50) || '...' as "Content",
    TO_CHAR(m."CreatedAt", 'DD/MM HH24:MI') as "Time"
FROM "ChatThreads" t
LEFT JOIN "ChatMessages" m ON t."Id" = m."ThreadId"
ORDER BY t."Id", m."CreatedAt";

-- Thống kê
SELECT 
    'Total Threads' as stat,
    COUNT(*)::text as value
FROM "ChatThreads"
UNION ALL
SELECT 
    'Active Threads',
    COUNT(*)::text
FROM "ChatThreads" WHERE "Status" = 'active'
UNION ALL
SELECT 
    'Unanswered Threads',
    COUNT(*)::text
FROM "ChatThreads" t
WHERE t."Status" = 'active' 
AND NOT EXISTS (
    SELECT 1 FROM "ChatMessages" m 
    WHERE m."ThreadId" = t."Id" AND m."SenderRole" = 'admin'
)
UNION ALL
SELECT 
    'Total Messages',
    COUNT(*)::text
FROM "ChatMessages";

-- =====================================================
-- HƯỚNG DẪN SỬ DỤNG:
-- =====================================================
-- 1. Đảm bảo đã tạo bảng ChatThreads và ChatMessages
-- 2. Kiểm tra ID của user trong bảng Users:
--    SELECT "Id", "Username", "Role" FROM "Users";
-- 3. Thay đổi SenderId trong INSERT statements:
--    - SenderId = 1: User thường (customer)
--    - SenderId = 2: Admin (hoặc ID admin thực tế trong DB)
-- 4. Copy toàn bộ script và chạy trong PostgreSQL
-- 5. Reload trang web để xem kết quả

COMMIT;
