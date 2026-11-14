import React from "react";

interface StatusPageProps {
  /** Large outlined code shown in the framed panel, e.g. "404". */
  code: string;
  title: string;
  message: string;
  /** Primary actions (buttons). */
  actions: React.ReactNode;
  /** Optional row of secondary links under the actions. */
  links?: React.ReactNode;
}

export const statusBtn =
  "inline-flex items-center justify-center gap-2 min-h-[48px] px-8 py-4 bg-accent hover:bg-accent-hover text-on-accent font-semibold text-sm rounded-[4px] transition-colors";

/**
 * Shared layout for the 404 page and the render-error fallback. Uses plain markup only (no router, no lazy
 * components) so it still renders when the rest of the app has failed.
 */
export const StatusPage: React.FC<StatusPageProps> = ({ code, title, message, actions, links }) => (
  <main
    id="main"
    className="theme-dark cad-grid relative min-h-screen bg-midnight text-fg font-body flex flex-col overflow-hidden"
  >
    <header className="px-[clamp(20px,5vw,64px)] py-6">
      <div className="max-w-7xl mx-auto">
        <a href="/" aria-label="Fraternity Engineering & Co. homepage" className="inline-flex">
          <img src="/assets/logo.webp" alt="Fraternity Engineering & Co." width={177} height={64} className="h-12 w-auto" />
        </a>
      </div>
    </header>

    <div className="flex-1 flex items-center px-[clamp(20px,5vw,64px)] py-12 md:py-16">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-12 items-center">
        <div className="lg:col-span-7 hero-rise order-2 lg:order-1">
          <h1 className="font-heading font-semibold text-4xl sm:text-5xl xl:text-6xl leading-[1.05] tracking-tight text-white">
            {title}
          </h1>
          <div className="w-14 h-[3px] bg-accent mt-6 mb-6" />
          <p className="text-lg sm:text-xl text-fg-muted leading-relaxed max-w-lg">{message}</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">{actions}</div>
          {links}
        </div>

        <div className="lg:col-span-5 hero-frame-in order-1 lg:order-2">
          <div className="relative mx-2">
            <span aria-hidden="true" className="absolute -top-2 -left-2 w-7 h-7 border-t-2 border-l-2 border-accent" />
            <span aria-hidden="true" className="absolute -top-2 -right-2 w-7 h-7 border-t-2 border-r-2 border-accent" />
            <span aria-hidden="true" className="absolute -bottom-2 -left-2 w-7 h-7 border-b-2 border-l-2 border-accent" />
            <span aria-hidden="true" className="absolute -bottom-2 -right-2 w-7 h-7 border-b-2 border-r-2 border-accent" />
            <div className="bg-navy border border-line-strong flex items-center justify-center aspect-[16/9] lg:aspect-square">
              <p
                aria-hidden="true"
                className={`font-heading font-semibold leading-none tracking-tight text-navy [-webkit-text-stroke:2px_var(--steel)] ${
                  code.length > 3
                    ? "text-[clamp(3.5rem,16vw,7rem)] lg:text-[clamp(3.5rem,7vw,6.5rem)]"
                    : "text-[clamp(5rem,20vw,11rem)] lg:text-[clamp(5rem,11vw,10rem)]"
                }`}
              >
                {code}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
);
