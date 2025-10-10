import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api, { setAuthToken } from "../api";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const doLogout = () => {
    setAuthToken(null);
    logout();
    nav("/");
  };

  return (
    <div style={{padding:20,maxWidth:900,margin:"40px auto"}}>
      <div className="card">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <h2>Admin Dashboard</h2>
            <div className="small">Xin chào, {user?.name}</div>
          </div>
          <div>
            <button className="btn secondary" onClick={doLogout}>Logout</button>
          </div>
        </div>

        <div style={{marginTop:18}}>
          <p>Chỗ này bạn có thể thêm: quản lý thuốc (CRUD), đơn hàng, báo cáo theo repo KMA_CTKH11.</p>
          <p className="small">Ví dụ API: GET /api/medicines, POST /api/medicines (admin only).</p>
        </div>
      </div>
    </div>
  );
}
