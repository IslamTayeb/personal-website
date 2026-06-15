import { site } from '../site.config.mjs';
import { datetime, formatDate, toFeedDate } from '../utils/date.mjs';
import { escapeHtml } from '../utils/html.mjs';

export function renderPostPage(post) {
  const { manifest } = post;
  const description = escapeHtml(manifest.description);
  const title = escapeHtml(manifest.title);
  const canonical = `${site.url}/${manifest.slug}/`;
  const socialImage = manifest.socialImage
    ? `<meta property="og:image" content="${escapeHtml(manifest.socialImage)}" />
    <meta property="twitter:image" content="${escapeHtml(
      manifest.socialImage
    )}" />`
    : '';
  const schema = {
    '@context': 'http://schema.org',
    '@type': 'article',
    name: manifest.title,
    headline: manifest.title,
    url: canonical,
    description: manifest.description,
    datePublished: toFeedDate(manifest.publishedAt),
    dateModified: toFeedDate(manifest.updatedAt),
    ...(manifest.socialImage ? { image: manifest.socialImage } : {}),
  };
  const schemaJson = JSON.stringify(schema, null, 8).replaceAll('<', '\\u003c');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=5"
    />

    <title>${title} | ${site.name}</title>
    <link rel="canonical" href="${canonical}" />

    <!-- Primary Meta Tags -->
    <meta name="title" content="${title}" />
    <meta name="description" content="${description}" />

    <!-- Open Graph / Facebook -->
    <meta property="og:site_name" content="${site.name}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:description" content="${description}" />
    ${socialImage}

    <!-- Twitter -->
    <meta property="twitter:card" content="summary" />
    <meta property="twitter:url" content="${canonical}" />
    <meta property="twitter:title" content="${title}" />
    <meta property="twitter:description" content="${description}" />

    <!-- Microdata -->
    <script type="application/ld+json">
      ${schemaJson}
    </script>

    <link
      rel="alternate"
      type="application/atom+xml"
      href="/feed/"
      title="${site.name}"
    />
    <link
      rel="alternate"
      type="application/rss+xml"
      href="/feed/rss.xml"
      title="${site.name}"
    />

    <link rel="icon" href="/static/favicon.svg" />
    <link rel="apple-touch-icon" href="/static/favicon.svg" />
    <link rel="stylesheet" href="/static/styles.css" />
    <link rel="stylesheet" href="/static/highlight.css" />
  </head>

  <body class="post">
    <header>
      <a class="title" href="/">
        <h1>${site.name}</h1>
      </a>
      <nav>
        <p><a href="/">Home</a> <a href="/blog/">Blog</a></p>
      </nav>
    </header>

    <main>
      <h1>${title}</h1>

      <p>
        <i><time datetime="${datetime(manifest.publishedAt)}">${formatDate(
          manifest.publishedAt
        )}</time></i>
      </p>

      ${post.articleHtml}
    </main>

    <footer></footer>
  </body>
</html>
`.replace(/[ \t]+$/gm, '');
}
