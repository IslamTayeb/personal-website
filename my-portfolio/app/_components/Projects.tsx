'use client';
import Image from 'next/image';
import Link from 'next/link';
import { LucideGithub, Link2 } from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Section } from './Misc/Section';
import { Icon } from '@iconify/react';
import { Code, DefaultIcon } from './sharedComponents';

export const Projects = () => {
  const projectsData = [
    {
      image: '/Etchr.mp4',
      projectName: 'Etchr – GitHub README Generator',
      new: false,
      wip: false,
      projectDescription: (
        <>
          Web application that uses Google&apos;s Gemini AI to automatically
          generate comprehensive GitHub README files by analyzing codebases,
          with a sliding window approach to handle large repositories.
        </>
      ),
      projectTech: [
        'Next.js',
        'Node.js',
        'Express',
        'PostgreSQL',
        'Gemini',
        'GitHub API',
        'GCP',
      ],
      projectTechLogo: [
        'simple-icons:nextdotjs',
        'simple-icons:nodedotjs',
        'simple-icons:express',
        'simple-icons:postgresql',
        'simple-icons:google',
        'simple-icons:github',
        'simple-icons:googlecloud',
      ],
      projectExternalLinks: {
        github: 'https://github.com/IslamTayeb/etchr',
        externalLink: 'https://www.etchr.dev/',
      },
    },
    {
      image: '/Jobtrack.mp4',
      projectName: 'Job Track – CLI Job Tracker',
      new: false,
      wip: false,
      projectDescription: (
        <>
          CLI tool that automates the tracking of job applications by extracting
          information from Gmail emails using Google Gemini AI and updating a
          Google Sheet, eliminating manual data entry.
        </>
      ),
      projectTech: [
        'Python',
        'Google Gmail API',
        'Google Sheets API',
        'Google Gemini',
        // "OAuth",
        'CLI',
      ],
      projectTechLogo: [
        'simple-icons:python',
        'simple-icons:gmail',
        'simple-icons:googlesheets',
        'simple-icons:google',
        // "mdi:key-chain",
        'mdi:console-line',
      ],
      projectExternalLinks: {
        github: 'https://github.com/IslamTayeb/job-sheet-tracker',
        externalLink: '',
      },
    },
  ];

  return (
    <Section className="font-sans flex-col gap-4">
      <Badge variant={'outline'} className="mb-4" id="projects">
        Selected Projects
      </Badge>

      <div className="projects-container">
        {projectsData.map(
          (
            {
              image,
              projectDescription,
              projectExternalLinks,
              projectName,
              projectTech,
              projectTechLogo,
              new: isNew,
              wip: isWip,
            },
            index
          ) => {
            const isOdd = index % 2 !== 0;
            return (
              <div className="project max-md:w-full" key={projectName}>
                <div className="project-info gap-2.5">
                  <h3
                    className={`project-info-title antialiased max-md:w-full leading-tight flex flex-row items-center gap-2 text-primary  ${
                      isOdd ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div className="leading-none h-min invisible absolute max-md:visible max-md:relative text-left w-auto font-semibold">
                      {projectName}
                    </div>
                    {!isOdd && (isNew || isWip) && (
                      <>
                        {isNew && (
                          <Badge
                            variant="default"
                            className="rounded-full font-semibold text-[0.4em] p-[0.165rem] h-fit text-nowrap font-mono leading-none px-1"
                          >
                            New!
                          </Badge>
                        )}
                        {isWip && (
                          <Badge
                            variant="secondary"
                            className="rounded-full text-center font-semibold text-[0.4em] p-[0.165rem] h-fit text-nowrap font-mono leading-none px-1"
                          >
                            In Progress
                          </Badge>
                        )}
                      </>
                    )}
                    <div className="leading-none h-min visible relative max-md:invisible max-md:absolute font-semibold">
                      {projectName}
                    </div>
                    {isOdd && (isNew || isWip) && (
                      <>
                        {isNew && (
                          <Badge
                            variant="default"
                            className="rounded-full font-semibold text-[0.4em] p-[0.165rem] h-fit text-nowrap font-mono leading-none px-1"
                          >
                            New!
                          </Badge>
                        )}
                        {isWip && (
                          <Badge
                            variant="default"
                            className="rounded-full text-center font-semibold text-[0.4em] p-[0.165rem] h-fit text-nowrap font-mono leading-none px-1"
                          >
                            In Progress
                          </Badge>
                        )}
                      </>
                    )}
                  </h3>
                  <div className="project-info-description border max-md:border-0 bg-card">
                    <p>{projectDescription}</p>
                  </div>
                  <ul className="project-info-tech-list">
                    {projectTech.map((tech, index) => (
                      <li key={tech}>
                        <Code>
                          <DefaultIcon
                            icon={`${projectTechLogo[index]}`}
                            className="inline text-current"
                            height="14px"
                          />{' '}
                          {tech}
                        </Code>
                      </li>
                    ))}
                  </ul>
                  {(projectExternalLinks?.github ||
                    projectExternalLinks?.externalLink) && (
                    <ul className="project-info-links max-md:w-full max-md:justify-end">
                      {projectExternalLinks?.github && (
                        <li className="project-info-links-item">
                          <Link
                            href={projectExternalLinks.github}
                            className="project-info-links-item-link flex flex-row items-center gap-2 font-mono text-sm font-medium underline hover:no-underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <LucideGithub size={16} /> GitHub
                          </Link>
                        </li>
                      )}
                      {projectExternalLinks?.externalLink && (
                        <li className="project-info-links-item">
                          <Link
                            href={projectExternalLinks.externalLink}
                            className="project-info-links-item-link flex flex-row items-center gap-2 font-mono text-sm font-medium underline hover:no-underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Link2 size={16} /> Link
                          </Link>
                        </li>
                      )}
                    </ul>
                  )}
                </div>

                <div className="project-image overflow-hidden scale-95 rounded-sm border-accent border max-md:rounded-lg">
                  {image.endsWith('.mp4') ? (
                    <video
                      src={image}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="object-cover project-image-container opacity-[0.5] hover:blur-0 hover:opacity-100 transition-all max-md:blur-0 saturate-0 hover:saturate-100"
                    />
                  ) : (
                    <div className="project-image-container opacity-[0.5] hover:blur-0 hover:opacity-100 transition-all max-md:blur-0 scale-110 saturate-0 hover:saturate-100">
                      <Image
                        src={image}
                        fill
                        alt={projectName}
                        quality={100}
                        className=""
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          }
        )}
      </div>
      <Link
        href="https://github.com/IslamTayeb"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs leading-none ml-auto text-muted-foreground/80 mt-3 justify-end flex items-center underline hover:no-underline font-mono tracking-wide"
      >
        See more on GitHub...
      </Link>
    </Section>
  );
};
