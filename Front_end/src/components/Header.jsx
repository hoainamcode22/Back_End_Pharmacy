import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Header.css";

// import { getCart } from "../api";
import { useAuth } from "../context/AuthContext";
import { setAuthToken } from "../api";
// import AddressChip from "./address/AddressChip";

export default function Header() {
  const { logout, user } = useAuth() ?? {};
  const [cartCount] = useState(0); // TODO: Sẽ cập nhật từ API
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  // TODO: Bật lại khi có API cart
  // useEffect(() => {
  //   let ignore = false;
  //   getCart()
  //     .then((d) => {
  //       if (!ignore)
  //         setCartCount((d?.items || []).reduce((s, i) => s + (i.qty || 0), 0));
  //     })
  //     .catch(() => {});
  //   return () => {
  //     ignore = true;
  //   };
  // }, []);

  const handleLogout = () => {
    setAuthToken(null);  // Xóa token khỏi axios headers
    logout();            // Xóa khỏi context + localStorage
    nav("/login");       // Chuyển về trang login
  };

  return (
    <header className="site-header">
      <div className="container bar">
        <Link to="/shop" className="brand">Pharmacy</Link>

        {/* Địa chỉ nhận hàng - TODO: Bật khi có component */}
        {/* <AddressChip /> */}

        <button className="menu-btn btn ghost" onClick={() => setOpen(o=>!o)} title="Menu" aria-label="Menu" style={{ display: 'none' }}>☰</button>
        <nav className={`nav ${open ? 'open' : ''}`} onClick={() => setOpen(false)}>
          <NavLink to="/shop" className={({ isActive }) => (isActive ? "active" : "")}>Sản phẩm</NavLink>
          <NavLink to="/orders" className={({ isActive }) => (isActive ? "active" : "")}>Đơn hàng</NavLink>
          <NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : "")}>Hồ sơ</NavLink>
          <NavLink to="/diseases" className={({ isActive }) => (isActive ? "active" : "")}>Tra cứu bệnh</NavLink>
        </nav>

        <div className="right">
          <button className="btn ghost badge" onClick={() => nav("/cart")}>
            Giỏ hàng
            {cartCount > 0 && <span className="count">{cartCount}</span>}
          </button>
          <span style={{ fontSize: 13, color: "var(--muted)" }}>{user?.name}</span>
          <button className="btn ghost" onClick={handleLogout}>Đăng xuất</button>
        </div>
      </div>
    </header>
  );
}
