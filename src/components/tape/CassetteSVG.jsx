import { useId } from "react";
import { readableOnDark } from "../../utils/colorHelpers";

/**
 * 카세트테이프 SVG — 정지 상태의 미학적 디자인.
 *
 * useId()로 각 인스턴스에 고유 ID를 부여해서
 * 같은 페이지에 여러 카세트가 있어도 색·패턴이 섞이지 않도록.
 */
export default function CassetteSVG({
  cover = {},
  title = "제목 없는 테이프",
  artist = "",
  side = "A",
  reelRotation = 0,
  playing = false,
  className = "",
  style = {},
}) {
  const bgColor = cover.bgColor || "#8fb8d9";
  const accentColor = cover.accentColor || "#d4a574";
  const emoji = cover.emoji || "📼";
  const pattern = cover.pattern || "solid";

  // 각 인스턴스에 고유 suffix
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");

  const labelGradId = `tape-label-grad-${uid}`;
  const shellGradId = `tape-shell-grad-${uid}`;
  const patternStripesId = `tape-pat-stripes-${uid}`;
  const patternDotsId = `tape-pat-dots-${uid}`;
  const patternGridId = `tape-pat-grid-${uid}`;
  const tapeShadowId = `tape-shadow-${uid}`;
  const labelShadowId = `label-shadow-${uid}`;

  // pattern 종류에 따라 사용할 fill URL 결정
  const patternIdMap = {
    stripes: patternStripesId,
    dots: patternDotsId,
    grid: patternGridId,
  };
  const shellFill =
    pattern === "solid"
      ? `url(#${shellGradId})`
      : `url(#${patternIdMap[pattern] || shellGradId})`;

  return (
    <svg
      viewBox="0 0 800 500"
      xmlns="http://www.w3.org/2000/svg"
      className={`${playing ? "tape-playing" : ""} ${className}`}
      style={{
        width: "100%",
        height: "auto",
        display: "block",
        ...style,
      }}
      aria-label={`카세트테이프: ${title}`}
    >
      <defs>
        <linearGradient id={shellGradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={bgColor} stopOpacity="1" />
          <stop offset="100%" stopColor={bgColor} stopOpacity="0.85" />
        </linearGradient>

        <linearGradient id={labelGradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5ead5" stopOpacity="1" />
          <stop offset="100%" stopColor="#e8d8b8" stopOpacity="1" />
        </linearGradient>

        <pattern
          id={patternStripesId}
          patternUnits="userSpaceOnUse"
          width="20"
          height="20"
          patternTransform="rotate(45)"
        >
          <rect width="20" height="20" fill={bgColor} />
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="20"
            stroke={accentColor}
            strokeWidth="2"
            opacity="0.25"
          />
        </pattern>

        <pattern
          id={patternDotsId}
          patternUnits="userSpaceOnUse"
          width="16"
          height="16"
        >
          <rect width="16" height="16" fill={bgColor} />
          <circle cx="8" cy="8" r="1.5" fill={accentColor} opacity="0.3" />
        </pattern>

        <pattern
          id={patternGridId}
          patternUnits="userSpaceOnUse"
          width="24"
          height="24"
        >
          <rect width="24" height="24" fill={bgColor} />
          <path
            d="M 24 0 L 0 0 0 24"
            fill="none"
            stroke={accentColor}
            strokeWidth="0.8"
            opacity="0.2"
          />
        </pattern>

        <filter id={tapeShadowId} x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity="0.3" />
        </filter>

        <filter id={labelShadowId} x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* 케이스 셸 */}
      <rect
        x="20"
        y="20"
        width="760"
        height="460"
        rx="22"
        ry="22"
        fill={shellFill}
        filter={`url(#${tapeShadowId})`}
      />

      {/* 상단 광택 */}
      <rect
        x="20"
        y="20"
        width="760"
        height="80"
        rx="22"
        ry="22"
        fill="white"
        opacity="0.06"
      />

      {/* 모서리 나사 */}
      <Screw cx={50} cy={50} accent={accentColor} />
      <Screw cx={750} cy={50} accent={accentColor} />
      <Screw cx={50} cy={450} accent={accentColor} />
      <Screw cx={750} cy={450} accent={accentColor} />

      {/* 라벨 */}
      <g filter={`url(#${labelShadowId})`}>
        <rect
          x="80"
          y="60"
          width="640"
          height="180"
          rx="6"
          ry="6"
          fill={`url(#${labelGradId})`}
        />
        <rect
          x="80"
          y="60"
          width="36"
          height="180"
          rx="6"
          ry="6"
          fill={accentColor}
          opacity="0.85"
        />
        <text
          x="98"
          y="155"
          fontFamily="'DM Serif Display', Georgia, serif"
          fontSize="36"
          fontWeight="700"
          textAnchor="middle"
          fill="#15110d"
          opacity="0.9"
        >
          {side}
        </text>

        <text
          x="690"
          y="170"
          fontSize="60"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {emoji}
        </text>

        <text
          x="140"
          y="120"
          fontFamily="'DM Serif Display', Georgia, serif"
          fontSize="34"
          fill="#15110d"
        >
          {truncate(title, 28)}
        </text>

        {artist && (
          <text
            x="140"
            y="160"
            fontFamily="'DM Serif Display', Georgia, serif"
            fontSize="20"
            fontStyle="italic"
            fill="#3a2f24"
            opacity="0.75"
          >
            — {truncate(artist, 32)}
          </text>
        )}

        <line
          x1="140"
          y1="200"
          x2="640"
          y2="200"
          stroke="#3a2f24"
          strokeWidth="1"
          opacity="0.3"
        />
        <text
          x="140"
          y="222"
          fontFamily="'JetBrains Mono', monospace"
          fontSize="11"
          fill="#3a2f24"
          opacity="0.5"
        >
          MIXTAPE · CrO₂ · 90 MIN
        </text>
      </g>

      {/* 중앙 노출창 */}
      <rect
        x="160"
        y="280"
        width="480"
        height="100"
        rx="10"
        ry="10"
        fill="#0d0a08"
        opacity="0.65"
      />

      {/* 테이프 띠 */}
      <rect x="220" y="320" width="360" height="20" fill="#5a3a1f" />
      <rect
        x="220"
        y="320"
        width="360"
        height="6"
        fill="#7a4f2c"
        opacity="0.7"
      />
      {/* 재생 중 — 띠 위에 흐르는 미세한 라인 (속도감) */}
      {playing && (
        <g className="tape-streaming" opacity="0.5">
          <line
            x1="240"
            y1="330"
            x2="260"
            y2="330"
            stroke="#a87a4f"
            strokeWidth="1.5"
          />
          <line
            x1="300"
            y1="330"
            x2="330"
            y2="330"
            stroke="#a87a4f"
            strokeWidth="1.5"
          />
          <line
            x1="380"
            y1="330"
            x2="395"
            y2="330"
            stroke="#a87a4f"
            strokeWidth="1.5"
          />
          <line
            x1="440"
            y1="330"
            x2="475"
            y2="330"
            stroke="#a87a4f"
            strokeWidth="1.5"
          />
          <line
            x1="510"
            y1="330"
            x2="530"
            y2="330"
            stroke="#a87a4f"
            strokeWidth="1.5"
          />
        </g>
      )}

      {/* 두 릴 */}
      <Reel cx={280} cy={330} rotation={reelRotation} accent={accentColor} />
      <Reel cx={520} cy={330} rotation={reelRotation} accent={accentColor} />

      {/* 하단 가이드 — 검은 박스 위 글자는 항상 가독성 있게 */}
      <g opacity="0.7">
        <rect x="160" y="410" width="120" height="40" rx="4" fill="#0d0a08" />
        <text
          x="220"
          y="436"
          fontFamily="'JetBrains Mono', monospace"
          fontSize="13"
          textAnchor="middle"
          fill={readableOnDark(accentColor)}
        >
          ◀◀
        </text>

        <rect x="340" y="410" width="120" height="40" rx="4" fill="#0d0a08" />
        <text
          x="400"
          y="436"
          fontFamily="'JetBrains Mono', monospace"
          fontSize="13"
          textAnchor="middle"
          fill={readableOnDark(accentColor)}
        >
          PLAY
        </text>

        <rect x="520" y="410" width="120" height="40" rx="4" fill="#0d0a08" />
        <text
          x="580"
          y="436"
          fontFamily="'JetBrains Mono', monospace"
          fontSize="13"
          textAnchor="middle"
          fill={readableOnDark(accentColor)}
        >
          ▶▶
        </text>
      </g>
    </svg>
  );
}

function Screw({ cx, cy, accent }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="8" fill="#0d0a08" opacity="0.4" />
      <circle cx={cx} cy={cy} r="6" fill={accent} opacity="0.6" />
      <line
        x1={cx - 4}
        y1={cy}
        x2={cx + 4}
        y2={cy}
        stroke="#0d0a08"
        strokeWidth="1.2"
      />
      <line
        x1={cx}
        y1={cy - 4}
        x2={cx}
        y2={cy + 4}
        stroke="#0d0a08"
        strokeWidth="1.2"
      />
    </g>
  );
}

function Reel({ cx, cy, rotation = 0, accent }) {
  const teeth = [];
  const N = 6;
  for (let i = 0; i < N; i++) {
    const angle = (360 / N) * i;
    teeth.push(
      <rect
        key={i}
        x={cx - 4}
        y={cy - 32}
        width="8"
        height="14"
        rx="2"
        fill="#1a1410"
        transform={`rotate(${angle} ${cx} ${cy})`}
      />,
    );
  }

  return (
    <g>
      <circle cx={cx} cy={cy} r="40" fill="#15110d" />
      <circle
        cx={cx}
        cy={cy}
        r="40"
        fill="none"
        stroke={accent}
        strokeWidth="1.5"
        opacity="0.4"
      />

      <g transform={`rotate(${rotation} ${cx} ${cy})`}>
        <circle cx={cx} cy={cy} r="32" fill="#2a221a" />
        {teeth}
        <circle cx={cx} cy={cy} r="10" fill="#0d0a08" />
        <circle cx={cx} cy={cy} r="6" fill={accent} opacity="0.7" />
        <line
          x1={cx}
          y1={cy - 28}
          x2={cx}
          y2={cy - 14}
          stroke={accent}
          strokeWidth="2"
          opacity="0.6"
        />
      </g>
    </g>
  );
}

function truncate(s, max) {
  if (!s) return "";
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}
