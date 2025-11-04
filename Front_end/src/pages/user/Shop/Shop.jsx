import { useState, useEffect } from "react";
import ProductCard from "../../../components/ProductCard/ProductCard.jsx";
import SearchBar from "../../../components/SearchBar/SearchBar.jsx";
import { fetchProducts, addToCart } from "../../../api";
import "./Shop.css";

// CATEGORIES - Danh mục sản phẩm (khớp với database)
const CATEGORIES = [
  { id: 1, name: "Thuốc", icon: "💊", key: "thuoc" },
  { id: 2, name: "Vitamin & Chức năng", icon: "🌿", key: "vitamin" },
  { id: 3, name: "Chăm sóc sức khỏe", icon: "🧴", key: "cham-soc" },
  { id: 4, name: "Thiết bị y tế", icon: "🩺", key: "thiet-bi" },
];

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products từ API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const params = { limit: 50 }; // Lấy đủ 50 sản phẩm để hiển thị tất cả
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

  // Map category from API to categoryId
  const mapCategoryToId = (category) => {
    const categoryMap = {
      "thuoc": 1,
      "vitamin": 2,
      "cham-soc": 3,
      "thiet-bi": 4
    };
    return categoryMap[category] || 1;
  };

  // Transform API products to match frontend structure
  const transformedProducts = products.map(p => {
    // API đã trả imageUrl tuyệt đối, dùng luôn
    const imagePath = p.imageUrl || p.ImageUrl || p.image || "/images/default.jpg";

    return {
      id: p.id || p.Id,
      name: p.name || p.Name,
      price: parseFloat(p.price || p.Price || 0),
      category: p.category || p.Category,
      categoryId: mapCategoryToId(p.category || p.Category),
      stock: p.stock || p.Stock || 0,
      image: imagePath,
      imageUrl: imagePath, // Thêm imageUrl để ProductCard dùng
      description: p.shortDesc || p.ShortDesc || p.description || ''
    };
  });

  // Group products by category
  const groupedProducts = CATEGORIES.map(cat => {
    const categoryProducts = transformedProducts.filter(
      p => p.categoryId === cat.id
    );
    return {
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      products: categoryProducts.slice(0, 5), // Chỉ lấy 5 sản phẩm đầu tiên
      totalProducts: categoryProducts.length // Tổng số sản phẩm trong danh mục
    };
  }).filter(group => group.products.length > 0);

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product.id, 1);
      alert(`✓ Đã thêm "${product.name}" vào giỏ hàng!`);
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("❌ Lỗi: " + (err.response?.data?.error || "Không thể thêm vào giỏ hàng"));
    }
  };

  return (
    <div className="shop-container">
      {/* Header Section */}
      <div className="shop-header">
        <div className="shop-hero">
          <h1 className="shop-title">Cửa Hàng Dược Phẩm</h1>
          <p className="shop-subtitle">
            Chất lượng - Uy tín - Giá tốt | Giao hàng nhanh toàn quốc
          </p>
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <SearchBar
            onSearch={setSearchTerm}
            placeholder="Tìm kiếm thuốc, vitamin, dụng cụ y tế..."
          />
        </div>

        {/* Category Filter */}
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
                  <span className="section-icon">{group.icon}</span>
                  {group.name}
                  <span className="product-count">({group.products.length} sản phẩm)</span>
                </h2>
                {group.totalProducts > 5 && (
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
