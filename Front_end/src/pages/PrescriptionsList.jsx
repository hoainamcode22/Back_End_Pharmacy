import { useEffect, useState } from "react";
import UserLayout from "../components/UserLayout";
import { Link } from "react-router-dom";

function loadMine() {
  try { return JSON.parse(localStorage.getItem("ph_prescriptions") || "[]"); } catch { return []; }
}

export default function PrescriptionsList() {
  const [items, setItems] = useState([]);
  useEffect(() => { setItems(loadMine()); }, []);

  return (
    <UserLayout>
      <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Đơn thuốc của bạn</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 12 }}>
        {items.map(p => (
          <Link to={`/prescriptions/${p.id}`} className="card" key={p.id} style={{ textDecoration: 'none', color: 'inherit', padding: 12 }}>
            <div style={{ width: '100%', aspectRatio: '4/3', background: '#eef2ff', borderRadius: 10, overflow: 'hidden' }}>
              {p.image && <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
            </div>
            <div style={{ fontWeight: 700, marginTop: 8 }}>Đơn #{p.id.slice(-6)}</div>
            <div className="small" style={{ color: 'var(--muted)' }}>{new Date(p.createdAt).toLocaleString()}</div>
            {p.note && <div className="small" style={{ marginTop: 4 }}>{p.note}</div>}
          </Link>
        ))}
      </div>
      {items.length === 0 && <div>Chưa có đơn thuốc. Hãy <Link to="/prescriptions/upload" className="link">tải lên đơn thuốc</Link>.</div>}
    </UserLayout>
  );
}
