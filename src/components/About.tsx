import React, { useState } from "react";
import { Check } from "lucide-react";
import { SITE_CONTENT } from "../content";
import { Reveal } from "./Reveal";
import { CountUp } from "./CountUp";

const FALLBACK_IMAGE = "/assets/about-fallback-1200.webp";
const FALLBACK_SRCSET = [480, 768, 1200].map((w) => `/assets/about-fallback-${w}.webp ${w}w`).join(", ");

const eyebrow = "text-[12px] font-semibold uppercase tracking-[0.12em] text-label";

export const About: React.FC = () => {
  const { story, image, established, founder, mission, vision, howWeWork, credentials } = SITE_CONTENT.about;
  const { yearsInOperation, projectsDelivered, pecCategory } = SITE_CONTENT.hero;
  const [imgSrc, setImgSrc] = useState(image || FALLBACK_IMAGE);

  const stats = [
    { value: yearsInOperation, suffix: "+", label: "Years in business" },
    { value: projectsDelivered, suffix: "+", label: "Projects delivered" },
    { value: "5", suffix: "", label: "Disciplines" },
  ].filter((s) => s.value.trim() !== "" && !Number.isNaN(Number(s.value)));

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
                    <div key={s.label} className="flex-1 max-w-[200px] px-5 first:pl-0 sm:px-8">
                      <dt className="sr-only">{s.label}</dt>
                      <dd className="font-heading font-medium text-[40px] leading-none text-white">
                        <CountUp value={Number(s.value)} suffix={s.suffix} />
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

            <Reveal className="mt-12">
              <h3 className={eyebrow}>Principles</h3>
              <ol className="mt-5 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-line border-y border-line">
                {howWeWork.map((item, i) => (
                  <li key={item.title} className="py-6 md:px-6 md:first:pl-0 md:last:pr-0">
                    <span className="text-[12px] font-medium tracking-[0.12em] text-fg-subtle tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="mt-3 font-heading font-medium text-[17px] text-white">{item.title}</p>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-fg-subtle">{item.description}</p>
                  </li>
                ))}
              </ol>
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
