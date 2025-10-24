import { useEffect, useState } from "react";
import { checkout, getMe } from "../api";
import UserLayout from "../components/UserLayout";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [payment, setPayment] = useState("COD");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { getMe().then((me)=> setAddress(me?.address || "")).catch(()=>{}); }, []);

  const submit = async () => {
    setLoading(true);
    try {
      const res = await checkout({ address, note, paymentMethod: payment });
      navigate(`/orders?placed=${res.orderId || ""}`);
    } catch {
      // UI-only fallback: điều hướng giả lập nếu BE chưa có
      navigate(`/orders`);
    } finally { setLoading(false); }
  };

  return (
    <UserLayout>
      <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Thanh toán</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 560 }}>
        <label>
          <div style={{ fontSize: 13, marginBottom: 6 }}>Địa chỉ nhận hàng</div>
          <textarea rows={3} value={address} onChange={(e)=>setAddress(e.target.value)}
                    style={{ width: "100%", border: "1px solid #ddd", borderRadius: 10, padding: 10 }}/>
        </label>
        <label>
          <div style={{ fontSize: 13, marginBottom: 6 }}>Ghi chú</div>
          <input value={note} onChange={(e)=>setNote(e.target.value)}
                 style={{ width: "100%", border: "1px solid #ddd", borderRadius: 10, padding: 10 }}/>
        </label>
        <div>
          <div style={{ fontSize: 13, marginBottom: 6 }}>Phương thức thanh toán</div>
          <div style={{ display: "flex", gap: 12 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input type="radio" name="pm" checked={payment === "COD"} onChange={()=>setPayment("COD")} />
              Thanh toán khi nhận hàng (COD)
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input type="radio" name="pm" checked={payment === "MOMO"} onChange={()=>setPayment("MOMO")} />
              Momo
            </label>
          </div>
          {payment === "MOMO" && (
            <div className="small" style={{ marginTop: 6 }}>
              Giao diện demo: khi gắn API Momo sẽ hiển thị QR/redirect.
            </div>
          )}
        </div>
        <button onClick={submit} disabled={loading}
                style={{ border: "1px solid #ddd", borderRadius: 10, padding: "10px 16px" }}>
          {loading ? "Đang tạo đơn..." : "Xác nhận đặt hàng"}
        </button>
      </div>
    </UserLayout>
  );
}
