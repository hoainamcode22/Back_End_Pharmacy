import { useState } from "react";
import api, { setAuthToken } from "../api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
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
      if (user.role !== "admin") {
        setMsg("Không phải tài khoản admin");
        return;
      }
      setAuthToken(token);
      login(token, user);
      nav("/admin/dashboard");
    } catch (err) {
      setMsg(err.response?.data?.msg || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="card">
      <h3>Admin Login</h3>
      <form className="form" onSubmit={submit}>
        <input className="input" placeholder="Email" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
        <input className="input" placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
        <button className="btn" type="submit">Đăng nhập Admin</button>
        {msg && <div className="small" style={{marginTop:8}}>{msg}</div>}
      </form>
    </div>
  );
}
