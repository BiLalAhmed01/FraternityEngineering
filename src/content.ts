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
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  organisation: string;
  result: string;
  isPlaceholder: true;
}

export interface WorkShowcaseItem {
  id: string;
  category: 'Construction' | 'Civil' | 'Electrical' | 'Fire & safety' | 'Supply';
  title: string;
  scope: string;
  clientType: string;
  location: string;
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
    tagline: "Makes Life Easier.",
    subline: "Construction, civil, electrical, fire and safety, and general supply. One dependable team.",
    registration: "(SMC-Pvt) Ltd.",
    foundedLocation: "Islamabad, Pakistan",
  },

  contact: {
    address: "Shop # 01, Block # 54, I&T Center, G-8/1, Islamabad",
    city: "Islamabad, 44000",
    phonePrimary: "0331-5095004",
    phoneSecondary: "051-2331654",
    phoneDisplay: "0331-5095004 · 051-2331654",
    email: "fraternityengineering@gmail.com",
    workingHours: "Monday to Saturday: 9:00 AM - 6:00 PM (Friday break: 1:00 PM - 2:30 PM)",
    googleMapsSearchUrl: "https://www.google.com/maps/search/?api=1&query=Shop+01+Block+54+IT+Center+G-8%2F1+Islamabad",
    whatsappUrl: "https://wa.me/923315095004?text=Hello%20Fraternity%20Engineering,%20I%20would%20like%20to%20inquire%20about%20your%20services.",
  },

  nav: [
    { label: "Services", href: "#services" },
    { label: "Our work", href: "#work" },
    { label: "Clients", href: "#clients" },
    { label: "Process", href: "#process" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],

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
      name: "Construction Services",
      shortTag: "Structural & Buildings",
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
      name: "Civil Engineering Works",
      shortTag: "Infrastructure & Earthworks",
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
      name: "Electrical Works",
      shortTag: "Power & Systems",
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
      name: "Fire & Safety Solutions",
      shortTag: "Protection & Safety",
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
      id: "general-supply",
      name: "General Order Supply",
      shortTag: "Procurement & Supply",
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
    { name: "AWC", fullName: "Air Weapons Complex", logo: "/assets/client-awc.webp" },
    { name: "CDA", fullName: "Capital Development Authority", logo: "/assets/client-cda.webp" },
    { name: "Nayatel", fullName: "Nayatel", logo: "/assets/client-nayatel.webp" },
    { name: "PTCL", fullName: "Pakistan Telecommunication Company Limited", logo: "/assets/client-ptcl.webp" },
  ] as ClientLogo[],

  missionVision: {
    mission: {
      kicker: "Our Mission",
      title: "Dependable Engineering That Reduces Complexity",
      paragraphs: [
        "To deliver dependable engineering, construction, and procurement solutions that simplify complex projects for public and private organizations across Pakistan through technical integrity and direct accountability.",
        "We strive to eliminate unnecessary contractor layers, offering clients practical problem-solving, transparent pricing, and robust craft on every milestone.",
      ],
    },
    vision: {
      kicker: "Our Vision",
      title: "A Benchmark For Reliable Engineering Services",
      paragraphs: [
        "To be the most dependable multi-discipline engineering and supply partner in the region, recognized for solid execution, prompt responsiveness, and lasting professional relationships.",
        "We aim to grow through the trust earned from zero-compromise safety, durable works, and seamless institutional cooperation.",
      ],
    },
  },

  processSteps: [
    {
      step: "01",
      title: "Consult",
      summary: "Direct technical consultation to define site parameters, operational constraints, and scope boundaries.",
      details: "We meet on site or review project tenders, establishing specific technical requirements, material expectations, and preliminary timeline limits.",
    },
    {
      step: "02",
      title: "Plan and quote",
      summary: "Itemized bill of quantities (BOQ) with unambiguous pricing, clear milestones, and verified lead times.",
      details: "Our engineering estimators prepare comprehensive schedules, transparent cost breakdowns, and risk assessments with zero hidden charges.",
    },
    {
      step: "03",
      title: "Execute",
      summary: "Disciplined site management, experienced craft supervision, and proactive quality compliance checks.",
      details: "Works proceed under continuous supervision by qualified personnel, adhering strictly to safety regulations and quality checkpoints.",
    },
    {
      step: "04",
      title: "Handover and support",
      summary: "Formal inspection walkthrough, signed documentation, and dependable after-sales maintenance backup.",
      details: "We conduct final load tests and joint verifications, handing over as-built manuals, warranty sheets, and responsive post-delivery support.",
    },
  ] as ProcessStep[],
};
