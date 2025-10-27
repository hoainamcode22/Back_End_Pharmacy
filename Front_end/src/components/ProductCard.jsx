import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

export default function ProductCard({ product, onAddToCart }) {
  const nav = useNavigate();

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
          src={product.image || "https://via.placeholder.com/300x300?text=Thuốc"} 
          alt={product.name}
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
          {product.originalPrice && (
            <span className="original-price">
              {product.originalPrice.toLocaleString()}đ
            </span>
          )}
          <span className="current-price">
            {product.price.toLocaleString()} đ/{product.unit || "Chai"}
          </span>
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
