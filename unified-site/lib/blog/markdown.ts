import hljs from 'highlight.js';
import MarkdownIt from 'markdown-it';
import footnote from 'markdown-it-footnote';
import { escapeHtml, stripTags } from './html';
import { filenameFromUrl, mediaBaseUrl, mediaUrl } from './media';
import { slugify } from './slug';
import { formatDate } from './date';
import type { PostManifest } from './manifest';

export type Heading = {
  id: string;
  level: number;
  text: string;
};

type MarkdownEnv = {
  headings: Heading[];
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function withoutFootnoteDefinitions(markdown: string) {
  const index = markdown.search(/^\[\^[^\]]+\]:/m);

  return index >= 0 ? markdown.slice(0, index) : markdown;
}

export function readingMeta(markdown: string) {
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

function normalizeFootnoteOrder(markdown: string) {
  const firstDefinitionIndex = markdown.search(/^\[\^[^\]]+\]:/m);
  const body =
    firstDefinitionIndex >= 0
      ? markdown.slice(0, firstDefinitionIndex)
      : markdown;
  const orderedIds: string[] = [];

  for (const match of body.matchAll(/\[\^([^\]]+)\]/g)) {
    if (!orderedIds.includes(match[1])) {
      orderedIds.push(match[1]);
    }
  }

  if (orderedIds.length === 0) {
    return markdown;
  }

  const remap = new Map(orderedIds.map((id, index) => [id, String(index + 1)]));

  return markdown.replace(/\[\^([^\]]+)\]/g, (match, id: string) => {
    return `[^${remap.get(id) ?? id}]`;
  });
}

function headingTextForId(markdown: string, id: string) {
  for (const match of markdown.matchAll(/^##\s+(.+)$/gm)) {
    if (slugify(match[1]) === id) {
      return match[1];
    }
  }

  throw new Error(`Could not find heading for media insert target: ${id}`);
}

function prepareMarkdown(markdown: string, manifest: PostManifest) {
  let prepared = normalizeFootnoteOrder(markdown);

  for (const image of manifest.images) {
    prepared = prepared.replaceAll(
      `${mediaBaseUrl}${image.filename}`,
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

function tocLabel(heading: Heading) {
  return heading.level === 2 && heading.text.includes(':')
    ? heading.text.split(':')[0]
    : heading.text;
}

function buildToc(
  headings: Heading[],
  manifest: PostManifest,
  sourceMarkdown: string
) {
  const sections = headings.filter((heading) => heading.level === 2);

  if (sections.length === 0) {
    return '';
  }

  const subsectionsByParent = new Map<string, Heading[]>();
  let currentParent: string | null = null;

  for (const heading of headings) {
    if (heading.level === 2) {
      currentParent = heading.id;
      subsectionsByParent.set(currentParent, []);
    } else if (heading.level === 3 && currentParent) {
      subsectionsByParent.get(currentParent)?.push(heading);
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
        .join('');
      const subs = sublinks ? `<div class="toc-subs">${sublinks}</div>` : '';

      return `<div class="toc-section"><a href="#${escapeHtml(
        section.id
      )}"><span class="toc-num">${index}</span>${escapeHtml(
        tocLabel(section)
      )}</a>${subs}</div>`;
    })
    .join('');

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

  return `<div class="prototype-card" data-prototype="article-index"><span>prototyping</span><span>index variants are in the component lab</span></div><nav class="article-toc" aria-label="Article index"><div class="toc-main"><h2 id="index">Index</h2><div class="toc-sections">${sectionHtml}</div></div><div class="toc-meta">${metaItems.join('')}</div></nav>`;
}

function mediaHtml(manifest: PostManifest, filename: string) {
  const insert = manifest.videoInserts.find(
    (item) => item.filename === filename
  );

  if (!insert) {
    return '';
  }

  return `<figure class="article-media video-figure"><video autoplay controls loop muted playsinline preload="auto" aria-label="${escapeHtml(
    insert.ariaLabel
  )}"><source src="${escapeHtml(
    mediaUrl(insert.filename)
  )}" type="video/mp4" /></video><figcaption><em>${insert.captionHtml}</em></figcaption></figure>`;
}

function normalizeExternalAnchors(html: string) {
  return html.replace(
    /<a\b([^>]*\bhref="https?:\/\/[^"]+"[^>]*)>/g,
    (match, attrs: string) => {
      let nextAttrs = attrs;

      if (!/\btarget=/.test(nextAttrs)) {
        nextAttrs += ' target="_blank"';
      }

      if (/\brel="/.test(nextAttrs)) {
        nextAttrs = nextAttrs.replace(
          /\brel="([^"]*)"/,
          (_, rel: string) =>
            `rel="${Array.from(
              new Set(`${rel} noreferrer external`.split(/\s+/))
            )
              .filter(Boolean)
              .join(' ')}"`
        );
      } else {
        nextAttrs += ' rel="noreferrer external"';
      }

      if (/\bclass="/.test(nextAttrs)) {
        nextAttrs = nextAttrs.replace(
          /\bclass="([^"]*)"/,
          (_, className: string) =>
            className.split(/\s+/).includes('external-link')
              ? `class="${className}"`
              : `class="${className} external-link"`
        );
      } else {
        nextAttrs += ' class="external-link"';
      }

      return `<a${nextAttrs}>`;
    }
  );
}

function configureMarkdown(manifest: PostManifest) {
  const imageAltByFilename = new Map(
    manifest.images.map((image) => [image.filename, image.alt])
  );
  const seenHeadings = new Map<string, number>();

  const md = new MarkdownIt({
    html: manifest.allowHtml,
    linkify: false,
    typographer: false,
  }).use(footnote);

  md.inline.ruler.before('html_inline', 'kbd', (state, silent) => {
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
  });

  md.renderer.rules.footnote_caption = (tokens, idx) => {
    return Number(tokens[idx].meta.id + 1).toString();
  };

  md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
    const inline = tokens[idx + 1];
    const text = inline?.content ?? '';
    const baseId = slugify(stripTags(text));
    const count = seenHeadings.get(baseId) ?? 0;
    const id = count === 0 ? baseId : `${baseId}-${count + 1}`;

    seenHeadings.set(baseId, count + 1);
    tokens[idx].attrSet('id', id);

    if (env && typeof env === 'object' && 'headings' in env) {
      (env as MarkdownEnv).headings.push({
        id,
        level: Number(tokens[idx].tag.slice(1)),
        text,
      });
    }

    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const href = tokens[idx].attrGet('href');

    if (href && /^https?:\/\//.test(href)) {
      tokens[idx].attrSet('target', '_blank');
      tokens[idx].attrSet('rel', 'noreferrer external');
      tokens[idx].attrJoin('class', 'external-link');
    }

    return self.renderToken(tokens, idx, options);
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

    return `<div class="highlight" data-prototype="code"><pre><code class="hljs language-${escapeHtml(
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
        token.attrSet('alt', imageAltByFilename.get(filename) ?? '');
      }
    }

    if (!token.attrGet('alt')) {
      token.attrSet('alt', token.content ?? '');
    }

    return self.renderToken(tokens, idx, options);
  };

  return md;
}

export function renderMarkdown(markdown: string, manifest: PostManifest) {
  const prepared = prepareMarkdown(markdown, manifest);
  const env: MarkdownEnv = { headings: [] };
  const md = configureMarkdown(manifest);
  let html = md.render(prepared, env);
  const toc = buildToc(env.headings, manifest, markdown);

  html = html
    .replace('<p>%%GENERATED_TOC%%</p>', toc)
    .replace(
      /<p>\s*(<img\b[^>]*>)\s*\n<em>([\s\S]*?)<\/em>\s*<\/p>/g,
      '<figure class="article-media">$1<figcaption><em>$2</em></figcaption></figure>'
    )
    .replace(
      /<p>\s*(<img\b[^>]*>)\s*<\/p>\s*<p>\s*<em>([\s\S]*?)<\/em>\s*<\/p>/g,
      '<figure class="article-media">$1<figcaption><em>$2</em></figcaption></figure>'
    )
    .replace(
      /<hr>\s*<hr class="footnotes-sep">/g,
      '<hr class="footnotes-sep">'
    );

  if (manifest.wrapTables) {
    html = html
      .replace(
        /<table>/g,
        '<div class="table-wrap" data-prototype="table"><table>'
      )
      .replace(/<\/table>/g, '</table></div>');
  }

  html = html.replace(
    /<section class="footnotes">/g,
    '<section class="footnotes" data-prototype="references">'
  );

  for (const insert of manifest.videoInserts) {
    html = html.replace(
      `<p>%%MEDIA:${escapeHtml(insert.filename)}%%</p>`,
      mediaHtml(manifest, insert.filename)
    );
  }

  return {
    html: normalizeExternalAnchors(html),
    headings: env.headings,
    readingMeta: readingMeta(markdown),
  };
}
