export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  title: string;
  category: 'Product' | 'Systems' | 'Applet';
  desc: string;
  tags: string[];
  links: ProjectLink[];
};

export const projects: Project[] = [
  {
    title: 'Harmonia',
    category: 'Product',
    desc: 'ML pipeline measuring chaotic audio and lyrics into isolated, interpretable dimensions.',
    tags: ['Python', 'OpenAI', 'Plotly'],
    links: [
      { label: 'GitHub', href: 'https://github.com/IslamTayeb/harmonia' },
      { label: 'Post', href: '/blog/on-dimensions-of-taste' },
    ],
  },
  {
    title: "Evaluating Mosh's State Assumptions",
    category: 'Systems',
    desc: 'Tested assumed vs known server states under high packet loss with an SSP implementation and netem testbed.',
    tags: ['Python', 'Docker', 'Networking'],
    links: [
      { label: 'GitHub', href: 'https://github.com/IslamTayeb/mosh-lite' },
      {
        label: 'Report',
        href: 'https://github.com/IslamTayeb/mosh-lite/blob/main/final_report.pdf',
      },
    ],
  },
  {
    title: 'xv6 Network Stack',
    category: 'Systems',
    desc: 'UDP networking for xv6: E1000 driver, DMA descriptor rings, packet queues, and benchmark harnesses.',
    tags: ['C', 'xv6', 'Networking'],
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/islamtayeb/xv6-networking-project',
      },
      {
        label: 'Report',
        href: 'https://github.com/IRSMsoso/xv6-networking-project/blob/main/final_report.pdf',
      },
    ],
  },
  {
    title: 'Helium Browser Raycast Extension',
    category: 'Product',
    desc: 'Raycast extension for jumping through Helium tabs, bookmarks, history, and web searches.',
    tags: ['TypeScript', 'Raycast', 'SQLite'],
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/raycast/extensions/pull/22290',
      },
      { label: 'Link', href: 'https://www.raycast.com/islamtayeb/helium' },
    ],
  },
  {
    title: 'Interview Solve Log',
    category: 'Applet',
    desc: 'A small interface for centralizing leetcode/neetcode prep logs.',
    tags: ['Practice', 'UI', 'Daily tool'],
    links: [
      { label: 'GitHub', href: 'https://github.com/IslamTayeb/solve-log' },
      { label: 'Link', href: 'https://solve-log.lovable.app/' },
    ],
  },
];
