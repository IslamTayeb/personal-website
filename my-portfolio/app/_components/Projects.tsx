"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { LucideGithub, Link as Link2 } from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Section } from "./Misc/Section";
import { Icon } from "@iconify/react";
import { Code, DefaultIcon } from "./sharedComponents";

export const Projects = () => {
  const projectsData = [
    {
      image: "/image1.jpg",
      projectName: "Wearable Carbon Nanotube",
      new: false,
      wip: true,
      projectLink: "https://netlify.com",
      projectDescription:
        "Consequat fugiat amet commodo exercitation tempor eiusmod sunt. Reprehenderit occaecat eu duis minim laboris aliqua fugiat. Ea magna voluptate voluptate cillum ad voluptate nisi laboris ipsum exercitation consequat labore amet.",
      projectTech: [
        "React",
        "Redux Toolkit",
        "SCSS",
        "Firebase",
        "Typescript",
        "PokeApi",
        "Material UI",
      ],
      projectTechLogo: [
        "mdi:react",
        "akar-icons:redux-fill",
        "mdi:sass",
        "mdi:firebase",
        "mdi:typescript-icon",
        "mdi:pokeapi",
        "material-symbols:monitor-outline",
      ],
      projectExternalLinks: {
        github: "https://github.com/IslamTayeb/GPT-2-reproduction",
        externalLink: "",
      },
    },
    {
      image: "/image1.jpg",
      projectName: "Wearable Carbon Nanotube",
      new: false,
      wip: true,
      projectLink: "https://netlify.com",
      projectDescription:
        "Consequat fugiat amet commodo exercitation tempor eiusmod sunt. Reprehenderit occaecat eu duis minim laboris aliqua fugiat. Ea magna voluptate voluptate cillum ad voluptate nisi laboris ipsum exercitation consequat labore amet.",
      projectTech: [
        "React",
        "Redux Toolkit",
        "SCSS",
        "Firebase",
        "Typescript",
        "PokeApi",
        "Material UI",
      ],
      projectTechLogo: [
        "mdi:react",
        "akar-icons:redux-fill",
        "mdi:sass",
        "mdi:firebase",
        "mdi:typescript-icon",
        "mdi:pokeapi",
        "material-symbols:monitor-outline",
      ],
      projectExternalLinks: {
        github: "",
        externalLink: "",
      },
    },
    {
      image: "/image1.jpg",
      projectName: "Wearable Carbon Nanotube Health Sensors",
      new: false,
      wip: false,
      projectLink: "https://netlify.com",
      projectDescription:
        "Enhanced wearable carbon nanotube sensors for athlete health monitoring, improving accuracy by 23% by optimizing biosensors and securing a $5,000 grant. Developed a live performance scoring interface with Angular to increase user engagement.",
      projectTech: [
        "Python",
        "TypeScript",
        "Angular",
        "SCSS",
        "Medical Devices",
      ],
      projectTechLogo: [
        "akar-icons:python-fill",
        "akar-icons:typescript-fill",
        "cib:angular",
        "akar-icons:sass-fill",
        "mdi:robot-industrial",
      ],
      projectExternalLinks: {
        github: "",
        externalLink: "",
      },
    },
  ];

  return (
    <Section className="font-sans flex-col gap-4">
      <motion.div
        initial="hidden"
        whileInView="visible"
        className="gap-4"
        viewport={{ once: true }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: 25 },
        }}
      >
        <Badge variant={"outline"} className="mb-4" id="projects">
          Projects
        </Badge>
        <h2 className="text-3xl font-semibold font-sans text-primary mb-3.5">
          I&apos;ve been making...
        </h2>
      </motion.div>

      <div className="projects-container">
        {projectsData.map(
          (
            {
              image,
              projectDescription,
              projectLink,
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
              <motion.div
                className="project max-md:w-full"
                key={projectName}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                variants={{
                  visible: { opacity: 1, y: 0 },
                  hidden: { opacity: 0, y: 25 },
                }}
              >
                <div className="project-info gap-3">
                  <h3
                    className={`project-info-title shadow-black antialiased max-md:w-full leading-tight flex flex-row items-center gap-2 ${
                      isOdd ? "text-right" : "text-left"
                    }`}
                  >
                    {!isOdd && (isNew || isWip) && (
                      <>
                        {isNew && (
                          <Badge
                            variant="default"
                            className="rounded-full font-semibold font-sans text-[0.35em] px-1 h-fit"
                          >
                            New
                          </Badge>
                        )}
                        {isWip && (
                          <Badge
                            variant="default"
                            className="rounded-full text-center font-semibold font-sans text-[0.35em] px-1 h-fit"
                          >
                            Work in Progress
                          </Badge>
                        )}
                      </>
                    )}
                    <div className="leading-none h-min">{projectName}</div>
                    {isOdd && (isNew || isWip) && (
                      <>
                        {isNew && (
                          <Badge
                            variant="default"
                            className="rounded-full font-semibold font-sans text-[0.35em] px-1 h-fit"
                          >
                            New
                          </Badge>
                        )}
                        {isWip && (
                          <Badge
                            variant="default"
                            className="rounded-full text-center font-semibold font-sans text-[0.35em] px-1 h-fit"
                          >
                            Work in Progress
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
                            icon={`${projectTechLogo[index]}`} // Assuming projectTechLogo[index] gives the correct logo name
                            className="inline text-current" // Merged className properties
                            height="14px"
                          />{" "}
                          {tech}
                        </Code>
                      </li>
                    ))}
                  </ul>
                  <ul className="project-info-links">
                    {projectExternalLinks.github && (
                      <li className="project-info-links-item">
                        <Link
                          href={projectExternalLinks.github}
                          className="project-info-links-item-link"
                        >
                          <LucideGithub size={16} />
                        </Link>
                      </li>
                    )}
                    {projectExternalLinks.externalLink && (
                      <li className="project-info-links-item">
                        <Link
                          href={projectExternalLinks.externalLink}
                          className="project-info-links-item-link"
                        >
                          <Link2 size={16} />
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>

                <div className="project-image overflow-hidden scale-95 rounded-sm border-accent border max-md:rounded-xl">
                  <div className="project-image-container blur-md brightness-50 hover:blur-0 hover:brightness-100 transition-all max-md:blur-0">
                    <Image
                      src={image}
                      fill
                      alt={projectName}
                      quality={100}
                      className=""
                    />
                  </div>
                </div>
              </motion.div>
            );
          }
        )}
      </div>
    </Section>
  );
};
