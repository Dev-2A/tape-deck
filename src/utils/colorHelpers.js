/**
 * HEX 색상의 인지 밝기 (0~1).
 * ITU-R BT.601 가중치 사용.
 */
export function getLuminance(hex) {
  if (!hex || typeof hex !== "string") return 0;
  const m = hex.replace("#", "");
  const full =
    m.length === 3
      ? m
          .split("")
          .map((c) => c + c)
          .join("")
      : m;
  if (full.length !== 6) return 0;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return (r * 0.299 + g * 0.587 + b * 0.114) / 255;
}

/**
 * 어두운 배경 위에 올라갈 때 읽히는 색을 반환.
 */
export function readableOnDark(accentColor) {
  return getLuminance(accentColor) > 0.5 ? accentColor : "#f5ead5";
}

/**
 * 색 위에 올라갈 텍스트 색을 결정.
 * 배경이 밝으면 어두운 글자, 어두우면 밝은 글자.
 */
export function getReadableTextColor(bgColor) {
  return getLuminance(bgColor) > 0.5 ? "#15110d" : "#f5ead5";
}

/**
 * HEX 형식 검증.
 */
export function isValidHex(s) {
  if (!s || typeof s !== "string") return false;
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(s);
}
