export type ExperienceKind = 'research' | 'engineering' | 'teaching';

export type ExperienceRole = {
  kind: ExperienceKind;
  org: string;
  piName?: string;
  date: string;
  desc: string;
  href?: string;
  state: 'incoming' | 'present' | 'ended';
};

export type ExperienceGroup = {
  kind: ExperienceKind;
  visibleCount: number;
  roles: Omit<ExperienceRole, 'kind'>[];
};

export const experienceGroups: ExperienceGroup[] = [
  {
    kind: 'research',
    visibleCount: 4,
    roles: [
      {
        org: 'Duke University',
        piName: 'Christian Dallago',
        date: 'Incoming Aug 2026',
        href: 'https://machine.learning.bio/',
        state: 'incoming',
        desc: 'GPU acceleration of protein search',
      },
      {
        org: 'Duke University',
        piName: 'Matthew Lentz',
        date: 'Apr 2026 - Present',
        href: 'https://users.cs.duke.edu/~mlentz/',
        state: 'present',
        desc: 'Token mining runtime and benchmarks for coding agents with Tokenless',
      },
      {
        org: 'Duke University',
        piName: 'Philip Romero',
        date: 'Aug 2025 - Present',
        href: 'https://www.romerolab.org/',
        state: 'present',
        desc: 'Chemistry data-mining agents with Anthropic and Microsoft Research',
      },
      {
        org: 'Duke University',
        piName: 'Navid NaderiAlizadeh',
        date: 'Oct 2024 - Apr 2025',
        href: 'https://sites.duke.edu/navid/',
        state: 'ended',
        desc: 'Continual learning for antibody affinity prediction',
      },
      {
        org: 'KFUPM',
        piName: 'Mahmoud Abdelnaby',
        date: 'Jul 2022 - Sep 2023',
        href: 'https://scholar.google.com/citations?user=BLMFawMAAAAJ&hl=en',
        state: 'ended',
        desc: 'Polymer property prediction and synthesis for CO2 capture with Saudi Aramco',
      },
    ],
  },
  {
    kind: 'engineering',
    visibleCount: 1,
    roles: [
      {
        org: 'Soff (YC S24)',
        date: 'May 2025 - Oct 2025',
        href: 'https://soff.ai/',
        state: 'ended',
        desc: 'Agentic sales intelligence for manufacturers, employee #2',
      },
      {
        org: 'Life Edit Therapeutics',
        date: 'Sep 2024 - May 2025',
        href: 'https://lifeeditinc.com/',
        state: 'ended',
        desc: 'Non-linear RNA-seq analysis for CRISPR experiments',
      },
      {
        org: 'Duke Institute for Health Innovation',
        date: 'Jun 2024 - Aug 2024',
        href: 'https://dihi.org/',
        state: 'ended',
        desc: 'Automated literature review agents and VTE detection',
      },
    ],
  },
  {
    kind: 'teaching',
    visibleCount: 1,
    roles: [
      {
        org: 'Operating Systems',
        piName: 'Matthew Lentz',
        date: 'Incoming Aug 2026',
        state: 'incoming',
        desc: 'Introducing kernels, co-leading a discussion section and office hours',
      },
      {
        org: 'Computer Systems',
        piName: 'Matthew Lentz',
        date: 'Jan 2026 - May 2026',
        href: 'https://courses.cs.duke.edu/spring26/compsci210d/',
        state: 'ended',
        desc: 'Introduced CPUs, co-led a discussion section and office hours',
      },
      {
        org: 'Organic Chemistry I',
        piName: 'SAGE Tutoring',
        date: 'Jan 2025 - May 2025',
        href: 'https://arc.duke.edu/peer-education/',
        state: 'ended',
        desc: 'Led a study group through the semester',
      },
    ],
  },
];

export const allExperienceRoles: ExperienceRole[] = experienceGroups.flatMap(
  (group) => group.roles.map((role) => ({ ...role, kind: group.kind }))
);

export function experienceKindLabel(kind: ExperienceKind) {
  return kind[0].toUpperCase() + kind.slice(1);
}
