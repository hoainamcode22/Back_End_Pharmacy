import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login/Login.jsx";
import Register from "./pages/auth/Login/Register.jsx";
import Shop from "./pages/user/Shop/Shop.jsx";
import ProductDetail from "./pages/user/ProductDetail/ProductDetail.jsx";
import Profile from "./pages/user/Profile/Profile.jsx";
import Cart from "./pages/user/Cart/Cart.jsx";
import Orders from "./pages/user/Orders/Orders.jsx";
import OrderDetail from "./pages/user/OrderDetail/OrderDetail.jsx";
import Checkout from "./pages/user/Checkout/Checkout.jsx";
import Diseases from "./pages/user/Diseases/Diseases.jsx";
import DiseaseDetail from "./pages/user/DiseaseDetail/DiseaseDetail.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import UserLayout from "./components/UserLayout/UserLayout.jsx";

export default function App() {
  return (
    <Routes>
      {/* Auth - Không có layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User Routes - Có Header & Footer */}
      <Route
        path="/shop"
        element={
          <ProtectedRoute>
            <UserLayout>
              <Shop />
            </UserLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/product/:id"
        element={
          <ProtectedRoute>
            <UserLayout>
              <ProductDetail />
            </UserLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <UserLayout>
              <Cart />
            </UserLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <UserLayout>
              <Orders />
            </UserLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/:id"
        element={
          <ProtectedRoute>
            <UserLayout>
              <OrderDetail />
            </UserLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <UserLayout>
              <Checkout />
            </UserLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserLayout>
              <Profile />
            </UserLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/diseases"
        element={
          <ProtectedRoute>
            <UserLayout>
              <Diseases />
            </UserLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/diseases/:slug"
        element={
          <ProtectedRoute>
            <UserLayout>
              <DiseaseDetail />
            </UserLayout>
          </ProtectedRoute>
        }
      />

      {/* Mặc định - User chưa login → /login, User đã login → /shop */}
      <Route path="/" element={<Navigate to="/shop" replace />} />
      <Route path="*" element={<Navigate to="/shop" replace />} />
    </Routes>
  );
}
