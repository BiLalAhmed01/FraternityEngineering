import React from "react";
import { LegalPage, LegalP, LegalList, LegalLink, LegalSection } from "../components/LegalPage";
import { SITE_CONTENT } from "../content";

const lastUpdated = "November 6, 2026";

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
      <LegalP>
        Our website uses Google Fonts for typography and links to WhatsApp and Google Maps.
        These services may collect technical data under their own privacy policies. We do not
        use advertising trackers, analytics cookies, or sell visitor data.
      </LegalP>
    ),
  },
  {
    id: "retention-and-security",
    title: "Data retention and security",
    body: (
      <LegalP>
        We retain inquiry data only as long as needed to respond and fulfill contractual
        obligations. We apply reasonable administrative and technical safeguards to protect
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
        within a reasonable timeframe.
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
