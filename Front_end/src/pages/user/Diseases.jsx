import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Diseases.css";

export default function Diseases() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // FULL ENCYCLOPEDIA DATA - Bách khoa toàn thư đầy đủ
  const DISEASE_CATEGORIES = {
    popular: [
      { name: "Tăng huyết áp", slug: "tang-huyet-ap", icon: "❤️", specialty: "Tim mạch" },
      { name: "Tiểu đường type 2", slug: "tieu-duong-type-2", icon: "🩸", specialty: "Nội tiết" },
      { name: "Viêm gan B", slug: "viem-gan-b", icon: "🫀", specialty: "Tiêu hóa" },
      { name: "Viêm dạ dày", slug: "viem-da-day", icon: "🫃", specialty: "Tiêu hóa" },
      { name: "Sốt xuất huyết", slug: "sot-xuat-huyet", icon: "🦟", specialty: "Nhiễm khuẩn" },
      { name: "Covid-19", slug: "covid-19", icon: "😷", specialty: "Hô hấp" },
      { name: "Hen suyễn", slug: "hen-suyen", icon: "🫁", specialty: "Hô hấp" },
      { name: "Viêm xoang", slug: "viem-xoang", icon: "🤧", specialty: "Tai Mũi Họng" },
      { name: "Trào ngược dạ dày", slug: "trao-nguoc-da-day", icon: "🔥", specialty: "Tiêu hóa" },
      { name: "Đau đầu Migraine", slug: "dau-dau-migraine", icon: "🤕", specialty: "Thần kinh" },
      { name: "Sỏi thận", slug: "soi-than", icon: "💎", specialty: "Thận - Tiết niệu" },
      { name: "Gout", slug: "gout", icon: "🦶", specialty: "Cơ xương khớp" },
      { name: "Rối loạn lipid máu", slug: "roi-loan-lipid-mau", icon: "🩸", specialty: "Tim mạch" },
      { name: "Viêm đại tràng", slug: "viem-dai-trang", icon: "🫄", specialty: "Tiêu hóa" },
      { name: "Loét dạ dày", slug: "loet-da-day", icon: "⚠️", specialty: "Tiêu hóa" },
      { name: "Viêm gan C", slug: "viem-gan-c", icon: "🏥", specialty: "Tiêu hóa" },
      { name: "Bệnh thận mạn", slug: "benh-than-man", icon: "🩺", specialty: "Thận - Tiết niệu" },
      { name: "Suy tim", slug: "suy-tim", icon: "💔", specialty: "Tim mạch" },
    ],
    
    organs: [
      { 
        name: "Tim mạch", 
        slug: "tim-mach", 
        icon: "❤️", 
        diseases: [
          { name: "Tăng huyết áp", slug: "tang-huyet-ap" },
          { name: "Nhồi máu cơ tim", slug: "nhoi-mau-co-tim" },
          { name: "Suy tim", slug: "suy-tim" },
          { name: "Rối loạn nhịp tim", slug: "roi-loan-nhip-tim" },
          { name: "Bệnh mạch vành", slug: "benh-mach-vanh" },
          { name: "Hở van tim", slug: "ho-van-tim" },
          { name: "Hẹp van tim", slug: "hep-van-tim" },
          { name: "Viêm cơ tim", slug: "viem-co-tim" },
          { name: "Viêm màng ngoài tim", slug: "viem-mang-ngoai-tim" },
          { name: "Bệnh động mạch chủ", slug: "benh-dong-mach-chu" },
        ]
      },
      { 
        name: "Gan", 
        slug: "gan", 
        icon: "🫀", 
        diseases: [
          { name: "Viêm gan B", slug: "viem-gan-b" },
          { name: "Viêm gan C", slug: "viem-gan-c" },
          { name: "Xơ gan", slug: "xo-gan" },
          { name: "Gan nhiễm mỡ", slug: "gan-nhiem-mo" },
          { name: "Ung thư gan", slug: "ung-thu-gan" },
          { name: "Viêm đường mật", slug: "viem-duong-mat" },
          { name: "Sỏi mật", slug: "soi-mat" },
          { name: "Viêm gan A", slug: "viem-gan-a" },
          { name: "Viêm gan E", slug: "viem-gan-e" },
          { name: "Vàng da", slug: "vang-da" },
        ]
      },
      { 
        name: "Phổi", 
        slug: "phoi", 
        icon: "🫁", 
        diseases: [
          { name: "Hen suyễn", slug: "hen-suyen" },
          { name: "COPD", slug: "copd" },
          { name: "Viêm phổi", slug: "viem-phoi" },
          { name: "Lao phổi", slug: "lao-phoi" },
          { name: "Ung thư phổi", slug: "ung-thu-phoi" },
          { name: "Xơ phổi", slug: "xo-phoi" },
          { name: "Tràn khí màng phổi", slug: "tran-khi-mang-phoi" },
          { name: "Viêm phế quản", slug: "viem-phe-quan" },
          { name: "Giãn phế quản", slug: "gian-phe-quan" },
          { name: "Tràn dịch màng phổi", slug: "tran-dich-mang-phoi" },
        ]
      },
      { 
        name: "Thận", 
        slug: "than", 
        icon: "🩺", 
        diseases: [
          { name: "Sỏi thận", slug: "soi-than" },
          { name: "Bệnh thận mạn", slug: "benh-than-man" },
          { name: "Viêm thận", slug: "viem-than" },
          { name: "Suy thận cấp", slug: "suy-than-cap" },
          { name: "Suy thận mạn", slug: "suy-than-man" },
          { name: "Bệnh thận đa nang", slug: "benh-than-da-nang" },
          { name: "Hội chứng thận hư", slug: "hoi-chung-than-hu" },
          { name: "Viêm bể thận", slug: "viem-be-than" },
          { name: "Ung thư thận", slug: "ung-thu-than" },
          { name: "Bệnh thận do tiểu đường", slug: "benh-than-do-tieu-duong" },
        ]
      },
      { 
        name: "Dạ dày - Ruột", 
        slug: "da-day-ruot", 
        icon: "🫃", 
        diseases: [
          { name: "Viêm dạ dày", slug: "viem-da-day" },
          { name: "Trào ngược dạ dày", slug: "trao-nguoc-da-day" },
          { name: "Loét dạ dày", slug: "loet-da-day" },
          { name: "Ung thư dạ dày", slug: "ung-thu-da-day" },
          { name: "Viêm loét dạ dày tá tràng", slug: "viem-loet-da-day-ta-trang" },
          { name: "Viêm đại tràng", slug: "viem-dai-trang" },
          { name: "Viêm ruột thừa", slug: "viem-ruot-thua" },
          { name: "Hội chứng ruột kích thích", slug: "hoi-chung-ruot-kich-thich" },
          { name: "Bệnh Crohn", slug: "benh-crohn" },
          { name: "Viêm loét đại tràng", slug: "viem-loet-dai-trang" },
          { name: "Ung thư đại trực tràng", slug: "ung-thu-dai-truc-trang" },
          { name: "Rối loạn tiêu hóa", slug: "roi-loan-tieu-hoa" },
        ]
      },
      { 
        name: "Não - Thần kinh", 
        slug: "nao-than-kinh", 
        icon: "🧠", 
        diseases: [
          { name: "Đau đầu Migraine", slug: "dau-dau-migraine" },
          { name: "Đột quỵ não", slug: "dot-quy-nao" },
          { name: "Sa sút trí tuệ", slug: "sa-sut-tri-tue" },
          { name: "Alzheimer", slug: "alzheimer" },
          { name: "Parkinson", slug: "parkinson" },
          { name: "Động kinh", slug: "dong-kinh" },
          { name: "Viêm màng não", slug: "viem-mang-nao" },
          { name: "Viêm não", slug: "viem-nao" },
          { name: "Đau dây thần kinh tọa", slug: "dau-day-than-kinh-toa" },
          { name: "Liệt nửa người", slug: "liet-nua-nguoi" },
          { name: "Bệnh thoái hóa thần kinh", slug: "benh-thoai-hoa-than-kinh" },
          { name: "Tê tay chân", slug: "te-tay-chan" },
        ]
      },
      { 
        name: "Xương khớp", 
        slug: "xuong-khop", 
        icon: "🦴", 
        diseases: [
          { name: "Gout", slug: "gout" },
          { name: "Viêm khớp dạng thấp", slug: "viem-khop-dang-thap" },
          { name: "Loãng xương", slug: "loang-xuong" },
          { name: "Thoái hóa khớp", slug: "thoai-hoa-khop" },
          { name: "Viêm cột sống dính khớp", slug: "viem-cot-song-dinh-khop" },
          { name: "Thoát vị đĩa đệm", slug: "thoat-vi-dia-dem" },
          { name: "Gãy xương", slug: "gay-xuong" },
          { name: "Viêm bao hoạt dịch", slug: "viem-bao-hoat-dich" },
          { name: "Viêm gân", slug: "viem-gan" },
          { name: "Viêm khớp nhiễm khuẩn", slug: "viem-khop-nhiem-khuan" },
        ]
      },
    ],

    ageGroups: [
      { 
        name: "Trẻ em", 
        slug: "tre-em", 
        icon: "👶", 
        ageRange: "0-12 tuổi",
        diseases: [
          { name: "Sốt xuất huyết", slug: "sot-xuat-huyet" },
          { name: "Tay chân miệng", slug: "tay-chan-mieng" },
          { name: "Sởi", slug: "soi" },
          { name: "Quai bị", slug: "quai-bi" },
          { name: "Thủy đậu", slug: "thuy-dau" },
          { name: "Viêm phổi trẻ em", slug: "viem-phoi-tre-em" },
          { name: "Tiêu chảy cấp", slug: "tieu-chay-cap" },
          { name: "Viêm amidan", slug: "viem-amidan" },
          { name: "Viêm tai giữa", slug: "viem-tai-giua" },
          { name: "Hen phế quản", slug: "hen-phe-quan" },
          { name: "Còi xương", slug: "coi-xuong" },
          { name: "Dị tật tim bẩm sinh", slug: "di-tat-tim-bam-sinh" },
          { name: "Suy dinh dưỡng", slug: "suy-dinh-duong" },
          { name: "Viêm não Nhật Bản", slug: "viem-nao-nhat-ban" },
          { name: "Bại liệt", slug: "bai-liet" },
          { name: "Bạch hầu", slug: "bach-hau" },
        ]
      },
      { 
        name: "Thanh thiếu niên", 
        slug: "thanh-thieu-nien", 
        icon: "🧑", 
        ageRange: "13-19 tuổi",
        diseases: [
          { name: "Mụn trứng cá", slug: "mun-trung-ca" },
          { name: "Cận thị", slug: "can-thi" },
          { name: "Loạn thị", slug: "loan-thi" },
          { name: "Hen suyễn thanh thiếu niên", slug: "hen-suyen-thanh-thieu-nien" },
          { name: "Viêm xoang", slug: "viem-xoang" },
          { name: "Viêm dạ dày", slug: "viem-da-day" },
          { name: "Rối loạn ăn uống", slug: "roi-loan-an-uong" },
          { name: "Trầm cảm tuổi teen", slug: "tram-cam-tuoi-teen" },
          { name: "Lo âu", slug: "lo-au" },
          { name: "Béo phì", slug: "beo-phi" },
          { name: "Thiếu máu", slug: "thieu-mau" },
          { name: "Rối loạn nội tiết tố", slug: "roi-loan-noi-tiet-to" },
          { name: "Rối loạn kinh nguyệt", slug: "roi-loan-kinh-nguyet" },
          { name: "Dị ứng thực phẩm", slug: "di-ung-thuc-pham" },
        ]
      },
      { 
        name: "Người trưởng thành", 
        slug: "nguoi-truong-thanh", 
        icon: "👨", 
        ageRange: "20-59 tuổi",
        diseases: [
          { name: "Tăng huyết áp", slug: "tang-huyet-ap" },
          { name: "Tiểu đường", slug: "tieu-duong" },
          { name: "Viêm gan B", slug: "viem-gan-b" },
          { name: "Gout", slug: "gout" },
          { name: "Rối loạn lipid máu", slug: "roi-loan-lipid-mau" },
          { name: "Sỏi thận", slug: "soi-than" },
          { name: "Viêm đại tràng", slug: "viem-dai-trang" },
          { name: "Loét dạ dày", slug: "loet-da-day" },
          { name: "Stress công việc", slug: "stress-cong-viec" },
          { name: "Mất ngủ", slug: "mat-ngu" },
          { name: "Đau lưng", slug: "dau-lung" },
          { name: "Thoái hóa đốt sống cổ", slug: "thoai-hoa-dot-song-co" },
          { name: "Béo phì", slug: "beo-phi" },
          { name: "Hội chứng chuyển hóa", slug: "hoi-chung-chuyen-hoa" },
          { name: "Bệnh mạch vành", slug: "benh-mach-vanh" },
          { name: "Viêm gan C", slug: "viem-gan-c" },
        ]
      },
      { 
        name: "Người cao tuổi", 
        slug: "nguoi-cao-tuoi", 
        icon: "👴", 
        ageRange: "60+ tuổi",
        diseases: [
          { name: "Suy tim", slug: "suy-tim" },
          { name: "Bệnh thận mạn", slug: "benh-than-man" },
          { name: "Đột quỵ não", slug: "dot-quy-nao" },
          { name: "Alzheimer", slug: "alzheimer" },
          { name: "Parkinson", slug: "parkinson" },
          { name: "Loãng xương", slug: "loang-xuong" },
          { name: "Thoái hóa khớp", slug: "thoai-hoa-khop" },
          { name: "Đục thủy tinh thể", slug: "duc-thuy-tinh-the" },
          { name: "Tăng nhãn áp", slug: "tang-nhan-ap" },
          { name: "Ung thư", slug: "ung-thu" },
          { name: "COPD", slug: "copd" },
          { name: "Suy giảm miễn dịch", slug: "suy-giam-mien-dich" },
          { name: "Lẫn tuổi già", slug: "lan-tuoi-gia" },
          { name: "Ngã ở người cao tuổi", slug: "nga-o-nguoi-cao-tuoi" },
          { name: "Suy dinh dưỡng", slug: "suy-dinh-duong" },
        ]
      },
    ],

    seasons: [
      { 
        name: "Mùa xuân", 
        slug: "mua-xuan", 
        icon: "🌸",
        months: "Tháng 2-4",
        diseases: [
          { name: "Dị ứng phấn hoa", slug: "di-ung-phan-hoa" },
          { name: "Viêm mũi dị ứng", slug: "viem-mui-di-ung" },
          { name: "Viêm kết mạc dị ứng", slug: "viem-ket-mac-di-ung" },
          { name: "Nổi mề đay", slug: "noi-me-day" },
          { name: "Viêm da cơ địa", slug: "viem-da-co-dia" },
          { name: "Sốt virus", slug: "sot-virus" },
          { name: "Cảm cúm", slug: "cam-cum" },
          { name: "Viêm họng", slug: "viem-hong" },
        ]
      },
      { 
        name: "Mùa hè", 
        slug: "mua-he", 
        icon: "☀️",
        months: "Tháng 5-7",
        diseases: [
          { name: "Sốt xuất huyết", slug: "sot-xuat-huyet" },
          { name: "Tay chân miệng", slug: "tay-chan-mieng" },
          { name: "Ngộ độc thực phẩm", slug: "ngo-doc-thuc-pham" },
          { name: "Tiêu chảy cấp", slug: "tieu-chay-cap" },
          { name: "Say nắng", slug: "say-nang" },
          { name: "Nấm da", slug: "nam-da" },
          { name: "Rôm sảy", slug: "rom-say" },
          { name: "Mụn nhọt", slug: "mun-nhot" },
          { name: "Viêm đường tiết niệu", slug: "viem-duong-tiet-nieu" },
          { name: "Sốt rét", slug: "sot-ret" },
        ]
      },
      { 
        name: "Mùa thu", 
        slug: "mua-thu", 
        icon: "🍂",
        months: "Tháng 8-10",
        diseases: [
          { name: "Cảm cúm", slug: "cam-cum" },
          { name: "Viêm phổi", slug: "viem-phoi" },
          { name: "Hen suyễn", slug: "hen-suyen" },
          { name: "Viêm xoang", slug: "viem-xoang" },
          { name: "Viêm họng", slug: "viem-hong" },
          { name: "Viêm amidan", slug: "viem-amidan" },
          { name: "Viêm phế quản", slug: "viem-phe-quan" },
          { name: "Sốt virus", slug: "sot-virus" },
        ]
      },
      { 
        name: "Mùa đông", 
        slug: "mua-dong", 
        icon: "❄️",
        months: "Tháng 11-1",
        diseases: [
          { name: "Cảm lạnh", slug: "cam-lanh" },
          { name: "Viêm phế quản", slug: "viem-phe-quan" },
          { name: "COPD cấp", slug: "copd-cap" },
          { name: "Bệnh tim mạch cấp", slug: "benh-tim-mach-cap" },
          { name: "Đột quỵ não", slug: "dot-quy-nao" },
          { name: "Viêm da khô", slug: "viem-da-kho" },
          { name: "Viêm khớp", slug: "viem-khop" },
          { name: "Đau thần kinh tọa", slug: "dau-than-kinh-toa" },
        ]
      },
    ],

    specialties: [
      { name: "Tim mạch", slug: "chuyen-khoa-tim-mach", icon: "❤️", count: 24, description: "Chuyên khoa điều trị bệnh lý tim và mạch máu" },
      { name: "Tiêu hóa", slug: "chuyen-khoa-tieu-hoa", icon: "🫃", count: 32, description: "Chuyên khoa điều trị bệnh dạ dày, gan, mật, tụy" },
      { name: "Hô hấp", slug: "chuyen-khoa-ho-hap", icon: "🫁", count: 18, description: "Chuyên khoa điều trị bệnh phổi và đường hô hấp" },
      { name: "Thần kinh", slug: "chuyen-khoa-than-kinh", icon: "🧠", count: 28, description: "Chuyên khoa điều trị bệnh não và hệ thần kinh" },
      { name: "Nội tiết", slug: "chuyen-khoa-noi-tiet", icon: "💊", count: 16, description: "Chuyên khoa điều trị tiểu đường, tuyến giáp" },
      { name: "Cơ xương khớp", slug: "chuyen-khoa-co-xuong-khop", icon: "🦴", count: 22, description: "Chuyên khoa điều trị bệnh xương, khớp, cột sống" },
      { name: "Thận - Tiết niệu", slug: "chuyen-khoa-than-tiet-nieu", icon: "🩺", count: 14, description: "Chuyên khoa điều trị bệnh thận và đường tiết niệu" },
      { name: "Tai Mũi Họng", slug: "chuyen-khoa-tai-mui-hong", icon: "👂", count: 12, description: "Chuyên khoa điều trị bệnh tai, mũi, họng" },
    ]
  };

  const handleDiseaseClick = (slug) => {
    // Tạm thời chỉ log, chưa có trang chi tiết
    console.log("Clicked disease:", slug);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Tìm kiếm:", searchTerm);
  };

  return (
    <div className="diseases-container">
      {/* Hero Section */}
      <div className="diseases-hero">
        <h1>Tra cứu bệnh</h1>
        <p>Thông tin y học đáng tin cậy từ các chuyên gia hàng đầu</p>
        
        <form className="search-box" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Tìm kiếm bệnh, triệu chứng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8" strokeWidth="2"/>
              <path d="m21 21-4.35-4.35" strokeWidth="2"/>
            </svg>
          </button>
        </form>
      </div>

      {/* Bệnh phổ biến */}
      <section className="disease-section">
        <div className="section-header">
          <h2>🏥 Bệnh phổ biến</h2>
          <p>Các bệnh lý thường gặp nhất hiện nay</p>
        </div>
        <div className="disease-grid">
          {DISEASE_CATEGORIES.popular.map((disease, idx) => (
            <div key={idx} className="disease-card" onClick={() => handleDiseaseClick(disease.slug)}>
              <div className="disease-icon">{disease.icon}</div>
              <h3>{disease.name}</h3>
              <span className="disease-specialty">{disease.specialty}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Bệnh theo cơ quan */}
      <section className="disease-section">
        <div className="section-header">
          <h2>🩺 Bệnh theo cơ quan</h2>
          <p>Tra cứu bệnh theo từng hệ cơ quan trong cơ thể</p>
        </div>
        
        {DISEASE_CATEGORIES.organs.map((organ, idx) => (
          <div key={idx} className="organ-section">
            <div className="organ-header">
              <span className="organ-icon">{organ.icon}</span>
              <h3>{organ.name}</h3>
              <span className="disease-count">({organ.diseases.length} bệnh)</span>
            </div>
            <div className="disease-grid">
              {organ.diseases.map((disease, dIdx) => (
                <div key={dIdx} className="disease-card compact" onClick={() => handleDiseaseClick(disease.slug)}>
                  <h4>{disease.name}</h4>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Bệnh theo độ tuổi */}
      <section className="disease-section">
        <div className="section-header">
          <h2>👨‍👩‍👧‍👦 Bệnh theo độ tuổi</h2>
          <p>Các bệnh lý đặc trưng cho từng lứa tuổi</p>
        </div>
        
        <div className="age-groups-grid">
          {DISEASE_CATEGORIES.ageGroups.map((group, idx) => (
            <div key={idx} className="age-group-card">
              <div className="age-group-header">
                <span className="age-icon">{group.icon}</span>
                <div>
                  <h3>{group.name}</h3>
                  <span className="age-range">{group.ageRange}</span>
                </div>
              </div>
              <div className="disease-list">
                {group.diseases.slice(0, 8).map((disease, dIdx) => (
                  <div key={dIdx} className="disease-item" onClick={() => handleDiseaseClick(disease.slug)}>
                    • {disease.name}
                  </div>
                ))}
                {group.diseases.length > 8 && (
                  <button className="view-more-btn">Xem thêm {group.diseases.length - 8} bệnh →</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bệnh theo mùa */}
      <section className="disease-section">
        <div className="section-header">
          <h2>🌦️ Bệnh theo mùa</h2>
          <p>Các bệnh thường xuất hiện theo từng mùa trong năm</p>
        </div>
        
        <div className="season-grid">
          {DISEASE_CATEGORIES.seasons.map((season, idx) => (
            <div key={idx} className="season-card">
              <div className="season-header">
                <span className="season-icon">{season.icon}</span>
                <div>
                  <h3>{season.name}</h3>
                  <span className="season-months">{season.months}</span>
                </div>
              </div>
              <div className="disease-list">
                {season.diseases.map((disease, dIdx) => (
                  <div key={dIdx} className="disease-item" onClick={() => handleDiseaseClick(disease.slug)}>
                    • {disease.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Chuyên khoa */}
      <section className="disease-section">
        <div className="section-header">
          <h2>⚕️ Tra cứu theo chuyên khoa</h2>
          <p>Danh sách bệnh theo các chuyên khoa y tế</p>
        </div>
        
        <div className="specialty-grid">
          {DISEASE_CATEGORIES.specialties.map((specialty, idx) => (
            <div key={idx} className="specialty-card" onClick={() => navigate(`/diseases/${specialty.slug}`)}>
              <span className="specialty-icon">{specialty.icon}</span>
              <h3>{specialty.name}</h3>
              <p>{specialty.description}</p>
              <span className="disease-count">{specialty.count} bệnh</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
