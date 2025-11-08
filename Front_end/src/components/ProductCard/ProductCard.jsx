import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../config";
import "./ProductCard.css"; // CSS sẽ được cập nhật ở dưới

export default function ProductCard({ product, onAddToCart }) {
  const nav = useNavigate();

  // GIỮ NGUYÊN LOGIC: Xử lý đường dẫn ảnh
  const getImagePath = (product) => {
    const raw = product.imageUrl || product.ImageUrl || product.image || product.Image || "/images/default.jpg";
    if (typeof raw === 'string' && raw.startsWith('/')) {
      const backendOrigin = API_BASE.replace(/\/api\/?$/i, '');
      return `${backendOrigin}${raw}`;
    }
    return raw;
  };

  // GIỮ NGUYÊN LOGIC: Xử lý sự kiện click
  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (onAddToCart) onAddToCart(product);
  };

  // Lấy thông tin quy cách (ưu tiên shortDesc, fallback về unit)
  const productSpec = product.shortDesc || product.unit;

  return (
    <div
      className="product-card" // Class này sẽ được CSS mới làm đẹp
      onClick={() => nav(`/product/${product.id}`)}
    >
      {/* Cập nhật class wrapper cho ảnh */}
      <div className="product-image-container">
        <img
          src={getImagePath(product)}
          alt={product.name}
          onError={(e) => {
            // GIỮ NGUYÊN LOGIC: Fallback ảnh lỗi
            const backendOrigin = API_BASE.replace(/\/api\/?$/i, '');
            e.target.src = `${backendOrigin}/images/default.jpg`;
          }}
        />
        
        {/* GIỮ NGUYÊN LOGIC: Hiển thị badge */}
        {product.discount && (
          <div className="product-badge">-{product.discount}%</div>
        )}
        {product.stock < 10 && product.stock > 0 && (
          <div className="product-badge stock-low">Sắp hết</div>
        )}
        {product.stock === 0 && (
          <div className="product-badge out-of-stock">Hết hàng</div>
        )}
      </div>

      <div className="product-info">
        {/* THAY ĐỔI GIAO DIỆN: Thêm dòng quy cách (giống An Khang) */}
        {productSpec && (
          <p className="product-spec">{productSpec}</p>
        )}
        
        <h3 className="product-name">{product.name}</h3>

        <div className="product-price-section">
          {/* GIỮ NGUYÊN LOGIC: Hiển thị giá gốc (nếu có) */}
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="original-price">
              {product.originalPrice.toLocaleString('vi-VN')}₫
            </span>
          )}
          {/* THAY ĐỔI GIAO DIỆN: Giá bán (màu đỏ) */}
          <span className="product-price">
            {product.price.toLocaleString('vi-VN')}₫
          </span>
        </div>

        {/* THAY ĐỔI GIAO DIỆN: Đổi text và màu nút */}
        <button
          className="btn-add-cart"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? "Hết hàng" : "Thêm vào giỏ"}
        </button>
      </div>
    </div>
  );
}