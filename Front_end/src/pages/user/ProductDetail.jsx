import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductDetail.css";

// MOCK DATA - Lấy từ Shop.jsx
const MOCK_PRODUCTS = [
  { id: 1, name: "Paracetamol 500mg", price: 15000, category: "Thuốc giảm đau - Hạ sốt", stock: 100, image: "/images/products/paracetamol.jpg", description: "Giảm đau, hạ sốt hiệu quả", details: "Thành phần: Paracetamol 500mg. Chỉ định: Giảm đau, hạ sốt. Liều dùng: 1-2 viên/lần, 3-4 lần/ngày.", brand: "Pymepharco", origin: "Việt Nam" },
  { id: 2, name: "Ibuprofen 400mg", price: 25000, originalPrice: 30000, discount: 17, category: "Thuốc giảm đau - Hạ sốt", stock: 50, image: "/images/products/ibuprofen.jpg", description: "Chống viêm, giảm đau", details: "Thành phần: Ibuprofen 400mg. Chống viêm, giảm đau mạnh. Liều dùng: 1 viên/lần, 3 lần/ngày sau ăn.", brand: "Domesco", origin: "Việt Nam" },
  { id: 3, name: "Aspirin 100mg", price: 12000, category: "Thuốc giảm đau - Hạ sốt", stock: 80, image: "/images/products/aspirin.jpg", description: "Giảm đau, chống đông máu", details: "Thành phần: Aspirin 100mg. Phòng ngừa đột quỵ, nhồi máu cơ tim. Liều dùng: 1 viên/ngày.", brand: "Sanofi", origin: "Pháp" },
  { id: 4, name: "Diclofenac 50mg", price: 35000, category: "Thuốc giảm đau - Hạ sốt", stock: 5, image: "/images/products/diclofenac.jpg", description: "Giảm đau khớp, cơ", details: "Thành phần: Diclofenac 50mg. Điều trị viêm khớp, đau cơ. Liều dùng: 1 viên/lần, 2-3 lần/ngày.", brand: "Teva", origin: "Israel" },
  { id: 5, name: "Mefenamic Acid 500mg", price: 28000, category: "Thuốc giảm đau - Hạ sốt", stock: 60, image: "/images/products/mefenamic.jpg", description: "Giảm đau bụng kinh", details: "Thành phần: Mefenamic Acid 500mg. Giảm đau bụng kinh hiệu quả. Liều dùng: 1-2 viên/lần khi đau.", brand: "USP", origin: "Việt Nam" },
  { id: 6, name: "Naproxen 250mg", price: 32000, originalPrice: 40000, discount: 20, category: "Thuốc giảm đau - Hạ sốt", stock: 45, image: "/images/products/naproxen.jpg", description: "Giảm viêm khớp", details: "Thành phần: Naproxen 250mg. Chống viêm khớp dạng thấp. Liều dùng: 1-2 viên/lần, 2 lần/ngày.", brand: "Stada", origin: "Đức" }
];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    // Tìm sản phẩm theo ID
    const found = MOCK_PRODUCTS.find(p => p.id === parseInt(id));
    if (found) {
      setProduct(found);
    } else {
      // Nếu không tìm thấy, chuyển về shop
      navigate("/shop");
    }
  }, [id, navigate]);

  const handleAddToCart = () => {
    alert(`Đã thêm ${quantity} ${product.name} vào giỏ hàng!`);
    // TODO: Thêm logic lưu vào giỏ hàng sau
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  const increaseQty = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (!product) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="product-detail-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span onClick={() => navigate("/shop")} className="breadcrumb-link">Trang chủ</span>
        <span className="breadcrumb-separator">›</span>
        <span onClick={() => navigate("/shop")} className="breadcrumb-link">{product.category}</span>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-current">{product.name}</span>
      </div>

      <div className="product-detail-content">
        {/* Left: Image Gallery */}
        <div className="product-gallery">
          <div className="main-image">
            <img 
              src={product.image || "https://via.placeholder.com/500x500?text=Thuốc"} 
              alt={product.name}
            />
            {product.discount && (
              <div className="discount-badge">-{product.discount}%</div>
            )}
          </div>
          {/* Thumbnail images (mock - hiện tại chỉ có 1 ảnh) */}
          <div className="thumbnail-list">
            <div className={`thumbnail ${selectedImage === 0 ? "active" : ""}`}>
              <img src={product.image || "https://via.placeholder.com/80x80"} alt="thumb" />
            </div>
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="product-info-section">
          {/* Product Name & Category */}
          <div className="product-header">
            <span className="product-category">{product.category}</span>
            <h1 className="product-name">{product.name}</h1>
            <div className="product-meta">
              <span className="brand">Thương hiệu: <strong>{product.brand || "Đang cập nhật"}</strong></span>
              <span className="separator">|</span>
              <span className="stock">
                Tình trạng: 
                {product.stock > 10 ? (
                  <strong className="in-stock"> Còn hàng</strong>
                ) : product.stock > 0 ? (
                  <strong className="low-stock"> Sắp hết ({product.stock} sản phẩm)</strong>
                ) : (
                  <strong className="out-of-stock"> Hết hàng</strong>
                )}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="price-section">
            <div className="current-price">
              {product.price.toLocaleString()}đ
            </div>
            {product.originalPrice && (
              <div className="original-price">
                {product.originalPrice.toLocaleString()}đ
              </div>
            )}
          </div>

          {/* Short Description */}
          <div className="short-description">
            <p>{product.description}</p>
          </div>

          {/* Quantity Selector */}
          <div className="quantity-section">
            <label>Số lượng:</label>
            <div className="quantity-controls">
              <button className="qty-btn" onClick={decreaseQty} disabled={quantity <= 1}>
                −
              </button>
              <input 
                type="text" 
                className="qty-input" 
                value={quantity} 
                readOnly
              />
              <button className="qty-btn" onClick={increaseQty} disabled={quantity >= product.stock}>
                +
              </button>
            </div>
            <span className="stock-info">{product.stock} sản phẩm có sẵn</span>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              className="btn-add-cart" 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 2L7 8h10l-2-6M7 8l-3 12h16l-3-12M7 8h10" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Thêm vào giỏ
            </button>
            <button 
              className="btn-buy-now" 
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              Mua ngay
            </button>
          </div>

          {/* Additional Info */}
          <div className="additional-info">
            <div className="info-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" strokeWidth="2"/>
                <path d="M12 6V12L16 14" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Giao hàng nhanh 2-4 giờ nội thành</span>
            </div>
            <div className="info-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Cam kết hàng chính hãng 100%</span>
            </div>
            <div className="info-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 11L12 14L22 4M21 12V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Đổi trả trong 7 ngày nếu có lỗi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="product-tabs">
        <div className="tab-header">
          <button className="tab-btn active">Mô tả sản phẩm</button>
          <button className="tab-btn">Thành phần & Liều dùng</button>
          <button className="tab-btn">Đánh giá (0)</button>
        </div>
        <div className="tab-content">
          <div className="description-content">
            <h3>Thông tin chi tiết</h3>
            <p>{product.details}</p>
            <div className="product-specs">
              <div className="spec-row">
                <span className="spec-label">Thương hiệu:</span>
                <span className="spec-value">{product.brand || "Đang cập nhật"}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Xuất xứ:</span>
                <span className="spec-value">{product.origin || "Đang cập nhật"}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Danh mục:</span>
                <span className="spec-value">{product.category}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
