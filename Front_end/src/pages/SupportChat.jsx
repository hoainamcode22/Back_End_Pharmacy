import { useEffect, useMemo, useRef, useState } from "react";
import UserLayout from "../components/UserLayout";
import { useSearchParams } from "react-router-dom";
import { useChat } from "../context/ChatContext.jsx";

export default function SupportChat() {
  const [text, setText] = useState("");
  const boxRef = useRef(null);
  const [sp] = useSearchParams();
  const { current, prefillAndOpen, send } = useChat();

  // if navigated with query like ?type=product&id=123&name=ABC&price=10000&image=url
  useEffect(() => {
    const type = sp.get("type");
    const id = sp.get("id");
    if (type && id) {
      prefillAndOpen({
        type,
        id,
        name: sp.get("name") || undefined,
        price: sp.get("price") ? Number(sp.get("price")) : undefined,
        image: sp.get("image") || undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const msgs = useMemo(() => current?.messages || [{ id: 1, from: 'bot', text: 'Xin chào! Bạn cần hỗ trợ gì ạ?' }], [current]);

  useEffect(() => {
    const el = boxRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs]);

  return (
    <UserLayout>
      <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Hỗ trợ trực tuyến</h1>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {current?.attachment && (
          <div style={{ display: "flex", gap: 10, alignItems: "center", padding: 12, borderBottom: "1px solid var(--border)", background: "#fff" }}>
            <div style={{ width: 52, height: 52, background: "#eef2ff", borderRadius: 10, overflow: "hidden" }}>
              {current.attachment.image && (
                <img src={current.attachment.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700 }}>{current.title}</div>
              {current.attachment.price != null && (
                <div className="small">{Number(current.attachment.price).toLocaleString()} đ</div>
              )}
            </div>
            <span className="small" style={{ color: "var(--muted)" }}>Đính kèm</span>
          </div>
        )}
        <div
          ref={boxRef}
          style={{
            height: 420,
            overflow: "auto",
            padding: 16,
            background: "#f8fafc",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {msgs.map((m) => (
            <div
              key={m.id}
              style={{
                display: "flex",
                justifyContent: m.from === "me" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  background: m.from === "me" ? "#2563eb" : "#fff",
                  color: m.from === "me" ? "#fff" : "#111",
                  border: m.from === "me" ? "none" : "1px solid var(--border)",
                  padding: "8px 12px",
                  borderRadius: 12,
                  maxWidth: "76%",
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px solid var(--border)" }}>
          <input
            className="input"
            placeholder="Nhập tin nhắn..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && text.trim() && send(text.trim()) && setText("")}
            style={{ flex: 1 }}
          />
          <button className="btn" onClick={() => { if (text.trim()) { send(text.trim()); setText(""); }}}>Gửi</button>
        </div>
      </div>
    </UserLayout>
  );
}
