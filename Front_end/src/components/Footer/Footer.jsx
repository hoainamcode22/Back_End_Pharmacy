export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container" style={{ padding: '18px 0', color: 'var(--muted)', fontSize: 13 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12 }}>
          <div>
            <div style={{ fontWeight: 800, color: 'var(--text)' }}>Về chúng tôi</div>
            <div>Giới thiệu</div>
            <div>Hệ thống cửa hàng</div>
            <div>Chính sách bảo mật</div>
          </div>
          <div>
            <div style={{ fontWeight: 800, color: 'var(--text)' }}>Danh mục</div>
            <div>Thuốc</div>
            <div>Thực phẩm bảo vệ sức khỏe</div>
            <div>Chăm sóc cá nhân</div>
          </div>
          <div>
            <div style={{ fontWeight: 800, color: 'var(--text)' }}>Hỗ trợ</div>
            <div>1800 6821</div>
            <div>support@pharmacy.local</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
