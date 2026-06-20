'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { experienceGroups, type ExperienceGroup } from '@/data/experience';
import { ExternalLink } from '@/components/primitives/external-link';
import { RailItem, RailList } from '@/components/primitives/rail';
import { BorderedPanel, Section } from '@/components/primitives/section';

const hollowDots: Record<string, string> = {
  'bg-roy-y': 'border border-roy-y bg-background',
  'bg-roy-o': 'border border-roy-o bg-background',
};

const groupAccents: Record<string, { hover: string }> = {
  'bg-roy-y': {
    hover: 'hover:text-roy-y hover:decoration-roy-y',
  },
  'bg-roy-o': {
    hover: 'hover:text-roy-o hover:decoration-roy-o',
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
            title={
              role.href ? (
                <ExternalLink
                  href={role.href}
                  section={group.kind === 'Research' ? 'o' : 'y'}
                  className="text-foreground"
                >
                  {role.org}
                </ExternalLink>
              ) : (
                role.org
              )
            }
            meta={role.date}
            description={`${role.role}. ${role.desc}`}
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
      <div className="flex items-center gap-2 pb-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
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

export function Experience() {
  const [expanded, setExpanded] = useState(false);

  return (
    <Section
      id="experience"
      index="2"
      title="Experience"
      accent="text-roy-o"
      note="Grouped rail with Research first, Engineering second, and inline see more/see less."
    >
      <BorderedPanel>
        <div className="flex w-full flex-col gap-3.5">
          {experienceGroups.map((group) => (
            <RailGroupBlock
              key={group.kind}
              group={group}
              expanded={expanded}
              onToggleExpanded={() => setExpanded((value) => !value)}
            />
          ))}
        </div>
      </BorderedPanel>
    </Section>
  );
}
