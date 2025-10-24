import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCart } from "../api";
import { useAuth } from "../context/AuthContext";
import AddressChip from "./address/AddressChip";

export default function Header() {
  const { logout, user } = useAuth() ?? {};
  const [cartCount, setCartCount] = useState(0);
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let ignore = false;
    getCart()
      .then((d) => {
        if (!ignore)
          setCartCount((d?.items || []).reduce((s, i) => s + (i.qty || 0), 0));
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <header className="site-header">
      <div className="container bar">
        <Link to="/shop" className="brand">Pharmacy</Link>

        {/* Địa chỉ nhận hàng */}
        <AddressChip />

        <button className="menu-btn btn ghost" onClick={() => setOpen(o=>!o)} title="Menu" aria-label="Menu" style={{ display: 'none' }}>☰</button>
        <nav className={`nav ${open ? 'open' : ''}`} onClick={() => setOpen(false)}>
          <NavLink to="/shop" className={({ isActive }) => (isActive ? "active" : "")}>Sản phẩm</NavLink>
          <NavLink to="/orders" className={({ isActive }) => (isActive ? "active" : "")}>Đơn hàng</NavLink>
          <NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : "")}>Hồ sơ</NavLink>
          <NavLink to="/prescriptions" className={({ isActive }) => (isActive ? "active" : "")}>Đơn thuốc</NavLink>
          <NavLink to="/support" className={({ isActive }) => (isActive ? "active" : "")}>Hỗ trợ</NavLink>
        </nav>

        <div className="right">
          <button className="btn ghost badge" onClick={() => nav("/cart")}>
            Giỏ hàng
            {cartCount > 0 && <span className="count">{cartCount}</span>}
          </button>
          <span style={{ fontSize: 13, color: "var(--muted)" }}>{user?.name}</span>
          <button className="btn ghost" onClick={logout}>Đăng xuất</button>
        </div>
      </div>
    </header>
  );
}
