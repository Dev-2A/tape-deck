import { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import CassetteSVG from "../components/tape/CassetteSVG";
import CoverDesigner from "../components/creator/CoverDesigner";

const DEFAULT_COVER = {
  bgColor: "#8fb8d9",
  accentColor: "#d4a574",
  emoji: "📼",
  pattern: "solid",
};

export default function CreatePage() {
  const [cover, setCover] = useState(DEFAULT_COVER);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");

  const previewTitle = title.trim() || "제목 없는 테이프";

  return (
    <div>
      <Link
        to={ROUTES.COLLECTION}
        className="inline-block mb-6 text-sm"
        style={{ color: "var(--tape-text-secondary)" }}
      >
        ← 컬렉션으로
      </Link>

      <div className="mb-8">
        <h1
          className="font-serif text-4xl mb-2"
          style={{ color: "var(--tape-text-primary)" }}
        >
          새 테이프 만들기
        </h1>
        <p style={{ color: "var(--tape-text-secondary)" }}>
          한 면당 곡을 담고, 케이스를 직접 디자인하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
        {/* ── 좌측: 라이브 미리보기 (sticky) ── */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-24">
            <p
              className="font-mono text-xs uppercase tracking-wider mb-3"
              style={{ color: "var(--tape-text-muted)" }}
            >
              미리보기
            </p>
            <CassetteSVG
              cover={cover}
              title={previewTitle}
              artist={artist}
              side="A"
            />
            <p
              className="text-xs font-mono mt-4 text-center"
              style={{ color: "var(--tape-text-muted)" }}
            >
              디자인을 바꾸면 즉시 반영됩니다.
            </p>
          </div>
        </div>

        {/* ── 우측: 디자이너 ── */}
        <div className="lg:col-span-3">
          <CoverDesigner
            cover={cover}
            onChange={setCover}
            title={title}
            artist={artist}
            onMetaChange={(p) => {
              if (p.title !== undefined) setTitle(p.title);
              if (p.artist !== undefined) setArtist(p.artist);
            }}
          />

          {/* 액션 영역 — Step 11에서 트랙 입력 + 저장 로직 추가 */}
          <div
            className="mt-8 rounded-lg border-2 border-dashed p-5 text-center"
            style={{
              borderColor: "var(--tape-border)",
              backgroundColor: "var(--tape-bg-elevated)",
            }}
          >
            <p
              className="text-sm mb-1"
              style={{ color: "var(--tape-text-secondary)" }}
            >
              📼 다음 단계: 트랙 추가
            </p>
            <p
              className="text-xs font-mono"
              style={{ color: "var(--tape-text-muted)" }}
            >
              // TODO Step 11: YouTube URL 입력으로 A면/B면 트랙 채우기 + 저장
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
