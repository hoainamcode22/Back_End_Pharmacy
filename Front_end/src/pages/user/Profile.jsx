import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./Profile.css";

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("info");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "0123 456 789",
    address: "123 Nguyễn Huệ, Q1, TP.HCM",
    birthday: "01/01/1990"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    alert("Đã cập nhật thông tin thành công!");
    // TODO: Gọi API cập nhật thông tin
  };

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <button className="change-avatar-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </button>
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{user?.name}</h1>
          <p className="profile-email">{user?.email}</p>
          <span className="profile-role-badge">
            {user?.role === "admin" ? "👑 Quản trị viên" : "👤 Khách hàng"}
          </span>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === "info" ? "active" : ""}`}
          onClick={() => setActiveTab("info")}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="2"/>
            <circle cx="12" cy="7" r="4" strokeWidth="2"/>
          </svg>
          Thông tin cá nhân
        </button>
        <button 
          className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" strokeWidth="2"/>
            <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2"/>
            <path d="M16 10a4 4 0 0 1-8 0" strokeWidth="2"/>
          </svg>
          Đơn hàng của tôi
        </button>
        <button 
          className={`tab-btn ${activeTab === "security" ? "active" : ""}`}
          onClick={() => setActiveTab("security")}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeWidth="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="2"/>
          </svg>
          Bảo mật
        </button>
      </div>

      {/* Tab Content */}
      <div className="profile-content">
        {activeTab === "info" && (
          <div className="info-section">
            <div className="section-header">
              <h2>Thông tin cá nhân</h2>
              {!isEditing ? (
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeWidth="2"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeWidth="2"/>
                  </svg>
                  Chỉnh sửa
                </button>
              ) : (
                <div className="edit-actions">
                  <button className="cancel-btn" onClick={() => setIsEditing(false)}>Hủy</button>
                  <button className="save-btn" onClick={handleSave}>Lưu</button>
                </div>
              )}
            </div>

            <div className="info-grid">
              <div className="info-field">
                <label>Họ và tên</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name} 
                    onChange={handleInputChange}
                    className="input-field"
                  />
                ) : (
                  <p>{formData.name}</p>
                )}
              </div>

              <div className="info-field">
                <label>Email</label>
                {isEditing ? (
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email} 
                    onChange={handleInputChange}
                    className="input-field"
                  />
                ) : (
                  <p>{formData.email}</p>
                )}
              </div>

              <div className="info-field">
                <label>Số điện thoại</label>
                {isEditing ? (
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone} 
                    onChange={handleInputChange}
                    className="input-field"
                  />
                ) : (
                  <p>{formData.phone}</p>
                )}
              </div>

              <div className="info-field">
                <label>Ngày sinh</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="birthday"
                    value={formData.birthday} 
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="DD/MM/YYYY"
                  />
                ) : (
                  <p>{formData.birthday}</p>
                )}
              </div>

              <div className="info-field full-width">
                <label>Địa chỉ</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="address"
                    value={formData.address} 
                    onChange={handleInputChange}
                    className="input-field"
                  />
                ) : (
                  <p>{formData.address}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="orders-section">
            <h2>Đơn hàng của tôi</h2>
            <div className="empty-state">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#dfe6e9">
                <circle cx="9" cy="21" r="1" strokeWidth="2"/>
                <circle cx="20" cy="21" r="1" strokeWidth="2"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" strokeWidth="2"/>
              </svg>
              <p>Bạn chưa có đơn hàng nào</p>
              <button className="btn-shop-now" onClick={() => window.location.href="/shop"}>
                Mua sắm ngay
              </button>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="security-section">
            <h2>Bảo mật tài khoản</h2>
            <div className="security-options">
              <div className="security-item">
                <div className="security-info">
                  <h3>Đổi mật khẩu</h3>
                  <p>Cập nhật mật khẩu định kỳ để bảo mật tài khoản</p>
                </div>
                <button className="action-btn">Thay đổi</button>
              </div>
              <div className="security-item">
                <div className="security-info">
                  <h3>Xác thực 2 bước</h3>
                  <p>Tăng cường bảo mật với mã OTP qua SMS</p>
                </div>
                <button className="action-btn">Bật</button>
              </div>
              <div className="security-item">
                <div className="security-info">
                  <h3>Thiết bị đã đăng nhập</h3>
                  <p>Quản lý các thiết bị đang đăng nhập tài khoản</p>
                </div>
                <button className="action-btn">Xem</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
