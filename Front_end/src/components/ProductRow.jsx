import { useRef } from "react";
import ProductCard from "./ProductCard";

export default function ProductRow({ title, items = [], onAdd, viewMoreHref = "#" }) {
  const ref = useRef(null);
  const scrollBy = (dir) => {
    const el = ref.current; if (!el) return;
    const dx = Math.round(el.clientWidth * 0.9) * (dir > 0 ? 1 : -1);
    el.scrollBy({ left: dx, behavior: "smooth" });
  };

  return (
    <section className="row-section card">
      <div className="row-head">
        <div className="row-title">{title}</div>
        <a className="row-more" href={viewMoreHref}>Xem thêm</a>
      </div>
      <div className="row-body">
        <button className="arrow left" onClick={() => scrollBy(-1)} aria-label="prev">‹</button>
        <div className="h-scroll" ref={ref}>
          {items.map((p) => (
            <div className="h-item" key={p.id}>
              <ProductCard product={p} onAdd={onAdd} label="Chọn sản phẩm" />
            </div>
          ))}
        </div>
        <button className="arrow right" onClick={() => scrollBy(1)} aria-label="next">›</button>
      </div>
    </section>
  );
}
