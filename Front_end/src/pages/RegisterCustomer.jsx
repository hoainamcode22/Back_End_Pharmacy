import { useState } from "react";
import axios from "axios";

export default function RegisterCustomer() {
  const [form, setForm] = useState({username:"", email:"", password:"", phone:"", address:""});
  
  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post("http://localhost:8000/api/register/customer/", form);
    alert("Đăng ký khách hàng thành công!");
  };

  return (
    <div className="max-w-md mx-auto p-4 shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Đăng ký Khách hàng</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="username" onChange={handleChange} placeholder="Tên đăng nhập" className="w-full border p-2 rounded"/>
        <input name="email" onChange={handleChange} placeholder="Email" type="email" className="w-full border p-2 rounded"/>
        <input name="password" onChange={handleChange} placeholder="Mật khẩu" type="password" className="w-full border p-2 rounded"/>
        <input name="phone" onChange={handleChange} placeholder="SĐT" className="w-full border p-2 rounded"/>
        <input name="address" onChange={handleChange} placeholder="Địa chỉ" className="w-full border p-2 rounded"/>
        <button className="bg-blue-500 text-white w-full py-2 rounded">Đăng ký</button>
      </form>
    </div>
  );
}