import test from "node:test";
import assert from "node:assert/strict";
import { validateContactForm, formatWhatsAppMessage } from "./validation";

test("validateContactForm accepts valid form submission", () => {
  const result = validateContactForm({
    fullName: "Engr. Tariq Mehmood",
    companyName: "Federal Project Unit",
    phone: "0331-5095004",
    email: "tariq@example.com",
    service: "Construction",
    message: "We need structural evaluation and renovation for a commercial office block in G-8 Islamabad.",
  });

  assert.equal(result.isValid, true);
  assert.equal(Object.keys(result.errors).length, 0);
});

test("validateContactForm catches missing and invalid fields", () => {
  const result = validateContactForm({
    fullName: "",
    companyName: "",
    phone: "abc",
    email: "invalid-email",
    service: "",
    message: "Hi",
  });

  assert.equal(result.isValid, false);
  assert.ok(result.errors.fullName);
  assert.ok(result.errors.email);
  assert.ok(result.errors.phone);
  assert.ok(result.errors.service);
  assert.ok(result.errors.message);
});

test("formatWhatsAppMessage encodes fields properly", () => {
  const encoded = formatWhatsAppMessage({
    fullName: "Ahmed Khan",
    companyName: "Nayatel Contractor",
    phone: "03001234567",
    email: "ahmed@example.com",
    service: "Electrical works",
    message: "Inquiry regarding cabling conduits.",
  });

  assert.ok(encoded.includes("Ahmed%20Khan"));
  assert.ok(encoded.includes("Electrical%20works"));
});
