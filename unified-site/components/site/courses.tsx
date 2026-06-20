import { CourseSelector } from '@/components/primitives/course-selector';
import { BorderedPanel, Section } from '@/components/primitives/section';
import { courses, defaultCourseCode, teaching } from '@/data/courses';

export function Courses() {
  return (
    <Section
      id="courses"
      index="5"
      title="Courses"
      accent="text-roy-y"
      note="Real course and teaching content with locked-state and selection behavior preserved."
    >
      <BorderedPanel>
        <CourseSelector
          coursework={courses}
          teaching={teaching}
          defaultCourseCode={defaultCourseCode}
          institution="Duke University"
        />
      </BorderedPanel>
    </Section>
  );
}
