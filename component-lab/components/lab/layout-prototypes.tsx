import { publications } from '@/lib/lab-data';
import { Section, Variant } from './frame';
import { RailItem, RailList } from './rail';

const researchRows = [
  {
    org: 'Duke University',
    pi: 'Christian Dallago',
    date: 'Incoming Aug 2026',
    desc: 'GPU systems for protein homology search and sequence alignment.',
    incoming: true,
  },
  {
    org: 'Duke University',
    pi: 'Matthew Lentz',
    date: 'Apr 2026 — Present',
    desc: 'Token mining and codegen correctness for agents with runtime-error repair feedback loops.',
  },
  {
    org: 'Duke University',
    pi: 'Philip Romero',
    date: 'Aug 2025 — Present',
    desc: "Chemistry data-mining with Anthropic's AI for Science Program % Microsoft Research.",
  },
  {
    org: 'Duke University',
    pi: 'Navid NaderiAlizadeh',
    date: 'Oct 2024 — Apr 2025',
    desc: 'Continual learning for antibody affinity prediction.',
  },
  {
    org: 'Saudi Aramco',
    date: 'Jul 2022 — Sep 2023',
    desc: 'Polymer property prediction and synthesis for CO₂ capture.',
  },
];

function ResearchTitle({
  row,
  mode = 'inline',
}: {
  row: (typeof researchRows)[number];
  mode?: 'inline' | 'under' | 'boxed';
}) {
  if (!row.pi) {
    return row.org;
  }

  if (mode === 'under') {
    return (
      <span className="inline-flex min-w-0 flex-col">
        <span>{row.org}</span>
        <span className="font-mono text-[10px] font-normal uppercase tracking-[0.12em] text-muted-foreground">
          {row.pi}
        </span>
      </span>
    );
  }

  if (mode === 'boxed') {
    return (
      <span className="inline-flex min-w-0 flex-wrap items-baseline gap-2">
        <span>{row.org}</span>
        <span className="border border-border px-1 font-mono text-[10px] font-normal uppercase tracking-[0.12em] text-muted-foreground">
          {row.pi}
        </span>
      </span>
    );
  }

  return (
    <span className="inline-flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span>{row.org}</span>
      <span className="font-mono text-[10px] font-normal uppercase tracking-[0.12em] text-muted-foreground">
        {row.pi}
      </span>
    </span>
  );
}

function MiniSectionLabel({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3 font-mono text-xs uppercase tracking-[0.2em]">
      <span className="text-roy-o">§{index}</span>
      <span>{title}</span>
    </div>
  );
}

function CombinedRailVariant() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-[1.25rem_minmax(0,1fr)] items-center pb-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <span aria-hidden>⌄</span>
        <span>Research (5)</span>
      </div>
      <RailList>
        {researchRows.slice(0, 3).map((row, index) => (
          <RailItem
            key={`${row.org}-${row.pi ?? 'none'}-${row.date}`}
            dotClassName={
              row.incoming ? 'border border-roy-o bg-background' : 'bg-roy-o'
            }
            title={<ResearchTitle row={row} />}
            meta={row.date}
            description={row.desc}
            connector={index < 2 ? 'solid' : 'dashed'}
          />
        ))}
      </RailList>
      <div className="flex justify-end pt-1">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground underline decoration-border underline-offset-4">
          show more
        </span>
      </div>
    </div>
  );
}

function UmbrellaVariant() {
  return (
    <div className="flex w-full flex-col gap-3">
      <div>
        <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Duke University
        </div>
        <RailList>
          {researchRows.slice(0, 4).map((row, index) => (
            <RailItem
              key={`${row.org}-${row.pi ?? 'none'}-${row.date}`}
              dotClassName={
                row.incoming ? 'border border-roy-o bg-background' : 'bg-roy-o'
              }
              title={<ResearchTitle row={row} mode="under" />}
              meta={row.date}
              description={row.desc}
              connector={index < 3 ? 'solid' : 'none'}
            />
          ))}
        </RailList>
      </div>
      <div>
        <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Industry research
        </div>
        <RailList>
          <RailItem
            dotClassName="bg-roy-o"
            title="Saudi Aramco"
            meta="Jul 2022 — Sep 2023"
            description="Polymer property prediction and synthesis for CO₂ capture."
            connector="none"
          />
        </RailList>
      </div>
    </div>
  );
}

function CompressedGutterVariant() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-[1.25rem_minmax(0,1fr)_7rem] items-center pb-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <span aria-hidden>⌄</span>
        <span>Research (5)</span>
        <span className="text-right">date</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {researchRows.slice(0, 3).map((row) => (
          <div
            key={`${row.org}-${row.pi ?? 'none'}-${row.date}`}
            className="grid grid-cols-[1.25rem_minmax(0,1fr)_7rem] gap-3"
          >
            <span
              className={
                row.incoming
                  ? 'mt-1 h-2 w-2 border border-roy-o bg-background'
                  : 'mt-1 h-2 w-2 bg-roy-o'
              }
            />
            <div className="min-w-0">
              <div className="text-sm leading-tight text-foreground">
                <ResearchTitle row={row} mode="boxed" />
              </div>
              <div className="truncate text-xs leading-snug text-muted-foreground">
                {row.desc}
              </div>
            </div>
            <div className="font-mono text-[10px] text-muted-foreground">
              {row.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExperienceGroupingLabSection() {
  return (
    <Section
      index="8"
      title="Experience grouping lab"
      accent="text-roy-o"
      cols={1}
      note="Additive prototypes for the repeated-Duke problem: keep institution and advisor context without letting long project names become the row title."
    >
      <Variant label="A — inline advisor side-label" tag="candidate">
        <CombinedRailVariant />
      </Variant>
      <Variant label="B — advisor under institution">
        <UmbrellaVariant />
      </Variant>
      <Variant label="C — boxed advisor tag + compressed date gutter">
        <CompressedGutterVariant />
      </Variant>
    </Section>
  );
}

function PublicationRailVariant() {
  return (
    <RailList>
      {publications.map((publication, index) => (
        <RailItem
          key={publication.title}
          dotClassName="bg-roy-y"
          title={publication.title}
          meta={publication.date}
          description={`${publication.type}${publication.venue ? ` / ${publication.venue}` : ''}`}
          connector={index < publications.length - 1 ? 'solid' : 'none'}
        />
      ))}
    </RailList>
  );
}

function PublicationDenseVariant() {
  return (
    <div className="flex w-full flex-col">
      {publications.map((publication) => (
        <div
          key={publication.title}
          className="grid grid-cols-[4.25rem_minmax(0,1fr)_1rem] gap-3 border-t border-border py-2 first:border-t-0"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            {publication.date}
          </span>
          <div className="min-w-0">
            <div className="text-sm font-medium leading-tight text-foreground">
              {publication.title}
            </div>
            <div className="truncate font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              {publication.type}
              {publication.venue ? ` / ${publication.venue}` : ''}
            </div>
          </div>
          <span className="font-mono text-xs text-muted-foreground">›</span>
        </div>
      ))}
    </div>
  );
}

function PublicationInlineDateVariant() {
  return (
    <div className="flex w-full flex-col gap-2">
      {publications.map((publication) => (
        <div key={publication.title} className="border-t border-border pt-2">
          <div className="flex min-w-0 items-baseline justify-between gap-3">
            <div className="min-w-0 text-sm font-medium leading-tight text-foreground">
              {publication.title}
            </div>
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              {publication.date}
            </span>
          </div>
          <div className="mt-1 truncate font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            {publication.type}
            {publication.venue ? ` / ${publication.venue}` : ''}
          </div>
        </div>
      ))}
    </div>
  );
}

export function PublicationRhythmLabSection() {
  return (
    <Section
      index="9"
      title="Publication rhythm lab"
      accent="text-roy-y"
      cols={1}
      note="Spacing prototypes for the publication rows. The goal is not just a smaller date column; it is a proportional rhythm that feels related to the rest of the document."
    >
      <Variant label="A — rail-like metadata">
        <PublicationRailVariant />
      </Variant>
      <Variant label="B — compact disclosure ledger" tag="candidate">
        <PublicationDenseVariant />
      </Variant>
      <Variant label="C — inline date, no side gutter">
        <PublicationInlineDateVariant />
      </Variant>
    </Section>
  );
}

export function LayoutRhythmLabSection() {
  return (
    <Section
      index="10"
      title="Shared layout rhythm"
      accent="text-roy-r"
      cols={1}
      note="Static layout sketches for the unresolved global spacing issue: hero contact width, section marker gutter, rail marker gutter, and publication dates should not each invent a different grid."
    >
      <Variant label="A — shared rail gutter" tag="candidate">
        <div className="flex w-full flex-col gap-3">
          <MiniSectionLabel index="0" title="About" />
          <div className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-3">
            <span className="mt-1 h-2 w-2 bg-roy-r" />
            <div className="text-sm leading-snug">
              Contact links and story begin from the same content edge used by
              experience rows.
            </div>
          </div>
          <MiniSectionLabel index="1" title="Experience" />
          <CombinedRailVariant />
        </div>
      </Variant>
      <Variant label="B — compact meta column">
        <div className="grid w-full grid-cols-[8.5rem_minmax(0,1fr)] gap-4 text-sm">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            contact
            <br />
            date
            <br />
            section
          </div>
          <div className="leading-snug">
            One fixed narrow metadata column is reused anywhere a side column
            appears, including hero, publications, and article index blocks.
          </div>
        </div>
      </Variant>
      <Variant label="C — content-first, minimal gutters">
        <div className="flex w-full flex-col gap-3 text-sm">
          <MiniSectionLabel index="0" title="About" />
          <p className="leading-snug">
            Metadata collapses inline unless it earns a real structural job.
            Dates and actions sit at the edge only when they help scanning.
          </p>
          <PublicationInlineDateVariant />
        </div>
      </Variant>
    </Section>
  );
}
