/**
 * YouTube 트랙 메타데이터 조회 — 키 없이 oEmbed만 사용.
 *
 * - 제목: oEmbed로 즉시 조회 가능
 * - 재생시간: oEmbed에 없음 → IFrame Player에서 영상 로드 시 자동 채움 (Step 5-3)
 *
 * 네트워크 실패 시 null 반환. 호출 측에서 폴백 처리.
 */

const OEMBED_ENDPOINT = "https://www.youtube.com/oembed";

/**
 * @param {string} videoId
 * @returns {Promise<{title:string, author:string, thumbnailUrl:string} | null>}
 */
export async function fetchYouTubeMeta(videoId) {
  if (!videoId) return null;
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  const oembedUrl = `${OEMBED_ENDPOINT}?url=${encodeURIComponent(url)}&format=json`;

  try {
    const res = await fetch(oembedUrl);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      title: data.title || "",
      author: data.author_name || "",
      thumbnailUrl: data.thumbnail_url || "",
    };
  } catch {
    return null;
  }
}

/**
 * 여러 비디오의 메타데이터를 병렬로 조회.
 * 일부가 실패해도 나머지는 진행.
 */
export async function fetchManyYouTubeMeta(videoIds) {
  const results = await Promise.allSettled(
    videoIds.map((id) => fetchYouTubeMeta(id)),
  );
  return results.map((r) => (r.status === "fulfilled" ? r.value : null));
}
