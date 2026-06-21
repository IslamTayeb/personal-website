'use client';

import { type ReactNode, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { experienceGroups, type ExperienceGroup } from '@/data/experience';
import { ExternalLink } from '@/components/primitives/external-link';
import { RailItem, RailList } from '@/components/primitives/rail';
import { SectionActionButton } from '@/components/primitives/section-action';
import { BorderedPanel, Section } from '@/components/primitives/section';
import { cn } from '@/lib/utils';

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
  'bg-roy-o': 'border border-roy-o bg-background',
};

function AdvisorLabel({
  role,
  boxed,
}: {
  role: ExperienceGroup['roles'][number];
  boxed: boolean;
}) {
  if (!role.piName) {
    return null;
  }

  const className = cn(
    'font-mono text-[10px] font-normal uppercase tracking-[0.12em] text-muted-foreground',
    boxed && 'border border-border px-1'
  );

  return (
    <span
      className={className}
      data-testid="advisor-label"
      data-boxed={boxed ? 'true' : undefined}
    >
      {role.piName}
    </span>
  );
}

function RailGroup({
  group,
  expanded,
  boxedAdvisorLabels,
}: {
  group: ExperienceGroup;
  expanded: boolean;
  boxedAdvisorLabels: boolean;
}) {
  const roles = expanded
    ? group.roles
    : group.roles.slice(0, group.visibleCount);
  const hasHidden = group.roles.length > group.visibleCount;

  return (
    <RailList>
      {roles.map((role, index) => {
        const state = role.state ?? (role.incoming ? 'incoming' : 'ended');
        const dotClassName =
          state === 'incoming'
            ? hollowDots['bg-roy-o']
            : state === 'present'
              ? 'bg-roy-o'
              : 'bg-foreground/75';
        const titleContent: ReactNode = role.piName ? (
          <span className="inline-flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
            {role.href ? (
              <ExternalLink
                href={role.href}
                section="o"
                className="text-foreground"
              >
                {role.org}
              </ExternalLink>
            ) : (
              <span>{role.org}</span>
            )}
            <AdvisorLabel role={role} boxed={boxedAdvisorLabels} />
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
            dotClassName={dotClassName}
            incoming={role.incoming}
            state={state}
            title={
              role.href && !role.piName ? (
                <ExternalLink
                  href={role.href}
                  section="o"
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
                  section="o"
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
    return value;
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
  open,
  onToggleOpen,
  expanded,
  onToggleExpanded,
  boxedAdvisorLabels,
}: {
  group: ExperienceGroup;
  open: boolean;
  onToggleOpen: () => void;
  expanded: boolean;
  onToggleExpanded: () => void;
  boxedAdvisorLabels: boolean;
}) {
  const hasHidden = group.roles.length > group.visibleCount;
  const allowShowMore = group.kind !== 'Teaching';
  const showAllRows = group.kind === 'Teaching' ? true : expanded;
  const Chevron = open ? ChevronDown : ChevronRight;

  return (
    <div
      data-testid="experience-group"
      data-group={group.kind}
      className={cn(
        'flex flex-col',
        open ? 'mb-2.5 last:mb-0' : 'mb-0.5 last:mb-0'
      )}
    >
      <button
        type="button"
        onClick={onToggleOpen}
        aria-expanded={open}
        data-testid="experience-group-toggle"
        className="grid grid-cols-[1.25rem_minmax(0,1fr)] items-center pb-2.5 text-left font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <Chevron
          className="relative bottom-px text-muted-foreground"
          size={11}
          strokeWidth={1.8}
          aria-hidden
        />
        <span data-testid="experience-group-label" data-group={group.kind}>
          {group.kind} ({group.roles.length})
        </span>
      </button>
      {open ? (
        <RailGroup
          group={group}
          expanded={showAllRows}
          boxedAdvisorLabels={boxedAdvisorLabels}
        />
      ) : null}
      {open && hasHidden && allowShowMore ? (
        <div className="flex justify-end pt-1">
          <SectionActionButton
            section="o"
            onClick={onToggleExpanded}
            testId="experience-more-control"
          >
            {expanded ? 'show less' : 'see more'}
          </SectionActionButton>
        </div>
      ) : null}
    </div>
  );
}

export function Experience({
  boxedAdvisorLabels = false,
}: {
  boxedAdvisorLabels?: boolean;
} = {}) {
  const [openGroups, setOpenGroups] = useState<
    Record<ExperienceGroup['kind'], boolean>
  >({
    Research: true,
    Engineering: true,
    Teaching: false,
  });
  const [expandedGroups, setExpandedGroups] = useState<
    Record<ExperienceGroup['kind'], boolean>
  >({
    Research: false,
    Engineering: false,
    Teaching: false,
  });

  return (
    <Section id="experience" index="2" title="Experience" accent="text-roy-o">
      <BorderedPanel>
        <div className="flex w-full flex-col">
          {experienceGroups.map((group) => (
            <RailGroupBlock
              key={group.kind}
              group={group}
              open={openGroups[group.kind]}
              onToggleOpen={() =>
                setOpenGroups((current) => ({
                  ...current,
                  [group.kind]: !current[group.kind],
                }))
              }
              expanded={expandedGroups[group.kind]}
              boxedAdvisorLabels={boxedAdvisorLabels}
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
