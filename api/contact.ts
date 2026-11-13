/**
 * POST /api/contact: validates a quote request on the server, then forwards it by email through
 * the existing FormSubmit address. Responses are generic; no stack traces or personal data are logged.
 */
import { checkSubmission, rateLimited } from "../src/utils/contactServer.js";

declare const process: { env: Record<string, string | undefined> };

const FORWARD_URL = process.env.CONTACT_FORWARD_URL || "https://formsubmit.co/ajax/fraternityengineering@gmail.com";
const MAX_BODY_BYTES = 11 * 1024 * 1024; // 10 MB file + form fields

const reply = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

const log = (status: number, note: string) => console.log(JSON.stringify({ ts: new Date().toISOString(), status, note }));

export async function POST(request: Request): Promise<Response> {
  try {
    const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
    if (rateLimited(ip)) {
      log(429, "rate-limited");
      return reply(429, { ok: false, error: "Too many requests. Please try again in a few minutes, or call us." });
    }

    const length = Number(request.headers.get("content-length") ?? 0);
    if (length > MAX_BODY_BYTES) {
      log(413, "too-large");
      return reply(413, { ok: false, error: "That file is larger than 10 MB." });
    }
    if (!(request.headers.get("content-type") ?? "").includes("multipart/form-data")) {
      log(415, "bad-type");
      return reply(415, { ok: false, error: "Please check the form and try again." });
    }

    const result = await checkSubmission(await request.formData());
    if (!result.ok) {
      log(result.status, "rejected");
      return reply(result.status, { ok: false, error: result.error });
    }
    if (result.spam) {
      log(200, "filtered");
      return reply(200, { ok: true });
    }

    const { data, file } = result;
    const out = new FormData();
    out.append("_subject", `New Quote Request - ${data.service} - ${data.fullName}`);
    out.append("_template", "table");
    out.append("_captcha", "false");
    if (data.email) out.append("_replyto", data.email);
    out.append("name", data.fullName);
    out.append("company", data.companyName || "Not provided");
    out.append("phone", data.phone);
    out.append("email", data.email || "Not provided");
    out.append("service", data.service);
    out.append("budget", data.budget || "Not provided");
    out.append("timeline", data.timeline || "Not provided");
    out.append("message", data.message);
    if (file) out.append("attachment", file, file.name);

    const upstream = await fetch(FORWARD_URL, { method: "POST", headers: { Accept: "application/json" }, body: out });
    if (!upstream.ok) {
      log(502, `upstream-${upstream.status}`);
      return reply(502, { ok: false, error: "We couldn't send your request." });
    }
    log(200, "sent");
    return reply(200, { ok: true });
  } catch {
    log(500, "error");
    return reply(500, { ok: false, error: "We couldn't send your request." });
  }
}

export function GET(): Response {
  return reply(405, { ok: false, error: "Method not allowed." });
}
