import { useState } from "react";
import api, { setAuthToken } from "../api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await api.post("/api/auth/login", form);
      const { token, user } = res.data;
      setAuthToken(token);
      login(token, user);
      setMsg("Đăng nhập thành công");
      nav("/");
    } catch (err) {
      setMsg(err.response?.data?.msg || "Sai email/mật khẩu");
    }
  };

  return (
    <div className="card">
      <h3>Đăng nhập Khách</h3>
      <form className="form" onSubmit={submit}>
        <input className="input" placeholder="Email" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/>
        <input className="input" placeholder="Mật khẩu" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/>
        <button className="btn" type="submit">Đăng nhập</button>
        {msg && <div className="small" style={{marginTop:8}}>{msg}</div>}
      </form>
    </div>
  );
}
