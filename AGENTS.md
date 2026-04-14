# AGENTS.md

## Repo layout

Two independent projects live in one repo (no workspace manager):

- **`my-portfolio/`** -- the main Next.js 14 App Router site (islamtayeb.dev). All dev work happens here.
- **`apm-overflow/`** -- a static HTML blog deployed separately via its own `vercel.json`. Rarely touched.

The repo root only holds `README.md`, `prettier.config.js`, and `.gitignore`. There is no root `package.json`.

## Commands

All commands must run from `my-portfolio/`:

```sh
npm run dev          # local dev server
npm run build        # production build (the main correctness check)
npm run lint         # eslint (next/core-web-vitals)
npm run format       # prettier --write .
npm run format:check # prettier --check .
```

There are no tests, no typecheck script, and no CI. `npm run build` is the single gate -- it runs the Next.js compiler which includes type-checking. Always run it before considering work done.

## Committing

Commit and push when you are confident the project is in good shape for a checkpoint. Before committing:

1. Run `npm run build` from `my-portfolio/` and confirm it succeeds with no errors.
2. Run `npm run lint` and `npm run format:check` to catch style issues.
3. If formatting is off, run `npm run format` first, then re-verify with build.

Only commit when all three pass. Include meaningful commit messages that describe the "why."

## Key conventions

- **Package manager:** npm (lockfile is `package-lock.json`).
- **Path alias:** `@/*` maps to the `my-portfolio/` root (e.g., `@/lib/utils`, `@/components/ui/button`).
- **Styling:** Tailwind CSS 3 with HSL CSS variables. Dark mode is class-based via `next-themes`.
- **Component library:** shadcn/ui (new-york style, slate base, RSC enabled). Config in `components.json`. UI primitives live in `components/ui/`.
- **Fonts:** Geist Sans, Geist Mono, and Anek Telugu (as `--font-caption`). Default body font is `font-mono`.
- **Formatting:** Prettier config is at repo root (`prettier.config.js`): single quotes, semicolons, trailing commas `es5`, 80-char width, 2-space indent, LF endings.
- **`cn()` helper:** `lib/utils.ts` exports `cn()` (clsx + tailwind-merge). Use it for conditional class merging.

## Architecture notes

- Single-page app: `app/page.tsx` is the only route. All sections (Hero, About, Experience, etc.) are in `app/_components/`.
- Custom SVG icons live in `app/_components/Icons/`.
- `app/api/track/route.ts` is a visitor-tracking API that posts to Discord via webhook. It depends on env vars in `.env.local` (not committed).
- Analytics: Vercel Analytics + Speed Insights are loaded in the root layout.
- No database. No auth. No middleware.

## Environment

`.env.local` in `my-portfolio/` is gitignored. It contains secrets for the visitor tracking webhook and geolocation API. The site builds and runs without it (tracking silently fails).

`NEXT_PUBLIC_SITE_URL` controls the `metadataBase` in `layout.tsx`; defaults to `http://localhost:3000`.

## Deployment

Both projects deploy to Vercel. The Next.js app uses zero-config detection. The blog (`apm-overflow/`) has its own `vercel.json`. No Dockerfiles or other deploy config.
