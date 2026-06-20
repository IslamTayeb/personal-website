import { Courses } from '@/components/site/courses';
import { Experience } from '@/components/site/experience';
import { Hero } from '@/components/site/hero';
import { Publications } from '@/components/site/publications';
import { WritingPreview } from '@/components/site/writing-preview';
import { RoybBand } from '@/components/primitives/royb-band';

export default function Home() {
  return (
    <>
      <header className="flex flex-col gap-3.5 py-7 md:py-8">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Islam Tayeb
          </span>
        </div>
        <RoybBand />
        <h1 className="max-w-2xl text-xl font-semibold leading-snug tracking-tight text-foreground md:text-2xl">
          Systems, research, and writing from{' '}
          <span className="text-roy-r">Islam Tayeb</span>.
        </h1>
        <p
          data-one-line="true"
          className="max-w-2xl truncate text-sm leading-relaxed text-foreground/80"
        >
          Building small systems for science, agents, and the tools around them.
        </p>
      </header>
      <Hero />
      <Experience />
      <Publications />
      <Courses />
      <WritingPreview />
    </>
  );
}
