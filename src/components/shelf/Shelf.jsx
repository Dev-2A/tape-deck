import TapeSpine from "./TapeSpine";

/**
 * 책장 뷰 — 카세트들이 척추를 보이며 가로로 진열.
 *
 * 시각적으로 "선반에 꽂힌" 느낌을 주기 위해 하단에 우드 그레인 라인.
 */
export default function Shelf({ tapes }) {
  return (
    <div
      className="rounded-lg p-6 overflow-x-auto"
      style={{
        backgroundColor: "var(--tape-bg-base)",
        boxShadow: "inset 0 0 30px rgba(0,0,0,0.4)",
      }}
    >
      <div
        className="flex items-end gap-1 pb-4"
        style={{
          minHeight: 320,
          // 선반 바닥 — 우드 그레인
          borderBottom: "8px solid #5a3a1f",
          boxShadow: "0 8px 0 #3a2410, 0 16px 24px rgba(0,0,0,0.5)",
          paddingTop: 20,
        }}
      >
        {tapes.map((tape, i) => (
          <TapeSpine key={tape.id} tape={tape} index={i} />
        ))}
      </div>

      <p
        className="text-xs font-mono mt-8 text-center"
        style={{ color: "var(--tape-text-muted)" }}
      >
        💡 카세트 위에 마우스를 올려보세요.
      </p>
    </div>
  );
}
