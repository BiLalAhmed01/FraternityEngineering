import React from "react";
import { Facebook, Linkedin } from "lucide-react";
import { SITE_CONTENT } from "../content";
import { serviceUrl } from "../servicesData";
import { NAV_LINKS, sectionHref } from "./Header";

const DIRECTIONS_URL =
  "https://www.google.com/maps/search/?api=1&query=Shop+01+Block+54+IT+Center+G-8%2F1+Islamabad";

const SERVICE_LINKS = [
  { label: "Construction", slug: "construction" },
  { label: "Civil works", slug: "civil" },
  { label: "Electrical", slug: "electrical" },
  { label: "Fire and safety", slug: "fire-safety" },
  { label: "Supply", slug: "supply" },
];

// Company column follows the navbar's names and anchors, minus Services (which has its own column).
const COMPANY_ORDER = ["about", "work", "clients", "process", "faq", "contact"];
const COMPANY_LINKS = COMPANY_ORDER.map((id) => NAV_LINKS.find((l) => l.id === id)!);

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange";
const drawUnderline =
  "relative after:absolute after:inset-x-0 after:-bottom-[3px] after:h-px after:bg-brand-orange after:origin-left after:scale-x-0 after:transition-transform after:duration-200 after:ease-out group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100 motion-reduce:after:transition-none";

const FooterLink: React.FC<{ href: string; children: React.ReactNode; external?: boolean; className?: string }> = ({
  href,
  children,
  external,
  className = "text-white/78",
}) => (
  <a
    href={href}
    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    className={`group inline-flex rounded-sm transition-colors duration-200 hover:text-white ${focusRing} ${className}`}
  >
    <span className={drawUnderline}>{children}</span>
  </a>
);

const ColumnHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-[13px] font-medium text-white/50">{children}</h2>
);

export const Footer: React.FC = () => {
  const { contact, hero, about } = SITE_CONTENT;
  const year = new Date().getFullYear();
  const email = contact.domainEmail || contact.email;

  const credentials = [
    "Fraternity Engineering & Co. (SMC-Pvt) Ltd.",
    hero.pecCategory.trim() && `PEC ${hero.pecCategory.trim()}`,
    about.credentials.ntn.trim() && `NTN ${about.credentials.ntn.trim()}`,
  ].filter(Boolean) as string[];

  const socials = [
    contact.social.linkedin && { label: "LinkedIn", href: contact.social.linkedin, Icon: Linkedin },
    contact.social.facebook && { label: "Facebook", href: contact.social.facebook, Icon: Facebook },
  ].filter(Boolean) as { label: string; href: string; Icon: typeof Linkedin }[];

  return (
    <footer className="border-t border-white/10 bg-brand-navy-deep text-white pt-16 pb-[calc(2rem+56px+env(safe-area-inset-bottom))] md:pb-10 lg:pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12 lg:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-3 lg:col-span-4">
            <a href="/" className={`inline-flex items-center gap-3 rounded-sm ${focusRing}`}>
              <img src="/assets/logo-mark.webp" alt="" width={44} height={40} className="h-10 w-auto" />
              <span className="text-[18px] font-medium text-white">Fraternity Engineering &amp; Co.</span>
            </a>
            <p className="mt-5 max-w-[34ch] text-[15px] leading-[1.7] text-white/65">
              Construction, electrical, fire safety and supply under one contract, from Islamabad. One accountable team.
            </p>
            <ul className="mt-6 space-y-1.5 text-[13px] text-white/55">
              {credentials.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <nav aria-labelledby="footer-company" className="lg:col-span-2">
            <div id="footer-company">
              <ColumnHeading>Company</ColumnHeading>
            </div>
            <ul className="mt-5 space-y-3 text-[15px]">
              {COMPANY_LINKS.map((l) => (
                <li key={l.id}>
                  <FooterLink href={sectionHref(l.id)}>{l.label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-labelledby="footer-services" className="lg:col-span-3">
            <div id="footer-services">
              <ColumnHeading>Services</ColumnHeading>
            </div>
            <ul className="mt-5 space-y-3 text-[15px]">
              {SERVICE_LINKS.map((l) => (
                <li key={l.slug}>
                  <FooterLink href={serviceUrl(l.slug)}>{l.label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="lg:col-span-3">
            <ColumnHeading>Contact</ColumnHeading>
            <address className="mt-5 space-y-4 text-[15px] not-italic leading-relaxed text-white/78">
              <div>
                <p>{contact.address}</p>
                <FooterLink href={DIRECTIONS_URL} external className="mt-1 text-white">
                  Get directions
                </FooterLink>
              </div>
              <div className="space-y-1">
                <p>
                  <FooterLink href={`tel:${contact.phonePrimaryTel}`} className="text-white">
                    {contact.phonePrimary}
                  </FooterLink>
                  <span className="text-white/50"> mobile / WhatsApp</span>
                </p>
                <p>
                  <FooterLink href={`tel:${contact.phoneSecondaryTel}`} className="text-white">
                    {contact.phoneSecondary}
                  </FooterLink>
                  <span className="text-white/50"> landline</span>
                </p>
              </div>
              {email && (
                <p className="break-all">
                  <FooterLink href={`mailto:${email}`} className="text-white">
                    {email}
                  </FooterLink>
                </p>
              )}
              <div>
                <p>Mon to Sat, 9:00 AM - 6:00 PM</p>
                <p className="text-white/50">Friday break 1:00 PM - 2:30 PM</p>
              </div>
            </address>
            {socials.length > 0 && (
              <ul className="-ml-3 mt-5 flex gap-1">
                {socials.map(({ label, href, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className={`inline-flex h-11 w-11 items-center justify-center rounded-sm text-white/70 transition-colors hover:text-white ${focusRing}`}
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-[13px] text-white/55 md:flex-row md:items-center md:justify-between lg:mt-20">
          <p>&copy; {year} Fraternity Engineering &amp; Co. (SMC-Pvt) Ltd. All rights reserved.</p>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-10">
            <div className="flex items-center divide-x divide-white/15">
              <FooterLink href="/privacy" className="pr-4 text-white/55">
                Privacy Policy
              </FooterLink>
              <span className="pl-4">
                <FooterLink href="/terms" className="text-white/55">
                  Terms &amp; Conditions
                </FooterLink>
              </span>
            </div>
            <p>
              Website by{" "}
              <FooterLink href="https://www.robosoftworks.com" external className="text-white/55">
                RoboSoft Works
              </FooterLink>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
