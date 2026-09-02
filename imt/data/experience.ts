type ExperienceRole = {
  org: string;
  piName?: string;
  piHref?: string;
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
  kind: 'research' | 'engineering' | 'teaching';
  visibleCount: number;
  roles: ExperienceRole[];
};

export const experienceGroups: ExperienceGroup[] = [
  {
    kind: 'research',
    visibleCount: 3,
    roles: [
      /*
      {
        org: 'Duke University',
        piName: 'Christian Dallago',
        date: 'Incoming Aug 2026',
        href: 'https://machine.learning.bio/',
        incoming: true,
        state: 'incoming',
        desc: 'GPU acceleration of protein search',
      },
      */
      {
        org: 'Duke University',
        piName: 'Matthew Lentz',
        date: 'Apr 2026 - Present',
        href: 'https://users.cs.duke.edu/~mlentz/',
        state: 'present',
        desc: 'Token minning runtime for coding agents with Tokenless (YC S26)',
        descLinks: [
          {
            text: 'Tokenless (YC S26)',
            href: 'https://usetokenless.com/',
          },
        ],
      },
      {
        org: 'Duke University',
        piName: 'Philip Romero',
        date: 'Aug 2025 - Present',
        href: 'https://www.romerolab.org/',
        state: 'present',
        desc: 'Chemistry data-mining agents with Anthropic + Microsoft Research',
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
        desc: 'Polymer property prediction and synthesis for CO₂ capture with Saudi Aramco',
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
        desc: 'Automated literature review agents + VTE detection',
      },
    ],
  },
  {
    kind: 'teaching',
    visibleCount: 1,
    roles: [
      {
        org: 'Operating Systems',
        piName: 'TA',
        date: 'Incoming Aug 2026',
        state: 'incoming',
        incoming: true,
        desc: 'Introducing kernels with Matthew Lentz, co-leading a discussion section + office hours',
        descLinks: [
          {
            text: 'Matthew Lentz',
            href: 'https://users.cs.duke.edu/~mlentz/',
          },
        ],
      },
      {
        org: 'Computer Systems',
        piName: 'TA',
        date: 'Jan 2026 - May 2026',
        href: 'https://courses.cs.duke.edu/spring26/compsci210d/',
        state: 'ended',
        desc: 'Introduced CPUs with Matthew Lentz, co-led a discussion section + office hours',
        descLinks: [
          {
            text: 'Matthew Lentz',
            href: 'https://users.cs.duke.edu/~mlentz/',
          },
        ],
      },
      {
        org: 'Organic Chemistry I',
        piName: 'Tutor',
        href: 'https://arc.duke.edu/peer-education/',
        date: 'Jan 2025 - May 2025',
        state: 'ended',
        desc: 'Led a study group with SAGE, saw kids quit pre-med as the semester went',
        descLinks: [
          {
            text: 'SAGE',
            href: 'https://arc.duke.edu/peer-education/',
          },
        ],
      },
    ],
  },
];
