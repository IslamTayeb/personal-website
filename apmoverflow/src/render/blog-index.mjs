import { readFile } from 'node:fs/promises';

import { paths } from '../site.config.mjs';
import { datetime, formatDate } from '../utils/date.mjs';
import { escapeHtml } from '../utils/html.mjs';

function renderBlogItem(post) {
  const { manifest } = post;

  return `<li>
          <span
            ><i><time datetime="${datetime(manifest.publishedAt)}">${formatDate(
              manifest.publishedAt
            )}</time></i></span
          >
          <a href="/${manifest.slug}/">${escapeHtml(manifest.title)}</a>
        </li>`;
}

export async function renderBlogIndex(posts) {
  let html = await readFile(paths.blogIndex, 'utf8');
  const items = [...posts]
    .sort(
      (a, b) =>
        new Date(b.manifest.publishedAt) - new Date(a.manifest.publishedAt)
    )
    .map(renderBlogItem)
    .join('\n        ');
  const listHtml = `<ul class="blog-posts">
        ${items}
      </ul>`;

  if (!/<ul class="blog-posts">[\s\S]*?<\/ul>/.test(html)) {
    throw new Error('Could not find blog post list in blog index');
  }

  return html.replace(/<ul class="blog-posts">[\s\S]*?<\/ul>/, listHtml);
}
