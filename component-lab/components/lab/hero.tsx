import { Section, Variant } from './frame';

const STORY =
  "Hey, I'm Islam. I was born and raised between Egypt and Saudi Arabia, and I'm currently based in Durham, NC for college at Duke. In high school I played osu! competitively and did esports graphic design full-time. I've been lucky to jump between cities and pivot interests more than once — these days I'm building lazy automations, geeking over infra war-stories, and over-optimizing configs.";

const META: [string, string][] = [
  ['Focus', 'Lazy automations'],
  ['Likes', 'Infra stories, configs'],
  ['Loc', 'Durham, NC'],
];

function HeroMeta({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 font-mono text-xs">
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
    <dl className="flex flex-col gap-3 font-mono text-xs md:border-r md:border-border md:pr-8">
      {META.map(([key, value]) => (
        <div key={key} className="flex flex-col gap-0.5">
          <dt className="text-muted-foreground">{key}</dt>
          <dd className="text-foreground">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function HeroSection() {
  return (
    <Section
      index="02"
      title="Hero — apmoverflow index voice"
      accent="text-roy-o"
      cols={1}
      note="Selected direction: the apmoverflow-index voice stays, but the layout is no longer a comparison grid. Desktop uses the two-column meta/story split with a divider; phone stacks like the simple version, with title-case metadata below the paragraph."
    >
      <Variant
        label="Selected — two-column divider, stacks on phone"
        tag="final"
      >
        <div className="flex w-full flex-col gap-5">
          <h3 className="text-2xl font-semibold tracking-tight text-foreground">
            Islam Tayeb
          </h3>
          <div className="flex flex-col gap-5 md:grid md:grid-cols-[10rem_1fr] md:gap-8">
            <p className="order-1 text-sm leading-relaxed text-foreground text-pretty md:order-2">
              {STORY}
            </p>
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
