// SỬA: Thêm useContext
import React, { useEffect, useContext } from 'react'; 
import { Link, useSearchParams } from 'react-router-dom';
import './CheckoutSuccess.css';

// SỬA: Import AuthContext (dựa theo README.md)
// Giả định file này nằm ở: src/pages/user/Checkout/CheckoutSuccess.jsx
// Đường dẫn đến context sẽ là:
import { AuthContext } from '../../../context/AuthContext/AuthContext'; 

function CheckoutSuccess() {
  const [searchParams] = useSearchParams();

  // SỬA: Lấy hàm cập nhật giỏ hàng từ AuthContext
  // LƯU Ý: Tôi đoán tên hàm là "setCartCount". 
  // Hãy thay "setCartCount" bằng ĐÚNG tên hàm trong AuthContext của bạn
  // (Ví dụ: "updateCartCount", "clearCartBadge", v.v.)
  const { setCartCount } = useContext(AuthContext); 

  // Đọc các tham số MoMo trả về (để kiểm tra)
  const resultCode = searchParams.get('resultCode');
  const message = searchParams.get('message');
  const orderId = searchParams.get('orderId'); // Đây là orderId của MoMo

  const isSuccess = resultCode === '0';

  // Xóa giỏ hàng (nếu thành công)
  useEffect(() => {
    if (isSuccess) {
      
      // SỬA: Không dispatch event (vì nó gây ra race condition)
      // window.dispatchEvent(new Event('cart:updated')); 
      
      // SỬA: Gọi trực tiếp hàm từ Context để set badge về 0
      if (typeof setCartCount === 'function') {
        console.log("Thanh toán thành công, cập nhật badge giỏ hàng về 0.");
        setCartCount(0); // Cập nhật badge về 0
      }
    }
    // SỬA: Thêm dependency
  }, [isSuccess, setCartCount]); 

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