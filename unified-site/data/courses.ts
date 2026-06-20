import type { Course } from '@/types/content';

export const teaching: Course[] = [
  {
    name: 'Computer Systems, Prof. Lentz',
    code: 'CS 310',
    category: 'Systems',
    desc: 'Assisted in discussions, office hours, and grading.',
    locked: true,
  },
  {
    name: 'Organic Chemistry II, SAGE',
    code: 'SAGE',
    category: 'Biochemistry',
    desc: 'Led study groups. Was impressed at how good chem majors started getting at this point. Made me think like a teacher for the first time to predict what will come up.',
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
    desc: 'TCP/IP, routing, data centers. Finally understood how P2P works and how datacenter routing differs from the public internet.',
    locked: false,
  },
  {
    name: 'Computer Architecture',
    code: 'CS 250',
    category: 'Systems',
    desc: 'CPUs, caches, RISC-V assembly. Caching and paging got interesting toward the end and pushed me toward performance optimization.',
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
    desc: 'Distributions, Bayes, inference. Took it to build foundations for my ML research and liked the schools-of-thought pieces toward the end.',
    locked: false,
  },
  {
    name: 'Linear Algebra',
    code: 'MATH 218',
    category: 'Theory',
    desc: 'Matrix ops, eigenvalues, SVD. Factorizations led me back to compression algorithms from my design days.',
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
    desc: 'Hashing, graphs, trees. Loved weighted digraphs and their applications: GPS, routing, PageRank.',
    locked: false,
  },
  {
    name: 'Biochemistry I',
    code: 'BIOCHEM 301',
    category: 'Biochemistry',
    desc: 'Protein structure, enzyme kinetics, metabolism. Too much memorization, but it made computational biochemistry feel worth pursuing.',
    locked: false,
  },
  {
    name: 'Organic Chemistry I & II',
    code: 'CHEM 201L/202L',
    category: 'Biochemistry',
    desc: 'Functional groups, stereochemistry, mechanisms, synthesis. Orgo felt like its own language, and these courses gave me a real toolkit.',
    locked: false,
  },
  {
    name: 'General Chemistry I & II',
    code: 'CHEM 101/210L',
    category: 'Biochemistry',
    desc: 'Atomic structure, thermodynamics, kinetics. The quantum bits and later experiments were the parts that stuck.',
    locked: false,
  },
  {
    name: 'Molecular Biology',
    code: 'BIO 201L',
    category: 'Biochemistry',
    desc: 'Gene expression, transcription factors, CRISPR. A useful refresher that pays off when reading enzyme research.',
    locked: false,
  },
];

export const defaultCourseCode = 'CS 510';
