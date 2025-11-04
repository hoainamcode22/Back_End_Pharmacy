// Front_end/src/pages/user/Checkout.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, checkout } from '../../../api';
import './Checkout.css';

const BACKEND_URL = import.meta.env.VITE_API_BASE?.replace('/api', '') || 'http://localhost:5001';

function Checkout() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    note: ''
  });

  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true);
        const data = await getCart();
        const transformedItems = (data.cartItems || []).map(item => ({
          id: item.Id,
          name: item.ProductName,
          price: parseFloat(item.Price),
          quantity: item.Qty,
          image: item.ProductImage ? `${BACKEND_URL}${item.ProductImage}` : `${BACKEND_URL}/images/products/default.jpg`
        }));
        setCartItems(transformedItems);

        if (transformedItems.length === 0) {
          alert('Giỏ hàng trống!');
          navigate('/cart');
        }
      } catch (err) {
        console.error('Error loading cart:', err);
        alert('Không thể tải giỏ hàng.');
        navigate('/cart');
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, [navigate]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = 30000;
  const total = subtotal + shippingFee;

  const handleInputChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateStep1 = () => {
    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.district ||
      !formData.ward
    ) {
      alert('Vui lòng điền đầy đủ các trường thông tin có dấu *');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateStep1()) {
      setStep(1);
      return;
    }

    setIsPlacingOrder(true);

    try {
      const fullAddress = `${formData.address}, ${formData.ward}, ${formData.district}, ${formData.city}`;
      const payload = {
        address: fullAddress,
        phone: formData.phone,
        note: formData.note,
        paymentMethod: paymentMethod
      };

      await checkout(payload);

      alert('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.');
      navigate('/orders');
    } catch (err) {
      console.error('Checkout error:', err);
      alert(err.response?.data?.error || 'Không thể đặt hàng. Vui lòng thử lại.');
      setIsPlacingOrder(false);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Thanh toán</h1>
        <div className="checkout-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <span>Giao hàng</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <span>Thanh toán</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <span>Xác nhận</span>
          </div>
        </div>
      </div>

      <div className="checkout-content">
        <div className="checkout-form">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="form-section">
              <h2>Thông tin giao hàng</h2>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Họ và tên *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Nhập họ và tên"
                  />
                </div>

                <div className="form-group">
                  <label>Số điện thoại *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Nhập email"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Địa chỉ *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Số nhà, tên đường"
                  />
                </div>

                <div className="form-group">
                  <label>Tỉnh/Thành phố *</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  >
                    <option value="">Chọn Tỉnh/Thành phố</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Quận/Huyện *</label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                  >
                    <option value="">Chọn Quận/Huyện</option>
                    <option value="Quận 1">Quận 1</option>
                    <option value="Quận Ba Đình">Quận Ba Đình</option>
                    <option value="Quận Sơn Trà">Quận Sơn Trà</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Phường/Xã *</label>
                  <select
                    name="ward"
                    value={formData.ward}
                    onChange={handleInputChange}
                  >
                    <option value="">Chọn Phường/Xã</option>
                    <option value="Phường Cống Vị">Phường Cống Vị</option>
                    <option value="Phường Bến Nghé">Phường Bến Nghé</option>
                    <option value="Phường An Hải Bắc">Phường An Hải Bắc</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Ghi chú</label>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    placeholder="Ghi chú về đơn hàng (tùy chọn)"
                    rows="3"
                  />
                </div>
              </div>

              <button
                className="btn-next"
                onClick={() => {
                  if (validateStep1()) {
                    setStep(2);
                  }
                }}
              >
                Tiếp tục
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="form-section">
              <h2>Phương thức thanh toán</h2>
              <div className="payment-methods">
                <label
                  className={`payment-option ${
                    paymentMethod === 'cod' ? 'selected' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={e => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-info">
                    <span className="payment-icon">💵</span>
                    <div>
                      <strong>Thanh toán khi nhận hàng (COD)</strong>
                      <p>Thanh toán bằng tiền mặt khi nhận hàng</p>
                    </div>
                  </div>
                </label>

                <label
                  className={`payment-option ${
                    paymentMethod === 'bank' ? 'selected' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="bank"
                    checked={paymentMethod === 'bank'}
                    onChange={e => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-info">
                    <span className="payment-icon">🏦</span>
                    <div>
                      <strong>Chuyển khoản ngân hàng</strong>
                      <p>Chuyển khoản qua Internet Banking hoặc ATM</p>
                    </div>
                  </div>
                </label>

                <label
                  className={`payment-option ${
                    paymentMethod === 'momo' ? 'selected' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="momo"
                    checked={paymentMethod === 'momo'}
                    onChange={e => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-info">
                    <span className="payment-icon">📱</span>
                    <div>
                      <strong>Ví điện tử MoMo</strong>
                      <p>Thanh toán qua ví MoMo</p>
                    </div>
                  </div>
                </label>
              </div>

              <div className="step-actions">
                <button className="btn-back" onClick={() => setStep(1)}>
                  Quay lại
                </button>
                <button className="btn-next" onClick={() => setStep(3)}>
                  Tiếp tục
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="form-section">
              <h2>Xác nhận đơn hàng</h2>

              <div className="confirmation-section">
                <h3>Thông tin giao hàng</h3>
                <div className="info-box">
                  <p><strong>Người nhận:</strong> {formData.fullName}</p>
                  <p><strong>Số điện thoại:</strong> {formData.phone}</p>
                  <p><strong>Email:</strong> {formData.email || 'Không có'}</p>
                  <p>
                    <strong>Địa chỉ:</strong>{' '}
                    {`${formData.address}, ${formData.ward}, ${formData.district}, ${formData.city}`}
                  </p>
                </div>
              </div>

              <div className="confirmation-section">
                <h3>Phương thức thanh toán</h3>
                <div className="info-box">
                  <p>
                    {paymentMethod === 'cod' && '💵 Thanh toán khi nhận hàng (COD)'}
                    {paymentMethod === 'bank' && '🏦 Chuyển khoản ngân hàng'}
                    {paymentMethod === 'momo' && '📱 Ví điện tử MoMo'}
                  </p>
                </div>
              </div>

              <div className="terms">
                <label>
                  <input id="termsCheckbox" type="checkbox" defaultChecked />
                  Tôi đồng ý với{' '}
                  <a href="#">điều khoản và điều kiện</a> của cửa hàng
                </label>
              </div>

              <div className="step-actions">
                <button className="btn-back" onClick={() => setStep(2)}>
                  Quay lại
                </button>
                <button
                  className="btn-place-order"
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                >
                  {isPlacingOrder ? 'Đang đặt hàng...' : 'Đặt hàng'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ORDER SUMMARY */}
        <div className="order-summary">
          <h2>Đơn hàng của bạn</h2>
          <div className="summary-items">
            {cartItems.map(item => (
              <div key={item.id} className="summary-item">
                <img
                  src={item.image}
                  alt={item.name}
                  onError={e => {
                    e.target.src = '/images/products/placeholder.jpg';
                  }}
                />
                <div className="item-info">
                  <p className="item-name">{item.name}</p>
                  <p className="item-qty">Số lượng: {item.quantity}</p>
                </div>
                <p className="item-price">
                  {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                </p>
              </div>
            ))}
          </div>

          <div className="summary-divider"></div>

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
            <span className="total-amount">
              {total.toLocaleString('vi-VN')}đ
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
