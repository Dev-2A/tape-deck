import { useTrackInput } from "../../hooks/useTrackInput";
import { useDraggableList } from "../../hooks/useDraggableList";
import { formatTime } from "../../utils/formatTime";

/**
 * 한 면(A 또는 B)의 트랙 리스트 입력 컴포넌트.
 *
 * Props:
 *   - side: 'A' | 'B'  — 라벨 표시용
 *   - tracks: Track[]
 *   - onChange(tracks)
 *   - accentColor: string (라벨 색)
 */
export default function TrackListInput({
  side,
  tracks,
  onChange,
  accentColor = "var(--tape-accent-amber)",
}) {
  const { input, setInput, error, loading, addFromInput } = useTrackInput();
  const { draggingIndex, hoverIndex, getItemProps } = useDraggableList(
    tracks,
    onChange,
  );

  const handleAdd = async (e) => {
    e?.preventDefault();
    const track = await addFromInput();
    if (track) onChange([...tracks, track]);
  };

  const handleRemove = (id) => {
    onChange(tracks.filter((t) => t.id !== id));
  };

  return (
    <div>
      {/* 면 라벨 */}
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="font-serif text-2xl" style={{ color: accentColor }}>
          {side}면
        </h3>
        <span
          className="text-xs font-mono"
          style={{ color: "var(--tape-text-muted)" }}
        >
          {tracks.length}곡
        </span>
      </div>

      {/* URL 입력 */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="YouTube URL을 붙여넣으세요"
          className="flex-1 px-3 py-2 rounded-md text-sm border outline-none transition-colors"
          style={{
            backgroundColor: "var(--tape-bg-base)",
            borderColor: error
              ? "var(--tape-accent-rust)"
              : "var(--tape-border)",
            color: "var(--tape-text-primary)",
          }}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 py-2 rounded-md text-sm font-medium border transition-opacity hover:opacity-80 disabled:opacity-50"
          style={{
            backgroundColor: "var(--tape-accent-amber)",
            color: "var(--tape-bg-deepest)",
            borderColor: "var(--tape-accent-amber)",
          }}
        >
          {loading ? "..." : "+ 추가"}
        </button>
      </form>

      {error && (
        <p
          className="text-xs font-mono mb-3"
          style={{ color: "var(--tape-accent-rust)" }}
        >
          {error}
        </p>
      )}

      {/* 트랙 리스트 */}
      {tracks.length === 0 ? (
        <div
          className="rounded-md border-2 border-dashed py-8 text-center"
          style={{
            borderColor: "var(--tape-border)",
            backgroundColor: "var(--tape-bg-base)",
          }}
        >
          <p className="text-sm" style={{ color: "var(--tape-text-muted)" }}>
            아직 곡이 없어요.
          </p>
        </div>
      ) : (
        <ul className="space-y-1">
          {tracks.map((t, i) => {
            const isDragging = draggingIndex === i;
            const isHover =
              hoverIndex === i && draggingIndex !== null && draggingIndex !== i;

            return (
              <li
                key={t.id}
                {...getItemProps(i)}
                className="rounded-md px-3 py-2 border flex items-center gap-3 cursor-move transition-all"
                style={{
                  backgroundColor: isHover
                    ? "var(--tape-bg-raised)"
                    : "var(--tape-bg-elevated)",
                  borderColor: isHover
                    ? "var(--tape-accent-amber)"
                    : "var(--tape-border)",
                  opacity: isDragging ? 0.4 : 1,
                  transform: isHover ? "translateY(-2px)" : "translateY(0)",
                }}
              >
                {/* 드래그 핸들 */}
                <span
                  className="font-mono text-sm select-none"
                  style={{ color: "var(--tape-text-muted)" }}
                >
                  ⋮⋮
                </span>

                {/* 순번 */}
                <span
                  className="font-mono text-xs w-6 select-none"
                  style={{ color: "var(--tape-text-muted)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* 제목 + 영상 ID */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm truncate"
                    style={{ color: "var(--tape-text-primary)" }}
                  >
                    {t.title || "(제목 없음)"}
                  </p>
                  <p
                    className="text-xs font-mono truncate"
                    style={{ color: "var(--tape-text-muted)" }}
                  >
                    {t.videoId}
                    {t.duration > 0 && ` · ${formatTime(t.duration)}`}
                  </p>
                </div>

                {/* 삭제 버튼 */}
                <button
                  type="button"
                  onClick={() => handleRemove(t.id)}
                  className="text-xs px-2 py-1 rounded transition-colors hover:opacity-100 opacity-60"
                  style={{
                    color: "var(--tape-accent-rust)",
                    backgroundColor: "transparent",
                  }}
                  aria-label="삭제"
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
