import type { Course } from '@/types/content';

export const teaching: Course[] = [
  {
    name: 'Computer Systems, TA',
    code: 'CS 310',
    category: 'Systems',
    desc: 'TA with Matthew Lentz. Assisted in discussions, office hours, and grading.',
    locked: true,
  },
  {
    name: 'Organic Chemistry II, Tutor',
    code: 'SAGE',
    category: 'Biochemistry',
    desc: 'Tutor with SAGE. Led study groups. Was impressed at how good chem majors started getting at this point. Made me think like a teacher for the first time to predict what will come up. Began noticing the craft behind designing good exams.',
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
