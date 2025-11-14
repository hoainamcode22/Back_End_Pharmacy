import { Link } from 'react-router-dom'; // Dùng Link để chuyển trang
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-grid">
          
          {/* Cột 1: Về chúng tôi */}
          <div className="footer-column">
            <div className="footer-title">Về chúng tôi</div>
            <Link to="/about" className="footer-link">Giới thiệu</Link>
            <Link to="/stores" className="footer-link">Hệ thống cửa hàng</Link>
            <Link to="/policy" className="footer-link">Chính sách bảo mật</Link>
          </div>

          {/* Cột 2: Danh mục */}
          <div className="footer-column">
            <div className="footer-title">Danh mục</div>
            <Link to="/shop?category=thuoc" className="footer-link">Thuốc</Link>
            <Link to="/shop?category=tpcn" className="footer-link">Thực phẩm bảo vệ sức khỏe</Link>
            <Link to="/shop?category=personal-care" className="footer-link">Chăm sóc cá nhân</Link>
          </div>

          {/* Cột 3: Hỗ trợ */}
          <div className="footer-column">
            <div className="footer-title">Hỗ trợ</div>
            {/* Dùng <a> cho số điện thoại và email */}
            <a href="tel:18006821" className="footer-link">1800 6821</a>
            <a href="mailto:nam695472@gmail.com" className="footer-link">nam695472@gmail.com</a>
          </div>

        </div>
      </div>
    </footer>
  );
}