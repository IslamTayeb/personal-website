'use client';

import { useState } from 'react';
import { Section, Variant } from './frame';
import { MoonGlyph, SquaredPlusGlyph, type MoonVariant } from './glyphs';

type Active = 'islam' | 'blog';

const MOONS: { id: MoonVariant; label: string }[] = [
  { id: 'heavy-cut', label: 'A heavy cut' },
  { id: 'sickle', label: 'B sickle' },
  { id: 'compact', label: 'C compact' },
  { id: 'round-cut', label: 'D round cut' },
  { id: 'open', label: 'E open stroke' },
  { id: 'half', label: 'F half moon' },
  { id: 'angle', label: 'G angled' },
  { id: 'dot-cut', label: 'H dot cut' },
];

function SelectedWordmark() {
  const [active, setActive] = useState<Active>('islam');
  const [moon, setMoon] = useState<MoonVariant>('heavy-cut');

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex items-center gap-5 font-mono text-base">
        <button
          type="button"
          onClick={() => setActive('islam')}
          className={`flex items-center gap-2 ${
            active === 'islam' ? 'text-roy-r' : 'text-muted-foreground'
          }`}
        >
          <MoonGlyph size={15} variant={moon} /> islam
        </button>
        <span aria-hidden style={{ color: '#DFDEDB' }}>
          /
        </span>
        <button
          type="button"
          onClick={() => setActive('blog')}
          className={`flex items-center gap-2 ${
            active === 'blog' ? 'text-roy-b' : 'text-muted-foreground'
          }`}
        >
          <SquaredPlusGlyph size={14} /> blog
        </button>
      </div>

      <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
        {MOONS.map((option) => {
          const selected = option.id === moon;
          return (
            <button
              type="button"
              key={option.id}
              onClick={() => setMoon(option.id)}
              className={`flex items-center justify-between gap-3 bg-background p-3 text-left hover:bg-secondary ${
                selected ? 'text-roy-r' : 'text-foreground'
              }`}
            >
              <span className="flex items-center gap-3">
                <MoonGlyph size={18} variant={option.id} />
                <span className="font-mono text-[10px] uppercase tracking-[0.14em]">
                  {option.label}
                </span>
              </span>
              {selected ? (
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-roy-r">
                  selected
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function WordmarkSection() {
  return (
    <Section
      index="01"
      title="Wordmark / Glyph"
      accent="text-roy-r"
      cols={1}
      note="Selected direction: islam/blog remains a real selector with a quiet #DFDEDB slash. The blog keeps the squared plus; the islam side is now testing thicker crescent candidates instead of forcing the moon into a square."
    >
      <Variant label="Selected — slash selector + moon candidates" tag="final">
        <SelectedWordmark />
      </Variant>
    </Section>
  );
}
