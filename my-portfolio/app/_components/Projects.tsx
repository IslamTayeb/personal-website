"use client";
import Image from "next/image";
import Link from "next/link";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { Github, GithubIcon, Link as Link2, LucideGithub } from "lucide-react";
import React, { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Section } from "./Misc/Section";

const Code = ({ className, ...props }: ComponentPropsWithoutRef<"span">) => {
  return (
    <span
      className={cn(
        "bg-accent/30 hover:bg-accent/50 transition-colors border border-accent px-1 py-0.5 rounded-sm text-primary font-mono",
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
        "Lorem",
        "Lorem",
        "Lorem",
        "Lorem Ipsum",
        "Lorem Ipsum",
        "Lorem Ipsum",
        "Lorem Ipsum",
        "Lorem Ipsum",
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
        transition={{ duration: 0.6 }}
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: 50 },
        }}
      >
        <Badge variant={"outline"} className="mb-4">
          Projects
        </Badge>
        {/* NOTE: workaronud, added a margin because gaps didn't work. */}
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
          }) => {
            return (
              <motion.div
                className="project max-md:w-full"
                key={projectName}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                variants={{
                  visible: { opacity: 1, y: 0 },
                  hidden: { opacity: 0, y: 50 },
                }}
              >
                <div className="project-info">
                  {/* <p className="project-info-overline">Featured Project</p> */}
                  <h3 className="project-info-title shadow-black antialiased max-md:w-full">
                    {projectName}
                  </h3>
                  <div className="project-info-description border max-md:border-0">
                    <p>{projectDescription}</p>
                  </div>
                  <ul className="project-info-tech-list px-3">
                    {projectTech.map((tech) => (
                      <li className="project-info-tech-list-item" key={tech}>
                        {tech}
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

                {/* <div className="project-image-overlay"></div> */}
              </motion.div>
            );
          }
        )}
      </div>
    </Section>
  );
};
