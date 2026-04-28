/**
 * 테이프 검색 필터.
 * 제목 / 아티스트 / 이모지 부분 일치 (대소문자 무시).
 */
export function filterTapes(tapes, query) {
  if (!query || !query.trim()) return tapes;
  const q = query.trim().toLowerCase();
  return tapes.filter((t) => {
    const title = (t.title || "").toLowerCase();
    const artist = (t.artist || "").toLowerCase();
    const emoji = t.cover?.emoji || "";
    return (
      title.includes(q) || artist.includes(q) || emoji === q.trim() // 이모지는 정확히 일치할 때만 (부분일치 무의미)
    );
  });
}

/**
 * 정렬 모드.
 */
export const SORT_MODES = {
  recent: { id: "recent", label: "최근 수정순" },
  oldest: { id: "oldest", label: "오래된순" },
  title: { id: "title", label: "제목순 (가나다)" },
  played: { id: "played", label: "많이 들은순" },
};

export function sortTapes(tapes, mode) {
  const arr = [...tapes];
  switch (mode) {
    case "oldest":
      return arr.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    case "title":
      return arr.sort((a, b) =>
        (a.title || "").localeCompare(b.title || "", "ko"),
      );
    case "played":
      return arr.sort((a, b) => (b.playCount || 0) - (a.playCount || 0));
    case "recent":
    default:
      return arr.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  }
}
