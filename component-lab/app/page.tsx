'use client';

import type { CSSProperties } from 'react';
import { useMemo, useState } from 'react';
import {
  allExperienceRoles,
  experienceGroups,
  experienceKindLabel,
  type ExperienceKind,
  type ExperienceRole,
} from '@/lib/lab-data';

type FontCandidate = {
  id: string;
  label: string;
  family: string;
  group: 'baseline' | 'reliable' | 'distinct';
  note: string;
  use: string;
};

type FocusFilter =
  'all' | ExperienceKind | 'current' | 'past' | 'duke' | 'outside';

const sansCandidates: FontCandidate[] = [
  {
    id: 'verdana',
    label: 'Verdana',
    family: 'Verdana, Geneva, sans-serif',
    group: 'baseline',
    note: 'Current baseline. Wide, sturdy, very plain-HTML.',
    use: 'Best when the site should feel unfussy and handmade.',
  },
  {
    id: 'open-sans',
    label: 'Open Sans',
    family: 'var(--font-open-sans), Arial, sans-serif',
    group: 'reliable',
    note: 'Wide, familiar, and calm across long paragraphs.',
    use: 'Good if Verdana feels right but too old-browser.',
  },
  {
    id: 'work-sans',
    label: 'Work Sans',
    family: 'var(--font-work-sans), Arial, sans-serif',
    group: 'reliable',
    note: 'Open, warm, and broad without feeling decorative.',
    use: 'Good one-font candidate for body plus experience rows.',
  },
  {
    id: 'source-sans-3',
    label: 'Source Sans 3',
    family: 'var(--font-source-sans-3), Arial, sans-serif',
    group: 'reliable',
    note: 'Humanist, open, and low-drama at essay sizes.',
    use: 'Good if you want Open Sans energy with less default-web feel.',
  },
  {
    id: 'noto-sans',
    label: 'Noto Sans',
    family: 'var(--font-noto-sans), Arial, sans-serif',
    group: 'reliable',
    note: 'Broad, neutral, sturdy, and intentionally unsurprising.',
    use: 'Good if the font should disappear but keep Verdana-like openness.',
  },
  {
    id: 'lato',
    label: 'Lato',
    family: 'var(--font-lato), Arial, sans-serif',
    group: 'reliable',
    note: 'Wide and friendly, with a slightly older web texture.',
    use: 'Good if Open Sans feels too neutral and Work Sans too soft.',
  },
  {
    id: 'nunito-sans',
    label: 'Nunito Sans',
    family: 'var(--font-nunito-sans), Arial, sans-serif',
    group: 'reliable',
    note: 'Rounded and open; more approachable than Verdana.',
    use: 'Good readability test, but may feel too soft for the site.',
  },
  {
    id: 'fira-sans',
    label: 'Fira Sans',
    family: 'var(--font-fira-sans), Arial, sans-serif',
    group: 'reliable',
    note: 'Wide humanist sans with a technical Mozilla-era feel.',
    use: 'Good if you want a systems tone without going geometric.',
  },
  {
    id: 'atkinson',
    label: 'Atkinson',
    family: 'var(--font-atkinson), Arial, sans-serif',
    group: 'reliable',
    note: 'Wide, accessible, and purpose-built for legibility.',
    use: 'Good if Verdana works but you want more deliberate readability.',
  },
  {
    id: 'cabin',
    label: 'Cabin',
    family: 'var(--font-cabin), Arial, sans-serif',
    group: 'reliable',
    note: 'Open humanist sans, a little warmer than Open Sans.',
    use: 'Good if you want width and friendliness without roundness.',
  },
];

const monoCandidates: FontCandidate[] = [
  {
    id: 'dm-mono',
    label: 'DM Mono',
    family: 'var(--font-dm-mono), ui-monospace, SFMono-Regular, monospace',
    group: 'baseline',
    note: 'Current baseline. Quiet and slightly soft.',
    use: 'Keep if mono is mostly labels and dates.',
  },
  {
    id: 'ui-mono',
    label: 'UI Mono',
    family:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
    group: 'baseline',
    note: 'Native and efficient on Apple/Windows.',
    use: 'Most readable fallback for dates and compact controls.',
  },
  {
    id: 'geist-mono',
    label: 'Geist Mono',
    family: 'var(--font-geist-mono), ui-monospace, monospace',
    group: 'distinct',
    note: 'Clean developer-docs mono with tighter rhythm than DM Mono.',
    use: 'Good if the mono labels should match Geist-like technical polish.',
  },
  {
    id: 'plex-mono',
    label: 'IBM Plex Mono',
    family: 'var(--font-ibm-plex-mono), ui-monospace, monospace',
    group: 'distinct',
    note: 'Clearer technical voice, more mechanical.',
    use: 'Good if metadata should feel sharper.',
  },
  {
    id: 'roboto-mono',
    label: 'Roboto Mono',
    family: 'var(--font-roboto-mono), ui-monospace, monospace',
    group: 'reliable',
    note: 'Readable at small sizes, less personality.',
    use: 'Good for long dates and dense metadata.',
  },
  {
    id: 'courier',
    label: 'Courier New',
    family: '"Courier New", Courier, monospace',
    group: 'baseline',
    note: 'Old web texture, weaker screen density.',
    use: 'Useful as a stress test, probably not the winner.',
  },
];

const focusFilters: { id: FocusFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'research', label: 'Research' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'teaching', label: 'Teaching' },
  { id: 'current', label: 'Current' },
  { id: 'past', label: 'Past' },
  { id: 'duke', label: 'Duke' },
  { id: 'outside', label: 'Outside' },
];

function filterRoles(filter: FocusFilter) {
  if (filter === 'all') {
    return allExperienceRoles;
  }

  if (filter === 'current') {
    return allExperienceRoles.filter((role) => role.state !== 'ended');
  }

  if (filter === 'past') {
    return allExperienceRoles.filter((role) => role.state === 'ended');
  }

  if (filter === 'duke') {
    return allExperienceRoles.filter((role) => role.org.includes('Duke'));
  }

  if (filter === 'outside') {
    return allExperienceRoles.filter((role) => !role.org.includes('Duke'));
  }

  return allExperienceRoles.filter((role) => role.kind === filter);
}

function fontById(candidates: FontCandidate[], id: string) {
  return candidates.find((candidate) => candidate.id === id) ?? candidates[0];
}

export default function LabPage() {
  const [selectedSansId, setSelectedSansId] = useState('open-sans');
  const [selectedMonoId, setSelectedMonoId] = useState('ui-mono');
  const [experienceMode, setExperienceMode] = useState<'grouped' | 'focus'>(
    'focus'
  );
  const selectedSans = fontById(sansCandidates, selectedSansId);
  const selectedMono = fontById(monoCandidates, selectedMonoId);
  const labStyle = {
    '--lab-sans': selectedSans.family,
    '--lab-mono': selectedMono.family,
  } as CSSProperties;

  return (
    <main className="lab-shell" style={labStyle}>
      <div className="royb-band" />
      <header className="lab-header">
        <div>
          <p className="eyebrow">component lab</p>
          <h1>Typography and experience chopping block</h1>
        </div>
        <div className="active-stack" aria-label="Active type pairing">
          <span>{selectedSans.label}</span>
          <span>{selectedMono.label}</span>
        </div>
      </header>

      <section className="lab-section font-workbench" aria-labelledby="fonts">
        <SectionTitle index="1" id="fonts">
          Fonts
        </SectionTitle>
        <div className="font-grid">
          <FontChooser
            title="Sans"
            candidates={sansCandidates}
            selectedId={selectedSansId}
            onSelect={setSelectedSansId}
          />
          <FontChooser
            title="Mono"
            candidates={monoCandidates}
            selectedId={selectedMonoId}
            onSelect={setSelectedMonoId}
          />
          <TypeSpecimen sans={selectedSans} mono={selectedMono} />
        </div>
      </section>

      <section className="lab-section" aria-labelledby="experience">
        <div className="section-title-row">
          <SectionTitle index="2" id="experience">
            Experience
          </SectionTitle>
          <SegmentedControl
            value={experienceMode}
            options={[
              { id: 'focus', label: 'Focus rail' },
              { id: 'grouped', label: 'Grouped' },
            ]}
            onChange={setExperienceMode}
          />
        </div>
        {experienceMode === 'focus' ? (
          <FocusExperience />
        ) : (
          <GroupedExperience />
        )}
      </section>
    </main>
  );
}

function SectionTitle({
  index,
  id,
  children,
}: {
  index: string;
  id: string;
  children: string;
}) {
  return (
    <h2 className="section-title" id={id}>
      <span>#{index}</span>
      {children}
    </h2>
  );
}

function FontChooser({
  title,
  candidates,
  selectedId,
  onSelect,
}: {
  title: string;
  candidates: FontCandidate[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="choice-panel">
      <h3>{title}</h3>
      <div className="choice-list">
        {candidates.map((candidate) => (
          <button
            key={candidate.id}
            type="button"
            className="choice-row"
            data-font-candidate={candidate.id}
            aria-pressed={candidate.id === selectedId}
            style={{ fontFamily: candidate.family }}
            onClick={() => onSelect(candidate.id)}
          >
            <span className="choice-name">{candidate.label}</span>
            <span className="choice-tag">{candidate.group}</span>
            <span className="choice-note">{candidate.note}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function TypeSpecimen({
  sans,
  mono,
}: {
  sans: FontCandidate;
  mono: FontCandidate;
}) {
  return (
    <div className="specimen">
      <div className="specimen-heading">
        <p className="eyebrow">active specimen</p>
        <h3>Systems notes, application edges</h3>
      </div>
      <p className="essay-copy">
        I am most interested in feedback loops for agents: validators, runtime
        pressure, test signals, and the strange places where research artifacts
        become infrastructure. The site should read like a plain document, but
        the hierarchy still needs to survive scanning.
      </p>
      <ul className="experience-bullets">
        <li>Agent runtime benchmarks with compact metadata.</li>
        <li>AI-bio work described through concrete validation loops.</li>
        <li>
          Writing previews that stay readable without becoming decorative.
        </li>
      </ul>
      <div className="metadata-strip">
        <span style={{ fontFamily: mono.family }}>Apr 2026 - Present</span>
        <span style={{ fontFamily: mono.family }}>3K words (5 mins)</span>
        <span style={{ fontFamily: mono.family }}>show more...</span>
      </div>
      <dl className="font-notes">
        <div>
          <dt>Sans read</dt>
          <dd>{sans.use}</dd>
        </div>
        <div>
          <dt>Mono read</dt>
          <dd>{mono.use}</dd>
        </div>
      </dl>
    </div>
  );
}

function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { id: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="segmented-control">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          data-segment-option={option.id}
          aria-pressed={option.id === value}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function GroupedExperience() {
  const [openGroups, setOpenGroups] = useState<Record<ExperienceKind, boolean>>(
    {
      research: true,
      engineering: true,
      teaching: false,
    }
  );
  const [expandedGroups, setExpandedGroups] = useState<
    Record<ExperienceKind, boolean>
  >({
    research: false,
    engineering: false,
    teaching: true,
  });

  return (
    <div className="experience-board">
      {experienceGroups.map((group) => {
        const isOpen = openGroups[group.kind];
        const isExpanded = expandedGroups[group.kind];
        const hasHidden = group.roles.length > group.visibleCount;
        const roles = isExpanded
          ? group.roles
          : group.roles.slice(0, group.visibleCount);
        const hiddenCount = group.roles.length - roles.length;

        return (
          <section className="group-block" key={group.kind}>
            <button
              type="button"
              className="group-toggle"
              aria-expanded={isOpen}
              onClick={() =>
                setOpenGroups((current) => ({
                  ...current,
                  [group.kind]: !current[group.kind],
                }))
              }
            >
              <span className="disclosure">{isOpen ? 'v' : '>'}</span>
              <span>
                {experienceKindLabel(group.kind)} ({group.roles.length})
              </span>
            </button>
            {isOpen ? (
              <RoleRail
                roles={roles.map((role) => ({ ...role, kind: group.kind }))}
                action={
                  hasHidden ? (
                    <button
                      type="button"
                      className="rail-action"
                      onClick={() =>
                        setExpandedGroups((current) => ({
                          ...current,
                          [group.kind]: !current[group.kind],
                        }))
                      }
                    >
                      {isExpanded
                        ? 'show less...'
                        : `show ${hiddenCount} more...`}
                    </button>
                  ) : null
                }
              />
            ) : null}
          </section>
        );
      })}
    </div>
  );
}

function FocusExperience() {
  const [filter, setFilter] = useState<FocusFilter>('all');
  const [showAll, setShowAll] = useState(false);
  const filteredRoles = useMemo(() => filterRoles(filter), [filter]);
  const visibleLimit = filter === 'all' ? 6 : 4;
  const visibleRoles = showAll
    ? filteredRoles
    : filteredRoles.slice(0, visibleLimit);
  const hiddenCount = filteredRoles.length - visibleRoles.length;

  return (
    <div className="focus-layout">
      <div className="filter-strip" aria-label="Experience filters">
        {focusFilters.map((option) => (
          <button
            key={option.id}
            type="button"
            data-filter-option={option.id}
            aria-pressed={filter === option.id}
            onClick={() => {
              setFilter(option.id);
              setShowAll(false);
            }}
          >
            <span>{option.label}</span>
            <span>{filterRoles(option.id).length}</span>
          </button>
        ))}
      </div>
      <div className="focus-summary">
        <span>
          {focusFilters.find((option) => option.id === filter)?.label}
        </span>
        <span>{filteredRoles.length} roles</span>
      </div>
      <RoleRail
        roles={visibleRoles}
        action={
          hiddenCount > 0 ? (
            <button
              type="button"
              className="rail-action"
              onClick={() => setShowAll(true)}
            >
              show {hiddenCount} more...
            </button>
          ) : showAll && filteredRoles.length > visibleLimit ? (
            <button
              type="button"
              className="rail-action"
              onClick={() => setShowAll(false)}
            >
              show less...
            </button>
          ) : null
        }
      />
    </div>
  );
}

function RoleRail({
  roles,
  action,
}: {
  roles: ExperienceRole[];
  action?: React.ReactNode;
}) {
  return (
    <ol className="role-rail">
      {roles.map((role, index) => (
        <RoleRow
          key={`${role.kind}-${role.org}-${role.piName ?? 'none'}-${role.date}`}
          role={role}
          isLast={index === roles.length - 1 && !action}
        />
      ))}
      {action ? (
        <li className="role-action-row">
          <span aria-hidden />
          <div>{action}</div>
        </li>
      ) : null}
    </ol>
  );
}

function RoleRow({ role, isLast }: { role: ExperienceRole; isLast: boolean }) {
  return (
    <li className="role-row" data-kind={role.kind} data-state={role.state}>
      {!isLast ? <span className="rail-line" aria-hidden /> : null}
      <span className="rail-dot" aria-hidden />
      <div className="role-main">
        <div className="role-topline">
          <div className="role-title">
            {role.href ? (
              <a href={role.href} target="_blank" rel="noreferrer">
                {role.org}
              </a>
            ) : (
              <span>{role.org}</span>
            )}
            {role.piName ? <span>{role.piName}</span> : null}
          </div>
          <time>{role.date}</time>
        </div>
        <p>{role.desc}</p>
        <span className="kind-chip">{experienceKindLabel(role.kind)}</span>
      </div>
    </li>
  );
}
