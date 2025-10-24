import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import MedicineManagement from "./pages/MedicineManagement.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import AdminChat from "./pages/AdminChat.jsx";

// ====== USER PAGES (mới thêm) ======
import Shop from "./pages/Shop.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Orders from "./pages/Orders.jsx";
import Profile from "./pages/Profile.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx"; // bảo vệ route user đã đăng nhập
import PrescriptionUpload from "./pages/PrescriptionUpload.jsx";
import PrescriptionsList from "./pages/PrescriptionsList.jsx";
import PrescriptionDetail from "./pages/PrescriptionDetail.jsx";
import SupportChat from "./pages/SupportChat.jsx";

/**
 * Bảo vệ các route dành riêng cho Admin.
 * Nếu chưa đăng nhập hoặc không phải admin → đưa về /login (dùng chung).
 */
function AdminRoute() {
  const { user } = useAuth();
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }
  return <AdminLayout />;
}

export default function App() {
  return (
    <Routes>
      {/* --- Public --- */}
      {/* "/" chuyển sang shop để ai chưa login sẽ bị redirect về /login */}
      <Route path="/" element={<Navigate to="/shop" replace />} />
      {/* Giữ HomePage tại /home để không bị mất trang giới thiệu */}
      <Route path="/home" element={<HomePage />} />

      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* --- User (Protected) --- */}
      <Route
        path="/shop"
        element={
          <ProtectedRoute>
            <Shop />
          </ProtectedRoute>
        }
      />
      <Route
        path="/product/:id"
        element={
          <ProtectedRoute>
            <ProductDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/prescriptions"
        element={
          <ProtectedRoute>
            <PrescriptionsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/prescriptions/upload"
        element={
          <ProtectedRoute>
            <PrescriptionUpload />
          </ProtectedRoute>
        }
      />
      <Route
        path="/prescriptions/:id"
        element={
          <ProtectedRoute>
            <PrescriptionDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/prescription"
        element={
          <ProtectedRoute>
            <PrescriptionUpload />
          </ProtectedRoute>
        }
      />
      <Route
        path="/support"
        element={
          <ProtectedRoute>
            <SupportChat />
          </ProtectedRoute>
        }
      />

      {/* --- Admin (Protected) --- */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="medicines" element={<MedicineManagement />} />
        <Route path="chat" element={<AdminChat />} />
      </Route>

      {/* --- Fallback --- */}
      <Route path="*" element={<Navigate to="/shop" replace />} />
    </Routes>
  );
}
