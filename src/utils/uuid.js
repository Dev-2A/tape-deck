/**
 * 간단한 UUID v4 생성기.
 * 브라우저 내장 crypto.randomUUID를 우선 사용하고, 없으면 폴백.
 */
export function uuid() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  // 폴백: RFC4122 v4 (안전성은 떨어지지만 ID 충돌만 피하면 충분)
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
