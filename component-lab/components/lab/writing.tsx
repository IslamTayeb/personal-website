import { writingPosts } from '@/lib/lab-data';
import { Section, Variant } from './frame';
import { LabExternalLink } from './links';
import { RailItem, RailList } from './rail';

function WritingRail() {
  return (
    <RailList>
      {writingPosts.map((post, index) => {
        const hasDesc = Boolean(post.desc?.trim());
        return (
          <RailItem
            key={post.title}
            dotClassName={post.isNew ? 'bg-roy-b' : 'bg-foreground'}
            title={
              <LabExternalLink
                href={post.href}
                className="section-color-b text-foreground"
              >
                {post.title}
              </LabExternalLink>
            }
            meta={post.date}
            description={hasDesc ? post.desc : undefined}
            connector={index < writingPosts.length - 1 ? 'solid' : 'none'}
          />
        );
      })}
    </RailList>
  );
}

export function WritingSection() {
  return (
    <Section
      index="6"
      title="Writing — continuous rail"
      accent="text-roy-b"
      cols={1}
      note="Selected direction: the APM Overflow index rail stays always-on. If a post description is blank, the row automatically falls back to a plain linked title/date treatment instead of needing a separate C variant."
    >
      <Variant label="Selected — desc-aware rail" tag="final">
        <WritingRail />
      </Variant>
    </Section>
  );
}
