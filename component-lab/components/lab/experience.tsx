'use client';

import { useState } from 'react';
import { Section, Variant } from './frame';

type Role = {
  org: string;
  date: string;
  desc: string;
};

type Group = {
  kind: string;
  visibleCount: number;
  dot: string;
  roles: Role[];
};

const GROUPS: Group[] = [
  {
    kind: 'Research',
    visibleCount: 3,
    dot: 'bg-roy-y',
    roles: [
      {
        org: 'Duke University',
        date: 'Aug 2025 — Present',
        desc: 'Enzyme protocol mining tools using PyTorch and services in FastAPI.',
      },
      {
        org: 'Duke University',
        date: 'Oct 2024 — Apr 2025',
        desc: 'Continual learning model for antibody affinity prediction using PyTorch.',
      },
      {
        org: 'Saudi Aramco',
        date: 'Jul 2022 — Sep 2023',
        desc: 'Traditional ML polymer synthesis for CO₂ capture using Python.',
      },
    ],
  },
  {
    kind: 'Engineering',
    visibleCount: 1,
    dot: 'bg-roy-o',
    roles: [
      {
        org: 'Soff (YC S24)',
        date: 'May 2025 — Oct 2025',
        desc: 'Sales intelligence for manufacturers using Next.js and tRPC, as employee #2.',
      },
      {
        org: 'Life Edit',
        date: 'Sep 2024 — May 2025',
        desc: 'Non-linear RNA-seq analysis and dashboard for CRISPR experiments using Python.',
      },
      {
        org: 'DIHI',
        date: 'Jun 2024 — Aug 2024',
        desc: 'Automated literature review system using React and FastAPI.',
      },
    ],
  },
];

function RailGroup({
  group,
  expanded,
  onToggleExpanded,
}: {
  group: Group;
  expanded: boolean;
  onToggleExpanded: () => void;
}) {
  const roles = expanded
    ? group.roles
    : group.roles.slice(0, group.visibleCount);
  const hiddenCount = Math.max(0, group.roles.length - group.visibleCount);
  const hasHidden = hiddenCount > 0;

  return (
    <ul className="flex flex-col">
      {roles.map((role, index) => {
        const isLastVisibleRole = index === roles.length - 1;
        const showMoreBelow = isLastVisibleRole && hasHidden && !expanded;

        return (
          <li
            key={`${group.kind}-${role.org}-${role.date}`}
            className={`relative flex gap-4 ${
              showMoreBelow ? 'pb-1' : 'pb-4 last:pb-0'
            }`}
          >
            {index < roles.length - 1 ? (
              <span className="absolute left-[3.5px] top-5 bottom-1.5 w-px bg-border" />
            ) : null}
            {showMoreBelow ? (
              <span
                className="absolute left-[3.5px] top-5 bottom-0 w-px text-border"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(to bottom, currentColor 0 4px, transparent 4px 8px)',
                }}
              />
            ) : null}
            <span className={`relative mt-1 h-2 w-2 shrink-0 ${group.dot}`} />
            <div className="flex w-full flex-col gap-0.5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm text-foreground">{role.org}</span>
                <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                  {role.date}
                </span>
              </div>
              <p className="text-xs leading-snug text-muted-foreground text-pretty md:whitespace-nowrap">
                {role.desc}
              </p>
            </div>
          </li>
        );
      })}
      {hasHidden ? (
        <li className="relative flex gap-4 pb-4">
          <span className="w-2 shrink-0" aria-hidden />
          <button
            type="button"
            onClick={onToggleExpanded}
            className="w-fit font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground underline decoration-border underline-offset-4 hover:text-roy-o hover:decoration-roy-o"
          >
            {expanded ? 'Show less' : `Show more (${hiddenCount})`}
          </button>
        </li>
      ) : null}
    </ul>
  );
}

function ExperienceRail() {
  const [expanded, setExpanded] = useState(false);
  const [groupOpen, setGroupOpen] = useState<Record<string, boolean>>({
    Research: true,
    Engineering: true,
  });

  return (
    <div className="flex w-full flex-col gap-7">
      {GROUPS.map((group) => (
        <CollapsibleRailGroup
          key={group.kind}
          group={group}
          expanded={expanded}
          open={groupOpen[group.kind] ?? true}
          onToggleExpanded={() => setExpanded((value) => !value)}
          onToggle={() =>
            setGroupOpen((current) => ({
              ...current,
              [group.kind]: !(current[group.kind] ?? true),
            }))
          }
        />
      ))}
    </div>
  );
}

function CollapsibleRailGroup({
  group,
  expanded,
  open,
  onToggle,
  onToggleExpanded,
}: {
  group: Group;
  expanded: boolean;
  open: boolean;
  onToggle: () => void;
  onToggleExpanded: () => void;
}) {
  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex items-center gap-2 pb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
      >
        <span
          className={`inline-block text-xs leading-none transition-none ${
            open ? 'rotate-90' : ''
          }`}
          aria-hidden
        >
          ›
        </span>
        {group.kind}
        <span className="text-muted-foreground/60">({group.roles.length})</span>
      </button>
      {open ? (
        <RailGroup
          group={group}
          expanded={expanded}
          onToggleExpanded={onToggleExpanded}
        />
      ) : null}
    </div>
  );
}

export function ExperienceSection() {
  return (
    <Section
      index="03"
      title="Experience — grouped rail"
      accent="text-roy-o"
      cols={1}
      note="Selected direction: grouped rail with interactive group collapse. Research opens with three roles; Engineering opens with one role, a dotted continuation, and an inline show more/show less control inside the group."
    >
      <Variant
        label="Selected — collapsible groups + inline show more"
        tag="final"
      >
        <ExperienceRail />
      </Variant>
    </Section>
  );
}
