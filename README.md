# Fraternity Engineering & Co.

Marketing site for Fraternity Engineering & Co. (SMC-Pvt) Ltd. React 19, Vite and Tailwind, prerendered to static HTML and deployed on Vercel. The quote form posts to `api/contact.ts`.

## Scripts

- `npm run dev` runs the dev server on port 3000.
- `npm run build` builds and prerenders into `dist/`.
- `npm run lint` type-checks.
- `npx tsx --test src/utils/*.test.ts` runs the unit tests.
- `node scripts/build-images.mjs` regenerates the responsive images from `FTE-Branding Assets/`.
- `node scripts/optimize-images.mjs` re-encodes them at the tuned quality settings.

Copy `.env.example` to `.env.local` to set the contact form relay.
