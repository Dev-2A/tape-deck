import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

export default function Header() {
  const { pathname } = useLocation();
  const isCollection = pathname === ROUTES.COLLECTION;
  const isCreate = pathname === ROUTES.CREATE;

  return (
    <header
      className="w-full border-b backdrop-blur-sm sticky top-0 z-40"
      style={{
        backgroundColor: "rgba(13, 10, 8, 0.85)",
        borderColor: "var(--tape-border)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to={ROUTES.COLLECTION}
          className="flex items-center gap-3 group"
          style={{ textDecoration: "none" }}
        >
          <span className="text-2xl group-hover:rotate-6 transition-transform duration-300">
            📼
          </span>
          <span
            className="font-serif text-2xl"
            style={{ color: "var(--tape-text-primary)" }}
          >
            Tape Deck
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <NavLink
            to={ROUTES.COLLECTION}
            label="컬렉션"
            active={isCollection}
          />
          <NavLink
            to={ROUTES.CREATE}
            label="+ 새 테이프"
            active={isCreate}
            highlight
          />
          <Link
            to={ROUTES.SETTINGS}
            className="ml-1 px-2 py-2 rounded-md text-sm transition-opacity hover:opacity-80"
            style={{
              color: "var(--tape-text-secondary)",
              textDecoration: "none",
            }}
            aria-label="설정"
            title="설정"
          >
            ⚙️
          </Link>
        </nav>
      </div>
    </header>
  );
}

function NavLink({ to, label, active, highlight }) {
  const baseStyle = {
    color: active ? "var(--tape-text-primary)" : "var(--tape-text-secondary)",
    backgroundColor: active ? "var(--tape-bg-elevated)" : "transparent",
    borderColor: highlight ? "var(--tape-accent-amber)" : "transparent",
    textDecoration: "none",
  };

  return (
    <Link
      to={to}
      className="px-4 py-2 rounded-md text-sm font-medium border transition-colors duration-200 hover:opacity-80"
      style={baseStyle}
    >
      {label}
    </Link>
  );
}
