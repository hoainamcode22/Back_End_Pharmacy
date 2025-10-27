import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Orders.css';

function Orders() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');

  // Mock orders data
  const MOCK_ORDERS = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 245000,
      items: [
        { name: 'Paracetamol 500mg', quantity: 2, price: 15000 },
        { name: 'Vitamin C 1000mg', quantity: 1, price: 85000 },
        { name: 'Khẩu trang y tế 4 lớp', quantity: 3, price: 65000 }
      ]
    },
    {
      id: 'ORD-002',
      date: '2024-01-18',
      status: 'shipping',
      total: 320000,
      items: [
        { name: 'Omega-3 Fish Oil', quantity: 2, price: 150000 },
        { name: 'Máy đo huyết áp', quantity: 1, price: 450000 }
      ]
    },
    {
      id: 'ORD-003',
      date: '2024-01-20',
      status: 'pending',
      total: 125000,
      items: [
        { name: 'Băng cá nhân chống nước', quantity: 5, price: 25000 }
      ]
    },
    {
      id: 'ORD-004',
      date: '2024-01-10',
      status: 'cancelled',
      total: 180000,
      items: [
        { name: 'Thuốc ho Bắc hà', quantity: 3, price: 60000 }
      ]
    }
  ];

  const STATUS_CONFIG = {
    pending: { label: 'Chờ xác nhận', color: '#ffc107', icon: '⏳' },
    confirmed: { label: 'Đã xác nhận', color: '#17a2b8', icon: '✓' },
    shipping: { label: 'Đang giao', color: '#007bff', icon: '🚚' },
    delivered: { label: 'Đã giao', color: '#28a745', icon: '✓' },
    cancelled: { label: 'Đã hủy', color: '#dc3545', icon: '✕' }
  };

  const filteredOrders = activeFilter === 'all' 
    ? MOCK_ORDERS 
    : MOCK_ORDERS.filter(order => order.status === activeFilter);

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>Đơn hàng của tôi</h1>
        <p>Quản lý và theo dõi đơn hàng của bạn</p>
      </div>

      <div className="orders-filters">
        <button 
          className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          Tất cả
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveFilter('pending')}
        >
          Chờ xác nhận
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'shipping' ? 'active' : ''}`}
          onClick={() => setActiveFilter('shipping')}
        >
          Đang giao
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'delivered' ? 'active' : ''}`}
          onClick={() => setActiveFilter('delivered')}
        >
          Đã giao
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'cancelled' ? 'active' : ''}`}
          onClick={() => setActiveFilter('cancelled')}
        >
          Đã hủy
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="orders-empty">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="1" y="3" width="15" height="13"/>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
            <circle cx="5.5" cy="18.5" r="2.5"/>
            <circle cx="18.5" cy="18.5" r="2.5"/>
          </svg>
          <h2>Chưa có đơn hàng</h2>
          <p>Bạn chưa có đơn hàng nào trong danh mục này</p>
          <button className="btn-shop" onClick={() => navigate('/shop')}>
            Tiếp tục mua sắm
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-id-date">
                  <span className="order-id">{order.id}</span>
                  <span className="order-date">{new Date(order.date).toLocaleDateString('vi-VN')}</span>
                </div>
                <span 
                  className="order-status" 
                  style={{ 
                    background: `${STATUS_CONFIG[order.status].color}15`,
                    color: STATUS_CONFIG[order.status].color 
                  }}
                >
                  <span>{STATUS_CONFIG[order.status].icon}</span>
                  {STATUS_CONFIG[order.status].label}
                </span>
              </div>

              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <span className="item-name">
                      {item.name} <span className="item-qty">x{item.quantity}</span>
                    </span>
                    <span className="item-price">
                      {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <span>Tổng cộng:</span>
                  <span className="total-amount">{order.total.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="order-actions">
                  {order.status === 'delivered' && (
                    <button className="btn-review">Đánh giá</button>
                  )}
                  {order.status === 'shipping' && (
                    <button className="btn-track">Theo dõi</button>
                  )}
                  {order.status === 'pending' && (
                    <button className="btn-cancel">Hủy đơn</button>
                  )}
                  <button className="btn-detail">Chi tiết</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
