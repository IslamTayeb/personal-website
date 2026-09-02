import { readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
/** @type {{ url: string }} */
const siteUrlConfig = require('../data/site-url.json');
const siteUrl = siteUrlConfig.url;
const libRoot = path.dirname(fileURLToPath(import.meta.url));
const postContentRoot = path.join(libRoot, '..', 'content', 'posts');

/** Absolute path of the old-domain redirect shell's Vercel config. */
export const apmShellConfigPath = path.resolve(
  libRoot,
  '..',
  '..',
  'apmoverflow',
  'vercel.json'
);

/** @returns {string[]} sorted post slugs read from the content manifests */
export function postSlugs() {
  return readdirSync(postContentRoot)
    .filter((file) => file.endsWith('.json'))
    .map((file) => {
      const raw = readFileSync(path.join(postContentRoot, file), 'utf8');
      const manifest = JSON.parse(raw);

      if (typeof manifest.slug !== 'string') {
        throw new Error(`${file} is missing a string slug`);
      }

      return manifest.slug;
    })
    .sort();
}

/**
 * Old blog paths and their canonical destinations, in the order they are
 * emitted by both the app and the redirect shell.
 *
 * @returns {[string, string][]} `[source, destination]` pairs
 */
export function apmRedirectPairs() {
  /** @type {[string, string][]} */
  const staticPairs = [
    ['/', `${siteUrl}/blog`],
    ['/blog', `${siteUrl}/blog`],
    ['/blog/', `${siteUrl}/blog`],
    ['/blog/:path*', `${siteUrl}/blog/:path*`],
    ['/feed', `${siteUrl}/blog/feed.xml`],
    ['/feed/', `${siteUrl}/blog/feed.xml`],
    ['/feed/index.xml', `${siteUrl}/blog/feed.xml`],
    ['/feed/rss.xml', `${siteUrl}/blog/rss.xml`],
    ['/static/:path*', `${siteUrl}/static/:path*`],
  ];
  /** @type {[string, string][]} */
  const postPairs = postSlugs().flatMap((slug) => [
    [`/${slug}`, `${siteUrl}/blog/${slug}`],
    [`/${slug}/`, `${siteUrl}/blog/${slug}`],
  ]);

  return [...staticPairs, ...postPairs];
}

/**
 * Re-renders the shell config with a freshly generated `redirects` list,
 * keeping every other field of the existing file in place.
 *
 * @param {string} existingText current contents of the shell config
 * @returns {string} the config text to write back
 */
export function renderApmShellConfig(existingText) {
  const { redirects: _ignored, ...rest } = JSON.parse(existingText);

  return (
    JSON.stringify(
      {
        ...rest,
        redirects: apmRedirectPairs().map(([source, destination]) => ({
          source,
          destination,
          permanent: true,
        })),
      },
      null,
      2
    ) + '\n'
  );
}
