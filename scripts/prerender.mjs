/**
 * Post-build prerender: injects server-rendered HTML into dist/*.html
 * so crawlers and no-JS clients receive real content.
 * Run automatically after `vite build` via npm run build.
 */
import { createServer } from "vite";
import { renderToString } from "react-dom/server";
import { prerenderToNodeStream } from "react-dom/static";
import React from "react";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

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

const BASE = "https://fraternity-engineering-co.vercel.app";

try {
  const { default: App } = await server.ssrLoadModule("/src/App.tsx");
  const { PrivacyPage } = await server.ssrLoadModule("/src/pages/PrivacyPage.tsx");
  const { TermsPage } = await server.ssrLoadModule("/src/pages/TermsPage.tsx");
  const { SERVICE_PAGES } = await server.ssrLoadModule("/src/servicesData.ts");

  const render = (el) => renderToString(React.createElement(el));

  /** Full App for a path, waiting for lazy sections so all content is in the HTML (and matches hydration). */
  const renderApp = async (pathname) => {
    window.location.pathname = pathname;
    const once = async () => {
      const { prelude } = await prerenderToNodeStream(React.createElement(App), { progressiveChunkSize: Number.MAX_SAFE_INTEGER });
      let html = "";
      for await (const chunk of prelude) html += chunk;
      return html;
    };
    // First pass resolves the lazy imports; the second renders with nothing pending, so the output has
    // no inline Suspense completion scripts (which the Content-Security-Policy would block).
    await once();
    const html = await once();
    if (/<script>/.test(html)) throw new Error(`Prerender of ${pathname} still contains inline scripts`);
    return html;
  };

  // 1) Homepage -> dist/index.html (inject into #root)
  const indexPath = "dist/index.html";
  let indexHtml = readFileSync(indexPath, "utf8");
  const appShell = indexHtml; // untouched shell, reused for service pages
  const homeHtml = await renderApp("/");
  // Hydration waits for the first paint, so the scripts can download behind the hero image, CSS and fonts.
  const lowPriorityScripts = (html) =>
    html
      .replace(/<script type="module" crossorigin src=/g, '<script type="module" fetchpriority="low" crossorigin src=')
      .replace(/<link rel="modulepreload" crossorigin href=/g, '<link rel="modulepreload" fetchpriority="low" crossorigin href=');
  indexHtml = indexHtml.replace('<div id="root"></div>', `<div id="root">${homeHtml}</div>`);
  indexHtml = lowPriorityScripts(indexHtml);
  writeFileSync(indexPath, indexHtml);
  console.log("[prerender] index.html injected,", homeHtml.length, "bytes");

  // 2) Legal pages -> standalone static HTML documents (fully static, no JS needed)
  const cssHref = indexHtml.match(/href="(\/assets\/index-[^"]+\.css)"/)?.[1];

  const shell = ({ title, desc, canonical, bodyHtml }) => `<!doctype html>
<html lang="en-PK" dir="ltr" data-theme="daylight">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>${title}</title>
    <meta name="description" content="${desc}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonical}" />
    <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png" />
    <link rel="preload" href="/assets/fonts/barlow-400-latin.woff2" as="font" type="font/woff2" crossorigin />
    <meta name="theme-color" content="#091324" />
    <script>(function(){var r=document.documentElement;r.setAttribute("data-theme","daylight");try{if(localStorage.getItem("fte_theme")==="dark")r.removeAttribute("data-theme")}catch(e){}})()</script>
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="${BASE}/assets/og-image.png" />
    <meta name="twitter:card" content="summary_large_image" />
    ${cssHref ? `<link rel="stylesheet" href="${cssHref}" />` : ""}
  </head>
  <body>
    ${bodyHtml}
  </body>
</html>`;

  const pages = [
    {
      file: "dist/privacy.html",
      title: "Privacy Policy | Fraternity Engineering",
      desc: "Privacy Policy for Fraternity Engineering & Co. (SMC-Pvt) Ltd.",
      canonical: `${BASE}/privacy`,
      el: PrivacyPage,
    },
    {
      file: "dist/terms.html",
      title: "Terms & Conditions | Fraternity Engineering",
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

  // 3) Service pages -> dist/services/<slug>.html (app shell + server-rendered content)
  mkdirSync("dist/services", { recursive: true });
  const attr = (v) => String(v).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  const json = (v) => JSON.stringify(v).replace(/</g, "\\u003c");
  for (const svc of SERVICE_PAGES) {
    // Render with the page's own path so path-aware links (e.g. nav anchors) come out right.
    const body = await renderApp(`/services/${svc.slug}`);
    const title = `${svc.seoTitle} | Fraternity Engineering`;
    const canonical = `${BASE}/services/${svc.slug}`;
    const desc = svc.overview;
    const img = svc.image;
    const ld = [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: svc.name,
        serviceType: svc.name,
        description: desc,
        url: canonical,
        image: `${BASE}${img}`,
        areaServed: ["Islamabad", "Rawalpindi", "Pakistan"],
        provider: { "@type": "GeneralContractor", name: "Fraternity Engineering & Co. (SMC-Pvt) Ltd.", url: `${BASE}/` },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
          { "@type": "ListItem", position: 2, name: "Services", item: `${BASE}/#services` },
          { "@type": "ListItem", position: 3, name: svc.name, item: canonical },
        ],
      },
    ];
    const ldTags = ld.map((d) => `<script type="application/ld+json">${json(d)}</script>`).join("\n    ");
    const srcset = `${img.replace(".webp", "-480.webp")} 480w, ${img.replace(".webp", "-768.webp")} 768w, ${img} 1024w`;
    let html = appShell
      .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
      .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
      .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${canonical}" />`)
      .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${attr(desc)}" />`)
      .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${attr(title)}" />`)
      .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${attr(desc)}" />`)
      .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${canonical}" />`)
      .replace(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${attr(title)}" />`)
      .replace(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${attr(desc)}" />`)
      // The homepage's hero preload does not apply here; preload this page's photo instead.
      .replace(/<link rel="preload" as="image"[\s\S]*?\/>/, `<link rel="preload" as="image" type="image/webp" fetchpriority="high" href="${img}" imagesrcset="${srcset}" imagesizes="(min-width: 1024px) 50vw, 100vw" />`)
      // Organisation and WebSite data belong to the homepage; service pages carry Service + BreadcrumbList.
      .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, "")
      .replace("</head>", `    ${ldTags}\n  </head>`);
    writeFileSync(`dist/services/${svc.slug}.html`, lowPriorityScripts(html));
    console.log(`[prerender] dist/services/${svc.slug}.html written,`, body.length, "bytes");
  }
} finally {
  await server.close();
}
