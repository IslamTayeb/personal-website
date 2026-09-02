# websites

- `imt/` - Next.js site at [imt.sh](https://imt.sh). Vercel project `personal-website`.
- `apmoverflow/` - redirect shell. Sends old `apmoverflow.xyz` paths to `imt.sh/blog`.

`islamtayeb.dev` is abandoned. Do not reference it anywhere.

## Run

```sh
cd imt
npm install
npm run dev
```

## Check before committing

```sh
npm test && npm run lint && npm run format:check && npm run build
```

Blog posts live in `imt/content/posts/`. Rules for design and content are in `AGENTS.md`.
