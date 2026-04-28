import { useEffect, useRef, useState } from "react";

/**
 * 재생 상태에 따라 회전 각도를 누적하는 훅.
 *
 * - playing=true 일 때 매 frame마다 degreesPerSecond/60 만큼 각도 증가.
 * - playing=false 가 되면 그 자리에서 멈춘다 (각도는 0으로 리셋되지 않음).
 * - 각도는 0~360 으로 정규화되어 SVG transform에 그대로 사용.
 *
 * @param {boolean} playing
 * @param {number} degreesPerSecond - 초당 회전 각도 (기본 90deg/s)
 * @returns {number} 0~360 사이의 각도
 */
export function useReelRotation(playing, degreesPerSecond = 90) {
  const [rotation, setRotation] = useState(0);
  const rotationRef = useRef(0);
  const lastTsRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!playing) {
      // 정지 - 마지막 ts를 비워서 다시 시작 시 점프 없도록
      lastTsRef.current = null;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    const tick = (ts) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const deltaSec = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      // 누적 각도 갱신
      rotationRef.current =
        (rotationRef.current + degreesPerSecond * deltaSec) % 360;
      setRotation(rotationRef.current);

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTsRef.current = null;
    };
  }, [playing, degreesPerSecond]);

  return rotation;
}
