'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Course, CourseCategory } from '@/types/content';

const categoryStyles: Record<
  CourseCategory,
  {
    dot: string;
    border: string;
    active: string;
    inactive: string;
    locked: string;
  }
> = {
  Systems: {
    dot: 'bg-roy-r',
    border: 'border-roy-r',
    active: 'border-roy-r bg-roy-r/[0.14] text-foreground',
    inactive:
      'border-roy-r/35 bg-roy-r/[0.06] text-foreground hover:border-roy-r',
    locked:
      'border-roy-r/20 bg-roy-r/[0.04] text-muted-foreground/35 saturate-50',
  },
  Theory: {
    dot: 'bg-roy-o',
    border: 'border-roy-o',
    active: 'border-roy-o bg-roy-o/[0.18] text-foreground',
    inactive:
      'border-roy-o/35 bg-roy-o/[0.07] text-foreground hover:border-roy-o',
    locked:
      'border-roy-o/20 bg-roy-o/[0.05] text-muted-foreground/35 saturate-50',
  },
  Biochemistry: {
    dot: 'bg-roy-y',
    border: 'border-roy-y',
    active: 'border-roy-y bg-roy-y/[0.24] text-foreground',
    inactive:
      'border-roy-y/45 bg-roy-y/[0.1] text-foreground hover:border-roy-y',
    locked:
      'border-roy-y/25 bg-roy-y/[0.07] text-muted-foreground/35 saturate-50',
  },
};

function CourseButton({
  course,
  active,
  onToggle,
}: {
  course: Course;
  active: boolean;
  onToggle: () => void;
}) {
  const styles = categoryStyles[course.category];

  return (
    <button
      type="button"
      disabled={course.locked}
      data-locked={course.locked ? 'true' : undefined}
      aria-pressed={active}
      title={course.locked ? 'Locked for now' : course.desc}
      onClick={onToggle}
      className={cn(
        'relative inline-flex max-w-full items-center border px-1.5 py-0.5 font-mono text-[11px] leading-tight',
        course.locked
          ? `${styles.locked} border-dashed`
          : active
            ? styles.active
            : `${styles.inactive} border-dashed`
      )}
    >
      <span className="truncate whitespace-nowrap">{course.name}</span>
      {course.locked ? (
        <span className="absolute inset-0 flex items-center justify-center bg-background/35">
          <Lock className="h-3 w-3 text-muted-foreground/45" aria-hidden />
        </span>
      ) : null}
    </button>
  );
}

function CourseCluster({
  label,
  items,
  active,
  setActive,
}: {
  label: string;
  items: Course[];
  active: string | null;
  setActive: (code: string | null) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="font-mono text-sm uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </div>
      <div className="flex flex-wrap gap-1">
        {items.map((course) => (
          <CourseButton
            key={course.code}
            course={course}
            active={active === course.code}
            onToggle={() =>
              setActive(active === course.code ? null : course.code)
            }
          />
        ))}
      </div>
    </div>
  );
}

function CategoryLegend() {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-sm uppercase tracking-[0.12em] text-muted-foreground">
      {(Object.keys(categoryStyles) as CourseCategory[]).map((category) => (
        <li key={category} className="flex items-center gap-1.5">
          <span className={cn('h-2 w-2', categoryStyles[category].dot)} />
          <span>{category}</span>
        </li>
      ))}
    </ul>
  );
}

export function CourseSelector({
  coursework,
  teaching,
  defaultCourseCode,
  institution,
}: {
  coursework: Course[];
  teaching: Course[];
  defaultCourseCode?: string | null;
  institution: string;
}) {
  const [active, setActive] = useState<string | null>(
    defaultCourseCode ?? null
  );
  const allItems = [...coursework, ...teaching];
  const activeItem = active
    ? allItems.find((course) => course.code === active)
    : undefined;

  return (
    <div className="flex w-full flex-col gap-3.5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-2.5">
        <CategoryLegend />
        <span className="font-mono text-sm uppercase tracking-[0.12em] text-muted-foreground">
          {institution}
        </span>
      </div>
      <CourseCluster
        label="Coursework"
        items={coursework}
        active={active}
        setActive={setActive}
      />
      <CourseCluster
        label="Teaching"
        items={teaching}
        active={active}
        setActive={setActive}
      />
      <div
        data-testid="course-detail"
        className={cn(
          'flex h-[42px] flex-col justify-center border-l-2 pl-3',
          activeItem
            ? categoryStyles[activeItem.category].border
            : 'border-border'
        )}
      >
        {activeItem ? (
          <p
            data-testid="course-detail-text"
            className="line-clamp-2 text-sm leading-snug text-muted-foreground"
            title={activeItem.desc || 'Details pending.'}
          >
            {activeItem.desc || 'Details pending.'}
          </p>
        ) : (
          <div
            aria-label="No course selected"
            className="flex flex-col gap-1.5"
          >
            <span className="block h-2.5 w-2/3 bg-muted" />
            <span className="block h-2.5 w-1/2 bg-muted" />
          </div>
        )}
      </div>
    </div>
  );
}
