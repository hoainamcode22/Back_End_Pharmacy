// src/api.jsx
import axios from "axios";
import { API_BASE } from "./config";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// ========== AUTH ==========
// Giữ nguyên logic cũ để tương thích login hiện có.
export function setAuthToken(token) {
  if (token) api.defaults.headers.common["Authorization"] = token; // đổi thành `Bearer ${token}` nếu backend yêu cầu
  else delete api.defaults.headers.common["Authorization"];
}

// ========== PRODUCT (Danh mục/Chi tiết) ==========
/** [USER] Lấy danh sách sản phẩm (có tìm kiếm/lọc) */
export const fetchProducts = (params = {}) =>
  api.get("/products", { params }).then((r) => r.data);

/** [USER] Lấy chi tiết 1 sản phẩm theo id */
export const fetchProductById = (id) =>
  api.get(`/products/${id}`).then((r) => r.data);

// ========== CART (Giỏ hàng) ==========
/** [USER] Lấy giỏ hàng hiện tại của user */
export const getCart = () => api.get("/cart").then((r) => r.data);

/** [USER] Thêm sản phẩm vào giỏ { productId, qty } */
export const addToCart = (productId, qty = 1) =>
  api.post("/cart/items", { productId, qty }).then((r) => r.data);

/** [USER] Cập nhật số lượng 1 item trong giỏ */
export const updateCartItem = (itemId, qty) =>
  api.patch(`/cart/items/${itemId}`, { qty }).then((r) => r.data);

/** [USER] Xoá 1 item khỏi giỏ */
export const removeCartItem = (itemId) =>
  api.delete(`/cart/items/${itemId}`).then((r) => r.data);

// ========== ORDER (Đơn hàng/Checkout) ==========
/** [USER] Tạo đơn hàng từ giỏ */
export const checkout = (payload) =>
  api.post("/orders/checkout", payload).then((r) => r.data);

/** [USER] Danh sách đơn hàng của user */
export const fetchOrders = (params = {}) =>
  api.get("/orders", { params }).then((r) => r.data);

/** [USER] Chi tiết 1 đơn hàng */
export const fetchOrderDetail = (id) =>
  api.get(`/orders/${id}`).then((r) => r.data);

// ========== USER PROFILE ==========
/** [USER] Lấy thông tin cá nhân */
export const getMe = () => api.get("/me").then((r) => r.data);

/** [USER] Cập nhật thông tin cá nhân */
export const updateMe = (payload) =>
  api.patch("/me", payload).then((r) => r.data);

export default api;
