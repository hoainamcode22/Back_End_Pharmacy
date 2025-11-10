// ProductPickerModal - Chọn sản phẩm để gửi trong chat
import React, { useState, useEffect } from 'react';
import api from '../../api';
import './ProductPickerModal.css';

const ProductPickerModal = ({ isOpen, onClose, onSelectProduct }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (isOpen) {
      loadProducts();
    }
  }, [isOpen]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const handleSelectProduct = (product) => {
    onSelectProduct(product);
    onClose();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <div className="product-picker-overlay" onClick={onClose}>
      <div className="product-picker-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🔍 Chọn sản phẩm</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-filters">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="all">Tất cả danh mục</option>
            <option value="thuoc">Thuốc</option>
            <option value="vitamin">Vitamin</option>
            <option value="cham-soc">Chăm sóc</option>
            <option value="thiet-bi">Thiết bị y tế</option>
          </select>
        </div>

        <div className="products-grid">
          {loading ? (
            <div className="loading">Đang tải...</div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="product-item"
                onClick={() => handleSelectProduct(product)}
              >
                <div className="product-image">
                  <img 
                    src={`http://localhost:5001/images/products/${product.image}`}
                    alt={product.name}
                    onError={(e) => e.target.src = 'https://via.placeholder.com/100?text=No+Image'}
                  />
                </div>
                <div className="product-details">
                  <h4>{product.name}</h4>
                  <p className="price">{formatPrice(product.price)}</p>
                  <span className="category-badge">{product.category}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-products">Không tìm thấy sản phẩm</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPickerModal;
