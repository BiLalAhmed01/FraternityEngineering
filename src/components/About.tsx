import React, { useState } from "react";
import { Check } from "lucide-react";
import { SITE_CONTENT } from "../content";
import { Reveal } from "./Reveal";
import { CountUp } from "./CountUp";

const FALLBACK_IMAGE = "/assets/about-fallback-1200.webp";
const FALLBACK_SRCSET = [480, 768, 1200].map((w) => `/assets/about-fallback-${w}.webp ${w}w`).join(", ");

const eyebrow = "text-[12px] font-semibold uppercase tracking-[0.12em] text-label";

export const About: React.FC = () => {
  const { story, image, established, founder, mission, vision, coreValues, credentials } = SITE_CONTENT.about;
  const { projectsDelivered, pecCategory } = SITE_CONTENT.hero;
  const [imgSrc, setImgSrc] = useState(image || FALLBACK_IMAGE);

  const stats: { text?: string; value?: number; suffix?: string; label: string }[] = [
    established.trim() !== "" && { text: `Since ${established.trim()}`, label: "Established" },
    projectsDelivered.trim() !== "" && !Number.isNaN(Number(projectsDelivered)) && { value: Number(projectsDelivered), suffix: "+", label: "Projects delivered" },
    { value: 5, suffix: "", label: "Disciplines" },
  ].filter(Boolean) as { text?: string; value?: number; suffix?: string; label: string }[];

  const credentialItems = [
    pecCategory && `PEC registered ${pecCategory}`,
    credentials.ntn && `NTN ${credentials.ntn}`,
    credentials.secp && `SECP ${credentials.secp}`,
    credentials.certification,
  ].filter((c): c is string => Boolean(c && c.trim()));

  return (
    <section
      id="about"
      className="theme-dark relative bg-navy text-fg py-[clamp(72px,9vw,120px)]"
      aria-labelledby="about-title"
    >
      <div className="max-w-7xl mx-auto px-[clamp(20px,5vw,64px)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-start gap-14 lg:gap-20">
          {/* Image */}
          <Reveal className="lg:col-span-5 lg:sticky lg:top-28">
            <figure className="relative mr-4 mb-6 lg:mr-6">
              <img
                src={imgSrc}
                srcSet={imgSrc === FALLBACK_IMAGE ? FALLBACK_SRCSET : undefined}
                sizes="(min-width: 1024px) 460px, 100vw"
                onError={() => imgSrc !== FALLBACK_IMAGE && setImgSrc(FALLBACK_IMAGE)}
                alt={
                  imgSrc === FALLBACK_IMAGE
                    ? "Glass-fronted commercial building and flyover at dusk"
                    : "The Fraternity Engineering team"
                }
                width={1200}
                height={1500}
                loading="lazy"
                decoding="async"
                className="aspect-[4/5] w-full rounded-[6px] border border-line object-cover object-[62%_50%]"
              />
              {established.trim() !== "" && (
                <figcaption className="absolute -right-4 -bottom-6 lg:-right-6 bg-navy border border-line rounded-[4px] p-4">
                  <p className="text-[14px] font-medium text-white">Islamabad, Pakistan</p>
                  <p className="mt-0.5 text-[13px] text-fg-subtle">Established {established}</p>
                </figcaption>
              )}
            </figure>
          </Reveal>

          {/* Copy */}
          <div className="lg:col-span-7">
            <Reveal>
              <p className={eyebrow}>About us</p>
              <h2
                id="about-title"
                className="mt-4 font-heading font-medium text-[clamp(2rem,1.4rem+2.4vw,3rem)] leading-[1.1] tracking-tight text-white [text-wrap:balance]"
              >
                One team that builds, wires and protects.
              </h2>
              {story.map((para, i) => (
                <p key={i} className={`${i === 0 ? "mt-6" : "mt-4"} max-w-[58ch] text-[17px] leading-[1.7] text-fg-muted`}>
                  {para}
                </p>
              ))}
            </Reveal>

            {stats.length > 0 && (
              <Reveal className="mt-10">
                <dl className="flex divide-x divide-line">
                  {stats.map((s) => (
                    <div key={s.label} className="flex-1 px-5 first:pl-0 sm:px-8">
                      <dt className="sr-only">{s.label}</dt>
                      <dd className="font-heading font-medium text-[32px] sm:text-[40px] leading-none whitespace-nowrap text-white">
                        {s.text ?? <CountUp value={s.value ?? 0} suffix={s.suffix ?? ""} />}
                      </dd>
                      <dd className="mt-2 text-[13px] text-fg-subtle" aria-hidden="true">
                        {s.label}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            )}

            <Reveal className="mt-12 border-t border-line pt-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">
                <div>
                  <h3 className={eyebrow}>Mission</h3>
                  <p className="mt-3 text-[16px] leading-relaxed text-fg-muted">{mission}</p>
                </div>
                <div>
                  <h3 className={eyebrow}>Vision</h3>
                  <p className="mt-3 text-[16px] leading-relaxed text-fg-muted">{vision}</p>
                </div>
              </div>
            </Reveal>

            {founder.name.trim() !== "" && (
              <Reveal className="mt-12">
                <figure className="border-t border-line pt-8">
                  {founder.quote.trim() !== "" && (
                    <blockquote className="max-w-[58ch] text-[15px] leading-[1.7] text-fg-muted">
                      “{founder.quote}”
                    </blockquote>
                  )}
                  <figcaption className="mt-4 text-[14px] text-fg-subtle">
                    <span className="font-medium text-white">{founder.name}</span>
                    {founder.role.trim() !== "" && <>, {founder.role}</>}
                  </figcaption>
                </figure>
              </Reveal>
            )}
          </div>
        </div>

        {/* Core values */}
        <Reveal className="mt-16 lg:mt-20 border-t border-line pt-10">
          <h3 className={eyebrow}>Our core values</h3>
          <p className="mt-3 text-[17px] leading-[1.7] text-fg-muted">We cherish five core values.</p>
          <ol className="mt-8 border-b border-line">
            {coreValues.map((v, i) => (
              <li key={v.title} className="grid grid-cols-1 gap-3 border-t border-line py-7 lg:grid-cols-12 lg:gap-8">
                <div className="flex items-baseline gap-4 lg:col-span-4">
                  <span className="text-[13px] tabular-nums text-fg-subtle">{String(i + 1).padStart(2, "0")}</span>
                  <h4 className="font-heading text-[22px] font-medium leading-snug text-white">{v.title}</h4>
                </div>
                <p className="max-w-[62ch] text-[16px] leading-[1.7] text-fg-muted lg:col-span-8">{v.description}</p>
              </li>
            ))}
          </ol>
        </Reveal>

        {/* Project and programme management */}
        <Reveal className="mt-16 lg:mt-20">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <h3 className={eyebrow}>Project and programme management</h3>
              <h4 className="mt-4 font-heading text-[28px] font-medium leading-tight text-white">Four measures on every project.</h4>
              <p className="mt-4 max-w-[52ch] text-[16px] leading-[1.7] text-fg-muted">
                Every project is managed on scope, time, cost and quality.
              </p>
            </div>
            <div className="lg:col-span-6">
              <svg
                role="img"
                viewBox="0 0 420 380"
                className="mx-auto block w-full max-w-[420px]"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <title>Project management triangle: scope, time and cost around quality</title>
                <desc>An equilateral triangle with scope at the top, time at the bottom left and cost at the bottom right, and quality at the centre.</desc>
                <path className="tri-path" pathLength={1} d="M210 70 L360 330 L60 330 Z" stroke="var(--white)" strokeOpacity={0.7} strokeWidth={1.5} />
                <g stroke="var(--white)" strokeOpacity={0.25} strokeWidth={1}>
                  <line x1="210" y1="222" x2="210" y2="75" />
                  <line x1="166" y1="269" x2="65" y2="327" />
                  <line x1="254" y1="269" x2="355" y2="327" />
                </g>
                <g fill="var(--accent)">
                  <circle cx="210" cy="70" r="5" />
                  <circle cx="60" cy="330" r="5" />
                  <circle cx="360" cy="330" r="5" />
                </g>
                <g fill="var(--white)" fontSize="14" letterSpacing="1.68" textAnchor="middle" fontFamily="inherit">
                  <text x="210" y="46">SCOPE</text>
                  <text x="60" y="360">TIME</text>
                  <text x="360" y="360">COST</text>
                </g>
                <text x="210" y="248" fill="var(--accent)" fontSize="14" letterSpacing="1.68" textAnchor="middle" fontFamily="inherit">QUALITY</text>
              </svg>
            </div>
          </div>
        </Reveal>

        {credentialItems.length > 0 && (
          <Reveal className="mt-16 lg:mt-20 border-t border-line pt-8">
            <ul className="flex flex-wrap gap-x-10 gap-y-3" aria-label="Credentials">
              {credentialItems.map((c) => (
                <li key={c} className="flex items-center gap-2 text-[14px] text-fg-muted">
                  <Check className="w-4 h-4 text-icon" strokeWidth={2.5} aria-hidden="true" />
                  {c}
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </section>
  );
};
