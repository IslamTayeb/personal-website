'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Section, Variant } from './frame';

type Project = {
  name: string;
  desc: string;
  tech: string[];
  kind?: string;
  image?: string;
};

const PROJECTS: Project[] = [
  {
    name: 'NewHarmonia',
    desc: 'ML pipeline measuring chaotic audio and lyrics into 33 isolated, interpretable dimensions.',
    tech: ['Python', 'OpenAI', 'Plotly'],
    image: '/projects/newharmonia.png',
  },
  {
    name: 'Helium Browser Raycast Extension',
    desc: 'Raycast extension for jumping through Helium tabs, bookmarks, history, and web searches from the keyboard.',
    tech: ['TypeScript', 'Raycast API', 'AppleScript', 'SQLite'],
    // intentionally no image — shows the text-only fallback
  },
  {
    name: 'GitHub README Generator',
    desc: 'Web app using LLMs to generate README files through codebase analysis with a sliding-window technique.',
    tech: ['Next.js', 'Node.js', 'PostgreSQL'],
    image: '/projects/readme-gen.png',
  },
];

const SYSTEMS: Project[] = [
  {
    name: "Evaluating Mosh's State Assumptions",
    kind: 'Networking',
    desc: 'Tested whether Mosh\u2019s "assumed" vs "known" server states hold under high packet loss — a Python SSP implementation with a Docker/tc/netem testbed measuring Age-of-Information.',
    tech: ['Python', 'Docker', 'tc/netem'],
  },
  {
    name: 'xv6 Network Stack',
    kind: 'Operating Sys',
    desc: 'UDP networking for xv6 in C: an E1000 NIC driver with DMA descriptor rings and per-port packet queues, plus a Python throughput/latency testbed.',
    tech: ['C', 'xv6', 'Python'],
  },
];

// A small mono tech chip — sharp corners, hairline border.
function Tech({ label }: { label: string }) {
  return (
    <span className="border border-border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
      {label}
    </span>
  );
}

// Arrow that nudges on hover (instant, no soft easing).
function Arrow() {
  return (
    <span className="font-mono text-sm text-muted-foreground group-hover:translate-x-0.5 group-hover:text-roy-o">
      →
    </span>
  );
}

// A — fancy cards (the islamtayeb.dev treatment, sharp + ROYB). Border lifts
// to orange on hover; tech tags as mono chips.
function FancyCards() {
  return (
    <div className="grid w-full gap-px bg-border sm:grid-cols-2">
      {PROJECTS.map((p) => (
        <a
          href="#"
          key={p.name}
          className="group flex flex-col gap-3 bg-background p-5 outline-none ring-roy-o hover:bg-secondary focus-visible:ring-2"
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-sm font-semibold leading-tight text-foreground text-balance">
              {p.name}
            </h3>
            <Arrow />
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground text-pretty">
            {p.desc}
          </p>
          <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
            {p.tech.map((t) => (
              <Tech key={t} label={t} />
            ))}
          </div>
        </a>
      ))}
      {/* CTA cell fills the grid (no empty grey) and echoes the site's
          "see more on GitHub" link */}
      <a
        href="#"
        className="group flex items-center justify-between gap-3 bg-background p-5 hover:bg-secondary"
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground group-hover:text-roy-o">
          See all on GitHub
        </span>
        <Arrow />
      </a>
    </div>
  );
}

// B — minimal rows: title + arrow, one-line desc, tech inline. Hover underlines
// the title and lights the arrow. No cards, very quiet.
function MinimalRows() {
  return (
    <ul className="flex w-full flex-col">
      {PROJECTS.map((p) => (
        <li key={p.name} className="border-b border-border last:border-0">
          <a href="#" className="group flex flex-col gap-1 py-3">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm text-foreground decoration-roy-o decoration-2 underline-offset-4 group-hover:underline">
                {p.name}
              </span>
              <Arrow />
            </div>
            <p className="max-w-md text-xs leading-relaxed text-muted-foreground text-pretty">
              {p.desc}
            </p>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              {p.tech.join(' · ')}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

// C — continuous rail (consistent with Experience / Writing), orange dots.
// Descriptions always on; tech as inline mono.
function RailRows() {
  return (
    <ul className="flex w-full flex-col">
      {PROJECTS.map((p, i) => (
        <li key={p.name} className="relative flex gap-4 pb-5 last:pb-0">
          {i < PROJECTS.length - 1 ? (
            <span className="absolute left-[3.5px] top-5 bottom-0 w-px bg-border" />
          ) : null}
          <span className="relative mt-1 h-2 w-2 shrink-0 bg-roy-o" />
          <a href="#" className="group flex w-full flex-col gap-0.5">
            <span className="text-sm text-foreground decoration-roy-o decoration-2 underline-offset-4 group-hover:underline">
              {p.name}
            </span>
            <p className="max-w-md text-xs leading-relaxed text-muted-foreground text-pretty">
              {p.desc}
            </p>
            <span className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              {p.tech.join(' · ')}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

// D — fancy cards where the thumbnail is OPTIONAL. Cards with an image show a
// sharp 16:9 banner on top; cards without one get a thin orange top rule so the
// grid still reads evenly. Same card body either way.
function OptionalImageCards() {
  return (
    <div className="grid w-full gap-px bg-border sm:grid-cols-2">
      {PROJECTS.map((p) => (
        <a
          href="#"
          key={p.name}
          className="group flex flex-col bg-background outline-none ring-roy-o hover:bg-secondary focus-visible:ring-2"
        >
          {p.image ? (
            <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-border bg-muted">
              <Image
                src={p.image}
                alt={`${p.name} preview`}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-1 w-full bg-roy-o" />
          )}
          <div className="flex flex-1 flex-col gap-3 p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-semibold leading-tight text-foreground text-balance">
                {p.name}
              </h3>
              <Arrow />
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground text-pretty">
              {p.desc}
            </p>
            <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
              {p.tech.map((t) => (
                <Tech key={t} label={t} />
              ))}
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}

// E — row list with an OPTIONAL inline left thumbnail. Projects with an image
// get a small square preview; those without get a sharp orange placeholder
// square (glyph-like) so the left column stays aligned.
function OptionalImageRows() {
  return (
    <ul className="flex w-full flex-col">
      {PROJECTS.map((p) => (
        <li key={p.name} className="border-b border-border last:border-0">
          <a href="#" className="group flex items-center gap-4 py-3">
            {p.image ? (
              <Image
                src={p.image}
                alt={`${p.name} preview`}
                width={56}
                height={56}
                className="h-14 w-14 shrink-0 border border-border object-cover"
              />
            ) : (
              <span className="flex h-14 w-14 shrink-0 items-center justify-center border border-border bg-muted">
                <span className="h-3 w-3 bg-roy-o" />
              </span>
            )}
            <div className="flex flex-1 flex-col gap-0.5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm text-foreground decoration-roy-o decoration-2 underline-offset-4 group-hover:underline">
                  {p.name}
                </span>
                <Arrow />
              </div>
              <p className="max-w-md text-xs leading-relaxed text-muted-foreground text-pretty">
                {p.desc}
              </p>
              <span className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                {p.tech.join(' · ')}
              </span>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}

// Systems projects — same fancy-card language but with a kind label, shown as
// a sub-collection so you can see how a second project group reads.
function SystemsCards() {
  const [open, setOpen] = useState(true);
  return (
    <div className="flex w-full flex-col">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 pb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
      >
        <span className={open ? 'rotate-90' : ''}>›</span>
        Systems Projects
        <span className="text-muted-foreground/60">({SYSTEMS.length})</span>
      </button>
      {open ? (
        <div className="grid gap-px bg-border sm:grid-cols-2">
          {SYSTEMS.map((p) => (
            <a
              href="#"
              key={p.name}
              className="group flex flex-col gap-2 bg-background p-5 hover:bg-secondary"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-roy-o">
                {p.kind}
              </span>
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold leading-tight text-foreground text-balance">
                  {p.name}
                </h3>
                <Arrow />
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground text-pretty">
                {p.desc}
              </p>
              <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                {p.tech.map((t) => (
                  <Tech key={t} label={t} />
                ))}
              </div>
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function ProjectsSection() {
  return (
    <Section
      index="04"
      title="Projects"
      accent="text-roy-o"
      cols={1}
      note="New — the fancy projects from islamtayeb.dev plus simpler treatments, all sharp-cornered and in engineering orange. A is the card grid (closest to your current site); B is a quiet minimal-row list; C reuses the continuous rail for consistency. D and E answer the optional-image question: D shows cards where a thumbnail is present on some and absent on others (text-only falls back to a thin orange rule); E does the same in a row list (placeholder square keeps alignment). Helium is deliberately image-less in both. The Systems Projects sub-collection shows how a second, labelled group reads."
    >
      <div className="flex flex-col gap-10">
        <div className="flex flex-col">
          <span className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            A — Fancy cards (current site)
          </span>
          <FancyCards />
        </div>

        <div className="flex flex-col">
          <span className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            B — Minimal rows
          </span>
          <MinimalRows />
        </div>

        <div className="flex flex-col">
          <span className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            C — Continuous rail (matches §03 / §05)
          </span>
          <RailRows />
        </div>

        <div className="flex flex-col">
          <span className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            D — Cards, optional thumbnail
          </span>
          <p className="mb-3 max-w-md text-xs leading-relaxed text-muted-foreground text-pretty">
            Helium has no image on purpose — it falls back to a thin orange rule
            so the grid stays even.
          </p>
          <OptionalImageCards />
        </div>

        <div className="flex flex-col">
          <span className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            E — Rows, optional thumbnail
          </span>
          <p className="mb-3 max-w-md text-xs leading-relaxed text-muted-foreground text-pretty">
            Image-less projects get a sharp orange placeholder square, keeping
            the left column aligned.
          </p>
          <OptionalImageRows />
        </div>

        <div className="flex flex-col">
          <span className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Sub-collection — Systems Projects
          </span>
          <SystemsCards />
        </div>
      </div>
    </Section>
  );
}
