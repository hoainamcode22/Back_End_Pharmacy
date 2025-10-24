import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchProducts, addToCart } from "../api";
import UserLayout from "../components/UserLayout";
import ProductCard from "../components/ProductCard";
import HeroHeader from "../components/HeroHeader";
import ContactSection from "../components/ContactSection";
import ProductRow from "../components/ProductRow.jsx";
import ProductShelf from "../components/ProductShelf.jsx";

const base = [
  { id: "d1", name: "Paracetamol 500mg", shortDesc: "Hạ sốt, giảm đau", price: 15000 },
  { id: "d2", name: "Vitamin C 1000", shortDesc: "Tăng đề kháng", price: 65000 },
  { id: "d3", name: "Men tiêu hóa", shortDesc: "Hỗ trợ đường ruột", price: 49000 },
  { id: "d4", name: "Siro ho trẻ em", shortDesc: "Giảm ho, dịu họng", price: 42000 },
  { id: "d5", name: "Oral Rehydration", shortDesc: "Bù nước điện giải", price: 22000 },
  { id: "d6", name: "Xịt mũi Sterimar", shortDesc: "Làm sạch mũi", price: 120000 },
  { id: "d7", name: "Elevit bầu", shortDesc: "Bổ sung vitamin", price: 274000 },
  { id: "d8", name: "Ensure Gold", shortDesc: "Sữa dinh dưỡng", price: 845000 },
  { id: "d9", name: "Miếng dán hạ sốt", shortDesc: "Giảm nhiệt nhanh", price: 47000 },
  { id: "d10", name: "Que thử thai Quickstick", shortDesc: "Phát hiện nhanh", price: 22000 },
];
const demoItems = Array.from({ length: 60 }).map((_, i) => {
  const b = base[i % base.length];
  const cats = ["top", "vitamin", "collagen", "thiet-bi", "cham-soc", "thuoc"]; // mock tags
  return {
    ...b,
    id: `seed-${i + 1}`,
    category: cats[i % cats.length],
  };
});

export default function Shop() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchProducts({ keyword: q, category, limit: 60 });
      const items = Array.isArray(res?.items) ? res.items : Array.isArray(res) ? res : [];
      setData({ items, total: res?.total || items.length });
    } catch {
      // Chưa có BE → dùng demo để nhìn UI
      const filtered = demoItems.filter(i => i.name.toLowerCase().includes(q.toLowerCase()));
      setData({ items: filtered, total: filtered.length });
    } finally {
      setLoading(false);
    }
  }, [q, category]);

  useEffect(() => { load(); }, [load]);

  const onAdd = async (id) => { try { await addToCart(id, 1); } catch (e) { /* no-op demo */ } };

  const itemsFiltered = useMemo(() => data.items, [data.items]);

  return (
    <UserLayout>
      {/* Header full-width tham khảo Pharmacity */}
      <HeroHeader q={q} setQ={setQ} onSearch={load} />

      {/* Bộ lọc đơn giản dưới hero */}
      <div className="container" style={{ marginTop: 14 }}>
        <div className="filter-bar card" style={{ padding: 12, display: "flex", gap: 10, alignItems: "center" }}>
          <div className="small" style={{ minWidth: 90, color: "var(--muted)" }}>Danh mục</div>
          <select className="select" value={category} onChange={(e)=>setCategory(e.target.value)}>
            <option value="">Tất cả</option>
            <option value="thuoc">Thuốc</option>
            <option value="vitamin">Vitamin</option>
            <option value="collagen">Collagen</option>
            <option value="cham-soc">Chăm sóc cá nhân</option>
            <option value="thiet-bi">Thiết bị y tế</option>
          </select>
          <button className="btn ghost" onClick={()=>{ setCategory(""); setQ(""); load(); }}>Xóa lọc</button>
        </div>
      </div>

      {/* Hàng ngang gọn gàng: 5 card/row, không scroll để bố cục sạch hơn */}
      {loading ? (
        <div className="container" style={{ marginTop: 16 }}>Đang tải...</div>
      ) : (
        <div className="container" style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {q && (
            <ProductShelf title={`Kết quả cho "${q}"`} items={itemsFiltered} onAdd={onAdd} />
          )}
          {!q && (
            <>
              <ProductShelf title="Top bán chạy toàn quốc" items={itemsFiltered.filter(i=>i.category==='top').slice(0,20)} onAdd={onAdd} />
              <ProductShelf title="Collagen hàng chuẩn giá tốt" items={itemsFiltered.filter(i=>i.category==='collagen').slice(0,20)} onAdd={onAdd} />
              <ProductShelf title="Vitamin nổi bật" items={itemsFiltered.filter(i=>i.category==='vitamin').slice(0,20)} onAdd={onAdd} />
              <ProductShelf title="Thiết bị y tế" items={itemsFiltered.filter(i=>i.category==='thiet-bi').slice(0,20)} onAdd={onAdd} />
              <ProductShelf title="Chăm sóc cá nhân" items={itemsFiltered.filter(i=>i.category==='cham-soc').slice(0,20)} onAdd={onAdd} />
              <ProductShelf title="Thuốc" items={itemsFiltered.filter(i=>i.category==='thuoc').slice(0,20)} onAdd={onAdd} />
            </>
          )}
          {!itemsFiltered.length && <div>Không tìm thấy sản phẩm.</div>}
        </div>
      )}

      {/* Contact */}
      <div className="container" style={{ marginTop: 22, marginBottom: 30 }}>
        <ContactSection />
      </div>
    </UserLayout>
  );
}
