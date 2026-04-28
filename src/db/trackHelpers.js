import { uuid } from "../utils/uuid";

/**
 * 새 트랙 객체 생성.
 * Step 5에서 YouTube oEmbed로 title/duration을 자동 채울 예정.
 */
export function createTrack({ videoId, title = "", duration = 0 } = {}) {
  return {
    id: uuid(),
    videoId,
    title,
    duration,
  };
}

/**
 * YouTube URL에서 video ID 추출.
 *  - https://www.youtube.com/watch?v=XXXX
 *  - https://youtu.be/XXXX
 *  - https://www.youtube.com/embed/XXXX
 *  - https://www.youtube.com/shorts/XXXX
 *
 * @returns {string|null}
 */
export function extractVideoId(url) {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  // 11자리 ID만 그대로 입력한 경우
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  try {
    const u = new URL(trimmed);
    const host = u.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = u.pathname.slice(1);
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      // /watch?v=XXXX
      const v = u.searchParams.get("v");
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;

      // /embed/XXXX or /shorts/XXXX
      const m = u.pathname.match(/^\/(embed|shorts)\/([a-zA-Z0-9_-]{11})/);
      if (m) return m[2];
    }

    return null;
  } catch {
    return null;
  }
}
