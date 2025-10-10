import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import MedicineManagement from "./pages/MedicineManagement.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import { useAuth } from "./context/AuthContext.jsx";

/**
 * Component này dùng để bảo vệ các route dành riêng cho Admin.
 * Nó sẽ kiểm tra xem người dùng đã đăng nhập và có vai trò là 'admin' hay không.
 */
function AdminRoute() {
  const { user } = useAuth();

  // Nếu chưa đăng nhập hoặc vai trò không phải là 'admin', chuyển hướng đến trang đăng nhập admin.
  if (!user || user.role !== "admin") {
    return <Navigate to="/admin-login" replace />;
  }

  // Nếu hợp lệ, hiển thị layout chung cho các trang admin.
  // Các trang con sẽ được render vào vị trí của <Outlet /> trong AdminLayout.
  return <AdminLayout />;
}

export default function App() {
  return (
    <Routes>
      {/* --- Các Route Công Khai --- */}
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* --- Các Route Dành Riêng Cho Admin (Được bảo vệ) --- */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="medicines" element={<MedicineManagement />} />
      </Route>

      {/* --- Route Mặc Định --- */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
