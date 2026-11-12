/**
 * Projects shown in the "Our work" section. Everything in that section renders from this array.
 * Leave `location` or `year` as "" to hide them.
 */

/** Set to false to hide the "Project illustration" label on tiles and in the detail modal. */
export const SHOW_ILLUSTRATION_LABEL = true;

export type ProjectCategory = "Fire & Safety" | "Electrical" | "Construction" | "Civil" | "Supply";

export interface Project {
  slug: string;
  title: string;
  category: ProjectCategory;
  location: string;
  year: string;
  description: string;
  /** One-line result shown under "Outcome" in the project modal. Hidden while blank. */
  outcome: string;
  image: string;
  alt: string;
  facts: string[];
  isIllustration: boolean;
}

export const PROJECT_IMAGE_SIZE = { width: 1672, height: 941 } as const;

/** Maps a project category to the matching option in the contact form's discipline dropdown. */
export const CATEGORY_TO_DISCIPLINE: Record<ProjectCategory, string> = {
  "Fire & Safety": "Fire and safety",
  Electrical: "Electrical",
  Construction: "Construction",
  Civil: "Civil works",
  Supply: "Supply",
};

export const PROJECTS: Project[] = [
  {
    slug: "imc-hospital-fire-alarm",
    title: "Fire Alarm System Installation, IMC Hospital",
    category: "Fire & Safety",
    location: "H-11/4, Islamabad",
    year: "",
    description: "Addressable detection, alarm configuration, testing and commissioning in a live hospital.",
    outcome: "",
    image: "/assets/projects/imc-hospital-fire-alarm.png",
    alt: "FTE team installing a fire alarm detector at IMC Hospital, Islamabad",
    facts: ["Alarm installation", "System configuration", "Testing & commissioning", "HSE compliant"],
    isIllustration: true,
  },
  {
    slug: "f6-park-flood-lights",
    title: "Flood Lights with Poles, F-6 Park",
    category: "Electrical",
    location: "F-6, Islamabad",
    year: "",
    description:
      "Supply and installation of pole-mounted flood lighting, including foundations, erection and commissioning.",
    outcome: "",
    image: "/assets/projects/f6-park-flood-lights.png",
    alt: "FTE crew erecting a flood light pole with a crane truck at F-6 Park, Islamabad",
    facts: ["Supply & installation", "Civil & electrical works", "Testing & commissioning"],
    isIllustration: true,
  },
  {
    slug: "i-guard-pre-engineered-structures",
    title: "I-Guard Pre-Engineered Structures",
    category: "Construction",
    location: "",
    year: "",
    description: "Steel frame erection and roof sheeting for pre-engineered buildings.",
    outcome: "",
    image: "/assets/projects/i-guard-pre-engineered-structures.png",
    alt: "FTE workers fixing roof sheeting on a crane-lifted steel frame of a pre-engineered building",
    facts: ["Robust & durable", "Fast installation", "Engineered for safety"],
    isIllustration: true,
  },
  {
    slug: "pre-fab-structures",
    title: "Pre-FAB Structures Installation",
    category: "Construction",
    location: "",
    year: "",
    description: "Crane-assisted placement of modular prefabricated units on prepared foundations.",
    outcome: "",
    image: "/assets/projects/pre-fab-structures.png",
    alt: "FTE team guiding a crane-lifted prefabricated cabin onto concrete foundation blocks",
    facts: ["Modular & prefabricated", "Fast installation", "Durable & reliable"],
    isIllustration: true,
  },
  {
    slug: "street-light-poles-7th-avenue",
    title: "Street Light Poles, 7th Avenue",
    category: "Electrical",
    location: "7th Avenue, Islamabad",
    year: "",
    description: "Installation of street light poles and fixtures along a major urban corridor.",
    outcome: "",
    image: "/assets/projects/street-light-poles-7th-avenue.png",
    alt: "FTE technicians installing a street light pole and fixture on 7th Avenue, Islamabad",
    facts: ["Urban infrastructure", "Safe & reliable lighting", "Sustainable city development"],
    isIllustration: true,
  },
  {
    slug: "old-naval-headquarters-repair",
    title: "Repair & Maintenance, Old Naval Headquarters",
    category: "Construction",
    location: "",
    year: "",
    description:
      "Structural repair, surface restoration, masonry and finishing works on a heritage building.",
    outcome: "",
    image: "/assets/projects/old-naval-headquarters-repair.png",
    alt: "FTE engineer reviewing drawings as workers on scaffolding restore the Old Naval Headquarters facade",
    facts: ["Structural repair", "Surface restoration", "Masonry & finishing", "General maintenance"],
    isIllustration: true,
  },
];

export const projectMeta = (p: Project) => [p.location, p.year].filter(Boolean).join(" · ");
