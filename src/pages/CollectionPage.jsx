import { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES, buildRoute } from "../constants/routes";
import { useTapes } from "../hooks/useTapes";
import { addTape, createBlankTape, deleteTape } from "../db/tapeRepository";
import { createTrack } from "../db/trackHelpers";
import CassetteSVG from "../components/tape/CassetteSVG";
import { useReelRotation } from "../hooks/useReelRotation";

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
  const [hovered, setHovered] = useState(false);
  // 호버 중일 때만 천천히 회전 (45 deg/s — 본 재생보다 느림)
  const reelRotation = useReelRotation(hovered, 45);

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
      className="block rounded-xl p-3 transition-all duration-300 ease-out group relative"
      style={{
        backgroundColor: "var(--tape-bg-elevated)",
        textDecoration: "none",
        transform: hovered
          ? "translateY(-8px) scale(1.02)"
          : "translateY(0) scale(1)",
        boxShadow: hovered
          ? "0 16px 32px rgba(0, 0, 0, 0.45), 0 4px 8px rgba(0, 0, 0, 0.3)"
          : "0 2px 6px rgba(0, 0, 0, 0.2)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 미니 카세트 SVG */}
      <CassetteSVG
        cover={tape.cover}
        title={tape.title}
        artist={tape.artist}
        side="A"
        reelRotation={reelRotation}
        playing={hovered}
      />

      {/* 메타 (카세트 아래) */}
      <div className="flex items-center justify-between mt-3 px-2">
        <div
          className="text-xs font-mono"
          style={{ color: "var(--tape-text-muted)" }}
        >
          ♪ {totalTracks} tracks
        </div>
        <div
          className="text-xs font-mono"
          style={{ color: "var(--tape-text-muted)" }}
        >
          ▶ {tape.playCount || 0}
        </div>
      </div>

      {/* 호버 시 우상단 삭제 버튼 */}
      <button
        onClick={handleDelete}
        className="absolute top-3 right-3 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          backgroundColor: "rgba(0,0,0,0.5)",
          color: "var(--tape-text-primary)",
          backdropFilter: "blur(4px)",
        }}
      >
        삭제
      </button>
    </Link>
  );
}
