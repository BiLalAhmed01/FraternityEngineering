import React from "react";

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
      <main className="min-h-screen bg-brand-navy text-white flex items-center justify-center px-[clamp(20px,5vw,64px)] py-16">
        <div className="max-w-[44ch] text-center">
          <h1 className="font-heading text-[28px] font-medium">Something went wrong on this page.</h1>
          <p className="mt-4 text-[17px] leading-[1.7] text-white/75">
            Please reload, or contact us directly on{" "}
            <a href="tel:+923315095004" className="underline underline-offset-2">
              0331-5095004
            </a>
            .
          </p>
          <a
            href="/"
            className="mt-8 inline-flex min-h-[44px] items-center rounded-[4px] bg-brand-orange px-6 text-[16px] font-medium text-brand-charcoal"
          >
            Back to homepage
          </a>
        </div>
      </main>
    );
  }
}
