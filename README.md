Pharmacy Project
================

Tổng quan
---------
Đây là repo một ứng dụng "Pharmacy" gồm backend (Node/Express + PostgreSQL) và frontend (React + Vite). Dự án chạy bằng Docker Compose (db, pgAdmin, backend, frontend).

Mục tiêu file này
-----------------
- Liệt kê cấu trúc thư mục chính hiện có
- Tóm tắt chức năng chính của từng phần
- Mô tả luồng dữ liệu (data flow) cho các tính năng quan trọng (Auth, Profile, Chat)
- Hướng dẫn chạy / debug nhanh với Docker Compose
- Hướng dẫn thêm dữ liệu demo (SQL)
- Ghi chú các sửa và khuyến nghị đã thực hiện

Cấu trúc thư mục (tóm tắt)
--------------------------
Back_End_Pharmacy/
├─ docker-compose.yml
├─ PROJECT_STRUCTURE.md
├─ README.md
├─ Back_end/
│  ├─ Dockerfile
│  ├─ .env                 # (env của backend, chứa DB_* etc.)
│  ├─ db_config.js
│  ├─ index.js             # entrypoint express (app + socket.io)
│  ├─ package.json
│  ├─ src/
│  │  ├─ controllers/
│  │  │  ├─ announcementController.js
│  │  │  ├─ chatController.js        # chat API (threads/messages)
│  │  │  ├─ userController.js        # /api/users/me, update, changePassword
│  │  │  └─ ...                      # các controller khác
│  │  ├─ services/
│  │  │  └─ chatService.js
│  │  ├─ middleware/
│  │  │  └─ auth.js                  # authenticateToken (JWT)
│  │  ├─ routes/
│  │  │  ├─ authRoutes.js
│  │  │  ├─ userRoutes.js
│  │  │  └─ chatRoutes.js
│  │  └─ ... 
│  ├─ CSDL/
│  │  ├─ 1_schema.sql
│  │  ├─ add_avatar_column_fix.sql   # file đã tạo & chạy (thêm Avatar, UpdatedAt)
│  │  ├─ create_chat_tables.sql
│  │  ├─ insert_chat_demo_data.sql
│  │  ├─ insert_chat_demo_data_v2.sql # demo data tương thích PascalCase
│  │  ├─ pharmacy_db_v2.sql
│  │  └─ ... 
│  └─ public/
│     └─ (static assets nếu có)
│
├─ Front_end/
│  ├─ Dockerfile
│  ├─ package.json
│  ├─ vite.config.js
│  ├─ src/
│  │  ├─ main.jsx                   # mount App, AuthProvider, ChatProvider
│  │  ├─ App.jsx                    # routes + layout
│  │  ├─ api.jsx                    # axios instance + helpers (getMe, updateMe, chat APIs)
│  │  ├─ config.js
│  │  ├─ index.css
│  │  ├─ context/
│  │  │  ├─ AuthContext/
│  │  │  │  └─ AuthContext.jsx
│  │  │  └─ ChatContext/
│  │  │     └─ ChatContext.jsx       # ChatProvider, useChat hook, socket logic
│  │  ├─ pages/
│  │  │  ├─ user/
│  │  │  │  ├─ Profile/
│  │  │  │  │  └─ Profile.jsx       # sửa avatarFile + load user
│  │  │  │  ├─ SupportChat/
│  │  │  │  │  └─ SupportChat.jsx
│  │  │  │  ├─ Shop/
│  │  │  │  └─ ...
│  │  │  └─ admin/
│  │  │     └─ AdminChatManagement/
│  │  ├─ components/
│  │  │  └─ ... (Header, Footer, ProductCard, etc.)
│  │  └─ public/ (assets)
│  └─ public/
│     └─ images/
│        └─ products/
│
└─ .gitignore (recommended)

Chức năng chính (tóm tắt)
-------------------------
- Authentication: JWT-based, token lưu vào `localStorage` (key: `ph_auth`), axios tự thêm header Authorization.
- Profile: đọc `/api/users/me`, cập nhật `/api/users/me` (patch), avatar có thể gửi base64 lên server.
- Product & Cart & Orders: các endpoint RESTful (GET /products, POST /cart/items, POST /orders/checkout ...)
- Chat (Support Chat): realtime bằng Socket.IO + API REST để lấy threads & messages. Backend dùng các bảng `ChatThreads` và `ChatMessages`.
- Admin: giao diện quản trị (admin-only) để xem threads, join các threads, trả lời.

Luồng dữ liệu chính
--------------------
1) Auth (đăng nhập)
- Frontend: gửi POST `/api/auth/login` -> Backend xác thực -> trả về JWT + user info
- Frontend lưu `ph_auth` { token, user } vào localStorage; axios được cấu hình tự động thêm Authorization

2) Profile (xem & cập nhật)
- Khi mở trang Profile, frontend gọi `getMe()` (GET `/api/users/me`) với JWT.
- Backend middleware `authenticateToken` verify JWT -> set `req.user = { Id, Role }`.
- Backend query DB (bảng `Users`) để trả về thông tin.
- Cập nhật avatar: frontend gửi base64 trong payload patch `/api/users/me`.
  - LƯU Ý: truyền ảnh base64 có thể lớn. Nếu server trả lỗi `PayloadTooLargeError`, cần tăng giới hạn body parser ở backend (ví dụ: `app.use(express.json({ limit: '5mb' }))`) hoặc upload file (multipart) thay vì base64.

3) Chat (realtime)
- Khi user đăng nhập, `ChatProvider` khởi tạo kết nối Socket.IO tới backend `ws://...:5001/socket.io`.
- Backend xác thực socket bằng token (emit authenticate), sau đó join room tương ứng (`thread_<id>`, `admin_room`).
- User gửi message -> emit `send_message` event hoặc gọi REST API -> backend lưu vào `ChatMessages` và phát (`emit`) tới các client trong room.
- Admin/Agent trả lời -> backend lưu và emit real-time đến user.

Hướng dẫn chạy (Docker Compose)
-------------------------------
(đi trong thư mục root `Back_End_Pharmacy`)

PowerShell (Windows):

```powershell
# Bật container (build lần đầu nếu cần)
docker compose up -d --build

# Xem logs (backend)
docker logs -f pharmacy_backend

# Dừng
docker compose down
```

Cổng mặc định (theo `docker-compose.yml`):
- Frontend: http://localhost:5173
- Backend API: http://localhost:5001/api
- PostgreSQL: localhost:5432
- pgAdmin: http://localhost:5050 (mặc định user `admin@pharmacy.com` / `123456`)

Chạy local không Docker (nếu muốn):
- Backend: cd `Back_end` -> `npm install` -> `npm run dev` (hoặc `node index.js`)
- Frontend: cd `Front_end` -> `npm install` -> `npm run dev`

Thêm dữ liệu demo vào DB (manual)
---------------------------------
- Mở pgAdmin -> kết nối DB `pharmacy_db`.
- Mở Query tool và chạy file:
  - `Back_end/CSDL/insert_chat_demo_data_v2.sql` (nếu backend dùng PascalCase table names) hoặc
  - `Back_end/CSDL/insert_chat_demo_data.sql` (nếu dùng lowercase names).
- Trước khi chạy, kiểm tra `Users` table để biết ID của user/admin, chỉnh `SenderId` trong file SQL tương ứng.

Các sửa đã thực hiện trong repo
-------------------------------
- Đã thêm `ChatProvider` wrap `App` trong `Front_end/src/main.jsx` để khắc phục lỗi `useChat must be used within a ChatProvider`.
- Đã sửa `Profile.jsx` để khai báo `avatarFile` state (fix lỗi biến chưa khai báo).
- Đã tạo file SQL `Back_end/CSDL/add_avatar_column_fix.sql` và đã chạy để thêm cột `Avatar` và `UpdatedAt` cho bảng `Users`. Lỗi 500 khi truy vấn profile được khắc phục.
- Phát hiện lỗi `PayloadTooLargeError` khi upload avatar base64 lớn — khuyến nghị tăng limit `express.json({ limit: '5mb' })` hoặc chuyển sang upload multipart.
- Đã tạo các file demo SQL `insert_chat_demo_data_v2.sql` để dễ populate dữ liệu chat.

Debug & Troubleshooting (nhanh)
-------------------------------
- Nếu frontend báo lỗi 500 cho `/api/users/me`: kiểm tra logs backend
  ```powershell
docker logs -f pharmacy_backend
  ```
  - Nếu log có `column "Avatar" does not exist` -> chạy `add_avatar_column_fix.sql`.
  - Nếu log có `PayloadTooLargeError` -> tăng limit `express.json({ limit: '5mb' })` trong backend entrypoint (ví dụ `index.js`).
- Socket.IO connection fail (ws closed before connection is established): kiểm tra backend socket logs và đảm bảo backend lắng nghe cổng 5001, và frontend `VITE_API_BASE` đúng (http://localhost:5001/api) và socket URL khớp (ws://localhost:5001).
- Nếu node_modules/permission issues khi cài: xóa `node_modules` và cài lại, hoặc đảm bảo no process đang giữ file (`TASKKILL` hoặc restart máy nếu cần). Tránh commit `node_modules`.

Git / Lưu trữ
--------------
- Đề nghị commit các thay đổi mã nguồn (server code, sửa trong `Front_end/src`, file SQL, docs)
- Thêm `.gitignore` nếu chưa có, exclude: `node_modules/`, `.env`, `Back_end/CSDL/*.sql` nếu chứa dữ liệu nhạy cảm, `frontend_node_modules/` (docker volume).

Phụ lục: Đoạn mã gợi ý (tăng payload limit)
-------------------------------------------
Trong file entrypoint backend (ví dụ `Back_end/src/index.js` hoặc `Back_end/index.js`), trước khi định nghĩa routes, thêm:

```javascript
const express = require('express');
const app = express();

// tăng giới hạn body parsing (để chấp nhận avatar base64 lớn)
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
```

Nếu muốn an toàn hơn, chuyển upload avatar sang multipart/form-data và lưu file (filesystem hoặc cloud storage) thay vì lưu base64 trong DB.

---

Nếu bạn muốn tôi thực hiện thêm một trong các bước sau, chọn 1-2 mục bên dưới và tôi sẽ chạy:
- [ ] Thêm snippet `express.json({ limit... })` trực tiếp vào file backend và restart container
- [ ] Tạo `.gitignore` tốt (nếu chưa có)
- [ ] Commit các thay đổi hiện tại và chuẩn bị hướng dẫn push lên GitHub

Hoàn thành task: hiện đang mark `Generate README` complete. Tôi sẽ cập nhật todo list khi bạn chọn bước tiếp theo.
