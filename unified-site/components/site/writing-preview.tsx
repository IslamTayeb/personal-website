import { getListedPosts, postHref } from '@/lib/blog/posts';
import { formatDate } from '@/lib/blog/date';
import { ExternalLink } from '@/components/primitives/external-link';
import { RailItem, RailList } from '@/components/primitives/rail';
import { SectionActionLink } from '@/components/primitives/section-action';
import { BorderedPanel, Section } from '@/components/primitives/section';

export async function WritingPreview() {
  const posts = (await getListedPosts()).slice(0, 3);

  return (
    <Section id="writing" index="4" title="Writing" accent="text-roy-b">
      <BorderedPanel>
        <div className="flex w-full flex-col gap-3.5">
          <RailList>
            {posts.map((post, index) => (
              <RailItem
                key={post.manifest.slug}
                dotClassName={index === 0 ? 'bg-roy-b' : 'bg-foreground'}
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
                description={post.summary}
                connector={index < posts.length - 1 ? 'solid' : 'none'}
              />
            ))}
          </RailList>
          <div className="flex justify-end">
            <SectionActionLink href="/blog" section="b">
              Read all posts
            </SectionActionLink>
          </div>
        </div>
      </BorderedPanel>
    </Section>
  );
}
