import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { profile } from '../data/profile';
import { buildAtomFeed, buildRssFeed } from '../lib/blog/feed';
import { getAllPosts } from '../lib/blog/posts';
import nextConfig from '../next.config.mjs';

const siteUrl = 'https://islamtayeb.dev';
const oldHosts = ['apmoverflow.xyz', 'www.apmoverflow.xyz'];

type HostCondition = {
  type: string;
  value?: unknown;
};

type RedirectRule = {
  source: string;
  destination: string;
  permanent?: boolean;
  has?: HostCondition[];
};

function isOldHostRedirect(rule: RedirectRule) {
  return rule.has?.some(
    (condition) =>
      condition.type === 'host' &&
      typeof condition.value === 'string' &&
      oldHosts.includes(condition.value)
  );
}

function assertRedirect(
  redirects: RedirectRule[],
  source: string,
  destination: string
) {
  assert.ok(
    redirects.some(
      (rule) =>
        rule.source === source &&
        rule.destination === destination &&
        rule.permanent === true &&
        isOldHostRedirect(rule)
    ),
    `missing apmoverflow redirect: ${source} -> ${destination}`
  );
}

async function readRedirects() {
  const redirects = nextConfig.redirects;

  if (typeof redirects !== 'function') {
    throw new Error('next.config.mjs should define redirects()');
  }

  return (await redirects()) as RedirectRule[];
}

async function listFiles(root: string): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(root, entry.name);

      if (entry.isDirectory()) {
        return listFiles(entryPath);
      }

      return [entryPath];
    })
  );

  return files.flat();
}

async function assertNoOldTrackingPayload() {
  const roots = ['app', 'components', 'content', 'data', 'lib'];
  const sourceFiles = (
    await Promise.all(roots.map((root) => listFiles(path.resolve(root))))
  )
    .flat()
    .filter((file) => /\.(css|mjs|ts|tsx)$/.test(file));
  const bannedPatterns = [
    /DISCORD_WEBHOOK_URL/,
    /ip-api\.com/,
    /VisitorTracker/,
    /visitor_fingerprint/,
    /ip_address/,
    /getGeolocation/,
    /GeolocationData/,
    /apmoverflow\.xyz/,
  ];

  for (const file of sourceFiles) {
    const content = await readFile(file, 'utf8');

    for (const pattern of bannedPatterns) {
      assert.doesNotMatch(
        content,
        pattern,
        `${path.relative(process.cwd(), file)} contains legacy tracking/domain payload: ${pattern}`
      );
    }
  }
}

async function assertFeedsAreCanonical() {
  const atomFeed = await buildAtomFeed();
  const rssFeed = await buildRssFeed();

  assert.match(atomFeed, /<feed xmlns="http:\/\/www\.w3\.org\/2005\/Atom">/);
  assert.match(rssFeed, /<rss version="2\.0"/);

  for (const feed of [atomFeed, rssFeed]) {
    assert.match(feed, new RegExp(`${siteUrl}/blog`));
    assert.doesNotMatch(feed, /apmoverflow\.xyz/);
    assert.doesNotMatch(feed, /<link>\/blog/);
    assert.doesNotMatch(feed, /href="\/blog/);
  }
}

function assertPublicProfileFieldsAreIntentional() {
  assert.equal(profile.email, 'islam.moh.islamm@gmail.com');
  assert.equal(profile.location, 'Durham, NC');
  assert.equal(profile.hometown, 'Egypt');
}

async function main() {
  const redirects = await readRedirects();
  const posts = await getAllPosts();

  assert.ok(redirects.length > 0, 'next.config.mjs should define redirects');
  assertRedirect(redirects, '/', `${siteUrl}/blog`);
  assertRedirect(redirects, '/blog', `${siteUrl}/blog`);
  assertRedirect(redirects, '/blog/', `${siteUrl}/blog`);
  assertRedirect(redirects, '/blog/:path*', `${siteUrl}/blog/:path*`);
  assertRedirect(redirects, '/feed', `${siteUrl}/blog/feed.xml`);
  assertRedirect(redirects, '/feed/', `${siteUrl}/blog/feed.xml`);
  assertRedirect(redirects, '/feed/index.xml', `${siteUrl}/blog/feed.xml`);
  assertRedirect(redirects, '/feed/rss.xml', `${siteUrl}/blog/rss.xml`);

  for (const post of posts) {
    assertRedirect(
      redirects,
      `/${post.manifest.slug}`,
      `${siteUrl}/blog/${post.manifest.slug}`
    );
    assertRedirect(
      redirects,
      `/${post.manifest.slug}/`,
      `${siteUrl}/blog/${post.manifest.slug}`
    );
  }

  for (const rule of redirects.filter(isOldHostRedirect)) {
    assert.notEqual(rule.source, '/:path*', 'avoid broad old-host catch-all');
    assert.notEqual(rule.source, '/(.*)', 'avoid broad old-host catch-all');
  }

  assertPublicProfileFieldsAreIntentional();
  await assertNoOldTrackingPayload();
  await assertFeedsAreCanonical();

  console.log(
    `migration ok: ${posts.length} old APM slugs redirect, feeds canonical, old tracking payload absent`
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
