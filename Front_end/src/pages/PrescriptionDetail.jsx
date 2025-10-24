import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserLayout from "../components/UserLayout";
import CommentsBox from "../components/CommentsBox.jsx";

function loadById(id) {
  try { const all = JSON.parse(localStorage.getItem("ph_prescriptions") || "[]"); return all.find(x => x.id === id) || null; } catch { return null; }
}

export default function PrescriptionDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const nav = useNavigate();

  useEffect(() => { setItem(loadById(id)); }, [id]);
  const title = useMemo(() => item ? `Đơn thuốc #${item.id.slice(-6)}` : "Đơn thuốc", [item]);

  if (!item) return <UserLayout><div>Không tìm thấy đơn thuốc.</div></UserLayout>;

  return (
    <UserLayout>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
        <div style={{ background: '#fff' }} className="card">
          <div style={{ width: '100%', aspectRatio: '4/3', background: '#eef2ff', borderRadius: 12, overflow: 'hidden' }}>
            {item.image && <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
          </div>
          <div style={{ marginTop: 10 }}>
            <div style={{ fontWeight: 800 }}>{title}</div>
            <div className="small" style={{ color: 'var(--muted)' }}>{new Date(item.createdAt).toLocaleString()}</div>
            {item.note && <div style={{ marginTop: 6 }}>{item.note}</div>}
          </div>
          <button
            onClick={() => nav(`/support?type=prescription&id=${encodeURIComponent(item.id)}&name=${encodeURIComponent(title)}${item.image?`&image=${encodeURIComponent(item.image)}`:""}`)}
            style={{ marginTop: 10, border: '1px solid #ddd', borderRadius: 10, padding: '10px 16px', background: '#fff' }}
          >
            Hỗ trợ ngay
          </button>
        </div>

        <CommentsBox type="prescription" id={id} />
      </div>
    </UserLayout>
  );
}
