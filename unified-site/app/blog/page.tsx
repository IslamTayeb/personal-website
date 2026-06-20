import type { Metadata } from 'next';
import { SparkleGlyph } from '@/components/primitives/glyphs';
import { RoybBand } from '@/components/primitives/royb-band';
import { BorderedPanel, Section } from '@/components/primitives/section';
import { ExternalLink } from '@/components/primitives/external-link';
import { getListedPosts, postHref } from '@/lib/blog/posts';
import { formatDate } from '@/lib/blog/date';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'APM Overflow writing inside islamtayeb.dev.',
};

export default async function BlogIndexPage() {
  const posts = await getListedPosts();

  return (
    <>
      <header className="flex flex-col gap-3.5 py-7 md:py-8">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <SparkleGlyph size={12} /> Blog
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            {posts.length} posts
          </span>
        </div>
        <RoybBand />
        <h1 className="max-w-2xl text-xl font-semibold leading-snug tracking-tight text-foreground text-balance md:text-2xl">
          APM Overflow, folded into the same document system.
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-foreground/80 text-pretty">
          Agent systems, taste, tooling, benchmarks, and small infrastructure
          notes. Same source Markdown; new surface.
        </p>
      </header>
      <Section
        id="posts"
        index="0"
        title="Index"
        accent="text-roy-b"
        note="Listed posts from apmoverflow/content/posts, sorted newest first."
      >
        <BorderedPanel>
          <ol className="divide-y divide-border">
            {posts.map((post, index) => (
              <li
                key={post.manifest.slug}
                className="grid gap-2 py-2.5 first:pt-0 last:pb-0 md:grid-cols-[7.5rem_1fr]"
              >
                <time
                  dateTime={post.manifest.publishedAt}
                  className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
                >
                  {formatDate(post.manifest.publishedAt)}
                </time>
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <ExternalLink
                      href={postHref(post)}
                      section="b"
                      className="min-w-0 text-sm font-medium leading-tight text-foreground"
                    >
                      {post.manifest.title}
                    </ExternalLink>
                    {index === 0 ? (
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-roy-b">
                        New
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs leading-snug text-muted-foreground text-pretty">
                    {post.manifest.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </BorderedPanel>
      </Section>
    </>
  );
}
