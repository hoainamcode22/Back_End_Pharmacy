import { useEffect, useState } from "react";
import { getCart, updateCartItem, removeCartItem } from "../api";
import { Link, useNavigate } from "react-router-dom";
import UserLayout from "../components/UserLayout";

export default function Cart() {
  const [cart, setCart] = useState({ items: [] });
  const navigate = useNavigate();

  const load = () => getCart().then(setCart).catch(()=>{});
  useEffect(() => { load(); }, []);

  const changeQty = async (item, delta) => {
    const next = Math.max(1, (item.qty || 1) + delta);
    await updateCartItem(item.id, next);
    load();
  };
  const remove = async (item) => { await removeCartItem(item.id); load(); };

  const total = (cart.items || []).reduce((s, it) => s + (it.qty || 0) * (it.product?.price || 0), 0);

  return (
    <UserLayout>
      <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Giỏ hàng</h1>
      {(cart.items || []).length === 0 ? (
        <div>Chưa có sản phẩm. <Link to="/shop" style={{ textDecoration: "underline" }}>Tiếp tục mua</Link></div>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {cart.items.map((it) => (
              <div key={it.id} style={{ display: "flex", gap: 12, alignItems: "center", border: "1px solid #eee", borderRadius: 16, padding: 12, background: "#fff" }}>
                <div style={{ width: 64, height: 64, background: "#f0f2f5", borderRadius: 12, overflow: "hidden" }}>
                  {it.product?.image && <img src={it.product.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{it.product?.name}</div>
                  <div style={{ fontSize: 13, color: "#666" }}>{(it.product?.price || 0).toLocaleString()} đ</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button onClick={() => changeQty(it, -1)} style={{ border: "1px solid #ddd", borderRadius: 8, padding: "2px 8px" }}>-</button>
                  <div>{it.qty}</div>
                  <button onClick={() => changeQty(it, +1)} style={{ border: "1px solid #ddd", borderRadius: 8, padding: "2px 8px" }}>+</button>
                </div>
                <button onClick={() => remove(it)} style={{ fontSize: 13, textDecoration: "underline" }}>Xóa</button>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Tổng: {total.toLocaleString()} đ</div>
            <button onClick={() => navigate("/checkout")} style={{ border: "1px solid #ddd", borderRadius: 10, padding: "10px 16px" }}>
              Thanh toán
            </button>
          </div>
        </>
      )}
    </UserLayout>
  );
}
