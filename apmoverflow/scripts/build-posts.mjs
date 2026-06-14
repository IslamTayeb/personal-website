import hljs from 'highlight.js';
import MarkdownIt from 'markdown-it';
import footnote from 'markdown-it-footnote';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentRoot = path.join(root, 'content', 'posts');
const siteUrl = 'https://apmoverflow.xyz';
const mediaBaseUrl =
  'https://raw.githubusercontent.com/islamtayeb/obsidian-files/main/';

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function stripTags(value) {
  return String(value)
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function encodeMediaFilename(filename) {
  return encodeURIComponent(filename).replace(
    /[!'()*]/g,
    (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`
  );
}

function mediaUrl(filename) {
  return `${mediaBaseUrl}${encodeMediaFilename(filename)}`;
}

function filenameFromUrl(value) {
  const pathname = new URL(value).pathname;
  return decodeURIComponent(pathname.slice(pathname.lastIndexOf('/') + 1));
}

function formatDate(value) {
  const date = new Date(value);
  const month = monthNames[date.getUTCMonth()];
  const day = String(date.getUTCDate()).padStart(2, '0');
  const year = date.getUTCFullYear();

  return `${month} ${day}, ${year}`;
}

function datetime(value) {
  return new Date(value)
    .toISOString()
    .replace(/:00\.000Z$/, 'Z')
    .replace(/\.000Z$/, 'Z');
}

function toFeedDate(value) {
  return new Date(value).toISOString().replace(/\.\d{3}Z$/, '+00:00');
}

function normalizeFootnoteOrder(markdown) {
  const firstDefinitionIndex = markdown.search(/^\[\^[^\]]+\]:/m);
  const body =
    firstDefinitionIndex >= 0
      ? markdown.slice(0, firstDefinitionIndex)
      : markdown;
  const orderedIds = [];

  for (const match of body.matchAll(/\[\^([^\]]+)\]/g)) {
    if (!orderedIds.includes(match[1])) {
      orderedIds.push(match[1]);
    }
  }

  if (orderedIds.length === 0) {
    return markdown;
  }

  const remap = new Map(orderedIds.map((id, index) => [id, String(index + 1)]));

  return markdown.replace(/\[\^([^\]]+)\]/g, (match, id) => {
    return `[^${remap.get(id) ?? id}]`;
  });
}

function withoutFootnoteDefinitions(markdown) {
  const index = markdown.search(/^\[\^[^\]]+\]:/m);
  return index >= 0 ? markdown.slice(0, index) : markdown;
}

function readingMeta(markdown) {
  const body = withoutFootnoteDefinitions(markdown)
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[[^\]]+\]\([^)]+\)/g, ' ')
    .replace(/[#>*_`|:-]/g, ' ');
  const words = body
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean).length;
  const rounded =
    words >= 1000
      ? `~${(Math.round(words / 100) / 10).toFixed(1)}K`
      : `~${words}`;
  const minutes = Math.max(1, Math.round(words / 250));

  return `${rounded} words, ~${minutes} min`;
}

function prepareMarkdown(markdown, manifest) {
  let prepared = normalizeFootnoteOrder(markdown);

  for (const image of manifest.images ?? []) {
    prepared = prepared.replaceAll(
      `${mediaBaseUrl}${image.filename}`,
      mediaUrl(image.filename)
    );
  }

  prepared = prepared.replace(/^## Index[ \t]*$/m, '%%GENERATED_TOC%%');

  for (const insert of manifest.videoInserts ?? []) {
    const targetHeading = headingTextForId(prepared, insert.beforeHeadingId);

    prepared = prepared.replace(
      new RegExp(`\\n## ${escapeRegExp(targetHeading)}\\n`),
      `\n%%MEDIA:${insert.filename}%%\n\n## ${targetHeading}\n`
    );
  }

  return prepared;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function headingTextForId(markdown, id) {
  for (const match of markdown.matchAll(/^##\s+(.+)$/gm)) {
    if (slugify(match[1]) === id) {
      return match[1];
    }
  }

  throw new Error(`Could not find heading for media insert target: ${id}`);
}

function configureMarkdown(manifest) {
  const imageAltByFilename = new Map(
    (manifest.images ?? []).map((image) => [image.filename, image.alt])
  );

  const md = new MarkdownIt({
    html: false,
    linkify: false,
    typographer: false,
  }).use(footnote);

  md.renderer.rules.footnote_caption = (tokens, idx) => {
    return Number(tokens[idx].meta.id + 1).toString();
  };

  md.renderer.rules.fence = (tokens, idx) => {
    const token = tokens[idx];
    const info = token.info.trim();
    const lang = info.split(/\s+/)[0] || 'text';
    const highlighted =
      lang && hljs.getLanguage(lang)
        ? hljs.highlight(token.content, {
            language: lang,
            ignoreIllegals: true,
          }).value
        : md.utils.escapeHtml(token.content);

    return `<div class="highlight"><pre><code class="hljs language-${escapeHtml(
      lang
    )}">${highlighted}</code></pre></div>\n`;
  };

  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const src = token.attrGet('src');

    if (src?.startsWith(mediaBaseUrl)) {
      const filename = filenameFromUrl(src);
      token.attrSet('src', mediaUrl(filename));

      if (imageAltByFilename.has(filename)) {
        token.attrSet('alt', imageAltByFilename.get(filename));
      }
    }

    if (!token.attrGet('alt')) {
      token.attrSet('alt', '');
    }

    return self.renderToken(tokens, idx, options);
  };

  return md;
}

function applyHeadingIds(tokens) {
  const headings = [];
  const seen = new Map();

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];

    if (token.type !== 'heading_open') {
      continue;
    }

    const inline = tokens[index + 1];
    const text = inline?.content ?? '';
    const baseId = slugify(text);
    const count = seen.get(baseId) ?? 0;
    const id = count === 0 ? baseId : `${baseId}-${count + 1}`;

    seen.set(baseId, count + 1);
    token.attrSet('id', id);
    headings.push({
      id,
      level: Number(token.tag.slice(1)),
      text,
    });
  }

  return headings;
}

function tocLabel(heading) {
  return heading.level === 2 && heading.text.includes(':')
    ? heading.text.split(':')[0]
    : heading.text;
}

function buildToc(headings, manifest, sourceMarkdown) {
  const sections = headings.filter((heading) => heading.level === 2);
  const subsectionsByParent = new Map();
  let currentParent = null;

  for (const heading of headings) {
    if (heading.level === 2) {
      currentParent = heading.id;
      subsectionsByParent.set(currentParent, []);
    } else if (heading.level === 3 && currentParent) {
      subsectionsByParent.get(currentParent).push(heading);
    }
  }

  const sectionHtml = sections
    .map((section, index) => {
      const sublinks = (subsectionsByParent.get(section.id) ?? [])
        .map(
          (subsection) =>
            `<a href="#${escapeHtml(subsection.id)}">${escapeHtml(
              tocLabel(subsection)
            )}</a>`
        )
        .join('\n');
      const subs = sublinks ? `<div class="toc-subs">${sublinks}</div>` : '';

      return `<div class="toc-section">
  <a href="#${escapeHtml(section.id)}"><span class="toc-num">${index}</span>${escapeHtml(
    tocLabel(section)
  )}</a>
  ${subs}
</div>`;
    })
    .join('\n');

  return `<div class="toc">
  <div class="toc-main">
    <h2 id="index">Index</h2>
    <div class="toc-sections">
      ${sectionHtml}
    </div>
  </div>
  <div class="toc-meta">
    <div><strong>Reading time</strong><br />${escapeHtml(
      readingMeta(sourceMarkdown)
    )}</div>
    <div><strong>Last updated</strong><br />${escapeHtml(
      formatDate(manifest.updatedAt)
    )}</div>
    <div><strong>Code</strong><br /><a href="${escapeHtml(
      manifest.codeLink.href
    )}">${escapeHtml(manifest.codeLink.label)}</a></div>
  </div>
</div>`;
}

function mediaHtml(insert) {
  return `<figure class="media-figure video-figure">
  <video autoplay controls loop muted playsinline preload="auto" aria-label="${escapeHtml(
    insert.ariaLabel
  )}">
    <source src="${escapeHtml(mediaUrl(insert.filename))}" type="video/mp4" />
  </video>
  <figcaption><em>${insert.captionHtml}</em></figcaption>
</figure>`;
}

function postprocessHtml(html, tocHtml, manifest) {
  let output = html
    .replace('<p>%%GENERATED_TOC%%</p>', tocHtml)
    .replace(
      /<p>\s*(<img\b[^>]*>)\s*\n<em>([\s\S]*?)<\/em>\s*<\/p>/g,
      '<figure class="media-figure">$1<figcaption><em>$2</em></figcaption></figure>'
    )
    .replace(
      /<p>\s*(<img\b[^>]*>)\s*<\/p>\s*<p>\s*<em>([\s\S]*?)<\/em>\s*<\/p>/g,
      '<figure class="media-figure">$1<figcaption><em>$2</em></figcaption></figure>'
    )
    .replace(/<hr>\s*<hr class="footnotes-sep">/g, '<hr class="footnotes-sep">')
    .replace(/<table>/g, '<div class="table-wrap"><table>')
    .replace(/<\/table>/g, '</table></div>');

  for (const insert of manifest.videoInserts ?? []) {
    output = output.replace(
      `<p>%%MEDIA:${escapeHtml(insert.filename)}%%</p>`,
      mediaHtml(insert)
    );
  }

  return output;
}

function pageHtml(manifest, articleHtml) {
  const description = escapeHtml(manifest.description);
  const title = escapeHtml(manifest.title);
  const canonical = `${siteUrl}/${manifest.slug}/`;
  const socialImage = manifest.socialImage
    ? `<meta property="og:image" content="${escapeHtml(manifest.socialImage)}" />
    <meta property="twitter:image" content="${escapeHtml(
      manifest.socialImage
    )}" />`
    : '';
  const schemaImage = manifest.socialImage
    ? `,
        "image": "${escapeHtml(manifest.socialImage)}"`
    : '';

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=5"
    />

    <title>${title} | APM Overflow</title>
    <link rel="canonical" href="${canonical}" />

    <!-- Primary Meta Tags -->
    <meta name="title" content="${title}" />
    <meta name="description" content="${description}" />

    <!-- Open Graph / Facebook -->
    <meta property="og:site_name" content="APM Overflow" />
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
      {
        "@context": "http://schema.org",
        "@type": "article",
        "name": "${title}",
        "headline": "${title}",
        "url": "${canonical}",
        "description": "${description}",
        "datePublished": "${toFeedDate(manifest.publishedAt)}",
        "dateModified": "${toFeedDate(manifest.updatedAt)}"${schemaImage}
      }
    </script>

    <link
      rel="alternate"
      type="application/atom+xml"
      href="/feed/"
      title="APM Overflow"
    />
    <link
      rel="alternate"
      type="application/rss+xml"
      href="/feed/rss.xml"
      title="APM Overflow"
    />

    <link rel="icon" href="/static/favicon.svg" />
    <link rel="apple-touch-icon" href="/static/favicon.svg" />
    <link rel="stylesheet" href="/static/styles.css" />
    <link rel="stylesheet" href="/static/highlight.css" />
  </head>

  <body class="post">
    <header>
      <a class="title" href="/">
        <h1>APM Overflow</h1>
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

      ${articleHtml}
    </main>

    <footer></footer>
  </body>
</html>
`.replace(/[ \t]+$/gm, '');
}

async function buildPost(manifestPath) {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const sourceMarkdown = await readFile(
    path.join(contentRoot, manifest.source),
    'utf8'
  );
  const prepared = prepareMarkdown(sourceMarkdown, manifest);
  const md = configureMarkdown(manifest);
  const env = {};
  const tokens = md.parse(prepared, env);
  const headings = applyHeadingIds(tokens);
  const tocHeadings = headings.filter((heading) => heading.text !== 'Index');
  const rendered = md.renderer.render(tokens, md.options, env);
  const tocHtml = buildToc(tocHeadings, manifest, sourceMarkdown);
  const articleHtml = postprocessHtml(rendered, tocHtml, manifest);

  await mkdir(path.join(root, manifest.slug), { recursive: true });
  await writeFile(
    path.join(root, manifest.slug, 'index.html'),
    pageHtml(manifest, articleHtml)
  );

  return manifest;
}

async function updateBlogIndex(manifests) {
  const blogPath = path.join(root, 'blog', 'index.html');
  let html = await readFile(blogPath, 'utf8');

  for (const manifest of manifests) {
    const itemPattern = new RegExp(
      `<li>[\\s\\S]*?<a href="/${manifest.slug}/"[\\s\\S]*?</li>`
    );
    const replacement = `<li>
          <span
            ><i><time datetime="${datetime(manifest.publishedAt)}">${formatDate(
              manifest.publishedAt
            )}</time></i></span
          >
          <a href="/${manifest.slug}/">${escapeHtml(manifest.title)}</a>
        </li>`;

    if (!itemPattern.test(html)) {
      throw new Error(`Could not find blog index item for ${manifest.slug}`);
    }

    html = html.replace(itemPattern, replacement);
  }

  await writeFile(blogPath, html);
}

const manifestFiles = (await readdir(contentRoot))
  .filter((file) => file.endsWith('.json'))
  .sort();
const manifests = [];

for (const file of manifestFiles) {
  manifests.push(await buildPost(path.join(contentRoot, file)));
}

await updateBlogIndex(manifests);
