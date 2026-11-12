/**
 * Homepage FAQ. The section and its FAQPage JSON-LD both render from FAQ_ITEMS.
 * Fill in FAQ_VALUES; while a value is blank, the sentence or fragment that needs it is left out.
 */
import { SITE_CONTENT } from "./content";

export const FAQ_VALUES = {
  otherAreas: "", // e.g. "Lahore" → "...Islamabad, Rawalpindi and Lahore."
  quoteTime: "", // e.g. "5 working days"
  defectsPeriod: "", // a full sentence, e.g. "Civil works carry a 12-month defects liability period."
  supplierType: "", // e.g. "approved local and international"
  paymentExample: "", // e.g. "30% on mobilisation, 60% against progress and 10% on handover"
  // Registration numbers come from the hero / About credentials.
  pec: SITE_CONTENT.hero.pecCategory,
  ntn: SITE_CONTENT.about.credentials.ntn,
  secp: SITE_CONTENT.about.credentials.secp,
};

export interface FaqEntry {
  slug: string;
  question: string;
  answer: string;
}

const has = (v: string) => v.trim() !== "";
const v = FAQ_VALUES;

const registrationDocs = [has(v.pec) && `PEC ${v.pec}`, has(v.ntn) && `NTN ${v.ntn}`, has(v.secp) && `SECP ${v.secp}`]
  .filter(Boolean)
  .join(", ");

export const FAQ_ITEMS: FaqEntry[] = [
  {
    slug: "one-contract",
    question: "Can one contract cover several disciplines?",
    answer:
      "Yes. Construction, civil, electrical, fire and safety, and supply can sit under a single contract with one named coordinator, so trades are sequenced together and you deal with one team instead of several contractors.",
  },
  {
    slug: "areas",
    question: "Which areas do you serve?",
    answer: `We are based in Islamabad and regularly work in ${
      has(v.otherAreas) ? `Islamabad, Rawalpindi and ${v.otherAreas}` : "Islamabad and Rawalpindi"
    }. For larger projects we mobilise teams elsewhere in Pakistan.`,
  },
  {
    slug: "tenders",
    question: "Do you take tender and government work?",
    answer: `Yes. We respond to tenders and quotation requests from government, public-sector and institutional bodies. Registration and compliance documents${
      registrationDocs ? ` (${registrationDocs})` : ""
    } are available on request.`,
  },
  {
    slug: "quote-time",
    question: "How quickly can I get a quote?",
    answer: `After a site visit or review of your BOQ and drawings, we issue an itemised quotation${
      has(v.quoteTime) ? ` within ${v.quoteTime}` : ""
    }. Sending drawings or a scope summary with your request speeds this up.`,
  },
  {
    slug: "warranty",
    question: "What warranty and after-sales support do you offer?",
    answer: [
      "Handover includes warranty sheets and as-built documents. Warranty terms depend on the scope and the manufacturer's cover, and are stated in your quotation.",
      v.defectsPeriod.trim(),
    ]
      .filter(Boolean)
      .join(" "),
  },
  {
    slug: "materials",
    question: "Where do you source materials?",
    answer: has(v.supplierType)
      ? `We procure from ${v.supplierType} suppliers and provide material data sheets and test certificates where your specification requires them.`
      : "We procure materials for each project and provide material data sheets and test certificates where your specification requires them.",
  },
  {
    slug: "payment",
    question: "What are your payment terms?",
    answer: `Terms are agreed in the quotation and are normally linked to milestones${
      has(v.paymentExample) ? `, for example ${v.paymentExample}` : ""
    }. Government work follows the terms of the tender.`,
  },
];
