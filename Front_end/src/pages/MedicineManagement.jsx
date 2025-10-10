import { useState, useEffect } from "react";
import api from "../api";
import './MedicineManagement.css'; // Sẽ tạo file CSS này

export default function MedicineManagement() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/medicines");
        setMedicines(res.data);
        setError(null);
      } catch (err) {
        setError("Không thể tải danh sách thuốc.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  return (
    <div className="medicine-container">
      <h2>Quản lý Thuốc</h2>

      {loading && <p>Đang tải...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <table className="medicine-table">
          <thead>
            <tr>
              <th>Mã Thuốc</th>
              <th>Tên Thuốc</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Ngày hết hạn</th>
            </tr>
          </thead>
          <tbody>
            {medicines.length > 0 ? (
              medicines.map((med) => (
                <tr key={med.Id}>
                  <td>{med.medicine_code}</td>
                  <td>{med.medicine_name}</td>
                  <td>{med.medicine_price}</td>
                  <td>{med.quantity}</td>
                  <td>{new Date(med.medicine_expire_date).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">Không có dữ liệu thuốc.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}