'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Section } from './Misc/Section';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const courses = [
  {
    name: 'Operating Systems',
    code: 'CS 510',
    category: 'Systems',
    desc: 'Process scheduling, memory management, file systems.',
  },
  {
    name: 'Computer Architecture',
    code: 'CS 250',
    category: 'Systems',
    desc: 'Pipelining, caches, RISC-V assembly.',
  },
  {
    name: 'Network Architecture',
    code: 'CS 514',
    category: 'Systems',
    desc: 'TCP/IP, routing protocols, sockets.',
  },
  {
    name: 'Database Systems',
    code: 'CS 516',
    category: 'Systems',
    desc: 'Query optimization, B+ trees, transactions.',
  },
  {
    name: 'Compiler Construction',
    code: 'CS 553',
    category: 'Systems',
    desc: 'Lexing, parsing, code generation.',
  },
  {
    name: 'Data Structures & Algorithms',
    code: 'CS 201',
    category: 'Theory',
    desc: 'Core DSA: graphs, trees, DP.',
  },
  {
    name: 'Discrete Math',
    code: 'CS 230',
    category: 'Theory',
    desc: 'Proofs, combinatorics, graph theory.',
  },
  {
    name: 'Linear Algebra',
    code: 'MATH 218',
    category: 'Theory',
    desc: 'Matrix ops, eigenvalues, SVD for ML.',
  },
  {
    name: 'Probability',
    code: 'STA 240L',
    category: 'Theory',
    desc: 'Distributions, Bayes, inference.',
  },
  {
    name: 'Molecular Biology',
    code: 'BIO 201L',
    category: 'Biochemistry',
    desc: 'Gene expression, CRISPR.',
  },
  {
    name: 'General Chemistry I & II',
    code: 'CHEM 101/210L',
    category: 'Biochemistry',
    desc: 'Atomic structure, thermodynamics, kinetics, equilibria.',
  },
  {
    name: 'Organic Chemistry I & II',
    code: 'CHEM 201L/202L',
    category: 'Biochemistry',
    desc: 'Functional groups, stereochemistry, mechanisms, synthesis.',
  },
];

const categoryStyles: Record<string, { pill: string; dot: string }> = {
  Systems: {
    pill: 'bg-orange-300/10 border-orange-300/20 hover:bg-orange-300/20 hover:border-orange-300/30 text-orange-200/80',
    dot: 'bg-orange-300/50',
  },
  Theory: {
    pill: 'bg-blue-300/10 border-blue-300/20 hover:bg-blue-300/20 hover:border-blue-300/30 text-blue-200/80',
    dot: 'bg-blue-300/50',
  },
  Biochemistry: {
    pill: 'bg-teal-300/10 border-teal-300/20 hover:bg-teal-300/20 hover:border-teal-300/30 text-teal-200/80',
    dot: 'bg-teal-300/50',
  },
};

const HOVER_THRESHOLD = 10;

export const Courses = () => {
  const [active, setActive] = useState<string | null>(null);
  const [isInsidePill, setIsInsidePill] = useState(false);
  const activeCourse = courses.find((c) => c.code === active);
  const pillRefs = useRef<Map<string, HTMLSpanElement>>(new Map());
  const rafRef = useRef<number | null>(null);

  const getDistanceFromElement = useCallback(
    (element: HTMLElement, mouseX: number, mouseY: number) => {
      const rect = element.getBoundingClientRect();
      const closestX = Math.max(rect.left, Math.min(mouseX, rect.right));
      const closestY = Math.max(rect.top, Math.min(mouseY, rect.bottom));
      return Math.sqrt((mouseX - closestX) ** 2 + (mouseY - closestY) ** 2);
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!active || isInsidePill) return;
      if (rafRef.current) return;

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const activePill = pillRefs.current.get(active);
        if (!activePill) return;

        const distance = getDistanceFromElement(activePill, e.clientX, e.clientY);
        if (distance > HOVER_THRESHOLD) {
          setActive(null);
        }
      });
    },
    [active, isInsidePill, getDistanceFromElement]
  );

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

      <div
        className="flex flex-wrap w-full -m-0.5"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setActive(null)}
      >
        {courses.map((course) => (
          <div key={course.code} className="p-0.5 cursor-default">
            <span
              ref={(el) => {
                if (el) pillRefs.current.set(course.code, el);
              }}
              onMouseEnter={() => {
                setActive(course.code);
                setIsInsidePill(true);
              }}
              onMouseLeave={() => setIsInsidePill(false)}
              className={cn(
                'px-1 py-0.5 text-xs rounded-md border border-dashed transition-all font-mono block',
                categoryStyles[course.category].pill
              )}
            >
              {course.name}
            </span>
          </div>
        ))}
      </div>

      <div className="w-full p-3 rounded-md border border-dashed bg-card text-sm flex items-center">
        {activeCourse ? (
          <span className="text-muted-foreground">{activeCourse.desc}</span>
        ) : (
          <span className="text-muted-foreground/60 italic">
            Hover over a course to see details
          </span>
        )}
      </div>
    </Section>
  );
};
