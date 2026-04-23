function App() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        {/* 로고 */}
        <div className="text-7xl mb-6 select-none">📼</div>

        {/* 타이틀 — 빈티지 세리프 */}
        <h1
          className="font-serif text-5xl md:text-6xl mb-4"
          style={{ color: "var(--tape-text-primary)" }}
        >
          Tape Deck
        </h1>

        {/* 서브타이틀 — 이탤릭 세리프 */}
        <p
          className="font-serif italic text-xl md:text-2xl mb-8"
          style={{ color: "var(--tape-accent-amber)" }}
        >
          Vibe over utility.
        </p>

        {/* 설명 */}
        <p
          className="text-base leading-relaxed mb-2"
          style={{ color: "var(--tape-text-secondary)" }}
        >
          YouTube URL을 한 면씩 담아 카세트테이프로 듣는 음악 플레이어.
        </p>
        <p
          className="text-sm font-mono"
          style={{ color: "var(--tape-text-muted)" }}
        >
          v0.0.1 — initializing...
        </p>
      </div>
    </div>
  );
}

export default App;
