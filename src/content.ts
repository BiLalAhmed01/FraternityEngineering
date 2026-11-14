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
    // Years in business is computed from the 2017 founding year (see Hero.tsx).
    projectsDelivered: "", // e.g. "150" renders "150+ projects delivered"
    pecCategory: "", // e.g. "C-3" renders "PEC C-3 registered"
  },

  clientScopes: "", // e.g. "electrical, fire alarm and civil works". Hidden when empty.

  testimonials: [] as Testimonial[], // Section is hidden when empty.

  about: {
    story: [
      "Fraternity Engineering was established in 2017. We provide civil, telecommunications, electrical and fire and safety solutions in Pakistan, with a clear vision to deliver high quality at an economical price. We have experienced unprecedented growth in recent years.",
      "Our commitment is to anticipate and satisfy our customers' requirements with a range of top-quality products and services. We work together as a team, sharing experience and knowledge, and concentrate on developing high-quality, value-added services. With the spirit of pioneers, we encourage creativity and innovation to stay competitive and cutting edge. We strive to combine the power of a corporate player with the dynamism and enthusiasm of an entrepreneurial start-up.",
    ],
    // Team photo, e.g. "/assets/about-team.webp". Blank uses the building photo instead (no request for a missing file).
    image: "",
    established: "2017", // The "Established" caption card and the first stat are hidden when empty.
    // Stats reuse hero.projectsDelivered; blank values are hidden.
    founder: { name: "", role: "", quote: "" }, // Founder note is hidden when name is empty.
    mission:
      "Our mission is to establish long-term, mutually rewarding relationships with each of our valued clients by consistently surpassing their expectations and gaining their trust through exemplary and dedicated performance by every member of the FTE team.",
    vision:
      "To be the most professional and respected commercial civil and electrical contractor and service provider. We understand that our clients appreciate the focus on preventative and proactive maintenance and the resulting peace of mind that comes from working with us.",
    coreValues: [
      { title: "Customer focus", description: "We concentrate our efforts towards a better and long-term relationship with our clients, and ensure we build a trust-based relationship with them." },
      { title: "Service", description: "We strive to ensure excellent service in everything we do, and we do it with honesty, integrity and professionalism." },
      { title: "Competitive", description: "FTE operates a competitive business, offering customers a service at a price that can assure customer satisfaction while still providing a reasonable profit from operations for FTE." },
      { title: "Teamwork", description: "We value collaboration and team contribution, encourage creativity, initiatives and new solutions, and align to the utmost result exceeding success." },
      { title: "Commitment", description: "We monitor every project thoroughly from beginning to end. We have the energy to ignite others to perform. Our team makes sure that we treat our colleagues, customers, suppliers and community with integrity, respect and empathy." },
    ],
    // Credentials row. PEC uses hero.pecCategory. Empty items are hidden; the row is hidden when all are empty.
    credentials: { ntn: "", secp: "", certification: "" },
  },

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
      name: "Chemicals and Materials",
      shortTag: "Chemicals and materials supply",
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
    { name: "NESCOM", fullName: "National Engineering & Scientific Commission", logo: "/assets/clients/nescom.webp" },
    { name: "NDC", fullName: "National Development Complex", logo: "/assets/clients/ndc.webp" },
    { name: "MTC", fullName: "Maritime Technologies Complex", logo: "/assets/clients/mtc.webp" },
    // TODO: verify this logo matches the client
    { name: "AWC", fullName: "Air Weapons Complex", logo: "/assets/clients/awc.webp" },
    { name: "CDA", fullName: "Capital Development Authority", logo: "/assets/clients/cda.webp" },
    { name: "Nayatel", fullName: "Nayatel", logo: "/assets/clients/nayatel.webp" },
    { name: "PTCL", fullName: "Pakistan Telecommunication Company Limited", logo: "/assets/clients/ptcl.webp" },
    { name: "NPB", fullName: "National Police Bureau", logo: "/assets/clients/npb.webp" },
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
