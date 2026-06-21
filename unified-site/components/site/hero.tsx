import { contactLinks } from '@/data/links';
import { heroParagraphs, type TextSegment } from '@/data/profile';
import { ExternalLink } from '@/components/primitives/external-link';
import { SectionHeader } from '@/components/primitives/section';

function ContactIndex() {
  return (
    <div className="flex flex-col gap-2.5 font-mono text-sm leading-snug">
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
    <div className="flex flex-col gap-1.5 text-base leading-snug text-foreground">
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
    <section
      id="about"
      data-testid="hero-section"
      className="pb-3 pt-0 md:pb-3.5 md:pt-0"
    >
      <div className="flex w-full flex-col">
        <SectionHeader index="1" title="About" accent="text-roy-r" />
        <h1
          data-testid="hero-title"
          className="mb-2 w-fit font-sans text-3xl font-semibold tracking-tight text-foreground"
        >
          Islam Tayeb
        </h1>
        <div className="flex flex-col gap-3 md:grid md:grid-cols-[20%_minmax(0,1fr)] md:gap-3">
          <div className="min-w-0 md:border-r md:border-border md:pr-3">
            <ContactIndex />
          </div>
          <HeroStory />
        </div>
      </div>
    </section>
  );
}
