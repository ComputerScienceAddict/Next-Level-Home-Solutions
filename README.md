# Monte Investments

A React/Next.js recreation of the Monte Investments cash home buyer website. Fast, hassle-free home sales across the Central Valley, Las Vegas, and Sonoma County.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React** - UI components

## Pages

- `/` - Home page with hero, benefits, how we work, FAQ, testimonials
- `/how-we-work` - Process and benefits
- `/contact` - Contact form and info
- `/terms-conditions` - Terms (placeholder)
- `/privacy-policy` - Privacy (placeholder)
- `/accessibility` - Accessibility (placeholder)

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
