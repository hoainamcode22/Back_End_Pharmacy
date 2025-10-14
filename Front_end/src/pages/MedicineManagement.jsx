import { useState, useEffect } from "react";
import api from "../api";
import './MedicineManagement.css'; 

// Component Form thêm thuốc
function AddMedicineForm({ onMedicineAdded, onCancel }) {
  const [formData, setFormData] = useState({
    medicine_name: '',
    medicine_price: '',
    quantity: '',
    medicine_expire_date: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post("/api/medicines", formData, {
        headers: { Authorization: localStorage.getItem('ph_auth') ? JSON.parse(localStorage.getItem('ph_auth')).token : '' }
      });
      onMedicineAdded(res.data); // Truyền thuốc mới lên component cha
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra.');
    }
  };

  return (
    <div className="add-medicine-form-container">
      <h3>Thêm thuốc mới</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" name="medicine_name" placeholder="Tên thuốc" onChange={handleChange} required />
        <input type="number" name="medicine_price" placeholder="Giá" onChange={handleChange} required />
        <input type="number" name="quantity" placeholder="Số lượng" onChange={handleChange} required />
        <input type="date" name="medicine_expire_date" placeholder="Ngày hết hạn" onChange={handleChange} required />
        {error && <p className="form-error">{error}</p>}
        <div className="form-actions">
          <button type="submit" className="btn-save">Lưu</button>
          <button type="button" onClick={onCancel} className="btn-cancel">Hủy</button>
        </div>
      </form>
    </div>
  );
}


export default function MedicineManagement() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

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

  const handleMedicineAdded = (newMedicine) => {
    setMedicines([newMedicine, ...medicines]);
    setShowAddForm(false);
  };


  return (
    <div className="medicine-container">
      <div className="medicine-header">
        <h2>Quản lý Thuốc</h2>
        <button onClick={() => setShowAddForm(true)} className="btn-add-new">
          + Thêm mới
        </button>
      </div>

      {showAddForm && (
        <AddMedicineForm 
          onMedicineAdded={handleMedicineAdded}
          onCancel={() => setShowAddForm(false)} 
        />
      )}

      {loading && <p>Đang tải...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <table className="medicine-table">
          <thead>
            <tr>
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
                  <td>{med.medicine_name}</td>
                  <td>{new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(med.medicine_price)}</td>
                  <td>{med.quantity}</td>
                  <td>{new Date(med.medicine_expire_date).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">Không có dữ liệu thuốc.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}