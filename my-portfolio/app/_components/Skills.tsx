"use client";
import React from "react";
import { Section } from "./Misc/Section";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Icon } from "@iconify/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Code, DefaultIcon } from "./sharedComponents";

export const Skills = () => {
  const skillsData = [
    {
      category: "Programming Languages",
      technologies: [
        { name: "JavaScript", icon: "akar-icons:javascript-fill" },
        { name: "Python", icon: "akar-icons:python-fill" },
        { name: "Java", icon: "mdi:java" },
      ],
    },
    {
      category: "Web Development",
      technologies: [
        { name: "React", icon: "mdi:react" },
        { name: "Redux", icon: "mdi:redux" },
        { name: "HTML5", icon: "mdi:html-5" },
        { name: "CSS3", icon: "mdi:css-3" },
      ],
    },
    {
      category: "Machine Learning",
      technologies: [
        { name: "TensorFlow", icon: "mdi:tensorflow" },
        { name: "PyTorch", icon: "mdi:pytorch" },
        { name: "scikit-learn", icon: "mdi:scikit-learn" },
      ],
    },
    {
      category: "Deployment & Integration",
      technologies: [
        { name: "Docker", icon: "mdi:docker-icon" },
        { name: "Kubernetes", icon: "mdi:kubernetes" },
        { name: "AWS", icon: "mdi:aws" },
      ],
    },
    {
      category: "Research",
      technologies: [
        { name: "LaTeX", icon: "mdi:latex" },
        { name: "MATLAB", icon: "mdi:matlab" },
        { name: "R", icon: "mdi:r-lang" },
      ],
    },
  ];

  return (
    <Section className="flex flex-col items-start gap-4">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: 25 },
        }}
      >
        <Badge variant={"outline"} className="mb-4">
          Skills
        </Badge>
        <h2 className="text-3xl font-semibold font-sans first:mt-0 text-primary">
          My skills include...
        </h2>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        className="w-full"
        viewport={{ once: true }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: 25 },
        }}
      >
        {/* might want t remve categry and technlgies  */}
        <Table className="">
          <TableHeader>
            <TableRow>
              <TableHead className="text-left w-2/6 font-extrabold">
                Category
              </TableHead>
              <TableHead className="text-left w-4/6 font-extrabold">
                Technologies
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-accent-foreground">
            {skillsData.map((skillCategory) => (
              <TableRow key={skillCategory.category}>
                <TableCell className="font-medium">
                  {skillCategory.category}
                </TableCell>
                <TableCell className="flex gap-2">
                  {skillCategory.technologies.map((tech) => (
                    <TooltipProvider key={tech.name} delayDuration={50}>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="p-1">
                            <Icon
                              className="hover:blur-[6px] absolute transition-all opacity-50"
                              icon={tech.icon}
                              width="2.25em"
                              height="2.25em"
                            />
                            <Icon
                              className=""
                              icon={tech.icon}
                              width="2.25em"
                              height="2.25em"
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-semibold">{tech.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </Section>
  );
};
