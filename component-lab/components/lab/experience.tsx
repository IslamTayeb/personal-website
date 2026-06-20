'use client';

import { useState } from 'react';
import { experienceGroups, type ExperienceGroup } from '@/lib/lab-data';
import { Section, Variant } from './frame';

function RailGroup({
  group,
  expanded,
  onToggleExpanded,
}: {
  group: ExperienceGroup;
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

  return (
    <div className="flex w-full flex-col gap-7">
      {experienceGroups.map((group) => (
        <RailGroupBlock
          key={group.kind}
          group={group}
          expanded={expanded}
          onToggleExpanded={() => setExpanded((value) => !value)}
        />
      ))}
    </div>
  );
}

function RailGroupBlock({
  group,
  expanded,
  onToggleExpanded,
}: {
  group: ExperienceGroup;
  expanded: boolean;
  onToggleExpanded: () => void;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 pb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <span className="text-xs leading-none" aria-hidden>
          ⌄
        </span>
        {group.kind}
        <span className="text-muted-foreground/60">({group.roles.length})</span>
      </div>
      <RailGroup
        group={group}
        expanded={expanded}
        onToggleExpanded={onToggleExpanded}
      />
    </div>
  );
}

export function ExperienceSection() {
  return (
    <Section
      index="3"
      title="Experience — grouped rail"
      accent="text-roy-o"
      cols={1}
      note="Selected direction: grouped rail with fixed down-arrow group labels. Research shows three roles; Engineering opens with one role, a dashed continuation, and an inline show more/show less control inside the group."
    >
      <Variant label="Selected — fixed groups + inline show more" tag="final">
        <ExperienceRail />
      </Variant>
    </Section>
  );
}
