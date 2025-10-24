import { useEffect, useState } from "react";

// Local comments store by key `${type}:${id}`
function getKey(type, id) { return `${type}:${id}`; }
function loadComments(type, id) {
  const key = getKey(type, id);
  try { const all = JSON.parse(localStorage.getItem("ph_comments") || "{}"); return all[key] || []; } catch { return []; }
}
function saveComments(type, id, list) {
  const key = getKey(type, id);
  try {
    const all = JSON.parse(localStorage.getItem("ph_comments") || "{}");
    all[key] = list;
    localStorage.setItem("ph_comments", JSON.stringify(all));
  } catch {}
}

export default function CommentsBox({ type, id }) {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => { setItems(loadComments(type, id)); }, [type, id]);
  const add = () => {
    if (!text.trim()) return;
    const next = [...items, { id: Date.now(), user: "Khách", text: text.trim(), at: new Date().toISOString() }];
    setItems(next); saveComments(type, id, next); setText("");
  };

  return (
    <div className="card" style={{ padding: 12 }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Bình luận</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((c) => (
          <div key={c.id} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: 8, background: '#fff' }}>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>{c.user} • {new Date(c.at).toLocaleString()}</div>
            <div style={{ marginTop: 4 }}>{c.text}</div>
          </div>
        ))}
        {items.length === 0 && <div className="small">Chưa có bình luận.</div>}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <input className="input" placeholder="Viết bình luận..." value={text} onChange={(e)=>setText(e.target.value)} style={{ flex: 1 }} />
        <button className="btn" onClick={add}>Gửi</button>
      </div>
    </div>
  );
}
