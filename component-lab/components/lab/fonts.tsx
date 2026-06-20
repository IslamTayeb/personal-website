import type { ReactNode } from 'react';
import { Section } from '@/components/lab/frame';

function TypeRole({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="border-t border-border pt-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 text-sm font-medium text-foreground">{value}</div>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        {detail}
      </p>
    </div>
  );
}

function SoraSpecimen() {
  return (
    <div className="border-t border-border pt-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-roy-r">
          Sora
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-roy-b">
          selected sans
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <h3 className="text-3xl font-semibold leading-tight tracking-tight text-foreground text-balance">
            Islam Tayeb
          </h3>
          <p className="mt-4 max-w-2xl text-base font-normal leading-relaxed text-foreground text-pretty">
            A Duke student finding lazy automations. Born between Egypt and
            Saudi Arabia, now in Durham — building software, doing research, and
            writing on APM Overflow.
          </p>
        </div>

        <div className="grid content-start gap-5">
          <p className="text-sm leading-relaxed text-foreground/85 text-pretty">
            Sora stays geometric and technical without turning the site into a
            startup dashboard. It has enough character for the portfolio, but it
            can still carry long APM Overflow paragraphs without getting loud.
          </p>
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 text-base text-foreground">
            <span className="font-normal">Regular</span>
            <span className="font-medium">Medium</span>
            <span className="font-semibold">Semibold</span>
            <span className="font-bold">Bold</span>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <TypeRole
          label="hero"
          value="large semibold, tight leading"
          detail="The personal-site opener can feel sharp and technical without using a separate display face."
        />
        <TypeRole
          label="body"
          value="regular, full-strength ink"
          detail="Readable enough for APM Overflow excerpts and article furniture, not only portfolio cards."
        />
        <TypeRole
          label="links"
          value="medium with hard accent"
          detail="Works with the ROYB system because the letters are clean and not overly decorative."
        />
      </div>
    </div>
  );
}

function MonoLine({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-2 border-t border-border pt-3 sm:grid-cols-[7rem_1fr]">
      <span className="text-[10px] uppercase tracking-[0.18em] text-roy-b">
        {label}
      </span>
      <span className="font-medium text-foreground">{children}</span>
    </div>
  );
}

function DmMonoSpecimen() {
  return (
    <div
      className="border-t border-border pt-6"
      style={{ fontFamily: 'var(--font-dm-mono)' }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="text-[10px] uppercase tracking-[0.18em] text-roy-b">
          DM Mono
        </div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-roy-b">
          selected mono
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <div className="flex flex-wrap gap-x-7 gap-y-2 text-lg font-medium text-foreground">
            <span>
              <span className="text-roy-b">focus</span>&nbsp;&nbsp;automations
            </span>
            <span>
              <span className="text-roy-b">loc</span>&nbsp;&nbsp;durham, nc
            </span>
            <span>
              <span className="text-roy-b">2026</span>
            </span>
          </div>
          <p className="mt-5 text-base font-medium leading-relaxed text-foreground/80">
            0OIl1 — {'{ }'} () [] /\ &amp; @ # = → ABCxyz 0123456789
          </p>
          <p
            className="mt-5 text-sm leading-relaxed text-muted-foreground text-pretty"
            style={{ fontFamily: 'var(--font-sora)' }}
          >
            DM Mono is the selected metadata voice. It is quiet, but the medium
            weight gives labels and small utility text enough body to survive
            the paper background.
          </p>
        </div>

        <div className="grid gap-3 text-sm leading-relaxed">
          <MonoLine label="project">
            Harmonia&nbsp;&nbsp;/&nbsp;&nbsp;Python, OpenAI, Plotly
          </MonoLine>
          <MonoLine label="writing">
            apm-overflow&nbsp;&nbsp;/&nbsp;&nbsp;agent memory fidelity
          </MonoLine>
          <MonoLine label="status">
            draft&nbsp;&nbsp;→&nbsp;&nbsp;review&nbsp;&nbsp;→&nbsp;&nbsp;ship
          </MonoLine>
          <MonoLine label="slug">/blog/on-agent-memory-fidelity</MonoLine>
        </div>
      </div>
    </div>
  );
}

export function FontsSection() {
  return (
    <Section
      index="00"
      title="Typeface"
      accent="text-roy-r"
      cols={1}
      note="Typeface options are no longer a comparison grid. Current direction: Sora for headings and body, DM Mono for metadata and labels, with DM Mono pushed slightly heavier where it appears on the page."
    >
      <div className="flex flex-col gap-14">
        <SoraSpecimen />
        <DmMonoSpecimen />
      </div>
    </Section>
  );
}
