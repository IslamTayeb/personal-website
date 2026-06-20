import { Section, Variant } from './frame';

// The fixed legend — each color permanently means one thing site-wide.
const LEGEND: { color: string; text: string; label: string }[] = [
  { color: 'bg-roy-r', text: 'text-roy-r', label: 'islam / personal' },
  { color: 'bg-roy-o', text: 'text-roy-o', label: 'engineering' },
  { color: 'bg-roy-y', text: 'text-roy-y', label: 'research' },
  { color: 'bg-roy-b', text: 'text-roy-b', label: 'blog / apm' },
];

// A tiny stand-in for one page section: a label and a few dotted item lines.
function MiniSection({ label, dots }: { label: string; dots: string[] }) {
  return (
    <div className="flex flex-col gap-1.5 border-t border-border pt-2">
      <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </span>
      <ul className="flex flex-col gap-1">
        {dots.map((d, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 shrink-0 ${d}`} />
            <span className="h-1 w-full max-w-[7rem] bg-muted" />
          </li>
        ))}
      </ul>
    </div>
  );
}

// INTER: each section commits to ONE color; the page reads R→O→Y→B top to
// bottom, but every section is internally monochrome (even mixed ones).
function InterMini() {
  return (
    <div className="flex w-full flex-col gap-3">
      <MiniSection label="01 about" dots={['bg-roy-r', 'bg-roy-r']} />
      <MiniSection
        label="02 experience"
        dots={['bg-roy-o', 'bg-roy-o', 'bg-roy-o']}
      />
      <MiniSection label="03 writing" dots={['bg-roy-y', 'bg-roy-y']} />
      <MiniSection label="04 apm" dots={['bg-roy-b', 'bg-roy-b']} />
      <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
        clean rainbow scroll · but color means nothing
      </p>
    </div>
  );
}

// LEGEND / INTRA: colors carry fixed meaning. Each section shows only the
// colors it actually contains; the full ROYB emerges across the whole page.
function LegendMini() {
  return (
    <div className="flex w-full flex-col gap-3">
      <MiniSection label="01 about" dots={['bg-roy-r']} />
      <MiniSection
        label="02 experience"
        dots={['bg-roy-y', 'bg-roy-o', 'bg-roy-o']}
      />
      <MiniSection label="03 writing" dots={['bg-roy-b', 'bg-roy-b']} />
      <MiniSection label="04 apm" dots={['bg-roy-b']} />
      <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
        full royb in aggregate · color = meaning
      </p>
    </div>
  );
}

export function AccentSection() {
  return (
    <Section
      index="06"
      title="ROYB — how to actually decide"
      accent="text-roy-y"
      note="v.04 — a real decider instead of theory. The legend below fixes one meaning per color site-wide. Then compare two miniatures of the WHOLE page: INTER paints each section a single color (clean rainbow scroll, but the color is decoration), vs LEGEND/INTRA where each section shows only the colors it contains and the full ROYB appears across the page (color carries meaning). My pick is LEGEND — it explains why you 'never reach all four' in one block, and that's fine."
    >
      {/* The legend key itself */}
      <Variant label="The legend" tag="fixed meaning">
        <ul className="flex w-full flex-col gap-2.5">
          {LEGEND.map((l) => (
            <li key={l.label} className="flex items-center gap-2.5">
              <span className={`h-2.5 w-2.5 shrink-0 ${l.color}`} />
              <span className={`font-mono text-[11px] ${l.text}`}>
                {l.label}
              </span>
            </li>
          ))}
        </ul>
      </Variant>

      {/* Inter-section miniature */}
      <Variant label="Page as INTER" tag="rainbow scroll">
        <InterMini />
      </Variant>

      {/* Legend/intra miniature */}
      <Variant label="Page as LEGEND" tag="recommended">
        <LegendMini />
      </Variant>

      {/* The hard band as the single reserved moment */}
      <Variant label="Reserved band moment">
        <div className="flex w-full flex-col gap-3">
          <span className="royb-text text-3xl font-semibold tracking-tighter">
            APM
          </span>
          <div className="royb-band h-[3px] w-full" />
          <div className="flex gap-px">
            <span className="h-6 flex-1 bg-roy-r" />
            <span className="h-6 flex-1 bg-roy-o" />
            <span className="h-6 flex-1 bg-roy-y-band" />
            <span className="h-6 flex-1 bg-roy-b" />
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            full band · stepped, no fade · use once
          </p>
        </div>
      </Variant>
    </Section>
  );
}
