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
    visibleCount: 4,
    roles: [
      {
        org: 'Duke University',
        piName: 'Christian Dallago',
        date: 'incoming Aug 2026',
        href: 'https://machine.learning.bio/',
        incoming: true,
        state: 'incoming',
        desc: 'GPU acceleration of protein search',
      },
      {
        org: 'Duke University',
        piName: 'Matthew Lentz',
        date: 'Apr 2026 - Present',
        href: 'https://users.cs.duke.edu/~mlentz/',
        state: 'present',
        desc: 'Tokenminning and efficiency for coding agents',
      },
      {
        org: 'Duke University',
        piName: 'Philip Romero',
        date: 'Aug 2025 - Present',
        href: 'https://www.romerolab.org/',
        state: 'present',
        desc: 'Chemistry data-mining agents w/ Anthropic + Microsoft Research',
        descLinks: [
          {
            text: 'Anthropic',
            href: 'https://www.anthropic.com/news/ai-for-science-program',
          },
          {
            text: 'Microsoft Research',
            href: 'https://www.microsoft.com/en-us/research/people/kevyan/',
          },
        ],
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
        desc: 'Polymer property prediction and synthesis for CO₂ capture w/ Saudi Aramco',
        descLinks: [
          {
            text: 'Saudi Aramco',
            href: 'https://www.aramco.com/',
          },
        ],
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
        desc: 'Automated literature review agents + VTE detection',
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
        desc: 'Introducing kernels, co-leading a discussion section + office hours',
      },
      {
        org: 'Computer Systems',
        piName: 'Matthew Lentz',
        date: 'Jan 2026 - May 2026',
        state: 'ended',
        desc: 'Introduced CPUs, co-led a discussion section + office hours',
      },
      {
        org: 'Organic Chemistry I',
        piName: 'SAGE Tutoring',
        date: 'Jan 2025 - May 2025',
        state: 'ended',
        desc: 'Led a study group, saw kids quit pre-med as the semester went',
      },
    ],
  },
];
