import { contactLinks } from '@/data/links';
import { heroParagraphs, type TextSegment } from '@/data/profile';
import { ExternalLink } from '@/components/primitives/external-link';

function ContactIndex() {
  return (
    <div className="flex flex-col gap-2.5 font-mono text-xs leading-snug">
      <div className="flex flex-col gap-1">
        <span className="text-muted-foreground">contact</span>
        <ul className="flex flex-wrap text-foreground">
          {contactLinks.map((link, index) => (
            <li key={link.label}>
              <ExternalLink
                href={link.href}
                section="r"
                className="text-foreground"
              >
                {link.label}
              </ExternalLink>
              {index < contactLinks.length - 1 ? (
                <span className="mr-1">, </span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function HeroSegment({ segment }: { segment: TextSegment }) {
  if (!segment.href) {
    return segment.text;
  }

  return (
    <ExternalLink href={segment.href} section="r">
      {segment.text}
    </ExternalLink>
  );
}

function HeroStory() {
  return (
    <div className="flex flex-col gap-1.5 text-sm leading-snug text-foreground">
      {heroParagraphs.map((paragraph, paragraphIndex) => (
        <p key={paragraphIndex}>
          {paragraph.map((segment, segmentIndex) => (
            <HeroSegment
              key={`${paragraphIndex}-${segmentIndex}`}
              segment={segment}
            />
          ))}
        </p>
      ))}
    </div>
  );
}

export function Hero() {
  return (
    <section id="about" data-testid="hero-section" className="py-3 md:py-3.5">
      <div className="flex w-full flex-col gap-2">
        <header className="mb-1 flex items-baseline gap-3">
          <span className="font-mono text-xs text-roy-r">§0</span>
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-foreground">
            About
          </h2>
        </header>
        <h1
          data-testid="hero-title"
          className="w-fit font-sans text-2xl font-semibold tracking-tight text-foreground"
        >
          Islam Tayeb
        </h1>
        <div className="flex flex-col gap-3 md:grid md:grid-cols-[20%_minmax(0,1fr)] md:gap-4">
          <div className="min-w-0 md:border-r md:border-border md:pr-4">
            <ContactIndex />
          </div>
          <HeroStory />
        </div>
      </div>
    </section>
  );
}
