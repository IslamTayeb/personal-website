'use client';

import { useState } from 'react';
import { Section, Variant } from './frame';
import { MoonGlyph, SquaredPlusGlyph } from './glyphs';

type Active = 'islam' | 'blog';

// A — selected gets its ROYB color, unselected falls to muted grey.
function SelectorGrey() {
  const [active, setActive] = useState<Active>('islam');
  return (
    <div className="flex items-center gap-5 font-mono text-sm">
      <button
        type="button"
        onClick={() => setActive('islam')}
        className={`flex items-center gap-2 ${
          active === 'islam' ? 'text-roy-r' : 'text-muted-foreground'
        }`}
      >
        <MoonGlyph size={14} /> islam
      </button>
      <span aria-hidden className="h-4 w-px bg-border" />
      <button
        type="button"
        onClick={() => setActive('blog')}
        className={`flex items-center gap-2 ${
          active === 'blog' ? 'text-roy-b' : 'text-muted-foreground'
        }`}
      >
        <SquaredPlusGlyph size={13} /> blog
      </button>
    </div>
  );
}

// B — slash separator, active gets its ROYB color, inactive falls to grey.
function SelectorInk() {
  const [active, setActive] = useState<Active>('islam');
  return (
    <div className="flex items-center gap-5 font-mono text-sm">
      <button
        type="button"
        onClick={() => setActive('islam')}
        className={`flex items-center gap-2 ${
          active === 'islam' ? 'text-roy-r' : 'text-muted-foreground'
        }`}
      >
        <MoonGlyph size={14} /> islam
      </button>
      <span aria-hidden className="text-muted-foreground">
        /
      </span>
      <button
        type="button"
        onClick={() => setActive('blog')}
        className={`flex items-center gap-2 ${
          active === 'blog' ? 'text-roy-b' : 'text-muted-foreground'
        }`}
      >
        <SquaredPlusGlyph size={13} /> blog
      </button>
    </div>
  );
}

// C — only the glyph carries the color, the word always stays ink.
function SelectorGlyphOnly() {
  const [active, setActive] = useState<Active>('islam');
  return (
    <div className="flex items-center gap-5 font-mono text-sm text-foreground">
      <button
        type="button"
        onClick={() => setActive('islam')}
        className="flex items-center gap-2"
      >
        <MoonGlyph
          size={14}
          className={
            active === 'islam' ? 'text-roy-r' : 'text-muted-foreground'
          }
        />
        islam
      </button>
      <span aria-hidden className="text-muted-foreground">
        /
      </span>
      <button
        type="button"
        onClick={() => setActive('blog')}
        className="flex items-center gap-2"
      >
        <SquaredPlusGlyph
          size={13}
          className={active === 'blog' ? 'text-roy-b' : 'text-muted-foreground'}
        />
        blog
      </button>
    </div>
  );
}

export function WordmarkSection() {
  return (
    <Section
      index="01"
      title="Wordmark / Glyph"
      accent="text-roy-r"
      note="v.03 — now a real selector: islam (☾, red) and blog (⊞, blue), glyph left of each word. Click to switch — the active property takes its ROYB color, no extra square needed. Separator comparison: A uses a thin vertical rule, B and C use a slash (/). The variants also differ in how the inactive item reads: muted grey, full ink, or glyph-only color."
    >
      {/* A */}
      <Variant label="A — Inactive = grey" tag="recommended">
        <SelectorGrey />
      </Variant>

      {/* B */}
      <Variant label="B — Slash + inactive grey" tag="final">
        <SelectorInk />
      </Variant>

      {/* C */}
      <Variant label="C — Color on glyph only">
        <SelectorGlyphOnly />
      </Variant>
    </Section>
  );
}
