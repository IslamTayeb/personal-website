"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { LucideGithub, Link as Link2 } from "lucide-react";
import React, { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Section } from "./Misc/Section";
import { Icon } from "@iconify/react";

const Code = ({ className, ...props }: ComponentPropsWithoutRef<"span">) => {
  return (
    <span
      className={cn(
        "bg-accent/30 hover:bg-accent/50 transition-colors border border-accent px-1 py-0.5 rounded-sm text-primary font-mono text-nowrap",
        className
      )}
      {...props}
    />
  );
};

export const Projects = () => {
  const projectsData = [
    {
      image: "/image1.jpg",
      projectName: "Wearable Carbon Nanotube",
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
        "material-symbols:monitor-outline"
      ],
      projectExternalLinks: {
        github: "",
        externalLink: "",
      },
    },
    {
      image: "/image1.jpg",
      projectName: "Magna exercitation eiusmod",
      projectLink: "https://netlify.com",
      projectDescription:
        "Adipisicing enim qui non in proident et mollit nisi minim minim. Magna exercitation eiusmod ea aliqua veniam esse ex consequat velit duis velit fugiat non sit. Et quis dolor commodo sint ut aute minim labore nostrud minim minim.",
      projectTech: [
        "Minim Esse",
        "Enim",
        "Deus Ipsum",
        "Machina Ipsum",
        "Lorem Duis",
        "Lorem Ipsum",
        "Aliqua Ipsum",
      ],
      projectTechLogo: [
        "logos:some-icon",
        "logos:another-icon",
        "logos:third-icon",
        "logos:fourth-icon",
        "logos:fifth-icon",
        "logos:sixth-icon",
        "logos:seventh-icon",
      ],
      projectExternalLinks: {
        github: "",
        externalLink: "",
      },
    },
    {
      image: "/image1.jpg",
      projectName: "Wearable Carbon Nanotube Health Sensors",
      projectLink: "https://netlify.com",
      projectDescription:
        "Fugiat pariatur enim quis aliquip veniam. Labore veniam consectetur et magna occaecat magna reprehenderit. Duis veniam ea proident ad irure nulla fugiat sit nisi eu ipsum sit tempor labore.",
      projectTech: [
        "Sunt non",
        "Labore",
        "Tempor labris",
        "Dolor laboris",
        "Adiptus amet",
        "Incididunt",
        "Duis",
        "Minim Esse",
      ],
      projectTechLogo: [
        "logos:some-icon",
        "logos:another-icon",
        "logos:third-icon",
        "logos:fourth-icon",
        "logos:fifth-icon",
        "logos:sixth-icon",
        "logos:seventh-icon",
        "logos:eighth-icon",
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
        transition={{ duration: 0.3, ease: "easeOut" }}
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: 50 },
        }}
      >
        <Badge variant={"outline"} className="mb-4">
          Projects
        </Badge>
        <h2 className="text-3xl font-semibold font-sans text-primary mb-3.5">
          Personal projects...
        </h2>
      </motion.div>

      <div className="projects-container">
        {projectsData.map(
          ({
            image,
            projectDescription,
            projectLink,
            projectExternalLinks,
            projectName,
            projectTech,
            projectTechLogo,
          }) => {
            return (
              <motion.div
                className="project max-md:w-full"
                key={projectName}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                variants={{
                  visible: { opacity: 1, y: 0 },
                  hidden: { opacity: 0, y: 50 },
                }}
              >
                <div className="project-info">
                  <h3 className="project-info-title shadow-black antialiased max-md:w-full">
                    {projectName}
                  </h3>
                  <div className="project-info-description border max-md:border-0">
                    <p>{projectDescription}</p>
                  </div>
                  <ul className="project-info-tech-list">
                    {projectTech.map((tech, index) => (
                      <li key={tech}>
                        <Code>
                          <Icon
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
                    <li className="project-info-links-item">
                      <Link
                        href={projectExternalLinks.github}
                        className="project-info-links-item-link"
                      >
                        <LucideGithub size={16} />
                      </Link>
                    </li>
                    <li className="project-info-links-item">
                      <Link
                        href={projectExternalLinks.externalLink}
                        className="project-info-links-item-link"
                      >
                        <Link2 size={16} />
                      </Link>
                    </li>
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
