import { useEffect, useRef, useCallback } from "react";

export function valueToAngle(value, min = 0, max = 100) {
  const clamped = Math.max(min, Math.min(max, value));
  const ratio = (clamped - min) / (max - min);
  return -135 + ratio * 270;
}

export function useKnobDrag({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  sensitivity = 200,
}) {
  const wheelTargetRef = useRef(null);
  const startRef = useRef({ y: 0, value: 0 });
  const isDraggingRef = useRef(false);

  // 콜백·값 최신값 보관
  const onChangeRef = useRef(onChange);
  const valueRef = useRef(value);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const clampSnap = useCallback(
    (v) => {
      const c = Math.max(min, Math.min(max, v));
      if (step <= 1) return Math.round(c);
      return Math.round(c / step) * step;
    },
    [min, max, step],
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();
      const dy = e.clientY - startRef.current.y;
      const delta = (-dy / sensitivity) * (max - min);
      const next = clampSnap(startRef.current.value + delta);
      onChangeRef.current?.(next);
    },
    [sensitivity, max, min, clampSnap],
  );

  const handlePointerUp = useCallback(() => {
    isDraggingRef.current = false;
    document.body.style.cursor = "";
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
    window.removeEventListener("pointercancel", handlePointerUp);
  }, [handlePointerMove]);

  const onPointerDown = useCallback(
    (e) => {
      e.preventDefault();
      isDraggingRef.current = true;
      startRef.current = { y: e.clientY, value: valueRef.current };
      document.body.style.cursor = "ns-resize";
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
      window.addEventListener("pointercancel", handlePointerUp);
    },
    [handlePointerMove, handlePointerUp],
  );

  // ── 휠: 직접 addEventListener로 등록 (React onWheel은 passive라 preventDefault 안 됨)
  useEffect(() => {
    const node = wheelTargetRef.current;
    if (!node) return;

    const handleWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const dir = e.deltaY > 0 ? -1 : 1;
      const next = clampSnap(valueRef.current + dir * step * 2);
      onChangeRef.current?.(next);
    };

    node.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      node.removeEventListener("wheel", handleWheel);
    };
  }, [clampSnap, step]);

  // 키보드
  const onKeyDown = useCallback(
    (e) => {
      let handled = true;
      let next = valueRef.current;
      switch (e.key) {
        case "ArrowUp":
        case "ArrowRight":
          next = clampSnap(valueRef.current + step);
          break;
        case "ArrowDown":
        case "ArrowLeft":
          next = clampSnap(valueRef.current - step);
          break;
        case "Home":
          next = min;
          break;
        case "End":
          next = max;
          break;
        case "PageUp":
          next = clampSnap(valueRef.current + step * 10);
          break;
        case "PageDown":
          next = clampSnap(valueRef.current - step * 10);
          break;
        default:
          handled = false;
      }
      if (handled) {
        e.preventDefault();
        onChangeRef.current?.(next);
      }
    },
    [step, min, max, clampSnap],
  );

  // 언마운트 정리
  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      document.body.style.cursor = "";
    };
  }, [handlePointerMove, handlePointerUp]);

  return {
    wheelTargetRef,
    isDragging: isDraggingRef.current,
    onPointerDown,
    onKeyDown,
  };
}
