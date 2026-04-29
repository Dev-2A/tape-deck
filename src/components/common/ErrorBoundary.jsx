import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex items-center justify-center px-6"
          style={{ backgroundColor: "var(--tape-bg-deepest)" }}
        >
          <div className="max-w-md text-center">
            <div className="text-7xl mb-6">📼💔</div>
            <h1
              className="font-serif text-3xl mb-3"
              style={{ color: "var(--tape-text-primary)" }}
            >
              테이프가 끊겼어요
            </h1>
            <p
              className="text-sm mb-8"
              style={{ color: "var(--tape-text-secondary)" }}
            >
              예상치 못한 오류가 발생했어요. 페이지를 새로고침하면 대부분
              해결돼요.
            </p>
            <details
              className="text-xs font-mono mb-6 text-left rounded-md p-3 border"
              style={{
                backgroundColor: "var(--tape-bg-elevated)",
                borderColor: "var(--tape-border)",
                color: "var(--tape-text-muted)",
              }}
            >
              <summary className="cursor-pointer">에러 상세</summary>
              <pre className="mt-2 whitespace-pre-wrap break-words">
                {String(this.state.error?.stack || this.state.error)}
              </pre>
            </details>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => location.reload()}
                className="px-5 py-2 rounded-md font-medium"
                style={{
                  backgroundColor: "var(--tape-accent-amber)",
                  color: "var(--tape-bg-deepest)",
                }}
              >
                🔄 새로고침
              </button>
              <button
                onClick={this.reset}
                className="px-5 py-2 rounded-md text-sm border"
                style={{
                  borderColor: "var(--tape-border)",
                  color: "var(--tape-text-secondary)",
                }}
              >
                다시 시도
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
