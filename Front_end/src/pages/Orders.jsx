import { useEffect, useMemo, useState } from "react";
import { fetchOrders } from "../api";
import UserLayout from "../components/UserLayout";
import OrderStatusBadge from "../components/OrderStatusBadge";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders().then((d) => setOrders(d.items || d || [])).catch(()=>{});
  }, []);

  const fmtDate = (d) => {
    try { const dd = new Date(d); return dd.toLocaleDateString(); } catch { return ""; }
  };

  const todayPlus2 = useMemo(() => {
    const d = new Date(); d.setDate(d.getDate() + 2); return d.toLocaleDateString();
  }, []);

  return (
    <UserLayout>
      <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Đơn hàng của bạn</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {orders.map((o) => (
          <div key={o.id} style={{ border: "1px solid #eee", borderRadius: 16, padding: 12, background: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 600 }}>Mã đơn: {o.code || o.id}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#666" }}>
                  Trạng thái: <OrderStatusBadge status={o.status} />
                  {o.status === "shipping" && (
                    <span>– dự kiến nhận {fmtDate(o.eta) || todayPlus2}</span>
                  )}
                </div>
              </div>
              <div style={{ fontWeight: 700 }}>{(o.total || 0).toLocaleString()} đ</div>
            </div>
            <div style={{ fontSize: 13, color: "#666", marginTop: 6 }}>
              {(o.items || []).slice(0,3).map(i => i.product?.name).join(", ")}
              {(o.items || []).length > 3 ? "..." : ""}
            </div>
          </div>
        ))}
        {orders.length === 0 && <div>Chưa có đơn hàng.</div>}
      </div>
    </UserLayout>
  );
}
