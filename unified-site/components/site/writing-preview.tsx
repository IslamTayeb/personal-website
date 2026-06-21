import { getListedPosts, postHref } from '@/lib/blog/posts';
import { formatDate } from '@/lib/blog/date';
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
            {posts.map((post, index) => (
              <RailItem
                key={post.manifest.slug}
                dotClassName="bg-foreground/75"
                title={
                  <ExternalLink
                    href={postHref(post)}
                    section="b"
                    className="text-foreground"
                  >
                    {post.manifest.title}
                  </ExternalLink>
                }
                meta={formatDate(post.manifest.publishedAt)}
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
            ))}
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
