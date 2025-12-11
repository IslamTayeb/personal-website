'use client';

import { Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Code, DefaultIcon } from './sharedComponents';
import { Section } from './Misc/Section';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Link from 'next/link';

// Create a component registry object
const logoComponentRegistry = {
  'Duke Health': dynamic(
    () => import('./Icons/Duke Health').then((mod) => mod.DukeHealth),
    { ssr: true }
  ),
  DIHI: dynamic(() => import('./Icons/DIHI').then((mod) => mod.DIHI), {
    ssr: true,
  }),
  Aramco: dynamic(() => import('./Icons/Aramco').then((mod) => mod.Aramco), {
    ssr: true,
  }),
  Helian: dynamic(() => import('./Icons/Helian').then((mod) => mod.Helian), {
    ssr: true,
  }),
  Lifeedit: dynamic(
    () => import('./Icons/Lifeedit').then((mod) => mod.Lifeedit),
    { ssr: true }
  ),
  Sapien: dynamic(() => import('./Icons/Sapien').then((mod) => mod.Sapien), {
    ssr: true,
  }),
  Reveal: dynamic(() => import('./Icons/Reveal').then((mod) => mod.Reveal), {
    ssr: true,
  }),
  Soff: dynamic(() => import('./Icons/Soff').then((mod) => mod.Soff), {
    ssr: true,
  }),
  DukeUni: dynamic(() => import('./Icons/DukeUni').then((mod) => mod.DukeUni), {
    ssr: true,
  }),
  DukeUni2: dynamic(
    () => import('./Icons/DukeUni2').then((mod) => mod.DukeUni2),
    { ssr: true }
  ),
};

export function Experience() {
  const [showAll, setShowAll] = useState(false);
  const visibleExperiences = showAll ? experiences : experiences.slice(0, 3);

  const renderLogo = (logo: string, company: string) => {
    // Handle TSX components
    if (typeof logo === 'string' && logo.endsWith('.tsx')) {
      const componentPath = logo.replace('.tsx', '');
      const componentName = componentPath.split('/').pop();

      if (componentName && componentName in logoComponentRegistry) {
        const LogoComponent =
          logoComponentRegistry[
          componentName as keyof typeof logoComponentRegistry
          ];
        return <LogoComponent className="w-full h-full" />;
      }

      return (
        <div className="w-full h-full flex items-center justify-center">
          {company[0]}
        </div>
      );
    }

    // Handle image URLs and icon strings
    return (
      <Avatar className="w-12 h-12 flex items-center justify-center rounded-md min-w-12 min-h-12">
        {typeof logo === 'string' &&
          (logo.startsWith('http') || logo.startsWith('/')) ? (
          <AvatarImage src={logo} className="object-contain" />
        ) : (
          <DefaultIcon icon={logo} className="w-6 h-6" />
        )}
        <AvatarFallback className="bg-primary text-primary-foreground flex items-center justify-center rounded-md">
          {company[0]}
        </AvatarFallback>
      </Avatar>
    );
  };

  return (
    <Section className="mx-auto space-y-4">
      <Badge variant="outline" className="" id="experience">
        Experience
      </Badge>
      {visibleExperiences.map((experience, index) => (
        <div key={index}>
          <div
            className="border border-border/80 hover:border-border border-dashed rounded-lg p-3 py-2 bg-card hover:bg-card/50 transition-colors"
          >
            {/* Main Content Section */}
            <div className="flex flex-col gap-2 flex-1">
              {/* Logo + Role + Company + Date on same line */}
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 min-w-12 min-h-12 text-primary">
                  {renderLogo(experience.logo, experience.company)}
                </div>
                <div className="flex-1 flex flex-col ">
                  {/* Role + Company + Date */}
                  <div className="flex items-center gap-2 justify-between flex-wrap">
                    <span className="flex items-center">
                      <span className="font-medium text-base font-sans text-primary">
                        {experience.role}<span className="text-muted-foreground font-normal text-base ">,{'\u00A0'}</span>
                      </span>
                      {experience.company === 'Soff' && (
                        <Badge
                          variant="outline"
                          className="rounded-full font-semibold text-[0.4em] p-[0.2rem] px-1.5 h-fit text-nowrap font-mono "
                        >
                          Employee #2
                        </Badge>
                      )}
                      {experience.website ? (
                        <Link
                          href={experience.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-normal font-sans text-muted-foreground underline hover:no-underline "
                        >
                          {experience.company}
                        </Link>
                      ) : (
                        <span className="font-normal font-sans text-muted-foreground/80 ">
                          {experience.company}
                        </span>
                      )}
                    </span>
                    {experience.period && (
                      <span className="font-light text-muted-foreground text-sm whitespace-nowrap ">
                        {experience.period}
                      </span>
                    )}
                  </div>
                  {/* Description with integrated skills */}
                  <p className="text-muted-foreground font-normal text-base font-sans">
                    {experience.responsibilities[0]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      {experiences.length > 2 && (
        <div className="flex justify-end w-full">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs leading-none text-muted-foreground/80 -mt-0.5 flex items-center underline hover:no-underline tracking-wide"
          >
            {showAll ? 'See less...' : 'See more...'}
          </button>
        </div>
      )}
    </Section>
  );
}

const experiences = [
  {
    role: 'ML Research Assistant',
    company: 'Duke University',
    logo: 'Icons/DukeUni2.tsx',
    period: 'Aug 2025 – Present',
    location: 'Durham, NC',
    website: 'https://www.romerolab.org/',
    responsibilities: [
      <>
        Enzyme protocol mining tools using{' '}
        <Code>
          <DefaultIcon icon="simple-icons:pytorch" className="inline text-current" height="14px" /> PyTorch
        </Code>{' '}
        and services in{' '}
        <Code>
          <DefaultIcon icon="simple-icons:fastapi" className="inline text-current" height="14px" /> FastAPI
        </Code>
      </>,
    ],
    skills: [],
  },
  {
    role: 'Software Engineer Intern',
    company: 'Soff (YC S24)',
    website: 'https://soff.ai/',
    logo: 'Icons/Soff.tsx',
    period: 'May 2025 – Oct 2025',
    location: 'San Francisco, CA',
    responsibilities: [
      <>
        Sales intelligence for manufacturers using{' '}
        <Code>
          <DefaultIcon icon="simple-icons:nextdotjs" className="inline text-current" height="14px" /> Next.js
        </Code>{' '}
        and{' '}
        <Code>
          <DefaultIcon icon="devicon-plain:trpc" className="inline text-current" height="14px" /> tRPC
        </Code>{' '}
        as employee #2
      </>,
    ],
    skills: [],
  },
  {
    role: 'Software Engineer Intern',
    company: 'Helian',
    website: 'https://www.helian.ai/',
    logo: 'Icons/Helian.tsx',
    period: 'Dec 2024 – May 2025',
    location: 'Durham, NC',
    responsibilities: [
      <>
        Literature analysis tools for medical research using{' '}
        <Code>
          <DefaultIcon icon="simple-icons:nextdotjs" className="inline text-current" height="14px" /> Next.js
        </Code>{' '}
        and{' '}
        <Code>
          <DefaultIcon icon="simple-icons:fastapi" className="inline text-current" height="14px" /> FastAPI
        </Code>
      </>,
    ],
    skills: [],
  },
  {
    role: 'Software Engineer Intern',
    company: 'Life Edit',
    website: 'https://lifeeditinc.com/',
    logo: 'Icons/Lifeedit.tsx',
    period: 'Sep 2024 – May 2025',
    location: 'Durham, NC',
    responsibilities: [
      <>
        Non-linear RNA-seq analysis and dashboard for CRISPR experiments using{' '}
        <Code>
          <DefaultIcon icon="simple-icons:python" className="inline text-current" height="14px" /> Python
        </Code>
      </>,
    ],
    skills: [],
  },
  {
    role: 'ML Research Assistant',
    company: 'Duke University',
    logo: 'Icons/DukeUni2.tsx',
    period: 'Oct 2024 – Apr 2025',
    location: 'Durham, NC',
    website: 'https://sites.duke.edu/navid/',
    responsibilities: [
      <>
        Continual learning model for antibody affinity prediction using{' '}
        <Code>
          <DefaultIcon icon="simple-icons:pytorch" className="inline text-current" height="14px" /> PyTorch
        </Code>{' '}
        (<a href="https://scholar.google.com/citations?hl=en&user=2ZrlBUcAAAAJ" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">1 pre-print</a>)
      </>,
    ],
    skills: [],
  },
  {
    role: 'Software Engineer Intern',
    company: 'DIHI',
    website: 'https://dihi.org/',
    logo: 'Icons/DIHI.tsx',
    period: 'Jun 2024 – Aug 2024',
    location: 'Durham, NC',
    responsibilities: [
      <>
        Automated literature review system using{' '}
        <Code>
          <DefaultIcon icon="simple-icons:react" className="inline text-current" height="14px" /> React
        </Code>{' '}
        and {' '}
        <Code>
          <DefaultIcon icon="simple-icons:fastapi" className="inline text-current" height="14px" /> FastAPI
        </Code>
      </>,
    ],
    skills: [],
  },
  {
    role: 'Software Engineer Intern',
    company: 'Project: Sapien',
    website: 'https://www.projectsapien.com/',
    logo: 'Icons/Sapien.tsx',
    period: 'Nov 2023 – Feb 2024',
    location: 'Princeton, NJ',
    responsibilities: [
      <>
        Survey platform with NLP tools using{' '}
        <Code>
          <DefaultIcon icon="simple-icons:react" className="inline text-current" height="14px" /> React
        </Code>{' '}
        and{' '}
        <Code>
          <DefaultIcon icon="simple-icons:nodedotjs" className="inline text-current" height="14px" /> Node.js
        </Code>
      </>,
    ],
    skills: [],
  },
  {
    role: 'ML Research Assistant',
    company: 'Saudi Aramco',
    website: 'https://www.aramco.com/',
    logo: 'Icons/Aramco.tsx',
    period: 'Jul 2022 – Sep 2023',
    location: 'Dhahran, Saudi Arabia',
    responsibilities: [
      <>
        Traditional ML polymer synthesis for CO₂ capture using{' '}
        <Code>
          <DefaultIcon icon="simple-icons:python" className="inline text-current" height="14px" /> Python
        </Code>
        {' '}
        (<a href="https://scholar.google.com/citations?hl=en&user=2ZrlBUcAAAAJ" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">3 publications</a>)
      </>,
    ],
    skills: [],
  },
];
