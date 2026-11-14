/**
 * Second-pass image optimisation driven by PageSpeed Insights ("Improve image delivery").
 * Re-encodes the deployed WebP variants at a lower quality, adds a 360px HSE inset, and shrinks the two logos to
 * roughly 1.5x their largest display size. Run with: node scripts/optimize-images.mjs
 * Uses the same source artwork as build-images.mjs where it is checked in, otherwise re-encodes the deployed file.
 */
import sharp from "sharp";
import { statSync, copyFileSync, rmSync } from "node:fs";

sharp.cache(false); // Windows: otherwise sharp keeps input files open and they cannot be replaced
const OUT = "public/assets";
const kb = (f) => Math.round(statSync(f).size / 1024);
const report = [];

async function write(input, out, { width, height, fit = "cover", quality, alpha = false }) {
  const tmp = `${out}.tmp`;
  const before = (() => { try { return kb(out); } catch { return 0; } })();
  await sharp(input)
    .resize({ width, height, fit, withoutEnlargement: true })
    .webp({ quality, effort: 6, alphaQuality: alpha ? 85 : 100, smartSubsample: true })
    .toFile(tmp);
  rmSync(out, { force: true });
  copyFileSync(tmp, out);
  rmSync(tmp);
  report.push(`${String(before).padStart(4)} -> ${String(kb(out)).padStart(4)} KB  ${out.replace(OUT + "/", "")}`);
}

// Hero slides (square sources). 1200 is left as is: it only serves wide desktop screens.
const HERO_SRC = "FTE-Branding Assets/Hero-Section";
const HERO = { planning: "Planning.png", construction: "Construction.png", civil: "Civil Works.png", electrical: "Electrical.png", "fire-safety": "Fire Safety.png", "general-supply": "General Supply.png", chemicals: "Chemicals.png" };
for (const [name, file] of Object.entries(HERO)) {
  await write(`${HERO_SRC}/${file}`, `${OUT}/hero/${name}-480.webp`, { width: 480, height: 480, quality: 66 });
  await write(`${HERO_SRC}/${file}`, `${OUT}/hero/${name}-768.webp`, { width: 768, height: 768, quality: 62 });
}
// HSE inset is shown at 180px wide: 360 covers 2x screens.
await write(`${HERO_SRC}/HSE.png`, `${OUT}/hero/hse-360.webp`, { width: 360, height: 360, quality: 66 });
rmSync(`${OUT}/hero/hse-480.webp`, { force: true });

// Project posters (16:9): tiles are up to ~400px wide.
const PROJ_SRC = "FTE-Branding Assets/Projects";
const PROJECTS = {
  "imc-hospital-fire-alarm": "Installation of Fire Alarm System at IMC Hospital.png",
  "f6-park-flood-lights": "Installation of Flood Lights along with poles at F-6 Park.png",
  "i-guard-pre-engineered-structures": "Installation of I-Guard Pre-Engineered Structures.png",
  "pre-fab-structures": "Installation of Pre-FAB Structures.png",
  "street-light-poles-7th-avenue": "Installation of street light poles at 7th avenue Islamabad, Pakistan.png",
  "old-naval-headquarters-repair": "Repair & Maintenance of Old Naval Headquarters.png",
};
for (const [slug, file] of Object.entries(PROJECTS)) {
  await write(`${PROJ_SRC}/${file}`, `${OUT}/projects/${slug}-480.webp`, { width: 480, height: 270, quality: 62 });
  await write(`${PROJ_SRC}/${file}`, `${OUT}/projects/${slug}-768.webp`, { width: 768, height: 432, quality: 62 });
}

// Service cards (4:5): re-encode the deployed files (no separate source is checked in).
for (const name of ["construction", "civil", "electrical", "fire", "supply"]) {
  for (const suffix of ["", "-480"]) {
    const f = `${OUT}/service-card-${name}${suffix}.webp`;
    await write(await sharp(f).toBuffer(), f, { width: suffix ? 480 : undefined, quality: 62 });
  }
}

// Logos: the splash shows the logo at <=200px and the header mark at <=77px wide.
const logo = await sharp(`${OUT}/logo.webp`).toBuffer();
await write(logo, `${OUT}/logo.webp`, { width: 300, quality: 80, alpha: true });
const mark = await sharp(`${OUT}/logo-mark-160.webp`).toBuffer();
await write(mark, `${OUT}/logo-mark-160.webp`, { width: 120, quality: 80, alpha: true });

console.log(report.join("\n"));
