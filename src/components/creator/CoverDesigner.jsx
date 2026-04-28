import { useState } from "react";
import {
  COLOR_PRESETS,
  PATTERNS,
  EMOJI_CATALOG,
} from "../../constants/coverPalette";
import { isValidHex, getReadableTextColor } from "../../utils/colorHelpers";

/**
 * 테이프 케이스 커버 디자이너.
 *
 * Props:
 *   - cover: { bgColor, accentColor, emoji, pattern }
 *   - onChange(newCover)  — partial merge 형태로 호출
 *   - title, artist       — 텍스트 입력 필드도 같이 노출
 *   - onMetaChange({ title?, artist? })
 */
export default function CoverDesigner({
  cover,
  onChange,
  title = "",
  artist = "",
  onMetaChange,
}) {
  const [emojiCategory, setEmojiCategory] = useState("자연");
  const [customEmojiInput, setCustomEmojiInput] = useState("");
  const [customBg, setCustomBg] = useState(cover.bgColor);
  const [customAccent, setCustomAccent] = useState(cover.accentColor);

  // partial 업데이트 헬퍼
  const update = (patch) => onChange({ ...cover, ...patch });

  return (
    <div className="space-y-6">
      {/* ── 제목 / 아티스트 ── */}
      <Section title="이름">
        <div className="space-y-3">
          <Field label="제목">
            <input
              type="text"
              value={title}
              onChange={(e) => onMetaChange?.({ title: e.target.value })}
              placeholder="예: 운전할 때 듣는 노래"
              maxLength={40}
              className="w-full px-3 py-2 rounded-md text-sm border outline-none transition-colors"
              style={{
                backgroundColor: "var(--tape-bg-base)",
                borderColor: "var(--tape-border)",
                color: "var(--tape-text-primary)",
              }}
            />
          </Field>
          <Field label="아티스트 / 부제 (선택)">
            <input
              type="text"
              value={artist}
              onChange={(e) => onMetaChange?.({ artist: e.target.value })}
              placeholder="예: 2A's Mixtape"
              maxLength={40}
              className="w-full px-3 py-2 rounded-md text-sm border outline-none transition-colors"
              style={{
                backgroundColor: "var(--tape-bg-base)",
                borderColor: "var(--tape-border)",
                color: "var(--tape-text-primary)",
              }}
            />
          </Field>
        </div>
      </Section>

      {/* ── 색상 프리셋 ── */}
      <Section title="색상">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {COLOR_PRESETS.map((p) => (
            <ColorPresetButton
              key={p.id}
              preset={p}
              active={
                cover.bgColor.toLowerCase() === p.bg.toLowerCase() &&
                cover.accentColor.toLowerCase() === p.accent.toLowerCase()
              }
              onClick={() => update({ bgColor: p.bg, accentColor: p.accent })}
            />
          ))}
        </div>

        {/* Custom 색상 — 직접 고르기 */}
        <details className="mt-4 group">
          <summary
            className="cursor-pointer text-sm font-mono select-none transition-colors"
            style={{ color: "var(--tape-text-muted)" }}
          >
            ▸ 직접 색 고르기
          </summary>
          <div className="mt-3 flex gap-3 flex-wrap items-end">
            <ColorPicker
              label="배경"
              value={customBg}
              onChange={(v) => {
                setCustomBg(v);
                if (isValidHex(v)) update({ bgColor: v });
              }}
            />
            <ColorPicker
              label="포인트"
              value={customAccent}
              onChange={(v) => {
                setCustomAccent(v);
                if (isValidHex(v)) update({ accentColor: v });
              }}
            />
          </div>
        </details>
      </Section>

      {/* ── 패턴 ── */}
      <Section title="패턴">
        <div className="grid grid-cols-4 gap-2">
          {PATTERNS.map((p) => (
            <PatternButton
              key={p.id}
              pattern={p}
              active={cover.pattern === p.id}
              cover={cover}
              onClick={() => update({ pattern: p.id })}
            />
          ))}
        </div>
      </Section>

      {/* ── 이모지 ── */}
      <Section title="이모지">
        {/* 카테고리 탭 */}
        <div className="flex gap-1 mb-3 flex-wrap">
          {Object.keys(EMOJI_CATALOG).map((cat) => (
            <button
              key={cat}
              onClick={() => setEmojiCategory(cat)}
              className="px-3 py-1 rounded-md text-xs font-mono border transition-colors"
              style={{
                backgroundColor:
                  emojiCategory === cat
                    ? "var(--tape-bg-elevated)"
                    : "transparent",
                color:
                  emojiCategory === cat
                    ? "var(--tape-text-primary)"
                    : "var(--tape-text-secondary)",
                borderColor: "var(--tape-border)",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 카테고리별 이모지 그리드 */}
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 mb-3">
          {EMOJI_CATALOG[emojiCategory].map((e) => (
            <EmojiButton
              key={e}
              emoji={e}
              active={cover.emoji === e}
              onClick={() => update({ emoji: e })}
            />
          ))}
        </div>

        {/* 커스텀 이모지 입력 */}
        <div className="flex items-center gap-2 mt-2">
          <input
            type="text"
            value={customEmojiInput}
            onChange={(e) => setCustomEmojiInput(e.target.value)}
            placeholder="이모지 직접 입력 (예: 🦊)"
            maxLength={4}
            className="flex-1 px-3 py-2 rounded-md text-sm border outline-none"
            style={{
              backgroundColor: "var(--tape-bg-base)",
              borderColor: "var(--tape-border)",
              color: "var(--tape-text-primary)",
            }}
          />
          <button
            onClick={() => {
              if (customEmojiInput.trim()) {
                update({ emoji: customEmojiInput.trim() });
                setCustomEmojiInput("");
              }
            }}
            className="px-4 py-2 rounded-md text-sm font-medium border transition-opacity hover:opacity-80"
            style={{
              borderColor: "var(--tape-border)",
              color: "var(--tape-text-primary)",
              backgroundColor: "var(--tape-bg-elevated)",
            }}
          >
            적용
          </button>
        </div>
      </Section>
    </div>
  );
}

/* ───────────── 내부 컴포넌트들 ───────────── */

function Section({ title, children }) {
  return (
    <div>
      <h3
        className="font-mono text-xs uppercase tracking-wider mb-3"
        style={{ color: "var(--tape-text-muted)" }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span
        className="block text-xs font-mono mb-1"
        style={{ color: "var(--tape-text-muted)" }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

function ColorPresetButton({ preset, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-md p-3 border transition-all hover:scale-105"
      style={{
        backgroundColor: preset.bg,
        borderColor: active ? preset.accent : "transparent",
        borderWidth: active ? 3 : 1,
        outline: active ? `2px solid var(--tape-accent-amber)` : "none",
        outlineOffset: 2,
      }}
      title={preset.name}
      aria-label={preset.name}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: preset.accent }}
        />
        <span
          className="text-xs font-mono"
          style={{ color: getReadableTextColor(preset.bg) }}
        >
          {preset.name}
        </span>
      </div>
    </button>
  );
}

function PatternButton({ pattern, active, cover, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-md py-3 border transition-all hover:opacity-80"
      style={{
        backgroundColor: active ? cover.bgColor : "var(--tape-bg-base)",
        borderColor: active ? cover.accentColor : "var(--tape-border)",
        borderWidth: active ? 2 : 1,
      }}
    >
      <span
        className="text-xs font-mono"
        style={{
          color: active
            ? getReadableTextColor(cover.bgColor)
            : "var(--tape-text-secondary)",
        }}
      >
        {pattern.name}
      </span>
    </button>
  );
}

function EmojiButton({ emoji, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-md aspect-square flex items-center justify-center text-2xl transition-all hover:scale-110"
      style={{
        backgroundColor: active
          ? "var(--tape-bg-raised)"
          : "var(--tape-bg-base)",
        border: active
          ? "2px solid var(--tape-accent-amber)"
          : "1px solid var(--tape-border)",
      }}
      aria-label={`이모지 ${emoji}`}
    >
      {emoji}
    </button>
  );
}

function ColorPicker({ label, value, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <span
        className="text-xs font-mono"
        style={{ color: "var(--tape-text-muted)" }}
      >
        {label}
      </span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={isValidHex(value) ? value : "#888888"}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded cursor-pointer border-0"
          style={{ padding: 0, backgroundColor: "transparent" }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-24 px-2 py-1 rounded text-xs font-mono border outline-none"
          style={{
            backgroundColor: "var(--tape-bg-base)",
            borderColor: "var(--tape-border)",
            color: "var(--tape-text-primary)",
          }}
          placeholder="#______"
        />
      </div>
    </div>
  );
}
