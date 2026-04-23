import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--tape-bg-deepest)" }}
    >
      <Header />
      <main className="flex-1 w-full">
        <div className="max-w-6xl mx-auto px-6 py-8 md:py-12">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
