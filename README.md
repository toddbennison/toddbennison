# toddbennison.com

Personal site for Todd Bennison, web designer for builders and trades in Sydney.

Plain HTML, CSS and JavaScript. No framework and no build step. Hosted on Cloudflare Workers static assets.

## What's in it

- `public/index.html` – the page
- `public/404.html` – not found page
- `public/styles.css` – all styles, light and dark
- `public/js/theme-init.js` – applies a saved theme before the page paints
- `public/js/main.js` – entry point
- `public/js/theme.js` – light and dark switch, defaults to the device setting
- `public/js/clock.js` – live Sydney time in the footer
- `public/js/nudge.js` – one-off bounce on the ball icon
- `public/js/keepy/` – keepy-uppy game, loaded only when someone clicks the ball
  - `physics.js` – movement, kicks and difficulty
  - `render.js` – drawing the ball and pitch
  - `index.js` – game loop, input and dialog
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

Both run on every pull request through GitHub Actions. Lighthouse fails the build if any score drops below 95.

## Security

Strict Content Security Policy with no inline scripts or styles and Trusted Types enforced, plus HSTS, frame protection, and a locked-down permissions policy.

## Deploy

Connected to Cloudflare Workers Builds. Every push to `main` deploys, and other branches get preview URLs.
