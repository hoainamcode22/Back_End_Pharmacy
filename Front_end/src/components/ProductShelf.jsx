import ProductCard from "./ProductCard";

export default function ProductShelf({ title, items = [], onAdd, viewMoreHref = "#" }) {
  const take = items.slice(0, 5);
  return (
    <section className="shelf-section card">
      <div className="shelf-head">
        <div className="shelf-title">{title}</div>
        <a className="shelf-more" href={viewMoreHref}>Xem thêm</a>
      </div>
      <div className="shelf-grid">
        {take.map((p) => (
          <div className="shelf-item" key={p.id}>
            <ProductCard product={p} onAdd={onAdd} label="Chọn sản phẩm" />
          </div>
        ))}
      </div>
    </section>
  );
}
