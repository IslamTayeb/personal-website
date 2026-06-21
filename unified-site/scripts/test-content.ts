import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
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

    if (post.manifest.slug === 'on-agent-memory-fidelity') {
      assert.match(post.html, /class="article-toc"/);
      assert.match(post.html, /<span>Time<\/span>/);
      assert.doesNotMatch(post.html, /Reading time/);
      assert.match(post.html, /Last updated/);
      assert.match(post.html, /GitHub/);
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

  console.log(
    `content ok: ${posts.length} posts loaded, ${listedPosts.length} listed, feed generated`
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
