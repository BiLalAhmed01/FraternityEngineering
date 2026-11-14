import React from "react";
import { LegalPage, LegalP, LegalList, LegalLink, LegalSection } from "../components/LegalPage";
import { SITE_CONTENT } from "../content";

const lastUpdated = "November 14, 2026";

const email = SITE_CONTENT.contact.email;

const sections: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    body: (
      <LegalP>
        Fraternity Engineering &amp; Co. (SMC-Pvt) Ltd. ("FTE", "we", "us") is an engineering,
        construction, and supply company based in Islamabad, Pakistan. This policy explains how
        we collect, use, and protect information when you visit our website or contact us.
      </LegalP>
    ),
  },
  {
    id: "information-we-collect",
    title: "Information we collect",
    body: (
      <>
        <LegalP>We collect information you voluntarily provide, including:</LegalP>
        <LegalList
          items={[
            "Name, company name, phone number, and email address submitted through our contact or quote request form",
            "Project details, service requirements, and messages you send us",
            "Basic technical data such as browser type and pages visited (via standard server logs)",
          ]}
        />
      </>
    ),
  },
  {
    id: "how-we-use-it",
    title: "How we use your information",
    body: (
      <>
        <LegalList
          items={[
            "To respond to inquiries and prepare quotations",
            "To deliver contracted engineering, construction, and supply services",
            "To communicate about ongoing projects and after-sales support",
            "To improve our website and services",
          ]}
        />
        <LegalP className="mt-5">We do not sell, rent, or trade your personal information to third parties.</LegalP>
      </>
    ),
  },
  {
    id: "third-party-services",
    title: "Third-party services",
    body: (
      <>
        <LegalP>We use the following services to run this website and handle your requests:</LegalP>
        <LegalList
          items={[
            "Vercel hosts the website and the form handler. Standard server logs, such as IP address and browser type, are kept by the host.",
            "FormSubmit (formsubmit.co) delivers the quote or contact form, including any file you attach, to our email inbox.",
            "Google Maps loads only after you choose to load the map, and may set its own cookies under Google's privacy policy.",
            "WhatsApp opens only when you choose a WhatsApp link, under WhatsApp's own privacy policy.",
          ]}
        />
        <LegalP className="mt-5">
          Fonts are hosted on our own server. We do not use advertising trackers or analytics cookies, and we do not
          sell visitor data.
        </LegalP>
      </>
    ),
  },
  {
    id: "cookies-and-storage",
    title: "Cookies and local storage",
    body: (
      <>
        <LegalP>
          This website does not set tracking or advertising cookies. It stores a few small items in your browser so the
          site works as you expect:
        </LegalP>
        <LegalList
          items={[
            "fte-cookie-consent remembers that you dismissed the cookie notice.",
            "fte_theme remembers your light or dark display choice.",
            "fte_splash_seen (session storage) stops the intro animation repeating during one visit.",
          ]}
        />
        <LegalP className="mt-5">
          You can clear these at any time in your browser settings. The notice will then appear again.
        </LegalP>
      </>
    ),
  },
  {
    id: "retention-and-security",
    title: "Data retention and security",
    body: (
      <LegalP>
        We keep quote and contact inquiries for up to 24 months after our last
        correspondence, or longer where a contract or the law requires it, and then delete them.
        Server logs kept by our host are retained for a short period under its own policy. We apply reasonable administrative and technical safeguards to protect
        your information.
      </LegalP>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    body: (
      <LegalP>
        You may request access to, correction of, or deletion of your personal information by
        contacting us at <LegalLink href={`mailto:${email}`}>{email}</LegalLink>. We will respond
        within 30 days. Depending on where you live, laws such as Pakistan's data protection rules, the GDPR
        or the CCPA may give you further rights, including the right to object to processing and the right to
        complain to a regulator. We do not sell personal information.
      </LegalP>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <LegalP>
        Questions about this policy? Reach us at {SITE_CONTENT.contact.address}, {SITE_CONTENT.contact.city}, or
        email <LegalLink href={`mailto:${email}`}>{email}</LegalLink>.
      </LegalP>
    ),
  },
];

export const PrivacyPage: React.FC = () => (
  <LegalPage
    title="Privacy policy"
    updated={lastUpdated}
    intro="How Fraternity Engineering & Co. collects, uses and protects information when you visit this website or contact us."
    sections={sections}
    other={{ href: "/terms", label: "Terms and conditions" }}
  />
);
