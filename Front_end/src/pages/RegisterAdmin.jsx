import { useState } from "react";
import axios from "axios";

export default function RegisterAdmin() {
  const [form, setForm] = useState({username:"", email:"", password:""});
  
  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post("http://localhost:8000/api/register/admin/", form);
    alert("Tạo Admin thành công!");
  };

  return (
    <div className="max-w-md mx-auto p-4 shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Đăng ký Admin</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="username" onChange={handleChange} placeholder="Tên đăng nhập" className="w-full border p-2 rounded"/>
        <input name="email" onChange={handleChange} placeholder="Email" type="email" className="w-full border p-2 rounded"/>
        <input name="password" onChange={handleChange} placeholder="Mật khẩu" type="password" className="w-full border p-2 rounded"/>
        <button className="bg-red-500 text-white w-full py-2 rounded">Tạo Admin</button>
      </form>
    </div>
  );
}