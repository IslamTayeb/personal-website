'use client';

import { useState } from 'react';
import { Section, Variant } from './frame';

type Role = {
  org: string;
  date: string;
  desc: string;
};

// Research first (per request). Legend: Research = yellow, Engineering = orange.
const GROUPS: {
  kind: string;
  dot: string;
  ring: string;
  line: string;
  text: string;
  roles: Role[];
}[] = [
  {
    kind: 'Research',
    dot: 'bg-roy-y',
    ring: 'border-roy-y',
    line: 'bg-roy-y',
    text: 'text-roy-y',
    roles: [
      {
        org: 'Duke University',
        date: 'Aug 2025 — Present',
        desc: 'Enzyme protocol mining tools using PyTorch and services in FastAPI.',
      },
    ],
  },
  {
    kind: 'Engineering',
    dot: 'bg-roy-o',
    ring: 'border-roy-o',
    line: 'bg-roy-o',
    text: 'text-roy-o',
    roles: [
      {
        org: 'Soff (YC S24)',
        date: 'May 2025 — Oct 2025',
        desc: 'Sales intelligence for manufacturers using Next.js and tRPC, as employee #2.',
      },
      {
        org: 'Life Edit',
        date: 'Sep 2024 — May 2025',
        desc: 'Non-linear RNA-seq analysis and a dashboard for CRISPR experiments in Python.',
      },
    ],
  },
];

// A chevron that flips instantly (no soft easing).
function Caret({ open }: { open: boolean }) {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden="true"
      className={open ? 'rotate-90' : ''}
    >
      <path d="M3 1.5 7 5 3 8.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

// Shared rail renderer. `collapsible` decides whether each ROW toggles its
// own description (the row itself is the trigger — no extra buttons).
function Rail({ collapsible }: { collapsible: boolean }) {
  const [groupOpen, setGroupOpen] = useState<Record<string, boolean>>({
    Research: true,
    Engineering: true,
  });
  // descriptions default open; collapsing is opt-in per row
  const [rowOpen, setRowOpen] = useState<Record<string, boolean>>({});
  const isRowOpen = (key: string) =>
    collapsible ? (rowOpen[key] ?? true) : true;

  return (
    <div className="flex w-full flex-col gap-6">
      {GROUPS.map((g) => (
        <div key={g.kind} className="flex flex-col">
          <button
            type="button"
            onClick={() =>
              setGroupOpen((o) => ({ ...o, [g.kind]: !o[g.kind] }))
            }
            className="flex items-center gap-2 pb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
          >
            <Caret open={groupOpen[g.kind]} />
            {g.kind}
            <span className="text-muted-foreground/60">({g.roles.length})</span>
          </button>
          {groupOpen[g.kind] ? (
            <ul className="flex flex-col">
              {g.roles.map((r, i) => {
                const key = `${g.kind}-${r.org}`;
                const open = isRowOpen(key);
                const RowTag = collapsible ? 'button' : 'div';
                return (
                  <li
                    key={r.org}
                    className="relative flex gap-4 pb-5 last:pb-0"
                  >
                    {/* connecting segment picks up the group accent while open */}
                    {i < g.roles.length - 1 ? (
                      <span
                        className={`absolute left-[3.5px] top-5 bottom-1 w-px ${
                          collapsible && open ? g.line : 'bg-border'
                        }`}
                      />
                    ) : null}
                    {/* rail node IS the state: solid square closed, hollow
                        accent-ringed square (grown) when open */}
                    <span
                      className={`relative mt-1 shrink-0 ${
                        collapsible && open
                          ? `h-2.5 w-2.5 -ml-px border-2 bg-background ${g.ring}`
                          : `h-2 w-2 ${g.dot}`
                      }`}
                    />
                    <RowTag
                      type={collapsible ? 'button' : undefined}
                      onClick={
                        collapsible
                          ? () => setRowOpen((o) => ({ ...o, [key]: !open }))
                          : undefined
                      }
                      className={`flex w-full flex-col gap-0.5 text-left ${
                        collapsible ? 'group' : ''
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <span
                          className={`text-sm ${
                            collapsible && open ? g.text : 'text-foreground'
                          }`}
                        >
                          {r.org}
                        </span>
                        <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                          {r.date}
                        </span>
                      </div>
                      {open ? (
                        <p className="max-w-sm text-xs leading-relaxed text-muted-foreground text-pretty">
                          {r.desc}
                        </p>
                      ) : null}
                    </RowTag>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function ExperienceSection() {
  return (
    <Section
      index="03"
      title="Experience — grouped, collapsible"
      accent="text-roy-o"
      note="v.04 — Research now sits above Engineering, and the redundant role label under each employer is gone (the group header already says it). Legend in action: Research dots are yellow, Engineering dots are orange. A keeps descriptions always-on; B makes each ROW its own toggle where the STATE lives on the rail node (solid square closed → hollow accent-ringed square open, with the connecting line and title picking up the group color — no caret); C collapses whole groups only."
    >
      {/* A — descriptions always visible */}
      <Variant label="A — Always-on descriptions" tag="final">
        <Rail collapsible={false} />
      </Variant>

      {/* B — each row toggles its own description */}
      <Variant label="B — Row-toggle descriptions" tag="row = trigger">
        <Rail collapsible={true} />
      </Variant>

      {/* C — only group-level collapse (descriptions ride along) */}
      <Variant label="C — Group collapse only">
        <Rail collapsible={false} />
      </Variant>
    </Section>
  );
}
