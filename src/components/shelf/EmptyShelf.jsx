import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

export default function EmptyShelf() {
  return (
    <div
      className="rounded-lg border-2 border-dashed py-20 px-6 text-center"
      style={{
        borderColor: "var(--tape-border)",
        backgroundColor: "var(--tape-bg-elevated)",
      }}
    >
      <div className="text-6xl mb-6 opacity-60">🗄️</div>
      <p
        className="text-lg mb-2"
        style={{ color: "var(--tape-text-secondary)" }}
      >
        아직 선반이 비어 있어요.
      </p>
      <p className="text-sm mb-6" style={{ color: "var(--tape-text-muted)" }}>
        첫 카세트테이프를 만들어 보세요.
      </p>
      <Link
        to={ROUTES.CREATE}
        className="inline-block px-6 py-3 rounded-md font-medium transition-opacity hover:opacity-90"
        style={{
          backgroundColor: "var(--tape-accent-amber)",
          color: "var(--tape-bg-deepest)",
          textDecoration: "none",
        }}
      >
        + 첫 테이프 만들기
      </Link>
    </div>
  );
}
