import { Link } from "react-router-dom";

export default function ProductCard({ product, onAdd, label = "Chọn sản phẩm" }) {
  const handleAdd = () => {
    if (typeof onAdd === "function") onAdd(product.id);
  };
  return (
    <div className="card p-card">
      <Link to={`/product/${product.id}`} style={{ flex: 1, textDecoration: "none", color: "inherit" }}>
        <div className="p-thumb">
          {product.image ? (
            <img src={product.image} alt={product.name} />
          ) : (
            <div style={{
              width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
              color: "#9aa4b2", fontSize: 12
            }}>
              150×150
            </div>
          )}
        </div>
        <div className="p-name">{product.name}</div>
        <div className="p-desc">{product.shortDesc}</div>
      </Link>

      <div className="p-foot">
        <div className="p-price">{(product.price || 0).toLocaleString()} đ</div>
        <button className="btn" onClick={handleAdd}>{label}</button>
      </div>
    </div>
  );
}
