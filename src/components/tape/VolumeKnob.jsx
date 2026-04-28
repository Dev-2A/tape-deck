import { useId } from "react";
import { useKnobDrag, valueToAngle } from "../../hooks/useKnobDrag";

/**
 * 회전 노브 볼륨 컨트롤.
 *
 * - 270° 호 회전 (-135° ~ +135°)
 * - 드래그 / 휠 / 키보드 화살표
 * - SVG 270x270 viewBox; 외부에서 size로 픽셀 크기 조절
 *
 * Props:
 *   - value (0~100)
 *   - onChange(v)
 *   - size (px, 기본 140)
 *   - label (기본 'VOL')
 */
export default function VolumeKnob({
  value = 70,
  onChange,
  size = 140,
  label = "VOL",
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const angle = valueToAngle(value);
  const { wheelTargetRef, onPointerDown, onKeyDown } = useKnobDrag({
    value,
    onChange,
    min: 0,
    max: 100,
    step: 1,
    sensitivity: 200,
  });

  // 눈금 (270° 호를 11개 눈금으로)
  const ticks = [];
  const N = 11;
  for (let i = 0; i < N; i++) {
    const a = -135 + (270 / (N - 1)) * i;
    ticks.push(a);
  }

  // 그라데이션·필터 ID
  const knobGradId = `knob-grad-${uid}`;
  const knobShadowId = `knob-shadow-${uid}`;
  const ringGradId = `ring-grad-${uid}`;

  return (
    <div
      className="inline-flex flex-col items-center gap-2 select-none"
      style={{ width: size }}
    >
      <svg
        ref={wheelTargetRef}
        viewBox="0 0 270 270"
        width={size}
        height={size}
        role="slider"
        tabIndex={0}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-label={`${label} 볼륨 노브`}
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
        style={{
          cursor: "ns-resize",
          touchAction: "none",
          outline: "none",
        }}
      >
        <defs>
          <radialGradient id={knobGradId} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#3a2f24" />
            <stop offset="60%" stopColor="#1f1a14" />
            <stop offset="100%" stopColor="#0d0a08" />
          </radialGradient>

          <linearGradient id={ringGradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5a4a3a" />
            <stop offset="100%" stopColor="#2a221a" />
          </linearGradient>

          <filter
            id={knobShadowId}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* 외곽 링 (눈금이 그려질 면) */}
        <circle cx="135" cy="135" r="125" fill={`url(#${ringGradId})`} />
        <circle
          cx="135"
          cy="135"
          r="125"
          fill="none"
          stroke="#0d0a08"
          strokeWidth="1"
        />

        {/* 눈금 */}
        {ticks.map((a, i) => {
          const isMajor =
            i === 0 || i === Math.floor((N - 1) / 2) || i === N - 1;
          const length = isMajor ? 14 : 8;
          const stroke = isMajor ? "var(--tape-accent-amber)" : "#7a6c54";
          // 눈금 그리는 좌표 (135, 135) 기준, 반지름 110~110+length
          const rad = (a - 90) * (Math.PI / 180);
          const x1 = 135 + Math.cos(rad) * 110;
          const y1 = 135 + Math.sin(rad) * 110;
          const x2 = 135 + Math.cos(rad) * (110 - length);
          const y2 = 135 + Math.sin(rad) * (110 - length);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={stroke}
              strokeWidth={isMajor ? 2.5 : 1.5}
              strokeLinecap="round"
              opacity={isMajor ? 0.95 : 0.6}
            />
          );
        })}

        {/* 진행 호 (현재 값까지 빛나는 호) */}
        <ProgressArc value={value} />

        {/* 노브 본체 */}
        <g transform={`rotate(${angle} 135 135)`}>
          <circle
            cx="135"
            cy="135"
            r="80"
            fill={`url(#${knobGradId})`}
            filter={`url(#${knobShadowId})`}
          />
          {/* 노브 위쪽 광택 */}
          <ellipse
            cx="135"
            cy="105"
            rx="50"
            ry="20"
            fill="white"
            opacity="0.08"
          />
          {/* 인디케이터 (12시 방향에서 위로 향한 작은 마커) */}
          <rect
            x="131"
            y="62"
            width="8"
            height="22"
            rx="2"
            fill="var(--tape-accent-amber)"
          />
          {/* 중심 작은 점 */}
          <circle cx="135" cy="135" r="3" fill="#7a6c54" opacity="0.6" />
        </g>
      </svg>

      <div className="text-center">
        <p
          className="text-xs font-mono tracking-wider"
          style={{ color: "var(--tape-text-muted)" }}
        >
          {label}
        </p>
        <p
          className="text-sm font-mono"
          style={{ color: "var(--tape-text-secondary)" }}
        >
          {Math.round(value)}
        </p>
      </div>
    </div>
  );
}

/**
 * 0°(7시) 부터 현재 값까지 빛나는 호.
 * SVG arc path 직접 그리기.
 */
function ProgressArc({ value }) {
  const cx = 135;
  const cy = 135;
  const r = 105;
  const startAngle = -135; // 7시
  const endAngle = valueToAngle(value);

  const startRad = (startAngle - 90) * (Math.PI / 180);
  const endRad = (endAngle - 90) * (Math.PI / 180);

  const x1 = cx + r * Math.cos(startRad);
  const y1 = cy + r * Math.sin(startRad);
  const x2 = cx + r * Math.cos(endRad);
  const y2 = cy + r * Math.sin(endRad);

  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  // value가 0이면 호 그리지 않음 (path가 0 길이일 때 일부 브라우저에서 점이 찍힘)
  if (Math.abs(endAngle - startAngle) < 0.5) return null;

  const d = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;

  return (
    <path
      d={d}
      fill="none"
      stroke="var(--tape-accent-blue)"
      strokeWidth="3"
      strokeLinecap="round"
      opacity="0.85"
    />
  );
}
