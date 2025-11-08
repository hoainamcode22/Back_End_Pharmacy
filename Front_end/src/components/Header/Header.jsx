import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Header.css";
import { useAuth } from "../../context/AuthContext/AuthContext.jsx";
import { setAuthToken, getCart } from "../../api";

export default function Header() {
  const { logout, user } = useAuth() ?? {};
  const nav = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  // Fetch cart count on mount and when 'cart:updated' event fires
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const data = await getCart();
        const totalQty = Array.isArray(data.cartItems)
          ? data.cartItems.reduce((s, it) => s + (Number(it.Qty) || 0), 0)
          : 0;
        setCartCount(totalQty);
      } catch {
        setCartCount(0);
      }
    };
    fetchCount();

    const handler = () => fetchCount();
    window.addEventListener('cart:updated', handler);
    return () => window.removeEventListener('cart:updated', handler);
  }, []);


  const handleLogout = () => {
    setAuthToken(null);
    logout();
    nav("/login");
  };

  return (
    <header className="site-header">
      {/* Container đã đổi tên class để khớp CSS mới */}
      <div className="header-container bar">
        <Link to="/shop" className="brand">Pharmacy</Link>

        <nav className="nav">
          <NavLink to="/shop" className={({ isActive }) => (isActive ? "active" : "")}>Sản phẩm</NavLink>
          <NavLink to="/orders" className={({ isActive }) => (isActive ? "active" : "")}>Đơn hàng</NavLink>
          <NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : "")}>Hồ sơ</NavLink>
          <NavLink to="/diseases" className={({ isActive }) => (isActive ? "active" : "")}>Tra cứu bệnh</NavLink>
        </nav>

        <div className="right">
          <button id="cart-icon-button" className="btn ghost" onClick={() => nav("/cart")}>
            Giỏ hàng{cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          
          {/* Hiển thị tên user nếu đã đăng nhập */}
          {user ? (
            <>
              <span className="user-name">{user?.name || user?.email}</span>
              <button className="btn ghost" onClick={handleLogout}>Đăng xuất</button>
            </>
          ) : (
            <button className="btn ghost" onClick={() => nav("/login")}>
              Đăng nhập
            </button>
          )}
        </div>
      </div>
    </header>
  );
}