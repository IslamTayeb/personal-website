"use client";
import Image from "next/image";
import Link from "next/link";
import { LucideGithub, Link as Link2 } from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Section } from "./Misc/Section";
import { Icon } from "@iconify/react";
import { Code, DefaultIcon } from "./sharedComponents";

export const Projects = () => {
  const projectsData = [
    {
      image: "/finder.avif",
      projectName: "Better Finder",
      new: false,
      wip: true,
      projectDescription: (
        <>
          Developing a native macOS Finder alternative for developers with AI-powered search, customizable workflows, and advanced filtering capabilities. Designed to offer power users with maximal automation and productivity.
        </>
      ),
      projectTech: [
        "Swift",
        "SwiftUI",
        "Core ML",
        "macOS API",
        "Metal",
        "FileProvider",
      ],
      projectTechLogo: [
        "simple-icons:swift",
        "cib:swift",
        "simple-icons:apple",
        "fa6-brands:apple",
        "file-icons:metal",
        "material-symbols:folder-outline",
      ],
    },
    {
      image: "/Etchr.mp4",
      projectName: "Etchr – GitHub README Generator",
      new: true,
      wip: false,
      projectDescription: (
        <>
          Web application that reduces README creation time from 120+ minutes to 5 clicks, serving 100+ users with 65% repeat usage by leveraging Google&apos;s Gemini AI to analyze codebases and generate documentation.
        </>
      ),
      projectTech: [
        "TypeScript",
        "Next.js",
        // "React.js",
        "Express.js",
        "Node.js",
        "Supabase",
        // "PostgreSQL",
        "Google Gemini",
        // "REST APIs",
        // "Framer Motion",
        // "Tailwind CSS",
        "GCP",
        // "Docker"
      ],
      projectTechLogo: [
        "simple-icons:typescript",
        "simple-icons:nextdotjs",
        // "simple-icons:react",
        "simple-icons:express",
        "simple-icons:nodedotjs",
        "simple-icons:supabase",
        // "simple-icons:postgresql",
        "simple-icons:google",
        // "mdi:api",
        // "simple-icons:framer",
        // "simple-icons:tailwindcss",
        "simple-icons:googlecloud",
        // "simple-icons:docker"
      ],
      projectExternalLinks: {
        github: "https://github.com/IslamTayeb/etchr",
        externalLink: "https://www.etchr.dev/",
      },
    },
    {
      image: "/Jobtrack.mp4",
      projectName: "Job Track – CLI Job Tracker",
      new: false,
      wip: false,
      projectDescription: (
        <>
          CLI tool that automates the tracking of job applications by extracting information from Gmail emails using Google Gemini AI and updating a Google Sheet, eliminating manual data entry.
        </>
      ),
      projectTech: [
        "Python",
        "Google Gmail API",
        "Google Sheets API",
        "Google Gemini",
        // "OAuth",
        "CLI",
      ],
      projectTechLogo: [
        "simple-icons:python",
        "simple-icons:gmail",
        "simple-icons:googlesheets",
        "simple-icons:google",
        // "mdi:key-chain",
        "mdi:console-line",
      ],
      projectExternalLinks: {
        github: "https://github.com/IslamTayeb/job-sheet-tracker",
        externalLink: "",
      },
    },
  ];

  return (
    <Section className="font-sans flex-col gap-4">
      <Badge variant={"outline"} className="mb-4" id="projects">
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
              <div
                className="project max-md:w-full"
                key={projectName}
              >
                <div className="project-info gap-2.5">
                  <h3
                    className={`project-info-title antialiased max-md:w-full leading-tight flex flex-row items-center gap-2 text-primary  ${isOdd ? "text-right" : "text-left"
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
                            className="rounded-full font-semibold text-[0.4em] p-[0.165rem] h-fit text-nowrap font-mono leading-none"
                          >
                            New!
                          </Badge>
                        )}
                        {isWip && (
                          <Badge
                            variant="secondary"
                            className="rounded-full text-center font-semibold text-[0.4em] p-[0.165rem] h-fit text-nowrap font-mono leading-none"
                          >
                            In Progress
                          </Badge>)}
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
                            className="rounded-full font-semibold text-[0.4em] p-[0.165rem] h-fit text-nowrap font-mono leading-none"
                          >
                            New!
                          </Badge>
                        )}
                        {isWip && (
                          <Badge
                            variant="default"
                            className="rounded-full text-center font-semibold text-[0.4em] p-[0.165rem] h-fit text-nowrap font-mono leading-none"
                          >
                            In Progress
                          </Badge>
                        )}
                      </>
                    )}
                  </h3>
                  <div className="project-info-description border max-md:border-0">
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
                          />{" "}
                          {tech}
                        </Code>
                      </li>
                    ))}
                  </ul>
                  <ul className="project-info-links max-md:w-full max-md:justify-end">
                    {projectExternalLinks?.github && (
                      <li className="project-info-links-item ">
                        <Link
                          href={projectExternalLinks.github}
                          className="project-info-links-item-link flex flex-row items-center gap-2 font-mono text-sm font-medium"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <LucideGithub size={16} /> GitHub
                        </Link>
                      </li>
                    )}
                    {projectExternalLinks?.externalLink && (
                      <li className="project-info-links-item ">
                        <Link
                          href={projectExternalLinks.externalLink}
                          className="project-info-links-item-link flex flex-row items-center gap-2 font-mono text-sm font-medium"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Link2 size={16} /> Link
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>

                <div
                  className="project-image overflow-hidden scale-95 rounded-sm border-accent border max-md:rounded-lg"
                  onClick={() => {
                    // Create a modal/fullscreen view
                    const element = image.endsWith('.mp4')
                      ? document.createElement('video')
                      : document.createElement('img');

                    const modal = document.createElement('div');
                    modal.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center';
                    modal.onclick = () => document.body.removeChild(modal);

                    if (image.endsWith('.mp4')) {
                      (element as HTMLVideoElement).src = image;
                      (element as HTMLVideoElement).autoplay = true;
                      (element as HTMLVideoElement).loop = true;
                      (element as HTMLVideoElement).muted = true;
                      (element as HTMLVideoElement).playsInline = true;
                    } else {
                      (element as HTMLImageElement).src = image;
                    }

                    element.className = 'max-h-[90vh] max-w-[90vw] object-contain';
                    modal.appendChild(element);
                    document.body.appendChild(modal);
                  }}
                >
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
        className="text-xs leading-none ml-auto text-muted-foreground/80 hover:text-primary mt-3 justify-end flex items-center transition-colors hover:underline font-mono tracking-wide"
      >
        See more on GitHub...
      </Link>
    </Section>
  );
};
