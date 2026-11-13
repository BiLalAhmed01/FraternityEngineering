/**
 * Pure validation and formatting logic for Fraternity Engineering & Co. contact/quote requests.
 * Required: name, phone, discipline, scope. Optional: email, organisation, budget, timeline, file.
 */

export interface ContactFormData {
  fullName: string;
  companyName: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  budget: string;
  timeline: string;
}

export interface ValidationErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
  file?: string;
}

export const VALID_SERVICES = [
  "Construction",
  "Civil works",
  "Electrical",
  "Fire and safety",
  "Chemicals and materials",
  "Several disciplines",
  "Not sure yet",
] as const;

export const BUDGET_RANGES = [
  "Under PKR 500,000",
  "PKR 500,000 - 2,000,000",
  "PKR 2,000,000 - 10,000,000",
  "Above PKR 10,000,000",
  "Not sure yet",
] as const;

export const TIMELINES = [
  "Urgent (within 2 weeks)",
  "Within 1 month",
  "1 to 3 months",
  "3 months or more",
  "Just exploring",
] as const;

export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const ALLOWED_FILE_EXTENSIONS = ["pdf", "dwg", "xlsx"] as const;

export function validateFile(file: File | null): string | undefined {
  if (!file) return undefined;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!(ALLOWED_FILE_EXTENSIONS as readonly string[]).includes(ext)) {
    return "That file type isn't supported. Use PDF, DWG or XLSX.";
  }
  if (file.size > MAX_FILE_BYTES) {
    return "That file is larger than 10 MB.";
  }
  return undefined;
}

type FieldName = "fullName" | "email" | "phone" | "service" | "message";

export function validateField(name: FieldName, data: ContactFormData): string | undefined {
  switch (name) {
    case "fullName": {
      const v = data.fullName.trim();
      if (!v) return "Please enter your name.";
      if (v.length < 2) return "Name must be at least 2 characters.";
      if (v.length > 80) return "Name is too long.";
      return undefined;
    }
    case "email": {
      const v = data.email.trim();
      if (v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Please enter a valid email address.";
      return undefined;
    }
    case "phone": {
      const v = data.phone.trim();
      const digits = v.replace(/[\s\-\+\(\)]/g, "");
      if (!v) return "Please enter a phone number we can reach you on.";
      if (digits.length < 7 || digits.length > 15 || !/^\d+$/.test(digits)) {
        return "Please enter a valid phone number (at least 7 digits).";
      }
      return undefined;
    }
    case "service":
      if (!data.service || !VALID_SERVICES.includes(data.service as (typeof VALID_SERVICES)[number])) {
        return "Please choose a discipline.";
      }
      return undefined;
    case "message": {
      const v = data.message.trim();
      if (!v) return "Please describe your project.";
      if (v.length < 10) return "Please provide more details (at least 10 characters).";
      return undefined;
    }
  }
}

export function validateContactForm(data: ContactFormData): {
  isValid: boolean;
  errors: ValidationErrors;
} {
  const errors: ValidationErrors = {};
  (["fullName", "email", "phone", "service", "message"] as FieldName[]).forEach((f) => {
    const err = validateField(f, data);
    if (err) errors[f] = err;
  });
  return { isValid: Object.keys(errors).length === 0, errors };
}

/**
 * Format payload for the WhatsApp fallback / direct message
 */
export function formatWhatsAppMessage(data: ContactFormData): string {
  const company = data.companyName.trim() ? ` (${data.companyName.trim()})` : "";
  const lines = [
    `*Inquiry for Fraternity Engineering & Co.*`,
    `*From:* ${data.fullName.trim()}${company}`,
    `*Phone:* ${data.phone.trim()}`,
    data.email.trim() ? `*Email:* ${data.email.trim()}` : "",
    `*Service:* ${data.service}`,
    data.budget ? `*Budget:* ${data.budget}` : "",
    data.timeline ? `*Timeline:* ${data.timeline}` : "",
    `*Message:* ${data.message.trim()}`,
  ].filter(Boolean);
  return encodeURIComponent(lines.join("\n"));
}
