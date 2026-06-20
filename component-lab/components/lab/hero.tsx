import { Section, Variant } from './frame';

const META: [string, string][] = [
  ['Focus', 'Lazy automations'],
  ['Likes', 'Infra stories, configs'],
  ['Loc', 'Durham, NC'],
];

function HeroMeta({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-1 font-mono text-[11px]">
        {META.map(([key, value]) => (
          <div key={key} className="contents">
            <dt className="text-muted-foreground">{key}</dt>
            <dd className="text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
    );
  }

  return (
    <dl className="flex flex-col gap-2 font-mono text-[11px] md:border-r md:border-border md:pr-5">
      {META.map(([key, value]) => (
        <div key={key} className="flex flex-col gap-0.5">
          <dt className="text-muted-foreground">{key}</dt>
          <dd className="text-foreground">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function HeroStory() {
  return (
    <div className="order-1 flex flex-col gap-2 text-sm leading-snug text-foreground text-pretty md:order-2">
      <p>
        Duke student finding lazy automations. Love reading about cool infra
        stories and over-optimizing configs. Also interested in building for
        science. Currently based in Durham, NC.
      </p>
      <p>
        I grew up between Egypt and Saudi Arabia, played osu! competitively, and
        have been writing on APM Overflow.
      </p>
    </div>
  );
}

export function HeroSection() {
  return (
    <Section
      index="02"
      title="Hero — apmoverflow index voice"
      accent="text-roy-o"
      cols={1}
      note="Selected direction: compact current-site copy without inline badges. Desktop uses the two-column meta/story split with a divider; phone stacks with metadata below the paragraph."
    >
      <Variant label="Selected — compact hero, stacks on phone" tag="final">
        <div className="flex w-full flex-col gap-3">
          <h3 className="text-xl font-semibold tracking-tight text-foreground">
            Islam Tayeb
          </h3>
          <div className="flex flex-col gap-4 md:grid md:grid-cols-[8.5rem_1fr] md:gap-5">
            <HeroStory />
            <div className="order-2 md:order-1">
              <div className="md:hidden">
                <HeroMeta compact />
              </div>
              <div className="hidden md:block">
                <HeroMeta />
              </div>
            </div>
          </div>
        </div>
      </Variant>
    </Section>
  );
}
