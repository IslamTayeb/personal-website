export type ExperienceRole = {
  org: string;
  piName?: string;
  date: string;
  desc: string;
  descLinks?: {
    text: string;
    href: string;
  }[];
  href?: string;
  incoming?: boolean;
  state?: 'present' | 'ended' | 'incoming';
};

export type ExperienceGroup = {
  kind: 'Research' | 'Engineering' | 'Teaching';
  visibleCount: number;
  roles: ExperienceRole[];
};

export const experienceGroups: ExperienceGroup[] = [
  {
    kind: 'Research',
    visibleCount: 3,
    roles: [
      {
        org: 'Duke University',
        piName: 'Christian Dallago',
        date: 'incoming Aug 2026',
        href: 'https://machine.learning.bio/',
        incoming: true,
        state: 'incoming',
        desc: 'GPU systems for protein homology search.',
      },
      {
        org: 'Duke University',
        piName: 'Matthew Lentz',
        date: 'Apr 2026 - Present',
        href: 'https://users.cs.duke.edu/~mlentz/',
        state: 'present',
        desc: 'Tokenminning and correctness for coding agents.',
      },
      {
        org: 'Duke University',
        piName: 'Philip Romero',
        date: 'Aug 2025 - Present',
        href: 'https://www.romerolab.org/',
        state: 'present',
        desc: 'Chemistry data-mining agents w/ Anthropic (AI for Science Program) + Microsoft Research.',
        descLinks: [
          {
            text: 'Anthropic (AI for Science Program)',
            href: 'https://www.anthropic.com/news/ai-for-science-program',
          },
        ],
      },
      {
        org: 'Duke University',
        piName: 'Navid NaderiAlizadeh',
        date: 'Oct 2024 - Apr 2025',
        href: 'https://sites.duke.edu/navid/',
        state: 'ended',
        desc: 'Continual learning for antibody affinity prediction.',
      },
      {
        org: 'Saudi Aramco',
        date: 'Jul 2022 - Sep 2023',
        href: 'https://www.aramco.com/',
        state: 'ended',
        desc: 'Polymer property prediction and synthesis for CO₂ capture.',
      },
    ],
  },
  {
    kind: 'Engineering',
    visibleCount: 1,
    roles: [
      {
        org: 'Soff (YC S24)',
        date: 'May 2025 - Oct 2025',
        href: 'https://soff.ai/',
        state: 'ended',
        desc: 'Agentic sales intelligence for manufacturers; employee #2.',
      },
      {
        org: 'Life Edit',
        date: 'Sep 2024 - May 2025',
        href: 'https://lifeeditinc.com/',
        state: 'ended',
        desc: 'Non-linear RNA-seq analysis for CRISPR experiments.',
      },
      {
        org: 'DIHI',
        date: 'Jun 2024 - Aug 2024',
        href: 'https://dihi.org/',
        state: 'ended',
        desc: 'Automated literature review agents + VTE detection.',
      },
    ],
  },
  {
    kind: 'Teaching',
    visibleCount: 1,
    roles: [
      {
        org: 'Operating Systems',
        piName: 'Matthew Lentz',
        date: 'incoming Aug 2026',
        state: 'incoming',
        incoming: true,
        desc: 'Introduced (more) freshmen to kernels and concurrency; co-led a discussion section.',
      },
      {
        org: 'Computer Systems',
        piName: 'Matthew Lentz',
        date: 'Jan 2026 - May 2026',
        state: 'ended',
        desc: 'Introduced freshmen to CPUs and caches; co-led a discussion section.',
      },
      {
        org: 'Organic Chemistry I',
        piName: 'SAGE Tutoring',
        date: 'Jan 2025 - May 2025',
        state: 'ended',
        desc: 'Led a study group; saw kids quit pre-med as the semester went.',
      },
    ],
  },
];
