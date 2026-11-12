/**
 * Data for the /services/[slug] pages. One entry per service, rendered by pages/ServicePage.tsx.
 * Scopes and summaries come from SITE_CONTENT.services (single source of truth).
 * Fields left empty are hidden on the page. Only add facts you can stand behind.
 */
import { SITE_CONTENT, ServiceItem, WorkShowcaseItem, FaqItem } from "./content";

export type ServiceSlug = "construction" | "civil" | "electrical" | "fire-safety" | "supply";

interface ServiceDetail {
  workCategories: WorkShowcaseItem["category"][]; // related projects, in order of relevance
  overview: string;
  standards: string[]; // e.g. "PEC-registered contractor", "NFPA 72 for alarm design". Hidden when empty.
  faq: FaqItem[];
}

const quoteFaq = (name: string): FaqItem[] => [
  {
    question: "How do I get a quote?",
    answer: `Send your ${name.toLowerCase()} scope, drawings or site details through the quote form. We reply with an itemized quote.`,
  },
  {
    question: "Can you work from a tender or BOQ?",
    answer: "Yes. Send the tender documents or bill of quantities and we will review the scope with you.",
  },
];

const DETAILS: Record<ServiceSlug, ServiceDetail> = {
  construction: {
    workCategories: ["Construction", "Civil"],
    overview:
      "We build and renovate commercial, institutional and infrastructure facilities, from structural works to finishing, under one site team.",
    standards: [],
    faq: [
      {
        question: "What kind of buildings do you work on?",
        answer: "Commercial and institutional buildings, including new construction, renovation, repair and rehabilitation.",
      },
      ...quoteFaq("Construction"),
    ],
  },
  civil: {
    workCategories: ["Civil", "Construction"],
    overview:
      "We carry out civil and infrastructure works that support buildings and sites: earthworks, concrete, roads, pavements and drainage.",
    standards: [],
    faq: [
      {
        question: "Do you handle roads and drainage?",
        answer: "Yes. Roads, pavements, drainage and the related excavation and concrete works are part of our civil scope.",
      },
      ...quoteFaq("Civil"),
    ],
  },
  electrical: {
    workCategories: ["Electrical", "Fire & safety"],
    overview:
      "We install, maintain and repair electrical systems for commercial, institutional and industrial buildings, from distribution to lighting.",
    standards: [],
    faq: [
      {
        question: "Do you do maintenance as well as new installations?",
        answer: "Yes. We cover new installations, inspection, troubleshooting and repair.",
      },
      ...quoteFaq("Electrical"),
    ],
  },
  "fire-safety": {
    workCategories: ["Fire & safety", "Electrical"],
    overview:
      "We supply and install fire alarm, detection and suppression systems and safety equipment for buildings and workplaces.",
    standards: [],
    faq: [
      {
        question: "Do you supply the equipment as well as install it?",
        answer: "Yes. We supply firefighting and safety equipment and install fire alarm, detection and protection systems.",
      },
      ...quoteFaq("Fire and safety"),
    ],
  },
  supply: {
    workCategories: ["Supply", "Electrical"],
    overview:
      "We procure and deliver construction materials, electrical equipment, tools and safety items to your specification.",
    standards: [],
    faq: [
      {
        question: "Can you source items to a specific specification?",
        answer: "Yes. Send us the item list or specification and we will quote it as a client-specific procurement.",
      },
      ...quoteFaq("Supply"),
    ],
  },
};

export interface ServicePageData extends ServiceItem, ServiceDetail {
  slug: ServiceSlug;
  relatedProjects: WorkShowcaseItem[];
}

export const SERVICE_PAGES: ServicePageData[] = SITE_CONTENT.services.map((service) => {
  const slug = service.id as ServiceSlug;
  const detail = DETAILS[slug];
  const relatedProjects = detail.workCategories
    .map((cat) => SITE_CONTENT.workShowcase.find((w) => w.category === cat))
    .filter((w): w is WorkShowcaseItem => Boolean(w))
    .slice(0, 2);
  return { ...service, ...detail, slug, relatedProjects };
});

export const getServicePage = (slug: string): ServicePageData | undefined =>
  SERVICE_PAGES.find((s) => s.slug === slug);

export const serviceUrl = (slug: string) => `/services/${slug}`;
