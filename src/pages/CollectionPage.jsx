import { useState, useMemo } from "react";
import { useTapes } from "../hooks/useTapes";
import { filterTapes, sortTapes } from "../utils/tapeFilters";
import CollectionToolbar from "../components/shelf/CollectionToolbar";
import TapeCard from "../components/shelf/TapeCard";
import Shelf from "../components/shelf/Shelf";
import EmptyShelf from "../components/shelf/EmptyShelf";
import NoSearchResults from "../components/shelf/NoSearchResults";

const VIEW_STORAGE_KEY = "tape-deck.collection.view";
const SORT_STORAGE_KEY = "tape-deck.collection.sort";

export default function CollectionPage() {
  const tapes = useTapes();

  // localStorage에서 마지막 뷰모드/정렬 복원 (사용자 편의)
  const [view, setView] = useState(() => {
    try {
      return localStorage.getItem(VIEW_STORAGE_KEY) || "grid";
    } catch {
      return "grid";
    }
  });
  const [sortMode, setSortMode] = useState(() => {
    try {
      return localStorage.getItem(SORT_STORAGE_KEY) || "recent";
    } catch {
      return "recent";
    }
  });
  const [query, setQuery] = useState("");

  // 변경 시 localStorage에 저장
  const updateView = (v) => {
    setView(v);
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, v);
    } catch {}
  };
  const updateSort = (m) => {
    setSortMode(m);
    try {
      localStorage.setItem(SORT_STORAGE_KEY, m);
    } catch {}
  };

  // 필터 + 정렬
  const visibleTapes = useMemo(() => {
    if (!tapes) return [];
    return sortTapes(filterTapes(tapes, query), sortMode);
  }, [tapes, query, sortMode]);

  // 로딩
  if (tapes === undefined) {
    return (
      <p
        className="text-center font-mono text-sm py-20"
        style={{ color: "var(--tape-text-muted)" }}
      >
        📼 컬렉션 불러오는 중...
      </p>
    );
  }

  // 컬렉션 자체가 비어있음
  if (tapes.length === 0) {
    return (
      <div>
        <Header count={0} />
        <EmptyShelf />
      </div>
    );
  }

  return (
    <div>
      <Header count={tapes.length} />

      <CollectionToolbar
        query={query}
        onQueryChange={setQuery}
        sortMode={sortMode}
        onSortChange={updateSort}
        view={view}
        onViewChange={updateView}
        count={visibleTapes.length}
      />

      {visibleTapes.length === 0 ? (
        <NoSearchResults query={query} onClear={() => setQuery("")} />
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleTapes.map((t) => (
            <TapeCard key={t.id} tape={t} />
          ))}
        </div>
      ) : (
        <Shelf tapes={visibleTapes} />
      )}
    </div>
  );
}

function Header({ count }) {
  return (
    <div className="mb-6">
      <h1
        className="font-serif text-4xl md:text-5xl mb-2"
        style={{ color: "var(--tape-text-primary)" }}
      >
        내 테이프 컬렉션
      </h1>
      <p style={{ color: "var(--tape-text-secondary)" }}>
        {count === 0
          ? "만든 테이프가 선반에 꽂힙니다. 한 칸씩 골라 들어보세요."
          : `선반에 ${count}개의 테이프.`}
      </p>
    </div>
  );
}
