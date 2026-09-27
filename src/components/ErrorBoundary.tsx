import { Component, type ReactNode } from "react";

/* Last-resort crash net: a single uncaught render error blanks a React app
   with zero explanation. This shows a themed fallback instead. It should
   never be seen; it exists so a bad deploy degrades instead of vanishing. */
interface State {
  failed: boolean;
}

export default class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(err: unknown) {
    console.error("Portfolio crashed:", err);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div
        style={{
          minHeight: "100svh",
          display: "grid",
          placeItems: "center",
          background: "#141318",
          color: "#ece7dc",
          fontFamily: "system-ui, sans-serif",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div>
          <p style={{ fontSize: "1.4rem", marginBottom: "0.75rem" }}>
            Something broke on this page.
          </p>
          <p style={{ color: "#a49c8e", marginBottom: "1.5rem" }}>
            Refresh to try again — or reach me directly:
          </p>
          <a
            href="mailto:midhunsujith42@gmail.com"
            style={{ color: "#d9a648" }}
          >
            midhunsujith42@gmail.com
          </a>
        </div>
      </div>
    );
  }
}
