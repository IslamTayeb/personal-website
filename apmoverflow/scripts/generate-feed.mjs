import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const siteUrl = 'https://apmoverflow.xyz';
const author = 'islamtayeb';

const blogHtml = await readFile(path.join(root, 'blog', 'index.html'), 'utf8');
const homeHtml = await readFile(path.join(root, 'index.html'), 'utf8');

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function stripTags(value) {
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function getMatch(html, pattern, label) {
  const match = html.match(pattern);

  if (!match) {
    throw new Error(`Could not find ${label}`);
  }

  return match[1].trim();
}

function toFeedDate(value) {
  return new Date(value).toISOString().replace(/\.\d{3}Z$/, '+00:00');
}

function toRssDate(value) {
  return new Date(value).toUTCString();
}

function absoluteUrl(href) {
  return `${siteUrl}${href.startsWith('/') ? href : `/${href}`}`;
}

function firstContentParagraph(html) {
  const main = getMatch(html, /<main>([\s\S]*?)<\/main>/, 'main content');
  const paragraphs = [...main.matchAll(/<p(?:\s[^>]*)?>[\s\S]*?<\/p>/g)];
  const paragraph = paragraphs
    .map((match) => match[0].trim())
    .find((value) => !value.includes('<time ') && stripTags(value).length > 0);

  if (!paragraph) {
    throw new Error('Could not find first content paragraph');
  }

  return paragraph.replace(/\s+/g, ' ');
}

function postTitle(html) {
  const main = getMatch(html, /<main>([\s\S]*?)<\/main>/, 'main content');

  return stripTags(getMatch(main, /<h1>([\s\S]*?)<\/h1>/, 'title'));
}

const blogItems = [...blogHtml.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(
  ([, item]) => ({
    listDate: getMatch(item, /<time datetime="([^"]+)"/, 'post date'),
    href: getMatch(item, /<a\b[^>]*href="([^"]+)"/, 'post link'),
  })
);

const entries = await Promise.all(
  blogItems.map(async ({ listDate, href }) => {
    const postPath = path.join(root, href, 'index.html');
    const html = await readFile(postPath, 'utf8');
    const title = postTitle(html);
    const published = toFeedDate(
      html.match(/<time datetime="([^"]+)">/)?.[1] ?? listDate
    );
    const content = firstContentParagraph(html);

    return {
      url: absoluteUrl(href),
      title,
      published,
      updated: published,
      content,
    };
  })
);

entries.sort((a, b) => new Date(b.published) - new Date(a.published));

const feedUpdated = entries[0]?.updated ?? toFeedDate(new Date());
const subtitle = getMatch(
  homeHtml,
  /<meta\s+name="description"\s+content="([^"]*)"\s*\/>/,
  'site description'
);

const atomFeed = `<?xml version='1.0' encoding='UTF-8'?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${siteUrl}</id>
  <title>APM Overflow</title>
  <updated>${feedUpdated}</updated>
  <author>
    <name>${author}</name>
  </author>
  <link href="${siteUrl}/" rel="alternate"/>
  <link href="${siteUrl}/feed/" rel="self" type="application/atom+xml"/>
  <link href="${siteUrl}/feed/rss.xml" rel="alternate" type="application/rss+xml"/>
  <subtitle>${escapeXml(subtitle)}</subtitle>
${entries
  .map(
    (entry) => `  <entry>
    <id>${entry.url}</id>
    <title>${escapeXml(entry.title)}</title>
    <updated>${entry.updated}</updated>
    <author>
      <name>${author}</name>
    </author>
    <content type="html">${escapeXml(entry.content)}</content>
    <link href="${entry.url}" rel="alternate"/>
    <published>${entry.published}</published>
  </entry>`
  )
  .join('\n')}
</feed>
`;

const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>APM Overflow</title>
    <link>${siteUrl}/</link>
    <description>${escapeXml(subtitle)}</description>
    <lastBuildDate>${toRssDate(feedUpdated)}</lastBuildDate>
    <atom:link href="${siteUrl}/feed/rss.xml" rel="self" type="application/rss+xml"/>
${entries
  .map(
    (entry) => `    <item>
      <title>${escapeXml(entry.title)}</title>
      <link>${entry.url}</link>
      <guid isPermaLink="true">${entry.url}</guid>
      <description>${escapeXml(entry.content)}</description>
      <pubDate>${toRssDate(entry.published)}</pubDate>
    </item>`
  )
  .join('\n')}
  </channel>
</rss>
`;

await mkdir(path.join(root, 'feed'), { recursive: true });
await writeFile(path.join(root, 'feed', 'index.xml'), atomFeed);
await writeFile(path.join(root, 'feed', 'rss.xml'), rssFeed);
