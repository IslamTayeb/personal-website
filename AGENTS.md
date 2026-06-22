# AGENTS.md

## Repo layout

This repo now has one production app, one production redirect shell, one
experimental sandbox, and archived legacy projects:

- **`islamtayeb/`** -- the active Next.js App Router site for
  `islamtayeb.dev`, including the unified personal site and blog.
- **`apmoverflow/`** -- a tiny static Vercel redirect shell for
  `apmoverflow.xyz`. It contains no authored content; it only sends old APM
  paths to `https://islamtayeb.dev/blog/...`.
- **`component-lab/`** -- an experimental Next.js lab for visual exploration.
  It is not production code and should stay isolated unless a design is
  intentionally ported.
- **`archive/islamtayeb-legacy/`** -- the old personal site, kept for rollback
  and reference only.
- **`archive/apmoverflow-legacy/`** -- the old static APM Overflow blog, kept
  for rollback and reference only.

There is no root `package.json`. Run commands from the project directory you
are changing.

## Active site intent

`islamtayeb/` is the official overhaul and replaces both the old
`islamtayeb.dev` app and the old `apmoverflow.xyz` static blog. The active site
uses the component-lab visual language: Sora + DM Mono, narrow document width,
sharp borders, paper/ink base, the `islam / blog` selector, the top ROYB bar,
and strong ROYB accents.

The desired feel is elevated minimalism with real density: whitespace separates
ideas, not inflates the page. Keep it motionless: no animations, transitions,
render-time measurements, resize observers, canvas/dither experiments, autoplay
media, or animation libraries.

APM Overflow writing now lives as Markdown plus JSON manifests under
`islamtayeb/content/posts/`. Treat that directory as the source of truth for
blog content. The archived APM Overflow copy is historical only.

`apmoverflow.xyz` should remain a routing shell: old APM paths redirect to
`https://islamtayeb.dev/blog/...`. Keep redirect coverage in both
`islamtayeb/next.config.mjs` and `apmoverflow/vercel.json`, and keep
`npm run test:migration` passing.

## Main site commands

All active-site commands run from `islamtayeb/`:

```sh
npm run dev            # local dev server
npm run build          # Next production build
npm run lint           # eslint
npm run format         # prettier --write .
npm run format:check   # prettier --check .
npm run test:content   # blog loading/rendering/feed validation
npm run test:migration # old-domain redirects + public payload checks
npm run test:no-motion # fail on motion/resizing/dither/canvas leftovers
npm run test:visual    # Playwright screenshots + DOM measurements
```

Before considering active-site work done, run build, lint, format check,
content test, migration test, no-motion test, and visual test. Inspect the
generated screenshots for visual rhythm, not just pass/fail output.

## Component lab commands

For design exploration, run commands from `component-lab/`:

```sh
npm run dev
npm run build
npm run lint
npm run format
npm run format:check
```

Use npm only in the lab. Do not wire `component-lab/` into Vercel deploys
unless the experiment graduates into a deliberate implementation plan.

## Verification discipline

Testing and verification are part of the fix. For every behavioral, layout,
interaction, routing, or content change, run or add a concrete check that proves
the intended behavior changed and surrounding behavior did not regress.

When iterating on visuals, prefer repeatable checks for rail spacing, selected
state behavior, responsive layout, link affordances, and contrast. If the
intended behavior or visual meaning is ambiguous, ask.

## Committing

Commit and push when the project is in a good rollback state. Before committing:

1. Run the active-site gates from `islamtayeb/`.
2. If `component-lab/` changed, run its build, lint, and format check.
3. If formatting is off, run `npm run format` in the affected project, then
   re-run the relevant gates.

Use meaningful commit messages that describe the why.

## Key conventions

- **Package manager:** npm, with `package-lock.json`.
- **Path alias:** `@/*` maps to the active project root inside each app.
- **Styling:** Tailwind CSS 4 in the active site. Use shared CSS variables and
  primitives before hand-tuning individual sections.
- **Links:** React-rendered hyperlinks should use
  `components/primitives/external-link.tsx`. Markdown-rendered article links
  should receive the same ROYB link classes in the renderer.
- **Clickable states:** Every clickable control needs deliberate default,
  hover, active/pressed, disabled/unavailable, and keyboard-focus states. The
  theme toggle is the narrow exception: base and keyboard-focus states only.
- **One-line compact copy:** Descriptions, summaries, excerpts, compact rails,
  course details, and previews should be concise and constrained with explicit
  one-line CSS where needed.
- **Phone breakpoint:** For the active site, "phone" means any viewport where
  the hero portrait is hidden. Keep footer quote/credit visibility tied to that
  same `md` portrait threshold, not to `sm`.
- **Blog internals:** Active posts should use local `/blog/...` links for links
  to other posts. Do not link active content back to `apmoverflow.xyz`.
- **Blog manifests:** Use `listed: false` for source-backed pages that should
  exist at their slug but stay out of `/blog` and feeds. Use `allowHtml: true`
  only for posts that need raw HTML blocks.
- **Tables:** Blog tables use Obsidian-like intrinsic sizing: auto layout,
  small per-column minimums, normal wrapping, and no internal horizontal table
  scrollbars unless a post intentionally needs custom markup.
- **Favicon:** The active favicon is the moon glyph on a transparent
  background. Keep the crescent cutout transparent. Its SVG should react to
  browser color scheme: off-black (`#1C1C1C`) in light chrome and `#FAFAFA` in
  dark chrome.
- **Repeated UI:** if something is used more than once, make it a component.

## Deployment

The main production Vercel project should build from `islamtayeb/`.
`islamtayeb.dev` is the canonical domain.

The existing `apm-overflow` Vercel project should build from `apmoverflow/`.
Keep `apmoverflow.xyz` and `www.apmoverflow.xyz` attached there unless the
domains are deliberately moved later. The shell `vercel.json` handles live
old-path redirects, while `islamtayeb/next.config.mjs` keeps equivalent
host-conditioned redirects ready if the domains are moved to the main project.

The legacy archive folders should not be deployed directly.
