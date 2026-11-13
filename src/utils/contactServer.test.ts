import { test } from "node:test";
import assert from "node:assert/strict";
import { checkSubmission, clean, rateLimited } from "./contactServer";

const NOW = 1_800_000_000_000;

const form = (fields: Record<string, string | File>) => {
  const f = new FormData();
  const base: Record<string, string | File> = {
    name: "Test Person",
    phone: "0331 5095004",
    service: "Construction",
    message: "Repair works for a two-storey building.",
    website: "",
    startedAt: String(NOW - 10_000),
  };
  for (const [k, v] of Object.entries({ ...base, ...fields })) f.append(k, v);
  return f;
};

test("accepts a valid request and strips markup", async () => {
  const r = await checkSubmission(form({ name: "<b>Test</b> Person", message: "Scope <script>x</script>details here" }), NOW);
  assert.equal(r.ok, true);
  if (r.ok && !r.spam) {
    assert.equal(r.data.fullName, "Test Person");
    assert.equal(r.data.message, "Scope xdetails here");
  }
});

test("rejects unknown fields", async () => {
  const r = await checkSubmission(form({ admin: "1" }), NOW);
  assert.equal(r.ok, false);
});

test("treats a filled honeypot or a sub-3-second submission as spam", async () => {
  const honey = await checkSubmission(form({ website: "http://spam" }), NOW);
  assert.deepEqual(honey, { ok: true, spam: true });
  const fast = await checkSubmission(form({ startedAt: String(NOW - 1000) }), NOW);
  assert.deepEqual(fast, { ok: true, spam: true });
});

test("rejects values outside the allowed lists", async () => {
  const r = await checkSubmission(form({ service: "Anything" }), NOW);
  assert.equal(r.ok, false);
});

test("checks the file signature, not just the extension", async () => {
  const fake = new File(["not really a pdf"], "drawings.pdf", { type: "application/pdf" });
  const bad = await checkSubmission(form({ attachment: fake }), NOW);
  assert.equal(bad.ok, false);
  const real = new File(["%PDF-1.7 minimal"], "drawings.pdf", { type: "application/pdf" });
  const good = await checkSubmission(form({ attachment: real }), NOW);
  assert.equal(good.ok, true);
});

test("enforces length limits", () => {
  assert.equal(clean("x".repeat(500), 100).length, 100);
});

test("rate limits after 5 requests in 10 minutes", () => {
  for (let i = 0; i < 5; i++) assert.equal(rateLimited("203.0.113.9", NOW + i), false);
  assert.equal(rateLimited("203.0.113.9", NOW + 10), true);
  assert.equal(rateLimited("203.0.113.9", NOW + 11 * 60 * 1000), false);
});
