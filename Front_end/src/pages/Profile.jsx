import { useEffect, useState } from "react";
import { getMe, updateMe } from "../api";
import UserLayout from "../components/UserLayout";

export default function Profile() {
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getMe().then((me) => setForm({
      name: me?.name || "", phone: me?.phone || "", address: me?.address || ""
    })).catch(()=>{});
  }, []);

  const save = async () => {
    await updateMe(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };

  return (
    <UserLayout>
      <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Hồ sơ</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 560 }}>
        <label>
          <div style={{ fontSize: 13, marginBottom: 6 }}>Họ tên</div>
          <input value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})}
                 style={{ width: "100%", border: "1px solid #ddd", borderRadius: 10, padding: 10 }}/>
        </label>
        <label>
          <div style={{ fontSize: 13, marginBottom: 6 }}>Số điện thoại</div>
          <input value={form.phone} onChange={(e)=>setForm({...form, phone: e.target.value})}
                 style={{ width: "100%", border: "1px solid #ddd", borderRadius: 10, padding: 10 }}/>
        </label>
        <label>
          <div style={{ fontSize: 13, marginBottom: 6 }}>Địa chỉ</div>
          <textarea rows={3} value={form.address} onChange={(e)=>setForm({...form, address: e.target.value})}
                    style={{ width: "100%", border: "1px solid #ddd", borderRadius: 10, padding: 10 }}/>
        </label>
        <button onClick={save} style={{ border: "1px solid #ddd", borderRadius: 10, padding: "10px 16px" }}>
          Lưu
        </button>
        {saved && <div style={{ color: "green", fontSize: 13 }}>Đã lưu!</div>}
      </div>
    </UserLayout>
  );
}
