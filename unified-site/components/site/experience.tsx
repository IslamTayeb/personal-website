'use client';

import { type ReactNode, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { experienceGroups, type ExperienceGroup } from '@/data/experience';
import { ExternalLink } from '@/components/primitives/external-link';
import { RailItem, RailList } from '@/components/primitives/rail';
import { SectionActionButton } from '@/components/primitives/section-action';
import { BorderedPanel, Section } from '@/components/primitives/section';

type DescriptionSegment =
  | {
      type: 'text';
      text: string;
    }
  | {
      type: 'link';
      text: string;
      href: string;
    };

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
        const titleContent: ReactNode = role.piName ? (
          <span className="inline-flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span>{role.org}</span>
            {role.href ? (
              <ExternalLink
                href={role.href}
                section={group.kind === 'Research' ? 'o' : 'y'}
                className="font-mono text-[10px] font-normal uppercase tracking-[0.12em] text-muted-foreground"
              >
                {role.piName}
              </ExternalLink>
            ) : (
              <span className="font-mono text-[10px] font-normal uppercase tracking-[0.12em] text-muted-foreground">
                {role.piName}
              </span>
            )}
          </span>
        ) : (
          role.org
        );
        const isLastVisibleRole = index === roles.length - 1;
        const connector =
          index < roles.length - 1
            ? 'solid'
            : isLastVisibleRole && hasHidden && !expanded
              ? 'dashed'
              : 'none';

        return (
          <RailItem
            key={`${group.kind}-${role.org}-${role.piName ?? role.org}-${role.date}`}
            dotClassName={role.incoming ? hollowDots[group.dot] : group.dot}
            incoming={role.incoming}
            title={
              role.href && !role.piName ? (
                <ExternalLink
                  href={role.href}
                  section={group.kind === 'Research' ? 'o' : 'y'}
                  className="text-foreground"
                >
                  {titleContent}
                </ExternalLink>
              ) : (
                titleContent
              )
            }
            meta={role.date}
            description={
              role.descLinks?.length ? (
                <LinkedDescription
                  text={role.desc}
                  links={role.descLinks}
                  section={group.kind === 'Research' ? 'o' : 'y'}
                />
              ) : (
                role.desc
              )
            }
            connector={connector}
          />
        );
      })}
    </RailList>
  );
}

function LinkedDescription({
  text,
  links,
  section,
}: {
  text: string;
  links: NonNullable<ExperienceGroup['roles'][number]['descLinks']>;
  section: 'o' | 'y';
}) {
  const renderStaticText = (value: string) => {
    if (value.includes('% Microsoft Research')) {
      const [before, after] = value.split('% Microsoft Research');

      return (
        <>
          {before}
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            % Microsoft Research
          </span>
          {after}
        </>
      );
    }

    if (!value.includes('Microsoft Research')) {
      return value;
    }

    const [before, after] = value.split('Microsoft Research');

    return (
      <>
        {before.replace(/\s+and\s*$/, ' ')}
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          % Microsoft Research
        </span>
        {after}
      </>
    );
  };

  const segments = links.reduce<DescriptionSegment[]>(
    (currentSegments, link) =>
      currentSegments.flatMap((segment) => {
        if (segment.type === 'link' || !segment.text.includes(link.text)) {
          return [segment];
        }

        const [before, ...afterParts] = segment.text.split(link.text);
        const after = afterParts.join(link.text);

        return [
          ...(before ? [{ type: 'text' as const, text: before }] : []),
          { type: 'link' as const, text: link.text, href: link.href },
          ...(after ? [{ type: 'text' as const, text: after }] : []),
        ];
      }),
    [{ type: 'text', text }]
  );

  return (
    <>
      {segments.map((segment, index) =>
        segment.type === 'link' ? (
          <ExternalLink
            key={`${segment.text}-${index}`}
            href={segment.href}
            section={section}
          >
            {segment.text}
          </ExternalLink>
        ) : (
          <span key={`text-${index}`}>{renderStaticText(segment.text)}</span>
        )
      )}
    </>
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
  const [expandedGroups, setExpandedGroups] = useState<
    Record<ExperienceGroup['kind'], boolean>
  >({
    Research: false,
    Engineering: false,
  });

  return (
    <Section id="experience" index="1" title="Experience" accent="text-roy-o">
      <BorderedPanel>
        <div className="flex w-full flex-col gap-3.5">
          {experienceGroups.map((group) => (
            <RailGroupBlock
              key={group.kind}
              group={group}
              expanded={expandedGroups[group.kind]}
              onToggleExpanded={() =>
                setExpandedGroups((current) => ({
                  ...current,
                  [group.kind]: !current[group.kind],
                }))
              }
            />
          ))}
        </div>
      </BorderedPanel>
    </Section>
  );
}
