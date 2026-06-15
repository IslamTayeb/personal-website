import { readFile } from 'node:fs/promises';

import { paths, site } from '../site.config.mjs';
import { toFeedDate, toRssDate } from '../utils/date.mjs';
import { escapeXml, getMatch, stripTags } from '../utils/html.mjs';

function absoluteUrl(href) {
  return `${site.url}${href.startsWith('/') ? href : `/${href}`}`;
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

async function feedEntriesFromBlogIndex(blogHtml, renderedPostsBySlug) {
  const blogItems = [...blogHtml.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(
    ([, item]) => ({
      listDate: getMatch(item, /<time datetime="([^"]+)"/, 'post date'),
      href: getMatch(item, /<a\b[^>]*href="([^"]+)"/, 'post link'),
    })
  );

  const entries = await Promise.all(
    blogItems.map(async ({ listDate, href }) => {
      const slug = href.replace(/^\/|\/$/g, '');
      const html =
        renderedPostsBySlug.get(slug) ??
        (await readFile(`${paths.root}${href}index.html`, 'utf8'));
      const title = postTitle(html);
      const published = toFeedDate(
        html.match(/<time datetime="([^"]+)">/)?.[1] ?? listDate
      );
      const updated = toFeedDate(
        html.match(/"dateModified": "([^"]+)"/)?.[1] ?? published
      );
      const content = firstContentParagraph(html);

      return {
        url: absoluteUrl(href),
        title,
        published,
        updated,
        content,
      };
    })
  );

  entries.sort((a, b) => new Date(b.published) - new Date(a.published));

  return entries;
}

export async function renderFeeds({ blogHtml, renderedPosts }) {
  const renderedPostsBySlug = new Map(
    renderedPosts.map((post) => [post.manifest.slug, post.pageHtml])
  );
  const homeHtml = await readFile(paths.home, 'utf8');
  const entries = await feedEntriesFromBlogIndex(blogHtml, renderedPostsBySlug);
  const feedUpdated =
    entries
      .map((entry) => entry.updated)
      .sort((a, b) => new Date(b) - new Date(a))[0] ?? toFeedDate(new Date());
  const subtitle = getMatch(
    homeHtml,
    /<meta\s+name="description"\s+content="([^"]*)"\s*\/>/,
    'site description'
  );

  const atomFeed = `<?xml version='1.0' encoding='UTF-8'?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${site.url}</id>
  <title>${site.name}</title>
  <updated>${feedUpdated}</updated>
  <author>
    <name>${site.author}</name>
  </author>
  <link href="${site.url}/" rel="alternate"/>
  <link href="${site.url}/feed/" rel="self" type="application/atom+xml"/>
  <link href="${site.url}/feed/rss.xml" rel="alternate" type="application/rss+xml"/>
  <subtitle>${escapeXml(subtitle)}</subtitle>
${entries
  .map(
    (entry) => `  <entry>
    <id>${entry.url}</id>
    <title>${escapeXml(entry.title)}</title>
    <updated>${entry.updated}</updated>
    <author>
      <name>${site.author}</name>
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
    <title>${site.name}</title>
    <link>${site.url}/</link>
    <description>${escapeXml(subtitle)}</description>
    <lastBuildDate>${toRssDate(feedUpdated)}</lastBuildDate>
    <atom:link href="${site.url}/feed/rss.xml" rel="self" type="application/rss+xml"/>
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

  return {
    atomFeed,
    rssFeed,
  };
}
