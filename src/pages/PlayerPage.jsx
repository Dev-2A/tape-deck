import { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { useTape } from "../hooks/useTapes";
import { useYouTubePlayer } from "../hooks/useYouTubePlayer";
import { incrementPlayCount } from "../db/tapeRepository";

export default function PlayerPage() {
  const { tapeId } = useParams();
  const navigate = useNavigate();
  const tape = useTape(tapeId);

  // A/B면 + 트랙 인덱스
  const [side, setSide] = useState("A"); // 'A' | 'B'
  const [trackIndex, setTrackIndex] = useState(0);
  const incrementedRef = useRef(false);

  // 현재 면의 트랙 리스트
  const tracks = tape ? (side === "A" ? tape.sideA : tape.sideB) : [];
  const currentTrack = tracks[trackIndex] || null;

  // YouTube 플레이어
  const containerRef = useRef(null);
  const player = useYouTubePlayer(containerRef, {
    videoId: currentTrack?.videoId || null,
    initialVolume: 70,
    onEnded: () => {
      // 마지막 곡이 아니면 다음으로
      if (trackIndex < tracks.length - 1) {
        setTrackIndex((i) => i + 1);
      } else {
        // 같은 면 끝 — 일단 정지 (Step 9에서 자동 B면 전환 옵션 추가)
      }
    },
  });

  // 처음 재생되는 순간 playCount 1 증가
  useEffect(() => {
    if (player.state === "playing" && !incrementedRef.current && tapeId) {
      incrementPlayCount(tapeId);
      incrementedRef.current = true;
    }
  }, [player.state, tapeId]);

  // 면을 바꾸면 첫 곡으로
  useEffect(() => {
    setTrackIndex(0);
  }, [side]);

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

  // 없는 테이프
  if (tape === null || !tape) {
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

  return (
    <div>
      <Link
        to={ROUTES.COLLECTION}
        className="inline-block mb-6 text-sm"
        style={{ color: "var(--tape-text-secondary)" }}
      >
        ← 컬렉션으로
      </Link>

      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{tape.cover?.emoji || "📼"}</span>
          <h1
            className="font-serif text-3xl md:text-4xl"
            style={{ color: "var(--tape-text-primary)" }}
          >
            {tape.title}
          </h1>
        </div>
        {tape.artist && (
          <p
            className="italic ml-12"
            style={{ color: "var(--tape-text-secondary)" }}
          >
            — {tape.artist}
          </p>
        )}
      </div>

      {/* A/B면 토글 */}
      <div className="flex gap-2 mb-6">
        <SideButton
          label="A면"
          active={side === "A"}
          onClick={() => setSide("A")}
        />
        <SideButton
          label="B면"
          active={side === "B"}
          onClick={() => setSide("B")}
        />
      </div>

      {/* YouTube IFrame 컨테이너 — Step 6에서 카세트 뒤로 숨길 예정 */}
      <div
        className="rounded-lg overflow-hidden mb-6 relative"
        style={{
          backgroundColor: 'var(--tape-bg-base)',
          border: '1px solid var(--tape-border)',
          aspectRatio: '16 / 9',
        }}
      >
        {/* ref는 항상 존재 — 트랙이 없을 때는 placeholder가 위에 덮어씀 */}
        <div ref={containerRef} className="w-full h-full" />
        {!currentTrack && (
          <div
            className="absolute inset-0 flex items-center justify-center text-sm"
            style={{
              color: 'var(--tape-text-muted)',
              backgroundColor: 'var(--tape-bg-base)',
            }}
          >
            이 면에는 트랙이 없어요.
          </div>
        )}
      </div>

      {/* 컨트롤 + 트랙 정보 */}
      {currentTrack && (
        <div
          className="rounded-lg p-5 border"
          style={{
            backgroundColor: "var(--tape-bg-elevated)",
            borderColor: "var(--tape-border)",
          }}
        >
          <div className="mb-4">
            <p
              className="text-xs font-mono mb-1"
              style={{ color: "var(--tape-text-muted)" }}
            >
              NOW PLAYING · {side}면 · {trackIndex + 1}/{tracks.length}
            </p>
            <p
              className="font-medium"
              style={{ color: "var(--tape-text-primary)" }}
            >
              {currentTrack.title || "(제목 없음)"}
            </p>
            <p
              className="text-xs font-mono mt-1"
              style={{ color: "var(--tape-text-muted)" }}
            >
              {formatTime(player.currentTime)} /{" "}
              {formatTime(player.duration || currentTrack.duration)}
            </p>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <ControlButton
              onClick={() => setTrackIndex((i) => Math.max(0, i - 1))}
              disabled={trackIndex === 0}
            >
              ⏮
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
              onClick={() =>
                setTrackIndex((i) => Math.min(tracks.length - 1, i + 1))
              }
              disabled={trackIndex >= tracks.length - 1}
            >
              ⏭
            </ControlButton>
          </div>

          <div className="flex items-center gap-3">
            <span
              className="text-xs font-mono"
              style={{ color: "var(--tape-text-muted)" }}
            >
              VOL
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={player.volume}
              onChange={(e) => player.setVolume(Number(e.target.value))}
              className="flex-1"
            />
            <span
              className="text-xs font-mono w-8 text-right"
              style={{ color: "var(--tape-text-secondary)" }}
            >
              {player.volume}
            </span>
          </div>

          <p
            className="text-xs font-mono mt-3"
            style={{ color: "var(--tape-text-muted)" }}
          >
            state: {player.state || "..."} · ready: {String(player.isReady)}
          </p>
        </div>
      )}

      {/* 트랙 목록 (현재 면) */}
      {tracks.length > 0 && (
        <div className="mt-6">
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
                  className="w-full text-left px-3 py-2 rounded text-sm transition-colors"
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
                  {t.title || "(제목 없음)"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p
        className="mt-8 text-xs font-mono"
        style={{ color: "var(--tape-text-muted)" }}
      >
        // TODO Step 6~9: 카세트테이프 SVG로 IFrame 가리기 + 회전 릴 + 노브 볼륨
      </p>
    </div>
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

function ControlButton({ children, onClick, disabled, primary }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 rounded-md text-sm font-medium border transition-all hover:opacity-80"
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

function formatTime(sec) {
  if (!sec || isNaN(sec)) return "0:00";
  const s = Math.floor(sec);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}
