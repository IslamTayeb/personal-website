'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { experienceGroups, type ExperienceGroup } from '@/lib/lab-data';
import { Section, Variant } from './frame';
import { RailItem, RailList } from './rail';

const hollowDots: Record<string, string> = {
  'bg-roy-y': 'border border-roy-y bg-background',
  'bg-roy-o': 'border border-roy-o bg-background',
  'bg-roy-b': 'border border-roy-b bg-background',
  'bg-roy-r': 'border border-roy-r bg-background',
};

const groupAccents: Record<string, { text: string; hover: string }> = {
  'bg-roy-y': {
    text: 'text-roy-y',
    hover: 'hover:text-roy-y hover:decoration-roy-y',
  },
  'bg-roy-o': {
    text: 'text-roy-o',
    hover: 'hover:text-roy-o hover:decoration-roy-o',
  },
  'bg-roy-b': {
    text: 'text-roy-b',
    hover: 'hover:text-roy-b hover:decoration-roy-b',
  },
  'bg-roy-r': {
    text: 'text-roy-r',
    hover: 'hover:text-roy-r hover:decoration-roy-r',
  },
};

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
  const accent = groupAccents[group.dot] ?? groupAccents['bg-roy-o'];

  return (
    <RailList>
      {roles.map((role, index) => {
        const isLastVisibleRole = index === roles.length - 1;
        const showMoreBelow = isLastVisibleRole && hasHidden && !expanded;
        const connector =
          index < roles.length - 1
            ? 'solid'
            : showMoreBelow
              ? 'dashed'
              : 'none';

        return (
          <RailItem
            key={`${group.kind}-${role.org}-${role.date}`}
            dotClassName={role.incoming ? hollowDots[group.dot] : group.dot}
            title={role.org}
            meta={role.date}
            description={role.desc}
            connector={connector}
            connectorClassName={showMoreBelow ? 'bottom-6' : undefined}
            footer={
              showMoreBelow ? (
                <button
                  type="button"
                  onClick={onToggleExpanded}
                  className={`w-fit font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground underline decoration-border underline-offset-4 ${accent.hover}`}
                >
                  Show more ({hiddenCount})
                </button>
              ) : null
            }
          />
        );
      })}
      {hasHidden && expanded ? (
        <li className="pl-6 pt-0.5">
          <button
            type="button"
            onClick={onToggleExpanded}
            className={`w-fit font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground underline decoration-border underline-offset-4 ${accent.hover}`}
          >
            Show less
          </button>
        </li>
      ) : null}
    </RailList>
  );
}

function ExperienceRail() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex w-full flex-col gap-4">
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
        <ChevronDown
          className="relative bottom-px text-muted-foreground"
          size={11}
          strokeWidth={1.8}
          aria-hidden
        />
        <span>
          {group.kind} ({group.roles.length})
        </span>
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
