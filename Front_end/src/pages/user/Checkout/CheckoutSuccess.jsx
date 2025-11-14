import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './CheckoutSuccess.css';

function CheckoutSuccess() {
  const [searchParams] = useSearchParams();

  // Đọc các tham số MoMo trả về (để kiểm tra)
  const resultCode = searchParams.get('resultCode');
  const message = searchParams.get('message');
  const orderId = searchParams.get('orderId'); // Đây là orderId của MoMo

  const isSuccess = resultCode === '0';

  // Xóa giỏ hàng (nếu thành công)
  // Mặc dù backend đã xóa, chúng ta cũng nên dispatch event để header cập nhật
  useEffect(() => {
    if (isSuccess) {
      window.dispatchEvent(new Event('cart:updated')); // Cập nhật icon giỏ hàng
    }
  }, [isSuccess]);

  return (
    <div className="checkout-success-container">
      <div className="success-card">
        {isSuccess ? (
          <>
            <div className="success-icon success">✓</div>
            <h1>Thanh toán thành công!</h1>
            <p>Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.</p>
            <p>Mã giao dịch MoMo: {orderId}</p>
          </>
        ) : (
          <>
            <div className="success-icon fail">✕</div>
            <h1>Thanh toán thất bại</h1>
            <p>Đã có lỗi xảy ra trong quá trình thanh toán.</p>
            <p>Thông báo từ MoMo: {message || 'Không có thông báo'}</p>
          </>
        )}
        
        <div className="success-actions">
          <Link to="/orders" className="btn-primary">
            Xem lịch sử đơn hàng
          </Link>
          <Link to="/shop" className="btn-secondary">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CheckoutSuccess;