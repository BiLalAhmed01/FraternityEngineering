import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { SITE_CONTENT } from "../content";
import {
  validateContactForm,
  validateField,
  validateFile,
  formatWhatsAppMessage,
  BUDGET_RANGES,
  TIMELINES,
  ContactFormData,
  ValidationErrors,
  VALID_SERVICES,
} from "../utils/validation";
import { ArrowRight, Check, ChevronDown, Loader2, Paperclip, X } from "lucide-react";
import { Reveal } from "./Reveal";

export interface ContactRef {
  prefillService: (serviceName: string, inquiryContext?: string) => void;
}

const EMPTY_FORM: ContactFormData = {
  fullName: "",
  companyName: "",
  phone: "",
  email: "",
  service: "",
  message: "",
  budget: "",
  timeline: "",
};

const WHATSAPP_URL = "https://wa.me/923315095004";
const MAP_QUERY = "Shop+01+Block+54+IT+Center+G-8%2F1+Islamabad";
const OFFICE_ADDRESS = "Shop #01, Block 54, I&T Center, G-8/1, Islamabad";

/** Short names accepted in ?discipline= / #contact?discipline= links. */
const DISCIPLINE_ALIASES: Record<string, string> = {
  construction: "Construction",
  civil: "Civil works",
  "civil-works": "Civil works",
  electrical: "Electrical",
  fire: "Fire and safety",
  "fire-safety": "Fire and safety",
  supply: "Chemicals and materials",
  "general-supply": "Chemicals and materials",
  multiple: "Several disciplines",
  several: "Several disciplines",
};

const toDiscipline = (raw: string | null): string | undefined => {
  if (!raw) return undefined;
  const value = raw.trim().toLowerCase();
  return VALID_SERVICES.find((s) => s.toLowerCase() === value) ?? DISCIPLINE_ALIASES[value];
};

const formatBytes = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

/* ---------- Shared field styles ---------- */

const capsLabel = "text-[12px] font-semibold";
const ERROR_COLOR = "var(--form-error)";
const controlBase =
  "w-full rounded-[4px] border bg-white px-4 text-[16px] text-fg placeholder:text-fg-subtle transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-focus focus:border-focus";
const controlState = (hasError: boolean) => (hasError ? "border-form-error" : "border-line-strong hover:border-fg");
const drawUnderline =
  "relative after:absolute after:inset-x-0 after:-bottom-[3px] after:h-px after:bg-fg after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:ease-out group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100";

const Field: React.FC<{
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}> = ({ id, label, required, error, className = "", children }) => (
  <div className={className}>
    <label htmlFor={id} className="mb-2 block text-[13px] font-medium text-fg">
      {label}
      {required && (
        <span className="text-fg-subtle" aria-hidden="true">
          {" "}
          *
        </span>
      )}
    </label>
    {children}
    {error && (
      <p id={`${id}-error`} className="mt-1.5 text-[13px]" style={{ color: ERROR_COLOR }}>
        {error}
      </p>
    )}
  </div>
);

const Select: React.FC<
  React.SelectHTMLAttributes<HTMLSelectElement> & { hasError?: boolean; placeholder: string; options: readonly string[] }
> = ({ hasError = false, placeholder, options, value, ...props }) => (
  <div className="relative">
    <select
      {...props}
      value={value}
      className={`${controlBase} ${controlState(hasError)} h-[52px] appearance-none pr-11 ${
        value ? "text-fg" : "text-fg-subtle"
      }`}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o} className="text-fg">
          {o}
        </option>
      ))}
    </select>
    <ChevronDown
      className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle"
      strokeWidth={1.5}
      aria-hidden="true"
    />
  </div>
);

/* ---------- Contact ---------- */

export const Contact = forwardRef<ContactRef>((_props, ref) => {
  const { contact } = SITE_CONTENT;
  const email = contact.domainEmail || contact.email;
  const responseTime = contact.responseTime.trim();

  const [formData, setFormData] = useState<ContactFormData>(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  // When the form was shown; the server rejects submissions made in under 3 seconds.
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState<string>("");
  const [agreedToPrivacy, setAgreedToPrivacy] = useState<boolean>(false);
  const [consentError, setConsentError] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    prefillService: (serviceName: string, inquiryContext?: string) => {
      setFormData((prev) => ({
        ...prev,
        service: VALID_SERVICES.includes(serviceName as any) ? serviceName : "Several disciplines",
        message: inquiryContext ? `Inquiry regarding: ${inquiryContext}\n` : prev.message,
      }));
      const el = document.getElementById("contact");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    },
  }));

  // Preselect the discipline from ?discipline=… or #contact?discipline=…
  useEffect(() => {
    const fromUrl = () => {
      const { search, hash } = window.location;
      const fromSearch = new URLSearchParams(search).get("discipline");
      const hashQuery = hash.startsWith("#contact?") ? new URLSearchParams(hash.slice("#contact?".length)).get("discipline") : null;
      const discipline = toDiscipline(hashQuery ?? fromSearch);
      if (!discipline) return;
      setFormData((prev) => ({ ...prev, service: discipline }));
      if (hashQuery) document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    };
    fromUrl();
    window.addEventListener("hashchange", fromUrl);
    return () => window.removeEventListener("hashchange", fromUrl);
  }, []);

  useEffect(() => {
    if (isSubmitted) successRef.current?.focus();
  }, [isSubmitted]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const name = e.target.name as "fullName" | "email" | "phone" | "service" | "message";
    const err = validateField(name, formData);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const pickFile = (picked: File | null) => {
    const err = validateFile(picked);
    setErrors((prev) => ({ ...prev, file: err }));
    if (err || !picked) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      setFile(null);
    } else {
      setFile(picked);
    }
  };

  const removeFile = () => {
    setFile(null);
    setErrors((prev) => ({ ...prev, file: undefined }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Honeypot: silently accept but do not send
    if (honeypot) {
      setIsSubmitted(true);
      return;
    }

    const validation = validateContactForm(formData);
    const fileError = validateFile(file);
    if (!validation.isValid || fileError) {
      setErrors({ ...validation.errors, file: fileError });
      const firstInvalid = (["fullName", "phone", "email", "service", "message"] as const).find((f) => validation.errors[f]);
      if (firstInvalid) document.getElementById(firstInvalid)?.focus();
      return;
    }

    if (!agreedToPrivacy) {
      setConsentError("Please accept the privacy policy to continue.");
      return;
    }
    setConsentError(null);

    setIsSubmitting(true);

    try {
      // Validated and sanitised again on the server (api/contact.ts), which forwards it by email.
      const body = new FormData();
      body.append("name", formData.fullName);
      body.append("company", formData.companyName);
      body.append("phone", formData.phone);
      body.append("email", formData.email);
      body.append("service", formData.service);
      body.append("budget", formData.budget);
      body.append("timeline", formData.timeline);
      body.append("message", formData.message);
      body.append("website", honeypot);
      body.append("startedAt", String(startedAt.current));
      if (file) body.append("attachment", file);

      let response = await fetch("/api/contact", { method: "POST", headers: { Accept: "application/json" }, body });

      // API missing (e.g. a local preview) or failing on the server: send straight to the mail relay so the
      // request still arrives. Validation errors (4xx) are shown to the visitor instead.
      if (response.status === 404 || response.status === 405 || response.status >= 500) {
        const direct = new FormData();
        direct.append("_subject", `New Quote Request - ${formData.service} - ${formData.fullName}`);
        direct.append("_template", "table");
        if (formData.email) direct.append("_replyto", formData.email);
        direct.append("name", formData.fullName);
        direct.append("company", formData.companyName || "Not provided");
        direct.append("phone", formData.phone);
        direct.append("email", formData.email || "Not provided");
        direct.append("service", formData.service);
        direct.append("budget", formData.budget || "Not provided");
        direct.append("timeline", formData.timeline || "Not provided");
        direct.append("message", formData.message);
        if (file) direct.append("attachment", file);
        response = await fetch("https://formsubmit.co/ajax/fraternityengineering@gmail.com", {
          method: "POST",
          headers: { Accept: "application/json" },
          body: direct,
        });
      }

      if (!response.ok) throw new Error("Submission failed");
      setIsSubmitted(true);
    } catch {
      setSubmitError("failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(EMPTY_FORM);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setErrors({});
    setSubmitError(null);
    setIsSubmitted(false);
    setAgreedToPrivacy(false);
    setConsentError(null);
  };

  const describedBy = (id: string, extra?: string) =>
    [errors[id as keyof ValidationErrors] ? `${id}-error` : "", extra ?? ""].filter(Boolean).join(" ") || undefined;

  const directRows: { label: string; content: React.ReactNode }[] = [
    {
      label: "Call",
      content: (
        <div className="flex flex-col gap-1">
          {[
            { href: `tel:${contact.phonePrimaryTel}`, text: contact.phonePrimary },
            { href: `tel:${contact.phoneSecondaryTel}`, text: contact.phoneSecondary },
          ].map((p) => (
            <a key={p.href} href={p.href} className="group inline-flex w-fit min-h-[32px] items-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
              <span className={drawUnderline}>{p.text}</span>
            </a>
          ))}
        </div>
      ),
    },
    {
      label: "WhatsApp",
      content: (
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="group inline-flex min-h-[32px] items-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
          <span className={drawUnderline}>Message us</span>
        </a>
      ),
    },
    ...(email
      ? [
          {
            label: "Email",
            content: (
              <a href={`mailto:${email}`} className="group inline-flex min-h-[32px] items-center rounded-sm break-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
                <span className={drawUnderline}>{email}</span>
              </a>
            ),
          },
        ]
      : []),
    {
      label: "Office",
      content: (
        <>
          <p>{OFFICE_ADDRESS}</p>
          <p className="mt-1 text-[15px] text-fg-subtle">Federal Capital Area, Pakistan</p>
        </>
      ),
    },
    {
      label: "Hours",
      content: (
        <>
          <p>Monday to Saturday, 9:00 AM - 6:00 PM</p>
          <p className="mt-1 text-[15px] text-fg-subtle">Friday break 1:00 PM - 2:30 PM</p>
        </>
      ),
    },
  ];

  const nextSteps = [
    responseTime ? `We review your request within ${responseTime}.` : "We review your request.",
    "We call you or arrange a site visit to confirm the scope.",
    "You receive an itemised quotation with milestones and lead times.",
  ];

  return (
    <section
      id="contact"
      className="cad-grid relative bg-bg text-fg border-t border-line py-[clamp(72px,9vw,120px)]"
      aria-labelledby="contact-title"
    >
      <div className="max-w-7xl mx-auto px-[clamp(20px,5vw,64px)]">
        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-12 lg:gap-24">
          {/* Left: introduction and direct contacts */}
          <Reveal className="lg:col-span-5">
            <p className={`${capsLabel} text-label`}>Contact</p>
            <h2
              id="contact-title"
              className="mt-4 font-heading font-medium text-[clamp(2rem,1.3rem+2.6vw,3.25rem)] leading-[1.08] tracking-tight text-fg [text-wrap:balance]"
            >
              Tell us about your project.
            </h2>
            <p className="mt-6 max-w-[44ch] text-[17px] leading-[1.7] text-fg-muted">
              Send your scope, drawings or BOQ, or call us directly. We review every request and reply with a clear next
              step.
            </p>

            <dl className="mt-10 border-t border-line">
              {directRows.map((row) => (
                <div key={row.label} className="grid grid-cols-[96px_minmax(0,1fr)] gap-4 border-b border-line py-5">
                  <dt className={`${capsLabel} pt-1 text-fg-subtle`}>{row.label}</dt>
                  <dd className="text-[18px] leading-snug text-fg">{row.content}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10">
              <h3 className={`${capsLabel} text-fg-subtle`}>What happens next</h3>
              <ol className="mt-4 space-y-3">
                {nextSteps.map((stepText, i) => (
                  <li key={stepText} className="flex gap-4 text-[15px] leading-relaxed text-fg-muted">
                    <span className="w-6 shrink-0 font-medium tabular-nums text-fg-subtle">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{stepText}</span>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          {/* Right: form panel */}
          <Reveal className="lg:col-span-7" delay={0.05}>
            <div className="theme-paper rounded-[6px] bg-white p-6 text-fg sm:p-10">
              <div aria-live="polite">
                {isSubmitted ? (
                  <div className="py-10 text-center">
                    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-line">
                      <Check className="h-6 w-6 text-form-success" strokeWidth={2} aria-hidden="true" />
                    </span>
                    <h3
                      ref={successRef}
                      tabIndex={-1}
                      className="mt-6 font-heading text-[26px] font-medium text-fg focus:outline-none"
                    >
                      Thank you. Your request is in.
                    </h3>
                    {responseTime && (
                      <p className="mt-3 text-[16px] text-fg-muted">We will contact you within {responseTime}.</p>
                    )}
                    <button
                      type="button"
                      onClick={handleReset}
                      className="group mt-8 inline-flex min-h-[44px] items-center rounded-sm text-[15px] font-medium text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                      <span className={drawUnderline}>Send another request</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="relative">
                    {/* Honeypot: hidden from people, filled by bots */}
                    <div className="absolute -left-[9999px] top-0" aria-hidden="true">
                      <label htmlFor="website">Website</label>
                      <input
                        id="website"
                        name="website"
                        type="text"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

                    <div className="flex items-baseline justify-between gap-4 border-b border-line pb-5">
                      <h3 className="font-heading text-[22px] font-medium text-fg">Request a quote or site visit</h3>
                      <span className="shrink-0 text-[13px] text-fg-muted">* Required</span>
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2">
                      <Field id="fullName" label="Full name" required error={errors.fullName}>
                        <input
                          id="fullName"
                          name="fullName"
                          type="text"
                          autoComplete="name"
                          required
                          value={formData.fullName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          aria-invalid={!!errors.fullName}
                          aria-describedby={describedBy("fullName")}
                          className={`${controlBase} ${controlState(!!errors.fullName)} h-[52px]`}
                        />
                      </Field>

                      <Field id="companyName" label="Organisation">
                        <input
                          id="companyName"
                          name="companyName"
                          type="text"
                          autoComplete="organization"
                          value={formData.companyName}
                          onChange={handleChange}
                          className={`${controlBase} ${controlState(false)} h-[52px]`}
                        />
                      </Field>

                      <Field id="phone" label="Phone" required error={errors.phone}>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          required
                          placeholder="03XX-XXXXXXX"
                          value={formData.phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          aria-invalid={!!errors.phone}
                          aria-describedby={describedBy("phone")}
                          className={`${controlBase} ${controlState(!!errors.phone)} h-[52px]`}
                        />
                      </Field>

                      <Field id="email" label="Email" error={errors.email}>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          placeholder="name@company.com"
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          aria-invalid={!!errors.email}
                          aria-describedby={describedBy("email")}
                          className={`${controlBase} ${controlState(!!errors.email)} h-[52px]`}
                        />
                      </Field>

                      <Field id="service" label="Discipline" required error={errors.service} className="sm:col-span-2">
                        <Select
                          id="service"
                          name="service"
                          required
                          placeholder="Select a discipline"
                          options={VALID_SERVICES}
                          value={formData.service}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          hasError={!!errors.service}
                          aria-invalid={!!errors.service}
                          aria-describedby={describedBy("service")}
                        />
                      </Field>

                      <Field id="budget" label="Budget range">
                        <Select
                          id="budget"
                          name="budget"
                          placeholder="Select a range"
                          options={BUDGET_RANGES}
                          value={formData.budget}
                          onChange={handleChange}
                        />
                      </Field>

                      <Field id="timeline" label="Timeline">
                        <Select
                          id="timeline"
                          name="timeline"
                          placeholder="Select a timeline"
                          options={TIMELINES}
                          value={formData.timeline}
                          onChange={handleChange}
                        />
                      </Field>

                      <Field id="message" label="Project scope" required error={errors.message} className="sm:col-span-2">
                        <textarea
                          id="message"
                          name="message"
                          required
                          placeholder="Describe the site, what needs doing and any dates that matter."
                          value={formData.message}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          aria-invalid={!!errors.message}
                          aria-describedby={describedBy("message")}
                          className={`${controlBase} ${controlState(!!errors.message)} block min-h-[140px] resize-y py-3.5 leading-relaxed`}
                        />
                      </Field>

                      {/* Attachments: custom dropzone over a visually hidden, still-focusable file input */}
                      <div className="sm:col-span-2">
                        <p className="mb-2 block text-[13px] font-medium text-fg" id="attachment-label">
                          Attachments
                        </p>
                        {file ? (
                          <div className="flex items-center gap-3 rounded-[4px] border border-line-strong px-4 py-3">
                            <Paperclip className="h-4 w-4 shrink-0 text-fg-subtle" strokeWidth={1.5} aria-hidden="true" />
                            <span className="min-w-0 flex-1 truncate text-[15px] text-fg" title={file.name}>
                              {file.name}
                            </span>
                            <span className="shrink-0 text-[13px] text-fg-muted">{formatBytes(file.size)}</span>
                            <button
                              type="button"
                              onClick={removeFile}
                              aria-label={`Remove ${file.name}`}
                              className="-mr-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[4px] text-fg-muted hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                            >
                              <X className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                            </button>
                          </div>
                        ) : (
                          <div
                            onDragOver={(e) => {
                              e.preventDefault();
                              setDragging(true);
                            }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={(e) => {
                              e.preventDefault();
                              setDragging(false);
                              pickFile(e.dataTransfer.files?.[0] ?? null);
                            }}
                            className={`relative rounded-[4px] border border-dashed p-6 text-center transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus ${
                              errors.file
                                ? "border-form-error"
                                : dragging
                                  ? "border-fg bg-surface"
                                  : "border-line-strong"
                            }`}
                          >
                            <Paperclip className="mx-auto h-5 w-5 text-fg-subtle" strokeWidth={1.5} aria-hidden="true" />
                            <p className="mt-3 text-[15px] text-fg-muted">
                              Drop drawings or BOQ here, or{" "}
                              <label
                                htmlFor="attachment"
                                className="cursor-pointer font-medium text-fg underline underline-offset-4"
                              >
                                choose a file
                              </label>
                            </p>
                            <p id="attachment-help" className="mt-1.5 text-[13px] text-fg-muted">
                              PDF, DWG or XLSX, up to 10 MB
                            </p>
                            <input
                              ref={fileInputRef}
                              id="attachment"
                              name="attachment"
                              type="file"
                              accept=".pdf,.dwg,.xlsx"
                              onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
                              aria-labelledby="attachment-label"
                              aria-describedby={["attachment-help", errors.file ? "attachment-error" : ""].filter(Boolean).join(" ")}
                              aria-invalid={!!errors.file}
                              className="sr-only"
                            />
                          </div>
                        )}
                        {errors.file && (
                          <p id="attachment-error" className="mt-1.5 text-[13px]" style={{ color: ERROR_COLOR }}>
                            {errors.file}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Privacy consent */}
                    <div className="mt-7">
                      <label className="flex min-h-[44px] cursor-pointer items-start gap-3">
                        <input
                          type="checkbox"
                          checked={agreedToPrivacy}
                          onChange={(e) => {
                            setAgreedToPrivacy(e.target.checked);
                            if (e.target.checked) setConsentError(null);
                          }}
                          aria-invalid={!!consentError}
                          aria-describedby={consentError ? "consent-error" : undefined}
                          className="peer sr-only"
                        />
                        <span
                          aria-hidden="true"
                          className={`mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-[3px] border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus ${
                            agreedToPrivacy
                              ? "border-fg bg-fg"
                              : consentError
                                ? "border-form-error bg-white"
                                : "border-fg bg-white"
                          }`}
                        >
                          {agreedToPrivacy && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                        </span>
                        <span className="text-[14px] leading-relaxed text-fg-muted">
                          I agree to the processing of my details as described in the{" "}
                          <a
                            href="/privacy"
                            className="rounded-sm text-fg underline underline-offset-2 hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                          >
                            Privacy Policy
                          </a>
                          .
                        </span>
                      </label>
                      {consentError && (
                        <p id="consent-error" className="mt-1 text-[13px]" style={{ color: ERROR_COLOR }}>
                          {consentError}
                        </p>
                      )}
                    </div>

                    {/* Submission error: keeps the user's input and offers WhatsApp */}
                    {submitError && (
                      <div className="mt-6 rounded-[4px] border border-form-error/30 border-l-4 border-l-form-error bg-form-error/[0.04] px-4 py-4 text-[15px] leading-relaxed text-fg" role="alert">
                        <p className="font-semibold">Your request was not sent.</p>
                        <p className="mt-1">
                          Your details are still in the form. Submit again, or call{" "}
                          <a
                            href={`tel:${contact.phonePrimaryTel}`}
                            className="rounded-sm font-medium underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                          >
                            {contact.phonePrimary}
                          </a>{" "}
                          or message us on{" "}
                          <a
                            href={`${WHATSAPP_URL}?text=${formatWhatsAppMessage(formData)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-sm font-medium underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                          >
                            WhatsApp
                          </a>
                          .
                        </p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      aria-busy={isSubmitting}
                      className="group mt-7 flex h-14 w-full items-center justify-center gap-2.5 rounded-[4px] bg-accent text-[16px] font-medium text-on-accent transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-wait disabled:opacity-80"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                          <span>Sending…</span>
                        </>
                      ) : (
                        <>
                          <span>Send request</span>
                          <ArrowRight
                            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </button>
                    <p className="mt-3 text-center text-[13px] text-fg-muted">
                      We never share your details.{responseTime && ` Replies within ${responseTime}.`}
                    </p>
                  </form>
                )}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Map */}
        <Reveal className="mt-12">
          <div className="contact-map relative h-[260px] overflow-hidden rounded-[6px] bg-surface lg:h-[360px]">
            <iframe
              src={`https://www.google.com/maps?q=${MAP_QUERY}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Fraternity Engineering office location, G-8/1 Islamabad"
              className="absolute inset-0 h-full w-full border-0"
            />
            <div className="absolute bottom-4 left-4 right-4 theme-paper max-w-[320px] rounded-[6px] bg-white p-5 text-fg sm:bottom-6 sm:left-6 sm:right-auto">
              <p className={`${capsLabel} text-fg-muted`}>Visit us</p>
              <p className="mt-2 text-[16px] font-medium leading-snug">{OFFICE_ADDRESS}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-3 inline-flex min-h-[32px] items-center gap-1.5 rounded-sm text-[15px] font-medium text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              >
                <span className={drawUnderline}>Get directions</span>
                <ArrowRight className="h-4 w-4 text-icon" strokeWidth={1.5} aria-hidden="true" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
});

Contact.displayName = "Contact";
