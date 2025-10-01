import { useState } from "react";
import axios from "axios";

export default function App() {
  const [role, setRole] = useState("guest"); // guest | admin

  return (
    <div style={styles.container}>
      <h1>Pharmacy Registration</h1>

      {/* Toggle chọn role */}
      <div style={styles.toggle}>
        <button
          style={role === "guest" ? styles.activeBtn : styles.btn}
          onClick={() => setRole("guest")}
        >
          Guest Register
        </button>
        <button
          style={role === "admin" ? styles.activeBtn : styles.btn}
          onClick={() => setRole("admin")}
        >
          Admin Register
        </button>
      </div>

      {role === "guest" ? <GuestForm /> : <AdminForm />}
    </div>
  );
}

// Form Guest
function GuestForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ⚡ gọi API backend (chỉnh lại URL cho đúng backend của bạn)
      const res = await axios.post("http://localhost:3000/api/guest/register", form);
      setMessage(res.data.message || "Guest registered successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error registering guest.");
    }
  };

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      <h2>Guest Registration</h2>
      <input
        type="text"
        placeholder="Full Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        style={styles.input}
      />
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        style={styles.input}
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        style={styles.input}
      />
      <button type="submit" style={styles.submit}>Register</button>
      {message && <p>{message}</p>}
    </form>
  );
}

// Form Admin
function AdminForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "", secret: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ⚡ gọi API backend (chỉnh lại URL cho đúng backend của bạn)
      const res = await axios.post("http://localhost:3000/api/admin/register", form);
      setMessage(res.data.message || "Admin registered successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error registering admin.");
    }
  };

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      <h2>Admin Registration</h2>
      <input
        type="text"
        placeholder="Admin Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        style={styles.input}
      />
      <input
        type="email"
        placeholder="Admin Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        style={styles.input}
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        style={styles.input}
      />
      <input
        type="text"
        placeholder="Secret Code"
        value={form.secret}
        onChange={(e) => setForm({ ...form, secret: e.target.value })}
        style={styles.input}
      />
      <button type="submit" style={styles.submit}>Register Admin</button>
      {message && <p>{message}</p>}
    </form>
  );
}

// Styles
const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: "420px",
    margin: "60px auto",
    textAlign: "center",
    background: "linear-gradient(135deg, #ffffff, #f8faff)",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
  },
  toggle: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "25px",
    gap: "12px",
  },
  btn: {
    padding: "10px 24px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    cursor: "pointer",
    background: "#f8f9fa",
    transition: "all 0.3s ease",
    fontWeight: "500",
  },
  activeBtn: {
    padding: "10px 24px",
    border: "1px solid #007bff",
    borderRadius: "8px",
    cursor: "pointer",
    background: "linear-gradient(135deg, #007bff, #0056b3)",
    color: "#fff",
    fontWeight: "600",
    boxShadow: "0 4px 12px rgba(0, 123, 255, 0.3)",
    transition: "all 0.3s ease",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    padding: "20px",
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    background: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "15px",
    transition: "0.3s",
  },
  inputFocus: {
    border: "1px solid #007bff",
    boxShadow: "0 0 6px rgba(0,123,255,0.3)",
  },
  submit: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #28a745, #218838)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(40, 167, 69, 0.3)",
  },
  submitHover: {
    background: "linear-gradient(135deg, #218838, #1e7e34)",
    transform: "translateY(-2px)",
  },
};
