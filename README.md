# Next Level Home Solutions

A Next.js website for Next Level Home Solutions — cash home buyers serving Central California. Fast, hassle-free home sales with same-day offers.

## Getting Started

1. Copy `.env.example` to `.env.local` and fill in your keys:

```bash
cp .env.example .env.local
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Supabase** - Database (leads, notices)
- **Nodemailer** - Lead email notifications

## Pages

- `/` - Home page with hero, foreclosure help, how it works, testimonials, FAQ
- `/get-offer` - Cash offer request form
- `/foreclosure-options` - All foreclosure options explained with per-option help
- `/areas` - Pick your situation and city to view a tailored page
- `/sell/[situation]/[city]` - SEO landing pages (e.g. `/sell/foreclosure/fresno-ca`)
- `/probate-help` - Probate and inherited property help
- `/terms-conditions` - Terms and conditions
- `/privacy-policy` - Privacy policy
- `/accessibility` - Accessibility statement
- `/admin` - Leads dashboard (password-protected)
- `/admin/seo` - AI-powered SEO content manager

## Environment Variables

See `.env.example` for all available variables. Key ones:

- `NEXT_PUBLIC_SITE_URL` - Canonical domain for SEO (sitemap, robots, meta tags)
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase connection
- `GMAIL_ADDRESS` / `GMAIL_APP_PASSWORD` - Lead notification emails

## Build

```bash
npm run build
npm start
```

## Dev: `/_next/static/chunks/...` 404

If the browser logs 404s for `main-app.js`, `app-pages-internals.js`, etc.:

1. Stop the dev server (**only one** `next dev` on the port).
2. Run `npm run clean` (deletes `.next`), then `npm run dev`.
3. Hard refresh the tab (Ctrl+Shift+R) or open in an incognito window.

On Windows, if you instead get **webpack vendor-chunk ENOENT** errors, run dev with webpack cache disabled:

`set NEXT_DISABLE_WEBPACK_CACHE=1&& npm run dev` (PowerShell: `$env:NEXT_DISABLE_WEBPACK_CACHE=1; npm run dev`)
