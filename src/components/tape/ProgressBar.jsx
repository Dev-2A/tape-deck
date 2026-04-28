import { useRef, useState, useCallback, useEffect } from "react";

/**
 * 시킹 가능한 진행 바.
 *
 * - 클릭으로 그 위치로 점프
 * - 드래그로 부드럽게 시킹 (드래그 중엔 onSeek 호출 안 하고, 드래그 끝날 때 한 번만)
 *
 * Props:
 *   - currentTime, duration  (초)
 *   - onSeek(seconds)
 *   - color
 */
export default function ProgressBar({
  currentTime = 0,
  duration = 0,
  onSeek,
  color = "var(--tape-accent-blue)",
}) {
  const trackRef = useRef(null);
  const [draggingValue, setDraggingValue] = useState(null); // 드래그 중일 때 보여줄 값

  const valueRef = useRef(currentTime);
  useEffect(() => {
    valueRef.current = currentTime;
  }, [currentTime]);

  // 클릭/드래그 좌표 → 시간 변환
  const positionToTime = useCallback(
    (clientX) => {
      const node = trackRef.current;
      if (!node || duration <= 0) return 0;
      const rect = node.getBoundingClientRect();
      const ratio = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width),
      );
      return ratio * duration;
    },
    [duration],
  );

  // 드래그 종료 — 최종 seek
  const handlePointerUp = useCallback(
    (e) => {
      const t = positionToTime(e.clientX);
      setDraggingValue(null);
      onSeek?.(t);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [positionToTime, onSeek],
  );

  // 드래그 진행 — 시각만 업데이트
  const handlePointerMove = useCallback(
    (e) => {
      const t = positionToTime(e.clientX);
      setDraggingValue(t);
    },
    [positionToTime],
  );

  const onPointerDown = (e) => {
    e.preventDefault();
    const t = positionToTime(e.clientX);
    setDraggingValue(t); // 즉시 시각 반영
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  // 표시할 진행률
  const displayTime = draggingValue !== null ? draggingValue : currentTime;
  const ratio =
    duration > 0 ? Math.max(0, Math.min(1, displayTime / duration)) : 0;

  return (
    <div
      ref={trackRef}
      onPointerDown={onPointerDown}
      className="relative w-full rounded-full cursor-pointer group"
      style={{
        height: 6,
        backgroundColor: "var(--tape-bg-deepest)",
        touchAction: "none",
      }}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={duration}
      aria-valuenow={displayTime}
    >
      {/* 채워진 영역 */}
      <div
        className="absolute top-0 left-0 h-full rounded-full transition-[width]"
        style={{
          width: `${ratio * 100}%`,
          backgroundColor: color,
          transitionDuration: draggingValue !== null ? "0ms" : "120ms",
        }}
      />
      {/* 핸들 (호버/드래그 시 표시) */}
      <div
        className="absolute top-1/2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          left: `calc(${ratio * 100}% - 7px)`,
          width: 14,
          height: 14,
          backgroundColor: color,
          transform: "translateY(-50%)",
          opacity: draggingValue !== null ? 1 : undefined,
          boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
        }}
      />
    </div>
  );
}
