import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await api.post("/api/auth/register", form);
      setMsg(res.data?.msg || "Đăng ký thành công");
      setTimeout(() => nav("/login"), 900);
    } catch (err) {
      setMsg(err.response?.data?.msg || err.message || "Lỗi");
    }
  };

  return (
    <div className="card">
      <h3>Đăng ký Khách hàng</h3>
      <form className="form" onSubmit={submit}>
        <input className="input" placeholder="Họ và tên" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/>
        <input className="input" placeholder="Email" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/>
        <input className="input" placeholder="Mật khẩu" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required minLength={6}/>
        <button className="btn" type="submit">Đăng ký</button>
        {msg && <div className="small" style={{marginTop:8}}>{msg}</div>}
      </form>
    </div>
  );
}
