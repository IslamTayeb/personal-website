# AGENTS.md

## Repo layout

Two production projects, one experimental sandbox, and one unified prototype
live in this repo (no workspace manager):

- **`islamtayeb/`** -- the main Next.js 14 App Router site (islamtayeb.dev). All dev work happens here.
- **`apmoverflow/`** -- a static HTML blog deployed separately via its own `vercel.json`. Rarely touched.
- **`component-lab/`** -- an experimental Next.js component lab for v0 imports,
  visual direction, and APM Overflow/site vibe exploration. It is not production
  code and should stay isolated until a specific design is intentionally ported.
- **`unified-site/`** -- a new isolated Next.js prototype that combines the
  personal site and APM Overflow under one islamtayeb.dev-style surface. It reads
  APM Overflow post sources from `apmoverflow/content/posts/` but must not modify
  `component-lab/`, `islamtayeb/`, or `apmoverflow/` unless explicitly asked.

The repo root holds shared repo metadata plus project directories. There is no
root `package.json`.

## Rehaul intent

This worktree is for an experimental rehaul, not direct production migration.
The north star is for **`islamtayeb.dev`** and **`apmoverflow.xyz`** to converge
toward one shared visual and interaction language while preserving their
different jobs: the main site as the personal/work portfolio surface, and APM
Overflow as the writing/publishing surface.

Treat `component-lab/` as the place to draft that shared style before porting
anything back into `islamtayeb/` or `apmoverflow/`. Explore typography,
navigation, project cards, writing layouts, and article/blog primitives there
first. Do not convert APM Overflow to Next.js or merge lab code into production
unless there is an explicit implementation decision.

`unified-site/` is that implementation decision in prototype form only: use it
to combine the current personal site content and APM Overflow writing into one
Next.js app without deployment wiring. Preserve the component-lab visual
language: Sora + DM Mono, narrow document width, sharp borders, paper/ink base,
the `islam / blog` selector, the top ROYB bar, and strong ROYB accents. Use
borders as structural rules, not default boxes around every section. Keep it
motionless: no animations, transitions, render-time measurements, resize
observers, canvas/dither experiments, autoplay media, or animation libraries.
The desired feel is elevated minimalism with real density: whitespace should
separate ideas, not inflate the page. Prefer compact rows, concise copy, and only
information that earns its place.

For `unified-site/`, any description/summary/excerpt shown in a compact list,
rail, course detail, or preview must render as a single line at the current
desktop document width. Use concise source copy plus explicit one-line CSS
(`truncate`/nowrap/hidden overflow) and visual tests; do not rely on luck or
copy length alone.

Avoid hydration flicker and load-time state swaps. Do not render a visible
default state and then correct it in `useEffect` after reading local storage,
media queries, viewport dimensions, or user environment. If a preference such as
theme must affect first paint, set it before visible content renders or keep the
control visually neutral and size-stable until user interaction. Deterministic
validators should cover these cases where possible.

When the user asks for a component-lab exploration of something that also exists
in `unified-site/`, mark the current unified implementation with a small
standalone `prototyping` card immediately above that primitive, not an inline tag
inside the prose/control itself. The card means "there are active lab variants
to choose from," not "this is final." Remove or retire the card once the chosen
lab direction is ported back into the unified page.

Scrollbars in `unified-site/` should be square, never rounded. Prefer
`overflow: auto` so they disappear when not needed; use thin, CSS-only,
background-matched tracks and no inset thumb borders. If a scrollbar needs
accent treatment, keep it to dense internal scrollers like code or table areas,
not the global page scrollbar.

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

## Component lab commands

For experimental site/blog design work, run commands from `component-lab/`:

```sh
npm run dev          # local lab server on localhost:3001
npm run build        # production build check for the sandbox
npm run lint         # eslint
npm run format       # prettier --write .
npm run format:check # prettier --check .
```

Use npm only in the lab. Do not wire `component-lab/` into either Vercel deploy
until the experiment graduates into a deliberate implementation plan.

## Unified site commands

For the combined prototype, run commands from `unified-site/`:

```sh
npm run dev          # local prototype server on localhost:3002
npm run build        # Next production build
npm run lint         # eslint
npm run format       # prettier --write .
npm run format:check # prettier --check .
npm run test:content # validate APM post loading/rendering/feed generation
npm run test:no-motion # fail on motion/resizing/dither/canvas leftovers
npm run test:visual  # Playwright screenshots + focused DOM measurements
```

When touching `unified-site/`, run build, lint, format check, content test,
no-motion test, and visual test before considering work done. Inspect the
generated screenshots for visual rhythm, not just pass/fail output.

## Verification discipline

Testing and verification are as important as the fix itself. Do not make a
change and assume it worked. For every behavioral, layout, interaction, or
content-routing change, create or run a concrete check that proves the intended
thing changed and that the surrounding behavior did not regress. Use the
available project gates, focused scripts, screenshots, browser interaction
checks, DOM measurements, or content assertions as appropriate to the risk.

When iterating on the component lab, prefer small, repeatable verification
snippets that capture the meaning being tested, such as rail spacing, selected
state behavior, responsive layout, link affordances, and dark/light contrast.
These checks are part of how the design direction gets clarified over time, not
an afterthought. If the intended behavior or visual meaning is ambiguous, ask
the user instead of guessing.

## Committing

Commit and push when you are confident the project is in good shape for a checkpoint. Before committing:

1. Run `npm run build` from `islamtayeb/` and confirm it succeeds with no errors.
2. Run `npm run lint` and `npm run format:check` to catch style issues.
3. When touching `component-lab/`, also run its `npm run build`, `npm run lint`,
   and `npm run format:check` from `component-lab/`.
4. When touching `unified-site/`, also run its build, lint, format check,
   content, no-motion, and visual checks from `unified-site/`.
5. If formatting is off, run `npm run format` first, then re-verify with build.

Only commit when all three pass. Include meaningful commit messages that describe the "why."

## Key conventions

- **Package manager:** npm (lockfile is `package-lock.json`).
- **Path alias:** `@/*` maps to the active project root in both Next apps
  (e.g., `islamtayeb/lib/utils` inside `islamtayeb/`,
  `component-lab/lib/utils` inside `component-lab/`, and
  `unified-site/lib/utils` inside `unified-site/`).
- **Styling:** Tailwind CSS 3 with HSL CSS variables. Dark mode is class-based via `next-themes`.
- **Interaction cues:** Anything clickable should show the pointer cursor on
  hover. Anything present but locked/unavailable should show the not-allowed
  cursor. Any link that opens elsewhere should be visibly underlined; color is
  optional, but the underline is not.
- **Component library:** shadcn/ui (new-york style, slate base, RSC enabled). Config in `components.json`. UI primitives live in `components/ui/`.
- **Fonts:** Geist Sans, Geist Mono, and Anek Telugu (as `--font-caption`). Default body font is `font-mono`.
- **Formatting:** Prettier config is at repo root (`prettier.config.js`): single quotes, semicolons, trailing commas `es5`, 80-char width, 2-space indent, LF endings.
- **`cn()` helper:** `lib/utils.ts` exports `cn()` (clsx + tailwind-merge). Use it for conditional class merging.
- **`apmoverflow` posts:** publish from checked-in Markdown under `apmoverflow/content/posts/` plus a JSON manifest for slug/date/links/media/alt text. Keep authored prose out of frontmatter and preserve it verbatim. For migrated posts, treat this repo's Markdown as newer than any stale Obsidian copy; if linking Obsidian, point the Obsidian note at the repo Markdown source.
- **`apmoverflow` generated outputs:** slug `index.html` files, `blog/index.html`, and `feed/*.xml` are generated from the modular pipeline. Do not hand-edit generated HTML for source-backed posts; edit Markdown/manifests and rebuild.
- **`apmoverflow` manifests:** use `listed: false` for source-backed pages that should exist at their slug but stay out of `/blog/` and feeds. Use `allowHtml: true` only for legacy posts that need raw HTML blocks such as iframes, hand-built TOCs, tables, or footnote sections. Use `wrapTables: false` when the Markdown already contains preserved table wrappers/raw HTML.
- **`apmoverflow` tables:** use Obsidian-like intrinsic table sizing: auto layout, small per-column minimums, normal wrapping, and no internal horizontal table scrollbars. Dense tables should wrap and grow taller instead of scrolling. Raw HTML tables and generated `.table-wrap` Markdown tables should share this primitive unless a post intentionally needs custom table markup.

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
