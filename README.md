# personal-website

Two small sites live here:

- `islamtayeb/` - Next.js personal website at `islamtayeb.dev`
- `apmoverflow/` - static blog at `apmoverflow.xyz`

## Main Site

```sh
cd islamtayeb
npm install
npm run dev
```

Before committing changes to the main site:

```sh
npm run lint
npm run format:check
npm run build
```

## Blog Posts

The personal site reads `https://apmoverflow.xyz/blog/` in
`islamtayeb/app/_components/Blog.tsx` for the latest post order, then fetches
the linked posts for excerpts. The Atom/RSS feeds should mirror that same list.

The feed is generated from `apmoverflow/blog/index.html` and the linked post
HTML files:

```sh
cd apmoverflow
node scripts/generate-feed.mjs
```

Vercel also runs that generator when deploying `apmoverflow/`.
