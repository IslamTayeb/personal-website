import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { renderFeeds } from '../render/feed.mjs';
import { paths } from '../site.config.mjs';

export async function buildFeed() {
  const blogHtml = await readFile(paths.blogIndex, 'utf8');
  const { atomFeed, rssFeed } = await renderFeeds({
    blogHtml,
    renderedPosts: [],
  });

  await mkdir(paths.feedDir, { recursive: true });
  await writeFile(path.join(paths.feedDir, 'index.xml'), atomFeed);
  await writeFile(path.join(paths.feedDir, 'rss.xml'), rssFeed);
}
