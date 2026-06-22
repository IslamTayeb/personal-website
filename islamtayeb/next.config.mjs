import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const siteUrl = 'https://islamtayeb.dev';
const oldHosts = ['apmoverflow.xyz', 'www.apmoverflow.xyz'];
const appRoot = path.dirname(fileURLToPath(import.meta.url));
const postContentRoot = path.join(appRoot, 'content', 'posts');

function listedPostSlugs() {
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

function redirectForHost(source, destination, host) {
  return {
    source,
    has: [
      {
        type: 'host',
        value: host,
      },
    ],
    destination,
    permanent: true,
  };
}

function oldHostRedirects(source, destination) {
  return oldHosts.map((host) => redirectForHost(source, destination, host));
}

function apmOverflowRedirects() {
  const staticRedirects = [
    ['/', `${siteUrl}/blog`],
    ['/blog', `${siteUrl}/blog`],
    ['/blog/', `${siteUrl}/blog`],
    ['/blog/:path*', `${siteUrl}/blog/:path*`],
    ['/feed', `${siteUrl}/blog/feed.xml`],
    ['/feed/', `${siteUrl}/blog/feed.xml`],
    ['/feed/index.xml', `${siteUrl}/blog/feed.xml`],
    ['/feed/rss.xml', `${siteUrl}/blog/rss.xml`],
  ].flatMap(([source, destination]) => oldHostRedirects(source, destination));
  const postRedirects = listedPostSlugs().flatMap((slug) => [
    ...oldHostRedirects(`/${slug}`, `${siteUrl}/blog/${slug}`),
    ...oldHostRedirects(`/${slug}/`, `${siteUrl}/blog/${slug}`),
  ]);

  return [...staticRedirects, ...postRedirects];
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return apmOverflowRedirects();
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
