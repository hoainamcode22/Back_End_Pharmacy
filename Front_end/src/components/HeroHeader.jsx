export default function HeroHeader({ q, setQ, onSearch }) {
  return (
    <section className="full-bleed hero">
      <div className="hero-inner">
        <div className="hero-top">
          <div className="hero-title">Nhà thuốc trực tuyến</div>
          <div className="hero-sub">Tìm kiếm thuốc, thực phẩm chức năng, chăm sóc cá nhân…</div>
          <div className="hero-search">
            <input
              className="input"
              placeholder="Bạn đang tìm gì hôm nay?"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e)=> e.key === "Enter" && onSearch?.()}
            />
            <button className="btn" onClick={onSearch}>Tìm kiếm</button>
          </div>
        </div>

        <div className="cat-row">
          {[
            "Thuốc", "Tra cứu bệnh", "Bảo vệ sức khỏe", "Mẹ & Bé", "Chăm sóc cá nhân",
            "Thiết bị y tế", "Khuyến mãi HOT", "Góc sức khỏe"
          ].map((c) => (
            <div className="cat" key={c}>{c}</div>
          ))}
        </div>
      </div>
    </section>
  );
}
