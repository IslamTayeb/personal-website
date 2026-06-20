import { Section, Variant } from './frame';

type DitherOption = {
  label: string;
  tag?: string;
  desc: string;
  kind: 'bar-edge' | 'bar-pixels' | 'rail' | 'link' | 'ambient';
};

const ditherOptions: DitherOption[] = [
  {
    label: 'A — ROYB bar with dithered edges',
    tag: 'masthead',
    kind: 'bar-edge',
    desc: 'Keep the hard ROYB read, but let the top and bottom dissolve into paper through a dot mask.',
  },
  {
    label: 'B — ROYB bar as pixel slabs',
    tag: 'masthead',
    kind: 'bar-pixels',
    desc: 'Make the bar itself a field of tiny color cells instead of a perfectly flat stripe.',
  },
  {
    label: 'C — rail fade',
    kind: 'rail',
    desc: 'Use dithering where a rail continues or fades, especially for hidden/incoming state.',
  },
  {
    label: 'D — link highlight texture',
    kind: 'link',
    desc: 'Replace a smooth hover fill with a dot-screen highlight under external links.',
  },
  {
    label: 'E — active dither field',
    tag: 'state',
    kind: 'ambient',
    desc: 'A static active-state texture for selected rows, loading areas, or one special masthead moment.',
  },
];

function DitherDemo({ kind }: { kind: DitherOption['kind'] }) {
  if (kind === 'bar-edge') {
    return (
      <div className="flex flex-col gap-2">
        <div className="dither-edge h-12 border border-border" />
        <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          hard band, soft paper edge
        </div>
      </div>
    );
  }

  if (kind === 'bar-pixels') {
    return (
      <div className="grid h-12 grid-cols-4 border border-border">
        <span className="dither-tile bg-roy-r/15 text-roy-r" />
        <span className="dither-tile bg-roy-o/15 text-roy-o" />
        <span className="dither-tile bg-roy-y/20 text-roy-y" />
        <span className="dither-tile bg-roy-b/15 text-roy-b" />
      </div>
    );
  }

  if (kind === 'rail') {
    return (
      <div className="flex gap-4 py-1">
        <div className="dither-rail ml-[3.5px] w-2" />
        <div className="grid flex-1 gap-2">
          <div className="h-2 w-2 bg-roy-o" />
          <div className="h-px w-3/5 bg-border" />
          <div className="h-px w-4/5 bg-border" />
          <div className="h-2 w-2 border border-roy-o bg-background" />
          <div className="h-px w-2/3 bg-border" />
        </div>
      </div>
    );
  }

  if (kind === 'link') {
    return (
      <p className="text-sm leading-snug text-foreground">
        Love reading about{' '}
        <span className="dither-link px-0.5 text-roy-b">
          cool infra stories
        </span>
        , then writing on APM Overflow.
      </p>
    );
  }

  return (
    <div className="relative h-24 overflow-hidden border border-border">
      <div className="dither-static-field absolute inset-0" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between border-t border-border bg-background/80 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
        <span>active dither</span>
        <span>static</span>
      </div>
    </div>
  );
}

export function DitheringSection() {
  return (
    <Section
      index="8"
      title="Dithering — texture tests"
      accent="text-roy-b"
      cols={1}
      note="Five places to test dithering without letting it take over the page: the masthead ROYB bar, compact rails, link highlights, and one static active-state texture."
    >
      {ditherOptions.map((option) => (
        <Variant key={option.label} label={option.label} tag={option.tag}>
          <div className="grid gap-3">
            <DitherDemo kind={option.kind} />
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              {option.desc}
            </p>
          </div>
        </Variant>
      ))}
    </Section>
  );
}
