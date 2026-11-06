import React, { useState, forwardRef, useImperativeHandle } from "react";
import { SITE_CONTENT } from "../content";
import {
  validateContactForm,
  formatWhatsAppMessage,
  ContactFormData,
  ValidationErrors,
  VALID_SERVICES,
} from "../utils/validation";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  ExternalLink,
  MessageCircle,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MagneticButton } from "./MagneticButton";

export interface ContactRef {
  prefillService: (serviceName: string, inquiryContext?: string) => void;
}

export const Contact = forwardRef<ContactRef>((_props, ref) => {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: "",
    companyName: "",
    phone: "",
    email: "",
    service: "Construction",
    message: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState<string>("");

  useImperativeHandle(ref, () => ({
    prefillService: (serviceName: string, inquiryContext?: string) => {
      setFormData((prev) => ({
        ...prev,
        service: VALID_SERVICES.includes(serviceName as any) ? serviceName : "Multiple / Integrated services",
        message: inquiryContext ? `Inquiry regarding: ${inquiryContext}\n` : prev.message,
      }));
      const el = document.getElementById("contact");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    },
  }));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
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
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("https://formsubmit.co/ajax/fraternityengineering@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `New Quote Request - ${formData.service} - ${formData.fullName}`,
          _template: "table",
          name: formData.fullName,
          company: formData.companyName || "Not provided",
          phone: formData.phone,
          email: formData.email,
          service: formData.service,
          message: formData.message,
        }),
      });

      if (!response.ok) throw new Error("Submission failed");
      setIsSubmitted(true);
    } catch {
      setSubmitError(
        "We couldn't send your request automatically. Please try again or reach us directly via phone or WhatsApp."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      companyName: "",
      phone: "",
      email: "",
      service: "Construction",
      message: "",
    });
    setErrors({});
    setIsSubmitted(false);
  };

  return (
    <section
      id="contact"
      className="relative bg-brand-cream text-brand-brown py-20 md:py-28 border-t border-brand-stone/40"
      aria-label="Contact and Quotation Request"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <p className="kicker-label text-brand-navy mb-2">Technical Engagement</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-brand-navy tracking-tight">
            Request an engineering quote or site visit.
          </h2>
          <div className="w-16 h-1 bg-brand-orange mt-4 mb-4" />
          <p className="text-sm sm:text-base text-brand-brown/85">
            Submit your scope specifications below or reach out directly to our Islamabad operations
            office. We review bill of quantities (BOQ) and site requirements with technical precision.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Form with floating labels & animated validation */}
          <div className="lg:col-span-7 bg-white rounded-xl p-6 sm:p-8 md:p-10 border border-brand-stone/70 shadow-xl relative overflow-hidden">
            {isSubmitted ? (
              <div className="py-8 text-center space-y-6" role="status" aria-live="polite">
                {/* Clean Confetti-Free Animated Checkmark Draw */}
                <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-500/30 flex items-center justify-center mx-auto shadow-inner">
                  <svg className="w-10 h-10 stroke-emerald-600" viewBox="0 0 48 48" fill="none">
                    <motion.circle
                      cx="24"
                      cy="24"
                      r="20"
                      strokeWidth="3"
                      strokeDasharray="130"
                      initial={{ strokeDashoffset: 130 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                    <motion.path
                      d="M14 24 L21 31 L34 17"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.45, delay: 0.4, ease: "easeOut" }}
                    />
                  </svg>
                </div>

                <div className="space-y-2">
                  <h3 className="font-heading font-bold text-2xl sm:text-3xl text-brand-navy">
                    Quotation Request Logged
                  </h3>
                  <p className="text-sm text-brand-brown/85 max-w-md mx-auto">
                    Thank you, <span className="font-semibold text-brand-navy">{formData.fullName}</span>.
                    Your request for <span className="font-semibold text-brand-navy">{formData.service}</span> has
                    been recorded. Our engineering department will contact you within one business day.
                  </p>
                </div>

                {/* WhatsApp Quick Forward */}
                <div className="pt-4 max-w-md mx-auto border-t border-brand-stone/40 space-y-3">
                  <p className="text-xs text-brand-steel">Need an immediate technical response?</p>
                  <a
                    href={`https://wa.me/923315095004?text=${formatWhatsAppMessage(formData)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Forward Request via WhatsApp</span>
                  </a>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-brand-steel hover:text-brand-navy py-2 px-4 rounded hover:bg-brand-cream/50 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Submit another inquiry</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* Honeypot field - hidden from real users, catches bots */}
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

                <div className="border-b border-brand-stone/40 pb-4 mb-2 flex items-center justify-between">
                  <span className="font-heading font-bold text-lg text-brand-navy">
                    Scope &amp; Contact Details
                  </span>
                  <span className="text-xs font-mono text-brand-steel">* Required fields</span>
                </div>

                {/* Row 1: Full Name & Company with Floating Labels */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Floating Label: Full Name */}
                  <div className="relative">
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      placeholder=" "
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`peer w-full px-3.5 pt-5 pb-2 text-base sm:text-sm rounded-lg border bg-brand-cream/15 text-brand-brown focus:bg-white focus:outline-none transition-colors ${
                        errors.fullName
                          ? "border-red-500 ring-1 ring-red-500"
                          : "border-brand-stone hover:border-brand-navy focus:border-brand-navy"
                      }`}
                      aria-invalid={!!errors.fullName}
                    />
                    <label
                      htmlFor="fullName"
                      className="absolute left-3.5 top-2 text-[10px] uppercase font-mono font-bold tracking-wider text-brand-steel transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:text-brand-brown/60 peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-brand-orange pointer-events-none"
                    >
                      Full Name *
                    </label>
                    <AnimatePresence>
                      {errors.fullName && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="mt-1 text-xs text-red-600 font-medium"
                        >
                          {errors.fullName}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Floating Label: Company */}
                  <div className="relative">
                    <input
                      id="companyName"
                      name="companyName"
                      type="text"
                      placeholder=" "
                      value={formData.companyName}
                      onChange={handleChange}
                      className="peer w-full px-3.5 pt-5 pb-2 text-base sm:text-sm rounded-lg border border-brand-stone hover:border-brand-navy focus:border-brand-navy bg-brand-cream/15 text-brand-brown focus:bg-white focus:outline-none transition-colors"
                    />
                    <label
                      htmlFor="companyName"
                      className="absolute left-3.5 top-2 text-[10px] uppercase font-mono font-bold tracking-wider text-brand-steel transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:text-brand-brown/60 peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-brand-orange pointer-events-none"
                    >
                      Organization / Company
                    </label>
                  </div>
                </div>

                {/* Row 2: Phone & Email with Floating Labels */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Floating Label: Phone */}
                  <div className="relative">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder=" "
                      value={formData.phone}
                      onChange={handleChange}
                      className={`peer w-full px-3.5 pt-5 pb-2 text-base sm:text-sm rounded-lg border bg-brand-cream/15 text-brand-brown focus:bg-white focus:outline-none transition-colors ${
                        errors.phone
                          ? "border-red-500 ring-1 ring-red-500"
                          : "border-brand-stone hover:border-brand-navy focus:border-brand-navy"
                      }`}
                      aria-invalid={!!errors.phone}
                    />
                    <label
                      htmlFor="phone"
                      className="absolute left-3.5 top-2 text-[10px] uppercase font-mono font-bold tracking-wider text-brand-steel transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:text-brand-brown/60 peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-brand-orange pointer-events-none"
                    >
                      Phone Number *
                    </label>
                    <AnimatePresence>
                      {errors.phone && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="mt-1 text-xs text-red-600 font-medium"
                        >
                          {errors.phone}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Floating Label: Email */}
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder=" "
                      value={formData.email}
                      onChange={handleChange}
                      className={`peer w-full px-3.5 pt-5 pb-2 text-base sm:text-sm rounded-lg border bg-brand-cream/15 text-brand-brown focus:bg-white focus:outline-none transition-colors ${
                        errors.email
                          ? "border-red-500 ring-1 ring-red-500"
                          : "border-brand-stone hover:border-brand-navy focus:border-brand-navy"
                      }`}
                      aria-invalid={!!errors.email}
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-3.5 top-2 text-[10px] uppercase font-mono font-bold tracking-wider text-brand-steel transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:text-brand-brown/60 peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-brand-orange pointer-events-none"
                    >
                      Email Address *
                    </label>
                    <AnimatePresence>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="mt-1 text-xs text-red-600 font-medium"
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Service Selection */}
                <div>
                  <label htmlFor="service" className="block text-xs font-bold text-brand-navy mb-1.5 uppercase tracking-wider">
                    Required Discipline *
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-3.5 py-3 text-base sm:text-sm rounded-lg border border-brand-stone hover:border-brand-navy focus:border-brand-navy bg-white text-brand-brown transition-colors focus:outline-none"
                  >
                    {VALID_SERVICES.map((svc) => (
                      <option key={svc} value={svc}>
                        {svc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Floating Label: Message / Scope */}
                <div className="relative">
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    placeholder=" "
                    value={formData.message}
                    onChange={handleChange}
                    className={`peer w-full px-3.5 pt-6 pb-2 text-base sm:text-sm rounded-lg border bg-brand-cream/15 text-brand-brown focus:bg-white focus:outline-none transition-colors ${
                      errors.message
                        ? "border-red-500 ring-1 ring-red-500"
                        : "border-brand-stone hover:border-brand-navy focus:border-brand-navy"
                    }`}
                    aria-invalid={!!errors.message}
                  />
                  <label
                    htmlFor="message"
                    className="absolute left-3.5 top-2 text-[10px] uppercase font-mono font-bold tracking-wider text-brand-steel transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:text-brand-brown/60 peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-brand-orange pointer-events-none"
                  >
                    Project Scope / Bill of Quantities Summary *
                  </label>
                  <AnimatePresence>
                    {errors.message && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-1 text-xs text-red-600 font-medium"
                      >
                        {errors.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submit error message */}
                <AnimatePresence>
                  {submitError && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700"
                      role="alert"
                    >
                      {submitError}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit CTA with Magnetic wrapper */}
                <div className="pt-2">
                  <MagneticButton
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 bg-brand-orange hover:bg-brand-orange-hover text-brand-charcoal font-bold text-sm uppercase tracking-wider rounded-lg transition-colors shadow-md flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-orange disabled:opacity-75"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? "Sending..." : "Submit Quotation Request"}</span>
                  </MagneticButton>
                  <p className="mt-2.5 text-center text-[11px] text-brand-steel">
                    Direct engineering review with no third-party sales intermediaries.
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Contact Details Card & Map */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-brand-navy text-white rounded-xl p-6 sm:p-8 border border-white/10 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <p className="kicker-label text-brand-orange mb-1">Corporate Office</p>
                  <h3 className="text-xl sm:text-2xl font-heading font-bold text-white">
                    Fraternity Engineering &amp; Co.
                  </h3>
                </div>
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 shrink-0">
                  <img
                    src="/assets/logo.webp"
                    alt="Fraternity Engineering Logo"
                    className="h-10 w-auto object-contain"
                  />
                </div>
              </div>

              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-lg bg-white/10 text-brand-orange shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-brand-stone uppercase tracking-wide">
                      Registered Address
                    </p>
                    <p className="text-white font-medium mt-0.5 leading-snug">
                      Shop # 01, Block # 54, I&amp;T Center, G-8/1, Islamabad
                    </p>
                    <p className="text-xs text-brand-stone mt-1">Federal Capital Area, Pakistan</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-lg bg-white/10 text-brand-orange shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-brand-stone uppercase tracking-wide">
                      Phone &amp; Direct Lines
                    </p>
                    <div className="mt-0.5 space-y-0.5">
                      <a
                        href="tel:03315095004"
                        className="block text-white font-medium hover:text-brand-orange transition-colors"
                      >
                        0331-5095004 (Mobile / WhatsApp)
                      </a>
                      <a
                        href="tel:0512331654"
                        className="block text-white font-medium hover:text-brand-orange transition-colors"
                      >
                        051-2331654 (Landline)
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-lg bg-white/10 text-brand-orange shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-brand-stone uppercase tracking-wide">
                      Direct Email
                    </p>
                    <a
                      href="mailto:fraternityengineering@gmail.com"
                      className="block text-white font-medium hover:text-brand-orange transition-colors mt-0.5"
                    >
                      fraternityengineering@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-lg bg-white/10 text-brand-orange shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-brand-stone uppercase tracking-wide">
                      Office Hours
                    </p>
                    <p className="text-brand-stone text-xs mt-0.5 leading-relaxed">
                      {SITE_CONTENT.contact.workingHours}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Graphic with Islamabad G-8 Grid */}
            <div className="bg-white rounded-xl border border-brand-stone/70 p-5 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-bold text-sm text-brand-navy">
                    Location Matrix // G-8/1 Islamabad
                  </h4>
                  <p className="text-[11px] text-brand-steel font-mono">
                    Sector G-8/1, Industrial &amp; Trade Center
                  </p>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-brand-cream border border-brand-stone text-brand-navy rounded">
                  ISB 44000
                </span>
              </div>

              <div className="relative h-44 rounded-lg bg-brand-navy overflow-hidden border border-brand-stone/40 flex items-center justify-center text-white">
                <div className="absolute inset-0 bg-blueprint-grid opacity-60" />

                <svg
                  viewBox="0 0 300 160"
                  className="absolute inset-0 w-full h-full stroke-white/20 fill-none"
                >
                  <line x1="10" y1="30" x2="290" y2="30" stroke="#8A8F98" strokeWidth="2.5" />
                  <line x1="10" y1="130" x2="290" y2="130" stroke="#8A8F98" strokeWidth="2" />
                  <line x1="70" y1="10" x2="70" y2="150" stroke="#8A8F98" strokeWidth="2" />
                  <line x1="220" y1="10" x2="220" y2="150" stroke="#8A8F98" strokeWidth="2" />

                  <rect x="85" y="45" width="55" height="70" stroke="white" strokeWidth="1" strokeDasharray="3 2" />
                  <rect x="155" y="45" width="50" height="32" stroke="white" strokeWidth="1" strokeDasharray="3 2" />
                  <rect x="155" y="85" width="50" height="32" fill="#FF6B00" fillOpacity="0.25" stroke="#FF6B00" strokeWidth="1.5" />
                </svg>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-brand-orange text-brand-charcoal flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
                    <MapPin className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div className="mt-1 px-2.5 py-1 bg-brand-charcoal/95 rounded text-[10px] font-mono text-white border border-brand-orange/60 shadow">
                    Shop # 01, Block 54
                  </div>
                </div>

                <div className="absolute bottom-1 right-2 text-[9px] font-mono text-brand-stone/60">
                  LAT: 33.6938° N / LON: 73.0378° E
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-brand-brown">Direct Navigation:</span>
                <a
                  href={SITE_CONTENT.contact.googleMapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-navy hover:text-brand-orange transition-colors"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 text-brand-orange" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

Contact.displayName = "Contact";
