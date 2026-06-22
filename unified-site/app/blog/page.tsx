import type { Metadata } from 'next';
import { RoybBand } from '@/components/primitives/royb-band';
import { BorderedPanel, Section } from '@/components/primitives/section';
import { ExternalLink } from '@/components/primitives/external-link';
import { RailItem, RailList } from '@/components/primitives/rail';
import { externalWriting } from '@/data/external-writing';
import { getListedPosts, isNewPost, postHref } from '@/lib/blog/posts';
import { formatMonthYear } from '@/lib/blog/date';

const postDotClassName = 'bg-foreground/75';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'APM Overflow writing inside islamtayeb.dev.',
};

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
        className="pt-0 md:pt-0"
      >
        <BorderedPanel>
          <RailList testId="blog-index-rail">
            {posts.map((post, index) => {
              const isNew = isNewPost(index);

              return (
                <RailItem
                  key={post.manifest.slug}
                  dotClassName={isNew ? 'bg-roy-b' : postDotClassName}
                  title={
                    <div className="flex min-w-0 items-baseline gap-2">
                      <ExternalLink
                        href={postHref(post)}
                        section="b"
                        className="min-w-0 text-base font-medium leading-tight text-foreground"
                      >
                        {post.manifest.title}
                      </ExternalLink>
                      {isNew ? (
                        <span className="font-mono text-sm uppercase tracking-[0.12em] text-roy-b">
                          New
                        </span>
                      ) : null}
                    </div>
                  }
                  meta={formatMonthYear(post.manifest.publishedAt)}
                  footer={
                    <div
                      data-testid="blog-index-row-meta"
                      className="reading-copy flex flex-wrap gap-x-3 gap-y-1 text-sm leading-snug text-foreground"
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
                dotClassName={postDotClassName}
                title={
                  <ExternalLink
                    href={item.href}
                    section="b"
                    data-testid="external-writing-title"
                    className="min-w-0 text-base font-medium leading-tight text-foreground"
                  >
                    {item.title}
                  </ExternalLink>
                }
                meta={item.date}
                footer={
                  <div
                    data-testid="external-writing-meta"
                    className="reading-copy text-sm leading-snug text-foreground"
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
