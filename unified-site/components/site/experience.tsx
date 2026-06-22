'use client';

import { type ReactNode, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { experienceGroups, type ExperienceGroup } from '@/data/experience';
import { ExternalLink } from '@/components/primitives/external-link';
import { RailItem, RailList } from '@/components/primitives/rail';
import { RichText } from '@/components/primitives/rich-text';
import { RoybLinkText } from '@/components/primitives/royb-link';
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
    'text-[#6B6965] group-hover:text-[var(--section-color)]',
    boxed && 'inline-block border border-border px-1'
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
            ? 'border border-roy-o bg-background'
            : state === 'present'
              ? 'bg-roy-o'
              : 'bg-foreground/75';
        const titleContent: ReactNode = role.piName ? (
          <>
            {role.org}
            <span className="text-[#DFDEDB] group-hover:text-[var(--section-color)]">
              {' / '}
            </span>
            <AdvisorLabel role={role} boxed={boxedAdvisorLabels} />
          </>
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
              role.href ? (
                <ExternalLink
                  href={role.href}
                  section="o"
                  className="group text-foreground"
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
                <RichText text={role.desc} />
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
          <span key={`text-${index}`}>
            <RichText text={renderStaticText(segment.text)} />
          </span>
        )
      )}
    </>
  );
}

function RailGroupBlock({
  group,
  open,
  isLast,
  onToggleOpen,
  expanded,
  onToggleExpanded,
  boxedAdvisorLabels,
}: {
  group: ExperienceGroup;
  open: boolean;
  isLast: boolean;
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
        className={cn(
          'grid grid-cols-[var(--rail-gutter)_minmax(0,1fr)] items-center text-left font-mono text-sm uppercase tracking-[0.18em] text-muted-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring',
          open || !isLast ? 'pb-2' : 'pb-0'
        )}
      >
        <Chevron
          className="relative bottom-px left-px text-muted-foreground"
          size={12}
          strokeWidth={1.8}
          aria-hidden
        />
        <RoybLinkText
          data-testid="experience-group-label"
          data-group={group.kind}
          className="w-fit justify-self-start"
          section="o"
        >
          {group.kind} ({group.roles.length})
        </RoybLinkText>
      </button>
      {open ? (
        <RailGroup
          group={group}
          expanded={showAllRows}
          boxedAdvisorLabels={boxedAdvisorLabels}
        />
      ) : null}
      {open && hasHidden && allowShowMore ? (
        <div className="flex justify-end pt-2">
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
          {experienceGroups.map((group, index) => (
            <RailGroupBlock
              key={group.kind}
              group={group}
              open={openGroups[group.kind]}
              isLast={index === experienceGroups.length - 1}
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
