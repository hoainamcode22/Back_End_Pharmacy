import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function CustomerLayout() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav("/");
  };

  return (
    <div className="customer-layout">
      <header className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            Pharmacy
          </Link>
          <nav className="nav-menu">
            <Link to="/shop" className="nav-item">
              Cửa hàng
            </Link>
            <Link to="/cart" className="nav-item">
              Giỏ hàng ({cart.length})
            </Link>
          </nav>
          <div className="nav-auth">
            {user ? (
              <>
                <span className="nav-user">Chào, {user.name}</span>
                <button onClick={handleLogout} className="btn-logout">
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-item">
                  Đăng nhập
                </Link>
                <Link to="/register" className="nav-item-cta">
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="customer-main-content">
        <Outlet />
      </main>
    </div>
  );
}