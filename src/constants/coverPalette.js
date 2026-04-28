/**
 * 카세트 케이스 디자이너용 사전 정의 카탈로그.
 *
 * COLOR_PRESETS: 큐레이션된 컬러 페어
 *   - bg, accent 한 쌍이 함께 어울리도록 미리 검증된 조합
 *   - 사용자가 임의 색을 고르고 싶으면 'custom' 옵션 (color picker) 사용
 *
 * EMOJI_CATALOG: 무드별로 묶인 이모지
 * PATTERNS: CassetteSVG가 지원하는 4가지 패턴
 */

export const COLOR_PRESETS = [
  { id: "pastel-blue", name: "파스텔 블루", bg: "#8fb8d9", accent: "#d4a574" },
  { id: "sunset-rust", name: "석양 러스트", bg: "#c97a5e", accent: "#f5ead5" },
  { id: "sage", name: "세이지 그린", bg: "#8a9a6b", accent: "#2a221a" },
  { id: "amber-cream", name: "앰버 크림", bg: "#d4a574", accent: "#3a2f24" },
  { id: "midnight", name: "한밤", bg: "#1f2942", accent: "#d4a574" },
  { id: "rose-dust", name: "로즈 더스트", bg: "#b87a8a", accent: "#f5ead5" },
  { id: "forest", name: "숲속", bg: "#3d5a4a", accent: "#d4a574" },
  { id: "sand-paper", name: "오래된 종이", bg: "#e6d5b8", accent: "#5a3a2a" },
  { id: "lavender", name: "라벤더", bg: "#a89bbf", accent: "#f5ead5" },
  { id: "charcoal", name: "차콜", bg: "#2a2a2e", accent: "#c9b896" },
  { id: "mint", name: "민트", bg: "#a8d4c8", accent: "#3a2f24" },
  { id: "peach", name: "복숭아", bg: "#e8b89a", accent: "#5a3a2a" },
];

export const PATTERNS = [
  { id: "solid", name: "솔리드" },
  { id: "stripes", name: "사선 줄무늬" },
  { id: "dots", name: "점" },
  { id: "grid", name: "격자" },
];

/**
 * 무드별 이모지 카탈로그.
 * 사용자가 직접 입력할 수도 있으니 가이드 정도로.
 */
export const EMOJI_CATALOG = {
  자연: [
    "🌊",
    "🌅",
    "🌿",
    "🌙",
    "⭐",
    "☁️",
    "🌸",
    "🍃",
    "🔥",
    "🌾",
    "🌻",
    "🌲",
  ],
  음료: ["☕", "🍵", "🍷", "🥤", "🍺", "🧋"],
  계절: ["❄️", "🍂", "🌷", "☀️"],
  음악: ["🎵", "🎶", "🎷", "🎸", "🎹", "🎺", "🥁", "📻"],
  감정: ["💙", "💛", "💚", "💜", "🤍", "🖤", "✨", "💫", "🌟"],
  활동: ["🚗", "✈️", "🏖️", "🏔️", "🚲", "🌃", "📚", "💌"],
  기타: ["📼", "💾", "🎞️", "🕯️", "🪐", "🦄"],
};
