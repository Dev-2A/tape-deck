import { useState } from "react";
import { Link } from "react-router-dom";
import { buildRoute } from "../../constants/routes";
import { useReelRotation } from "../../hooks/useReelRotation";
import { deleteTape } from "../../db/tapeRepository";
import CassetteSVG from "../tape/CassetteSVG";

/**
 * 그리드 뷰의 카세트 카드.
 * 호버 시 위로 떠오르고 릴이 회전.
 */
export default function TapeCard({ tape }) {
  const totalTracks = (tape.sideA?.length || 0) + (tape.sideB?.length || 0);
  const [hovered, setHovered] = useState(false);
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
      <CassetteSVG
        cover={tape.cover}
        title={tape.title}
        artist={tape.artist}
        side="A"
        reelRotation={reelRotation}
        playing={hovered}
      />

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
