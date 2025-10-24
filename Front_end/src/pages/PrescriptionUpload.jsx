import { useState } from "react";
import UserLayout from "../components/UserLayout";
import { useNavigate } from "react-router-dom";

export default function PrescriptionUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const nav = useNavigate();

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(String(ev.target?.result || ""));
    reader.readAsDataURL(f);
  };

  const submit = () => {
    // UI only: lưu vào localStorage danh sách đơn thuốc của tôi
    const id = `rx-${Date.now()}`;
    const entry = { id, image: preview, note, createdAt: new Date().toISOString() };
    try {
      const list = JSON.parse(localStorage.getItem("ph_prescriptions") || "[]");
      list.unshift(entry);
      localStorage.setItem("ph_prescriptions", JSON.stringify(list));
    } catch {}
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); nav(`/prescriptions/${id}`); }, 600);
  };

  return (
    <UserLayout>
      <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Gửi đơn thuốc</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card" style={{ padding: 16 }}>
          <div style={{ fontSize: 13, marginBottom: 8, color: "var(--muted)" }}>Ảnh đơn thuốc</div>
          <label
            htmlFor="p-file"
            style={{
              display: "block",
              border: "1px dashed var(--border)",
              borderRadius: 12,
              background: "#fff",
              padding: 14,
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            {preview ? (
              <img src={preview} alt="preview" style={{ maxWidth: "100%", borderRadius: 10 }} />
            ) : (
              <div style={{ color: "var(--muted)" }}>Nhấn để chọn ảnh (jpg, png)</div>
            )}
          </label>
          <input id="p-file" type="file" accept="image/*" onChange={onFile} style={{ display: "none" }} />
        </div>

        <div className="card" style={{ padding: 16 }}>
          <div style={{ fontSize: 13, marginBottom: 8, color: "var(--muted)" }}>Ghi chú cho dược sĩ</div>
          <textarea
            rows={6}
            className="input"
            style={{ width: "100%", resize: "vertical" }}
            placeholder="Ví dụ: Bé 5 tuổi, nặng 18kg, dị ứng penicillin"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <button
            className="btn"
            style={{ marginTop: 12 }}
            disabled={!file}
            onClick={submit}
          >
            Gửi đơn thuốc
          </button>
          {submitted && (
            <div className="small" style={{ color: "green", marginTop: 8 }}>
              Đã gửi! Dược sĩ sẽ liên hệ tư vấn trong ít phút.
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: 16, padding: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Hướng dẫn</div>
        <ul style={{ paddingLeft: 18, lineHeight: 1.6 }}>
          <li>Chụp rõ ràng toàn bộ đơn thuốc, không bị mờ/lóa.</li>
          <li>Ghi chú thông tin người dùng thuốc (tuổi, cân nặng, dị ứng...).</li>
          <li>Dược sĩ sẽ kiểm tra và gợi ý giỏ hàng phù hợp.</li>
        </ul>
      </div>
    </UserLayout>
  );
}
