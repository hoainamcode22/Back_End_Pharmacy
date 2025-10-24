export default function ContactSection() {
  return (
    <section className="contact card">
      <div className="contact-grid">
        <div>
          <div className="contact-title">Liên hệ hỗ trợ</div>
          <div className="contact-sub">Hỏi về sản phẩm, phản ánh dịch vụ – chúng tôi sẵn sàng hỗ trợ.</div>
        </div>
        <div className="contact-actions">
          <a className="btn ghost" href="tel:18006821">Gọi 1800 6821</a>
          <a className="btn" href="mailto:support@pharmacy.local">Gửi email</a>
        </div>
      </div>
      <div className="contact-more">
        Theo dõi:
        <a href="#" className="link"> Facebook</a> ·
        <a href="#" className="link"> Youtube</a> ·
        <a href="#" className="link"> Zalo</a>
      </div>
    </section>
  );
}
