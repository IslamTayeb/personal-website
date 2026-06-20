'use client';

import { Section } from '@/components/lab/frame';
import { cn } from '@/lib/utils';

type Face = {
  id: string;
  name: string;
  cssVar: string;
  note: string;
  favorite?: boolean;
};

const SANS: Face[] = [
  {
    id: 'geist',
    name: 'Geist',
    cssVar: 'var(--font-geist-sans)',
    note: 'Current baseline. Neutral and modern, but slightly low-contrast — reads light at small sizes.',
  },
  {
    id: 'inter-tight',
    name: 'Inter Tight',
    cssVar: 'var(--font-inter-tight)',
    note: 'Tighter, sturdier workhorse. Heavier on the page and very legible. Safe and strong.',
  },
  {
    id: 'space-grotesk',
    name: 'Space Grotesk',
    cssVar: 'var(--font-space-grotesk)',
    note: 'Geometric with sharp terminals that echo the hard corners. Real personality.',
  },
  {
    id: 'hanken',
    name: 'Hanken Grotesk',
    cssVar: 'var(--font-hanken-grotesk)',
    note: 'Warm humanist grotesk. Friendly but still tidy — good for long reading.',
  },
  {
    id: 'schibsted',
    name: 'Schibsted Grotesk',
    cssVar: 'var(--font-schibsted-grotesk)',
    note: 'Editorial news grotesk. Confident headings, slightly condensed feel.',
  },
  {
    id: 'sora',
    name: 'Sora',
    cssVar: 'var(--font-sora)',
    note: 'Current favorite: geometric and a touch technical, distinct without being loud.',
    favorite: true,
  },
  {
    id: 'bricolage',
    name: 'Bricolage Grotesque',
    cssVar: 'var(--font-bricolage)',
    note: 'Quirky display grotesque with character in the headings — most expressive of the set.',
  },
  {
    id: 'ibm-plex-sans',
    name: 'IBM Plex Sans',
    cssVar: 'var(--font-ibm-plex-sans)',
    note: 'Typed-document classic. Pairs natively with IBM Plex Mono for an engineering-doc feel.',
  },
];

const MONO: Face[] = [
  {
    id: 'geist-mono',
    name: 'Geist Mono',
    cssVar: 'var(--font-geist-mono)',
    note: 'Current baseline mono. Clean, neutral, low personality.',
  },
  {
    id: 'jetbrains',
    name: 'JetBrains Mono',
    cssVar: 'var(--font-jetbrains-mono)',
    note: 'Developer-favourite. Sturdy, very legible at tiny metadata sizes.',
  },
  {
    id: 'space-mono',
    name: 'Space Mono',
    cssVar: 'var(--font-space-mono)',
    note: 'Loads of character — distinctive caps and quirky shapes. Pairs with Space Grotesk.',
  },
  {
    id: 'dm-mono',
    name: 'DM Mono',
    cssVar: 'var(--font-dm-mono)',
    note: 'Soft, light mono. Understated — recedes into metadata nicely.',
  },
  {
    id: 'spline',
    name: 'Spline Sans Mono',
    cssVar: 'var(--font-spline-sans-mono)',
    note: 'Mono with a humanist, almost-sans warmth. Modern and easy to read.',
  },
  {
    id: 'martian',
    name: 'Martian Mono',
    cssVar: 'var(--font-martian-mono)',
    note: 'Squarish, technical, slightly wide. Strong machine-label energy.',
  },
  {
    id: 'fragment',
    name: 'Fragment Mono',
    cssVar: 'var(--font-fragment-mono)',
    note: 'Refined typewriter feel. Editorial mono with subtle warmth.',
  },
  {
    id: 'ibm-plex-mono',
    name: 'IBM Plex Mono',
    cssVar: 'var(--font-ibm-plex-mono)',
    note: 'Engineering-doc mono. Pairs natively with IBM Plex Sans.',
  },
];

function SansSpecimen({ face }: { face: Face }) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 py-6',
        face.favorite && '-mx-3 border border-roy-b bg-roy-b/10 px-3 text-roy-b'
      )}
      style={{ fontFamily: face.cssVar }}
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-roy-r">
          {face.name}
        </span>
        <div
          className="flex items-baseline gap-2 font-mono text-[10px]"
          style={{ fontFamily: 'var(--font-geist-mono)' }}
        >
          {face.favorite ? (
            <span className="uppercase tracking-[0.15em] text-roy-b">
              current favorite
            </span>
          ) : null}
          <span className="text-muted-foreground">sans</span>
        </div>
      </div>
      <h3 className="text-2xl font-semibold leading-tight tracking-tight text-foreground">
        Islam Tayeb
      </h3>
      <p className="max-w-xl text-sm font-normal leading-relaxed text-foreground text-pretty">
        A Duke student finding lazy automations. Born between Egypt and Saudi
        Arabia, now in Durham — building software, doing research, and writing
        on APM Overflow.
      </p>
      <div className="flex flex-wrap items-baseline gap-x-4 text-base text-foreground">
        <span className="font-normal">Regular</span>
        <span className="font-medium">Medium</span>
        <span className="font-semibold">Semibold</span>
        <span className="font-bold">Bold</span>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {face.note}
      </p>
    </div>
  );
}

function MonoSpecimen({ face }: { face: Face }) {
  return (
    <div
      className="flex flex-col gap-3 py-6"
      style={{ fontFamily: face.cssVar }}
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[10px] uppercase tracking-[0.15em] text-roy-b">
          {face.name}
        </span>
        <span
          className="text-[10px] text-muted-foreground"
          style={{ fontFamily: 'var(--font-geist-mono)' }}
        >
          mono
        </span>
      </div>
      {/* metadata row — the real use case for mono on the site */}
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-[13px] text-foreground">
        <span>
          <span className="text-roy-b">focus</span>&nbsp;&nbsp;automations
        </span>
        <span>
          <span className="text-roy-b">loc</span>&nbsp;&nbsp;durham, nc
        </span>
        <span>
          <span className="text-roy-b">2026</span>
        </span>
      </div>
      {/* glyph legibility check at small size */}
      <p className="text-xs leading-relaxed text-muted-foreground">
        0OIl1 — {'{ }'} () [] /\ &amp; @ # = → ABCxyz 0123456789
      </p>
      <p
        className="text-xs leading-relaxed text-muted-foreground"
        style={{ fontFamily: 'var(--font-geist-sans)' }}
      >
        {face.note}
      </p>
    </div>
  );
}

export function FontsSection() {
  return (
    <Section
      index="00"
      title="Typeface"
      accent="text-roy-r"
      cols={1}
      note="Split into two lists — sans (headings + body) and mono (metadata). Each specimen sits on the page background with real spacing, no grey panels. Headings are semibold and body is full-strength ink, which fixes most of the 'too light' feel. Pick one sans + one mono."
    >
      <div className="flex flex-col gap-10">
        {/* SANS */}
        <div className="flex flex-col">
          <span className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Sans — headings &amp; body
          </span>
          <div className="grid gap-x-10 md:grid-cols-2">
            {SANS.map((f, i) => (
              <div
                key={f.id}
                className={
                  i % 2 === 0 ? 'md:border-r md:border-border md:pr-10' : ''
                }
              >
                <div className="border-t border-border">
                  <SansSpecimen face={f} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MONO */}
        <div className="flex flex-col">
          <span className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Mono — metadata &amp; labels
          </span>
          <div className="grid gap-x-10 md:grid-cols-2">
            {MONO.map((f, i) => (
              <div
                key={f.id}
                className={
                  i % 2 === 0 ? 'md:border-r md:border-border md:pr-10' : ''
                }
              >
                <div className="border-t border-border">
                  <MonoSpecimen face={f} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
