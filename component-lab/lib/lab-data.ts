export type LinkVariant =
  | 'highlight'
  | 'highlight-blue'
  | 'highlight-royb'
  | 'raw'
  | 'raw-blue'
  | 'raw-royb';

export type TextSegment = {
  text: string;
  href?: string;
  external?: boolean;
};

export type ContactLink = {
  label: string;
  href: string;
  text: string;
  external?: boolean;
};

export type LinkHoverOption = {
  label: string;
  tag?: string;
  variant: LinkVariant;
  desc: string;
};

export type ExperienceRole = {
  org: string;
  date: string;
  desc: string;
  incoming?: boolean;
};

export type ExperienceGroup = {
  kind: string;
  visibleCount: number;
  dot: string;
  roles: ExperienceRole[];
};

export type BlogPost = {
  date: string;
  title: string;
  href: string;
  isNew?: boolean;
  desc?: string;
};

export type Publication = {
  date: string;
  title: string;
  authors: string;
  venue?: string;
  venueHref?: string;
  type: string;
  href: string;
  desc: string[];
};

export type CourseCategory = 'Systems' | 'Theory' | 'Biochemistry';

export type Course = {
  name: string;
  code: string;
  category: CourseCategory;
  desc: string;
  locked: boolean;
};

export const contactLinks: ContactLink[] = [
  {
    label: 'email',
    href: 'mailto:islam.tayeb@duke.edu',
    text: 'email',
    external: false,
  },
  {
    label: 'github',
    href: 'https://github.com/IslamTayeb',
    text: 'github',
  },
  {
    label: 'x',
    href: 'https://x.com/IslamTyb',
    text: 'x',
  },
  {
    label: 'linkedin',
    href: 'https://www.linkedin.com/in/islam-tayeb/',
    text: 'linkedin',
  },
  {
    label: 'scholar',
    href: 'https://scholar.google.com/citations?hl=en&user=2ZrlBUcAAAAJ',
    text: 'scholar',
  },
];

export const heroParagraphs: TextSegment[][] = [
  [
    { text: 'Duke student finding lazy automations. Love reading about ' },
    {
      text: 'cool',
      href: 'https://www.wired.com/2015/09/whatsapp-serves-900-million-users-50-engineers/',
    },
    { text: ' ' },
    {
      text: 'infra',
      href: 'https://www.notion.com/blog/building-and-scaling-notions-data-lake',
    },
    { text: ' ' },
    {
      text: 'stories',
      href: 'https://corecursive.com/066-sqlite-with-richard-hipp/',
    },
    {
      text: ' and over-optimizing configs. Also interested in building for science. Currently based in Durham, NC.',
    },
  ],
  [
    {
      text: 'I grew up between Egypt and Saudi Arabia. I also enjoy playing ',
    },
    {
      text: 'Tetris',
      href: 'https://ch.tetr.io/u/mivi',
    },
    { text: ' and ' },
    {
      text: 'Monkeytype',
      href: 'https://monkeytype.com/profile/Mivi',
    },
    {
      text: " in my free time. I've also been writing a bit on ",
    },
    {
      text: 'APM Overflow',
      href: 'https://apmoverflow.xyz/',
    },
    { text: '.' },
  ],
  [
    {
      text: 'In high school, I worked as a graphic designer for an ',
    },
    {
      text: 'esports team',
      href: 'https://yuki.gg/',
    },
    {
      text: '. Around the same time, I was playing ',
    },
    {
      text: 'osu!',
      href: 'https://osu.ppy.sh/users/11749586',
    },
    {
      text: ' competitively and designed a ',
    },
    {
      text: 'few',
      href: 'https://skins.osuck.net/skins/1762?v=0',
    },
    { text: ' ' },
    {
      text: 'skins',
      href: 'https://skins.osuck.net/skins/1464?v=0',
    },
    { text: ' (500K+ downloads).' },
  ],
  [
    {
      text: 'Feel free to reach out at ',
    },
    {
      text: 'islam.tayeb@duke.edu',
      href: 'mailto:islam.tayeb@duke.edu',
      external: false,
    },
    { text: '!' },
  ],
];

export const linkHoverOptions: LinkHoverOption[] = [
  {
    label: 'A — low highlight',
    tag: 'selected',
    variant: 'highlight',
    desc: 'Favorite direction: keeps the underline, then fills only the lower half of the text on hover.',
  },
  {
    label: 'B — highlight + blue text',
    tag: 'alternate',
    variant: 'highlight-blue',
    desc: 'Same low highlight, but the hovered text moves to the section color.',
  },
  {
    label: 'C — highlight + ROYB letters',
    tag: 'experimental',
    variant: 'highlight-royb',
    desc: 'Same low highlight, with the characters cycling red, orange, yellow, blue by index.',
  },
  {
    label: 'D — raw text',
    tag: 'no highlight',
    variant: 'raw',
    desc: 'No highlight fill: hover only removes the underline immediately.',
  },
  {
    label: 'E — raw + blue text',
    tag: 'no highlight',
    variant: 'raw-blue',
    desc: 'No highlight fill: hover removes the underline and moves the text to the section color.',
  },
  {
    label: 'F — raw + ROYB letters',
    tag: 'no highlight',
    variant: 'raw-royb',
    desc: 'No highlight fill: hover removes the underline and cycles each character through ROYB.',
  },
];

export const experienceGroups: ExperienceGroup[] = [
  {
    kind: 'Research',
    visibleCount: 3,
    dot: 'bg-roy-o',
    roles: [
      {
        org: 'Duke University',
        date: 'Aug 2025 — Present',
        desc: 'Enzyme protocol mining tools using PyTorch and services in FastAPI.',
      },
      {
        org: 'Duke University',
        date: 'Oct 2024 — Apr 2025',
        desc: 'Continual learning model for antibody affinity prediction using PyTorch.',
      },
      {
        org: 'Saudi Aramco',
        date: 'Jul 2022 — Sep 2023',
        desc: 'Traditional ML polymer synthesis for CO₂ capture using Python.',
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
        date: 'May 2025 — Oct 2025',
        desc: 'Sales intelligence for manufacturers using Next.js and tRPC, as employee #2.',
      },
      {
        org: 'Life Edit',
        date: 'Sep 2024 — May 2025',
        desc: 'Non-linear RNA-seq analysis and dashboard for CRISPR experiments using Python.',
      },
      {
        org: 'DIHI',
        date: 'Jun 2024 — Aug 2024',
        desc: 'Automated literature review system using React and FastAPI.',
      },
    ],
  },
];

export const writingPosts: BlogPost[] = [
  {
    date: 'Jun 07, 2026',
    title: 'On Agent Memory Fidelity (Decant)',
    href: 'https://apmoverflow.xyz/on-agent-memory-fidelity/',
    isNew: true,
    desc: 'How agents lose the plot over long horizons, and what faithful memory recall actually costs.',
  },
  {
    date: 'Mar 18, 2026',
    title: 'On Fingerspitzengefühl',
    href: 'https://apmoverflow.xyz/on-fingerspitzengefuhl/',
    desc: 'The fingertip-feel of good taste — why some calls are felt before they can be explained.',
  },
  {
    date: 'Jan 02, 2026',
    title: 'On Dimensions of Taste (Harmonia)',
    href: 'https://apmoverflow.xyz/on-dimensions-of-taste/',
    desc: '',
  },
];

export const publications: Publication[] = [
  {
    date: 'Sep 2025',
    title:
      'Machine learning for predicting and optimizing the CO₂ uptake in porous organic polymers',
    authors: 'Hamid Zentou, Ali Tayeb, Islam Tayeb, Mahmoud Abdelnaby',
    venue: 'Journal of Environmental Chemical Engineering',
    venueHref:
      'https://www.journals.elsevier.com/journal-of-environmental-chemical-engineering',
    type: 'Research Article',
    href: 'https://doi.org/10.1016/j.jece.2025.119315',
    desc: [
      'Developed a machine learning framework to predict CO₂ adsorption capacity in porous organic polymers. Used gradient boosting and genetic algorithms.',
      'I helped develop the ML framework, performed data curation and processing, and helped write the original manuscript.',
    ],
  },
  {
    date: 'May 2025',
    title: 'Primal Dual Continual Learning for Robust Antibody Design',
    authors: 'Islam Tayeb, Navid NaderiAlizadeh',
    type: 'Pre-print',
    href: 'https://doi.org/10.13140/RG.2.2.11182.98880',
    desc: [
      'Framework for handling distribution shifts in antibody design using constrained continual learning. Uses dual variables to adaptively allocate memory and prevent catastrophic forgetting across design cycles.',
      'I developed the algorithm and implemented the full framework for the Antibody DomainBed benchmark.',
    ],
  },
  {
    date: 'Jan 2024',
    title:
      'Post-synthetic Modification of UiO-66 Analogue Metal-Organic Framework as Potential Solid Sorbent for Direct Air Capture',
    authors:
      'Mahmoud Abdelnaby, Islam Tayeb, Ahmed Alloush, Hussain Alyosef, Aljazi Alnoaimi, Mostafa Zeama, Mohammed Mohammed, Sagheer Onaizi',
    venue: 'Journal of CO₂ Utilization',
    venueHref: 'https://www.journals.elsevier.com/journal-of-co2-utilization',
    type: 'Research Article',
    href: 'https://doi.org/10.1016/j.jcou.2023.102647',
    desc: [
      'Modified a metal-organic framework polymer to better capture CO₂ directly from air. The modified version captured 15% more CO₂ than the original material.',
      'I designed and synthesized the materials in the lab, characterized their properties, and helped write the paper.',
    ],
  },
];

export const teaching: Course[] = [
  {
    name: 'Computer Systems, Prof. Lentz',
    code: 'CS 310',
    category: 'Systems',
    desc: 'Assisted in discussions, office hours, and grading',
    locked: true,
  },
  {
    name: 'Organic Chemistry II, SAGE',
    code: 'SAGE',
    category: 'Biochemistry',
    desc: 'Led study groups. Was impressed at how good chem majors started getting at this point. Made me think like a teacher for the first time to predict what will come up. Began noticing the craft behind designing good exams.',
    locked: false,
  },
];

export const courses: Course[] = [
  {
    name: 'Compiler Construction',
    code: 'CS 553',
    category: 'Systems',
    desc: '',
    locked: true,
  },
  {
    name: 'Operating Systems',
    code: 'CS 510',
    category: 'Systems',
    desc: "Memory management, synchronization, file systems. Fun implementing threads and network drivers from scratch. Hammered in that the 'magic' under your code is just more code I haven't read yet.",
    locked: false,
  },
  {
    name: 'Network Architecture',
    code: 'CS 514',
    category: 'Systems',
    desc: 'TCP/IP, routing, data centers. Finally understood how P2P works (long time BitTorrent user). Also learned how datacenter routing differs from the public internet. 1st time thinking about distributed systems this systematically.',
    locked: false,
  },
  {
    name: 'Computer Architecture',
    code: 'CS 250',
    category: 'Systems',
    desc: "CPUs, caches, RISC-V assembly. Wish I'd gone deeper since it underpins so much of what I'm interested in now. Caching and paging got interesting toward the end. Started considering performance optimization since.",
    locked: false,
  },
  {
    name: 'Deep Learning',
    code: 'CS 675',
    category: 'Theory',
    desc: '',
    locked: true,
  },
  {
    name: 'Probability',
    code: 'STA 240L',
    category: 'Theory',
    desc: "Distributions, Bayes, inference. Took it to build foundations for my ML research. Poker probabilities and combinations were fun, loved the discussion over 'schools of thought' and inference pieces towards the end.",
    locked: false,
  },
  {
    name: 'Linear Algebra',
    code: 'MATH 218',
    category: 'Theory',
    desc: 'Matrix ops, eigenvalues, SVD. Factorizations led me back to compression algorithms from my design days. Turns out DCT (JPEG) and DEFLATE (PNG) are factorizations too. Made me nostalgic.',
    locked: false,
  },
  {
    name: 'Discrete Math',
    code: 'CS 230',
    category: 'Theory',
    desc: '',
    locked: true,
  },
  {
    name: 'Data Structures & Algorithms',
    code: 'CS 201',
    category: 'Theory',
    desc: 'Hashing, graphs, trees. Loved weighted digraphs and their applications: GPS, routing, PageRank. Met some of my best friends here, so its the class I have the best memories from.',
    locked: false,
  },
  {
    name: 'Biochemistry I',
    code: 'BIOCHEM 301',
    category: 'Biochemistry',
    desc: 'Protein structure, enzyme kinetics, metabolism. Nail in the coffin for premed. Too much memorization. But really got me interested in applying physical and computational tooling in biochem.',
    locked: false,
  },
  {
    name: 'Organic Chemistry I & II',
    code: 'CHEM 201L/202L',
    category: 'Biochemistry',
    desc: 'Functional groups, stereochemistry, mechanisms, synthesis. Loved seeing lab reactions taught systematically. Orgo felt like its own language, and these courses gave me a real toolkit.',
    locked: false,
  },
  {
    name: 'General Chemistry I & II',
    code: 'CHEM 101/210L',
    category: 'Biochemistry',
    desc: "Atomic structure, thermodynamics, kinetics. Felt too formulaic, though the early quantum bits and later experiments were cool. Wish I'd taken physical chem to remove the black boxes in my understanding.",
    locked: false,
  },
  {
    name: 'Molecular Biology',
    code: 'BIO 201L',
    category: 'Biochemistry',
    desc: 'Gene expression, transcription factors, CRISPR. Too much memorization and hand holding (kinda hated the professor), but a useful refresher that pays off when reading enzyme research.',
    locked: false,
  },
];

export const defaultCourseCode = 'CS 510';
