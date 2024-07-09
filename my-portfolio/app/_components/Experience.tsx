"use client";
import React, { ComponentPropsWithoutRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Section } from "./Misc/Section";
import { ArrowUpRight, Link as Link2 } from "lucide-react";

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

export const Experience = () => {
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const transformSelected = () => {
      const underline = document.querySelector<HTMLElement>(".underline");
      underline!.style.top = `${selected * 2.5}rem`;
    };
    transformSelected();
  }, [selected]);

  const experiences = [
    {
      name: "Duke Institute for Health Innovation",
      shortname: "DIHI",
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
      role: "Founder",
      url: "https://www.linkedin.com/company/association-of-computer-engineering-students/",
      start: "November 2018",
      end: "November 2021",
      shortDescription: [
        <>
          I had <Code>experience</Code> working on a large codebase utilizing
          Kibana and Elasticsearc jfads fajfd dsjf jdah. I had <Code>experience</Code> working on a large codebase utilizing
          Kibana and Elasticsearc jfads fajfd dsjf jdah
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
        transition={{ duration: 0.3, ease: "easeOut" }}
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: 50 },
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
        transition={{ duration: 0.3, ease: "easeOut" }}
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: 50 },
        }}
      >
        <div className="container px-1">
          <ul className="exp-slider">
            <div className="underline"></div>
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
                  <span>{experience.shortname}</span>
                </li>
              );
            })}
          </ul>
          <div className="exp-details">
            <div className="text-2xl font-medium font-sans">
              <h3>
                <span className="text-accent-foreground font-semibold">{experiences[selected].role}</span>
                <span className="text-2xl font-medium font-sans">
                  &nbsp;@&nbsp;
                  <Link href={experiences[selected].url}>
                    <div className="inline" >{experiences[selected].name}{" "}</div>
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
                        <>
                          {description}
                        </>
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
