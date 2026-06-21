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
};

export type ExperienceGroup = {
  kind: 'Research' | 'Engineering';
  visibleCount: number;
  dot: 'bg-roy-o' | 'bg-roy-y';
  roles: ExperienceRole[];
};

export const experienceGroups: ExperienceGroup[] = [
  {
    kind: 'Research',
    visibleCount: 3,
    dot: 'bg-roy-o',
    roles: [
      {
        org: 'Duke University',
        piName: 'Christian Dallago',
        date: 'Incoming Aug 2026',
        href: 'https://machine.learning.bio/',
        incoming: true,
        desc: 'GPU systems for protein homology search and sequence alignment.',
      },
      {
        org: 'Duke University',
        piName: 'Matthew Lentz',
        date: 'Apr 2026 - Present',
        href: 'https://users.cs.duke.edu/~mlentz/',
        desc: 'Token mining and codegen correctness for agents with runtime-error repair feedback loops.',
      },
      {
        org: 'Duke University',
        piName: 'Philip Romero',
        date: 'Aug 2025 - Present',
        href: 'https://www.romerolab.org/',
        desc: "Chemistry data-mining with Anthropic's AI for Science Program % Microsoft Research.",
        descLinks: [
          {
            text: "Anthropic's AI for Science Program",
            href: 'https://www.anthropic.com/news/ai-for-science-program',
          },
        ],
      },
      {
        org: 'Duke University',
        piName: 'Navid NaderiAlizadeh',
        date: 'Oct 2024 - Apr 2025',
        href: 'https://sites.duke.edu/navid/',
        desc: 'Continual learning for antibody affinity prediction.',
      },
      {
        org: 'Saudi Aramco',
        date: 'Jul 2022 - Sep 2023',
        href: 'https://www.aramco.com/',
        desc: 'Polymer property prediction and synthesis for CO₂ capture.',
      },
    ],
  },
  {
    kind: 'Engineering',
    visibleCount: 1,
    dot: 'bg-roy-y',
    roles: [
      {
        org: 'Soff (YC S24)',
        date: 'May 2025 - Oct 2025',
        href: 'https://soff.ai/',
        desc: 'Agentic sales intelligence for manufacturers; employee #2.',
      },
      {
        org: 'Life Edit',
        date: 'Sep 2024 - May 2025',
        href: 'https://lifeeditinc.com/',
        desc: 'Non-linear RNA-seq analysis and dashboarding for CRISPR experiments.',
      },
      {
        org: 'DIHI',
        date: 'Jun 2024 - Aug 2024',
        href: 'https://dihi.org/',
        desc: 'Automated literature review workflow for clinical research intake.',
      },
    ],
  },
];
