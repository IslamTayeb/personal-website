'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { contactLinks, heroParagraphs, type TextSegment } from '@/lib/lab-data';
import { Section, Variant } from './frame';
import { LabExternalLink } from './links';

function HeroContactIndex() {
  return (
    <div className="flex flex-col gap-3 font-mono text-sm leading-snug">
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
      <div className="flex justify-between gap-4">
        <span className="text-muted-foreground">location</span>
        <span className="text-right text-foreground">Durham, NC</span>
      </div>
      <div className="flex justify-between gap-4">
        <span className="text-muted-foreground">hometown</span>
        <span className="text-right text-foreground">Alexandria, Egypt</span>
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
    <div className="flex flex-col gap-2 text-sm leading-snug text-foreground text-pretty">
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
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [titleWidth, setTitleWidth] = useState<number | null>(null);

  useEffect(() => {
    const title = titleRef.current;
    if (!title) {
      return;
    }

    const updateTitleWidth = () => {
      setTitleWidth(Math.ceil(title.getBoundingClientRect().width));
    };

    updateTitleWidth();

    const resizeObserver = new ResizeObserver(updateTitleWidth);
    resizeObserver.observe(title);

    return () => resizeObserver.disconnect();
  }, []);

  const gridStyle = {
    '--hero-left-width': titleWidth ? `${titleWidth}px` : '14rem',
  } as CSSProperties;

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
          <h3
            ref={titleRef}
            className="w-fit font-sans text-2xl font-semibold tracking-tight text-foreground"
          >
            (Islam M)
            <sup className="ml-0.5 text-sm font-bold leading-none tracking-normal">
              2
            </sup>{' '}
            Tayeb
          </h3>
          <div
            style={gridStyle}
            className="flex flex-col gap-4 md:grid md:grid-cols-[var(--hero-left-width)_minmax(0,1fr)] md:gap-5"
          >
            <div className="min-w-0 md:border-r md:border-border md:pr-5">
              <HeroContactIndex />
            </div>
            <HeroStory />
          </div>
        </div>
      </Variant>
    </Section>
  );
}
