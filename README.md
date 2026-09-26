# Daniele Buatti - Personal IT Support

Professional IT support and security services based in Melbourne, Australia.

This repo contains the public marketing site plus a private support portal
(tickets, clients and their assets, invoices, settings) backed by Supabase.

## Features
- Apple Ecosystem Specialist
- Security & Privacy Audits
- Workflow Optimization
- Hardware Support

## Tech stack
- React 18 + TypeScript, built with Vite
- Tailwind CSS and shadcn/ui components
- React Router (routes live in `src/App.tsx`)
- Supabase for auth, database and edge functions (`supabase/functions`)
- Deployed on Vercel (SPA rewrites in `vercel.json`)

## Getting started

```sh
pnpm install
pnpm dev        # http://localhost:8080
```

## Scripts

| Command          | Description                          |
| ---------------- | ------------------------------------ |
| `pnpm dev`       | Start the dev server                 |
| `pnpm build`     | Production build to `dist/`          |
| `pnpm preview`   | Serve the production build locally   |
| `pnpm lint`      | Run ESLint                           |
| `pnpm typecheck` | Type-check the app with `tsc`        |

## Project layout

```
src/
  pages/          Route-level pages (public site, login, portal)
  components/     Feature components; ui/ holds shadcn/ui primitives
  integrations/   Supabase client and SQL migrations
supabase/
  functions/      Deno edge functions (tickets, invoices, enquiries, AI)
```

Portal routes are lazy-loaded so visitors to the public site don't download
the admin bundle.

## SEO and the build

`pnpm build` also renders the home page to static HTML (`src/entry-server.tsx`
and `scripts/prerender.mjs`), so search engines and link previews see real
content. It writes:

- `dist/index.html`: prerendered home page with canonical URL, Open Graph tags
  and JSON-LD structured data (business details, prices, FAQ)
- `dist/app.html`: empty `noindex` shell that `vercel.json` serves for every
  other route (portal, login, public invoices, 404s)
- `dist/sitemap.xml` and `dist/robots.txt`

Business details (site URL, email, phone, area) live in `src/content/site.ts`;
prices and FAQs in `src/content/services.ts`. Change the URL there when moving
to a custom domain.
