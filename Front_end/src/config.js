// Sử dụng environment variable với fallback
export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5001";

