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
}

export interface StatItem {
  value: string;
  label: string;
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
    tagline: "Makes Life Easier.",
    subline: "Construction, civil, electrical, fire and safety, and general supply. One dependable team.",
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
    // Hours promised in the form success message. Left blank until confirmed; the message omits it when empty.
    replyHours: "",
    phoneDisplay: "0331-5095004 · 051-2331654",
    email: "fraternityengineering@gmail.com",
    // Domain email for the footer. Left blank until provided; the footer hides it when empty.
    domainEmail: "",
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
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ],

  // Stats bar. Values left blank are hidden. Fill in once confirmed.
  stats: [
    { value: "", label: "Years in operation" },
    { value: "", label: "Projects completed" },
    { value: "", label: "Disciplines" },
    { value: "", label: "PEC registration" },
    { value: "NTN/SECP", label: "Registered" },
  ] as StatItem[],

  companyProfileUrl: "/assets/company-profile.pdf",

  clientScopes: "", // e.g. "electrical, fire alarm and civil works". Hidden when empty.

  testimonials: [] as Testimonial[], // Section is hidden when empty.

  about: {
    story:
      "Fraternity Engineering & Co. (SMC-Pvt) Ltd. is an Islamabad-based contractor and supplier. We handle construction, civil, electrical and fire and safety works, and general order supply, for government, public-sector and private clients.",
    founder: { name: "", role: "" }, // Hidden when name is empty.
    mission:
      "To deliver construction, engineering and supply work as quoted, with direct accountability to the client.",
    vision:
      "To be a dependable multi-discipline engineering and supply partner in the region.",
    credentials: [] as string[], // e.g. "PEC: ...", "NTN: ...", "ISO ...". Row is hidden when empty.
  },

  faq: [
    {
      question: "Which areas do you serve?",
      answer:
        "We are based in Islamabad and work for clients in Islamabad, Rawalpindi and across Pakistan.",
    },
    {
      question: "Do you take tender and government work?",
      answer:
        "Yes. Our clients include government and public-sector organizations. Send us the tender documents and we will review the scope.",
    },
    {
      question: "How quickly can I get a quote?",
      answer:
        "Send your scope, drawings or site details through the contact form. We confirm the time needed for the quote when we reply.",
    },
    {
      question: "What warranty and after-sales support do you offer?",
      answer:
        "At handover we provide as-built documents and warranty sheets, and we stay available for support after delivery.",
    },
    {
      question: "Where do you source materials?",
      answer:
        "We procure construction, electrical and fire safety materials and equipment ourselves through our general order supply service, and we list them in the quote.",
    },
    {
      question: "What are your payment terms?",
      answer:
        "Payment terms are set per project and written in the quotation. They are agreed before work starts.",
    },
  ] as FaqItem[],

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
      id: "supply",
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

  processSteps: [
    {
      step: "01",
      title: "Consult",
      summary: "A direct discussion to define the site, constraints and scope.",
      details: "We meet on site or review the tender, and agree the technical requirements, materials and rough timeline.",
    },
    {
      step: "02",
      title: "Plan and quote",
      summary: "Itemized bill of quantities (BOQ) with clear pricing, milestones and lead times.",
      details: "Our estimators prepare the schedule and a full cost breakdown so you can see what each item costs.",
    },
    {
      step: "03",
      title: "Execute",
      summary: "Site management, supervised work and regular quality checks.",
      details: "Work is supervised on site and follows safety rules and quality checkpoints.",
    },
    {
      step: "04",
      title: "Handover and support",
      summary: "Final walkthrough, signed documents and after-sales support.",
      details: "We run final tests and joint checks, then hand over as-built documents and warranty sheets.",
    },
  ] as ProcessStep[],
};
