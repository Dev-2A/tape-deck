export const REPEAT_MODES = ["off", "track", "side"];

export const REPEAT_LABELS = {
  off: { icon: "🔁", text: "반복 끔", color: "var(--tape-text-muted)" },
  track: { icon: "🔂", text: "한 곡 반복", color: "var(--tape-accent-amber)" },
  side: { icon: "🔁", text: "한 면 반복", color: "var(--tape-accent-blue)" },
};

/** 다음 모드로 순환 */
export function nextRepeatMode(mode) {
  const i = REPEAT_MODES.indexOf(mode);
  return REPEAT_MODES[(i + 1) % REPEAT_MODES.length];
}
