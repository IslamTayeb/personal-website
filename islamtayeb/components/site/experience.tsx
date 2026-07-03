'use client';

import { type ReactNode, useState } from 'react';
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
  const label = role.roleLabel ?? role.piName;

  if (!label) {
    return null;
  }

  const className = cn(
    'reading-copy text-base font-normal leading-tight text-muted-foreground',
    role.href &&
      'group-hover/experience-title:text-roy-o group-focus-visible/experience-title:text-roy-o',
    boxed && 'inline-block border border-border px-1'
  );

  if (role.piHref && role.piName && !role.roleLabel && !role.href) {
    return (
      <ExternalLink
        href={role.piHref}
        section="o"
        className={className}
        data-testid="advisor-label"
        data-boxed={boxed ? 'true' : undefined}
      >
        {label}
      </ExternalLink>
    );
  }

  return (
    <span
      className={className}
      data-testid="advisor-label"
      data-boxed={boxed ? 'true' : undefined}
    >
      {label}
    </span>
  );
}

function WithLabel({
  role,
  boxed,
  hoverSource,
}: {
  role: ExperienceGroup['roles'][number];
  boxed: boolean;
  hoverSource: boolean;
}) {
  if (!role.withName) {
    return null;
  }

  if (!role.withHref) {
    throw new Error(`Experience role "${role.org}" is missing withHref`);
  }

  return (
    <>
      {' with '}
      <ExternalLink
        href={role.withHref}
        section="o"
        className={cn(
          'reading-copy text-base font-normal leading-tight text-muted-foreground',
          boxed && 'inline-block border border-border px-1'
        )}
        data-rail-hover-source={hoverSource ? 'true' : undefined}
        data-testid="with-label"
        data-boxed={boxed ? 'true' : undefined}
      >
        {role.withName}
      </ExternalLink>
    </>
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
        const hasLinkedWithLabel = Boolean(role.withName && role.withHref);
        const dotClassName =
          state === 'incoming'
            ? 'border border-roy-o bg-background'
            : state === 'present'
              ? 'bg-roy-o'
              : 'bg-foreground/75';
        const titleContent: ReactNode =
          role.roleLabel || role.piName ? (
            <>
              {role.org} <AdvisorLabel role={role} boxed={boxedAdvisorLabels} />
              <WithLabel
                role={role}
                boxed={boxedAdvisorLabels}
                hoverSource={state === 'ended'}
              />
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
            hoverAccent={state === 'ended' ? 'o' : undefined}
            incoming={role.incoming}
            state={state}
            title={
              role.href && !hasLinkedWithLabel ? (
                <ExternalLink
                  href={role.href}
                  section="o"
                  data-rail-hover-source={
                    state === 'ended' ? 'true' : undefined
                  }
                  data-testid="experience-title-run"
                  className="group/experience-title whitespace-break-spaces text-foreground"
                >
                  {titleContent}
                </ExternalLink>
              ) : (
                <span
                  data-testid="experience-title-run"
                  className="group/experience-title inline whitespace-break-spaces text-foreground"
                >
                  {titleContent}
                </span>
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

function FilledDisclosureArrow({ open }: { open: boolean }) {
  return (
    <span
      data-testid="experience-group-arrow"
      className="royb-link-hover-icon section-color-o inline-flex h-[var(--rail-marker-size)] w-[var(--rail-marker-size)] items-center justify-center text-current"
      aria-hidden
    >
      <span
        className={cn(
          'block h-0 w-0',
          open
            ? 'border-x-[5px] border-t-[7px] border-x-transparent border-t-current'
            : 'border-y-[5px] border-l-[7px] border-y-transparent border-l-current'
        )}
      />
    </span>
  );
}

function experienceGroupLabel(kind: ExperienceGroup['kind']) {
  return kind[0].toUpperCase() + kind.slice(1);
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
  const allowShowMore = group.kind !== 'teaching';
  const showAllRows = group.kind === 'teaching' ? true : expanded;
  const label = experienceGroupLabel(group.kind);

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
          'royb-link-hover-scope group/experience-toggle inline-grid w-fit max-w-full grid-cols-[var(--rail-gutter)_max-content] items-center text-left font-mono text-sm tracking-normal text-muted-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring',
          open || !isLast ? 'pb-2' : 'pb-0'
        )}
      >
        <FilledDisclosureArrow open={open} />
        <RoybLinkText
          data-testid="experience-group-label"
          data-group={group.kind}
          className="w-fit justify-self-start"
          section="o"
        >
          <span
            data-testid="experience-group-label-name"
            className="uppercase tracking-[0.2em]"
          >
            {label}
          </span>{' '}
          <span data-testid="experience-group-label-count">
            ({group.roles.length})
          </span>
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
        <div
          data-testid="experience-more-row"
          className="grid grid-cols-[var(--rail-gutter)_minmax(0,1fr)] pt-2"
        >
          <span aria-hidden />
          <div className="flex min-w-0 justify-start">
            <SectionActionButton
              section="o"
              onClick={onToggleExpanded}
              testId="experience-more-control"
            >
              {expanded ? 'show less...' : 'show more...'}
            </SectionActionButton>
          </div>
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
    research: true,
    engineering: true,
    teaching: false,
  });
  const [expandedGroups, setExpandedGroups] = useState<
    Record<ExperienceGroup['kind'], boolean>
  >({
    research: false,
    engineering: false,
    teaching: false,
  });

  return (
    <Section
      id="experience"
      index="2"
      title="Experience"
      accent="text-roy-o"
      divided
    >
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
