import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES, buildRoute } from "../constants/routes";
import CassetteSVG from "../components/tape/CassetteSVG";
import CoverDesigner from "../components/creator/CoverDesigner";
import TrackListInput from "../components/creator/TrackListInput";
import { addTape, createBlankTape } from "../db/tapeRepository";

const DEFAULT_COVER = {
  bgColor: "#8fb8d9",
  accentColor: "#d4a574",
  emoji: "📼",
  pattern: "solid",
};

export default function CreatePage() {
  const navigate = useNavigate();

  const [cover, setCover] = useState(DEFAULT_COVER);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [sideA, setSideA] = useState([]);
  const [sideB, setSideB] = useState([]);
  const [previewSide, setPreviewSide] = useState("A");
  const [saving, setSaving] = useState(false);

  const previewTitle = title.trim() || "제목 없는 테이프";
  const totalTracks = sideA.length + sideB.length;

  const handleSave = async () => {
    if (!title.trim()) {
      alert("테이프 제목을 입력해주세요.");
      return;
    }
    if (totalTracks === 0) {
      alert("최소 1곡 이상 추가해주세요.");
      return;
    }

    setSaving(true);
    try {
      const tape = createBlankTape({
        title: title.trim(),
        artist: artist.trim(),
        cover,
        sideA,
        sideB,
      });
      await addTape(tape);
      // 저장 후 바로 재생 페이지로
      navigate(buildRoute.play(tape.id));
    } catch (e) {
      console.error(e);
      alert("저장에 실패했어요. 다시 시도해주세요.");
      setSaving(false);
    }
  };

  return (
    <div>
      <Link
        to={ROUTES.COLLECTION}
        className="inline-block mb-6 text-sm"
        style={{ color: "var(--tape-text-secondary)" }}
      >
        ← 컬렉션으로
      </Link>

      <div className="mb-8">
        <h1
          className="font-serif text-4xl mb-2"
          style={{ color: "var(--tape-text-primary)" }}
        >
          새 테이프 만들기
        </h1>
        <p style={{ color: "var(--tape-text-secondary)" }}>
          한 면당 곡을 담고, 케이스를 직접 디자인하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
        {/* ── 좌측: 라이브 미리보기 (sticky) ── */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-24 space-y-4">
            <p
              className="font-mono text-xs uppercase tracking-wider"
              style={{ color: "var(--tape-text-muted)" }}
            >
              미리보기 · {previewSide}면
            </p>

            <CassetteSVG
              cover={cover}
              title={previewTitle}
              artist={artist}
              side={previewSide}
            />

            {/* 미리보기 면 토글 */}
            <div className="flex justify-center gap-2">
              {["A", "B"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setPreviewSide(s)}
                  className="px-4 py-1.5 rounded-md text-xs font-mono border"
                  style={{
                    backgroundColor:
                      previewSide === s
                        ? "var(--tape-accent-amber)"
                        : "transparent",
                    color:
                      previewSide === s
                        ? "var(--tape-bg-deepest)"
                        : "var(--tape-text-secondary)",
                    borderColor:
                      previewSide === s
                        ? "var(--tape-accent-amber)"
                        : "var(--tape-border)",
                  }}
                >
                  {s}면 ({(s === "A" ? sideA : sideB).length})
                </button>
              ))}
            </div>

            {/* 저장 버튼 */}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !title.trim() || totalTracks === 0}
              className="w-full px-6 py-3 rounded-md font-medium border transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--tape-accent-blue)",
                color: "var(--tape-bg-deepest)",
                borderColor: "var(--tape-accent-blue)",
              }}
            >
              {saving ? "저장 중..." : `📼 테이프로 저장 (${totalTracks}곡)`}
            </button>

            {totalTracks === 0 && (
              <p
                className="text-xs font-mono text-center"
                style={{ color: "var(--tape-text-muted)" }}
              >
                최소 1곡 이상 필요해요
              </p>
            )}
          </div>
        </div>

        {/* ── 우측: 디자이너 + 트랙 입력 ── */}
        <div className="lg:col-span-3 space-y-10">
          <CoverDesigner
            cover={cover}
            onChange={setCover}
            title={title}
            artist={artist}
            onMetaChange={(p) => {
              if (p.title !== undefined) setTitle(p.title);
              if (p.artist !== undefined) setArtist(p.artist);
            }}
          />

          {/* 구분선 */}
          <div
            className="border-t"
            style={{ borderColor: "var(--tape-border)" }}
          />

          {/* 트랙 입력 — A면 / B면 */}
          <div className="space-y-8">
            <h2
              className="font-serif text-2xl"
              style={{ color: "var(--tape-text-primary)" }}
            >
              곡 담기
            </h2>

            <TrackListInput
              side="A"
              tracks={sideA}
              onChange={setSideA}
              accentColor={cover.accentColor}
            />

            <TrackListInput
              side="B"
              tracks={sideB}
              onChange={setSideB}
              accentColor={cover.accentColor}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
