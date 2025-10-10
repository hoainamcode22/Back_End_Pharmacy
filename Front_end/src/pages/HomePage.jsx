import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { user } = useAuth();
  const nav = useNavigate();

  return (
    <div className="container">
      <div className="left">
        <div className="card">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div className="logo">Pharmacy Management</div>
              <h1>Hệ thống quản lý nhà thuốc</h1>
              <p className="lead">Dựa trên tài liệu & phân tích từ KMA_CTKH11 — hệ thống hỗ trợ quản lý thuốc, tồn kho, bán hàng, nhập thuốc và quản lý nhân viên.</p>
            </div>
            <div style={{textAlign:"right"}}>
              <div className="small">Logged:</div>
              <div>{user ? `${user.name} • ${user.role}` : "Chưa đăng nhập"}</div>
            </div>
          </div>

          <p style={{marginTop:14}}>Hệ thống hỗ trợ (tóm tắt từ repo):</p>
          <ul className="features">
            <li>Đăng ký/đăng nhập Khách hàng để mua hàng trực tuyến.</li>
            <li>Đăng nhập Admin/Pharmacist để quản lý sản phẩm, tồn kho, và đơn hàng.</li>
            <li>Tìm kiếm thuốc, cảnh báo hết hạn, báo cáo doanh thu.</li>
            <li>Quy trình nhập hàng → kiểm tra tồn kho → lập phiếu nhập.</li>
          </ul>

          <div style={{marginTop:18}}>
            <Link to="/register"><button className="btn">Đăng ký Khách</button></Link>
            <Link to="/login" style={{marginLeft:12}}><button className="btn secondary">Đăng nhập Khách</button></Link>
          </div>

          <div className="adminNotice" style={{marginTop:18}}>
            <div className="center">
              <div className="small">🔒 Admin & Nhân viên</div>
              <div style={{marginLeft:12}}><Link to="/admin-login" className="link">Cổng Admin</Link></div>
            </div>
            <div className="footer">Admin sẽ dùng tài khoản được tạo bởi hệ thống (hoặc superadmin) — không khuyến nghị đăng ký public.</div>
          </div>
        </div>
      </div>

      <div className="right">
        <div className="card">
          <h3>Quick actions</h3>
          <div className="form">
            <button className="btn" onClick={() => nav("/shop")}>Xem danh sách thuốc (chưa có)</button>
            <button className="btn secondary" onClick={() => nav("/cart")}>Mở giỏ hàng (chưa có)</button>
          </div>
        </div>
      </div>
    </div>
  );
}
