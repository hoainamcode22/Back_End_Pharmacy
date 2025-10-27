import { useState } from "react";
import ProductCard from "../../components/ProductCard";
import SearchBar from "../../components/SearchBar";
import "./Shop.css";

// MOCK DATA - 5 danh mục, mỗi danh mục 6 sản phẩm = 30 sản phẩm
const CATEGORIES = [
  { id: 1, name: "Thuốc giảm đau - Hạ sốt", icon: "💊" },
  { id: 2, name: "Vitamin & Thực phẩm chức năng", icon: "🌿" },
  { id: 3, name: "Thuốc kháng sinh", icon: "💉" },
  { id: 4, name: "Chăm sóc cá nhân", icon: "🧴" },
  { id: 5, name: "Dụng cụ y tế", icon: "🩺" },
];

const MOCK_PRODUCTS = [
  // Danh mục 1: Thuốc giảm đau - Hạ sốt (6 sản phẩm)
  { 
    id: 1, 
    name: "Paracetamol 500mg", 
    price: 15000, 
    category: "Thuốc giảm đau - Hạ sốt", 
    categoryId: 1, 
    stock: 100, 
    image: "/images/products/paracetamol.jpg",
    description: "Giảm đau, hạ sốt hiệu quả"
  },
  { 
    id: 2, 
    name: "Ibuprofen 400mg", 
    price: 25000, 
    originalPrice: 30000, 
    discount: 17, 
    category: "Thuốc giảm đau - Hạ sốt", 
    categoryId: 1, 
    stock: 50, 
    image: "/images/products/ibuprofen.jpg",
    description: "Chống viêm, giảm đau"
  },
  { 
    id: 3, 
    name: "Aspirin 100mg", 
    price: 12000, 
    category: "Thuốc giảm đau - Hạ sốt", 
    categoryId: 1, 
    stock: 80, 
    image: "/images/products/aspirin.jpg",
    description: "Giảm đau, chống đông máu"
  },
  { 
    id: 4, 
    name: "Diclofenac 50mg", 
    price: 35000, 
    category: "Thuốc giảm đau - Hạ sốt", 
    categoryId: 1, 
    stock: 5, 
    image: "/images/products/diclofenac.jpg",
    description: "Giảm đau khớp, cơ"
  },
  { 
    id: 5, 
    name: "Mefenamic Acid 500mg", 
    price: 28000, 
    category: "Thuốc giảm đau - Hạ sốt", 
    categoryId: 1, 
    stock: 60, 
    image: "/images/products/mefenamic.jpg",
    description: "Giảm đau bụng kinh"
  },
  { 
    id: 6, 
    name: "Naproxen 250mg", 
    price: 32000, 
    originalPrice: 40000, 
    discount: 20, 
    category: "Thuốc giảm đau - Hạ sốt", 
    categoryId: 1, 
    stock: 45, 
    image: "/images/products/naproxen.jpg",
    description: "Giảm viêm khớp"
  },

  // Danh mục 2: Vitamin & TPCN (6 sản phẩm)
  { 
    id: 7, 
    name: "Vitamin C 1000mg", 
    price: 45000, 
    category: "Vitamin & Thực phẩm chức năng", 
    categoryId: 2, 
    stock: 200, 
    image: "/images/products/vitamin-c.jpg",
    description: "Tăng sức đề kháng"
  },
  { 
    id: 8, 
    name: "Vitamin D3 5000IU", 
    price: 85000, 
    originalPrice: 100000, 
    discount: 15, 
    category: "Vitamin & Thực phẩm chức năng", 
    categoryId: 2, 
    stock: 150, 
    image: "/images/products/vitamin-d3.jpg",
    description: "Chống loãng xương"
  },
  { 
    id: 9, 
    name: "Omega 3 Fish Oil", 
    price: 120000, 
    category: "Vitamin & Thực phẩm chức năng", 
    categoryId: 2, 
    stock: 100, 
    image: "/images/products/omega3.jpg",
    description: "Tốt cho tim mạch"
  },
  { 
    id: 10, 
    name: "Multi Vitamin A-Z", 
    price: 95000, 
    category: "Vitamin & Thực phẩm chức năng", 
    categoryId: 2, 
    stock: 75, 
    image: "/images/products/multivitamin.jpg",
    description: "Bổ sung đa vitamin"
  },
  { 
    id: 11, 
    name: "Calcium + Vitamin D", 
    price: 65000,
    category: "Vitamin & Thực phẩm chức năng", 
    categoryId: 2, 
    stock: 90, 
    image: "/images/products/calcium.jpg",
    description: "Chắc khỏe xương"
  },
  { 
    id: 12, 
    name: "Collagen Plus", 
    price: 150000,
    originalPrice: 180000, 
    discount: 17, 
    category: "Vitamin & Thực phẩm chức năng", 
    categoryId: 2, 
    stock: 55, 
    image: "/images/products/collagen.jpg",
    description: "Làm đẹp da"
  },

  // Danh mục 3: Thuốc kháng sinh (6 sản phẩm)
  { 
    id: 13, 
    name: "Amoxicillin 500mg",
    price: 45000, 
    category: "Thuốc kháng sinh", 
    categoryId: 3, 
    stock: 40, 
    image: "/images/products/amoxicillin.jpg",
    description: "Kháng sinh phổ rộng"
  },
  { 
    id: 14, 
    name: "Cephalexin 500mg", 
    price: 55000, 
    category: "Thuốc kháng sinh", 
    categoryId: 3, 
    stock: 35, 
    image: "/images/products/cephalexin.jpg",
    description: "Kháng sinh Cephalosporin"
  },
  { 
    id: 15, 
    name: "Azithromycin 250mg", 
    price: 85000, 
    originalPrice: 95000, 
    discount: 11, 
    category: "Thuốc kháng sinh", 
    categoryId: 3, 
    stock: 30, 
    image: "/images/products/azithromycin.jpg",
    description: "Kháng sinh Macrolide"
  },
  { 
    id: 16, 
    name: "Ciprofloxacin 500mg", 
    price: 65000, 
    category: "Thuốc kháng sinh", 
    categoryId: 3, 
    stock: 8, 
    image: "/images/products/ciprofloxacin.jpg",
    description: "Kháng sinh Quinolone"
  },
  { 
    id: 17, 
    name: "Doxycycline 100mg", 
    price: 42000, 
    category: "Thuốc kháng sinh", 
    categoryId: 3, 
    stock: 25, 
    image: "/images/products/doxycycline.jpg",
    description: "Kháng sinh Tetracycline"
  },
  { 
    id: 18, 
    name: "Metronidazole 500mg", 
    price: 38000, 
    category: "Thuốc kháng sinh", 
    categoryId: 3, 
    stock: 50, 
    image: "/images/products/metronidazole.jpg",
    description: "Kháng sinh kỵ khí"
  },

  // Danh mục 4: Chăm sóc cá nhân (6 sản phẩm)
  { 
    id: 19, 
    name: "Dầu gội đầu dược liệu", 
    price: 85000, 
    category: "Chăm sóc cá nhân", 
    categoryId: 4, 
    stock: 120, 
    image: "/images/products/shampoo.jpg",
    description: "Dưỡng tóc mềm mượt"
  },
  { 
    id: 20, 
    name: "Kem chống nắng SPF50", 
    price: 145000, 
    originalPrice: 180000, 
    discount: 19, 
    category: "Chăm sóc cá nhân", 
    categoryId: 4, 
    stock: 80, 
    image: "/images/products/sunscreen.jpg",
    description: "Bảo vệ da tối ưu"
  },
  { 
    id: 21, 
    name: "Nước súc miệng Listerine", 
    price: 75000, 
    category: "Chăm sóc cá nhân", 
    categoryId: 4, 
    stock: 95, 
    image: "/images/products/mouthwash.jpg",
    description: "Làm sạch răng miệng"
  },
  { 
    id: 22, 
    name: "Kem đánh răng Sensodyne", 
    price: 55000, 
    category: "Chăm sóc cá nhân", 
    categoryId: 4, 
    stock: 110, 
    image: "/images/products/toothpaste.jpg",
    description: "Giảm ê buốt"
  },
  { 
    id: 23, 
    name: "Sữa rửa mặt La Roche", 
    price: 95000, 
    originalPrice: 120000, 
    discount: 21, 
    category: "Chăm sóc cá nhân", 
    categoryId: 4, 
    stock: 70, 
    image: "/images/products/cleanser.jpg",
    description: "Làm sạch da mặt"
  },
  { 
    id: 24, 
    name: "Dầu gội trị gàu", 
    price: 125000,
    category: "Chăm sóc cá nhân", 
    categoryId: 4, 
    stock: 60, 
    image: "/images/products/anti-dandruff.jpg",
    description: "Trị gàu hiệu quả"
  },

  // Danh mục 5: Dụng cụ y tế (6 sản phẩm)
  { 
    id: 25, 
    name: "Nhiệt kế điện tử", 
    price: 185000, 
    category: "Dụng cụ y tế", 
    categoryId: 5, 
    stock: 45, 
    image: "/images/products/thermometer.jpg",
    description: "Đo nhiệt độ chính xác"
  },
  { 
    id: 26, 
    name: "Máy đo huyết áp", 
    price: 650000, 
    originalPrice: 800000, 
    discount: 19, 
    category: "Dụng cụ y tế", 
    categoryId: 5, 
    stock: 20, 
    image: "/images/products/bp-monitor.jpg",
    description: "Theo dõi huyết áp"
  },
  { 
    id: 27, 
    name: "Máy đo đường huyết", 
    price: 480000, 
    category: "Dụng cụ y tế", 
    categoryId: 5, 
    stock: 15, 
    image: "/images/products/glucose-meter.jpg",
    description: "Kiểm tra đường huyết"
  },
  { 
    id: 28, 
    name: "Khẩu trang y tế (Hộp 50c)", 
    price: 85000, 
    category: "Dụng cụ y tế", 
    categoryId: 5, 
    stock: 200, 
    image: "/images/products/face-mask.jpg",
    description: "Bảo vệ sức khỏe"
  },
  { 
    id: 29, 
    name: "Bộ sơ cứu gia đình", 
    price: 245000, 
    category: "Dụng cụ y tế", 
    categoryId: 5, 
    stock: 35, 
    image: "/images/products/first-aid.jpg",
    description: "Đầy đủ dụng cụ sơ cứu"
  },
  { 
    id: 30, 
    name: "Máy xông mũi họng", 
    price: 850000, 
    originalPrice: 1000000, 
    discount: 15, 
    category: "Dụng cụ y tế", 
    categoryId: 5, 
    stock: 8, 
    image: "/images/products/nebulizer.jpg",
    description: "Điều trị hô hấp"
  }
];

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Lọc sản phẩm theo danh mục và tìm kiếm
  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchCategory = !selectedCategory || product.categoryId === selectedCategory;
    const matchSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Nhóm sản phẩm theo category (có tiêu đề)
  const groupedProducts = CATEGORIES.map(cat => ({
    ...cat,
    products: filteredProducts.filter(p => p.categoryId === cat.id)
  })).filter(group => group.products.length > 0);

  // Thêm vào giỏ hàng
  const handleAddToCart = (product) => {
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
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

      {/* Products Section - Hiển thị theo sections với tiêu đề */}
      <div className="products-section">
        {groupedProducts.length === 0 ? (
          <div className="no-products">
            <p>Không tìm thấy sản phẩm nào phù hợp</p>
          </div>
        ) : (
          groupedProducts.map(group => (
            <div key={group.id} className="category-section">
              {/* Section Header với tiêu đề */}
              <div className="section-header">
                <h2 className="section-title">
                  <span className="section-icon">{group.icon}</span>
                  {group.name}
                </h2>
                <a href="#" className="view-more">Xem thêm</a>
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
