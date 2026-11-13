import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { ArrowLeft, ArrowRight, Check, Phone, X } from "lucide-react";
import {
  CATEGORY_TO_DISCIPLINE,
  PROJECTS,
  PROJECT_IMAGE_SIZE,
  PROJECT_MODAL_SIZES,
  PROJECT_TILE_SIZES,
  projectSrcSet,
  Project,
  SHOW_ILLUSTRATION_LABEL,
  projectMeta,
} from "../projectsData";

const PHONE_DISPLAY = "0331-5095004";
const PHONE_HREF = "tel:+923315095004";
const HASH_PREFIX = "#work-";
const ALL = "All";

const pad = (n: number) => String(n).padStart(2, "0");

const showIllustrationLabel = (p: Project) => SHOW_ILLUSTRATION_LABEL && p.isIllustration;

const IllustrationLabel: React.FC<{ className?: string }> = ({ className = "" }) => (
  <p className={`text-[11px] uppercase tracking-[0.12em] text-fg-subtle ${className}`}>Project illustration</p>
);

interface WhyFTEProps {
  /** Preselects the discipline in the contact form and scrolls to it. */
  onRequestProject?: (discipline: string, projectTitle: string) => void;
}

export const WhyFTE: React.FC<WhyFTEProps> = ({ onRequestProject }) => {
  const reduceMotion = usePrefersReducedMotion();
  const [activeCategory, setActiveCategory] = useState<string>(ALL);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const tileRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const returnFocusRef = useRef<HTMLElement | null>(null);

  // Tabs come from the data: "All" plus each category that has at least one project, in data order.
  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(PROJECTS.map((p) => p.category)))],
    []
  );

  const filtered = useMemo(
    () => (activeCategory === ALL ? PROJECTS : PROJECTS.filter((p) => p.category === activeCategory)),
    [activeCategory]
  );

  const openProject = useCallback((slug: string, trigger?: HTMLElement | null) => {
    returnFocusRef.current = trigger ?? (document.activeElement as HTMLElement | null);
    setOpenSlug(slug);
  }, []);

  const openSlugRef = useRef(openSlug);
  openSlugRef.current = openSlug;

  const closeProject = useCallback((restoreFocus = true) => {
    const current = openSlugRef.current;
    setOpenSlug(null);
    if (restoreFocus) {
      // Return focus to the tile of the project being viewed (it may differ from the one first opened).
      const target = (current && tileRefs.current[current]) || returnFocusRef.current;
      requestAnimationFrame(() => target?.focus({ preventScroll: true }));
    }
  }, []);

  // Deep link: #work-[slug] opens the modal on load and on hash change.
  useEffect(() => {
    const fromHash = () => {
      const { hash } = window.location;
      if (!hash.startsWith(HASH_PREFIX)) return;
      const slug = decodeURIComponent(hash.slice(HASH_PREFIX.length));
      if (PROJECTS.some((p) => p.slug === slug)) openProject(slug, tileRefs.current[slug]);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [openProject]);

  // Keep the URL hash in sync with the open project.
  useEffect(() => {
    const { pathname, search, hash } = window.location;
    if (openSlug) {
      if (hash !== HASH_PREFIX + openSlug) history.replaceState(null, "", `${pathname}${search}${HASH_PREFIX}${openSlug}`);
    } else if (hash.startsWith(HASH_PREFIX)) {
      history.replaceState(null, "", `${pathname}${search}`);
    }
  }, [openSlug]);

  // Prev/next follow the active filter; fall back to all projects if the open one is filtered out.
  const navList = openSlug && filtered.some((p) => p.slug === openSlug) ? filtered : PROJECTS;
  const openIndex = openSlug ? navList.findIndex((p) => p.slug === openSlug) : -1;
  const openProjectData = openIndex >= 0 ? navList[openIndex] : null;

  const step = useCallback(
    (dir: 1 | -1) => {
      if (openIndex < 0) return;
      setOpenSlug(navList[(openIndex + dir + navList.length) % navList.length].slug);
    },
    [navList, openIndex]
  );

  const requestSimilar = (project: Project) => {
    closeProject(false);
    requestAnimationFrame(() => {
      onRequestProject?.(CATEGORY_TO_DISCIPLINE[project.category], project.title);
      if (!onRequestProject) document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      document.getElementById("service")?.focus({ preventScroll: true });
    });
  };

  return (
    <section id="work" className="cad-grid relative bg-bg text-fg py-16 md:py-24" aria-label="Our work">
      <div className="relative max-w-7xl mx-auto px-[clamp(20px,5vw,64px)]">
        {/* Section Header */}
        <div className="max-w-2xl mb-10 md:mb-12">
          <p className="kicker-label text-fg mb-3">Our work</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-fg tracking-tight leading-tight [text-wrap:balance]">
            Selected projects across Pakistan.
          </h2>
          <div className="w-16 h-1 bg-line-strong mt-4 mb-4" />
          <p className="text-base sm:text-lg text-fg-muted font-normal leading-relaxed">
            Recent work in construction, electrical, fire safety and supply for government, corporate and industrial clients.
          </p>
        </div>

        <FilterTabs
          categories={categories}
          active={activeCategory}
          onChange={setActiveCategory}
          count={filtered.length}
        />

        {/* Uniform project grid */}
        <ul
          key={activeCategory}
          className="fade-in-300 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10"
        >
          {filtered.map((project) => (
            <li key={project.slug} className="flex">
              <ProjectTile
                project={project}
                ref={(el) => {
                  tileRefs.current[project.slug] = el;
                }}
                onOpen={(el) => openProject(project.slug, el)}
              />
            </li>
          ))}
        </ul>

        {/* Below the grid */}
        <div className="mt-14 md:mt-16 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 text-center">
          <p className="text-base sm:text-lg font-heading font-semibold text-fg">
            Have a similar project in mind?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 bg-accent hover:bg-accent-hover text-on-accent font-bold text-sm rounded-[4px] transition-colors"
          >
            Request a quote
          </a>
          <a
            href={PHONE_HREF}
            className="group inline-flex items-center gap-2 min-h-[44px] text-sm font-semibold text-fg hover:underline hover:underline-offset-4 transition-colors"
          >
            <Phone className="w-4 h-4" aria-hidden="true" />
            <span>Call {PHONE_DISPLAY}</span>
          </a>
        </div>
      </div>

      <ProjectModal
        project={openProjectData}
        position={openIndex + 1}
        total={navList.length}
        onClose={() => closeProject()}
        onStep={step}
        onRequest={requestSimilar}
        reduceMotion={reduceMotion}
      />
    </section>
  );
};

/* ---------- Filter tabs ---------- */

interface FilterTabsProps {
  categories: string[];
  active: string;
  onChange: (cat: string) => void;
  count: number;
}

const FilterTabs: React.FC<FilterTabsProps> = ({ categories, active, onChange, count }) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const measure = useCallback(() => {
    const btn = buttonRefs.current[active];
    if (btn) setIndicator({ left: btn.offsetLeft, width: btn.offsetWidth });
  }, [active]);

  useLayoutEffect(() => {
    measure();
    const scroller = scrollerRef.current;
    const btn = buttonRefs.current[active];
    // Keep the active tab visible when the row scrolls horizontally on small screens.
    if (scroller && btn && scroller.scrollWidth > scroller.clientWidth) {
      scroller.scrollTo({ left: btn.offsetLeft - 16, behavior: "smooth" });
    }
  }, [measure, active]);

  useEffect(() => {
    const ro = new ResizeObserver(measure);
    if (scrollerRef.current) ro.observe(scrollerRef.current);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [measure]);

  return (
    <div className="flex items-end justify-between gap-6 border-b border-line">
      <div
        ref={scrollerRef}
        className="relative -mb-px flex-1 min-w-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="relative flex w-max gap-6 sm:gap-8" role="group" aria-label="Filter projects by category">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              ref={(el) => {
                buttonRefs.current[cat] = el;
              }}
              onClick={() => onChange(cat)}
              aria-pressed={active === cat}
              className={`whitespace-nowrap min-h-[44px] pb-3 pt-2 text-[15px] font-heading font-semibold transition-colors ${
                active === cat ? "text-fg" : "text-fg-muted hover:text-fg"
              }`}
            >
              {cat}
            </button>
          ))}
          <span
            aria-hidden="true"
            className="absolute bottom-0 left-0 h-[2px] bg-accent transition-[transform,width] duration-300 ease-out"
            style={{ width: indicator.width, transform: `translateX(${indicator.left}px)` }}
          />
        </div>
      </div>
      <p className="shrink-0 pb-3 text-[12px] uppercase tracking-[0.12em] text-fg-subtle" aria-live="polite">
        {count} {count === 1 ? "project" : "projects"}
      </p>
    </div>
  );
};

/* ---------- Tile ---------- */

interface ProjectTileProps {
  project: Project;
  onOpen: (el: HTMLAnchorElement) => void;
}

const ProjectTile = React.forwardRef<HTMLAnchorElement, ProjectTileProps>(({ project, onOpen }, ref) => {
  const meta = projectMeta(project);
  return (
    <a
      ref={ref}
      id={`work-${project.slug}`}
      href={`${HASH_PREFIX}${project.slug}`}
      aria-haspopup="dialog"
      onClick={(e) => {
        e.preventDefault();
        onOpen(e.currentTarget);
      }}
      className="group flex w-full flex-col rounded-[6px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
    >
      <div className="relative aspect-[16/9] overflow-hidden rounded-[6px] bg-surface">
        <img
          src={project.image}
          srcSet={projectSrcSet(project.slug)}
          sizes={PROJECT_TILE_SIZES}
          alt={project.alt}
          width={PROJECT_IMAGE_SIZE.width}
          height={PROJECT_IMAGE_SIZE.height}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-[600ms] ease-out motion-safe:group-hover:scale-[1.03]"
        />
      </div>

      {showIllustrationLabel(project) && <IllustrationLabel className="mt-2" />}

      <div className="flex flex-1 flex-col pt-4">
        {/* Empty meta keeps its line height so titles stay aligned across a row */}
        <p className="mb-2 min-h-[18px] text-[12px] leading-[18px] uppercase tracking-[0.12em] text-fg-subtle" aria-hidden={!meta || undefined}>
          {meta}
        </p>
        <h3 className="font-heading font-medium text-[20px] leading-snug text-fg">{project.title}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-fg-muted">{project.description}</p>
        <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-fg">
          <span className="relative after:absolute after:inset-x-0 after:-bottom-[3px] after:h-px after:bg-fg after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:ease-out group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100">
            View project
          </span>
          <ArrowRight
            className="w-4 h-4 text-label transition-transform duration-300 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </a>
  );
});
ProjectTile.displayName = "ProjectTile";

/* ---------- Detail modal ---------- */

interface ProjectModalProps {
  project: Project | null;
  position: number;
  total: number;
  onClose: () => void;
  onStep: (dir: 1 | -1) => void;
  onRequest: (project: Project) => void;
  reduceMotion: boolean;
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  position,
  total,
  onClose,
  onStep,
  onRequest,
  reduceMotion,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const isOpen = project !== null;
  // Portals can't render on the server (prerender), so mount only on the client.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Keep the last project on screen for the 250ms fade-out after closing.
  const [lastProject, setLastProject] = useState<Project | null>(null);
  useEffect(() => {
    if (project) {
      setLastProject(project);
      return;
    }
    const t = window.setTimeout(() => setLastProject(null), reduceMotion ? 0 : 250);
    return () => window.clearTimeout(t);
  }, [project, reduceMotion]);
  const view = project ?? lastProject;
  const closing = !project && !!lastProject;

  // Scroll lock (native + Lenis) while open, without layout shift from the disappearing scrollbar.
  useEffect(() => {
    if (!isOpen) return;
    const lenis = (window as any).__lenis;
    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    lenis?.stop();
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      lenis?.start();
    };
  }, [isOpen]);

  // Keyboard: Esc closes, arrows navigate, Tab is trapped inside the dialog.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onStep(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        onStep(-1);
      } else if (e.key === "Tab" && dialogRef.current) {
        const nodes = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        const activeEl = document.activeElement;
        if (!dialogRef.current.contains(activeEl)) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && activeEl === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && activeEl === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose, onStep]);

  // Scroll the dialog back to the top when switching projects.
  useEffect(() => {
    dialogRef.current?.scrollTo({ top: 0 });
  }, [project?.slug]);

  if (!mounted || !view) return null;

  const meta = projectMeta(view);

  return createPortal(
    <div
      className={`modal-root ${closing ? "is-closing" : ""} fixed inset-0 z-[100] flex items-stretch justify-center sm:items-center sm:p-6`}
    >
          <div className="absolute inset-0 bg-midnight/80" onClick={onClose} aria-hidden="true" />

          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="work-modal-title"
            data-lenis-prevent
            className="theme-dark modal-panel relative w-full max-w-[1100px] overflow-y-auto overscroll-contain bg-navy sm:max-h-[calc(100dvh-3rem)] sm:rounded-lg"
          >
            {/* Toolbar */}
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-line bg-navy px-3 py-2 sm:pl-6 sm:pr-4">
              <p className="pl-1 sm:pl-0 text-[12px] uppercase tracking-[0.12em] text-fg-subtle" aria-live="polite">
                {pad(position)} / {pad(total)}
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onStep(-1)}
                  disabled={total < 2}
                  aria-label="Previous project"
                  className="inline-flex h-11 w-11 items-center justify-center rounded text-fg hover:text-icon disabled:opacity-40 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onStep(1)}
                  disabled={total < 2}
                  aria-label="Next project"
                  className="inline-flex h-11 w-11 items-center justify-center rounded text-fg hover:text-icon disabled:opacity-40 transition-colors"
                >
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Close project details"
                  className="ml-1 inline-flex h-11 w-11 items-center justify-center rounded text-fg hover:underline hover:underline-offset-4 transition-colors"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div key={view.slug} className="fade-in-180">
                <div className="sm:px-6 sm:pt-6">
                  <div className="aspect-[16/9] overflow-hidden bg-surface sm:rounded-[6px]">
                    <img
                      src={view.image}
                      srcSet={projectSrcSet(view.slug)}
                      sizes={PROJECT_MODAL_SIZES}
                      alt={view.alt}
                      width={PROJECT_IMAGE_SIZE.width}
                      height={PROJECT_IMAGE_SIZE.height}
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {showIllustrationLabel(view) && <IllustrationLabel className="mt-2 px-4 sm:px-0" />}
                </div>

                <div className="grid gap-8 px-4 py-6 sm:px-6 sm:py-8 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:gap-12">
                  <div>
                    {meta && <p className="mb-2 text-[12px] uppercase tracking-[0.12em] text-fg-subtle">{meta}</p>}
                    <h3
                      id="work-modal-title"
                      className="font-heading font-semibold text-2xl sm:text-[28px] leading-tight text-fg [text-wrap:balance]"
                    >
                      {view.title}
                    </h3>
                    <p className="mt-5 text-[12px] uppercase tracking-[0.12em] text-fg-subtle">Brief</p>
                    <p className="mt-2 text-base leading-relaxed text-fg-muted">{view.description}</p>
                    {view.outcome.trim() !== "" && (
                      <>
                        <p className="mt-5 text-[12px] uppercase tracking-[0.12em] text-fg-subtle">Outcome</p>
                        <p className="mt-2 text-base leading-relaxed text-fg-muted">{view.outcome}</p>
                      </>
                    )}
                  </div>

                  <div>
                    <p className="mb-3 text-[12px] uppercase tracking-[0.12em] text-fg-subtle">Our scope</p>
                    <ul className="space-y-2.5">
                      {view.facts.map((fact) => (
                        <li key={fact} className="flex items-start gap-2.5 text-[15px] text-fg">
                          <Check className="mt-[3px] h-4 w-4 shrink-0 text-icon" strokeWidth={2.5} aria-hidden="true" />
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line px-4 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-6">
                  <button
                    type="button"
                    onClick={() => onRequest(view)}
                    className="inline-flex min-h-[44px] items-center justify-center rounded bg-accent px-6 py-3 text-sm font-bold text-on-accent transition-colors hover:bg-accent-hover"
                  >
                    Request a similar project
                  </button>
                  <a
                    href={PHONE_HREF}
                    className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-fg transition-colors hover:underline hover:underline-offset-4"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    <span>Call {PHONE_DISPLAY}</span>
                  </a>
                </div>
            </div>
          </div>
    </div>,
    document.body
  );
};
