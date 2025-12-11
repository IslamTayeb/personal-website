'use client';

import React, { useState } from 'react';
import { Section } from './Misc/Section';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Lock, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const teaching = [
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

const courses = [
  {
    name: 'Computer Architecture',
    code: 'CS 250',
    category: 'Systems',
    desc: "CPUs, caches, RISC-V assembly. Wish I'd gone deeper since it underpins so much of what I'm interested in now. Caching got really interesting toward the end. Started thinking about systems performance optimization.",
    locked: false,
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
    name: 'Database Systems',
    code: 'CS 516',
    category: 'Systems',
    desc: '',
    locked: true,
  },
  {
    name: 'Compiler Construction',
    code: 'CS 553',
    category: 'Systems',
    desc: '',
    locked: true,
  },
  {
    name: 'Data Structures & Algorithms',
    code: 'CS 201',
    category: 'Theory',
    desc: 'Hashing, graphs, trees. Loved weighted digraphs and their applications: GPS, routing, PageRank. Met some of my best friends here, so the best memories.',
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
    name: 'Linear Algebra',
    code: 'MATH 218',
    category: 'Theory',
    desc: 'Matrix ops, eigenvalues, SVD. Factorizations led me back to compression algorithms from my design days. Turns out DCT (JPEG) and DEFLATE (PNG) are factorizations too. Made me think about formats more too.',
    locked: false,
  },
  {
    name: 'Probability',
    code: 'STA 240L',
    category: 'Theory',
    desc: "Distributions, Bayes, inference. Took it for ML foundations, learned I don't actually love math. Poker probabilities  and combinations were kinda fun, but I learned quant trading wasn't for me here.",
    locked: false,
  },
  {
    name: 'Molecular Biology',
    code: 'BIO 201L',
    category: 'Biochemistry',
    desc: 'Gene expression, transcription factors, CRISPR. Too much memorization and hand holding (kinda hated the professor), but a useful refresher that pays off when reading enzyme research.',
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
    name: 'Organic Chemistry I & II',
    code: 'CHEM 201L/202L',
    category: 'Biochemistry',
    desc: 'Functional groups, stereochemistry, mechanisms, synthesis. Loved seeing lab reactions taught systematically. Orgo felt like its own language, and these courses gave me a real toolkit.',
    locked: false,
  },
  {
    name: 'Biochemistry I',
    code: 'BIOCHEM 301',
    category: 'Biochemistry',
    desc: "Protein structure, enzyme kinetics, metabolism. Nail in the coffin for premed. Too much memorization, lost the 'toolkit' feeling I had in orgo. It further gave me context for discussions with biologists, though not essential.",
    locked: false,
  },
];

const categoryStyles: Record<string, { pill: string; activePill: string; lockedPill: string; dot: string }> = {
  Systems: {
    pill: 'bg-orange-300/10 border-orange-300/20 hover:bg-orange-300/20 hover:border-orange-300/30 text-orange-200/80',
    activePill: 'bg-orange-300/20 border-orange-300/50 text-orange-200 ring-1 ring-orange-300/30',
    lockedPill: 'bg-orange-900/10 border-orange-800/15 text-orange-300/35 saturate-50 brightness-75 hover:bg-orange-900/15 hover:border-orange-800/25 hover:brightness-90',
    dot: 'bg-orange-300/50',
  },
  Theory: {
    pill: 'bg-blue-300/10 border-blue-300/20 hover:bg-blue-300/20 hover:border-blue-300/30 text-blue-200/80',
    activePill: 'bg-blue-300/20 border-blue-300/50 text-blue-200 ring-1 ring-blue-300/30',
    lockedPill: 'bg-blue-900/10 border-blue-800/15 text-blue-300/35 saturate-50 brightness-75 hover:bg-blue-900/15 hover:border-blue-800/25 hover:brightness-90',
    dot: 'bg-blue-300/50',
  },
  Biochemistry: {
    pill: 'bg-teal-300/10 border-teal-300/20 hover:bg-teal-300/20 hover:border-teal-300/30 text-teal-200/80',
    activePill: 'bg-teal-300/20 border-teal-300/50 text-teal-200 ring-1 ring-teal-300/30',
    lockedPill: 'bg-teal-900/10 border-teal-800/15 text-teal-300/35 saturate-50 brightness-75 hover:bg-teal-900/15 hover:border-teal-800/25 hover:brightness-90',
    dot: 'bg-teal-300/50',
  },
};

export const Courses = () => {
  const [active, setActive] = useState<string | null>(null);
  const allItems = [...teaching, ...courses];
  const activeItem = allItems.find((c) => c.code === active);

  return (
    <Section className="flex flex-col items-start gap-4">
      <div className="flex items-center justify-between w-full flex-wrap gap-2">
        <Badge variant={'outline'} className="" id="courses">
          Courses
        </Badge>
        <div className="flex gap-3 text-[10px] font-mono text-muted-foreground">
          {Object.entries(categoryStyles).map(([category, styles]) => (
            <span key={category} className="flex items-center gap-1.5">
              <span className={cn('w-2 h-2 rounded-full', styles.dot)} />
              {category}
            </span>
          ))}
        </div>
      </div>

      {/* Teaching Section */}
      <div className="w-full flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-muted-foreground font-medium font-sans">Teaching</span>
          <TooltipProvider delayDuration={50}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-3.5 h-3.5 text-muted-foreground/60 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="font-sans">
                <p className="text-xs">Assisted in discussions, office hours, and grading</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex flex-wrap w-full -m-0.5">
          {teaching.map((course) => {
            const isActive = active === course.code;
            const styles = categoryStyles[course.category];

            return (
              <div
                key={course.code}
                className={cn('p-0.5 relative group', course.locked ? 'cursor-not-allowed' : 'cursor-pointer')}
                onClick={() => !course.locked && setActive(isActive ? null : course.code)}
              >
                <span
                  className={cn(
                    'px-1 py-0.5 text-xs rounded-md border transition-all font-mono block relative',
                    course.locked
                      ? cn(styles.lockedPill, 'border-dashed')
                      : isActive
                        ? cn(styles.activePill, 'border-solid')
                        : cn(styles.pill, 'border-dashed')
                  )}
                >
                  {course.name}
                  {course.locked && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-md">
                      <Lock className="w-3 h-3 text-white/30" />
                    </span>
                  )}
                </span>
                {course.locked && (
                  <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 px-1.5 py-1 text-xs font-sans font-normal rounded-md bg-primary text-primary-foreground whitespace-nowrap opacity-0 scale-95 translate-y-1 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-150 ease-out pointer-events-none z-50">
                    Unlocks Spring &apos;26
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Coursework Section */}
      <div className="w-full flex flex-col gap-2">
        <span className="text-sm text-muted-foreground font-medium font-sans">Coursework</span>
        <div className="flex flex-wrap w-full -m-0.5">
          {courses.map((course) => {
            const isActive = active === course.code;
            const styles = categoryStyles[course.category];

            return (
              <div
                key={course.code}
                className={cn('p-0.5 relative group', course.locked ? 'cursor-not-allowed' : 'cursor-pointer')}
                onClick={() => !course.locked && setActive(isActive ? null : course.code)}
              >
                <span
                  className={cn(
                    'px-1 py-0.5 text-xs rounded-md border transition-all font-mono block relative',
                    course.locked
                      ? cn(styles.lockedPill, 'border-dashed')
                      : isActive
                        ? cn(styles.activePill, 'border-solid')
                        : cn(styles.pill, 'border-dashed')
                  )}
                >
                  {course.name}
                  {course.locked && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-md">
                      <Lock className="w-3 h-3 text-white/30" />
                    </span>
                  )}
                </span>
                {course.locked && (
                  <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 px-1.5 py-1 text-xs font-sans font-normal rounded-md bg-primary text-primary-foreground whitespace-nowrap opacity-0 scale-95 translate-y-1 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-150 ease-out pointer-events-none z-50">
                    Unlocks Spring &apos;26
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full text-sm flex items-start font-sans transition-all duration-200 ease-out">
        {activeItem ? (
          <span key={activeItem.code} className="text-muted-foreground animate-in fade-in duration-150">
            {activeItem.desc}
          </span>
        ) : (
          <div className="text-muted-foreground/60 italic animate-in fade-in duration-150">
            Click a course to see details
            <br />
            P.S. All courses taken @ Duke University
          </div>
        )}
      </div>
    </Section>
  );
};
