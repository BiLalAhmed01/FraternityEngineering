/**
 * Pure validation and formatting logic for Fraternity Engineering & Co. contact/quote requests.
 */

export interface ContactFormData {
  fullName: string;
  companyName: string;
  phone: string;
  email: string;
  service: string;
  message: string;
}

export interface ValidationErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
}

export const VALID_SERVICES = [
  "Construction",
  "Civil works",
  "Electrical works",
  "Fire & safety",
  "General order supplier",
  "Multiple / Integrated services",
  "General inquiry",
] as const;

export function validateContactForm(data: ContactFormData): {
  isValid: boolean;
  errors: ValidationErrors;
} {
  const errors: ValidationErrors = {};

  // Name validation
  const trimmedName = data.fullName.trim();
  if (!trimmedName) {
    errors.fullName = "Please enter your full name.";
  } else if (trimmedName.length < 2) {
    errors.fullName = "Name must be at least 2 characters.";
  } else if (trimmedName.length > 80) {
    errors.fullName = "Name is too long.";
  }

  // Email validation
  const trimmedEmail = data.email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!trimmedEmail) {
    errors.email = "Please enter your email address.";
  } else if (!emailRegex.test(trimmedEmail)) {
    errors.email = "Please enter a valid email address.";
  }

  // Phone validation (Pakistani phone formats: e.g., 0331-5095004, 051-2331654, +92 331 5095004, etc.)
  const trimmedPhone = data.phone.trim();
  const cleanPhoneDigits = trimmedPhone.replace(/[\s\-\+\(\)]/g, "");
  if (!trimmedPhone) {
    errors.phone = "Please provide a contact phone number.";
  } else if (cleanPhoneDigits.length < 7 || cleanPhoneDigits.length > 15 || !/^\d+$/.test(cleanPhoneDigits)) {
    errors.phone = "Please enter a valid phone number (at least 7 digits).";
  }

  // Service selection
  if (!data.service || !VALID_SERVICES.includes(data.service as (typeof VALID_SERVICES)[number])) {
    errors.service = "Please select a required engineering service.";
  }

  // Message validation
  const trimmedMessage = data.message.trim();
  if (!trimmedMessage) {
    errors.message = "Please describe your project or requirements.";
  } else if (trimmedMessage.length < 10) {
    errors.message = "Please provide more details (at least 10 characters).";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Format payload for submission or WhatsApp direct message
 */
export function formatWhatsAppMessage(data: ContactFormData): string {
  const cleanName = data.fullName.trim();
  const company = data.companyName.trim() ? ` (${data.companyName.trim()})` : "";
  const lines = [
    `*Inquiry for Fraternity Engineering & Co.*`,
    `*From:* ${cleanName}${company}`,
    `*Phone:* ${data.phone.trim()}`,
    `*Email:* ${data.email.trim()}`,
    `*Service:* ${data.service}`,
    `*Message:* ${data.message.trim()}`,
  ];
  return encodeURIComponent(lines.join("\n"));
}
