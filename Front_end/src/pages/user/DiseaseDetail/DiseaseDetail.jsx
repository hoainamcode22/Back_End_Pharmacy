import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDiseaseBySlug } from "../../../api";
import "./DiseaseDetail.css";

export default function DiseaseDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [disease, setDisease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const loadDisease = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getDiseaseBySlug(slug);
        
        if (response.success && response.disease) {
          setDisease(response.disease);
        } else {
          setError("Không tìm thấy thông tin bệnh");
        }
      } catch (err) {
        console.error("Error loading disease:", err);
        setError(err.response?.data?.error || "Không thể tải thông tin bệnh");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadDisease();
    }
  }, [slug]);

  // Helper function để chuyển text có \n thành danh sách bullet, loại bỏ kí tự thừa
  const renderContent = (text) => {
    if (!text) return <p className="no-data">Chưa có thông tin</p>;
    
    // Loại bỏ kí tự thừa, khoảng trắng dư thừa
    const lines = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    if (lines.length === 0) {
      return <p className="no-data">Chưa có thông tin</p>;
    }
    
    if (lines.length === 1) {
      return <p className="disease-text">{lines[0]}</p>;
    }
    
    return (
      <ul className="disease-list">
        {lines.map((line, index) => (
          <li key={index}>{line}</li>
        ))}
      </ul>
    );
  };

  if (loading) {
    return (
      <div className="disease-detail-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải thông tin bệnh...</p>
        </div>
      </div>
    );
  }

  if (error || !disease) {
    return (
      <div className="disease-detail-container">
        <div className="error-state">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b">
            <circle cx="12" cy="12" r="10" strokeWidth="2"/>
            <line x1="15" y1="9" x2="9" y2="15" strokeWidth="2"/>
            <line x1="9" y1="9" x2="15" y2="15" strokeWidth="2"/>
          </svg>
          <h2>{error || "Không tìm thấy thông tin"}</h2>
          <button className="btn-back" onClick={() => navigate("/diseases")}>
            ← Quay lại trang tra cứu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="disease-detail-container">
      {/* Back button */}
      <button className="btn-back-nav" onClick={() => navigate("/diseases")}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Quay lại
      </button>

      {/* Article Header */}
      <article className="disease-article">
        {/* Featured Image & Header Section */}
        <div className="article-header">
          <div className="header-content">
            <div className="breadcrumb">
              <span>Thông tin Y tế</span>
              <span className="separator">/</span>
              <span>{disease.Category || 'Bệnh'}</span>
            </div>
            <h1 className="article-title">{disease.Name}</h1>
            {disease.Category && (
              <span className="article-category">{disease.Category}</span>
            )}
            <p className="article-meta">Cập nhật thông tin y tế chuyên nghiệp</p>
          </div>
          <div className="header-image-wrapper">
            <div className={`header-image ${imageLoaded ? 'loaded' : ''}`}>
              {disease.ImageUrl ? (
                <img 
                  src={disease.ImageUrl} 
                  alt={disease.Name}
                  className="disease-featured-image"
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(disease.Name);
                    setImageLoaded(true);
                  }}
                />
              ) : (
                <svg className="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="disease-content">
        {/* Tổng quan */}
        {disease.Overview && (
          <section className="disease-section overview-section">
            <div className="section-header">
              <div className="section-icon">📋</div>
              <h2 className="section-title">Tổng quan</h2>
            </div>
            <div className="disease-overview">
              {renderContent(disease.Overview)}
            </div>
          </section>
        )}

        {/* Triệu chứng */}
        {disease.Symptoms && (
          <section className="disease-section symptoms-section">
            <div className="section-header">
              <div className="section-icon">🩺</div>
              <h2 className="section-title">Triệu chứng</h2>
            </div>
            <div className="disease-symptoms">
              {renderContent(disease.Symptoms)}
            </div>
          </section>
        )}

        {/* Nguyên nhân */}
        {disease.Causes && (
          <section className="disease-section causes-section">
            <div className="section-header">
              <div className="section-icon">🔬</div>
              <h2 className="section-title">Nguyên nhân</h2>
            </div>
            <div className="disease-causes">
              {renderContent(disease.Causes)}
            </div>
          </section>
        )}

        {/* Điều trị */}
        {disease.Treatment && (
          <section className="disease-section treatment-section">
            <div className="section-header">
              <div className="section-icon">💊</div>
              <h2 className="section-title">Điều trị</h2>
            </div>
            <div className="disease-treatment">
              {renderContent(disease.Treatment)}
            </div>
          </section>
        )}

        {/* Phòng ngừa */}
        {disease.Prevention && (
          <section className="disease-section prevention-section">
            <div className="section-header">
              <div className="section-icon">🛡️</div>
              <h2 className="section-title">Phòng ngừa</h2>
            </div>
            <div className="disease-prevention">
              {renderContent(disease.Prevention)}
            </div>
          </section>
        )}

        {/* Disclaimer */}
        <div className="disclaimer-box">
          <div className="disclaimer-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" strokeWidth="1.5" fill="currentColor"/>
              <line x1="12" y1="16" x2="12" y2="12" strokeWidth="2"/>
              <line x1="12" y1="8" x2="12.01" y2="8" strokeWidth="2"/>
            </svg>
          </div>
          <div className="disclaimer-content">
            <h3>Lưu ý quan trọng</h3>
            <p>Thông tin cung cấp chỉ mang tính chất tham khảo. Vui lòng tham khảo ý kiến bác sĩ chuyên khoa để được chẩn đoán và điều trị chính xác.</p>
          </div>
        </div>
      </div>
    </article>
    </div>
  );
}
