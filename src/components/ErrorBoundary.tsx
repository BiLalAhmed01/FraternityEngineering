import React from "react";
import { StatusPage, statusBtn } from "./StatusPage";

interface State {
  failed: boolean;
}

/** Shows a short, useful message instead of a blank page if rendering throws. */
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <StatusPage
        code="Error"
        title="This page failed to load"
        message="Something broke while showing this page. Reload to try again, or call us and we will help directly."
        actions={
          <>
            <button type="button" onClick={() => window.location.reload()} className={statusBtn}>
              Reload page
            </button>
            <a
              href="tel:+923315095004"
              className="inline-flex items-center min-h-[48px] text-sm font-semibold text-white underline underline-offset-8 decoration-line-strong hover:decoration-accent transition-colors"
            >
              Call 0331-5095004
            </a>
            <a
              href="/"
              className="inline-flex items-center min-h-[48px] text-sm font-semibold text-white underline underline-offset-8 decoration-line-strong hover:decoration-accent transition-colors"
            >
              Back to homepage
            </a>
          </>
        }
      />
    );
  }
}
