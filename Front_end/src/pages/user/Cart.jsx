import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

function Cart() {
  const navigate = useNavigate();

  // Mock cart data
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Paracetamol 500mg',
      price: 15000,
      quantity: 2,
      image: '/images/products/paracetamol.jpg',
      stock: 100
    },
    {
      id: 5,
      name: 'Vitamin C 1000mg',
      price: 85000,
      quantity: 1,
      image: '/images/products/vitamin-c.jpg',
      stock: 50
    },
    {
      id: 12,
      name: 'Khẩu trang y tế 4 lớp',
      price: 65000,
      quantity: 3,
      image: '/images/products/mask.jpg',
      stock: 200
    }
  ]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        if (newQuantity > item.stock) {
          alert(`Chỉ còn ${item.stock} sản phẩm trong kho`);
          return item;
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      setCartItems(cartItems.filter(item => item.id !== id));
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const shippingFee = 30000;
  const subtotal = calculateSubtotal();
  const total = subtotal + shippingFee;

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-empty">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <h2>Giỏ hàng trống</h2>
          <p>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
          <button className="btn-continue-shopping" onClick={() => navigate('/shop')}>
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Giỏ hàng của bạn</h1>
        <span className="cart-count">{cartItems.length} sản phẩm</span>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <img 
                src={item.image} 
                alt={item.name} 
                className="cart-item-image"
                onError={(e) => e.target.src = '/images/products/placeholder.jpg'}
              />
              
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p className="cart-item-price">{item.price.toLocaleString('vi-VN')}đ</p>
                <p className="cart-item-stock">Còn {item.stock} sản phẩm</p>
              </div>

              <div className="cart-item-actions">
                <div className="quantity-controls">
                  <button 
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </button>
                  
                  <input 
                    type="number" 
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                    className="qty-input"
                    min="1"
                    max={item.stock}
                  />
                  
                  <button 
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19"/>
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </button>
                </div>

                <p className="item-total">
                  {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                </p>

                <button 
                  className="remove-btn"
                  onClick={() => removeItem(item.id)}
                  title="Xóa sản phẩm"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    <line x1="10" y1="11" x2="10" y2="17"/>
                    <line x1="14" y1="11" x2="14" y2="17"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Tổng đơn hàng</h2>
          
          <div className="summary-row">
            <span>Tạm tính</span>
            <span>{subtotal.toLocaleString('vi-VN')}đ</span>
          </div>
          
          <div className="summary-row">
            <span>Phí vận chuyển</span>
            <span>{shippingFee.toLocaleString('vi-VN')}đ</span>
          </div>
          
          <div className="summary-divider"></div>
          
          <div className="summary-row total">
            <span>Tổng cộng</span>
            <span className="total-amount">{total.toLocaleString('vi-VN')}đ</span>
          </div>

          <button 
            className="btn-checkout"
            onClick={() => navigate('/checkout')}
          >
            Tiến hành thanh toán
          </button>

          <button 
            className="btn-continue"
            onClick={() => navigate('/shop')}
          >
            Tiếp tục mua sắm
          </button>

          <div className="payment-methods">
            <p>Chúng tôi chấp nhận</p>
            <div className="payment-icons">
              <span>💳</span>
              <span>🏦</span>
              <span>📱</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
