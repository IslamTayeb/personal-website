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
    desc: 'Led study groups for the second organic chemistry sequence.',
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
    desc: 'Memory, synchronization, file systems, threads, and network drivers.',
    locked: false,
  },
  {
    name: 'Network Architecture',
    code: 'CS 514',
    category: 'Systems',
    desc: 'TCP/IP, routing, P2P systems, and datacenter networking.',
    locked: false,
  },
  {
    name: 'Computer Architecture',
    code: 'CS 250',
    category: 'Systems',
    desc: 'CPUs, caches, RISC-V assembly, paging, and performance.',
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
    desc: 'Distributions, Bayes, inference, and ML foundations.',
    locked: false,
  },
  {
    name: 'Linear Algebra',
    code: 'MATH 218',
    category: 'Theory',
    desc: 'Matrix operations, eigenvalues, SVD, and compression links.',
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
    desc: 'Hashing, graphs, trees, routing, and PageRank.',
    locked: false,
  },
  {
    name: 'Biochemistry I',
    code: 'BIOCHEM 301',
    category: 'Biochemistry',
    desc: 'Protein structure, enzyme kinetics, and metabolism.',
    locked: false,
  },
  {
    name: 'Organic Chemistry I & II',
    code: 'CHEM 201L/202L',
    category: 'Biochemistry',
    desc: 'Functional groups, stereochemistry, mechanisms, and synthesis.',
    locked: false,
  },
  {
    name: 'General Chemistry I & II',
    code: 'CHEM 101/210L',
    category: 'Biochemistry',
    desc: 'Atomic structure, thermodynamics, kinetics, and lab work.',
    locked: false,
  },
  {
    name: 'Molecular Biology',
    code: 'BIO 201L',
    category: 'Biochemistry',
    desc: 'Gene expression, transcription factors, and CRISPR.',
    locked: false,
  },
];

export const defaultCourseCode = 'CS 510';
