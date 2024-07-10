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

export const Experience = () => {
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const transformSelected = () => {
      const underlineSpecial = document.querySelector<HTMLElement>(".underlineSpecial");
      underlineSpecial!.style.top = `${selected * 2.5}rem`;
    };
    transformSelected();
  }, [selected]);

  const experiences = [
    {
      name: "Duke Institute for Health Innovation",
      shortname: "DIHI",
      present: true,
      role: "Full Stack Developer",
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
      name: "Feng Labs",
      shortname: "Duke",
      present: true,
      role: "Content Creator",
      url: "https://www.youtube.com/kishansheth21",
      start: "April 2021",
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
      present: false,
      role: "President",
      url: "https://www.linkedin.com/company/association-of-computer-engineering-students/",
      start: "November 2019",
      end: "November 2020",
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
      name: "Saudi Aramco",
      shortname: "Aramco",
      present: false,
      role: "Web Developer",
      url: "https://www.linkedin.com/company/association-of-computer-engineering-students/",
      start: "November 2019",
      end: "November 2020",
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
      name: "King Abdulaziz University",
      shortname: "KAU",
      present: false,
      role: "Founder",
      url: "https://www.linkedin.com/company/association-of-computer-engineering-students/",
      start: "November 2018",
      end: "November 2021",
      shortDescription: [
        <>
          I had <Code>experience</Code> working on a large codebase utilizing
          Kibana and Elasticsearc jfads fajfd dsjf jdah. I had{" "}
          <Code>experience</Code> working on a large codebase utilizing Kibana
          and Elasticsearc jfads fajfd dsjf jdah
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
          Experience
        </Badge>

        <h2 className="text-3xl font-semibold font-sans first:mt-0 text-primary">
          Where I&apos;ve worked...
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
        <div className="container px-1">
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
                  <span className="font-semibold mr-2">{experience.shortname}</span>
                  {index < 2 && experience.present ? (
                    <Badge
                      variant={"default"}
                      className=" p-1 my-3 text-[0.6em] leading-none rounded-full text-center font-semibold font-sans"
                    >
                      Present
                    </Badge>
                  ) : null}
                </li>
              );
            })}
          </ul>
          <div className="exp-details">
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
                      className="text-sm text-muted-foreground font-sans pb-2 list-outside list-disc ml-4"
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
        </div>
      </motion.div>
    </Section>
  );
};
