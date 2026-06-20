import { Section, Variant } from './frame';

// Closer to the apmoverflow index voice — keeps all the real details.
const STORY =
  "Hey, I'm Islam. I was born and raised between Egypt and Saudi Arabia, and I'm currently based in Durham, NC for college at Duke. In high school I played osu! competitively and did esports graphic design full-time. I've been lucky to jump between cities and pivot interests more than once — these days I'm building lazy automations, geeking over infra war-stories, and over-optimizing configs.";

const META: [string, string][] = [
  ['focus', 'lazy automations'],
  ['likes', 'infra stories, configs'],
  ['loc', 'Durham, NC'],
];

export function HeroSection() {
  return (
    <Section
      index="02"
      title="Hero — apmoverflow index voice"
      accent="text-roy-o"
      cols={1}
      note="v.04 — story rewritten in your apmoverflow index voice (all details kept). Variants now stack vertically so each gets full width to breathe. Testing the two-column split with vs without a divider — the divider only ever sits between meta and story, never through the name. On mobile every variant collapses to one column with the focus/likes/loc meta BELOW the paragraph."
    >
      {/* A — stacked: meta block, then sans story */}
      <Variant label="A — Stacked" tag="simple">
        <div className="flex w-full flex-col gap-5">
          <h3 className="text-2xl font-medium tracking-tight text-foreground">
            Islam Tayeb
          </h3>
          <p className="order-1 max-w-md text-sm leading-relaxed text-foreground text-pretty">
            {STORY}
          </p>
          <dl className="order-2 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 font-mono text-xs">
            {META.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Variant>

      {/* B — two-column split, NO divider. Name spans full width on top. */}
      <Variant label="B — Two-column, no divider">
        <div className="flex w-full flex-col gap-4">
          <h3 className="text-2xl font-medium tracking-tight text-foreground">
            Islam Tayeb
          </h3>
          {/* mobile: story then meta. md+: meta left, story right */}
          <div className="flex flex-col gap-5 md:grid md:grid-cols-[10rem_1fr] md:gap-8">
            <p className="order-1 text-sm leading-relaxed text-foreground text-pretty md:order-2">
              {STORY}
            </p>
            <dl className="order-2 flex flex-col gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] md:order-1">
              {META.map(([k, v]) => (
                <div key={k} className="flex flex-col">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="mb-1 text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Variant>

      {/* C — two-column split WITH a divider between meta and story only */}
      <Variant label="C — Two-column, divider (stacks on phone)" tag="final">
        <div className="flex w-full flex-col gap-4">
          <h3 className="text-2xl font-medium tracking-tight text-foreground">
            Islam Tayeb
          </h3>
          <div className="flex flex-col gap-5 md:grid md:grid-cols-[10rem_1fr] md:gap-8">
            <p className="order-1 text-sm leading-relaxed text-foreground text-pretty md:order-2">
              {STORY}
            </p>
            {/* divider is on the meta column, md+ only, so it never crosses the name */}
            <dl className="order-2 flex flex-col gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] md:order-1 md:border-r md:border-border md:pr-8">
              {META.map(([k, v]) => (
                <div key={k} className="flex flex-col">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="mb-1 text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Variant>
    </Section>
  );
}
