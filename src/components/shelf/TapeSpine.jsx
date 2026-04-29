import { useState } from "react";
import { Link } from "react-router-dom";
import { buildRoute } from "../../constants/routes";
import { useConfirm } from "../../hooks/useConfirm";
import { useToast } from "../../contexts/ToastContext";
import { deleteTape } from "../../db/tapeRepository";
import { getReadableTextColor } from "../../utils/colorHelpers";

export default function TapeSpine({ tape, index }) {
  const [hovered, setHovered] = useState(false);
  const totalTracks = (tape.sideA?.length || 0) + (tape.sideB?.length || 0);
  const textColor = getReadableTextColor(tape.cover?.bgColor || "#888");
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
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="block relative transition-all duration-300 ease-out group"
        style={{
          width: 56,
          height: 280,
          backgroundColor: tape.cover?.bgColor || "#8fb8d9",
          borderRadius: "4px",
          boxShadow: hovered
            ? "0 12px 24px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1)"
            : "0 4px 8px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(0,0,0,0.2)",
          transform: hovered ? "translateY(-12px)" : "translateY(0)",
          textDecoration: "none",
          cursor: "pointer",
          marginLeft: index === 0 ? 0 : -2,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 6,
            right: 6,
            height: 28,
            backgroundColor: tape.cover?.accentColor || "#d4a574",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
          }}
        >
          {tape.cover?.emoji || "📼"}
        </div>

        <div
          style={{
            position: "absolute",
            top: 60,
            bottom: 60,
            left: "50%",
            transform: "translateX(-50%)",
            writingMode: "vertical-rl",
            color: textColor,
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: 15,
            letterSpacing: "0.04em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxHeight: 160,
          }}
          title={tape.title}
        >
          {tape.title}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            color: textColor,
            opacity: 0.7,
          }}
        >
          ♪{totalTracks}
          <br />▶{tape.playCount || 0}
        </div>

        <button
          onClick={handleDelete}
          className="absolute top-1 right-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            width: 18,
            height: 18,
            backgroundColor: "rgba(0,0,0,0.5)",
            color: "#f5ead5",
            fontSize: 10,
            lineHeight: "18px",
            textAlign: "center",
          }}
          aria-label="삭제"
        >
          ✕
        </button>
      </Link>
      {ConfirmDialog}
    </>
  );
}
