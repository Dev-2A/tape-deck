export default function Footer() {
  return (
    <footer
      className="w-full border-t mt-16 py-6"
      style={{ borderColor: "var(--tape-border)" }}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-xs">
        <p className="font-mono" style={{ color: "var(--tape-text-muted)" }}>
          📼 Tape Deck — Vibe over utility.
        </p>
        <p className="font-mono" style={{ color: "var(--tape-text-muted)" }}>
          © 2026{" "}
          <a
            href="https://github.com/Dev-2A/tape-deck"
            target="_blank"
            rel="noopener noreferrer"
          >
            Dev-2A
          </a>
        </p>
      </div>
    </footer>
  );
}
