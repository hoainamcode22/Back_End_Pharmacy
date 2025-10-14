import { useState, useEffect } from "react";
import api from "../api";
import "./ShopPage.css";

export default function ShopPage() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/medicines");
        setMedicines(res.data);
      } catch (err) {
        setError("Không thể tải danh sách thuốc. Vui lòng thử lại sau.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
  }, []);

  if (loading) return <p>Đang tải danh sách thuốc...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="shop-page">
      <h1>Danh sách thuốc</h1>
      <div className="medicine-grid">
        {medicines.length > 0 ? (
          medicines.map((med) => (
            <div key={med.Id} className="medicine-card">
              <div className="medicine-image-placeholder"></div>
              <h3>{med.medicine_name}</h3>
              <p className="medicine-price">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(med.medicine_price)}
              </p>
              <p>Số lượng: {med.quantity}</p>
              <button className="add-to-cart-btn">Thêm vào giỏ</button>
            </div>
          ))
        ) : (
          <p>Hiện tại không có sản phẩm nào.</p>
        )}
      </div>
    </div>
  );
}