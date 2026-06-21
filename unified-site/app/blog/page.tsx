import type { Metadata } from 'next';
import { RoybBand } from '@/components/primitives/royb-band';
import { BorderedPanel, Section } from '@/components/primitives/section';
import { ExternalLink } from '@/components/primitives/external-link';
import { RailItem, RailList } from '@/components/primitives/rail';
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
      <header data-testid="blog-index-header">
        <RoybBand />
      </header>
      <Section
        id="posts"
        index="0"
        title={`Index (${posts.length})`}
        accent="text-roy-b"
        className="pt-0 md:pt-0"
      >
        <BorderedPanel>
          <RailList testId="blog-index-rail">
            {posts.map((post, index) => (
              <RailItem
                key={post.manifest.slug}
                dotClassName="bg-foreground/75"
                title={
                  <div className="flex min-w-0 items-baseline gap-2">
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
                }
                meta={formatDate(post.manifest.publishedAt)}
                footer={
                  <div
                    data-testid="blog-index-row-meta"
                    className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
                  >
                    <span>{post.readingMeta}</span>
                  </div>
                }
                connector={index < posts.length - 1 ? 'solid' : 'none'}
              />
            ))}
          </RailList>
        </BorderedPanel>
      </Section>
    </>
  );
}
