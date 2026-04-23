import { useParams, Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";

export default function PlayerPage() {
  const { tapeId } = useParams();

  return (
    <div className="text-center">
      <Link
        to={ROUTES.COLLECTION}
        className="inline-block mb-8 text-sm"
        style={{ color: "var(--tape-text-secondary)" }}
      >
        ← 컬렉션으로
      </Link>

      <div className="text-7xl mb-6 opacity-60">📼</div>

      <h1
        className="font-serif text-3xl mb-2"
        style={{ color: "var(--tape-text-primary)" }}
      >
        Player
      </h1>
      <p
        className="font-mono text-sm mb-1"
        style={{ color: "var(--tape-text-muted)" }}
      >
        tapeId: {tapeId}
      </p>
      <p
        className="text-xs font-mono mt-8"
        style={{ color: "var(--tape-text-muted)" }}
      >
        // TODO Step 6~9: 카세트테이프 SVG + 회전 애니메이션 + 컨트롤
      </p>
    </div>
  );
}
