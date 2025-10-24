export default function OrderStatusBadge({ status }) {
  const map = {
    pending: { text: "Chờ xác nhận", color: "#f59e0b", bg: "#fef3c7" },
    confirmed: { text: "Đã xác nhận", color: "#2563eb", bg: "#dbeafe" },
    shipping: { text: "Đang giao", color: "#0ea5e9", bg: "#e0f2fe" },
    completed: { text: "Hoàn tất", color: "#10b981", bg: "#d1fae5" },
    canceled: { text: "Đã hủy", color: "#ef4444", bg: "#fee2e2" },
  };
  const s = map[String(status || "").toLowerCase()] || map.pending;
  return (
    <span style={{
      fontSize: 12,
      padding: "4px 8px",
      borderRadius: 999,
      color: s.color,
      background: s.bg,
      border: `1px solid ${s.color}22`
    }}>
      {s.text}
    </span>
  );
}
