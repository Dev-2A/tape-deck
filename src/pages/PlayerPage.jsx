import { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ROUTES, buildRoute } from "../constants/routes";
import { useTape } from "../hooks/useTapes";
import { useYouTubePlayer } from "../hooks/useYouTubePlayer";
import { useReelRotation } from "../hooks/useReelRotation";
import { incrementPlayCount } from "../db/tapeRepository";
import { useToast } from "../contexts/ToastContext";
import CassetteSVG from "../components/tape/CassetteSVG";
import VolumeKnob from "../components/tape/VolumeKnob";
import ProgressBar from "../components/tape/ProgressBar";
import { formatTime } from "../utils/formatTime";
import { REPEAT_LABELS, nextRepeatMode } from "../utils/repeatMode";

export default function PlayerPage() {
  const { tapeId } = useParams();
  const navigate = useNavigate();
  const tape = useTape(tapeId);
  const toast = useToast();

  const [side, setSide] = useState("A");
  const [trackIndex, setTrackIndex] = useState(0);
  const [autoFlip, setAutoFlip] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off");
  const [flipping, setFlipping] = useState(false);
  const incrementedRef = useRef(false);
  const lastVolumeRef = useRef(70); // 음소거 토글용

  const tracks = tape ? (side === "A" ? tape.sideA : tape.sideB) : [];
  const currentTrack = tracks[trackIndex] || null;

  const containerRef = useRef(null);

  const handleEnded = () => {
    // 1) 한 곡 반복
    if (repeatMode === "track") {
      try {
        if (currentTrack?.videoId) {
          player.loadVideo(currentTrack.videoId, true);
        } else {
          player.seekTo(0);
          player.play();
        }
      } catch {}
      return;
    }
    // 2) 다음 트랙
    if (trackIndex < tracks.length - 1) {
      setTrackIndex((i) => i + 1);
      return;
    }
    // 3) 면 끝
    if (repeatMode === "side") {
      setTrackIndex(0);
      return;
    }
    if (autoFlip) {
      flipToSide(side === "A" ? "B" : "A");
      return;
    }
    // 4) 정지
  };

  const player = useYouTubePlayer(containerRef, {
    videoId: currentTrack?.videoId || null,
    initialVolume: 70,
    onEnded: handleEnded,
  });

  const reelRotation = useReelRotation(player.state === "playing", 90);

  // 첫 재생 시 playCount 증가
  useEffect(() => {
    if (player.state === "playing" && !incrementedRef.current && tapeId) {
      incrementPlayCount(tapeId);
      incrementedRef.current = true;
    }
  }, [player.state, tapeId]);

  // 면 전환 시 첫 곡으로
  useEffect(() => {
    setTrackIndex(0);
  }, [side]);

  // ── 면 전환 (애니메이션과 함께)
  const flipToSide = (newSide) => {
    if (newSide === side) return;
    setFlipping(true);
    setTimeout(() => setSide(newSide), 210);
    setTimeout(() => setFlipping(false), 420);
  };

  // ── 키보드 단축키
  useEffect(() => {
    const handleKey = (e) => {
      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || e.target.isContentEditable)
        return;

      switch (e.key) {
        case " ":
          e.preventDefault();
          if (player.state === "playing") player.pause();
          else player.play();
          break;
        case "ArrowLeft":
          if (e.shiftKey) {
            player.seekTo(Math.max(0, player.currentTime - 10));
          } else {
            if (trackIndex > 0) setTrackIndex((i) => i - 1);
          }
          break;
        case "ArrowRight":
          if (e.shiftKey) {
            player.seekTo(player.currentTime + 10);
          } else {
            if (trackIndex < tracks.length - 1) setTrackIndex((i) => i + 1);
          }
          break;
        case "[":
          flipToSide("A");
          break;
        case "]":
          flipToSide("B");
          break;
        case "m":
        case "M":
          if (player.volume > 0) {
            lastVolumeRef.current = player.volume;
            player.setVolume(0);
          } else {
            player.setVolume(lastVolumeRef.current || 70);
          }
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    player.state,
    player.currentTime,
    player.volume,
    trackIndex,
    tracks.length,
    side,
  ]);

  // 로딩
  if (tape === undefined) {
    return (
      <p
        className="text-center font-mono text-sm py-20"
        style={{ color: "var(--tape-text-muted)" }}
      >
        📼 테이프 불러오는 중...
      </p>
    );
  }
  if (!tape) {
    return (
      <div className="text-center py-20">
        <p className="mb-4" style={{ color: "var(--tape-text-secondary)" }}>
          테이프를 찾을 수 없어요.
        </p>
        <button
          onClick={() => navigate(ROUTES.COLLECTION)}
          className="px-4 py-2 rounded-md text-sm border"
          style={{
            borderColor: "var(--tape-border)",
            color: "var(--tape-text-primary)",
          }}
        >
          ← 컬렉션으로
        </button>
      </div>
    );
  }

  const repeat = REPEAT_LABELS[repeatMode];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Link
          to={ROUTES.COLLECTION}
          className="text-sm"
          style={{ color: "var(--tape-text-secondary)" }}
        >
          ← 컬렉션으로
        </Link>
        <Link
          to={buildRoute.edit(tapeId)}
          className="text-sm px-3 py-1 rounded-md border transition-colors hover:opacity-80"
          style={{
            color: "var(--tape-text-secondary)",
            borderColor: "var(--tape-border)",
            textDecoration: "none",
          }}
        >
          ✎ 편집
        </Link>
      </div>

      {/* 카세트 본체 */}
      <div
        className={`max-w-3xl mx-auto mb-8 ${flipping ? "tape-flipping" : ""}`}
      >
        <CassetteSVG
          cover={tape.cover}
          title={tape.title}
          artist={tape.artist}
          side={side}
          reelRotation={reelRotation}
          playing={player.state === "playing"}
        />
      </div>

      {/* A/B면 + 반복/자동플립 */}
      <div className="flex justify-center items-center gap-6 mb-8 flex-wrap">
        <div className="flex gap-2">
          <SideButton
            label="A면"
            active={side === "A"}
            onClick={() => flipToSide("A")}
          />
          <SideButton
            label="B면"
            active={side === "B"}
            onClick={() => flipToSide("B")}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setRepeatMode((m) => nextRepeatMode(m))}
            className="px-3 py-2 rounded-md text-sm border transition-colors"
            style={{
              borderColor: "var(--tape-border)",
              color: repeat.color,
              backgroundColor: "transparent",
            }}
            aria-label={repeat.text}
            title={repeat.text}
          >
            <span className="mr-1">{repeat.icon}</span>
            <span className="font-mono text-xs">{repeat.text}</span>
          </button>

          <button
            onClick={() => setAutoFlip((v) => !v)}
            className="px-3 py-2 rounded-md text-sm border transition-colors"
            style={{
              borderColor: "var(--tape-border)",
              color: autoFlip
                ? "var(--tape-accent-amber)"
                : "var(--tape-text-muted)",
              backgroundColor: "transparent",
            }}
            title="A면이 끝나면 자동으로 B면 재생"
          >
            <span className="mr-1">🔄</span>
            <span className="font-mono text-xs">
              자동 플립 {autoFlip ? "ON" : "OFF"}
            </span>
          </button>
        </div>
      </div>

      {/* YouTube IFrame — 화면 밖 */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          width: "320px",
          height: "180px",
          pointerEvents: "none",
        }}
      >
        <div ref={containerRef} className="w-full h-full" />
      </div>

      {/* 컨트롤 패널 */}
      {currentTrack ? (
        <div
          className="rounded-lg p-6 border max-w-3xl mx-auto"
          style={{
            backgroundColor: "var(--tape-bg-elevated)",
            borderColor: "var(--tape-border)",
          }}
        >
          <div className="flex items-start gap-6 flex-wrap">
            <div className="flex-1 min-w-[260px]">
              <p
                className="text-xs font-mono mb-1"
                style={{ color: "var(--tape-text-muted)" }}
              >
                NOW PLAYING · {side}면 · {trackIndex + 1}/{tracks.length}
              </p>
              <p
                className="font-medium mb-3"
                style={{ color: "var(--tape-text-primary)" }}
              >
                {currentTrack.title || "(제목 없음)"}
              </p>

              <ProgressBar
                currentTime={player.currentTime}
                duration={player.duration || currentTrack.duration || 0}
                onSeek={(t) => player.seekTo(t)}
              />
              <div className="flex justify-between mt-2 mb-4">
                <span
                  className="text-xs font-mono"
                  style={{ color: "var(--tape-text-muted)" }}
                >
                  {formatTime(player.currentTime)}
                </span>
                <span
                  className="text-xs font-mono"
                  style={{ color: "var(--tape-text-muted)" }}
                >
                  {formatTime(player.duration || currentTrack.duration || 0)}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <ControlButton
                  onClick={() => setTrackIndex((i) => Math.max(0, i - 1))}
                  disabled={trackIndex === 0}
                  title="이전 트랙"
                >
                  ⏮
                </ControlButton>

                <ControlButton
                  onClick={() =>
                    player.seekTo(Math.max(0, player.currentTime - 10))
                  }
                  title="10초 뒤로"
                >
                  ⏪
                </ControlButton>

                {player.state === "playing" ? (
                  <ControlButton onClick={player.pause} primary>
                    ⏸ 일시정지
                  </ControlButton>
                ) : (
                  <ControlButton onClick={player.play} primary>
                    ▶ 재생
                  </ControlButton>
                )}

                <ControlButton
                  onClick={() => player.seekTo(player.currentTime + 10)}
                  title="10초 앞으로"
                >
                  ⏩
                </ControlButton>

                <ControlButton
                  onClick={() =>
                    setTrackIndex((i) => Math.min(tracks.length - 1, i + 1))
                  }
                  disabled={trackIndex >= tracks.length - 1}
                  title="다음 트랙"
                >
                  ⏭
                </ControlButton>
              </div>
            </div>

            <div className="flex justify-center">
              <VolumeKnob
                value={player.volume}
                onChange={(v) => player.setVolume(v)}
                size={120}
                label="VOLUME"
              />
            </div>
          </div>
        </div>
      ) : (
        <p
          className="text-center text-sm py-8"
          style={{ color: "var(--tape-text-muted)" }}
        >
          {side}면에는 트랙이 없어요.
        </p>
      )}

      {/* 트랙 목록 */}
      {tracks.length > 0 && (
        <div className="mt-6 max-w-3xl mx-auto">
          <h2
            className="text-sm font-mono mb-3"
            style={{ color: "var(--tape-text-muted)" }}
          >
            {side}면 트랙 · {tracks.length}곡
          </h2>
          <ul className="space-y-1">
            {tracks.map((t, i) => (
              <li key={t.id}>
                <button
                  onClick={() => setTrackIndex(i)}
                  className="w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center"
                  style={{
                    backgroundColor:
                      i === trackIndex
                        ? "var(--tape-bg-elevated)"
                        : "transparent",
                    color:
                      i === trackIndex
                        ? "var(--tape-text-primary)"
                        : "var(--tape-text-secondary)",
                  }}
                >
                  <span
                    className="font-mono mr-3 text-xs"
                    style={{ color: "var(--tape-text-muted)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1">{t.title || "(제목 없음)"}</span>
                  {t.duration > 0 && (
                    <span
                      className="font-mono text-xs ml-3"
                      style={{ color: "var(--tape-text-muted)" }}
                    >
                      {formatTime(t.duration)}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <KeyboardShortcuts />
    </div>
  );
}

function KeyboardShortcuts() {
  return (
    <details className="mt-10 max-w-3xl mx-auto">
      <summary
        className="cursor-pointer text-xs font-mono select-none text-center"
        style={{ color: "var(--tape-text-muted)" }}
      >
        ⌨️ 키보드 단축키
      </summary>
      <div
        className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs font-mono p-4 rounded-md border"
        style={{
          backgroundColor: "var(--tape-bg-elevated)",
          borderColor: "var(--tape-border)",
          color: "var(--tape-text-secondary)",
        }}
      >
        <div>
          <kbd>Space</kbd> — 재생 / 일시정지
        </div>
        <div>
          <kbd>M</kbd> — 음소거 토글
        </div>
        <div>
          <kbd>←</kbd> / <kbd>→</kbd> — 이전 / 다음 트랙
        </div>
        <div>
          <kbd>Shift</kbd>+<kbd>←</kbd>/<kbd>→</kbd> — 10초 시킹
        </div>
        <div>
          <kbd>[</kbd> — A면
        </div>
        <div>
          <kbd>]</kbd> — B면
        </div>
      </div>
    </details>
  );
}

function SideButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-5 py-2 rounded-md font-serif text-base border transition-all"
      style={{
        backgroundColor: active ? "var(--tape-accent-amber)" : "transparent",
        color: active ? "var(--tape-bg-deepest)" : "var(--tape-text-secondary)",
        borderColor: active ? "var(--tape-accent-amber)" : "var(--tape-border)",
      }}
    >
      {label}
    </button>
  );
}

function ControlButton({ children, onClick, disabled, primary, title }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="px-3 py-2 rounded-md text-sm font-medium border transition-all hover:opacity-80"
      style={{
        backgroundColor: primary ? "var(--tape-accent-blue)" : "transparent",
        color: primary ? "var(--tape-bg-deepest)" : "var(--tape-text-primary)",
        borderColor: primary ? "var(--tape-accent-blue)" : "var(--tape-border)",
      }}
    >
      {children}
    </button>
  );
}
