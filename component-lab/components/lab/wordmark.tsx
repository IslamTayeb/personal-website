'use client';

import { useState } from 'react';
import { Section, Variant } from './frame';
import { MoonGlyph, SparkleGlyph } from './glyphs';

type Active = 'islam' | 'blog';

function SelectedWordmark() {
  const [active, setActive] = useState<Active>('islam');

  return (
    <div className="flex items-center gap-5 font-mono text-base">
      <button
        type="button"
        onClick={() => setActive('islam')}
        className={`flex items-center gap-2 ${
          active === 'islam' ? 'text-roy-r' : 'text-muted-foreground'
        }`}
      >
        <MoonGlyph size={15} variant="heavy-cut" /> islam
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
        <SparkleGlyph size={14} /> blog
      </button>
    </div>
  );
}

export function WordmarkSection() {
  return (
    <Section
      index="0"
      title="Wordmark / Glyph"
      accent="text-roy-r"
      cols={1}
      note="Selected direction: islam/blog remains a real selector with a quiet #DFDEDB slash. Islam uses the heavy-cut crescent; blog uses a single drawn sparkle instead of the squared plus."
    >
      <Variant label="Selected — heavy moon / sparkle selector" tag="final">
        <SelectedWordmark />
      </Variant>
    </Section>
  );
}
