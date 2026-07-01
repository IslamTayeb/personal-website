'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  allExperienceRoles,
  experienceGroups,
  experienceKindLabel,
  type ExperienceRole,
} from '@/lib/lab-data';
import { sourceReferences } from '@/lib/usgraphics-study-data';

type FrameId = 'current' | 'sheet' | 'block';
type BenchId = 'shell' | 'hero' | 'experience' | 'publications' | 'writing';
type VariantId = 'current' | 'subtle' | 'structured' | 'reject';

type FrameOption = {
  id: FrameId;
  label: string;
  note: string;
};

type Bench = {
  id: BenchId;
  code: string;
  title: string;
  current: string;
  measuredMove: string;
  tooFar: string;
};

type Variant = {
  id: VariantId;
  label: string;
  intent: string;
  decision: string;
};

const frameOptions: FrameOption[] = [
  {
    id: 'current',
    label: 'Current paper',
    note: 'No outer desktop treatment.',
  },
  {
    id: 'sheet',
    label: 'Sheet on gray',
    note: 'Only the page boundary changes on desktop.',
  },
  {
    id: 'block',
    label: 'Hard block sheet',
    note: 'U.S. Graphics-like depth, no blur.',
  },
];

const benches: Bench[] = [
  {
    id: 'shell',
    code: 'SHL',
    title: 'Page shell',
    current: 'Narrow paper page with the ROYB band as the first signal.',
    measuredMove:
      'Try only the desktop background and hard page offset. Keep mobile unchanged.',
    tooFar: 'A heavy document frame that makes every section feel boxed.',
  },
  {
    id: 'hero',
    code: 'HRO',
    title: 'Hero / about',
    current: 'Two-column contact index and reading-copy bio.',
    measuredMove:
      'Add a small register above the contact column without changing the prose.',
    tooFar: 'Turning the bio into status chips and system labels.',
  },
  {
    id: 'experience',
    code: 'EXP',
    title: 'Experience rail',
    current:
      'Disclosure groups with rail rows, dates, dots, and one-line copy.',
    measuredMove:
      'Expose counts or advisor labels slightly more while preserving rail rhythm.',
    tooFar: 'Replacing the rail with a catalog table.',
  },
  {
    id: 'publications',
    code: 'PUB',
    title: 'Publications',
    current: 'Publication rail with title, authors, type/venue, and date.',
    measuredMove:
      'Use a tiny source/status strip only inside each existing publication row.',
    tooFar: 'Making papers look like SKUs or release notes.',
  },
  {
    id: 'writing',
    code: 'WRT',
    title: 'Writing preview',
    current: 'Three blog rows in the same rail language with New metadata.',
    measuredMove:
      'Show reading metadata and source state more explicitly, still as a rail.',
    tooFar: 'A bulletin table that stops feeling like writing.',
  },
];

const variants: Variant[] = [
  {
    id: 'current',
    label: 'Current',
    intent: 'Baseline component as it exists now.',
    decision: 'Keep as the comparison anchor.',
  },
  {
    id: 'subtle',
    label: 'Subtle',
    intent: 'One U.S. Graphics-inspired detail, applied locally.',
    decision: 'Most likely to graduate.',
  },
  {
    id: 'structured',
    label: 'Structured',
    intent: 'More explicit state, but still shaped like the current component.',
    decision: 'Useful if the current version underspecifies context.',
  },
  {
    id: 'reject',
    label: 'Too far',
    intent: 'A visible boundary for what starts to become caricature.',
    decision: 'Reject unless a specific page needs this density.',
  },
];

const writingRows = [
  {
    title: 'On using computers',
    date: 'Jun 2026',
    meta: '3K words (5 mins)',
    state: 'New',
  },
  {
    title: 'On agent memory fidelity',
    date: 'May 2026',
    meta: '2.4K words (4 mins)',
    state: 'Essay',
  },
  {
    title: 'Hydra',
    date: 'Apr 2026',
    meta: 'source-backed',
    state: 'System',
  },
];

const publications = [
  {
    date: 'Sep 2025',
    title:
      'Machine learning for predicting and optimizing the CO2 uptake in porous organic polymers',
    authors: 'Hamid Zentou, Ali Tayeb, Islam Tayeb, Mahmoud Abdelnaby',
    meta: 'Research Article / Journal of Environmental Chemical Engineering',
  },
  {
    date: 'May 2025',
    title: 'Primal dual continual learning for robust antibody design',
    authors: 'Islam Tayeb, Navid NaderiAlizadeh',
    meta: 'Pre-print',
  },
  {
    date: 'Jan 2024',
    title:
      'Post-synthetic modification of UiO-66 analogue metal-organic framework as potential solid sorbent for direct air capture',
    authors: 'Mahmoud Abdelnaby, Islam Tayeb, Ahmed Alloush, Hussain Alyosef',
    meta: 'Research Article / Journal of CO2 Utilization',
  },
];

export default function UsGraphicsStudyPage() {
  const [frameId, setFrameId] = useState<FrameId>('block');
  const [benchId, setBenchId] = useState<BenchId>('experience');
  const [picked, setPicked] = useState<Record<BenchId, VariantId>>({
    shell: 'subtle',
    hero: 'subtle',
    experience: 'subtle',
    publications: 'subtle',
    writing: 'subtle',
  });

  const activeBench = useMemo(
    () => benches.find((bench) => bench.id === benchId) ?? benches[0],
    [benchId]
  );

  return (
    <main className="current-study" data-frame={frameId}>
      <div className="current-study-sheet">
        <div className="current-royb-band" aria-hidden>
          <span />
          <span />
          <span />
          <span />
        </div>

        <header className="current-study-header">
          <div>
            <p className="current-eyebrow">
              component lab / current components
            </p>
            <h1>U.S. Graphics ideas, tested against the actual site.</h1>
          </div>
          <div className="current-register">
            <span>{benches.length} current surfaces</span>
            <span>{variants.length} options each</span>
            <span>no production edits</span>
          </div>
        </header>

        <nav className="current-nav" aria-label="Study navigation">
          <Link href="/">Back to typography lab</Link>
          <a href="#frame">Frame</a>
          <a href="#bench">Component bench</a>
          <a href="#references">References</a>
        </nav>

        <section className="current-section" id="frame">
          <StudySectionHeader
            index="0"
            title="Frame experiment"
            accent="r"
            meta="only page boundary"
          />
          <div className="current-frame-grid">
            <div className="current-frame-options">
              {frameOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={frameId === option.id}
                  onClick={() => setFrameId(option.id)}
                >
                  <strong>{option.label}</strong>
                  <span>{option.note}</span>
                </button>
              ))}
            </div>
            <CurrentPageMini frameId={frameId} />
          </div>
        </section>

        <section className="current-section" id="bench">
          <StudySectionHeader
            index="1"
            title="Component bench"
            accent="o"
            meta="current first, deltas second"
          />

          <div className="current-bench-layout">
            <aside className="current-bench-list" aria-label="Components">
              {benches.map((bench) => (
                <button
                  key={bench.id}
                  type="button"
                  aria-pressed={bench.id === activeBench.id}
                  onClick={() => setBenchId(bench.id)}
                >
                  <span>{bench.code}</span>
                  <strong>{bench.title}</strong>
                  <small>
                    picked:{' '}
                    {
                      variants.find(
                        (variant) => variant.id === picked[bench.id]
                      )?.label
                    }
                  </small>
                </button>
              ))}
            </aside>

            <div className="current-bench-main">
              <div className="current-bench-brief">
                <div>
                  <p className="current-eyebrow">{activeBench.code}</p>
                  <h2>{activeBench.title}</h2>
                </div>
                <dl>
                  <div>
                    <dt>Current</dt>
                    <dd>{activeBench.current}</dd>
                  </div>
                  <div>
                    <dt>Measured move</dt>
                    <dd>{activeBench.measuredMove}</dd>
                  </div>
                  <div>
                    <dt>Too far</dt>
                    <dd>{activeBench.tooFar}</dd>
                  </div>
                </dl>
              </div>

              <div className="current-variant-grid">
                {variants.map((variant) => (
                  <article
                    key={variant.id}
                    className="current-variant-card"
                    data-picked={picked[activeBench.id] === variant.id}
                    data-variant={variant.id}
                  >
                    <header>
                      <div>
                        <span>{variant.label}</span>
                        <h3>{variant.intent}</h3>
                      </div>
                      <button
                        type="button"
                        aria-pressed={picked[activeBench.id] === variant.id}
                        onClick={() =>
                          setPicked((current) => ({
                            ...current,
                            [activeBench.id]: variant.id,
                          }))
                        }
                      >
                        {picked[activeBench.id] === variant.id
                          ? 'picked'
                          : 'pick'}
                      </button>
                    </header>
                    <ComponentPreview
                      benchId={activeBench.id}
                      variantId={variant.id}
                    />
                    <p>{variant.decision}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="current-section" id="references">
          <StudySectionHeader
            index="2"
            title="Reference check"
            accent="b"
            meta="what is allowed to transfer"
          />
          <div className="current-reference-grid">
            {sourceReferences.slice(0, 4).map((reference) => (
              <article key={reference.id}>
                <span>{reference.title}</span>
                <p>{reference.note}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function StudySectionHeader({
  index,
  title,
  accent,
  meta,
}: {
  index: string;
  title: string;
  accent: 'r' | 'o' | 'y' | 'b';
  meta: string;
}) {
  return (
    <header className="current-section-header" data-accent={accent}>
      <div>
        <span>§{index}</span>
        <h2>{title}</h2>
      </div>
      <p>{meta}</p>
    </header>
  );
}

function CurrentPageMini({ frameId }: { frameId: FrameId }) {
  return (
    <div className="current-page-mini" data-frame={frameId}>
      <div className="current-page-mini-sheet">
        <div className="current-royb-band" aria-hidden>
          <span />
          <span />
          <span />
          <span />
        </div>
        <MiniSectionHeader index="1" title="About" accent="r" />
        <div className="current-mini-hero">
          <div>
            <span>contact</span>
            <p>email, github, scholar</p>
          </div>
          <p>
            I&apos;m a rising senior studying CS + Chemistry at Duke University
            in Durham, NC.
          </p>
        </div>
        <MiniSectionHeader index="2" title="Experience" accent="o" />
        <MiniRail rows={allExperienceRoles.slice(0, 3)} />
      </div>
    </div>
  );
}

function ComponentPreview({
  benchId,
  variantId,
}: {
  benchId: BenchId;
  variantId: VariantId;
}) {
  if (benchId === 'shell') return <ShellPreview variantId={variantId} />;
  if (benchId === 'hero') return <HeroPreview variantId={variantId} />;
  if (benchId === 'experience') {
    return <ExperiencePreview variantId={variantId} />;
  }
  if (benchId === 'publications') {
    return <PublicationsPreview variantId={variantId} />;
  }
  return <WritingPreview variantId={variantId} />;
}

function ShellPreview({ variantId }: { variantId: VariantId }) {
  const frameId: FrameId =
    variantId === 'current'
      ? 'current'
      : variantId === 'reject'
        ? 'block'
        : variantId === 'structured'
          ? 'block'
          : 'sheet';

  return (
    <div className="component-preview">
      <CurrentPageMini frameId={frameId} />
    </div>
  );
}

function HeroPreview({ variantId }: { variantId: VariantId }) {
  return (
    <div className="component-preview">
      <MiniSectionHeader index="1" title="About" accent="r" />
      <div className="study-hero-preview" data-variant={variantId}>
        <div className="study-contact-column">
          {variantId !== 'current' ? (
            <div className="study-register-line">
              <span>Durham, NC</span>
              <span>Duke CS</span>
            </div>
          ) : null}
          <span>contact</span>
          <p>email, github, scholar, linkedin</p>
        </div>
        <div className="study-story-column">
          <p>
            I&apos;m a rising senior studying CS + Chemistry at Duke University
            in Durham, NC. I&apos;m researching systems in ML, particularly
            agent correctness and efficiency.
          </p>
          <p>I usually use science, data, and coding as motivating domains.</p>
          {variantId === 'reject' ? (
            <div className="study-chip-spill" aria-label="Rejected chip spill">
              <span>CS</span>
              <span>Chem</span>
              <span>ML systems</span>
              <span>agents</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ExperiencePreview({ variantId }: { variantId: VariantId }) {
  return (
    <div className="component-preview">
      <MiniSectionHeader index="2" title="Experience" accent="o" />
      {variantId === 'reject' ? (
        <RejectTable rows={allExperienceRoles.slice(0, 4)} />
      ) : (
        <div className="study-grouped-rail" data-variant={variantId}>
          {experienceGroups.map((group, index) => (
            <div className="study-experience-group" key={group.kind}>
              <div className="study-group-toggle">
                <span>{index < 2 ? 'v' : '>'}</span>
                <strong>
                  {experienceKindLabel(group.kind)}
                  {variantId !== 'current' ? ` (${group.roles.length})` : ''}
                </strong>
              </div>
              {index < 2 ? (
                <MiniRail
                  rows={group.roles
                    .slice(0, group.visibleCount)
                    .map((role) => ({
                      ...role,
                      kind: group.kind,
                    }))}
                  variantId={variantId}
                />
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PublicationsPreview({ variantId }: { variantId: VariantId }) {
  return (
    <div className="component-preview">
      <MiniSectionHeader index="3" title="Selected Publications" accent="y" />
      {variantId === 'reject' ? (
        <RejectPublicationRows />
      ) : (
        <ul className="study-rail-list" data-variant={variantId}>
          {publications.map((publication, index) => (
            <li className="study-rail-row" key={publication.title}>
              <RailMarker
                state="ended"
                accent="y"
                connector={index < publications.length - 1 ? 'solid' : 'dashed'}
              />
              <div className="study-rail-main">
                <div className="study-rail-top">
                  <strong>{publication.title}</strong>
                  <time>{publication.date}</time>
                </div>
                <p>{publication.authors}</p>
                <span>{publication.meta}</span>
                {variantId !== 'current' ? (
                  <div className="study-row-register">
                    <span>paper</span>
                    <span>{index === 1 ? 'pre-print' : 'published'}</span>
                  </div>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function WritingPreview({ variantId }: { variantId: VariantId }) {
  return (
    <div className="component-preview">
      <MiniSectionHeader index="4" title="Writing" accent="b" />
      {variantId === 'reject' ? (
        <RejectWritingRows />
      ) : (
        <ul className="study-rail-list" data-variant={variantId}>
          {writingRows.map((row, index) => (
            <li className="study-rail-row" key={row.title}>
              <RailMarker
                state={index === 0 ? 'present' : 'ended'}
                accent="b"
                connector={index < writingRows.length - 1 ? 'solid' : 'dashed'}
              />
              <div className="study-rail-main">
                <div className="study-rail-top">
                  <strong>
                    {row.title}
                    {index === 0 ? <em>New</em> : null}
                  </strong>
                  <time>{row.date}</time>
                </div>
                <p>{row.meta}</p>
                {variantId !== 'current' ? (
                  <div className="study-row-register">
                    <span>{row.state}</span>
                    <span>{index === 0 ? 'listed' : 'archive'}</span>
                  </div>
                ) : null}
              </div>
            </li>
          ))}
          <li className="study-action-row">show more on blog...</li>
        </ul>
      )}
    </div>
  );
}

function MiniSectionHeader({
  index,
  title,
  accent,
}: {
  index: string;
  title: string;
  accent: 'r' | 'o' | 'y' | 'b';
}) {
  return (
    <div className="mini-section-header" data-accent={accent}>
      <span>§{index}</span>
      <strong>{title}</strong>
    </div>
  );
}

function MiniRail({
  rows,
  variantId = 'current',
}: {
  rows: ExperienceRole[];
  variantId?: VariantId;
}) {
  return (
    <ul className="study-rail-list" data-variant={variantId}>
      {rows.map((role, index) => (
        <li
          className="study-rail-row"
          data-state={role.state}
          key={`${role.kind}-${role.org}-${role.date}`}
        >
          <RailMarker
            state={role.state}
            accent="o"
            connector={index < rows.length - 1 ? 'solid' : 'none'}
          />
          <div className="study-rail-main">
            <div className="study-rail-top">
              <strong>
                {role.org}
                {role.piName ? <span>{role.piName}</span> : null}
              </strong>
              <time>{role.date}</time>
            </div>
            <p>{role.desc}</p>
            {variantId === 'structured' ? (
              <div className="study-row-register">
                <span>{role.kind}</span>
                <span>{role.state}</span>
              </div>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

function RailMarker({
  state,
  accent,
  connector,
}: {
  state: ExperienceRole['state'];
  accent: 'o' | 'y' | 'b';
  connector: 'solid' | 'dashed' | 'none';
}) {
  return (
    <span className="study-marker-wrap">
      {connector !== 'none' ? (
        <span className="study-marker-line" data-connector={connector} />
      ) : null}
      <span
        className="study-marker-dot"
        data-state={state}
        data-accent={accent}
      />
    </span>
  );
}

function RejectTable({ rows }: { rows: ExperienceRole[] }) {
  return (
    <table className="reject-table">
      <tbody>
        {rows.map((row) => (
          <tr key={`${row.org}-${row.date}`}>
            <th>{row.kind.toUpperCase()}</th>
            <td>{row.org}</td>
            <td>{row.date}</td>
            <td>{row.desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function RejectPublicationRows() {
  return (
    <table className="reject-table">
      <tbody>
        {publications.map((publication, index) => (
          <tr key={publication.title}>
            <th>PUB-{index + 1}</th>
            <td>{publication.date}</td>
            <td>{publication.title}</td>
            <td>{publication.meta}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function RejectWritingRows() {
  return (
    <table className="reject-table">
      <tbody>
        {writingRows.map((row, index) => (
          <tr key={row.title}>
            <th>WR-{index + 1}</th>
            <td>{row.date}</td>
            <td>{row.title}</td>
            <td>{row.meta}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
