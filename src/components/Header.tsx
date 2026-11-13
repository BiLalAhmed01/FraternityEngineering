import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { MessageCircle, Phone } from "lucide-react";
import { SITE_CONTENT } from "../content";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export const NAV_LINKS = [
  { label: "Services", id: "services" },
  { label: "Work", id: "work" },
  { label: "Clients", id: "clients" },
  { label: "About", id: "about" },
  { label: "Process", id: "process" },
  { label: "FAQ", id: "faq" },
  { label: "Contact", id: "contact" },
] as const;

const SECTION_IDS = NAV_LINKS.map((l) => l.id) as string[];
const WHATSAPP_URL = "https://wa.me/923315095004";
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Maps a hash like "#work-imc-hospital" or "#contact?discipline=x" to its nav section. */
const sectionFromHash = (hash: string | undefined) => {
  const raw = (hash ?? "").replace(/^#/, "").split(/[?-]/)[0];
  return SECTION_IDS.includes(raw) ? raw : "";
};

/** Same-page anchors on the homepage (keeps any query string, no reload); "/#id" elsewhere. */
export const sectionHref = (id: string) => {
  const onHome = typeof window !== "undefined" && (window.location.pathname === "/" || window.location.pathname === "");
  return onHome ? `#${id}` : `/#${id}`;
};

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange";

export const Header: React.FC = () => {
  const reduceMotion = usePrefersReducedMotion();
  const isHome = window.location.pathname === "/" || window.location.pathname === "";
  const { contact } = SITE_CONTENT;

  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Keeps the overlay mounted for its 250ms fade-out after closing.
  const [menuRendered, setMenuRendered] = useState(false);
  // Same on server and client so hydration matches; the hash is applied after mount.
  const [active, setActive] = useState(() =>
    !isHome && window.location.pathname.startsWith("/services") ? "services" : ""
  );

  const headerRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  // Solid bar after 40px; hide when scrolling down past 400px, show when scrolling up.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (y < 400) setHidden(false);
      else if (Math.abs(y - lastY) > 4) setHidden(y > lastY);
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Current section (home page): the section crossing the band just below the bar.
  useEffect(() => {
    if (!isHome) return;
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        const current = SECTION_IDS.filter((id) => visible.has(id)).pop() ?? "";
        setActive(current);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isHome]);

  // Keep the URL hash in step with the current section without clobbering deep links (#work-…, #faq-…).
  const syncedOnce = useRef(false);
  useEffect(() => {
    if (!isHome) return;
    // The first run happens before the incoming hash is read; never strip it.
    if (!syncedOnce.current) {
      syncedOnce.current = true;
      return;
    }
    const { pathname, search, hash } = window.location;
    // Leave deep links alone (#work-slug, #faq-slug, #contact?discipline=…); only plain section hashes follow the scroll.
    const isPlain = hash === "" || SECTION_IDS.includes(hash.slice(1)) || hash === "#hero";
    if (!isPlain || sectionFromHash(hash) === active) return;
    history.replaceState(null, "", `${pathname}${search}${active ? `#${active}` : ""}`);
  }, [active, isHome]);

  useEffect(() => {
    if (!isHome) return;
    const onHash = () => {
      const section = sectionFromHash(window.location.hash);
      if (section) setActive(section);
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [isHome]);

  // Sliding underline under the active link.
  const measure = useCallback(() => {
    const el = active ? linkRefs.current[active] : null;
    setIndicator(el ? { left: el.offsetLeft, width: el.offsetWidth } : null);
  }, [active]);

  useLayoutEffect(measure, [measure]);

  useEffect(() => {
    const ro = new ResizeObserver(measure);
    if (linksRef.current) ro.observe(linksRef.current);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [measure]);

  // Mobile menu: scroll lock, Esc, focus trap, focus return.
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    if (menuOpen) {
      setMenuRendered(true);
      return;
    }
    const t = window.setTimeout(() => setMenuRendered(false), reduceMotion ? 0 : 250);
    return () => window.clearTimeout(t);
  }, [menuOpen, reduceMotion]);

  /** Menu links: close first, then scroll once the page is unlocked (the jump is lost while scroll is locked). */
  const goToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = isHome ? document.getElementById(id) : null;
    setMenuOpen(false);
    if (!target) return;
    e.preventDefault();
    requestAnimationFrame(() => {
      const lenis = (window as any).__lenis;
      if (lenis) lenis.scrollTo(target, { offset: -64 });
      else target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      const { pathname, search } = window.location;
      history.replaceState(null, "", `${pathname}${search}#${id}`);
      setActive(id);
    });
  };

  useEffect(() => {
    document.body.dataset.menu = menuOpen ? "open" : "";
    if (!menuOpen) return;
    const lenis = (window as any).__lenis;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenis?.stop();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMenuOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = [headerRef.current, overlayRef.current]
        .flatMap((root) => (root ? Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)) : []))
        .filter((n) => n.offsetParent !== null);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      document.body.dataset.menu = "";
      lenis?.start();
    };
  }, [menuOpen]);

  // Close the menu if the viewport grows to desktop.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const barHidden = hidden && !menuOpen && !reduceMotion;
  const solid = scrolled || menuOpen;

  return (
    <>
      <a
        href="#main"
        className="skip-link sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-[4px] focus:bg-white focus:px-4 focus:py-3 focus:text-[15px] focus:font-medium focus:text-brand-navy focus:outline-2 focus:outline-offset-2 focus:outline-brand-orange"
      >
        Skip to content
      </a>

      <header
        ref={headerRef}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,translate] duration-200 ease-out motion-reduce:transition-none ${
          solid && !menuOpen ? "bg-brand-navy/92 backdrop-blur-[12px]" : "bg-transparent"
        } ${barHidden ? "-translate-y-full" : ""}`}
      >
        {/* Bottom hairline, drawn over the bar so it never adds height */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/10 transition-opacity duration-200 ${
            solid && !menuOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between gap-6 px-[clamp(20px,5vw,64px)] transition-[height] duration-200 motion-reduce:transition-none h-16 ${
            scrolled ? "lg:h-16" : "lg:h-20"
          }`}
        >
          {/* Brand */}
          <a
            href={isHome ? "#hero" : "/"}
            onClick={() => setMenuOpen(false)}
            className={`flex shrink-0 items-center gap-3 rounded-sm ${focusRing}`}
            aria-label="Fraternity Engineering & Co., back to top"
          >
            <img src="/assets/logo-mark-160.webp" alt="" width={44} height={40} decoding="async" className="h-10 w-auto" />
            <span className="leading-tight text-white">
              <span className="block whitespace-nowrap text-[15px] font-medium sm:text-[17px]">Fraternity Engineering</span>
              <span className="hidden text-[13px] text-white/60 xl:block">&amp; Co.</span>
            </span>
          </a>

          {/* Desktop links */}
          <nav aria-label="Primary" className="hidden lg:block">
            <div ref={linksRef} className="relative flex items-center gap-6 xl:gap-8">
              {NAV_LINKS.map((link) => {
                const isActive = active === link.id;
                return (
                  <a
                    key={link.id}
                    ref={(el) => {
                      linkRefs.current[link.id] = el;
                    }}
                    href={sectionHref(link.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={`inline-flex min-h-[44px] items-center rounded-sm text-[15px] transition-colors duration-200 ${focusRing} ${
                      isActive ? "text-white" : "text-white/78 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute top-[calc(50%+19px)] left-0 h-[2px] bg-brand-orange transition-[transform,width,opacity] duration-300 ease-out motion-reduce:transition-none ${
                  indicator ? "opacity-100" : "opacity-0"
                }`}
                style={{ width: indicator?.width ?? 0, transform: `translateX(${indicator?.left ?? 0}px)` }}
              />
            </div>
          </nav>

          {/* Desktop actions */}
          <div className="hidden shrink-0 items-center gap-6 lg:flex">
            <a
              href={`tel:${contact.phonePrimaryTel}`}
              className={`hidden min-h-[44px] items-center gap-2 rounded-sm text-[15px] text-white transition-colors hover:text-white/80 xl:inline-flex ${focusRing}`}
            >
              <Phone className="h-4 w-4 text-white/70" strokeWidth={1.5} aria-hidden="true" />
              {contact.phonePrimary}
            </a>
            <a
              href={sectionHref("contact")}
              className={`inline-flex h-11 items-center rounded-[4px] bg-brand-orange px-5 text-[15px] font-medium text-brand-charcoal transition-colors hover:bg-brand-orange-hover ${focusRing}`}
            >
              Request a quote
            </a>
          </div>

          {/* Menu toggle */}
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className={`relative -mr-2 inline-flex h-11 w-11 items-center justify-center rounded-[4px] text-white lg:hidden ${focusRing}`}
          >
            <span
              aria-hidden="true"
              className={`absolute h-[1.5px] w-6 bg-current transition-transform duration-200 motion-reduce:transition-none ${
                menuOpen ? "rotate-45" : "-translate-y-[4px]"
              }`}
            />
            <span
              aria-hidden="true"
              className={`absolute h-[1.5px] w-6 bg-current transition-transform duration-200 motion-reduce:transition-none ${
                menuOpen ? "-rotate-45" : "translate-y-[4px]"
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {menuRendered && (
          <div
            ref={overlayRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            data-lenis-prevent
            className={`menu-overlay ${menuOpen ? "" : "is-closing"} fixed inset-0 z-40 flex flex-col overflow-y-auto bg-brand-navy px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-24 sm:px-6 lg:hidden`}
          >
            <nav aria-label="Primary" className="flex-1">
              <ul>
                {NAV_LINKS.map((link, i) => (
                  <li
                    key={link.id}
                    style={{ animationDelay: `${i * 60}ms` }}
                    className="menu-item border-b border-white/10"
                  >
                    <a
                      href={sectionHref(link.id)}
                      onClick={(e) => goToSection(e, link.id)}
                      aria-current={active === link.id ? "true" : undefined}
                      className={`flex min-h-[44px] items-center py-3 text-[28px] font-medium leading-tight ${focusRing} ${
                        active === link.id ? "text-white" : "text-white/85"
                      }`}
                    >
                      {link.label}
                      {active === link.id && <span className="ml-3 h-[2px] w-5 bg-brand-orange" aria-hidden="true" />}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-10 space-y-1">
              <a
                href={`tel:${contact.phonePrimaryTel}`}
                className={`flex min-h-[44px] items-center gap-3 rounded-sm text-[17px] text-white ${focusRing}`}
              >
                <Phone className="h-5 w-5 text-white/70" strokeWidth={1.5} aria-hidden="true" />
                Call {contact.phonePrimary}
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex min-h-[44px] items-center gap-3 rounded-sm text-[17px] text-white ${focusRing}`}
              >
                <MessageCircle className="h-5 w-5 text-white/70" strokeWidth={1.5} aria-hidden="true" />
                WhatsApp us
              </a>
              <a
                href={sectionHref("contact")}
                onClick={(e) => goToSection(e, "contact")}
                className={`!mt-6 flex h-[52px] w-full items-center justify-center rounded-[4px] bg-brand-orange text-[16px] font-medium text-brand-charcoal transition-colors hover:bg-brand-orange-hover ${focusRing}`}
              >
                Request a quote
              </a>
            </div>
          </div>
      )}
    </>
  );
};
