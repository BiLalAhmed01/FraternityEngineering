/**
 * All copy and structured data for Fraternity Engineering & Co. (SMC-Pvt) Ltd.
 * Plain, specific, and dependable. No exaggerated statistics or claims.
 */

export interface ServiceItem {
  id: string;
  name: string;
  shortTag: string;
  summary: string;
  subservices: string[];
  image: string;
}

export interface WhyPoint {
  number: string;
  title: string;
  description: string;
}

export interface ProjectPlaceholder {
  id: string;
  title: string;
  category: 'Construction' | 'Civil' | 'Electrical' | 'Fire & safety' | 'Supply';
  categoryLabel: string;
  description: string;
  blueprintType: string;
  specs: string[];
  scope: string;
  isPlaceholder: true;
}

export interface ProcessStep {
  step: string;
  title: string;
  summary: string;
  details: string;
  /** Homepage "How we work" copy */
  description: string;
  deliverable: string;
  /** Typical timing for this stage. Hidden when empty. */
  timing: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  organisation: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface WorkShowcaseItem {
  id: string;
  category: 'Construction' | 'Civil' | 'Electrical' | 'Fire & safety' | 'Supply';
  title: string;
  scope: string;
  clientType: string;
  location: string;
  year?: string;
  delivered: string;
  isPlaceholder: true;
}

export interface ClientLogo {
  name: string;
  fullName: string;
  logo: string;
}

export const SITE_CONTENT = {
  company: {
    name: "Fraternity Engineering & Co. (SMC-Pvt) Ltd.",
    shortName: "FTE",
    subline: "Construction, civil, electrical, fire safety and supply under one contract. One accountable team.",
    registration: "(SMC-Pvt) Ltd.",
    foundedLocation: "Islamabad, Pakistan",
  },

  contact: {
    address: "Shop #01, Block 54, I&T Center, G-8/1, Islamabad",
    city: "Islamabad, 44000",
    phonePrimary: "0331-5095004",
    phoneSecondary: "051-2331654",
    phonePrimaryTel: "+923315095004",
    phoneSecondaryTel: "+92512331654",
    // Reply time promised in the Contact section, e.g. "1 working day". Every sentence that uses it is hidden while blank.
    responseTime: "",
    phoneDisplay: "0331-5095004 · 051-2331654",
    email: "fraternityengineering@gmail.com",
    // Domain email for the footer. Left blank until provided; the footer hides it when empty.
    domainEmail: "",
    workingHours: "Monday to Saturday: 9:00 AM - 6:00 PM (Friday break: 1:00 PM - 2:30 PM)",
    googleMapsSearchUrl: "https://www.google.com/maps/search/?api=1&query=Shop+01+Block+54+IT+Center+G-8%2F1+Islamabad",
    // Social profiles for the footer. Each icon is hidden while its URL is blank.
    social: { linkedin: "", facebook: "" },
    whatsappUrl: "https://wa.me/923315095004?text=Hello%20Fraternity%20Engineering,%20I%20would%20like%20to%20inquire%20about%20your%20services.",
  },

  nav: [
    { label: "Services", href: "#services" },
    { label: "Our work", href: "#work" },
    { label: "Clients", href: "#clients" },
    { label: "Process", href: "#process" },
    { label: "About", href: "#about" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ],

  // Hero trust row. Each item is hidden while its value is blank. Fill in once confirmed.
  hero: {
    yearsInOperation: "", // e.g. "10" renders "10+ years"
    projectsDelivered: "", // e.g. "150" renders "150+ projects delivered"
    pecCategory: "", // e.g. "C-3" renders "PEC C-3 registered"
  },

  companyProfileUrl: "/assets/company-profile.pdf",

  clientScopes: "", // e.g. "electrical, fire alarm and civil works". Hidden when empty.

  testimonials: [] as Testimonial[], // Section is hidden when empty.

  about: {
    story: [
      "Fraternity Engineering & Co. (SMC-Pvt) Ltd. is an Islamabad-based contractor and supplier. We take on construction, civil, electrical and fire safety works, and supply the materials that go with them, for government, corporate and industrial clients.",
      "Projects slip in the gaps between trades. We close those gaps with one contract, one schedule and one engineer who answers for the work on site. If something is wrong, you know exactly who to call.",
      "We work with facilities managers, procurement teams and project owners who want one contractor to call.",
    ],
    // Image falls back to /assets/hero.webp if this file is missing.
    image: "/assets/about-team.webp",
    established: "", // e.g. "2015". The "Established" caption card is hidden when empty.
    // Stats reuse hero.yearsInOperation and hero.projectsDelivered; blank values are hidden.
    founder: { name: "", role: "", quote: "" }, // Founder note is hidden when name is empty.
    mission:
      "To deliver construction, engineering and supply work as quoted, with direct accountability to the client.",
    vision:
      "To be the multi-discipline contractor that organisations in the region call first, and keep calling.",
    howWeWork: [
      { title: "Accountable", description: "A named engineer answers for the work, on site and on paper." },
      { title: "Transparent", description: "Itemised quotations, so you see what each item costs." },
      { title: "Documented", description: "Inspection logs, test records and a signed handover pack." },
    ],
    // Credentials row. PEC uses hero.pecCategory. Empty items are hidden; the row is hidden when all are empty.
    credentials: { ntn: "", secp: "", certification: "" },
  },

  workShowcase: [
    {
      id: "work-01",
      category: "Construction",
      title: "Commercial Administrative Facility Renovation",
      scope: "Full interior and structural refurbishment of a multi-story administrative facility",
      clientType: "Corporate",
      location: "Islamabad",
      delivered: "2,400 sqm floor area",
      isPlaceholder: true,
    },
    {
      id: "work-02",
      category: "Civil",
      title: "Industrial Access Road & Stormwater Drainage",
      scope: "1.2km reinforced asphalt approach road with pre-cast culverts and drainage ditches",
      clientType: "Government",
      location: "Rawalpindi",
      delivered: "1.2km road, 4 culverts",
      isPlaceholder: true,
    },
    {
      id: "work-03",
      category: "Electrical",
      title: "Primary Low-Voltage Distribution & Lighting",
      scope: "Centralized main distribution panels, cable tray, and high-bay industrial illumination",
      clientType: "Industrial",
      location: "Taxila",
      delivered: "1600A MDP, 18 lighting zones",
      isPlaceholder: true,
    },
    {
      id: "work-04",
      category: "Fire & safety",
      title: "Integrated Smoke Detection & Standpipe Network",
      scope: "Addressable smoke detection loops, motorized booster pump, and internal standpipe risers",
      clientType: "Government",
      location: "Islamabad",
      delivered: "32 detection points, pressure tested",
      isPlaceholder: true,
    },
    {
      id: "work-05",
      category: "Supply",
      title: "Industrial Hardware & Fastener Consignment",
      scope: "Procurement, batch certification, and on-site delivery of structural bolts and conduit",
      clientType: "Corporate",
      location: "Islamabad",
      delivered: "500 units fasteners, phased deliveries",
      isPlaceholder: true,
    },
  ] as WorkShowcaseItem[],

  services: [
    {
      id: "construction",
      name: "Construction",
      shortTag: "Buildings and structures",
      summary: "Construction solutions for commercial, institutional and infrastructure requirements, from building development and renovation to structural works and project execution.",
      subservices: [
        "Building construction and renovation",
        "General construction works",
        "Structural and building-related works",
        "Repair and rehabilitation",
        "Commercial and institutional development",
        "Site execution and project coordination",
      ],
      image: "/assets/service-construction.webp",
    },
    {
      id: "civil",
      name: "Civil works",
      shortTag: "Roads, drainage and sites",
      summary: "Civil engineering and infrastructure works supporting building development, facility improvement and site infrastructure requirements.",
      subservices: [
        "Civil construction and infrastructure works",
        "Concrete and masonry works",
        "Excavation and earthworks",
        "Roads and pavements",
        "Drainage and associated civil works",
        "Maintenance and rehabilitation",
      ],
      image: "/assets/service-civil.webp",
    },
    {
      id: "electrical",
      name: "Electrical",
      shortTag: "Power and distribution",
      summary: "Electrical installation, distribution and maintenance services for commercial, institutional and building requirements.",
      subservices: [
        "Electrical installation and maintenance",
        "Power distribution and wiring",
        "Electrical cabling and connections",
        "Lighting installations",
        "Electrical equipment installation",
        "Inspection, troubleshooting and repair",
      ],
      image: "/assets/service-electrical.webp",
    },
    {
      id: "fire-safety",
      name: "Fire and safety",
      shortTag: "Detection and protection",
      summary: "Fire protection, detection and safety solutions designed to support safer operational and working environments.",
      subservices: [
        "Firefighting equipment and supplies",
        "Fire alarm and detection systems",
        "Fire protection and suppression solutions",
        "Emergency safety equipment",
        "Fire safety installations",
        "Safety-related equipment and supplies",
      ],
      image: "/assets/service-fire.webp",
    },
    {
      id: "supply",
      name: "Supply",
      shortTag: "Materials and equipment",
      summary: "Procurement and supply services for engineering, construction, industrial and operational requirements.",
      subservices: [
        "General engineering supplies",
        "Construction materials",
        "Electrical equipment and accessories",
        "Industrial tools and hardware",
        "Firefighting and safety equipment",
        "General-purpose equipment and materials",
        "Client-specific procurement requirements",
      ],
      image: "/assets/service-supply.webp",
    },
  ] as ServiceItem[],

  clientLogos: [
    { name: "NESCOM", fullName: "National Engineering & Scientific Commission", logo: "/assets/client-nescom.webp" },
    { name: "NDC", fullName: "National Development Complex", logo: "/assets/client-ndc.webp" },
    { name: "MTC", fullName: "Maritime Technologies Complex", logo: "/assets/client-mtc.webp" },
    // TODO: verify this logo matches the client
    { name: "AWC", fullName: "Air Weapons Complex", logo: "/assets/client-awc.webp" },
    { name: "CDA", fullName: "Capital Development Authority", logo: "/assets/client-cda.webp" },
    { name: "Nayatel", fullName: "Nayatel", logo: "/assets/client-nayatel.webp" },
    { name: "PTCL", fullName: "Pakistan Telecommunication Company Limited", logo: "/assets/client-ptcl.webp" },
  ] as ClientLogo[],

  processSteps: [
    {
      step: "01",
      title: "Consult",
      summary: "A direct discussion to define the site, constraints and scope.",
      details: "We meet on site or review the tender, and agree the technical requirements, materials and rough timeline.",
      description: "We visit the site or review your tender to agree scope, constraints and technical requirements.",
      deliverable: "Site assessment and scope notes",
      timing: "",
    },
    {
      step: "02",
      title: "Plan and quote",
      summary: "Itemised bill of quantities (BOQ) with clear pricing, milestones and lead times.",
      details: "Our estimators prepare the schedule and a full cost breakdown so you can see what each item costs.",
      description: "We prepare an itemised bill of quantities with pricing, milestones and lead times, so you can see what each item costs.",
      deliverable: "Itemised BOQ and project schedule",
      timing: "",
    },
    {
      step: "03",
      title: "Execute",
      summary: "Site management, supervised work and regular quality checks.",
      details: "Work is supervised on site and follows safety rules and quality checkpoints.",
      description: "Qualified supervisors manage the works on site, following safety rules and quality checkpoints at each stage.",
      deliverable: "Progress updates and inspection logs",
      timing: "",
    },
    {
      step: "04",
      title: "Handover and support",
      summary: "Final walkthrough, signed documents and after-sales support.",
      details: "We run final tests and joint checks, then hand over as-built documents and warranty sheets.",
      description: "We run final tests and a joint inspection, then hand over as-built documents, warranty sheets and after-sales support.",
      deliverable: "Signed handover pack",
      timing: "",
    },
  ] as ProcessStep[],
};
