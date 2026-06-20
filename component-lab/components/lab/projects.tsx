import type { ReactNode } from 'react';
import { Section } from './frame';

type Project = {
  name: string;
  desc: string;
  tech: string[];
  kind?: string;
  href: string;
};

type SkillCard = {
  emoji: string;
  title: string;
  items: string[];
};

const PRODUCT_PROJECTS: Project[] = [
  {
    name: 'Harmonia',
    desc: 'ML pipeline measuring chaotic audio and lyrics into 33 isolated, interpretable dimensions.',
    tech: ['Python', 'OpenAI', 'Plotly'],
    href: 'https://github.com/IslamTayeb/harmonia',
  },
  {
    name: 'Helium Browser Raycast Extension',
    desc: 'Raycast extension for jumping through Helium tabs, bookmarks, history, and web searches from the keyboard.',
    tech: ['TypeScript', 'Raycast API', 'AppleScript', 'SQLite'],
    href: 'https://www.raycast.com/islamtayeb/helium',
  },
  {
    name: 'GitHub README Generator',
    desc: 'Web app using LLMs to generate GitHub README files through codebase analysis with a sliding-window technique.',
    tech: ['Next.js', 'Node.js', 'PostgreSQL'],
    href: 'https://www.etchr.dev/',
  },
];

const SYSTEMS_PROJECTS: Project[] = [
  {
    name: "Evaluating Mosh's State Assumptions",
    kind: 'Networking',
    desc: 'Tested whether Mosh’s "assumed" vs "known" server states hold under high packet loss, with a Python SSP implementation and Docker/tc/netem testbed measuring Age-of-Information.',
    tech: ['Python', 'Docker', 'tc/netem'],
    href: 'https://github.com/IslamTayeb/mosh-lite',
  },
  {
    name: 'xv6 Network Stack',
    kind: 'Operating Sys',
    desc: 'UDP networking for xv6 in C: E1000 NIC driver with DMA descriptor rings, per-port packet queues, and a Python throughput/latency testbed.',
    tech: ['C', 'xv6', 'Python'],
    href: 'https://github.com/islamtayeb/xv6-networking-project',
  },
];

const SKILLS: SkillCard[] = [
  {
    emoji: '⌨️',
    title: 'Languages',
    items: ['TypeScript', 'Python', 'C/C++', 'SQL'],
  },
  {
    emoji: '🧱',
    title: 'Frameworks',
    items: ['Next.js', 'React', 'FastAPI', 'PyTorch'],
  },
  {
    emoji: '⚙️',
    title: 'Infrastructure',
    items: ['Docker', 'Unix/Linux', 'PostgreSQL', 'Redis'],
  },
];

function Tech({ label }: { label: string }) {
  return (
    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
      {label}
    </span>
  );
}

function ExternalTextLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer external"
      className="text-foreground underline decoration-border decoration-2 underline-offset-4 hover:text-roy-o hover:decoration-roy-o"
    >
      {children}
    </a>
  );
}

function DenseLedger({ projects }: { projects: Project[] }) {
  return (
    <div className="grid w-full gap-px bg-border">
      {projects.map((project) => (
        <div
          key={project.name}
          className="grid gap-3 bg-background p-3 md:grid-cols-[11rem_1fr_auto]"
        >
          <div className="flex flex-col gap-1">
            {project.kind ? (
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-roy-o">
                {project.kind}
              </span>
            ) : null}
            <ExternalTextLink href={project.href}>
              {project.name}
            </ExternalTextLink>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground text-pretty">
            {project.desc}
          </p>
          <div className="flex flex-wrap items-start gap-x-2 gap-y-1 md:max-w-[12rem] md:justify-end">
            {project.tech.map((tech) => (
              <Tech key={tech} label={tech} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function DenseRail({ projects }: { projects: Project[] }) {
  return (
    <ul className="flex w-full flex-col">
      {projects.map((project, index) => (
        <li key={project.name} className="relative flex gap-4 pb-7 last:pb-0">
          {index < projects.length - 1 ? (
            <span className="absolute left-[3.5px] top-5 bottom-1 w-px bg-border" />
          ) : null}
          <span className="relative mt-1 h-2 w-2 shrink-0 bg-roy-o" />
          <div className="flex w-full flex-col gap-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <ExternalTextLink href={project.href}>
                {project.name}
              </ExternalTextLink>
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                {project.kind ?? project.tech.slice(0, 2).join(' · ')}
              </span>
            </div>
            <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground text-pretty">
              {project.desc}
            </p>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              {project.tech.join(' · ')}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

function SkillCards() {
  return (
    <div className="grid w-full gap-px bg-border md:grid-cols-3">
      {SKILLS.map((skill) => (
        <div key={skill.title} className="bg-background p-4">
          <div className="flex items-center gap-3">
            <span className="text-xl" aria-hidden>
              {skill.emoji}
            </span>
            <h3 className="text-sm font-semibold text-foreground">
              {skill.title}
            </h3>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-2 gap-y-1">
            {skill.items.map((item) => (
              <Tech key={item} label={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function OptionLabel({ label, tag }: { label: string; tag?: string }) {
  return (
    <div className="mb-3 flex items-center justify-between border-b border-border pb-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
      {tag ? (
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-roy-r">
          {tag}
        </span>
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
      note="Dense-only pass using current project and skills content. Images are out for now; these options test whether projects should read as a compact ledger, a continuous rail, or sit near small emoji skill cards."
    >
      <div className="flex flex-col gap-12">
        <div>
          <OptionLabel label="A — Dense product ledger" />
          <DenseLedger projects={PRODUCT_PROJECTS} />
        </div>

        <div>
          <OptionLabel label="B — Product rail" />
          <DenseRail projects={PRODUCT_PROJECTS} />
        </div>

        <div>
          <OptionLabel label="C — Systems ledger" />
          <DenseLedger projects={SYSTEMS_PROJECTS} />
        </div>

        <div>
          <OptionLabel label="D — Skills cards" tag="emoji" />
          <SkillCards />
        </div>
      </div>
    </Section>
  );
}
