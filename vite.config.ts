import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'fs';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';

/** The site-wide security headers from vercel.json, so `vite preview` behaves like production (CSP included). */
const vercelHeaders = (): Record<string, string> => {
  const config = JSON.parse(readFileSync(path.resolve(import.meta.dirname, 'vercel.json'), 'utf8'));
  const global = config.headers?.find((h: { source: string }) => h.source === '/(.*)');
  const headers = Object.fromEntries((global?.headers ?? []).map((h: { key: string; value: string }) => [h.key, h.value]));
  // The local preview is plain http: don't let browsers upgrade its own requests to https.
  const csp = headers['Content-Security-Policy'];
  if (csp) headers['Content-Security-Policy'] = csp.replace(/;\s*upgrade-insecure-requests/, '');
  return headers;
};

/** Inlines the (small) built stylesheet into the HTML so it no longer blocks first render. style-src allows inline styles. */
const inlineCss = (): Plugin => ({
  name: 'fte-inline-css',
  apply: 'build',
  enforce: 'post',
  transformIndexHtml: {
    order: 'post',
    handler(html, ctx) {
      const bundle = ctx.bundle ?? {};
      return html.replace(/<link rel="stylesheet"[^>]*href="\/([^"]+\.css)"[^>]*>/g, (tag, file: string) => {
        const asset = bundle[file];
        return asset && asset.type === 'asset' ? `<style>${String(asset.source)}</style>` : tag;
      });
    },
  },
});

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), inlineCss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    preview: {
      headers: vercelHeaders(),
    },
    build: {
      // Last 2 versions of evergreen browsers plus iOS Safari 15 (see "browserslist" in package.json).
      target: ['es2020', 'chrome109', 'edge109', 'firefox115', 'safari15', 'ios15'],
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          // React in its own long-lived chunk; everything else is split by route and section (lazy imports).
          manualChunks: (id) => {
            if (id.includes('node_modules') && /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) {
              return 'react-vendor';
            }
          },
        },
      },
      minify: 'esbuild',
      sourcemap: false,
    },
  };
});
