// import { Link, Outlet, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { setAuthToken } from "../api";

// export default function AdminLayout() {
//   const { user, logout } = useAuth();
//   const nav = useNavigate();

//   const handleLogout = () => {
//     setAuthToken(null);
//     logout();
//     nav("/");
//   };

//   return (
//     <div className="admin-layout">
//       <aside className="sidebar">
//         <div className="sidebar-header">Pharmacy Admin</div>
//         <nav>
//           <Link to="/admin/dashboard">Tổng quan</Link>
//           <Link to="/admin/medicines">Quản lý thuốc</Link>
//           <Link to="/admin/chat">Hỗ trợ khách hàng</Link>
//           {/* Thêm các link khác ở đây sau */}
//         </nav>
//         <div className="sidebar-footer">
//           <div>{user?.email}</div>
//           <button onClick={handleLogout} className="logout-btn">Đăng xuất</button>
//         </div>
//       </aside>
//       <main className="main-content">
//         <Outlet /> {/* Đây là nơi nội dung của từng trang sẽ được hiển thị */}
//       </main>
//     </div>
//   );
// }