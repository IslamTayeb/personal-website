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
    tint: string;
  }
> = {
  Systems: {
    dot: 'bg-roy-o',
    text: 'text-roy-o',
    border: 'border-roy-o',
    active: 'border-roy-o bg-roy-o/10 text-foreground',
    inactive: 'border-roy-o/35 text-foreground hover:border-roy-o',
    locked: 'border-roy-o/20 text-muted-foreground/45 opacity-45',
    tint: 'course-pill-o',
  },
  Theory: {
    dot: 'bg-roy-b',
    text: 'text-roy-b',
    border: 'border-roy-b',
    active: 'border-roy-b bg-roy-b/10 text-foreground',
    inactive: 'border-roy-b/35 text-foreground hover:border-roy-b',
    locked: 'border-roy-b/20 text-muted-foreground/45 opacity-45',
    tint: 'course-pill-b',
  },
  Biochemistry: {
    dot: 'bg-roy-y',
    text: 'text-roy-y',
    border: 'border-roy-y',
    active: 'border-roy-y bg-roy-y/10 text-foreground',
    inactive: 'border-roy-y/40 text-foreground hover:border-roy-y',
    locked: 'border-roy-y/25 text-muted-foreground/45 opacity-45',
    tint: 'course-pill-y',
  },
};

function CourseButton({
  course,
  active,
  onSelect,
}: {
  course: Course;
  active: boolean;
  onSelect: () => void;
}) {
  const styles = categoryStyles[course.category];

  return (
    <button
      type="button"
      disabled={course.locked}
      data-locked={course.locked ? 'true' : undefined}
      aria-pressed={active}
      title={course.locked ? 'Locked for now' : course.desc}
      onClick={onSelect}
      className={`inline-flex items-center border px-1.5 py-0.5 font-mono text-[11px] leading-tight transition-colors ${styles.tint} ${
        course.locked
          ? `${styles.locked} border-dashed`
          : active
            ? styles.active
            : `${styles.inactive} border-dashed`
      }`}
    >
      {course.locked ? (
        <Lock className="mr-1 h-3 w-3 shrink-0" aria-hidden />
      ) : null}
      <span>{course.name}</span>
      <span className="ml-1 text-muted-foreground/60">/{course.code}</span>
      {course.locked ? (
        <span className="ml-1 text-muted-foreground/40">locked</span>
      ) : null}
    </button>
  );
}

function CourseCluster({
  label,
  items,
  active,
  onSelect,
}: {
  label: string;
  items: Course[];
  active: string;
  onSelect: (code: string) => void;
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
  const [active, setActive] = useState(defaultCourseCode);
  const allItems = [...courseItems, ...teaching];
  const activeItem =
    allItems.find((course) => course.code === active) ??
    allItems.find((course) => !course.locked);

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
          />
          <CourseCluster
            label="Teaching"
            items={teaching}
            active={active}
            onSelect={setActive}
          />

          {activeItem ? (
            <div
              className={`border-l-2 pl-3 ${categoryStyles[activeItem.category].border}`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="text-sm font-medium text-foreground">
                  {activeItem.name}
                </span>
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.12em] ${categoryStyles[activeItem.category].text}`}
                >
                  {activeItem.code} / {activeItem.category}
                </span>
              </div>
              <p className="mt-1 text-xs leading-snug text-muted-foreground text-pretty">
                {activeItem.desc || 'Details pending.'}
              </p>
            </div>
          ) : null}
        </div>
      </Variant>
    </Section>
  );
}
