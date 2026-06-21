import type { Metadata } from 'next';
import { RoybBand } from '@/components/primitives/royb-band';
import { BorderedPanel, Section } from '@/components/primitives/section';
import { ExternalLink } from '@/components/primitives/external-link';
import { RailItem, RailList } from '@/components/primitives/rail';
import { externalWriting } from '@/data/external-writing';
import { getListedPosts, isNewPost, postHref } from '@/lib/blog/posts';
import { formatMonthYear } from '@/lib/blog/date';

const technicalPostSlugs = new Set([
  'on-agent-memory-fidelity',
  'on-dimensions-of-taste',
]);
const opinionDotClassName = 'border border-foreground/75 bg-transparent';
const technicalDotClassName = 'bg-foreground/75';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'APM Overflow writing inside islamtayeb.dev.',
};

function BlogIndexLegend() {
  const items = [
    {
      label: 'opinion',
      className: opinionDotClassName,
    },
    {
      label: 'technical',
      className: technicalDotClassName,
    },
  ];

  return (
    <div
      data-testid="blog-index-legend"
      className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
    >
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-1.5">
          <span
            aria-hidden
            data-testid="blog-index-legend-dot"
            className={`h-[var(--rail-marker-size)] w-[var(--rail-marker-size)] shrink-0 ${item.className}`}
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}

export default async function BlogIndexPage() {
  const posts = await getListedPosts();
  const itemCount = posts.length + externalWriting.length;

  return (
    <>
      <header data-testid="blog-index-header">
        <RoybBand />
      </header>
      <Section
        id="posts"
        index="1"
        title={`Index (${itemCount})`}
        accent="text-roy-b"
        headerExtra={<BlogIndexLegend />}
        className="pt-0 md:pt-0"
      >
        <BorderedPanel>
          <RailList testId="blog-index-rail">
            {posts.map((post, index) => {
              const isNew = isNewPost(index);
              const isTechnical = technicalPostSlugs.has(post.manifest.slug);

              return (
                <RailItem
                  key={post.manifest.slug}
                  dotClassName={
                    isTechnical
                      ? isNew
                        ? 'bg-roy-b'
                        : technicalDotClassName
                      : opinionDotClassName
                  }
                  title={
                    <div className="flex min-w-0 items-baseline gap-2">
                      <ExternalLink
                        href={postHref(post)}
                        section="b"
                        className="min-w-0 text-sm font-medium leading-tight text-foreground"
                      >
                        {post.manifest.title}
                      </ExternalLink>
                      {isNew ? (
                        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-roy-b">
                          New
                        </span>
                      ) : null}
                    </div>
                  }
                  meta={formatMonthYear(post.manifest.publishedAt)}
                  footer={
                    <div
                      data-testid="blog-index-row-meta"
                      className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
                    >
                      <span>{post.readingMeta}</span>
                    </div>
                  }
                  connector={
                    index < posts.length - 1 || externalWriting.length > 0
                      ? 'solid'
                      : 'none'
                  }
                />
              );
            })}
            {externalWriting.map((item, index) => (
              <RailItem
                key={item.href}
                testId="external-writing-row"
                dotClassName={opinionDotClassName}
                title={
                  <ExternalLink
                    href={item.href}
                    section="b"
                    data-testid="external-writing-title"
                    className="min-w-0 text-sm font-medium leading-tight text-foreground"
                  >
                    {item.title}
                  </ExternalLink>
                }
                meta={item.date}
                footer={
                  <div
                    data-testid="external-writing-meta"
                    className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
                  >
                    {item.meta}
                  </div>
                }
                connector={
                  index < externalWriting.length - 1 ? 'solid' : 'none'
                }
              />
            ))}
          </RailList>
        </BorderedPanel>
      </Section>
    </>
  );
}
