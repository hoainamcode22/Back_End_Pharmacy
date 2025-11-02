// AUTO-FIX: Xóa token cũ khi gặp lỗi 401/403
// Thêm vào file: Front_end/src/api.jsx

import axios from "axios";
import { API_BASE } from "./config";

const api = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
});

// ========== AUTO-INIT TOKEN FROM LOCALSTORAGE ==========
try {
    const auth = JSON.parse(localStorage.getItem("ph_auth") || "{}");
    if (auth.token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`;
    }
} catch {
    // No auth token found
}

// ========== INTERCEPTOR: TỰ ĐỘNG XÓA TOKEN KHI HẾT HẠN ==========
api.interceptors.response.use(
    (response) => response, // Success: giữ nguyên
    (error) => {
        // Nếu lỗi 401 (Unauthorized) hoặc 403 (Forbidden)
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            const errorMsg = error.response.data?.error || '';

            // Nếu message chứa "token" hoặc "hết hạn"
            if (errorMsg.toLowerCase().includes('token') ||
                errorMsg.toLowerCase().includes('hết hạn') ||
                errorMsg.toLowerCase().includes('không hợp lệ')) {

                // XÓA TOKEN CŨ
                localStorage.removeItem('ph_auth');
                delete api.defaults.headers.common["Authorization"];

                // Hiển thị thông báo
                alert('⚠️ Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');

                // Chuyển về trang login
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

// ========== PHẦN CÒN LẠI GIỮ NGUYÊN ==========
export function setAuthToken(token) {
    if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    else delete api.defaults.headers.common["Authorization"];
}

// ... rest of the code
export default api;
