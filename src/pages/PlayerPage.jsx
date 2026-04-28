import { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { useTape } from "../hooks/useTapes";
import { useYouTubePlayer } from "../hooks/useYouTubePlayer";
import { incrementPlayCount } from "../db/tapeRepository";
import CassetteSVG from "../components/tape/CassetteSVG";
import { useReelRotation } from "../hooks/useReelRotation";
import VolumeKnob from "../components/tape/VolumeKnob";

export default function PlayerPage() {
  const { tapeId } = useParams();
  const navigate = useNavigate();
  const tape = useTape(tapeId);

  const [side, setSide] = useState("A");
  const [trackIndex, setTrackIndex] = useState(0);
  const incrementedRef = useRef(false);

  const tracks = tape ? (side === "A" ? tape.sideA : tape.sideB) : [];
  const currentTrack = tracks[trackIndex] || null;

  const containerRef = useRef(null);
  const player = useYouTubePlayer(containerRef, {
    videoId: currentTrack?.videoId || null,
    initialVolume: 70,
    onEnded: () => {
      if (trackIndex < tracks.length - 1) setTrackIndex((i) => i + 1);
    },
  });

  // 재생 상태에 따라 릴 회전 각도
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

  return (
    <div>
      <Link
        to={ROUTES.COLLECTION}
        className="inline-block mb-6 text-sm"
        style={{ color: "var(--tape-text-secondary)" }}
      >
        ← 컬렉션으로
      </Link>

      {/* 카세트 본체 — 메인 비주얼 */}
      <div className="max-w-3xl mx-auto mb-8">
        <CassetteSVG
          cover={tape.cover}
          title={tape.title}
          artist={tape.artist}
          side={side}
          reelRotation={reelRotation}
          playing={player.state === "playing"}
        />
      </div>

      {/* A/B면 토글 */}
      <div className="flex justify-center gap-2 mb-8">
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

      {/* YouTube IFrame — 화면 밖에 숨김 (오디오만 재생) */}
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

      {/* 컨트롤 + 트랙 정보 */}
      {currentTrack ? (
        <div
          className="rounded-lg p-6 border max-w-3xl mx-auto"
          style={{
            backgroundColor: "var(--tape-bg-elevated)",
            borderColor: "var(--tape-border)",
          }}
        >
          <div className="flex items-center gap-6 flex-wrap">
            {/* 좌측: 트랙 정보 + 재생 컨트롤 */}
            <div className="flex-1 min-w-[260px]">
              <p
                className="text-xs font-mono mb-1"
                style={{ color: "var(--tape-text-muted)" }}
              >
                NOW PLAYING · {side}면 · {trackIndex + 1}/{tracks.length}
              </p>
              <p
                className="font-medium mb-1"
                style={{ color: "var(--tape-text-primary)" }}
              >
                {currentTrack.title || "(제목 없음)"}
              </p>
              <p
                className="text-xs font-mono mb-4"
                style={{ color: "var(--tape-text-muted)" }}
              >
                {formatTime(player.currentTime)} /{" "}
                {formatTime(player.duration || currentTrack.duration)}
              </p>

              <div className="flex items-center gap-2 flex-wrap">
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
            </div>

            {/* 우측: 볼륨 노브 */}
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
        className="mt-8 text-xs font-mono text-center"
        style={{ color: "var(--tape-text-muted)" }}
      ></p>
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
