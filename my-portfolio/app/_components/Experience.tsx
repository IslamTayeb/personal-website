"use client";
import React, { ComponentPropsWithoutRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Section } from "./Misc/Section";
import { ArrowUpRight, Link as Link2 } from "lucide-react";
import { Icon } from "@iconify/react";
import { Code, DefaultIcon } from "./sharedComponents";
import { Duke } from "./Icons/Duke";
import { DIHI } from "./Icons/DIHI";

export const Experience = () => {
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const transformSelected = () => {
      const underlineSpecial =
        document.querySelector<HTMLElement>(".underlineSpecial");
      underlineSpecial!.style.top = `${selected * 2.5}rem`;
    };
    transformSelected();
  }, [selected]);

  const experiences = [
    {
      name: "Feng Labs",
      shortname: "Duke",
      // logo: <Duke size={16} className="mr-2 mt-0.5" />,
      present: false,
      incoming: true,
      role: "Content Creator",
      url: "https://www.youtube.com/kishansheth21",
      start: "April 2021",
      end: "Present",
      shortDescription: [
        <>
          I had <Code>experience</Code> working on a large codebase utilizing
          Kibana and Elasticsearc jfads fajfd dsjf jdah.
        </>,
      ],
    },
    {
      name: "Duke Institute for Health Innovation",
      shortname: "DIHI",
      // logo: <DIHI size={16} className="mr-2" />,
      present: true,
      incoming: false,
      role: "Research Analyst",
      url: "https://www.rapidops.com",
      start: "January 2021",
      end: "Present",
      shortDescription: [
        <>
          I had <Code>experience</Code> working on a large codebase utilizing
          Kibana and Elasticsearc jfads fajfd dsjf jdah.
        </>,
        <>
          I had <Code>experience</Code> working on a large codebase utilizing
          Kibana and Elasticsearch.
        </>,
        <>
          I had <Code>experience</Code> working on a large codebase utilizing
          Kibana and Elasticsearch.
        </>,
      ],
    },
    {
      name: "Project: Sapien",
      shortname: "Sapien",
      // logo: (
      //   <img
      //     src="https://media.licdn.com/dms/image/D4E0BAQGoQWtvjZAWbg/company-logo_200_200/0/1701588957383?e=1728518400&v=beta&t=RJkeTdJo5AqWgIq24YdWLlHGEOzidniz-qc-zRdlBwM"
      //     className="h-4 w-4 mr-2 rounded-sm"
      //   />
      // ),
      present: false,
      incoming: false,
      role: "Software Engineer",
      url: "https://www.linkedin.com/company/association-of-computer-engineering-students/",
      start: "Dec 2023",
      end: "Jan 2024",
      shortDescription: [
        <>
          Built NLP algorithms using <Code>Transformers API</Code> to analyze
          unstructured survey data through semantic analysis, extracting novel
          population health insights
        </>,
        <>
          Led data collection efforts on campus, communicated with university
          faculty and facilitated surveys resulting in a diverse and
          high-quality dataset comprising of population health data
        </>,
      ],
    },
    {
      name: "King Fahd University of Petroleum & Minerals",
      shortname: "KFUPM",
      // logo: (
      //   <div className="relative inline-block">
      //     <img src="/aramco.png" className="h-4 w-4 mr-2 rounded-sm" />
      //     <div
      //       className="absolute"
      //       style={{ backgroundColor: "rgba(255, 0, 0, 0.5)" }}
      //     ></div>
      //   </div>
      // ),
      present: false,
      incoming: false,
      role: "Research Assistant",
      url: "https://www.linkedin.com/company/association-of-computer-engineering-students/",
      start: "November 2019",
      end: "November 2020",
      shortDescription: [
        <>
          Predicted the structure and 6 properties of 3 novel CO2-capturing
          materials with 97% accuracy by implementing a grand canonical{" "}
          <Code>Monte Carlo</Code> simulation probabilistic optimization model
          using MATLAB
        </>,
        <>
          Composed and presented a research project proposal using
          computationally predicted materials to a board of Aramco managers
          under the supervision of Dr. Mahmoud Abdelnaby, acquired approval and
          $15,000+ in funding
        </>,
        <>
          Analyzed materials by utilizing <Code>R</Code> to interpret data and
          highlight key findings to be featured in publications
        </>,
      ],
    },
    {
      name: "King Abdulaziz University",
      shortname: "KAU",
      // logo: <Duke size={16} className="mr-2" />,
      present: false,
      incoming: false,
      role: "Research Assistant",
      url: "https://www.linkedin.com/company/association-of-computer-engineering-students/",
      start: "Aug 2021",
      end: "Jun 2022",
      shortDescription: [
        <>
          Utilized <Code>Python</Code> <Code>ANOVA</Code> algorithms and{" "}
          <Code>Nextflow framework</Code> to measure genetic variation of 5
          plant species{" "}
        </>,
        <>
          Analyzed needle biopsies, CT scans, and genetic/immunostaining results
          to detect early-stage cancer in patients
        </>,
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
        <Badge variant={"outline"} className="mb-4" id="experience">
          Experience
        </Badge>

        <h2 className="text-3xl font-semibold font-sans first:mt-0 text-primary">
          I&apos;ve worked at...
        </h2>
      </motion.div>

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
        <div className="container px-1 h-auto">
          <ul className="exp-slider">
            <div className="underlineSpecial"></div>
            {experiences.map((experience, index) => {
              return (
                <li
                  className={`exp-slider-item hover:bg-accent transition-colors max-md:justify-center ${
                    index === selected &&
                    "exp-slider-item-selected max-md:justify-center max-md:bg-accent transition"
                  }`}
                  onClick={() => setSelected(index)}
                  key={experience.shortname}
                >
                  <span className="font-semibold mr-2">
                    {experience.shortname}
                  </span>
                  {experience.present ? (
                    <Badge
                      variant={"default"}
                      className=" p-1 my-3 text-[0.6em] leading-none rounded-full text-center font-semibold font-sans"
                    >
                      Present
                    </Badge>
                  ) : null}
                  {experience.incoming ? (
                    <Badge
                      variant={"secondary"}
                      className=" p-1 my-3 text-[0.6em] leading-none rounded-full text-center font-semibold font-sans"
                    >
                      Incoming
                    </Badge>
                  ) : null}
                </li>
              );
            })}
          </ul>
            <div className="text-2xl font-medium font-sans">
              <h3>
                <span className="text-accent-foreground font-semibold">
                  {experiences[selected].role}
                </span>
                <span className="text-2xl font-medium font-sans">
                  &nbsp;@&nbsp;
                  <Link href={experiences[selected].url}>
                    <div className="inline">{experiences[selected].name} </div>
                    <ArrowUpRight className="inline-block w-5 " />
                  </Link>
                </span>
              </h3>
              <p className="text-base font-medium text-muted-foreground font-mono pb-2">
                {experiences[selected].start} - {experiences[selected].end}
              </p>
              <ul className="text-sm text-muted-foreground font-sans">
                {experiences[selected].shortDescription.map(
                  (description, index) => (
                    <li
                      key={index}
                      className={`text-sm text-muted-foreground font-sans list-outside list-disc ml-4 ${
                        index !==
                        experiences[selected].shortDescription.length - 1
                          ? "pb-2"
                          : ""
                      }`}
                    >
                      {typeof description === "string" ? (
                        `${description}`
                      ) : (
                        <>{description}</>
                      )}
                    </li>
                  )
                )}
              </ul>
            </div>
        </div>
      </motion.div>
    </Section>
  );
};
