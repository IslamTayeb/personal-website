# AGENTS.md

## Repo layout

This repo now has one production app, one production redirect shell, one
experimental sandbox, and archived legacy projects:

- **`islamtayeb/`** -- the active Next.js App Router site for
  `islamtayeb.dev`, including the unified personal site and blog.
- **`apmoverflow/`** -- a tiny static Vercel redirect shell for
  `apmoverflow.xyz`. It contains no authored content; it only sends old APM
  paths to `https://www.islamtayeb.dev/blog/...`.
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
`https://www.islamtayeb.dev/blog/...`. Keep redirect coverage in both
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
npm run test:pageview  # pageview webhook payload/routing validation
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
- **Icon plus text links:** When a control has an icon plus a text label that
  should use the ROYB underline/highlight, keep the icon outside the underline
  span and wrap only the label in `RoybLinkText`. Use
  `royb-link-hover-scope` when the icon or gap should trigger the label hover
  state.
- **Clickable states:** Every clickable control needs deliberate default,
  hover, active/pressed, disabled/unavailable, and keyboard-focus states. The
  theme toggle is the narrow exception: base and keyboard-focus states only.
- **One-line compact copy:** Descriptions, summaries, excerpts, compact rails,
  course details, and previews should be concise and constrained with explicit
  one-line CSS where needed.
- **Rail title/date balance:** On mobile rail rows, dates get width priority.
  Titles should give up space before dates wrap, while genuinely long dates can
  still wrap on narrow phones without creating horizontal overflow.
- **Phone breakpoint:** For the active site, "phone" means any viewport where
  the hero portrait is hidden. Keep footer quote/credit visibility tied to that
  same `md` portrait threshold, not to `sm`.
- **Blog internals:** Active posts should use local `/blog/...` links for links
  to other posts. Do not link active content back to `apmoverflow.xyz`.
- **Blog manifests:** Use `listed: false` for source-backed pages that should
  exist at their slug but stay out of `/blog`, feeds, and sitemaps. Hidden
  source-backed pages still need old APM top-level redirect coverage when their
  `/blog/...` page exists. Use `allowHtml: true` only for posts that need raw
  HTML blocks.
- **Pageview events:** The active site uses a tiny `sendBeacon` pageview script
  and `/api/pageview` route for Discord webhook notifications. Keep it
  post-response, avoid canvas/fingerprinting/external geolocation lookups, and
  use Vercel request geolocation headers for location context. Configure it
  with `SITE_VISIT_WEBHOOK_URL`, or the existing `DISCORD_WEBHOOK_URL` fallback;
  disable client emission with `NEXT_PUBLIC_SITE_VISIT_EVENTS=false` or server
  delivery with `SITE_VISIT_EVENTS_ENABLED=false`.
- **Pageview notification detail:** Discord pageview messages may use emojis for
  section clarity, but location must be labeled as approximate network location.
  Do not ask visitors for browser geolocation permission. Bot detection should
  stay passive and heuristic unless a deliberate BotID-style integration is
  planned.
- **Tables:** Blog tables use Obsidian-like intrinsic sizing: auto layout,
  small per-column minimums, normal wrapping, and no internal horizontal table
  scrollbars unless a post intentionally needs custom markup.
- **Favicon:** The active favicon is the moon glyph on a transparent
  background. Keep the crescent cutout transparent. Its SVG should react to
  browser color scheme: off-black (`#1C1C1C`) in light chrome and `#FAFAFA` in
  dark chrome. Keep PNG and ICO fallbacks generated from the same crescent
  geometry, including `apple-icon.png`, `icon-light-32x32.png`,
  `icon-dark-32x32.png`, and `favicon.ico`.
- **Repeated UI:** if something is used more than once, make it a component.
- **Profile picture:** Generate hero profile assets from source photos with
  `npm run render:profile-picture -- /absolute/path/to/source-image` inside
  `islamtayeb/`. This writes both `public/me.webp` and
  `public/hero-portrait.png` with the established 384px crop, sharpened
  pixel/color treatment, and transparent square mask.

## Deployment

The main production Vercel project should build from `islamtayeb/`.
`www.islamtayeb.dev` is the canonical domain. Keep crawler-facing metadata,
feeds, sitemaps, and old-domain redirect destinations on that host.

The existing `apm-overflow` Vercel project should build from `apmoverflow/`.
Keep `apmoverflow.xyz` and `www.apmoverflow.xyz` attached there unless the
domains are deliberately moved later. The shell `vercel.json` handles live
old-path redirects, while `islamtayeb/next.config.mjs` keeps equivalent
host-conditioned redirects ready if the domains are moved to the main project.

The legacy archive folders should not be deployed directly.
