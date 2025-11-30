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
      image: '/HeliumRaycast.mp4',
      projectName: 'Helium Browser Raycast Extension',
      new: true,
      wip: false,
      projectDescription: (
        <>
          Raycast extension for keyboard-driven browser control, enabling seamless tab, bookmark, history, and web searches directly
        </>
      ),
      projectTech: [
        'TypeScript',
        'Raycast API',
        'AppleScript',
        'SQLite',
      ],
      projectTechLogo: [
        'simple-icons:typescript',
        'simple-icons:raycast',
        'mdi:apple',
        'simple-icons:sqlite',
      ],
      projectExternalLinks: {
        github: 'https://github.com/raycast/extensions/pull/22290',
        externalLink: 'https://www.raycast.com/islamtayeb/helium',
      },
    },
    {
      image: '/Etchr.mp4',
      projectName: 'GitHub README Generator',
      new: false,
      wip: false,
      projectDescription: (
        <>
          Web app using LLMs to generate GitHub README files through codebase analysis with a sliding window technique
        </>
      ),
      projectTech: [
        'Next.js',
        'Node.js',
        'PostgreSQL',
      ],
      projectTechLogo: [
        'simple-icons:nextdotjs',
        'simple-icons:nodedotjs',
        'simple-icons:postgresql',
      ],
      projectExternalLinks: {
        github: 'https://github.com/IslamTayeb/etchr',
        externalLink: 'https://www.etchr.dev/',
      },
    },
  ];

  return (
    <Section className="font-sans flex-col gap-4">
      <Badge variant={'outline'} className="mb-4" id="projects">
        Projects
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
                            className="rounded-md text-[0.6rem] px-1 py-[0.05rem] h-fit font-mono"
                          >
                            New
                          </Badge>
                        )}
                        {isWip && (
                          <Badge
                            variant="secondary"
                            className="rounded-md text-[0.6rem] px-1 py-[0.05rem] h-fit font-mono"
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
                            className="rounded-md text-[0.6rem] px-1 py-[0.05rem] h-fit font-mono"
                          >
                            New
                          </Badge>
                        )}
                        {isWip && (
                          <Badge
                            variant="secondary"
                            className="rounded-md text-[0.6rem] px-1 py-[0.05rem] h-fit font-mono"
                          >
                            In Progress
                          </Badge>
                        )}
                      </>
                    )}
                  </h3>
                  <div className="project-info-description border border-dashed max-md:border-0 max-md:bg-transparent max-md:hover:bg-transparent bg-card hover:bg-[#1E2229] transition-all">
                    <p className="text-base">{projectDescription}</p>
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
                            <LucideGithub size={14} /> GitHub
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
                            <Link2 size={14} /> Link
                          </Link>
                        </li>
                      )}
                    </ul>
                  )}
                </div>

                <div className="project-image overflow-hidden scale-95 rounded-sm border border-border/50 max-md:rounded-lg">
                  {image.endsWith('.mp4') ? (
                    <div className="project-image-container opacity-[0.5] hover:blur-0 hover:opacity-100 transition-all max-md:blur-0 max-md:brightness-50 saturate-0 hover:saturate-100">
                      <video
                        src={image}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="project-image-container opacity-[0.5] hover:blur-0 hover:opacity-100 transition-all max-md:blur-0 max-md:brightness-50 scale-110 saturate-0 hover:saturate-100">
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
