'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';
import {
  courses as courseItems,
  defaultCourseCode,
  teaching,
  type Course,
  type CourseCategory,
} from '@/lib/lab-data';
import { Section, Variant } from './frame';

const categoryStyles: Record<
  CourseCategory,
  {
    dot: string;
    text: string;
    border: string;
    active: string;
    inactive: string;
    locked: string;
  }
> = {
  Systems: {
    dot: 'bg-roy-r',
    text: 'text-roy-r',
    border: 'border-roy-r',
    active: 'border-roy-r bg-roy-r/[0.14] text-foreground',
    inactive:
      'border-roy-r/35 bg-roy-r/[0.06] text-foreground hover:border-roy-r',
    locked:
      'border-roy-r/20 bg-roy-r/[0.04] text-muted-foreground/35 saturate-50',
  },
  Theory: {
    dot: 'bg-roy-o',
    text: 'text-roy-o',
    border: 'border-roy-o',
    active: 'border-roy-o bg-roy-o/[0.18] text-foreground',
    inactive:
      'border-roy-o/35 bg-roy-o/[0.07] text-foreground hover:border-roy-o',
    locked:
      'border-roy-o/20 bg-roy-o/[0.05] text-muted-foreground/35 saturate-50',
  },
  Biochemistry: {
    dot: 'bg-roy-y',
    text: 'text-roy-y',
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
  onSelect,
  onDeselect,
}: {
  course: Course;
  active: boolean;
  onSelect: () => void;
  onDeselect: () => void;
}) {
  const styles = categoryStyles[course.category];

  return (
    <button
      type="button"
      disabled={course.locked}
      data-locked={course.locked ? 'true' : undefined}
      aria-pressed={active}
      title={course.locked ? 'Locked for now' : course.desc}
      onClick={() => {
        if (!active) {
          onSelect();
        }
      }}
      onDoubleClick={onDeselect}
      className={`relative inline-flex items-center border px-1.5 py-0.5 font-mono text-[11px] leading-tight ${
        course.locked
          ? `${styles.locked} border-dashed`
          : active
            ? styles.active
            : `${styles.inactive} border-dashed`
      }`}
    >
      <span>{course.name}</span>
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
  onSelect,
  onDeselect,
}: {
  label: string;
  items: Course[];
  active: string | null;
  onSelect: (code: string) => void;
  onDeselect: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </div>
      <div className="flex flex-wrap gap-1">
        {items.map((course) => (
          <CourseButton
            key={course.code}
            course={course}
            active={active === course.code}
            onSelect={() => onSelect(course.code)}
            onDeselect={onDeselect}
          />
        ))}
      </div>
    </div>
  );
}

function CategoryLegend() {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
      {(Object.keys(categoryStyles) as CourseCategory[]).map((category) => (
        <li key={category} className="flex items-center gap-1.5">
          <span className={`h-2 w-2 ${categoryStyles[category].dot}`} />
          <span>{category}</span>
        </li>
      ))}
    </ul>
  );
}

export function CoursesSection() {
  const [active, setActive] = useState<string | null>(defaultCourseCode);
  const allItems = [...courseItems, ...teaching];
  const activeItem = active
    ? allItems.find((course) => course.code === active)
    : undefined;

  return (
    <Section
      index="5"
      title="Courses — current site adapted"
      accent="text-roy-y"
      cols={1}
      note="Real course and teaching content from islamtayeb.dev, tightened into a lab-style index. Clickable courses use the pointer cursor; locked courses are disabled and use the not-allowed cursor."
    >
      <Variant label="Selected — dense course index" tag="draft">
        <div className="flex w-full flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
            <CategoryLegend />
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              Duke University
            </span>
          </div>

          <CourseCluster
            label="Coursework"
            items={courseItems}
            active={active}
            onSelect={setActive}
            onDeselect={() => setActive(null)}
          />
          <CourseCluster
            label="Teaching"
            items={teaching}
            active={active}
            onSelect={setActive}
            onDeselect={() => setActive(null)}
          />

          <div
            className={`flex min-h-[33px] flex-col justify-center border-l-2 pl-3 ${
              activeItem
                ? categoryStyles[activeItem.category].border
                : 'border-border'
            }`}
          >
            {activeItem ? (
              <p className="text-xs leading-snug text-muted-foreground text-pretty">
                {activeItem.desc || 'Details pending.'}
              </p>
            ) : (
              <div className="grid gap-1">
                <span className="h-3 w-2/3 bg-muted" />
                <span className="h-3 w-1/2 bg-muted" />
              </div>
            )}
          </div>
        </div>
      </Variant>
    </Section>
  );
}
