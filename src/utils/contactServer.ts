/**
 * Server-side checks for quote requests (used by api/contact.ts). Never trust the browser:
 * every field is trimmed, stripped of markup, length-limited and validated again here.
 */
import { BUDGET_RANGES, TIMELINES, VALID_SERVICES, validateContactForm, ContactFormData } from "./validation";

export const LIMITS = { name: 100, company: 150, phone: 20, email: 254, message: 4000, file: 10 * 1024 * 1024 } as const;
export const MIN_FILL_MS = 3000;

/** Fields the form may send. Anything else is rejected. */
const ALLOWED_FIELDS = new Set([
  "name", "company", "phone", "email", "service", "budget", "timeline", "message", "attachment", "website", "startedAt",
]);

export type CheckResult =
  | { ok: true; spam: false; data: ContactFormData; file: File | null }
  | { ok: true; spam: true }
  | { ok: false; status: number; error: string };

/** Trim, drop tags and control characters (keeps newlines in the message). */
export const clean = (value: unknown, max: number, multiline = false) => {
  let s = typeof value === "string" ? value : "";
  s = s.replace(/<[^>]*>/g, "").replace(multiline ? /[\u0000-\u0009\u000B-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, "");
  return s.trim().slice(0, max);
};

const SIGNATURES: Record<string, (b: Uint8Array) => boolean> = {
  pdf: (b) => b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46, // %PDF
  xlsx: (b) => b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04, // ZIP container
  xls: (b) => b[0] === 0xd0 && b[1] === 0xcf && b[2] === 0x11 && b[3] === 0xe0, // OLE2
  dwg: (b) => b[0] === 0x41 && b[1] === 0x43 && b[2] === 0x31 && b[3] === 0x30, // "AC10"
};
const MIME: Record<string, string[]> = {
  pdf: ["application/pdf"],
  xlsx: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/zip"],
  xls: ["application/vnd.ms-excel"],
  dwg: ["application/acad", "application/x-acad", "application/autocad_dwg", "image/vnd.dwg", "image/x-dwg", "application/dwg"],
};

/** Extension, declared type (when the browser sends one) and file signature must all agree. */
export const checkFile = async (file: File): Promise<string | null> => {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!SIGNATURES[ext]) return "That file type isn't supported. Use PDF, DWG or XLSX.";
  if (file.size > LIMITS.file) return "That file is larger than 10 MB.";
  const type = file.type.toLowerCase();
  if (type && type !== "application/octet-stream" && !MIME[ext].includes(type)) {
    return "That file type isn't supported. Use PDF, DWG or XLSX.";
  }
  const head = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  if (!SIGNATURES[ext](head)) return "That file type isn't supported. Use PDF, DWG or XLSX.";
  return null;
};

export const checkSubmission = async (form: FormData, now = Date.now()): Promise<CheckResult> => {
  for (const key of form.keys()) {
    if (!ALLOWED_FIELDS.has(key)) return { ok: false, status: 400, error: "Please check the form and try again." };
  }

  // Honeypot filled, or the form was submitted faster than a person could fill it: accept quietly, send nothing.
  if (clean(form.get("website"), 200) !== "") return { ok: true, spam: true };
  const startedAt = Number(form.get("startedAt"));
  if (!Number.isFinite(startedAt) || now - startedAt < MIN_FILL_MS) return { ok: true, spam: true };

  const data: ContactFormData = {
    fullName: clean(form.get("name"), LIMITS.name),
    companyName: clean(form.get("company"), LIMITS.company),
    phone: clean(form.get("phone"), LIMITS.phone),
    email: clean(form.get("email"), LIMITS.email),
    service: clean(form.get("service"), 60),
    budget: clean(form.get("budget"), 60),
    timeline: clean(form.get("timeline"), 60),
    message: clean(form.get("message"), LIMITS.message, true),
  };

  const { isValid } = validateContactForm(data);
  const knownBudget = !data.budget || (BUDGET_RANGES as readonly string[]).includes(data.budget);
  const knownTimeline = !data.timeline || (TIMELINES as readonly string[]).includes(data.timeline);
  const knownService = (VALID_SERVICES as readonly string[]).includes(data.service);
  if (!isValid || !knownBudget || !knownTimeline || !knownService) {
    return { ok: false, status: 400, error: "Please check the form and try again." };
  }

  const raw = form.get("attachment");
  let file: File | null = null;
  if (raw && typeof raw !== "string" && raw.size > 0) {
    const fileError = await checkFile(raw);
    if (fileError) return { ok: false, status: 400, error: fileError };
    file = raw;
  }

  return { ok: true, spam: false, data, file };
};

/** Best-effort per-IP limit (5 per 10 minutes). In-memory, so it applies per warm function instance. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

export const rateLimited = (ip: string, now = Date.now()) => {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // keep memory bounded
  return recent.length > MAX_PER_WINDOW;
};
