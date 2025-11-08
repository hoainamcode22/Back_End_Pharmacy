-- INSERT dữ liệu demo cho Chat System
-- Chạy file này sau khi đã tạo bảng chatthreads và chatmessages

-- =====================================================
-- CÁCH SỬ DỤNG:
-- 1. Đảm bảo đã chạy file create_chat_tables.sql trước
-- 2. Thay đổi user_id phù hợp với database của bạn
-- 3. Copy và paste vào PostgreSQL console hoặc pgAdmin
-- =====================================================

-- Xóa dữ liệu cũ (nếu có)
TRUNCATE TABLE chatmessages CASCADE;
TRUNCATE TABLE chatthreads RESTART IDENTITY CASCADE;

-- =====================================================
-- INSERT DEMO CHAT THREADS
-- =====================================================

-- Thread 1: Tư vấn về thuốc giảm đau
INSERT INTO chatthreads (user_id, subject, status, attachment_type, attachment_id, created_at, updated_at) 
VALUES 
(1, 'Tư vấn về thuốc giảm đau cho người cao tuổi', 'active', 'general', NULL, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '10 minutes');

-- Thread 2: Hỏi về tác dụng phụ
INSERT INTO chatthreads (user_id, subject, status, attachment_type, attachment_id, created_at, updated_at) 
VALUES 
(1, 'Hỏi về tác dụng phụ của Paracetamol', 'active', 'product', 1, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '5 minutes');

-- Thread 3: Đơn hàng bị chậm
INSERT INTO chatthreads (user_id, subject, status, attachment_type, attachment_id, created_at, updated_at) 
VALUES 
(1, 'Đơn hàng #123 bị chậm giao', 'closed', 'order', 1, NOW() - INTERVAL '1 day', NOW() - INTERVAL '12 hours');

-- Thread 4: Tư vấn sức khỏe
INSERT INTO chatthreads (user_id, subject, status, attachment_type, attachment_id, created_at, updated_at) 
VALUES 
(2, 'Tư vấn về bệnh tiểu đường', 'active', 'general', NULL, NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '2 minutes');

-- =====================================================
-- INSERT DEMO CHAT MESSAGES
-- =====================================================

-- Messages cho Thread 1
INSERT INTO chatmessages (thread_id, sender_id, sender_role, content, created_at) 
VALUES 
(1, 1, 'user', 'Xin chào bác sĩ, tôi muốn hỏi về thuốc giảm đau phù hợp cho người cao tuổi.', NOW() - INTERVAL '2 hours'),
(1, 2, 'admin', 'Chào bạn! Tôi là Bác sĩ Nguyễn Văn A. Bạn có thể cho biết người cao tuổi đó bao nhiêu tuổi và có bệnh lý nền không?', NOW() - INTERVAL '1 hour 50 minutes'),
(1, 1, 'user', 'Dạ, ông tôi 75 tuổi, có huyết áp cao và đang uống thuốc huyết áp đều đặn ạ.', NOW() - INTERVAL '1 hour 45 minutes'),
(1, 2, 'admin', 'Với người cao tuổi có huyết áp cao, tôi khuyên dùng Paracetamol 500mg. Liều dùng: 1-2 viên, không quá 3g/ngày. Tránh dùng các thuốc nhóm NSAID như Ibuprofen vì có thể làm tăng huyết áp.', NOW() - INTERVAL '1 hour 40 minutes'),
(1, 1, 'user', 'Cảm ơn bác sĩ nhiều ạ! Vậy có cần kiêng khem gì không ạ?', NOW() - INTERVAL '1 hour 35 minutes'),
(1, 2, 'admin', 'Nên uống thuốc sau khi ăn, tránh uống rượu bia. Nếu đau dai dẳng quá 3 ngày thì nên đi khám bác sĩ trực tiếp nhé!', NOW() - INTERVAL '1 hour 30 minutes'),
(1, 1, 'user', 'Dạ em cảm ơn bác sĩ ạ! 🙏', NOW() - INTERVAL '10 minutes');

-- Messages cho Thread 2
INSERT INTO chatmessages (thread_id, sender_id, sender_role, content, created_at) 
VALUES 
(2, 1, 'user', 'Cho em hỏi Paracetamol có tác dụng phụ gì không ạ?', NOW() - INTERVAL '1 hour'),
(2, 2, 'admin', 'Paracetamol khá an toàn khi dùng đúng liều. Tác dụng phụ hiếm gặp: buồn nôn, dị ứng da. Lưu ý: KHÔNG dùng quá 4g/ngày vì có thể gây độc gan nghiêm trọng!', NOW() - INTERVAL '55 minutes'),
(2, 1, 'user', 'Em uống 2 viên 500mg một lần có sao không ạ?', NOW() - INTERVAL '50 minutes'),
(2, 2, 'admin', 'Được bạn, nhưng khoảng cách giữa 2 lần uống phải tối thiểu 4-6 giờ. Tối đa 6 viên/ngày (3g). Nếu còn đau sau 3 ngày thì nên đi khám nhé!', NOW() - INTERVAL '45 minutes'),
(2, 1, 'user', 'Cảm ơn bác sĩ! 😊', NOW() - INTERVAL '5 minutes');

-- Messages cho Thread 3 (Đã đóng)
INSERT INTO chatmessages (thread_id, sender_id, sender_role, content, created_at) 
VALUES 
(3, 1, 'user', 'Đơn hàng #123 của em đã 5 ngày rồi mà chưa nhận được hàng ạ.', NOW() - INTERVAL '1 day'),
(3, 2, 'admin', 'Em cho anh xem mã đơn hàng để anh kiểm tra giúp em nhé!', NOW() - INTERVAL '23 hours'),
(3, 1, 'user', 'Dạ mã đơn hàng là #123 ạ. Em đặt ngày 4/11.', NOW() - INTERVAL '22 hours'),
(3, 2, 'admin', 'Anh đã kiểm tra, đơn hàng đang ở bưu cục gần nhà em. Shipper sẽ giao trong hôm nay. Anh xin lỗi vì sự chậm trễ này!', NOW() - INTERVAL '20 hours'),
(3, 1, 'user', 'Dạ em cảm ơn anh! Em đã nhận được hàng rồi ạ. ✅', NOW() - INTERVAL '12 hours');

-- Messages cho Thread 4
INSERT INTO chatmessages (thread_id, sender_id, sender_role, content, created_at) 
VALUES 
(4, 2, 'user', 'Bác sĩ ơi, mẹ em bị tiểu đường type 2, em nên lưu ý gì ạ?', NOW() - INTERVAL '30 minutes'),
(4, 2, 'admin', 'Với tiểu đường type 2, cần: 1) Ăn ít đường, tinh bột. 2) Tập thể dục đều đặn. 3) Uống thuốc đúng giờ. 4) Theo dõi đường huyết thường xuyên. Mẹ bạn đang uống thuốc gì?', NOW() - INTERVAL '25 minutes'),
(4, 2, 'user', 'Dạ mẹ em uống Metformin 500mg mỗi ngày ạ.', NOW() - INTERVAL '20 minutes'),
(4, 2, 'admin', 'Tốt! Metformin là thuốc cơ bản cho tiểu đường type 2. Nên uống sau ăn để giảm tác dụng phụ. Nếu đường huyết còn cao thì báo bác sĩ để điều chỉnh liều nhé!', NOW() - INTERVAL '15 minutes'),
(4, 2, 'user', 'Dạ em cảm ơn bác sĩ! 🙏', NOW() - INTERVAL '2 minutes');

-- =====================================================
-- VERIFY DATA
-- =====================================================

-- Kiểm tra số lượng threads
SELECT COUNT(*) as total_threads FROM chatthreads;

-- Kiểm tra số lượng messages
SELECT COUNT(*) as total_messages FROM chatmessages;

-- Xem danh sách threads
SELECT 
    id,
    user_id,
    subject,
    status,
    attachment_type,
    TO_CHAR(created_at, 'DD/MM/YYYY HH24:MI') as created,
    TO_CHAR(updated_at, 'DD/MM/YYYY HH24:MI') as updated
FROM chatthreads 
ORDER BY updated_at DESC;

-- Xem messages của từng thread
SELECT 
    t.id as thread_id,
    t.subject,
    m.sender_role,
    m.content,
    TO_CHAR(m.created_at, 'DD/MM HH24:MI') as sent_time
FROM chatthreads t
LEFT JOIN chatmessages m ON t.id = m.thread_id
ORDER BY t.id, m.created_at;

-- =====================================================
-- LƯU Ý:
-- - Thay đổi user_id (1, 2) thành ID thực tế trong bảng users của bạn
-- - Nếu muốn admin trả lời, đảm bảo sender_id là ID của admin
-- - Có thể thay đổi nội dung message tùy ý
-- =====================================================

COMMIT;
