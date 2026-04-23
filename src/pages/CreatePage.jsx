import { Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";

export default function CreatePage() {
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
        새 테이프 만들기
      </h1>
      <p style={{ color: "var(--tape-text-secondary)" }}>
        한 면당 곡을 담고, 케이스를 직접 디자인하세요.
      </p>

      <p
        className="mt-12 text-xs font-mono"
        style={{ color: "var(--tape-text-muted)" }}
      >
        // TODO Step 10~11: 커버 디자이너 + 트랙 리스트 입력 폼
      </p>
    </div>
  );
}
