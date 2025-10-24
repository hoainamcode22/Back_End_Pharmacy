import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductById, addToCart } from "../api";
import UserLayout from "../components/UserLayout";
import CommentsBox from "../components/CommentsBox.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const nav = useNavigate();

  useEffect(() => { fetchProductById(id).then(setP).catch(()=>{}); }, [id]);

  if (!p) return <UserLayout><div>Đang tải...</div></UserLayout>;

  return (
    <UserLayout>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
        <div style={{ background: "#f0f2f5", borderRadius: 16, overflow: "hidden", aspectRatio: "1/1" }}>
          {p.image && <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>}
        </div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>{p.name}</h1>
          <div style={{ fontSize: 18, fontWeight: 800, marginTop: 8 }}>{(p.price || 0).toLocaleString()} đ</div>
          <p style={{ marginTop: 12, color: "#444", whiteSpace: "pre-line" }}>{p.description}</p>
          <button onClick={() => addToCart(p.id, 1)}
                  style={{ marginTop: 16, border: "1px solid #ddd", borderRadius: 10, padding: "10px 16px" }}>
            Thêm vào giỏ
          </button>
          <button
            onClick={() => nav(`/support?type=product&id=${encodeURIComponent(p.id)}&name=${encodeURIComponent(p.name)}&price=${encodeURIComponent(p.price||0)}${p.image?`&image=${encodeURIComponent(p.image)}`:""}`)}
            style={{ marginTop: 10, marginLeft: 8, border: "1px solid #ddd", borderRadius: 10, padding: "10px 16px", background: "#fff" }}
          >
            Hỗ trợ ngay
          </button>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <CommentsBox type="product" id={id} />
      </div>
    </UserLayout>
  );
}
