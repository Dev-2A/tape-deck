import { useEffect, useRef, useState, useCallback } from "react";
import { useYouTubeIframeApi } from "./useYouTubeIframeApi";

const STATE_MAP = {
  "-1": "unstarted",
  0: "ended",
  1: "playing",
  2: "paused",
  3: "buffering",
  5: "cued",
};

export function useYouTubePlayer(containerRef, options = {}) {
  const {
    videoId = null,
    initialVolume = 70,
    onEnded,
    onError,
    onReady,
  } = options;

  const { ready: apiReady, error: apiError } = useYouTubeIframeApi();
  const playerRef = useRef(null);
  const tickRef = useRef(null);
  const mountedRef = useRef(false); // 자식 div를 한 번만 만들기 위한 가드

  // 콜백 최신값 보관
  const onEndedRef = useRef(onEnded);
  const onErrorRef = useRef(onError);
  const onReadyRef = useRef(onReady);
  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);
  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);
  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  const [isReady, setIsReady] = useState(false);
  const [state, setState] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(initialVolume);
  const [retryTick, setRetryTick] = useState(0);

  // 매 렌더마다 컨테이너가 준비됐는지 체크하고, 한 번만 player 생성
  useEffect(() => {
    if (!apiReady) return;
    if (mountedRef.current) return;
    const node = containerRef.current;
    if (!node) {
      // ref가 아직 안 잡혔으면 다음 frame에 다시 시도
      const id = requestAnimationFrame(() => setRetryTick((t) => t + 1));
      return () => cancelAnimationFrame(id);
    }

    // 자식 div를 만들어서 거기에 마운트
    // (YT.Player는 element를 iframe으로 '교체'하므로 부모는 보호하기 위해)
    const playerDiv = document.createElement("div");
    playerDiv.style.width = "100%";
    playerDiv.style.height = "100%";
    node.innerHTML = ""; // 혹시 있을 잔재 정리
    node.appendChild(playerDiv);
    mountedRef.current = true;

    const player = new window.YT.Player(playerDiv, {
      videoId: videoId || undefined,
      width: "100%",
      height: "100%",
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        modestbranding: 1,
        playsinline: 1,
        rel: 0,
        iv_load_policy: 3,
      },
      events: {
        onReady: (e) => {
          playerRef.current = e.target;
          try {
            e.target.setVolume(initialVolume);
          } catch {}
          setIsReady(true);
          try {
            setDuration(e.target.getDuration?.() || 0);
          } catch {}
          if (onReadyRef.current) onReadyRef.current(e.target);
        },
        onStateChange: (e) => {
          const s = STATE_MAP[String(e.data)] || null;
          setState(s);
          try {
            const d = e.target.getDuration?.();
            if (typeof d === "number" && !isNaN(d)) setDuration(d);
          } catch {}
          if (s === "ended" && onEndedRef.current) onEndedRef.current();
        },
        onError: (e) => {
          if (onErrorRef.current) onErrorRef.current(e.data);
        },
      },
    });

    return () => {
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }
      try {
        player.destroy?.();
      } catch {}
      playerRef.current = null;
      mountedRef.current = false;
      // iframe으로 교체된 자식을 부모에서 비움
      try {
        if (node) node.innerHTML = "";
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiReady, retryTick]);

  // 재생 중일 때 currentTime 폴링
  useEffect(() => {
    if (!isReady) return;
    if (state === "playing") {
      tickRef.current = setInterval(() => {
        try {
          const t = playerRef.current?.getCurrentTime?.() ?? 0;
          setCurrentTime(t);
          const d = playerRef.current?.getDuration?.() ?? 0;
          if (d && d !== duration) setDuration(d);
        } catch {}
      }, 250);
    }
    return () => {
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }
    };
  }, [isReady, state, duration]);

  // videoId 외부 변경 시 새 영상 로드
  useEffect(() => {
    if (!isReady) return;
    if (!videoId) return;
    try {
      playerRef.current?.loadVideoById?.({ videoId });
      setCurrentTime(0);
    } catch {}
  }, [videoId, isReady]);

  const play = useCallback(() => {
    try {
      playerRef.current?.playVideo?.();
    } catch {}
  }, []);
  const pause = useCallback(() => {
    try {
      playerRef.current?.pauseVideo?.();
    } catch {}
  }, []);
  const seekTo = useCallback((seconds, allowSeekAhead = true) => {
    try {
      playerRef.current?.seekTo?.(seconds, allowSeekAhead);
      setCurrentTime(seconds);
    } catch {}
  }, []);
  const setVolume = useCallback((v) => {
    const clamped = Math.max(0, Math.min(100, Math.round(v)));
    try {
      playerRef.current?.setVolume?.(clamped);
      setVolumeState(clamped);
    } catch {}
  }, []);
  const loadVideo = useCallback((id, autoplay = false) => {
    if (!id) return;
    try {
      if (autoplay) playerRef.current?.loadVideoById?.({ videoId: id });
      else playerRef.current?.cueVideoById?.({ videoId: id });
    } catch {}
  }, []);

  return {
    isReady,
    state,
    currentTime,
    duration,
    volume,
    apiError,
    play,
    pause,
    seekTo,
    setVolume,
    loadVideo,
  };
}
