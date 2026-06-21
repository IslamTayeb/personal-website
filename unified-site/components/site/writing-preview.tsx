import { getListedPosts, isNewPost, postHref } from '@/lib/blog/posts';
import { formatMonthYear } from '@/lib/blog/date';
import { ExternalLink } from '@/components/primitives/external-link';
import { RailItem, RailList } from '@/components/primitives/rail';
import { SectionActionLink } from '@/components/primitives/section-action';
import { BorderedPanel, Section } from '@/components/primitives/section';

export async function WritingPreview() {
  const posts = (await getListedPosts()).slice(0, 3);

  return (
    <Section id="writing" index="3" title="Writing" accent="text-roy-b">
      <BorderedPanel>
        <div className="flex w-full flex-col gap-3.5">
          <RailList>
            {posts.map((post, index) => {
              const isNew = isNewPost(index);

              return (
                <RailItem
                  key={post.manifest.slug}
                  dotClassName={isNew ? 'bg-roy-b' : 'bg-foreground/75'}
                  title={
                    <span className="inline-flex min-w-0 items-baseline gap-2">
                      <ExternalLink
                        href={postHref(post)}
                        section="b"
                        className="min-w-0 text-foreground"
                      >
                        {post.manifest.title}
                      </ExternalLink>
                      {isNew ? (
                        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-roy-b">
                          New
                        </span>
                      ) : null}
                    </span>
                  }
                  meta={formatMonthYear(post.manifest.publishedAt)}
                  footer={
                    <div
                      data-testid="writing-row-meta"
                      className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
                    >
                      {post.readingMeta}
                    </div>
                  }
                  connector={index < posts.length - 1 ? 'solid' : 'none'}
                />
              );
            })}
          </RailList>
          <div className="flex justify-end">
            <SectionActionLink href="/blog" section="b">
              See more on blog
            </SectionActionLink>
          </div>
        </div>
      </BorderedPanel>
    </Section>
  );
}
