import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../components/AdminLayout.jsx";

function loadThreads() {
  try { const s = JSON.parse(localStorage.getItem("ph_chat") || "{}"); return s.threads || []; } catch { return []; }
}

export default function AdminChat() {
  const [threads, setThreads] = useState(loadThreads());
  const [active, setActive] = useState(threads[0]?.id || null);
  const current = useMemo(() => threads.find(t => t.id === active) || null, [threads, active]);

  useEffect(() => {
    const onStorage = () => setThreads(loadThreads());
    window.addEventListener('storage', onStorage);
    const iv = setInterval(onStorage, 1000);
    return () => { window.removeEventListener('storage', onStorage); clearInterval(iv); };
  }, []);

  return (
    <AdminLayout>
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', height: 'calc(100vh - 120px)', gap: 12 }}>
        <div className="card" style={{ padding: 0, overflow: 'auto' }}>
          {(threads||[]).map(t => (
            <div key={t.id} onClick={()=>setActive(t.id)} style={{ padding: 12, borderBottom: '1px solid var(--border)', cursor:'pointer', background: active===t.id?'#f8fafc':'#fff' }}>
              <div style={{ fontWeight: 700 }}>{t.title || t.id}</div>
              {t.attachment && <div className="small" style={{ color: 'var(--muted)' }}>{t.attachment.type} • {t.attachment.name || t.attachment.id}</div>}
            </div>
          ))}
          {(threads||[]).length===0 && <div className="small" style={{ padding: 12 }}>Chưa có hội thoại.</div>}
        </div>
        <div className="card" style={{ padding: 12, overflow: 'auto' }}>
          {!current ? (
            <div className="small">Chọn một hội thoại để xem.</div>
          ) : (
            <>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>{current.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(current.messages||[]).map(m => (
                  <div key={m.id} style={{ display: 'flex', justifyContent: m.from==='me'?'flex-end':'flex-start' }}>
                    <div style={{ background: m.from==='me'? '#2563eb':'#fff', color: m.from==='me'?'#fff':'#111', border: m.from==='me'?'none':'1px solid var(--border)', padding: '6px 10px', borderRadius: 10 }}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
