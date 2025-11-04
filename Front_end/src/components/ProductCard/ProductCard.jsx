import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../config";
import "./ProductCard.css";

export default function ProductCard({ product, onAddToCart }) {
  const nav = useNavigate();

  // Process image path: prefer absolute imageUrl from backend, then fallbacks
  const getImagePath = (product) => {
    const raw = product.imageUrl || product.ImageUrl || product.image || product.Image || "/images/default.jpg";

    // If backend returned a relative path (starts with '/'), prefix backend origin
    if (typeof raw === 'string' && raw.startsWith('/')) {
      // API_BASE is like http://localhost:5001/api -> remove /api
      const backendOrigin = API_BASE.replace(/\/api\/?$/i, '');
      return `${backendOrigin}${raw}`;
    }

    return raw;
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (onAddToCart) onAddToCart(product);
  };

  return (
    <div
      className="product-card"
      onClick={() => nav(`/product/${product.id}`)}
    >
      <div className="product-image">
        <img
          src={getImagePath(product)}
          alt={product.name}
          onError={(e) => {
            // fallback to backend-hosted default image to avoid external DNS failures
            const backendOrigin = API_BASE.replace(/\/api\/?$/i, '');
            e.target.src = `${backendOrigin}/images/default.jpg`;
          }}
        />
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
        <h3 className="product-name">{product.name}</h3>

        <div className="product-price-section">
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="original-price">
              {product.originalPrice.toLocaleString('vi-VN')}₫
            </span>
          )}
          <div className="current-price">
            <span className="price-value">{product.price.toLocaleString('vi-VN')}</span>
            <span className="price-unit">₫/{product.unit || "Hộp"}</span>
          </div>
        </div>

        <button
          className="btn-add-cart"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? "Hết hàng" : "Chọn sản phẩm"}
        </button>
      </div>
    </div>
  );
}
