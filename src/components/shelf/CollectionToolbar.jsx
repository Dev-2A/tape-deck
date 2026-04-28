import { SORT_MODES } from "../../utils/tapeFilters";

/**
 * 컬렉션 페이지 상단 툴바.
 *
 * Props:
 *   - query / onQueryChange
 *   - sortMode / onSortChange
 *   - view ('grid' | 'shelf') / onViewChange
 *   - count
 */
export default function CollectionToolbar({
  query,
  onQueryChange,
  sortMode,
  onSortChange,
  view,
  onViewChange,
  count,
}) {
  return (
    <div
      className="flex items-center justify-between gap-3 mb-8 flex-wrap rounded-lg p-3 border"
      style={{
        backgroundColor: "var(--tape-bg-elevated)",
        borderColor: "var(--tape-border)",
      }}
    >
      {/* 좌: 검색 */}
      <div className="flex items-center gap-2 flex-1 min-w-[220px]">
        <span
          className="font-mono text-sm select-none"
          style={{ color: "var(--tape-text-muted)" }}
        >
          🔎
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="제목·아티스트·이모지로 검색"
          className="flex-1 bg-transparent outline-none text-sm"
          style={{ color: "var(--tape-text-primary)" }}
        />
        {query && (
          <button
            onClick={() => onQueryChange("")}
            className="text-xs font-mono px-2 py-1 rounded transition-opacity hover:opacity-80"
            style={{
              color: "var(--tape-text-muted)",
              backgroundColor: "var(--tape-bg-base)",
            }}
            aria-label="검색 지우기"
          >
            ✕
          </button>
        )}
      </div>

      {/* 우: 정렬 + 뷰모드 + 카운트 */}
      <div className="flex items-center gap-2 flex-wrap">
        <select
          value={sortMode}
          onChange={(e) => onSortChange(e.target.value)}
          className="text-xs font-mono px-3 py-1.5 rounded-md border outline-none cursor-pointer"
          style={{
            backgroundColor: "var(--tape-bg-base)",
            borderColor: "var(--tape-border)",
            color: "var(--tape-text-secondary)",
          }}
        >
          {Object.values(SORT_MODES).map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>

        <div
          className="flex rounded-md border overflow-hidden"
          style={{ borderColor: "var(--tape-border)" }}
        >
          <ViewBtn
            label="그리드"
            icon="▦"
            active={view === "grid"}
            onClick={() => onViewChange("grid")}
          />
          <ViewBtn
            label="책장"
            icon="📚"
            active={view === "shelf"}
            onClick={() => onViewChange("shelf")}
          />
        </div>

        <span
          className="text-xs font-mono ml-2"
          style={{ color: "var(--tape-text-muted)" }}
        >
          {count}개
        </span>
      </div>
    </div>
  );
}

function ViewBtn({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 text-xs font-mono transition-colors"
      style={{
        backgroundColor: active ? "var(--tape-bg-raised)" : "transparent",
        color: active
          ? "var(--tape-text-primary)"
          : "var(--tape-text-secondary)",
      }}
      aria-label={label}
      title={label}
    >
      {icon}
    </button>
  );
}
