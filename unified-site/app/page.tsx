import { Courses } from '@/components/site/courses';
import { Experience } from '@/components/site/experience';
import { Hero } from '@/components/site/hero';
import { Publications } from '@/components/site/publications';
import { WritingPreview } from '@/components/site/writing-preview';
import { RoybBand } from '@/components/primitives/royb-band';

export default function Home() {
  return (
    <>
      <div className="py-2.5 md:py-3">
        <RoybBand />
      </div>
      <Hero />
      <Experience />
      <Publications />
      <Courses />
      <WritingPreview />
    </>
  );
}
