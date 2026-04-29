import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { useTapes } from "../hooks/useTapes";
import { useFileDownload } from "../hooks/useFileDownload";
import { useToast } from "../contexts/ToastContext";
import { useConfirm } from "../hooks/useConfirm";
import { clearAllTapes } from "../db/tapeRepository";
import {
  exportTapesToJSON,
  parseBackupFile,
  validateBackup,
  importTapesFromPayload,
  buildBackupFilename,
} from "../services/exportImport";

export default function SettingsPage() {
  const tapes = useTapes();
  const downloadJSON = useFileDownload();
  const toast = useToast();
  const { confirm, ConfirmDialog } = useConfirm();
  const fileRef = useRef(null);

  const [importMode, setImportMode] = useState("merge");
  const [busy, setBusy] = useState(false);

  const handleExport = async () => {
    setBusy(true);
    try {
      const payload = await exportTapesToJSON();
      const filename = buildBackupFilename();
      downloadJSON(payload, filename);
      toast.success(`${payload.count}개의 테이프를 저장했어요.`);
    } catch (e) {
      console.error(e);
      toast.error("내보내기에 실패했어요.");
    }
    setBusy(false);
  };

  const handleImportClick = () => fileRef.current?.click();

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setBusy(true);
    try {
      const payload = await parseBackupFile(file);
      const v = validateBackup(payload);
      if (!v.valid) {
        toast.error(v.error);
        setBusy(false);
        return;
      }
      if (v.warning) {
        const ok = await confirm({
          title: "버전이 다른 백업이에요",
          body: `${v.warning}\n계속 진행할까요?`,
          confirmText: "진행",
        });
        if (!ok) {
          setBusy(false);
          return;
        }
      }
      const stats = await importTapesFromPayload(payload, importMode);
      toast.success(
        `가져오기 완료 — 추가 ${stats.added} · 갱신 ${stats.updated} · 건너뜀 ${stats.skipped}`,
      );
    } catch (err) {
      console.error(err);
      toast.error(err.message || "가져오기에 실패했어요.");
    }
    setBusy(false);
  };

  const handleClearAll = async () => {
    if (!tapes || tapes.length === 0) return;
    const ok = await confirm({
      title: `모든 테이프(${tapes.length}개)를 삭제할까요?`,
      body: "이 작업은 되돌릴 수 없어요. 백업을 먼저 받는 걸 추천해요.",
      confirmText: "삭제 진행",
      cancelText: "취소",
      danger: true,
    });
    if (!ok) return;
    setBusy(true);
    try {
      await clearAllTapes();
      toast.success("모든 테이프를 삭제했어요.");
    } catch (e) {
      toast.error("삭제에 실패했어요.");
    }
    setBusy(false);
  };

  const tapeCount = tapes?.length ?? 0;

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        to={ROUTES.COLLECTION}
        className="inline-block mb-6 text-sm"
        style={{ color: "var(--tape-text-secondary)" }}
      >
        ← 컬렉션으로
      </Link>

      <h1
        className="font-serif text-4xl mb-2"
        style={{ color: "var(--tape-text-primary)" }}
      >
        설정
      </h1>
      <p className="mb-10" style={{ color: "var(--tape-text-secondary)" }}>
        백업하고, 다른 기기로 옮기고, 새로 시작하세요.
      </p>

      <Section
        icon="📦"
        title="컬렉션 내보내기"
        desc={
          tapeCount === 0
            ? "아직 내보낼 테이프가 없어요."
            : `현재 ${tapeCount}개의 테이프를 단일 JSON 파일로 받습니다.`
        }
      >
        <button
          onClick={handleExport}
          disabled={busy || tapeCount === 0}
          className="px-5 py-2.5 rounded-md font-medium transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            backgroundColor: "var(--tape-accent-amber)",
            color: "var(--tape-bg-deepest)",
          }}
        >
          📥 JSON으로 다운로드
        </button>
      </Section>

      <Section
        icon="📤"
        title="컬렉션 가져오기"
        desc="이전에 내보낸 JSON 파일에서 테이프를 복원합니다."
      >
        <div className="space-y-4">
          <div>
            <p
              className="text-xs font-mono uppercase tracking-wider mb-2"
              style={{ color: "var(--tape-text-muted)" }}
            >
              같은 ID의 테이프가 이미 있을 때
            </p>
            <div className="flex gap-2 flex-wrap">
              <ModeOption
                value="merge"
                current={importMode}
                onChange={setImportMode}
                label="덮어쓰기"
                desc="가져온 내용으로 갱신"
              />
              <ModeOption
                value="skip"
                current={importMode}
                onChange={setImportMode}
                label="건너뛰기"
                desc="기존 테이프 유지"
              />
            </div>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImportFile}
            className="hidden"
          />
          <button
            onClick={handleImportClick}
            disabled={busy}
            className="px-5 py-2.5 rounded-md font-medium border transition-opacity hover:opacity-80 disabled:opacity-40"
            style={{
              backgroundColor: "transparent",
              color: "var(--tape-text-primary)",
              borderColor: "var(--tape-accent-blue)",
            }}
          >
            📂 JSON 파일 선택
          </button>
        </div>
      </Section>

      <Section
        icon="⚠️"
        title="모든 테이프 삭제"
        desc="이 작업은 되돌릴 수 없어요. 먼저 백업을 받는 걸 추천해요."
        danger
      >
        <button
          onClick={handleClearAll}
          disabled={busy || tapeCount === 0}
          className="px-5 py-2.5 rounded-md font-medium border transition-opacity hover:opacity-80 disabled:opacity-40"
          style={{
            backgroundColor: "transparent",
            color: "var(--tape-accent-rust)",
            borderColor: "var(--tape-accent-rust)",
          }}
        >
          🗑️ 모든 테이프 삭제
        </button>
      </Section>

      <Section icon="ℹ️" title="앱 정보">
        <div
          className="space-y-1 font-mono text-xs"
          style={{ color: "var(--tape-text-muted)" }}
        >
          <p>📼 Tape Deck v0.1.0</p>
          <p>저장소: 브라우저 IndexedDB (TapeDeckDB)</p>
          <p>현재 테이프: {tapeCount}개</p>
          <p>
            <a
              href="https://github.com/Dev-2A/tape-deck"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </p>
        </div>
      </Section>

      {ConfirmDialog}
    </div>
  );
}

function Section({ icon, title, desc, children, danger }) {
  return (
    <section
      className="mb-6 rounded-lg p-5 border"
      style={{
        backgroundColor: "var(--tape-bg-elevated)",
        borderColor: danger ? "var(--tape-accent-rust)" : "var(--tape-border)",
      }}
    >
      <div className="flex items-start gap-3 mb-4">
        <span className="text-2xl">{icon}</span>
        <div>
          <h2
            className="font-serif text-xl mb-1"
            style={{
              color: danger
                ? "var(--tape-accent-rust)"
                : "var(--tape-text-primary)",
            }}
          >
            {title}
          </h2>
          {desc && (
            <p
              className="text-sm"
              style={{ color: "var(--tape-text-secondary)" }}
            >
              {desc}
            </p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

function ModeOption({ value, current, onChange, label, desc }) {
  const active = current === value;
  return (
    <button
      onClick={() => onChange(value)}
      className="text-left px-4 py-3 rounded-md border transition-all flex-1 min-w-[160px]"
      style={{
        borderColor: active ? "var(--tape-accent-amber)" : "var(--tape-border)",
        backgroundColor: active
          ? "var(--tape-bg-raised)"
          : "var(--tape-bg-base)",
      }}
    >
      <p
        className="text-sm font-medium mb-1"
        style={{ color: "var(--tape-text-primary)" }}
      >
        {label}
      </p>
      <p className="text-xs" style={{ color: "var(--tape-text-muted)" }}>
        {desc}
      </p>
    </button>
  );
}
