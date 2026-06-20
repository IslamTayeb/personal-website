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

function RailGroup({ group, expanded }: { group: Group; expanded: boolean }) {
  const roles = expanded
    ? group.roles
    : group.roles.slice(0, group.visibleCount);
  const countLabel =
    roles.length === group.roles.length
      ? `${group.roles.length}`
      : `${roles.length} of ${group.roles.length}`;

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 pb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <span className="text-xs leading-none">›</span>
        {group.kind}
        <span className="text-muted-foreground/60">({countLabel})</span>
      </div>
      <ul className="flex flex-col">
        {roles.map((role, index) => (
          <li
            key={`${group.kind}-${role.org}-${role.date}`}
            className="relative flex gap-4 pb-7 last:pb-0"
          >
            {index < roles.length - 1 ? (
              <span className="absolute left-[3.5px] top-5 bottom-5 w-px bg-border" />
            ) : null}
            <span className={`relative mt-1 h-2 w-2 shrink-0 ${group.dot}`} />
            <div className="flex w-full flex-col gap-0.5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm text-foreground">{role.org}</span>
                <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                  {role.date}
                </span>
              </div>
              <p className="max-w-sm text-xs leading-relaxed text-muted-foreground text-pretty">
                {role.desc}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ExperienceRail() {
  const [expanded, setExpanded] = useState(false);
  const hiddenCount = GROUPS.reduce(
    (total, group) =>
      total + Math.max(0, group.roles.length - group.visibleCount),
    0
  );

  return (
    <div className="flex w-full flex-col gap-7">
      {GROUPS.map((group) => (
        <RailGroup key={group.kind} group={group} expanded={expanded} />
      ))}
      {hiddenCount > 0 ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="w-fit font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground underline decoration-border underline-offset-4 hover:text-roy-o hover:decoration-roy-o"
        >
          {expanded ? 'Show less' : `Show more (${hiddenCount})`}
        </button>
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
      note="Selected direction: one always-on grouped rail. It opens with the top three research roles and the top engineering role, then a single show more/show less control reveals the remaining engineering roles."
    >
      <Variant label="Selected — top roles + show more" tag="final">
        <ExperienceRail />
      </Variant>
    </Section>
  );
}
