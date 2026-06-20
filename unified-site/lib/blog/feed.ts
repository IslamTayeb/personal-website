import { escapeHtml } from './html';
import { datetime, toFeedDate } from './date';
import { getListedPosts, postHref } from './posts';

const siteUrl = 'https://islamtayeb.dev';

export async function buildAtomFeed() {
  const posts = await getListedPosts();
  const updated =
    posts[0]?.manifest.updatedAt ?? posts[0]?.manifest.publishedAt ?? '';

  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Islam Tayeb / Blog</title>
  <id>${siteUrl}/blog</id>
  <updated>${updated ? toFeedDate(updated) : new Date(0).toISOString()}</updated>
  <link href="${siteUrl}/blog" />
  <link href="${siteUrl}/blog/feed.xml" rel="self" />
  ${posts
    .map((post) => {
      const href = `${siteUrl}${postHref(post)}`;

      return `<entry>
    <title>${escapeHtml(post.manifest.title)}</title>
    <id>${href}</id>
    <link href="${href}" rel="alternate" />
    <published>${datetime(post.manifest.publishedAt)}</published>
    <updated>${datetime(post.manifest.updatedAt)}</updated>
    <summary>${escapeHtml(post.summary)}</summary>
  </entry>`;
    })
    .join('\n  ')}
</feed>
`;
}
