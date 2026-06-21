'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { experienceGroups, type ExperienceGroup } from '@/data/experience';
import { ExternalLink } from '@/components/primitives/external-link';
import { RailItem, RailList } from '@/components/primitives/rail';
import { SectionActionButton } from '@/components/primitives/section-action';
import { BorderedPanel, Section } from '@/components/primitives/section';

const hollowDots: Record<string, string> = {
  'bg-roy-y': 'border border-roy-y bg-background',
  'bg-roy-o': 'border border-roy-o bg-background',
};

function RailGroup({
  group,
  expanded,
}: {
  group: ExperienceGroup;
  expanded: boolean;
}) {
  const roles = expanded
    ? group.roles
    : group.roles.slice(0, group.visibleCount);
  const hasHidden = group.roles.length > group.visibleCount;

  return (
    <RailList>
      {roles.map((role, index) => {
        const isLastVisibleRole = index === roles.length - 1;
        const connector =
          index < roles.length - 1
            ? 'solid'
            : isLastVisibleRole && hasHidden && !expanded
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
            description={role.desc}
            connector={connector}
          />
        );
      })}
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
  const hasHidden = group.roles.length > group.visibleCount;
  const actionSection = group.kind === 'Research' ? 'o' : 'y';

  return (
    <div
      data-testid="experience-group"
      data-group={group.kind}
      className="flex flex-col"
    >
      <div className="grid grid-cols-[1.25rem_minmax(0,1fr)] items-center pb-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <ChevronDown
          className="relative bottom-px text-muted-foreground"
          size={11}
          strokeWidth={1.8}
          aria-hidden
        />
        <span data-testid="experience-group-label" data-group={group.kind}>
          {group.kind} ({group.roles.length})
        </span>
      </div>
      <RailGroup group={group} expanded={expanded} />
      {hasHidden ? (
        <div className="flex justify-end pt-1">
          <SectionActionButton
            section={actionSection}
            onClick={onToggleExpanded}
            testId="experience-more-control"
          >
            {expanded ? 'show less' : 'show more'}
          </SectionActionButton>
        </div>
      ) : null}
    </div>
  );
}

export function Experience() {
  const [expanded, setExpanded] = useState(false);

  return (
    <Section id="experience" index="2" title="Experience" accent="text-roy-o">
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
