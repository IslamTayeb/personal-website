import { writingPosts } from '@/lib/lab-data';
import { Section, Variant } from './frame';

function WritingRail() {
  return (
    <ul className="flex w-full flex-col">
      {writingPosts.map((post, index) => {
        const hasDesc = Boolean(post.desc?.trim());
        return (
          <li key={post.title} className="relative flex gap-4 pb-7 last:pb-0">
            {index < writingPosts.length - 1 ? (
              <span className="absolute left-[3.5px] top-5 bottom-1 w-px bg-border" />
            ) : null}
            <span
              className={`relative mt-1 h-2 w-2 shrink-0 ${
                post.isNew ? 'bg-roy-b' : 'bg-foreground'
              }`}
            />
            <div className="flex w-full flex-col gap-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <a
                  href={post.href}
                  target="_blank"
                  rel="noreferrer external"
                  className="text-sm text-foreground underline decoration-border decoration-2 underline-offset-4 hover:text-roy-b hover:decoration-roy-b"
                >
                  {post.title}
                </a>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  {post.date}
                </span>
              </div>
              {hasDesc ? (
                <p className="text-xs leading-snug text-muted-foreground text-pretty md:whitespace-nowrap">
                  {post.desc}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
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
