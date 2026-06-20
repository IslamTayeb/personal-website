export type ExperienceRole = {
  org: string;
  role: string;
  date: string;
  desc: string;
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
        role: 'ML Research Assistant',
        date: 'Aug 2025 - Present',
        href: 'https://www.romerolab.org/',
        desc: 'Enzyme protocol mining tools using PyTorch and services in FastAPI.',
      },
      {
        org: 'Duke University',
        role: 'ML Research Assistant',
        date: 'Oct 2024 - Apr 2025',
        href: 'https://sites.duke.edu/navid/',
        desc: 'Continual learning model for antibody affinity prediction using PyTorch.',
      },
      {
        org: 'Saudi Aramco',
        role: 'Research Assistant',
        date: 'Jul 2022 - Sep 2023',
        href: 'https://www.aramco.com/',
        desc: 'Traditional ML polymer synthesis for CO2 capture using Python.',
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
        role: 'Software Engineer Intern',
        date: 'May 2025 - Oct 2025',
        href: 'https://soff.ai/',
        desc: 'Sales intelligence for manufacturers using Next.js and tRPC, as employee #2.',
      },
      {
        org: 'Life Edit',
        role: 'ML Engineer Intern',
        date: 'Sep 2024 - May 2025',
        href: 'https://lifeeditinc.com/',
        desc: 'Non-linear RNA-seq analysis and dashboard for CRISPR experiments using Python.',
      },
      {
        org: 'DIHI',
        role: 'Software Engineer Intern',
        date: 'Jun 2024 - Aug 2024',
        href: 'https://dihi.org/',
        desc: 'Automated literature review system using React and FastAPI.',
      },
    ],
  },
];
