import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../../components/ProductCard/ProductCard.jsx";
import SearchBar from "../../../components/SearchBar/SearchBar.jsx";
import { fetchProducts, addToCart } from "../../../api";
import "./Shop.css";

// ⭐️ Vẫn import 6 ảnh voucher
import voucher1 from "../../../assets/voucher1.jpg";
import voucher2 from "../../../assets/voucher2.jpg";
import voucher3 from "../../../assets/voucher3.jpg";
import voucher4 from "../../../assets/voucher4.jpg";
import voucher5 from "../../../assets/voucher5.jpg";
import voucher6 from "../../../assets/voucher6.jpg";

// CATEGORIES - (Giữ nguyên)
const CATEGORIES = [
  { id: 1, name: "Thuốc", icon: "💊", key: "thuoc" },
  { id: 2, name: "Vitamin & Chức năng", icon: "🌿", key: "vitamin" },
  { id: 3, name: "Chăm sóc sức khỏe", icon: "🧴", key: "cham-soc" },
  { id: 4, name: "Thiết bị y tế", icon: "🩺", key: "thiet-bi" },
];

// ⭐️ Gom 6 voucher vào 1 mảng để chạy slide
const banners = [voucher1, voucher2, voucher3, voucher4, voucher5, voucher6];

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ⭐️ State mới để điều khiển carousel
  const [currentSlide, setCurrentSlide] = useState(0);

  // ⭐️ Hàm chuyển slide
  const nextSlide = () => {
    setCurrentSlide(s => (s === banners.length - 1 ? 0 : s + 1));
  };
  const prevSlide = () => {
    setCurrentSlide(s => (s === 0 ? banners.length - 1 : s - 1));
  };

  // ⭐️ useEffect mới để tự động lướt (3 giây)
  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 3000);
    return () => clearInterval(slideInterval); // Dọn dẹp khi component unmount
  }, []);

  // Fetch products từ API (Giữ nguyên)
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const params = { limit: 50 };
        if (selectedCategory) {
          const category = CATEGORIES.find(c => c.id === selectedCategory);
          if (category) params.category = category.key;
        }
        if (searchTerm) params.search = searchTerm;
        const data = await fetchProducts(params);
        setProducts(data.products || []);
        setError(null);
      } catch (err) {
        console.error("Error loading products:", err);
        setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [selectedCategory, searchTerm]);

  // (Các hàm mapCategoryToId, transformedProducts giữ nguyên)
  // ... (existing code) ...
  const mapCategoryToId = (category) => {
    const categoryMap = {
      "thuoc": 1,
      "vitamin": 2,
      "cham-soc": 3,
      "thiet-bi": 4
    };
    return categoryMap[category] || 1;
  };

  const transformedProducts = products.map(p => {
    const imagePath = p.imageUrl || p.ImageUrl || p.image || "/images/default.jpg";
    return {
      id: p.id || p.Id,
      name: p.name || p.Name,
      price: parseFloat(p.price || p.Price || 0),
      category: p.category || p.Category,
      categoryId: mapCategoryToId(p.category || p.Category),
      stock: p.stock || p.Stock || 0,
      image: imagePath,
      imageUrl: imagePath,
      description: p.shortDesc || p.ShortDesc || p.description || ''
    };
  });

  // Group products by category (Giữ nguyên 6 cột)
  const groupedProducts = CATEGORIES.map(cat => {
    const categoryProducts = transformedProducts.filter(
      p => p.categoryId === cat.id
    );
    return {
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      products: categoryProducts.slice(0, 6), // Vẫn lấy 6 sản phẩm
      totalProducts: categoryProducts.length
    };
  }).filter(group => group.products.length > 0);

  // handleAddToCart (Giữ nguyên)
  const handleAddToCart = async (product) => {
    try {
      await addToCart(product.id, 1);
      window.dispatchEvent(new Event('cart:updated'));
      const btn = document.getElementById('cart-icon-button');
      if (btn) {
        btn.classList.remove('pulse-cart');
        void btn.offsetHeight;
        btn.classList.add('pulse-cart');
        setTimeout(() => btn.classList.remove('pulse-cart'), 650);
      }
    } catch (err) {
      console.error('addToCart failed:', err);
    }
  };

  return (
    <div className="shop-container">
      {/* Header Section (Giữ nguyên) */}
      <div className="shop-header">
        <div className="shop-hero">
          <h1 className="shop-title">Cửa Hàng Dược Phẩm</h1>
          <p className="shop-subtitle">
            Chất lượng - Uy tín - Giá tốt | Giao hàng nhanh toàn quốc
          </p>
        </div>
        <div className="search-section">
          <SearchBar
            onSearch={setSearchTerm}
            placeholder="Tìm kiếm thuốc, vitamin, dụng cụ y tế..."
          />
        </div>
        <div className="category-filter">
          <button
            className={`category-btn ${!selectedCategory ? "active" : ""}`}
            onClick={() => setSelectedCategory(null)}
          >
            <span className="category-icon">🏠</span>
            <span>Tất cả</span>
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`category-btn ${selectedCategory === cat.id ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span className="category-icon">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ====== 💎 BANNER CAROUSEL MỚI (THAY THẾ LƯỚI VOUCHER) ====== */}
      <div className="banner-carousel-container"> {/* Bọc card đẹp */}
        <div className="banner-carousel">
          {/* Lớp track chứa các slide, di chuyển bằng transform */}
          <div className="carousel-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {banners.map((banner, index) => (
              <div className="carousel-slide" key={index}>
                <Link to="/event">
                  <img src={banner} alt={`Banner ${index + 1}`} />
                </Link>
              </div>
            ))}
          </div>
          {/* 2 button lướt */}
          <button className="carousel-btn prev" onClick={prevSlide}>&#10094;</button>
          <button className="carousel-btn next" onClick={nextSlide}>&#10095;</button>
        </div>
      </div>
      {/* ====== KẾT THÚC BANNER CAROUSEL ====== */}

      {/* ====== DÒNG CHỮ CHẠY (MARQUEE) (Giữ nguyên) ====== */}
      <div className="marquee-section">
        <div className="marquee-content">
          <span>🎉 Giảm giá áp dụng từ ngày 15/11/2025 - 15/12/2025</span>
          <span>🌟 Hãy tạo thành viên để được giảm giá 50% cho lần đầu mua hàng</span>
          <span>🔥 Ưu đãi độc quyền: Mua 2 Tính 1 cho sản phẩm Cocoon!</span>
          <span>🎉 Giảm giá áp dụng từ ngày 15/11/2025 - 15/12/2025</span>
          <span>🌟 Hãy tạo thành viên để được giảm giá 50% cho lần đầu mua hàng</span>
          <span>🔥 Ưu đãi độc quyền: Mua 2 Tính 1 cho sản phẩm Cocoon!</span>
        </div>
      </div>
      
 {/* Products Section */}
      <div className="products-section">
        {loading ? (
          <div className="loading">
            <p>Đang tải sản phẩm...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
          </div>
        ) : groupedProducts.length === 0 ? (
          <div className="no-products">
            <p>Không tìm thấy sản phẩm nào phù hợp</p>
          </div>
        ) : (
          groupedProducts.map(group => (
            <div key={group.id} className="category-section">
              {/* Section Header */}
              <div className="section-header">
                <h2 className="section-title">
                  <span className="section-icon"></span>
                  {group.name}
                </h2>
                {group.totalProducts > 4 && (
                  <button
                    className="view-more"
                    onClick={() => setSelectedCategory(group.id)}
                  >
                    Xem thêm →
                  </button>
                )}
              </div>

              {/* Products Grid */}
              <div className="products-grid">
                {group.products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}