import { contactLinks, heroParagraphs, type TextSegment } from '@/lib/lab-data';
import { Section, Variant } from './frame';
import { LabExternalLink } from './links';

function HeroContactIndex() {
  return (
    <div className="flex flex-col gap-3 font-mono text-[11px]">
      <div className="flex flex-col gap-1">
        <span className="text-muted-foreground">contact</span>
        <ul className="flex flex-wrap text-foreground">
          {contactLinks.map((link, index) => (
            <li key={link.label}>
              <LabExternalLink
                href={link.href}
                external={link.external ?? true}
                className="text-foreground"
              >
                {link.text}
              </LabExternalLink>
              {index < contactLinks.length - 1 ? (
                <span className="mr-1">, </span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
      <div className="grid grid-cols-[3.4rem_1fr] gap-2">
        <span className="text-muted-foreground">loc</span>
        <span className="text-foreground">Durham, NC</span>
      </div>
    </div>
  );
}

function HeroSegment({ segment }: { segment: TextSegment }) {
  if (!segment.href) {
    return segment.text;
  }

  return (
    <LabExternalLink href={segment.href} external={segment.external ?? true}>
      {segment.text}
    </LabExternalLink>
  );
}

function HeroStory() {
  return (
    <div className="order-1 flex flex-col gap-2 text-sm leading-snug text-foreground text-pretty md:order-2">
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

export function HeroSection() {
  return (
    <Section
      index="1"
      title="Hero — apmoverflow index voice"
      accent="text-roy-o"
      cols={1}
      note="Selected direction: compact current-site copy without inline badges. The left rail is now a contact/link index, closer to the APM Overflow blog index than a metadata card."
    >
      <Variant label="Selected — compact hero, stacks on phone" tag="final">
        <div className="flex w-full flex-col gap-3">
          <h3 className="font-sans text-2xl font-semibold tracking-tight text-foreground">
            (Islam M)
            <sup className="text-sm font-bold leading-none tracking-normal">
              2
            </sup>{' '}
            Tayeb
          </h3>
          <div className="flex flex-col gap-4 md:grid md:grid-cols-[10.5rem_1fr] md:gap-5">
            <HeroStory />
            <div className="order-2 h-full md:order-1 md:border-r md:border-border md:pr-5">
              <HeroContactIndex />
            </div>
          </div>
        </div>
      </Variant>
    </Section>
  );
}
