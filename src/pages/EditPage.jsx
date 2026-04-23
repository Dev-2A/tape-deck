import { useParams, Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";

export default function EditPage() {
  const { tapeId } = useParams();

  return (
    <div>
      <Link
        to={ROUTES.COLLECTION}
        className="inline-block mb-8 text-sm"
        style={{ color: "var(--tape-text-secondary)" }}
      >
        ← 컬렉션으로
      </Link>

      <h1
        className="font-serif text-4xl mb-3"
        style={{ color: "var(--tape-text-primary)" }}
      >
        테이프 편집
      </h1>
      <p
        className="font-mono text-sm"
        style={{ color: "var(--tape-text-muted)" }}
      >
        tapeId: {tapeId}
      </p>

      <p
        className="mt-12 text-xs font-mono"
        style={{ color: "var(--tape-text-muted)" }}
      >
        // TODO Step 11: CreatePage와 동일 폼 + 기존 데이터 로드
      </p>
    </div>
  );
}
