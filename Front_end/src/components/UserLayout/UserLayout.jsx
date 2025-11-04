import Footer from "../Footer/Footer.jsx";
import Header from "../Header/Header.jsx";
import FloatingChatButton from "../FloatingChatButton/FloatingChatButton.jsx";

export default function UserLayout({ children }) {
  return (
    <div className="page">
      <Header />
      <main className="container page-section">{children}</main>
      <Footer />
      <FloatingChatButton />
    </div>
  );
}
