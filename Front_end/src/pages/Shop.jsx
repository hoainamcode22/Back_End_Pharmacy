import { useState, useEffect } from "react";
import api from "../api";
import { useCart } from "../context/CartContext";
import "./Shop.css";

export default function Shop() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart } = useCart();

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

  const filteredMedicines = medicines.filter((med) =>
    med.medicine_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (med) => {
    addToCart(med);
    // Optional: Add a notification/toast here
  };
  
  if (error) return <p className="shop-error">{error}</p>;

  return (
    <div className="shop-container">
      <div className="shop-header">
        <h1>Danh sách sản phẩm</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Tìm kiếm tên thuốc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {loading ? (
        <div className="loading-spinner"></div>
      ) : (
        <>
          {filteredMedicines.length > 0 ? (
            <div className="medicine-grid">
              {filteredMedicines.map((med) => (
                <div key={med.Id} className="medicine-card">
                  <div className="medicine-image-placeholder">
                    {/* Bạn có thể thay thế bằng thẻ <img> nếu có ảnh */}
                    <span>💊</span>
                  </div>
                  <div className="medicine-info">
                    <h3 className="medicine-name">{med.medicine_name}</h3>
                    <p className="medicine-stock">Còn lại: {med.quantity}</p>
                    <p className="medicine-price">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(med.medicine_price)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleAddToCart(med)}
                    className="btn-add-to-cart"
                    disabled={med.quantity === 0}
                  >
                    {med.quantity > 0 ? "Thêm vào giỏ" : "Hết hàng"}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-products-found">
              Không tìm thấy sản phẩm nào phù hợp.
            </p>
          )}
        </>
      )}
    </div>
  );
}