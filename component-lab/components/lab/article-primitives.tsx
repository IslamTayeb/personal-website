/* eslint-disable @next/next/no-img-element */
import { Section, Variant } from './frame';

const tocSections = [
  {
    num: '0',
    title: 'Background',
    subs: ['Context as a constant', 'Context as a variable'],
  },
  {
    num: '1',
    title: 'Decant',
    subs: ['Fidelity Engine', 'Updated Git Blame', 'User Control'],
  },
  {
    num: '2',
    title: 'Evaluation',
    subs: ['Selective Memory Under Future Work', 'Fanout'],
  },
  { num: '3', title: 'Limitations', subs: [] },
  { num: '4', title: 'Afterword', subs: [] },
];

const meta = [
  ['Reading time', '~2.1K words, ~8 min'],
  ['Last updated', 'Jun 07, 2026'],
  ['Code', 'GitHub'],
];

const pythonSnippet = `class Topic:
    topic_id: str
    summary: str
    messages: list[Message]
    token_estimate: int
    fidelity: "full" | "summary" | "hidden"`;

const jsonSnippet = `{
  "topic": "stable snake_case topic label",
  "is_new_topic": "boolean",
  "message_summary": "summary of this assistant response only",
  "placeholder": "short 5-10 word stub",
  "key_facts": ["facts worth preserving through compression"]
}`;

const tableRows = [
  ['Default compaction', '0/3', '3/12', '144/144', '320K', '$0.79'],
  ['RGB-agent', '3/3', '12/12', '144/144', '305K', '$0.80'],
  ['Decant', '3/3', '12/12', '144/144', '277K', '$0.62'],
];

function TocLinks() {
  return (
    <div className="flex flex-col gap-2">
      {tocSections.map((section) => (
        <div key={section.title}>
          <a
            href="#"
            className="text-sm font-medium underline underline-offset-2"
          >
            <span className="mr-2 font-mono text-xs text-muted-foreground">
              {section.num}
            </span>
            {section.title}
          </a>
          {section.subs.length > 0 ? (
            <div className="ml-5 mt-1 flex flex-col gap-0.5 border-l border-border pl-3">
              {section.subs.map((sub) => (
                <a
                  key={sub}
                  href="#"
                  className="text-xs text-muted-foreground no-underline hover:underline"
                >
                  {sub}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function TocMeta({ border = true }: { border?: boolean }) {
  return (
    <div
      className={`flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground ${
        border
          ? 'border-t border-border pt-3 md:border-l md:border-t-0 md:pl-4 md:pt-0'
          : ''
      }`}
    >
      {meta.map(([label, value]) => (
        <div key={label}>
          <strong className="text-foreground">{label}</strong>
          <br />
          <span>{value}</span>
        </div>
      ))}
    </div>
  );
}

function CodeSample({
  palette,
}: {
  palette: 'default' | 'royb' | 'saturated';
}) {
  const colors =
    palette === 'default'
      ? {
          key: 'text-[#007020]',
          title: 'text-[#06287e]',
          string: 'text-[#4070a0]',
          comment: 'text-[#60a0b0]',
        }
      : palette === 'royb'
        ? {
            key: 'text-roy-r',
            title: 'text-roy-b',
            string: 'text-roy-o',
            comment: 'text-muted-foreground',
          }
        : {
            key: 'text-[#d53220]',
            title: 'text-[#2458d3]',
            string: 'text-[#b65a00]',
            comment: 'text-[#4a8792]',
          };
  const fidelityLine = '    fidelity: "full" | "summary" | "hidden"';

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <pre className="overflow-x-auto bg-muted p-3 font-mono text-[10px] leading-snug">
        <code>
          <span className={colors.key}>class</span>{' '}
          <span className={colors.title}>Topic</span>
          {pythonSnippet
            .replace('class Topic', '')
            .split('\n')
            .map((line) => (
              <span key={line}>
                {'\n'}
                {line === fidelityLine ? (
                  <>
                    {'    fidelity: '}
                    <span className={colors.string}>
                      {'"full" | "summary" | "hidden"'}
                    </span>
                  </>
                ) : (
                  line
                )}
              </span>
            ))}
        </code>
      </pre>
      <pre className="overflow-x-auto bg-muted p-3 font-mono text-[10px] leading-snug">
        <code>
          {jsonSnippet.split('\n').map((line) => (
            <span key={line}>
              {line.includes('"') ? (
                <>
                  <span className={colors.string}>{line}</span>
                  {'\n'}
                </>
              ) : (
                <>
                  <span className={colors.comment}>{line}</span>
                  {'\n'}
                </>
              )}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

function SampleTable({
  mode,
}: {
  mode: 'apm' | 'alternate' | 'caption' | 'ledger';
}) {
  const table = (
    <table className="w-full min-w-full border-collapse text-[11px]">
      <thead>
        <tr>
          {[
            'Condition',
            'Runs Passed',
            'Old-Fact Recall',
            'Current Work',
            'Avg Query Tokens',
            'Avg Total Cost',
          ].map((head) => (
            <th
              key={head}
              className={`px-2 py-1.5 text-left font-semibold ${
                mode === 'ledger' ? 'border-b border-border' : 'bg-muted'
              }`}
            >
              {head}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tableRows.map((row, index) => (
          <tr
            key={row[0]}
            className={
              mode === 'alternate' || mode === 'caption'
                ? index % 2 === 0
                  ? 'bg-muted/45'
                  : 'bg-background'
                : ''
            }
          >
            {row.map((cell, cellIndex) => (
              <td
                key={cell}
                className={`px-2 py-1.5 align-top ${
                  mode === 'ledger' ? 'border-b border-border/70' : ''
                } ${cellIndex > 0 ? 'text-right font-mono' : ''}`}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  if (mode !== 'caption') {
    return <div className="w-full overflow-x-auto">{table}</div>;
  }

  return (
    <figure className="w-full">
      <figcaption className="mb-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
        Selective memory under future work
      </figcaption>
      <div className="overflow-x-auto">{table}</div>
    </figure>
  );
}

export function ArticlePrimitivesSection() {
  return (
    <Section
      index="7"
      title="Article / Blog primitives"
      accent="text-roy-b"
      cols={1}
      note="Additive lab for APM Overflow article primitives. Real snippets from the Decant post, with multiple options for the places that still need a design decision."
    >
      <Variant label="Index A — APM baseline" tag="toc">
        <div className="flex w-full flex-col gap-5 border border-border bg-muted/45 p-4 md:flex-row md:justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="font-mono text-xs uppercase tracking-[0.18em]">
              Index
            </h3>
            <div className="mt-3">
              <TocLinks />
            </div>
          </div>
          <TocMeta />
        </div>
      </Variant>

      <Variant label="Index B — grey field">
        <div className="w-full bg-muted/60 p-4">
          <div className="grid gap-5 md:grid-cols-[1fr_12rem]">
            <TocLinks />
            <TocMeta border={false} />
          </div>
        </div>
      </Variant>

      <Variant label="Index C — corner ticks" tag="separator">
        <div className="relative w-full p-4">
          <span className="absolute left-0 top-0 h-4 w-4 border-l border-t border-roy-b" />
          <span className="absolute right-0 top-0 h-4 w-4 border-r border-t border-roy-b" />
          <span className="absolute bottom-0 left-0 h-4 w-4 border-b border-l border-roy-b" />
          <span className="absolute bottom-0 right-0 h-4 w-4 border-b border-r border-roy-b" />
          <div className="grid gap-5 md:grid-cols-[1fr_12rem]">
            <TocLinks />
            <TocMeta border={false} />
          </div>
        </div>
      </Variant>

      <Variant label="Index D — compact rail">
        <div className="grid w-full gap-2">
          {tocSections.map((section) => (
            <div
              key={section.title}
              className="grid grid-cols-[2rem_1fr] gap-3"
            >
              <span className="font-mono text-xs text-roy-b">
                {section.num}
              </span>
              <span className="border-b border-border pb-1 text-sm">
                {section.title}
              </span>
            </div>
          ))}
          <div className="mt-2 grid gap-2 border-t border-border pt-2 md:grid-cols-3">
            {meta.map(([label, value]) => (
              <p
                key={label}
                className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
              >
                <strong className="text-foreground">{label}</strong>
                <br />
                {value}
              </p>
            ))}
          </div>
        </div>
      </Variant>

      <Variant label="Index E — dense ledger">
        <div className="w-full">
          <div className="grid grid-cols-[1fr_auto] border-b border-border py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            <span>Section</span>
            <span>Meta</span>
          </div>
          {tocSections.map((section) => (
            <div
              key={section.title}
              className="grid grid-cols-[1fr_auto] border-b border-border/70 py-1.5"
            >
              <span className="text-sm">
                <span className="mr-2 font-mono text-xs text-muted-foreground">
                  {section.num}
                </span>
                {section.title}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {section.subs.length} sub
              </span>
            </div>
          ))}
        </div>
      </Variant>

      <Variant label="Headings A — strong H2 / mono H3">
        <div className="w-full">
          <h2 className="text-xl font-semibold tracking-tight">Decant</h2>
          <p className="mt-2 text-sm leading-snug">
            Decant allows agents to treat context as a collection of message
            objects grouped into topics.
          </p>
          <h3 className="mt-4 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Fidelity Engine
          </h3>
          <p className="mt-1 text-sm leading-snug text-muted-foreground">
            A smaller subheading that cannot be confused for a section break.
          </p>
        </div>
      </Variant>

      <Variant label="Code A — default highlight">
        <CodeSample palette="default" />
      </Variant>
      <Variant label="Code B — ROYB syntax" tag="candidate">
        <CodeSample palette="royb" />
      </Variant>
      <Variant label="Code C — saturated default">
        <CodeSample palette="saturated" />
      </Variant>

      <Variant label="Table A — APM baseline">
        <SampleTable mode="apm" />
      </Variant>
      <Variant label="Table B — alternating rows">
        <SampleTable mode="alternate" />
      </Variant>
      <Variant label="Table C — captioned table">
        <SampleTable mode="caption" />
      </Variant>
      <Variant label="Table D — dense ledger">
        <SampleTable mode="ledger" />
      </Variant>

      <Variant label="References A — compact inline">
        <p className="text-sm leading-snug">
          A post-hoc GPT-5.5 judge scored the five standard blame answers from 0
          to 1.<sup className="font-mono text-roy-b">5</sup>
        </p>
      </Variant>
      <Variant label="References B — muted bracket">
        <p className="text-sm leading-snug">
          The answer can still cite the session message that produced it{' '}
          <span className="font-mono text-[10px] text-muted-foreground">
            [fn 5]
          </span>
          .
        </p>
      </Variant>
      <Variant label="References C — side note line">
        <div className="grid gap-2 border-l border-border pl-3">
          <p className="text-sm leading-snug">
            The judge saw the question, expected rationale facts, forbidden
            distractors, and final answer.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            fn 5 · post-hoc semantic score
          </p>
        </div>
      </Variant>
      <Variant label="References D — APM ordered footnotes">
        <ol className="list-decimal space-y-2 pl-5 text-xs leading-relaxed text-muted-foreground">
          <li>
            Credit to Alexis for coining the term{' '}
            <span className="font-mono text-[10px]">↩</span>
          </li>
          <li>
            How much of a message actually reaches the prompt.{' '}
            <span className="font-mono text-[10px]">↩</span>
          </li>
        </ol>
      </Variant>

      <Variant label="Media — APM caption baseline">
        <figure className="w-full">
          <img
            src="https://raw.githubusercontent.com/islamtayeb/obsidian-files/main/On%20Agent%20Memory%20Fidelity%20%28Decant%29-1.png"
            alt="Three diagrams comparing context as a constant, an editable string, and message objects with fidelity controls."
            className="mx-auto block h-auto max-w-full border-0"
          />
          <figcaption className="mt-2 text-center text-xs italic leading-snug text-muted-foreground">
            The three framings side by side. Cleanup fires only at the
            compaction threshold in (1) but every turn in (2) and (3).
          </figcaption>
        </figure>
      </Variant>
    </Section>
  );
}
