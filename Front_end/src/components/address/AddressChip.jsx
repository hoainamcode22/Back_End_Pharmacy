import { useEffect, useState } from "react";

export default function AddressChip() {
  const [addr, setAddr] = useState("");

  useEffect(() => {
    try { setAddr(localStorage.getItem("ph_addr") || ""); } catch (e) { /* ignore */ }
  }, []);

  const choose = () => {
    // đơn giản: dùng prompt; phần BE/địa chỉ chi tiết sẽ làm sau
    const v = window.prompt("Nhập địa chỉ nhận hàng", addr || "");
    if (v !== null) {
      setAddr(v);
      try { localStorage.setItem("ph_addr", v); } catch (e) { /* ignore */ }
    }
  };

  return (
    <button
      className="addr-chip"
      onClick={choose}
      title="Chọn địa chỉ nhận hàng"
    >
      <span className="addr-ico">📍</span>
      <span className="addr-text">{addr ? addr : "Thêm địa chỉ"}</span>
    </button>
  );
}
