import Footer from "./Footer.jsx";
import Header from "./Header.jsx";
import FloatingChatButton from "./FloatingChatButton.jsx";

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
