import { useEffect, useState } from "react";

/**
 * window.YT.Player 가 준비됐는지 폴링으로 확인.
 *
 * - 동적 스크립트 삽입 + onYouTubeIframeAPIReady 콜백 의존 방식은
 *   index.html 정적 삽입과 race condition이 있어 사용하지 않음.
 * - 폴링은 가볍고(100ms) 환경에 무관하게 안정적.
 */
export function useYouTubeIframeApi() {
  const [ready, setReady] = useState(
    typeof window !== "undefined" &&
      !!window.YT &&
      typeof window.YT.Player === "function",
  );
  const [error, setError] = useState(null);

  useEffect(() => {
    if (ready) return;
    if (typeof window === "undefined") return;

    // 100ms 간격 폴링
    const intervalId = setInterval(() => {
      if (window.YT && typeof window.YT.Player === "function") {
        setReady(true);
        clearInterval(intervalId);
      }
    }, 100);

    // 30초 타임아웃 (네트워크 차단 등 비정상 상황)
    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      if (!window.YT || typeof window.YT.Player !== "function") {
        setError(new Error("YouTube IFrame API 로드 타임아웃 (30초)"));
      }
    }, 30000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [ready]);

  return { ready, error };
}
