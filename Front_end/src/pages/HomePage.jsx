import { Link } from "react-router-dom";
import "./HomePage.css"; // Sẽ tạo file CSS này

export default function HomePage() {
  return (
    <div className="homepage-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Hệ thống nhà thuốc trực tuyến</h1>
          <p>
            Chăm sóc sức khỏe của bạn với các sản phẩm chất lượng, dịch vụ
            chuyên nghiệp và đáng tin cậy.
          </p>
          <Link to="/shop">
            <button className="hero-cta-btn">Mua sắm ngay</button>
          </Link>
        </div>
      </section>

      <section className="features-section">
        <h2>Tại sao chọn chúng tôi?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>💊 Sản phẩm đa dạng</h3>
            <p>
              Cung cấp hàng ngàn sản phẩm thuốc, thực phẩm chức năng và thiết bị
              y tế.
            </p>
          </div>
          <div className="feature-card">
            <h3>🚚 Giao hàng nhanh</h3>
            <p>
              Hệ thống giao hàng tận nơi nhanh chóng, đảm bảo chất lượng sản
              phẩm.
            </p>
          </div>
          <div className="feature-card">
            <h3>💬 Tư vấn chuyên nghiệp</h3>
            <p>
              Đội ngũ dược sĩ giàu kinh nghiệm sẵn sàng hỗ trợ và tư vấn 24/7.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}