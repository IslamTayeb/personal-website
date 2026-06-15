import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { loadMarkdownPosts, postOutputPath } from '../content/load-posts.mjs';
import { renderMarkdownPost } from '../markdown/render-markdown.mjs';
import { paths } from '../site.config.mjs';
import { renderBlogIndex } from '../render/blog-index.mjs';
import { renderFeeds } from '../render/feed.mjs';
import { renderPostPage } from '../render/post-page.mjs';

export async function buildSite() {
  const sourcePosts = await loadMarkdownPosts();
  const renderedPosts = sourcePosts.map((post) => {
    const rendered = renderMarkdownPost(post);

    return {
      ...rendered,
      pageHtml: renderPostPage(rendered),
    };
  });
  const listedPosts = renderedPosts.filter((post) => post.manifest.listed);
  const blogHtml = await renderBlogIndex(listedPosts);
  const { atomFeed, rssFeed } = await renderFeeds({
    blogHtml,
    renderedPosts,
  });

  await Promise.all(
    renderedPosts.map(async (post) => {
      const outputPath = postOutputPath(post);

      await mkdir(path.dirname(outputPath), { recursive: true });
      await writeFile(outputPath, post.pageHtml);
    })
  );

  await writeFile(paths.blogIndex, blogHtml);
  await mkdir(paths.feedDir, { recursive: true });
  await writeFile(path.join(paths.feedDir, 'index.xml'), atomFeed);
  await writeFile(path.join(paths.feedDir, 'rss.xml'), rssFeed);

  return renderedPosts;
}
