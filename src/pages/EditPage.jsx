import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ROUTES, buildRoute } from "../constants/routes";
import { useTape } from "../hooks/useTapes";
import { updateTape } from "../db/tapeRepository";
import { useToast } from "../contexts/ToastContext";
import CassetteSVG from "../components/tape/CassetteSVG";
import CoverDesigner from "../components/creator/CoverDesigner";
import TrackListInput from "../components/creator/TrackListInput";

export default function EditPage() {
  const { tapeId } = useParams();
  const navigate = useNavigate();
  const tape = useTape(tapeId);
  const toast = useToast();

  const [cover, setCover] = useState(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [sideA, setSideA] = useState([]);
  const [sideB, setSideB] = useState([]);
  const [previewSide, setPreviewSide] = useState("A");
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (tape && !loaded) {
      setCover(tape.cover);
      setTitle(tape.title || "");
      setArtist(tape.artist || "");
      setSideA(tape.sideA || []);
      setSideB(tape.sideB || []);
      setLoaded(true);
    }
  }, [tape, loaded]);

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

  const previewTitle = title.trim() || "제목 없는 테이프";
  const totalTracks = sideA.length + sideB.length;

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("테이프 제목을 입력해주세요.");
      return;
    }
    if (totalTracks === 0) {
      toast.error("최소 1곡 이상 필요해요.");
      return;
    }

    setSaving(true);
    try {
      await updateTape(tapeId, {
        title: title.trim(),
        artist: artist.trim(),
        cover,
        sideA,
        sideB,
      });
      toast.success("변경사항이 저장됐어요.");
      navigate(buildRoute.play(tapeId));
    } catch (e) {
      console.error(e);
      toast.error("저장에 실패했어요.");
      setSaving(false);
    }
  };

  if (!cover) return null;

  return (
    <div>
      <Link
        to={buildRoute.play(tapeId)}
        className="inline-block mb-6 text-sm"
        style={{ color: "var(--tape-text-secondary)" }}
      >
        ← 재생으로
      </Link>

      <div className="mb-8">
        <h1
          className="font-serif text-4xl mb-2"
          style={{ color: "var(--tape-text-primary)" }}
        >
          테이프 편집
        </h1>
        <p style={{ color: "var(--tape-text-secondary)" }}>
          색상·곡·이름을 자유롭게 수정하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
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
              {saving ? "저장 중..." : "💾 변경사항 저장"}
            </button>

            <button
              type="button"
              onClick={() => navigate(buildRoute.play(tapeId))}
              className="w-full px-6 py-2 rounded-md text-sm border transition-opacity hover:opacity-80"
              style={{
                borderColor: "var(--tape-border)",
                color: "var(--tape-text-secondary)",
                backgroundColor: "transparent",
              }}
            >
              취소
            </button>
          </div>
        </div>

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

          <div
            className="border-t"
            style={{ borderColor: "var(--tape-border)" }}
          />

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
