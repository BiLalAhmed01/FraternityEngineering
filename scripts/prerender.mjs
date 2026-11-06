/**
 * Post-build prerender: injects server-rendered HTML into dist/*.html
 * so crawlers and no-JS clients receive real content.
 * Run automatically after `vite build` via npm run build.
 */
import { createServer } from "vite";
import { renderToString } from "react-dom/server";
import React from "react";
import { readFileSync, writeFileSync } from "node:fs";

// --- Minimal browser stubs (render phase only; effects never run) ---
const noop = () => {};
const storageStub = {
  getItem: () => null,
  setItem: noop,
  removeItem: noop,
};
const documentStub = {
  getElementById: () => null,
  querySelector: () => null,
  querySelectorAll: () => [],
  body: { style: {} },
  documentElement: { style: {} },
  addEventListener: noop,
  removeEventListener: noop,
  createElement: () => ({ style: {}, setAttribute: noop, getContext: () => null }),
};
globalThis.window = {
  location: { pathname: "/", href: "http://localhost/", search: "" },
  matchMedia: () => ({
    matches: false,
    media: "",
    addEventListener: noop,
    removeEventListener: noop,
    addListener: noop,
    removeListener: noop,
    onchange: null,
    dispatchEvent: () => false,
  }),
  addEventListener: noop,
  removeEventListener: noop,
  scrollTo: noop,
  innerWidth: 1280,
  innerHeight: 800,
  requestAnimationFrame: (cb) => setTimeout(cb, 0),
  cancelAnimationFrame: clearTimeout,
  document: documentStub,
  navigator: { userAgent: "prerender-bot" },
  localStorage: storageStub,
};
globalThis.document = documentStub;
try {
  Object.defineProperty(globalThis, "navigator", {
    value: window.navigator,
    configurable: true,
  });
} catch {
  /* navigator already defined */
}
globalThis.localStorage = storageStub;
globalThis.requestAnimationFrame = window.requestAnimationFrame;
globalThis.cancelAnimationFrame = window.cancelAnimationFrame;

const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
});

const BASE = "https://fraternity-engineering.vercel.app";

try {
  const { default: App } = await server.ssrLoadModule("/src/App.tsx");
  const { PrivacyPage } = await server.ssrLoadModule("/src/pages/PrivacyPage.tsx");
  const { TermsPage } = await server.ssrLoadModule("/src/pages/TermsPage.tsx");

  const render = (el) => renderToString(React.createElement(el));

  // 1) Homepage -> dist/index.html (inject into #root)
  const indexPath = "dist/index.html";
  let indexHtml = readFileSync(indexPath, "utf8");
  const homeHtml = render(App);
  indexHtml = indexHtml.replace('<div id="root"></div>', `<div id="root">${homeHtml}</div>`);
  writeFileSync(indexPath, indexHtml);
  console.log("[prerender] index.html injected,", homeHtml.length, "bytes");

  // 2) Legal pages -> standalone static HTML documents (fully static, no JS needed)
  const cssHref = indexHtml.match(/href="(\/assets\/index-[^"]+\.css)"/)?.[1];

  const shell = ({ title, desc, canonical, bodyHtml }) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="${desc}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonical}" />
    <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png" />
    <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@500;600;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
    ${cssHref ? `<link rel="stylesheet" href="${cssHref}" />` : ""}
  </head>
  <body>
    ${bodyHtml}
  </body>
</html>`;

  const pages = [
    {
      file: "dist/privacy.html",
      title: "Privacy Policy | Fraternity Engineering & Co.",
      desc: "Privacy Policy for Fraternity Engineering & Co. (SMC-Pvt) Ltd.",
      canonical: `${BASE}/privacy`,
      el: PrivacyPage,
    },
    {
      file: "dist/terms.html",
      title: "Terms & Conditions | Fraternity Engineering & Co.",
      desc: "Terms & Conditions for Fraternity Engineering & Co. (SMC-Pvt) Ltd.",
      canonical: `${BASE}/terms`,
      el: TermsPage,
    },
  ];

  for (const p of pages) {
    const body = render(p.el);
    writeFileSync(p.file, shell({ ...p, bodyHtml: body }));
    console.log(`[prerender] ${p.file} written,`, body.length, "bytes");
  }
} finally {
  await server.close();
}
