import { useCart } from "../context/CartContext";
import "./Shop.css"; // Sử dụng lại một số style từ Shop.css

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();

  const totalPrice = cart.reduce(
    (total, item) => total + item.medicine_price * item.quantity,
    0
  );

  return (
    <div className="cart-container">
      <h1>Giỏ hàng của bạn</h1>
      {cart.length === 0 ? (
        <p>Chưa có sản phẩm nào trong giỏ hàng.</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.Id} className="cart-item">
                <div className="cart-item-info">
                  <h4>{item.medicine_name}</h4>
                  <p>
                    {item.quantity} x{" "}
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.medicine_price)}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.Id)}
                  className="btn-remove"
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>
              Tổng cộng:{" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(totalPrice)}
            </h3>
            <div className="cart-actions">
              <button className="btn-checkout">Thanh toán</button>
              <button onClick={clearCart} className="btn-clear-cart">
                Xóa hết
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}