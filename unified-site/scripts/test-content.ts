import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { externalWriting } from '../data/external-writing';
import { buildAtomFeed } from '../lib/blog/feed';
import {
  contentRoot,
  getAllPosts,
  getListedPosts,
  postHref,
} from '../lib/blog/posts';

function assertDescendingDates(
  posts: Awaited<ReturnType<typeof getListedPosts>>
) {
  for (let index = 1; index < posts.length; index += 1) {
    const previous = new Date(posts[index - 1].manifest.publishedAt).getTime();
    const current = new Date(posts[index].manifest.publishedAt).getTime();

    assert.ok(
      previous >= current,
      `${posts[index - 1].manifest.slug} should not sort before ${posts[index].manifest.slug}`
    );
  }
}

function assertRenderedExternalLinks(postSlug: string, html: string) {
  const externalAnchors = Array.from(
    html.matchAll(/<a\b(?=[^>]*href="https?:\/\/)([^>]*)>/g)
  );

  for (const [, attrs] of externalAnchors) {
    assert.match(
      attrs,
      /target="_blank"/,
      `${postSlug} external link is missing target="_blank"`
    );
    assert.match(
      attrs,
      /rel="[^"]*\bexternal\b[^"]*"/,
      `${postSlug} external link is missing rel external`
    );
    assert.match(
      attrs,
      /class="[^"]*\bexternal-link\b[^"]*"/,
      `${postSlug} external link is missing external-link class`
    );
    for (const className of [
      'royb-link',
      'royb-link-highlight',
      'section-color-b',
    ]) {
      assert.match(
        attrs,
        new RegExp(`class="[^"]*\\b${className}\\b[^"]*"`),
        `${postSlug} external link is missing ${className} class`
      );
    }
  }
}

function assertImagesHaveAlt(postSlug: string, html: string) {
  const images = Array.from(html.matchAll(/<img\b([^>]*)>/g));

  for (const [, attrs] of images) {
    assert.match(
      attrs,
      /\balt="[^"]+"/,
      `${postSlug} rendered image is missing alt text`
    );
  }
}

function countMatches(value: string, pattern: RegExp) {
  return Array.from(value.matchAll(pattern)).length;
}

function assertArticlePrimitiveNormalization(postSlug: string, html: string) {
  assert.doesNotMatch(
    html,
    /<div class="table-pair">/,
    `${postSlug} should normalize legacy table-pair wrappers`
  );
  assert.doesNotMatch(
    html,
    /<div class="highlight">\s*<pre>/,
    `${postSlug} should normalize legacy highlight code blocks`
  );
  assert.doesNotMatch(
    html,
    /<p>\s*<img\b/,
    `${postSlug} should wrap images in article media figures`
  );
  assert.doesNotMatch(
    html,
    /<hr>\s*<section class="footnotes">/,
    `${postSlug} should use the dashed footnotes separator`
  );

  const ids = Array.from(html.matchAll(/\bid="([^"]+)"/g)).map(([, id]) => id);

  assert.equal(
    new Set(ids).size,
    ids.length,
    `${postSlug} should not render duplicate HTML ids`
  );
}

async function main() {
  const manifestFiles = (await readdir(contentRoot)).filter((file) =>
    file.endsWith('.json')
  );
  const posts = await getAllPosts();
  const listedPosts = await getListedPosts();

  assert.equal(
    posts.length,
    manifestFiles.length,
    'every APM Overflow manifest should load'
  );
  assert.ok(listedPosts.length > 0, 'at least one listed post should load');
  assertDescendingDates(listedPosts);
  assert.deepEqual(externalWriting, [
    {
      title: 'Finding the Right Answer Was Never the Point',
      href: 'https://www.dukechronicle.com/article/daf941cd-e431-4e71-a282-5f7da9a56c28',
      meta: '894 words, 4 min',
      date: 'Nov 2024',
    },
  ]);

  for (const post of posts) {
    assert.ok(post.manifest.title, `${post.manifest.slug} needs a title`);
    assert.ok(
      post.manifest.description,
      `${post.manifest.slug} needs description`
    );
    assert.ok(post.summary, `${post.manifest.slug} needs a public summary`);
    assert.ok(
      post.summary.length <= 96,
      `${post.manifest.slug} summary should stay concise`
    );
    assert.ok(
      post.html.includes('<p') || post.html.includes('<h'),
      `${post.manifest.slug} should render article content`
    );
    assert.ok(
      post.readingMeta.includes('min'),
      `${post.manifest.slug} needs reading meta`
    );
    assert.doesNotMatch(
      post.readingMeta,
      /~/,
      `${post.manifest.slug} reading metadata should not use approximation markers`
    );
    assert.equal(
      postHref(post),
      `/blog/${post.manifest.slug}`,
      `${post.manifest.slug} should generate the expected route`
    );

    const sourcePath = path.join(contentRoot, post.manifest.source);
    assert.ok(
      sourcePath.endsWith('.md'),
      `${post.manifest.slug} source should be markdown`
    );
    assertImagesHaveAlt(post.manifest.slug, post.html);
    assertRenderedExternalLinks(post.manifest.slug, post.html);
    assertArticlePrimitiveNormalization(post.manifest.slug, post.html);

    if (post.manifest.slug === 'on-agent-memory-fidelity') {
      assert.match(post.html, /class="article-toc"/);
      assert.match(post.html, /<span>time<\/span>/);
      assert.doesNotMatch(post.html, /Reading time/);
      assert.match(post.html, /last updated/);
      assert.match(post.html, /github/);
      assert.doesNotMatch(post.html, /<span>Time<\/span>/);
      assert.doesNotMatch(post.html, /GitHub/);
      assert.match(post.html, /class="toc-subs"/);
      assert.match(
        post.html,
        /RGB-agent\.<sup class="footnote-ref">/,
        'sentence-end footnote refs should move after punctuation'
      );
      assert.match(
        post.html,
        /<code>fidelity<\/code><sup class="footnote-ref">[\s\S]*?<\/sup> settings/,
        'mid-sentence footnote refs should stay attached to the word'
      );
      assert.match(
        post.html,
        /<ol>\s*<li><code>Topic<\/code>:/,
        'control layer markdown should render as a real ordered list'
      );
      assert.match(post.html, /class="article-media"/);
      assert.match(post.html, /<figcaption><em>/);
      assert.doesNotMatch(post.html, /data-prototype=/);
      assert.doesNotMatch(post.html, /prototype-card/);
      assert.doesNotMatch(post.html, />prototyping<\/span>/);
      assert.doesNotMatch(post.html, /prototype-row/);
      assert.doesNotMatch(post.html, /prototype-tag/);
      assert.match(post.html, /<figure class="article-table/);
      assert.match(post.html, /<div class="table-wrap">/);
      assert.match(post.html, /<table>/);
      assert.doesNotMatch(
        post.html,
        /<figure class="article-table[\s\S]*?<figcaption>/,
        'past blog tables should not get synthetic captions'
      );
      assert.match(
        post.html,
        /class="article-code-block article-code-block-blue highlight" data-code-theme="blue"/,
        'code blocks should render through the default blue code-block primitive'
      );
      assert.match(post.html, /class="hljs-keyword"/);
      assert.match(
        post.html,
        /<video autoplay controls loop muted playsinline preload="auto"/
      );
    }

    if (post.manifest.slug === 'on-dimensions-of-taste') {
      assert.doesNotMatch(
        post.html,
        /<p><em>HDBSCAN<\/em> assumes/,
        'Harmonia should avoid starting consecutive paragraphs with HDBSCAN'
      );
      assert.match(
        post.html,
        /<p>It assumes clusters are/,
        'Harmonia HDBSCAN follow-up paragraph should start with a pronoun'
      );
      assert.match(
        post.html,
        /<ul>\s*<li>\s*<p><strong><code class="mellow-hopecore">Mellow-Hopecore<\/code>/,
        'Harmonia mellow subclusters should render as bullet points'
      );
      assert.equal(
        countMatches(post.html, /class="article-media iframe-figure"/g),
        13,
        'Harmonia should render each iframe as a separate media figure'
      );
      assert.equal(
        countMatches(post.html, /class="article-media iframe-figure"/g),
        countMatches(post.html, /<iframe\b/g),
        'Harmonia should not leave bare iframe elements outside article media figures'
      );
      assert.equal(
        countMatches(post.html, /class="article-table-pair"/g),
        2,
        'Harmonia table pairs should normalize to shared article table pairs'
      );
      assert.match(
        post.html,
        /<figure class="article-media iframe-figure"><iframe src="https:\/\/islamtayeb\.github\.io\/harmonia\/export\/visualizations\/genre\/genre_family_pie\/index\.html"[^>]*data-harmonia-iframe="true"[^>]*allowtransparency="true"[^>]*><\/iframe><\/figure>/,
        'bare Harmonia iframes should become figure-wrapped media'
      );
      assert.match(
        post.html,
        /<figure class="article-media iframe-figure"><iframe width="100%" height="600px" src="https:\/\/islamtayeb\.github\.io\/harmonia\/export\/visualizations\/temporal\/genre_trends_proportion\/index\.html"[^>]*data-harmonia-iframe="true"[^>]*allowtransparency="true"[^>]*><\/iframe><figcaption><em>Genre trends by quarter<\/em><\/figcaption><\/figure>/,
        'captioned Harmonia iframes should keep their own captioned figures'
      );
      assert.match(
        post.html,
        /class="article-code-block article-code-block-blue highlight"/,
        'Harmonia code blocks should use the shared code block primitive'
      );
    }

    if (post.manifest.slug === 'on-using-computers') {
      assert.equal(
        countMatches(post.html, /class="article-details"/g),
        13,
        'Using Computers tool notes should normalize to article details'
      );
      assert.match(
        post.html,
        /<hr class="footnotes-sep"><section class="footnotes">/,
        'Using Computers should use dashed footnote separator'
      );
    }
  }

  const feed = await buildAtomFeed();
  assert.match(feed, /<feed xmlns="http:\/\/www\.w3\.org\/2005\/Atom">/);
  assert.match(feed, /<entry>/);
  assert.match(
    feed,
    new RegExp(
      `<title>${listedPosts[0].manifest.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</title>`
    )
  );
  assert.doesNotMatch(feed, /Finding the Right Answer Was Never the Point/);
  assert.doesNotMatch(feed, /dukechronicle\.com/);

  console.log(
    `content ok: ${posts.length} posts loaded, ${listedPosts.length} listed, feed generated`
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
