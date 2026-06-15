# AGENTS.md

## Repo layout

Two independent projects live in one repo (no workspace manager):

- **`islamtayeb/`** -- the main Next.js 14 App Router site (islamtayeb.dev). All dev work happens here.
- **`apmoverflow/`** -- a static HTML blog deployed separately via its own `vercel.json`. Rarely touched.

The repo root only holds `README.md`, `prettier.config.js`, and `.gitignore`. There is no root `package.json`.

## Main site commands

All commands must run from `islamtayeb/`:

```sh
npm run dev          # local dev server
npm run build        # production build (the main correctness check)
npm run lint         # eslint (next/core-web-vitals)
npm run format       # prettier --write .
npm run format:check # prettier --check .
```

There are no tests, no typecheck script, and no CI. `npm run build` is the single gate -- it runs the Next.js compiler which includes type-checking. Always run it before considering work done.

## APM Overflow commands

For `apmoverflow/` post publishing, run `npm run build` from `apmoverflow/`
to regenerate static posts and feeds:

```sh
npm run build         # render Markdown/JSON sources into HTML + feeds
npm run check:content # compare generated readable text against checked-in HTML
npm run watch         # rebuild while editing Markdown/manifests
npm run import:legacy # convert existing slug/index.html pages to Markdown/JSON
```

Use `npm run import:legacy -- --force --slug <slug>` only when intentionally
refreshing one imported source file from its checked-in HTML. Then still run the
main `islamtayeb/` build/lint/format gates before committing.

## Committing

Commit and push when you are confident the project is in good shape for a checkpoint. Before committing:

1. Run `npm run build` from `islamtayeb/` and confirm it succeeds with no errors.
2. Run `npm run lint` and `npm run format:check` to catch style issues.
3. If formatting is off, run `npm run format` first, then re-verify with build.

Only commit when all three pass. Include meaningful commit messages that describe the "why."

## Key conventions

- **Package manager:** npm (lockfile is `package-lock.json`).
- **Path alias:** `@/*` maps to the `islamtayeb/` root (e.g., `@/lib/utils`, `@/components/ui/button`).
- **Styling:** Tailwind CSS 3 with HSL CSS variables. Dark mode is class-based via `next-themes`.
- **Component library:** shadcn/ui (new-york style, slate base, RSC enabled). Config in `components.json`. UI primitives live in `components/ui/`.
- **Fonts:** Geist Sans, Geist Mono, and Anek Telugu (as `--font-caption`). Default body font is `font-mono`.
- **Formatting:** Prettier config is at repo root (`prettier.config.js`): single quotes, semicolons, trailing commas `es5`, 80-char width, 2-space indent, LF endings.
- **`cn()` helper:** `lib/utils.ts` exports `cn()` (clsx + tailwind-merge). Use it for conditional class merging.
- **`apmoverflow` posts:** publish from checked-in Markdown under `apmoverflow/content/posts/` plus a JSON manifest for slug/date/links/media/alt text. Keep authored prose out of frontmatter and preserve it verbatim.
- **`apmoverflow` generated outputs:** slug `index.html` files, `blog/index.html`, and `feed/*.xml` are generated from the modular pipeline. Do not hand-edit generated HTML for source-backed posts; edit Markdown/manifests and rebuild.
- **`apmoverflow` manifests:** use `listed: false` for source-backed pages that should exist at their slug but stay out of `/blog/` and feeds. Use `allowHtml: true` only for legacy posts that need raw HTML blocks such as iframes, hand-built TOCs, tables, or footnote sections. Use `wrapTables: false` when the Markdown already contains preserved table wrappers/raw HTML.

## Architecture notes

- Single-page app: `app/page.tsx` is the only route. All sections (Hero, About, Experience, etc.) are in `app/_components/`.
- Custom SVG icons live in `app/_components/Icons/`.
- `app/api/track/route.ts` is a visitor-tracking API that posts to Discord via webhook. It depends on env vars in `.env.local` (not committed).
- Analytics: Vercel Analytics + Speed Insights are loaded in the root layout.
- No database. No auth. No middleware.
- `apmoverflow` generation now runs through a modular `src/` pipeline for
  content loading, Markdown rendering, page/feed rendering, utilities, and
  content-drift checks. Dates shown on blog surfaces should use three-letter
  month names.
- `apmoverflow/src/import/legacy-html.mjs` uses `turndown` for HTML-to-Markdown
  imports. It is a migration tool, not an authoring path; review imported
  Markdown before treating it as canonical.

## Environment

`.env.local` in `islamtayeb/` is gitignored. It contains secrets for the visitor tracking webhook and geolocation API. The site builds and runs without it (tracking silently fails).

`NEXT_PUBLIC_SITE_URL` controls the `metadataBase` in `layout.tsx`; defaults to `http://localhost:3000`.

## Deployment

Both projects deploy to Vercel. The Next.js app uses zero-config detection. The blog (`apmoverflow/`) has its own `vercel.json`. No Dockerfiles or other deploy config.
