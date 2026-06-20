'use client';

import { useState } from 'react';
import { Section, Variant } from './frame';

type Post = {
  date: string;
  title: string;
  isNew?: boolean;
  desc: string;
};

const POSTS: Post[] = [
  {
    date: 'Jun 2026',
    title: 'On Agent Memory Fidelity (Decant)',
    isNew: true,
    desc: 'How agents lose the plot over long horizons, and what faithful memory recall actually costs.',
  },
  {
    date: 'Mar 2026',
    title: 'On Fingerspitzengefühl',
    desc: 'The fingertip-feel of good taste — why some calls are felt before they can be explained.',
  },
  {
    date: 'Jan 2026',
    title: 'On Dimensions of Taste (Harmonia)',
    desc: 'A first attempt at decomposing taste into axes you can actually reason about.',
  },
];

// Continuous rail matching Experience. blog = blue (legend).
// `mode`:
//   'always'      — descriptions always visible, dots solid
//   'collapsible' — each row toggles; state lives on the rail node
//   'plain'       — title links only, no descriptions
function Rail({ mode }: { mode: 'always' | 'collapsible' | 'plain' }) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  return (
    <ul className="flex w-full flex-col">
      {POSTS.map((p, i) => {
        const isOpen =
          mode === 'collapsible' ? (open[p.title] ?? false) : false;
        const showDesc = mode === 'always' || isOpen;
        return (
          <li key={p.title} className="relative flex gap-4 pb-5 last:pb-0">
            {/* continuous connecting segment — picks up blue while open */}
            {i < POSTS.length - 1 ? (
              <span
                className={`absolute left-[3.5px] top-5 bottom-0 w-px ${
                  isOpen ? 'bg-roy-b' : 'bg-border'
                }`}
              />
            ) : null}
            {/* rail node: solid square (blue if new), hollow blue-ring when open */}
            <span
              className={`relative mt-1 shrink-0 ${
                isOpen
                  ? 'h-2.5 w-2.5 -ml-px border-2 border-roy-b bg-background'
                  : p.isNew
                    ? 'h-2 w-2 bg-roy-b'
                    : 'h-2 w-2 bg-foreground'
              }`}
            />
            {mode === 'plain' ? (
              <a href="#" className="group flex flex-col gap-0.5">
                <span className="text-sm text-foreground decoration-roy-b decoration-2 underline-offset-4 group-hover:underline">
                  {p.title}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  {p.date}
                </span>
              </a>
            ) : (
              <div className="flex w-full flex-col gap-0.5">
                <button
                  type="button"
                  onClick={
                    mode === 'collapsible'
                      ? () => setOpen((o) => ({ ...o, [p.title]: !isOpen }))
                      : undefined
                  }
                  className={`flex flex-col gap-0.5 text-left ${
                    mode === 'collapsible' ? 'group' : 'cursor-default'
                  }`}
                >
                  <span
                    className={`text-sm ${
                      isOpen ? 'text-roy-b' : 'text-foreground'
                    }`}
                  >
                    {p.title}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    {p.date}
                  </span>
                </button>
                {showDesc ? (
                  <div className="mt-1 flex flex-col gap-1.5">
                    <p className="max-w-sm text-xs leading-relaxed text-muted-foreground text-pretty">
                      {p.desc}
                    </p>
                    {mode === 'collapsible' ? (
                      <a
                        href="#"
                        className="font-mono text-[10px] uppercase tracking-[0.12em] text-roy-b decoration-roy-b decoration-2 underline-offset-4 hover:underline"
                      >
                        read →
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </div>
            )}
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
      note="v.06 — corner ticks dropped. The writing list now uses the same continuous rail as Experience for consistency, in blog blue. A keeps descriptions always-on; B makes each row a toggle where the state lives on the rail node (solid square → hollow blue ring, with the connecting segment and title turning blue); C is a plain linked list with just titles and dates."
    >
      {/* A — descriptions always visible */}
      <Variant label="A — Always-on descriptions" tag="no toggles">
        <Rail mode="always" />
      </Variant>

      {/* B — row toggles, state on the rail node */}
      <Variant label="B — Row-toggle (rail = state)" tag="row = trigger">
        <Rail mode="collapsible" />
      </Variant>

      {/* C — plain linked list */}
      <Variant label="C — Plain linked list">
        <Rail mode="plain" />
      </Variant>
    </Section>
  );
}
