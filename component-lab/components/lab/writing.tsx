import { Section, Variant } from './frame';

type Post = {
  date: string;
  title: string;
  href: string;
  isNew?: boolean;
  desc?: string;
};

const POSTS: Post[] = [
  {
    date: 'Jun 07, 2026',
    title: 'On Agent Memory Fidelity (Decant)',
    href: 'https://apmoverflow.xyz/on-agent-memory-fidelity/',
    isNew: true,
    desc: 'How agents lose the plot over long horizons, and what faithful memory recall actually costs.',
  },
  {
    date: 'Mar 18, 2026',
    title: 'On Fingerspitzengefühl',
    href: 'https://apmoverflow.xyz/on-fingerspitzengefuhl/',
    desc: 'The fingertip-feel of good taste — why some calls are felt before they can be explained.',
  },
  {
    date: 'Jan 02, 2026',
    title: 'On Dimensions of Taste (Harmonia)',
    href: 'https://apmoverflow.xyz/on-dimensions-of-taste/',
    desc: '',
  },
];

function WritingRail() {
  return (
    <ul className="flex w-full flex-col">
      {POSTS.map((post, index) => {
        const hasDesc = Boolean(post.desc?.trim());
        return (
          <li key={post.title} className="relative flex gap-4 pb-7 last:pb-0">
            {index < POSTS.length - 1 ? (
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
                <p className="max-w-sm text-xs leading-relaxed text-muted-foreground text-pretty">
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
      index="05"
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
