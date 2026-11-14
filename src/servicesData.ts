/**
 * Data for the /services/[slug] pages. One entry per service, rendered by pages/ServicePage.tsx.
 * Scopes and summaries come from SITE_CONTENT.services (single source of truth).
 * Fields left empty are hidden on the page. Only add facts you can stand behind.
 */
import { SITE_CONTENT, ServiceItem, FaqItem } from "./content";
import { PROJECTS, Project, ProjectCategory } from "./projectsData";

export type ServiceSlug = "construction" | "civil" | "electrical" | "fire-safety" | "supply";

interface ServiceDetail {
  seoTitle: string; // <title> text, without the brand suffix
  workCategories: ProjectCategory[]; // related projects from projectsData.ts. Empty = section hidden.
  overview: string;
  standards: string[]; // e.g. "PEC-registered contractor", "NFPA 72 for alarm design". Hidden when empty.
  faq: FaqItem[];
}

const quoteFaq = (name: string): FaqItem[] => [
  {
    question: "How do I get a quote?",
    answer: `Send your ${name.toLowerCase()} scope, drawings or site details through the quote form. We reply with an itemised quote.`,
  },
  {
    question: "Can you work from a tender or BOQ?",
    answer: "Yes. Send the tender documents or bill of quantities and we will review the scope with you.",
  },
];

const DETAILS: Record<ServiceSlug, ServiceDetail> = {
  construction: {
    seoTitle: "Construction Contractor in Islamabad",
    workCategories: ["Construction"],
    overview:
      "New buildings, renovation and structural works for commercial, institutional and industrial clients, built to your drawings and specifications.",
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
    seoTitle: "Civil Works Contractor in Islamabad",
    workCategories: [], // no civil project on record yet,
    overview:
      "Roads, drainage, culverts and site development that prepare the ground for the buildings that follow, and keep it working.",
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
    seoTitle: "Electrical Contractor in Islamabad",
    workCategories: ["Electrical"],
    overview:
      "Low-voltage distribution, panels, wiring and lighting, installed, tested and handed over with the documents your facility team needs.",
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
    seoTitle: "Fire Alarm and Safety Systems, Islamabad",
    workCategories: ["Fire & Safety"],
    overview:
      "Fire detection, alarm, hydrant and standpipe systems, tested and commissioned before handover.",
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
    seoTitle: "Chemicals and Materials Supply, Islamabad",
    workCategories: [], // no supply project on record yet,
    overview:
      "Construction chemicals, hardware, electrical and fire safety materials, sourced to specification and delivered to site.",
    standards: [],
    faq: [
      {
        question: "Can you source items to a specific specification?",
        answer: "Yes. Send us the item list or specification and we will quote it as a client-specific procurement.",
      },
      ...quoteFaq("Chemicals and materials"),
    ],
  },
};

export interface ServicePageData extends ServiceItem, ServiceDetail {
  slug: ServiceSlug;
  relatedProjects: Project[];
}

export const SERVICE_PAGES: ServicePageData[] = SITE_CONTENT.services.map((service) => {
  const slug = service.id as ServiceSlug;
  const detail = DETAILS[slug];
  const relatedProjects = PROJECTS.filter((p) => detail.workCategories.includes(p.category)).slice(0, 3);
  return { ...service, ...detail, slug, relatedProjects };
});

export const getServicePage = (slug: string): ServicePageData | undefined =>
  SERVICE_PAGES.find((s) => s.slug === slug);

export const serviceUrl = (slug: string) => `/services/${slug}`;
