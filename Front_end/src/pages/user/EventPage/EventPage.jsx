import React from 'react';
import { Link } from 'react-router-dom';
import './EventPage.css'; 

export default function EventPage() {
  return (
    <div className="event-page-container">
      <div className="event-content">
        <h1>🎉 Sự Kiện Sắp Ra Mắt!</h1>
        <p>Trang này đang được phát triển.</p>
        <p>Chúng tôi sẽ sớm cập nhật các ưu đãi và voucher hấp dẫn tại đây. Vui lòng quay lại sau!</p>
        <Link to="/shop" className="back-to-shop-btn">
          Quay lại Cửa hàng
        </Link>
      </div>
    </div>
  );
}