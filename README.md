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

## Blog Feed

The personal site reads `https://apmoverflow.xyz/feed/` in
`islamtayeb/app/_components/Blog.tsx`.

The feed is generated from `apmoverflow/blog/index.html` and the linked post
HTML files:

```sh
cd apmoverflow
node scripts/generate-feed.mjs
```

Vercel also runs that generator when deploying `apmoverflow/`.
