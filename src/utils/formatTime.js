/**
 * 초 단위 숫자를 "M:SS" 형식 문자열로.
 * 1시간 이상이면 "H:MM:SS"로.
 *
 * @param {number} sec
 * @returns {string}
 */
export function formatTime(sec) {
  if (!sec || isNaN(sec) || sec < 0) return "0:00";
  const total = Math.floor(sec);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}
