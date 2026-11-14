# toddbennison.com

Personal site for Todd Bennison. Founder and collector, Sydney.

Plain HTML, CSS and JavaScript. No framework and no build step. Hosted on Cloudflare Workers static assets. Layout and type follow geoffreywoo.com: Inter, a 720px column, a quiet top bar and a hairline footer.

## What's in it

- `public/index.html` – the homepage
- `public/essays/` – essays index and one folder per essay
- `public/collection/index.html` – the collection
- `public/404.html` – not found page
- `public/styles.css` – all styles, full white
- `public/fonts/` – Inter 3 (v12), self-hosted, with its licence
- `public/js/main.js` – entry point
- `public/js/clock.js` – live Sydney time in the footer
- `public/_headers` – security and cache headers
- `wrangler.jsonc` – Cloudflare Workers config

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. This runs the site through Cloudflare's local runtime, so the security headers apply the same as in production.

## Checks

```bash
npm run lint        # ESLint and Prettier
npm run lighthouse  # Performance, accessibility, best practices and SEO
```

Both run on every push through GitHub Actions. Lighthouse fails the build if any score drops below 95.

## Security

Strict Content Security Policy with no inline scripts or styles and Trusted Types enforced, plus HSTS, frame protection, and a locked-down permissions policy.

## Deploy

Push to `main` and Cloudflare Workers Builds deploys it. To deploy straight from this machine instead, run `npx wrangler deploy`.
