export default function NoSearchResults({ query, onClear }) {
  return (
    <div
      className="rounded-lg border-2 border-dashed py-16 px-6 text-center"
      style={{
        borderColor: "var(--tape-border)",
        backgroundColor: "var(--tape-bg-elevated)",
      }}
    >
      <div className="text-5xl mb-4 opacity-60">🔍</div>
      <p
        className="text-base mb-2"
        style={{ color: "var(--tape-text-secondary)" }}
      >
        "
        <span
          className="font-mono"
          style={{ color: "var(--tape-accent-amber)" }}
        >
          {query}
        </span>
        " 에 해당하는 테이프가 없어요.
      </p>
      <button
        onClick={onClear}
        className="mt-4 text-sm underline"
        style={{ color: "var(--tape-text-muted)" }}
      >
        검색 지우기
      </button>
    </div>
  );
}
