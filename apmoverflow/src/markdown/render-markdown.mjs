import hljs from 'highlight.js';
import MarkdownIt from 'markdown-it';
import footnote from 'markdown-it-footnote';

import { site } from '../site.config.mjs';
import { formatDate } from '../utils/date.mjs';
import { escapeHtml } from '../utils/html.mjs';
import { filenameFromUrl, mediaUrl } from '../utils/media.mjs';
import { slugify } from '../utils/slug.mjs';

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function withoutFootnoteDefinitions(markdown) {
  const index = markdown.search(/^\[\^[^\]]+\]:/m);

  return index >= 0 ? markdown.slice(0, index) : markdown;
}

export function readingMeta(markdown) {
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

function headingTextForId(markdown, id) {
  for (const match of markdown.matchAll(/^##\s+(.+)$/gm)) {
    if (slugify(match[1]) === id) {
      return match[1];
    }
  }

  throw new Error(`Could not find heading for media insert target: ${id}`);
}

function kbdInlineRule(state, silent) {
  const openTag = '<kbd>';
  const closeTag = '</kbd>';

  if (!state.src.startsWith(openTag, state.pos)) {
    return false;
  }

  const contentStart = state.pos + openTag.length;
  const contentEnd = state.src.indexOf(closeTag, contentStart);

  if (contentEnd < 0) {
    return false;
  }

  const content = state.src.slice(contentStart, contentEnd);

  if (content.length === 0 || /[<>]/.test(content)) {
    return false;
  }

  if (!silent) {
    state.push('kbd_open', 'kbd', 1);

    const text = state.push('text', '', 0);
    text.content = content;

    state.push('kbd_close', 'kbd', -1);
  }

  state.pos = contentEnd + closeTag.length;

  return true;
}

function prepareMarkdown(markdown, manifest) {
  let prepared = normalizeFootnoteOrder(markdown);

  for (const image of manifest.images) {
    prepared = prepared.replaceAll(
      `${site.mediaBaseUrl}${image.filename}`,
      mediaUrl(image.filename)
    );
  }

  prepared = prepared.replace(/^## Index[ \t]*$/m, '%%GENERATED_TOC%%');

  for (const insert of manifest.videoInserts) {
    const targetHeading = headingTextForId(prepared, insert.beforeHeadingId);

    prepared = prepared.replace(
      new RegExp(`\\n## ${escapeRegExp(targetHeading)}\\n`),
      `\n%%MEDIA:${insert.filename}%%\n\n## ${targetHeading}\n`
    );
  }

  return prepared;
}

function configureMarkdown(manifest) {
  const imageAltByFilename = new Map(
    manifest.images.map((image) => [image.filename, image.alt])
  );

  const md = new MarkdownIt({
    html: manifest.allowHtml,
    linkify: false,
    typographer: false,
  }).use(footnote);

  md.inline.ruler.before('html_inline', 'kbd', kbdInlineRule);

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

    if (src?.startsWith(site.mediaBaseUrl)) {
      const filename = filenameFromUrl(src);
      token.attrSet('src', mediaUrl(filename));

      if (imageAltByFilename.has(filename)) {
        token.attrSet('alt', imageAltByFilename.get(filename));
      }
    }

    if (!token.attrGet('alt')) {
      token.attrSet('alt', token.content ?? '');
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

  const metaItems = [
    `<div><strong>Reading time</strong><br />${escapeHtml(
      readingMeta(sourceMarkdown)
    )}</div>`,
    `<div><strong>Last updated</strong><br />${escapeHtml(
      formatDate(manifest.updatedAt)
    )}</div>`,
  ];

  if (manifest.codeLink) {
    metaItems.push(
      `<div><strong>Code</strong><br /><a href="${escapeHtml(
        manifest.codeLink.href
      )}">${escapeHtml(manifest.codeLink.label)}</a></div>`
    );
  }

  return `<!-- generated:toc:start -->
<div class="toc">
  <div class="toc-main">
    <h2 id="index">Index</h2>
    <div class="toc-sections">
      ${sectionHtml}
    </div>
  </div>
  <div class="toc-meta">
    ${metaItems.join('\n    ')}
  </div>
</div>
<!-- generated:toc:end -->`;
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
    .replace(
      /<hr>\s*<hr class="footnotes-sep">/g,
      '<hr class="footnotes-sep">'
    );

  if (manifest.wrapTables) {
    output = output
      .replace(/<table>/g, '<div class="table-wrap"><table>')
      .replace(/<\/table>/g, '</table></div>');
  }

  for (const insert of manifest.videoInserts) {
    output = output.replace(
      `<p>%%MEDIA:${escapeHtml(insert.filename)}%%</p>`,
      mediaHtml(insert)
    );
  }

  return output;
}

export function renderMarkdownPost(post) {
  const prepared = prepareMarkdown(post.sourceMarkdown, post.manifest);
  const md = configureMarkdown(post.manifest);
  const env = {};
  const tokens = md.parse(prepared, env);
  const headings = applyHeadingIds(tokens);
  const tocHeadings = headings.filter((heading) => heading.text !== 'Index');
  const rendered = md.renderer.render(tokens, md.options, env);
  const tocHtml = buildToc(tocHeadings, post.manifest, post.sourceMarkdown);
  const articleHtml = postprocessHtml(rendered, tocHtml, post.manifest);

  return {
    ...post,
    articleHtml,
    headings,
    tocHtml,
    readingMeta: readingMeta(post.sourceMarkdown),
  };
}
