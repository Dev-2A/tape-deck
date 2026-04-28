import { useState, useCallback } from "react";
import { extractVideoId, createTrack } from "../db/trackHelpers";
import { fetchYouTubeMeta } from "../services/youtubeMeta";

/**
 * YouTube URL 입력 → 트랙 추가까지의 흐름을 한 번에 처리.
 *
 * 사용 예:
 *   const { input, setInput, error, loading, addFromInput } = useTrackInput()
 *   const handleSubmit = async () => {
 *     const track = await addFromInput()
 *     if (track) onAdd(track)  // 부모에 알림
 *   }
 */
export function useTrackInput() {
  const [input, setInput] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const reset = useCallback(() => {
    setInput("");
    setError(null);
    setLoading(false);
  }, []);

  /**
   * 현재 input을 트랙으로 변환하고 반환. 실패 시 null.
   * 실패 사유는 error 상태에 기록.
   */
  const addFromInput = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed) {
      setError("URL을 입력해주세요");
      return null;
    }

    const videoId = extractVideoId(trimmed);
    if (!videoId) {
      setError("올바른 YouTube URL이 아니에요");
      return null;
    }

    setError(null);
    setLoading(true);

    // 메타데이터 조회 — 실패해도 트랙은 만들어짐
    const meta = await fetchYouTubeMeta(videoId);
    setLoading(false);

    const track = createTrack({
      videoId,
      title: meta?.title || `YouTube · ${videoId}`,
      duration: 0, // 재생 시 useYouTubePlayer가 채움
    });

    setInput("");
    return track;
  }, [input]);

  return {
    input,
    setInput,
    error,
    loading,
    addFromInput,
    reset,
  };
}
