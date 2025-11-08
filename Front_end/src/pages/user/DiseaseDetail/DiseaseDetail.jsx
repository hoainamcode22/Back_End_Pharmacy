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

  // Helper function để chuyển text có \n thành danh sách bullet
  const renderContent = (text) => {
    if (!text) return <p className="no-data">Chưa có thông tin</p>;
    
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      return <p className="no-data">Chưa có thông tin</p>;
    }
    
    if (lines.length === 1) {
      return <p>{lines[0]}</p>;
    }
    
    return (
      <ul className="disease-list">
        {lines.map((line, index) => (
          <li key={index}>{line.trim()}</li>
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
      {/* Header */}
      <div className="disease-header">
        <button className="btn-back-small" onClick={() => navigate("/diseases")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Quay lại
        </button>
        <h1 className="disease-title">{disease.Name}</h1>
        {disease.Category && (
          <span className="disease-category-badge">{disease.Category}</span>
        )}
      </div>

      {/* Content */}
      <div className="disease-content">
        {/* Tổng quan */}
        {disease.Overview && (
          <section className="disease-section overview-section">
            <div className="section-icon">📋</div>
            <div className="section-content">
              <h2 className="section-title">Tổng quan</h2>
              <div className="disease-overview">
                {renderContent(disease.Overview)}
              </div>
            </div>
          </section>
        )}

        {/* Triệu chứng */}
        {disease.Symptoms && (
          <section className="disease-section symptoms-section">
            <div className="section-icon">🩺</div>
            <div className="section-content">
              <h2 className="section-title">Triệu chứng</h2>
              <div className="disease-symptoms">
                {renderContent(disease.Symptoms)}
              </div>
            </div>
          </section>
        )}

        {/* Nguyên nhân */}
        {disease.Causes && (
          <section className="disease-section causes-section">
            <div className="section-icon">🔬</div>
            <div className="section-content">
              <h2 className="section-title">Nguyên nhân</h2>
              <div className="disease-causes">
                {renderContent(disease.Causes)}
              </div>
            </div>
          </section>
        )}

        {/* Điều trị */}
        {disease.Treatment && (
          <section className="disease-section treatment-section">
            <div className="section-icon">💊</div>
            <div className="section-content">
              <h2 className="section-title">Điều trị</h2>
              <div className="disease-treatment">
                {renderContent(disease.Treatment)}
              </div>
            </div>
          </section>
        )}

        {/* Phòng ngừa */}
        {disease.Prevention && (
          <section className="disease-section prevention-section">
            <div className="section-icon">🛡️</div>
            <div className="section-content">
              <h2 className="section-title">Phòng ngừa</h2>
              <div className="disease-prevention">
                {renderContent(disease.Prevention)}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Footer note */}
      <div className="disease-footer-note">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffa500">
          <circle cx="12" cy="12" r="10" strokeWidth="2"/>
          <line x1="12" y1="16" x2="12" y2="12" strokeWidth="2"/>
          <line x1="12" y1="8" x2="12.01" y2="8" strokeWidth="2"/>
        </svg>
        <p>
          <strong>Lưu ý:</strong> Thông tin chỉ mang tính chất tham khảo. 
          Vui lòng tham khảo ý kiến bác sĩ để được chẩn đoán và điều trị chính xác.
        </p>
      </div>
    </div>
  );
}
