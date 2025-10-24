import Footer from "./Footer.jsx";
import Header from "./Header.jsx";

export default function UserLayout({ children }) {
  return (
    <div className="page">
      <Header />
      <main className="container page-section">{children}</main>
      <Footer />
    </div>
  );
}
