import { useState, useCallback } from "react";

/**
 * 리스트 항목 드래그 앤 드롭으로 순서 변경.
 *
 * 사용:
 *   const items = [...]
 *   const { draggingIndex, getItemProps } = useDraggableList(items, setItems)
 *   items.map((item, i) => <li {...getItemProps(i)}>...</li>)
 *
 * getItemProps(i)는 onDragStart, onDragOver, onDrop, onDragEnd, draggable=true를 반환.
 */
export function useDraggableList(items, onChange) {
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);

  const getItemProps = useCallback(
    (index) => ({
      draggable: true,
      onDragStart: (e) => {
        setDraggingIndex(index);
        e.dataTransfer.effectAllowed = "move";
        // 일부 브라우저(파이어폭스)는 dataTransfer에 뭔가 있어야 동작
        try {
          e.dataTransfer.setData("text/plain", String(index));
        } catch {}
      },
      onDragOver: (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (hoverIndex !== index) setHoverIndex(index);
      },
      onDragLeave: () => {
        // 살짝 디바운스 — 빠른 hover에서 깜빡거림 방지를 위해 비움
      },
      onDrop: (e) => {
        e.preventDefault();
        const from = draggingIndex;
        const to = index;
        if (from === null || from === to) {
          setDraggingIndex(null);
          setHoverIndex(null);
          return;
        }
        const next = [...items];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        onChange(next);
        setDraggingIndex(null);
        setHoverIndex(null);
      },
      onDragEnd: () => {
        setDraggingIndex(null);
        setHoverIndex(null);
      },
    }),
    [items, onChange, draggingIndex, hoverIndex],
  );

  return {
    draggingIndex,
    hoverIndex,
    getItemProps,
  };
}
