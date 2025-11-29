//export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001/api";
//export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5001";

//const API_BASE_URL = 'https://be-1-kh9g.onrender.com';

// =========================================================================
// SỬA LỖI: CẬP NHẬT TẤT CẢ CÁC URL TỪ LOCALHOST SANG PUBLIC URL CỦA BACKEND
// =========================================================================

// API_BASE là URL cơ sở cho tất cả các cuộc gọi API (dùng trong api.jsx)
// Nếu biến môi trường VITE_API_BASE không tồn tại, sẽ dùng URL PUBLIC của Render.
export const API_BASE = import.meta.env.VITE_API_BASE || "https://be-1-kh9g.onrender.com/api";

// SOCKET_URL là URL để Frontend kết nối Socket.IO
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://be-1-kh9g.onrender.com";

// Lưu ý: Dòng "const API_BASE_URL = ..." đã được xóa vì nó không được export và gây nhầm lẫn.