import TurndownService from 'turndown';
import { access, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { paths } from '../site.config.mjs';
import { decodeHtmlEntities, getMatch, stripTags } from '../utils/html.mjs';

function hasFlag(args, flag) {
  return args.includes(flag);
}

function optionValue(args, option) {
  const index = args.indexOf(option);

  return index >= 0 ? args[index + 1] : null;
}

function htmlAttribute(value, attribute) {
  const match = value.match(
    new RegExp(`${attribute}=(?:"([^"]*)"|'([^']*)')`, 'i')
  );

  return match?.[1] ?? match?.[2] ?? null;
}

function metaContent(html, name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = html.match(
    new RegExp(
      `<meta\\b(?=[^>]*(?:name|property)=["']${escapedName}["'])[^>]*>`,
      'i'
    )
  );

  return match
    ? decodeHtmlEntities(htmlAttribute(match[0], 'content') ?? '')
    : '';
}

function innerMain(html) {
  return getMatch(html, /<main>([\s\S]*?)<\/main>/, 'main content');
}

function firstTitle(mainHtml) {
  return stripTags(getMatch(mainHtml, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i, 'title'));
}

function firstPublishedAt(mainHtml) {
  return getMatch(
    mainHtml,
    /<time\b[^>]*datetime=["']([^"']+)["'][^>]*>/i,
    'published date'
  );
}

function codeLinkFromToc(mainHtml) {
  const match = mainHtml.match(
    /<div>\s*<strong>\s*Code\s*<\/strong>\s*<br\s*\/?>\s*<a\b([^>]*)>([^<]*)<\/a>\s*<\/div>/i
  );

  if (!match) {
    return null;
  }

  const href = htmlAttribute(match[1], 'href');

  if (!href) {
    return null;
  }

  return {
    label: stripTags(match[2]),
    href,
  };
}

function stripGeneratedShell(mainHtml) {
  return mainHtml
    .replace(/^\s*<h1\b[^>]*>[\s\S]*?<\/h1>\s*/i, '')
    .replace(/^\s*<p>\s*<i>\s*<time\b[\s\S]*?<\/time>\s*<\/i>\s*<\/p>\s*/i, '')
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(
      /\s*<!-- Your article content goes here \(plain HTML\) -->\s*/g,
      ''
    )
    .trim();
}

function hasRawHtml(markdown) {
  return /<\/?[a-z][\s\S]*?>/i.test(markdown);
}

function configureTurndown() {
  const turndown = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    emDelimiter: '*',
    strongDelimiter: '**',
    bulletListMarker: '-',
  });

  turndown.keep([
    'div',
    'figure',
    'figcaption',
    'iframe',
    'section',
    'source',
    'sup',
    'table',
    'tbody',
    'td',
    'tfoot',
    'th',
    'thead',
    'tr',
    'video',
  ]);

  turndown.addRule('preWithoutCode', {
    filter: (node) =>
      node.nodeName === 'PRE' &&
      !Array.from(node.childNodes).some((child) => child.nodeName === 'CODE'),
    replacement: (content, node) => {
      const text = node.textContent.replace(/\n+$/, '');

      return `\n\n\`\`\`\n${text}\n\`\`\`\n\n`;
    },
  });

  return turndown;
}

async function existingSourceSlugs() {
  const files = await readdir(paths.contentRoot);

  return new Set(
    files
      .filter((file) => file.endsWith('.json'))
      .map((file) => file.replace(/\.json$/, ''))
  );
}

async function listedSlugs() {
  const html = await readFile(paths.blogIndex, 'utf8');

  return new Set(
    [...html.matchAll(/<a\b[^>]*href="\/([^/]+)\/"/g)].map((match) => match[1])
  );
}

async function postSlugs() {
  const entries = await readdir(paths.root, { withFileTypes: true });
  const candidates = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter(
      (slug) =>
        !slug.startsWith('.') &&
        ![
          'blog',
          'content',
          'feed',
          'node_modules',
          'scripts',
          'src',
          'static',
        ].includes(slug)
    )
    .sort();
  const slugs = [];

  for (const slug of candidates) {
    try {
      await access(path.join(paths.root, slug, 'index.html'));
      slugs.push(slug);
    } catch {
      // Non-page directories are ignored by the legacy importer.
    }
  }

  return slugs;
}

async function importPost({ slug, force, listed }) {
  const htmlPath = path.join(paths.root, slug, 'index.html');
  const html = await readFile(htmlPath, 'utf8');

  if (!/<body\b[^>]*class=["'][^"']*\bpost\b/i.test(html)) {
    return null;
  }

  const mainHtml = innerMain(html);
  const title = firstTitle(mainHtml);
  const publishedAt = firstPublishedAt(mainHtml);
  const updatedAt =
    html.match(/"dateModified": "([^"]+)"/)?.[1]?.replace('+00:00', 'Z') ??
    publishedAt;
  const description = metaContent(html, 'description');
  const defaultSocialImage = '/static/og-image.png';
  const socialImage = metaContent(html, 'og:image') || defaultSocialImage;
  const articleHtml = stripGeneratedShell(mainHtml);
  const markdown = `${configureTurndown().turndown(articleHtml).trim()}\n`;
  const manifest = {
    slug,
    source: `${slug}.md`,
    title,
    description,
    publishedAt,
    updatedAt,
    listed: listed.has(slug),
    allowHtml: hasRawHtml(markdown),
    wrapTables: !hasRawHtml(markdown),
    codeLink: codeLinkFromToc(mainHtml),
    socialImage,
    images: [],
    videoInserts: [],
  };

  if (!manifest.codeLink) {
    delete manifest.codeLink;
  }

  const markdownPath = path.join(paths.contentRoot, manifest.source);
  const manifestPath = path.join(paths.contentRoot, `${slug}.json`);

  if (!force) {
    const existing = await existingSourceSlugs();

    if (existing.has(slug)) {
      return {
        slug,
        skipped: true,
        reason: 'source already exists',
      };
    }
  }

  await mkdir(paths.contentRoot, { recursive: true });
  await writeFile(markdownPath, markdown);
  await writeFile(`${manifestPath}`, `${JSON.stringify(manifest, null, 2)}\n`);

  return {
    slug,
    skipped: false,
    markdownPath,
    manifestPath,
  };
}

export async function importLegacyHtml(args = process.argv.slice(2)) {
  const force = hasFlag(args, '--force');
  const onlySlug = optionValue(args, '--slug');
  const listed = await listedSlugs();
  const slugs = onlySlug ? [onlySlug] : await postSlugs();
  const results = [];

  for (const slug of slugs) {
    results.push(await importPost({ slug, force, listed }));
  }

  return results.filter(Boolean);
}
