// ProductCard Component - Hiển thị sản phẩm trong chat
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatProductCard.css';

const ChatProductCard = ({ product, isInMessage = true }) => {
  const navigate = useNavigate();

  if (!product) return null;

  const handleClick = () => {
    navigate(`/product/${product.ProductId || product.Id}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const imageUrl = product.ProductImage || product.Image 
    ? `http://localhost:5001/images/products/${product.ProductImage || product.Image}`
    : 'https://via.placeholder.com/80x80?text=No+Image';

  return (
    <div className={`chat-product-card ${isInMessage ? 'in-message' : ''}`} onClick={handleClick}>
      <div className="product-image-wrapper">
        <img 
          src={imageUrl}
          alt={product.ProductName || product.Name}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
          }}
        />
      </div>
      <div className="product-info">
        <h4 className="product-name">{product.ProductName || product.Name}</h4>
        <p className="product-price">{formatPrice(product.ProductPrice || product.Price)}</p>
        <button className="view-product-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 5l7 7-7 7"/>
          </svg>
          Xem sản phẩm
        </button>
      </div>
    </div>
  );
};

export default ChatProductCard;
