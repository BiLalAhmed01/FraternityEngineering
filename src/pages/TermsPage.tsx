import React from "react";
import { LegalPage, LegalP, LegalList, LegalLink, LegalSection } from "../components/LegalPage";
import { SITE_CONTENT } from "../content";

const lastUpdated = "November 6, 2026";

const email = SITE_CONTENT.contact.email;

const sections: LegalSection[] = [
  {
    id: "acceptance",
    title: "Acceptance of terms",
    body: (
      <LegalP>
        By using this website or engaging Fraternity Engineering &amp; Co. (SMC-Pvt) Ltd.
        ("FTE") for services, you agree to these terms. If you do not agree, please do not use
        the website or engage our services.
      </LegalP>
    ),
  },
  {
    id: "our-services",
    title: "Our services",
    body: (
      <LegalP>
        FTE provides construction, civil engineering, electrical, fire &amp; safety, and general
        order supply services in Pakistan. All work is subject to formal quotation, scope
        agreement, and applicable contractual terms.
      </LegalP>
    ),
  },
  {
    id: "quotations",
    title: "Quotations and estimates",
    body: (
      <LegalList
        items={[
          "Quotes are valid for the period stated in the quotation document",
          "Prices are based on the scope described and may change if scope, site conditions, or material costs change",
          "A formal purchase order or signed agreement is required before work commences",
        ]}
      />
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual property",
    body: (
      <LegalP>
        All content on this website, including text, graphics, logos and images, is the
        property of FTE or its licensors and may not be reproduced without written permission.
      </LegalP>
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    body: (
      <LegalP>
        The website is provided "as is" for informational purposes. FTE does not guarantee that
        the site will be uninterrupted or error-free. Liability for services is governed by
        the specific contract for each engagement.
      </LegalP>
    ),
  },
  {
    id: "governing-law",
    title: "Governing law",
    body: (
      <LegalP>
        These terms are governed by the laws of Pakistan. Any disputes shall be subject to the
        exclusive jurisdiction of the courts of Islamabad, Pakistan.
      </LegalP>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <LegalP>
        Questions about these terms? Contact us at {SITE_CONTENT.contact.address}, {SITE_CONTENT.contact.city}, or
        email <LegalLink href={`mailto:${email}`}>{email}</LegalLink>.
      </LegalP>
    ),
  },
];

export const TermsPage: React.FC = () => (
  <LegalPage
    title="Terms and conditions"
    updated={lastUpdated}
    intro="The terms that apply when you use this website or engage Fraternity Engineering & Co. for services."
    sections={sections}
    other={{ href: "/privacy", label: "Privacy policy" }}
  />
);
