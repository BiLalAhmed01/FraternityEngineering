/**
 * Generates the responsive WebP images used by the site from the source artwork.
 * Run with: node scripts/build-images.mjs
 *
 * Output files carry their width in the name (e.g. planning-768.webp). Assets under /assets are
 * served with a one-year immutable cache, so a changed image must get a new file name.
 */
import sharp from "sharp";
import { mkdirSync, statSync } from "node:fs";

const OUT = "public/assets";
// Originals that are not deployed (kept so the variants can be regenerated).
const SRC = "FTE-Branding Assets/web-sources";
const kb = (f) => Math.round(statSync(f).size / 1024);

/** Encode at the highest quality (from `start` down to `min`) that stays under `maxKB`. */
async function encode(input, out, { width, height, fit = "cover", maxKB, start = 80, min = 55, alpha = false }) {
  for (let q = start; q >= min; q -= 4) {
    await sharp(input)
      .resize({ width, height, fit, withoutEnlargement: true })
      .webp({ quality: q, effort: 6, alphaQuality: alpha ? 90 : 100 })
      .toFile(out);
    if (!maxKB || kb(out) <= maxKB) return { out, q, size: kb(out) };
  }
  return { out, q: min, size: kb(out), overBudget: true };
}

const report = [];
const log = (r) => report.push(`${String(r.size).padStart(4)} KB  q${r.q}  ${r.out.replace(OUT + "/", "")}${r.overBudget ? "  (over budget)" : ""}`);

// Hero slides: square sources, shown at up to ~710 CSS px tall on desktop and ~360px wide on phones.
const HERO_SRC = "FTE-Branding Assets/Hero-Section";
const HERO = {
  planning: "Planning.png",
  construction: "Construction.png",
  civil: "Civil Works.png",
  electrical: "Electrical.png",
  "fire-safety": "Fire Safety.png",
  "general-supply": "General Supply.png",
  chemicals: "Chemicals.png",
};
mkdirSync(`${OUT}/hero`, { recursive: true });
for (const [name, file] of Object.entries(HERO)) {
  for (const w of [480, 768, 1200]) {
    log(await encode(`${HERO_SRC}/${file}`, `${OUT}/hero/${name}-${w}.webp`, { width: w, height: w, maxKB: w === 1200 ? 155 : undefined, start: 78 }));
  }
}
// HSE inset is 180px wide; 360 covers 2x screens (see optimize-images.mjs for the tuned quality settings).
log(await encode(`${HERO_SRC}/HSE.png`, `${OUT}/hero/hse-360.webp`, { width: 360, height: 360, start: 66 }));

// Project posters: 16:9, tiles up to ~400px wide, modal up to 1100px wide.
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
  for (const w of [480, 768, 1200, 1600]) {
    log(await encode(`${PROJ_SRC}/${file}`, `${OUT}/projects/${slug}-${w}.webp`, { width: w, height: Math.round((w * 941) / 1672), maxKB: 175, start: 80 }));
  }
}

// Service cards (4:5, shown up to ~390px wide): add a 480 variant beside the existing ~640px file.
for (const name of ["construction", "civil", "electrical", "fire", "supply"]) {
  log(await encode(`${OUT}/service-card-${name}.webp`, `${OUT}/service-card-${name}-480.webp`, { width: 480, start: 80 }));
}
// Service page photos (2:3, 1024px originals): add 480 and 768 variants.
for (const name of ["construction", "civil", "electrical", "fire", "supply"]) {
  for (const w of [480, 768]) log(await encode(`${OUT}/service-${name}.webp`, `${OUT}/service-${name}-${w}.webp`, { width: w, start: 80 }));
}
// About fallback photo (5:4 source, shown 4:5 up to ~450px wide).
for (const w of [480, 768, 1200]) log(await encode(`${SRC}/about-fallback.webp`, `${OUT}/about-fallback-${w}.webp`, { width: w, start: 80 }));

// Client logos: trim empty margins, fit a 280x112 box (2x the 140x56 display box).
mkdirSync(`${OUT}/clients`, { recursive: true });
for (const name of ["nescom", "ndc", "mtc", "awc", "cda", "nayatel", "ptcl"]) {
  const trimmed = await sharp(`${SRC}/client-${name}.webp`).trim({ threshold: 10 }).toBuffer();
  log(await encode(trimmed, `${OUT}/clients/${name}.webp`, { width: 280, height: 112, fit: "inside", maxKB: 14, start: 90, alpha: true }));
}

// Logo mark: shown at 40-64px tall; 160px wide covers 2x.
log(await encode(`${SRC}/logo-mark.webp`, `${OUT}/logo-mark-160.webp`, { width: 160, start: 90, alpha: true }));

// App icons from the high-resolution logo mark, centred on brand navy.
const ICON_SRC = `${SRC}/logo-mark-dark-hires.png`;
for (const size of [192, 512]) {
  const inner = Math.round(size * 0.72);
  const mark = await sharp(ICON_SRC).trim().resize(inner, inner, { fit: "inside" }).toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: "#0B1F3A" } })
    .composite([{ input: mark, gravity: "centre" }])
    .png({ compressionLevel: 9 })
    .toFile(`${OUT}/icon-${size}.png`);
  report.push(`${String(kb(`${OUT}/icon-${size}.png`)).padStart(4)} KB        icon-${size}.png`);
}

// Open Graph image: keep 1200x630 PNG, quantise to cut its weight.
await sharp(`${SRC}/og-image-original.png`).png({ palette: true, quality: 90, effort: 10, compressionLevel: 9 }).toFile(`${OUT}/og-image.png`);
report.push(`${String(kb(`${OUT}/og-image.png`)).padStart(4)} KB        og-image.png`);

console.log(report.join("\n"));
