import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { profile } from '../data/profile';
import { siteMetadata } from '../data/site-metadata';
import {
  apmShellConfigPath,
  renderApmShellConfig,
} from '../lib/apm-redirects.mjs';
import { buildAtomFeed, buildRssFeed } from '../lib/blog/feed';
import { listFiles } from './source-files.mjs';
import { getAllPosts } from '../lib/blog/posts';
import nextConfig from '../next.config.mjs';

const siteUrl = siteMetadata.url;
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

type VercelConfig = {
  redirects?: RedirectRule[];
};

function hasHostCondition(rule: RedirectRule, hosts: readonly string[]) {
  return (
    rule.has?.some(
      (condition) =>
        condition.type === 'host' &&
        typeof condition.value === 'string' &&
        hosts.includes(condition.value)
    ) === true
  );
}

function assertRedirectRule(
  redirects: RedirectRule[],
  source: string,
  destination: string,
  matches: (rule: RedirectRule) => boolean,
  label: string
) {
  assert.ok(
    redirects.some(
      (rule) =>
        rule.source === source &&
        rule.destination === destination &&
        rule.permanent === true &&
        matches(rule)
    ),
    `missing ${label}: ${source} -> ${destination}`
  );
}

function assertAppRedirect(
  redirects: RedirectRule[],
  source: string,
  destination: string
) {
  for (const host of oldHosts) {
    assertRedirectRule(
      redirects,
      source,
      destination,
      (rule) => hasHostCondition(rule, [host]),
      `apmoverflow redirect for ${host}`
    );
  }
}

function assertShellRedirect(
  redirects: RedirectRule[],
  source: string,
  destination: string
) {
  assertRedirectRule(
    redirects,
    source,
    destination,
    (rule) => !rule.has,
    'apmoverflow shell redirect'
  );
}

async function readRedirects() {
  const redirects = nextConfig.redirects;

  if (typeof redirects !== 'function') {
    throw new Error('next.config.mjs should define redirects()');
  }

  return (await redirects()) as RedirectRule[];
}

async function readApmShellRedirects() {
  const config = JSON.parse(
    await readFile(apmShellConfigPath, 'utf8')
  ) as VercelConfig;

  assert.ok(
    Array.isArray(config.redirects),
    'apmoverflow/vercel.json should define redirects'
  );

  return config.redirects;
}

async function assertApmShellConfigIsGenerated() {
  const text = await readFile(apmShellConfigPath, 'utf8');

  assert.equal(
    text,
    renderApmShellConfig(text),
    'apmoverflow/vercel.json is stale; run npm run generate:redirects in imt/'
  );
}

async function assertNoOldTrackingPayload() {
  const roots = ['app', 'components', 'content', 'data', 'lib'];
  const sourceFiles = (
    await Promise.all(roots.map((root) => listFiles(path.resolve(root))))
  )
    .flat()
    .filter((file) => /\.(css|mjs|ts|tsx)$/.test(file));
  const bannedPatterns = [
    /ip-api\.com/,
    /VisitorTracker/,
    /visitor_fingerprint/,
    /ip_address/,
    /getGeolocation/,
    /GeolocationData/,
    /apmoverflow\.xyz/,
    /islamtayeb\.dev/,
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
    assert.doesNotMatch(feed, /islamtayeb\.dev/);
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
  const shellRedirects = await readApmShellRedirects();
  const posts = await getAllPosts();
  const staticRedirects: [string, string][] = [
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

  assert.ok(redirects.length > 0, 'next.config.mjs should define redirects');
  await assertApmShellConfigIsGenerated();

  for (const [source, destination] of staticRedirects) {
    assertAppRedirect(redirects, source, destination);
    assertShellRedirect(shellRedirects, source, destination);
  }

  for (const post of posts) {
    const destination = `${siteUrl}/blog/${post.manifest.slug}`;

    assertAppRedirect(redirects, `/${post.manifest.slug}`, destination);
    assertAppRedirect(redirects, `/${post.manifest.slug}/`, destination);
    assertShellRedirect(shellRedirects, `/${post.manifest.slug}`, destination);
    assertShellRedirect(shellRedirects, `/${post.manifest.slug}/`, destination);
  }

  for (const rule of redirects.filter((rule) =>
    hasHostCondition(rule, oldHosts)
  )) {
    assert.notEqual(rule.source, '/:path*', 'avoid broad old-host catch-all');
    assert.notEqual(rule.source, '/(.*)', 'avoid broad old-host catch-all');
  }

  assertPublicProfileFieldsAreIntentional();
  await assertNoOldTrackingPayload();
  await assertFeedsAreCanonical();

  console.log(
    `migration ok: ${posts.length} old APM slugs redirect in app and shell, shell config generated, feeds canonical, old tracking payload absent`
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
