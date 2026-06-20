import type { ReactNode } from 'react';
import { linkHoverOptions, type LinkVariant } from '@/lib/lab-data';
import { Section, Variant } from './frame';

const roybCharClasses = [
  'royb-char-r',
  'royb-char-o',
  'royb-char-y',
  'royb-char-b',
];

function RoybLetters({ children }: { children: ReactNode }) {
  if (typeof children !== 'string') {
    return children;
  }

  let colorIndex = 0;

  return Array.from(children).map((char, index) => {
    const isSpace = /\s/.test(char);
    const colorClass = isSpace
      ? ''
      : roybCharClasses[colorIndex++ % roybCharClasses.length];

    return (
      <span key={`${char}-${index}`} className={`royb-char ${colorClass}`}>
        {isSpace ? '\u00a0' : char}
      </span>
    );
  });
}

export function LabExternalLink({
  href,
  children,
  variant = 'highlight',
  className = '',
  external = true,
}: {
  href: string;
  children: ReactNode;
  variant?: LinkVariant;
  className?: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer external' : undefined}
      className={`royb-link royb-link-${variant} ${className}`}
    >
      {variant === 'highlight-royb' ? (
        <RoybLetters>{children}</RoybLetters>
      ) : (
        children
      )}
    </a>
  );
}

function LinkSentence({ variant }: { variant: LinkVariant }) {
  return (
    <p className="section-color-b text-sm leading-snug text-foreground text-pretty">
      Love reading about{' '}
      <LabExternalLink
        href="https://www.wired.com/2015/09/whatsapp-serves-900-million-users-50-engineers/"
        variant={variant}
      >
        cool
      </LabExternalLink>{' '}
      <LabExternalLink
        href="https://www.notion.com/blog/building-and-scaling-notions-data-lake"
        variant={variant}
      >
        infra
      </LabExternalLink>{' '}
      <LabExternalLink
        href="https://corecursive.com/066-sqlite-with-richard-hipp/"
        variant={variant}
      >
        stories
      </LabExternalLink>
      , then writing on{' '}
      <LabExternalLink href="https://apmoverflow.xyz/" variant={variant}>
        APM Overflow
      </LabExternalLink>
      .
    </p>
  );
}

export function LinksSection() {
  return (
    <Section
      index="2"
      title="Links — ROYB hover tests"
      accent="text-roy-b"
      cols={1}
      note="Selected direction is the low highlight. The alternates keep the same underlined link grammar, but test blue hover text and ROYB-by-character hover text."
    >
      {linkHoverOptions.map((option) => (
        <Variant key={option.label} label={option.label} tag={option.tag}>
          <div className="flex w-full flex-col gap-3">
            <LinkSentence variant={option.variant} />
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              {option.desc}
            </p>
          </div>
        </Variant>
      ))}
    </Section>
  );
}
