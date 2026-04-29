import { useState } from "react";
import { Link } from "react-router-dom";
import { buildRoute } from "../../constants/routes";
import { useReelRotation } from "../../hooks/useReelRotation";
import { useConfirm } from "../../hooks/useConfirm";
import { useToast } from "../../contexts/ToastContext";
import { deleteTape } from "../../db/tapeRepository";
import CassetteSVG from "../tape/CassetteSVG";

export default function TapeCard({ tape }) {
  const totalTracks = (tape.sideA?.length || 0) + (tape.sideB?.length || 0);
  const [hovered, setHovered] = useState(false);
  const reelRotation = useReelRotation(hovered, 45);
  const { confirm, ConfirmDialog } = useConfirm();
  const toast = useToast();

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const ok = await confirm({
      title: "테이프를 삭제할까요?",
      body: `"${tape.title}"을(를) 영구히 삭제합니다.`,
      confirmText: "삭제",
      danger: true,
    });
    if (ok) {
      await deleteTape(tape.id);
      toast.success(`"${tape.title}"을(를) 삭제했어요.`);
    }
  };

  return (
    <>
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
      {ConfirmDialog}
    </>
  );
}
