import { Link } from "react-router-dom";
import { ROUTES, buildRoute } from "../constants/routes";
import { useTapes } from "../hooks/useTapes";
import { addTape, createBlankTape, deleteTape } from "../db/tapeRepository";
import { createTrack } from "../db/trackHelpers";

export default function CollectionPage() {
  const tapes = useTapes(); // undefined → loading, [] → empty, [...] → 데이터

  // ── 디버그용: 샘플 테이프 하나 추가 (Step 11에서 진짜 폼으로 교체)
  const handleAddSample = async () => {
    const palette = [
      { bg: "#8fb8d9", acc: "#d4a574", emoji: "🌊" },
      { bg: "#c97a5e", acc: "#f5ead5", emoji: "🌅" },
      { bg: "#8a9a6b", acc: "#2a221a", emoji: "🌿" },
      { bg: "#d4a574", acc: "#15110d", emoji: "☕" },
    ];
    const p = palette[Math.floor(Math.random() * palette.length)];
    const titles = [
      "운전할 때 듣는 노래",
      "늦은 새벽의 카페",
      "첫눈 오는 날",
      "여름 휴가 BGM",
      "비 오는 일요일 오후",
    ];
    const tape = createBlankTape({
      title: titles[Math.floor(Math.random() * titles.length)],
      artist: "2A’s Mixtape",
      cover: {
        bgColor: p.bg,
        accentColor: p.acc,
        emoji: p.emoji,
        pattern: "solid",
      },
      sideA: [
        createTrack({
          videoId: "dQw4w9WgXcQ",
          title: "Sample Track A1",
          duration: 213,
        }),
      ],
      sideB: [
        createTrack({
          videoId: "M7lc1UVf-VE",
          title: "Sample Track B1",
          duration: 200,
        }),
      ],
    });
    await addTape(tape);
  };

  // 로딩 상태
  if (tapes === undefined) {
    return (
      <div className="text-center py-20">
        <p
          className="font-mono text-sm"
          style={{ color: "var(--tape-text-muted)" }}
        >
          📼 컬렉션 불러오는 중...
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="mb-10 flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1
            className="font-serif text-4xl md:text-5xl mb-3"
            style={{ color: "var(--tape-text-primary)" }}
          >
            내 테이프 컬렉션
          </h1>
          <p style={{ color: "var(--tape-text-secondary)" }}>
            {tapes.length === 0
              ? "만든 테이프가 선반에 꽂힙니다. 한 칸씩 골라 들어보세요."
              : `선반에 ${tapes.length}개의 테이프.`}
          </p>
        </div>

        {/* 디버그용 — Step 11에서 제거 */}
        <button
          onClick={handleAddSample}
          className="px-3 py-2 rounded-md text-xs font-mono border transition-opacity hover:opacity-80"
          style={{
            borderColor: "var(--tape-border)",
            color: "var(--tape-text-muted)",
            backgroundColor: "var(--tape-bg-elevated)",
          }}
        >
          + sample
        </button>
      </div>

      {/* 빈 상태 */}
      {tapes.length === 0 ? <EmptyShelf /> : <TapeGrid tapes={tapes} />}

      <p
        className="mt-8 text-xs font-mono"
        style={{ color: "var(--tape-text-muted)" }}
      >
        // TODO Step 12: 미니어처 카세트 카드 + 검색/정렬
      </p>
    </div>
  );
}

/**
 * 빈 상태 — 선반에 아무것도 없을 때.
 */
function EmptyShelf() {
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

/**
 * 임시 그리드 — Step 12에서 진짜 미니어처 카세트로 교체.
 */
function TapeGrid({ tapes }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {tapes.map((t) => (
        <TapeCardPlaceholder key={t.id} tape={t} />
      ))}
    </div>
  );
}

/**
 * 임시 카드 — Step 12에서 진짜 카세트테이프 미니어처로 교체.
 */
function TapeCardPlaceholder({ tape }) {
  const totalTracks = (tape.sideA?.length || 0) + (tape.sideB?.length || 0);

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`"${tape.title}" 테이프를 삭제할까요?`)) {
      await deleteTape(tape.id);
    }
  };

  return (
    <Link
      to={buildRoute.play(tape.id)}
      className="block rounded-lg p-5 border transition-all duration-200 hover:scale-[1.02] hover:shadow-xl group"
      style={{
        backgroundColor: tape.cover?.bgColor || "var(--tape-bg-elevated)",
        borderColor: "var(--tape-border)",
        textDecoration: "none",
        boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
      }}
    >
      {/* 상단: 이모지 + 액션 */}
      <div className="flex items-start justify-between mb-6">
        <div className="text-4xl">{tape.cover?.emoji || "📼"}</div>
        <button
          onClick={handleDelete}
          className="text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            backgroundColor: "rgba(0,0,0,0.3)",
            color: "var(--tape-text-primary)",
          }}
        >
          삭제
        </button>
      </div>

      {/* 타이틀 */}
      <h3
        className="font-serif text-xl mb-1 line-clamp-2"
        style={{ color: tape.cover?.accentColor || "var(--tape-text-primary)" }}
      >
        {tape.title}
      </h3>
      {tape.artist && (
        <p
          className="text-sm mb-4 italic"
          style={{
            color: tape.cover?.accentColor || "var(--tape-text-secondary)",
            opacity: 0.85,
          }}
        >
          — {tape.artist}
        </p>
      )}

      {/* 메타 */}
      <div
        className="flex items-center justify-between text-xs font-mono mt-4 pt-4 border-t"
        style={{
          color: tape.cover?.accentColor || "var(--tape-text-muted)",
          borderColor: "rgba(0,0,0,0.15)",
          opacity: 0.85,
        }}
      >
        <span>♪ {totalTracks} tracks</span>
        <span>▶ {tape.playCount || 0}</span>
      </div>
    </Link>
  );
}
