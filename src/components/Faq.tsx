import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, Mail, MessageCircle, Phone } from "lucide-react";
import { SITE_CONTENT, FaqItem } from "../content";
import { FAQ_ITEMS } from "../faqData";
import { Reveal } from "./Reveal";

/** Compact accordion used on the service pages. */
export const FaqAccordion: React.FC<{ items: FaqItem[]; idPrefix?: string }> = ({ items, idPrefix = "faq" }) => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.question}>
            <h3 className="font-heading font-bold">
              <button
                type="button"
                id={`${idPrefix}-q-${i}`}
                aria-expanded={isOpen}
                aria-controls={`${idPrefix}-a-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full min-h-[44px] flex items-center justify-between gap-4 py-4 text-left text-fg hover:underline hover:underline-offset-4 transition-colors"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`w-5 h-5 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={`${idPrefix}-a-${i}`}
              role="region"
              aria-labelledby={`${idPrefix}-q-${i}`}
              hidden={!isOpen}
              className="pb-4 text-sm sm:text-base leading-relaxed text-fg-muted"
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ---------- Homepage FAQ ---------- */

const HASH_PREFIX = "#faq-";
const label = "text-[13px] font-semibold text-label";
const underline =
  "relative after:absolute after:inset-x-0 after:-bottom-[3px] after:h-px after:bg-fg after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:ease-out group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100";

const faqJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
}).replace(/</g, "\\u003c");

const PlusIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    viewBox="0 0 20 20"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    aria-hidden="true"
    className={`shrink-0 text-fg transition-transform duration-200 ease-out motion-reduce:transition-none ${
      open ? "rotate-45" : ""
    }`}
  >
    <path d="M10 3v14M3 10h14" />
  </svg>
);

const ContactLink: React.FC<{ href: string; icon: React.ReactNode; children: React.ReactNode; external?: boolean }> = ({
  href,
  icon,
  children,
  external,
}) => (
  <li>
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group inline-flex min-h-[40px] items-center gap-2.5 rounded-sm text-[15px] font-medium text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
    >
      <span className="text-fg-subtle transition-colors group-hover:text-fg" aria-hidden="true">
        {icon}
      </span>
      <span className={underline}>{children}</span>
    </a>
  </li>
);

export const Faq: React.FC = () => {
  const [openSlug, setOpenSlug] = useState<string | null>(FAQ_ITEMS[0]?.slug ?? null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const { contact } = SITE_CONTENT;
  const email = contact.domainEmail || contact.email;

  // Deep links: #faq-[slug] opens that item on load and on hash change.
  useEffect(() => {
    const fromHash = () => {
      const { hash } = window.location;
      if (!hash.startsWith(HASH_PREFIX)) return;
      const slug = decodeURIComponent(hash.slice(HASH_PREFIX.length));
      if (FAQ_ITEMS.some((item) => item.slug === slug)) setOpenSlug(slug);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const openSlugRef = useRef(openSlug);
  openSlugRef.current = openSlug;

  // Single-open; the hash follows the open item.
  const toggle = useCallback((slug: string) => {
    const next = openSlugRef.current === slug ? null : slug;
    setOpenSlug(next);
    const { pathname, search, hash } = window.location;
    if (next) history.replaceState(null, "", `${pathname}${search}${HASH_PREFIX}${next}`);
    else if (hash.startsWith(HASH_PREFIX)) history.replaceState(null, "", `${pathname}${search}`);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = FAQ_ITEMS.length - 1;
    const keyTargets: Record<string, number> = {
      ArrowDown: Math.min(index + 1, last),
      ArrowUp: Math.max(index - 1, 0),
      Home: 0,
      End: last,
    };
    if (!(e.key in keyTargets)) return;
    e.preventDefault();
    buttonRefs.current[keyTargets[e.key]]?.focus();
  };

  return (
    <section
      id="faq"
      className="cad-grid bg-bg text-fg border-t border-line py-[clamp(72px,9vw,120px)]"
      aria-labelledby="faq-title"
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />

      <Reveal className="max-w-7xl mx-auto px-[clamp(20px,5vw,64px)]">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-24 lg:gap-y-0">
          {/* Intro */}
          <div className="lg:col-span-4 lg:col-start-1 lg:row-start-1">
            <p className={label}>FAQ</p>
            <h2
              id="faq-title"
              className="mt-4 font-heading font-medium text-[clamp(2rem,1.4rem+2.4vw,3rem)] leading-[1.1] tracking-tight text-fg [text-wrap:balance]"
            >
              Questions we hear before every project.
            </h2>
            <p className="mt-6 max-w-[38ch] text-[17px] leading-[1.7] text-fg-muted">
              Straight answers on scope, pricing and how we work.
            </p>
          </div>

          {/* Accordion */}
          <div className="lg:col-span-8 lg:col-start-5 lg:row-span-2 lg:row-start-1">
            <ul className="border-y border-line divide-y divide-line">
              {FAQ_ITEMS.map((item, i) => {
                const isOpen = openSlug === item.slug;
                const qId = `faq-${item.slug}-q`;
                const aId = `faq-${item.slug}-a`;
                return (
                  <li key={item.slug} id={`faq-${item.slug}`} className="scroll-mt-28">
                    <h3>
                      <button
                        type="button"
                        id={qId}
                        ref={(el) => {
                          buttonRefs.current[i] = el;
                        }}
                        aria-expanded={isOpen}
                        aria-controls={aId}
                        onClick={() => toggle(item.slug)}
                        onKeyDown={(e) => onKeyDown(e, i)}
                        className="group flex w-full items-baseline py-7 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                      >
                        <span className="flex-1 pr-6 font-heading font-medium text-[20px] leading-snug text-fg">
                          {item.question}
                        </span>
                        <span className="self-center">
                          <PlusIcon open={isOpen} />
                        </span>
                      </button>
                    </h3>
                    <div
                      id={aId}
                      role="region"
                      aria-labelledby={qId}
                      inert={!isOpen}
                      className={`grid transition-[grid-template-rows] duration-[250ms] ease-out motion-reduce:transition-none ${
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-[62ch] pb-8 pr-8 text-[17px] leading-[1.7] text-fg-muted">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact block (below the accordion on tablet/mobile) */}
          <div className="lg:col-span-4 lg:col-start-1 lg:row-start-2 lg:mt-6">
            <div className="rounded-[6px] border border-line p-6">
              <p className="text-[16px] font-medium text-fg">Still have a question?</p>
              <p className="mt-1 text-[14px] text-fg-subtle">Speak directly with our engineering team.</p>
              <ul className="mt-4 space-y-1">
                <ContactLink href={`tel:${contact.phonePrimaryTel}`} icon={<Phone className="h-4 w-4" strokeWidth={1.5} />}>
                  Call {contact.phonePrimary}
                </ContactLink>
                <ContactLink
                  href="https://wa.me/923315095004"
                  external
                  icon={<MessageCircle className="h-4 w-4" strokeWidth={1.5} />}
                >
                  WhatsApp us
                </ContactLink>
                {email && (
                  <ContactLink href={`mailto:${email}`} icon={<Mail className="h-4 w-4" strokeWidth={1.5} />}>
                    {email}
                  </ContactLink>
                )}
              </ul>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

