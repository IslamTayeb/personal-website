"use client";
import React, { ComponentPropsWithoutRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
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
        "Upon graduating in 2021, I began creating content on YouTube, with the aim of enhancing my skills and working with the latest technologies, specifically React and Node.",
        "Over time, I have developed and shared over 50 projects using React on my channel.",
        "As a result, my channel has gained a substantial following, with over 11,000 subscribers to date. I have also had the pleasure of collaborating with various brands throughout my journey.",
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
        "As the elected President of the ACES Departmental Club, I successfully led a team of board members and executive committee members to organize and execute multiple events throughout the year.",
        "Additionally, I secured sponsorships from reputable brands to support our events.",
        "Overall, it was a rewarding experience that allowed me to develop my leadership skills while contributing positively to the growth of the organization.",
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
        "Write modern, performant, maintainable code for a diverse array of client and internal projects",
        "Work with a variety of different languages, platforms, frameworks, and content management systems such as JavaScript, TypeScript, Gatsby, React, Craft, WordPress, Prismic, and Netlify",
        "Communicate with multi-disciplinary teams of engineers, designers, producers, and clients on a daily basis",
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
        "While still a student, I founded a web hosting company that offered affordable hosting services.",
        "With over 300 customers, the business thrived until I graduated and sold it to another company.",
      ],
    },
  ];

  return (
    <Section className="flex flex-col items-start gap-4">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: 50 },
        }}
      >
        <Badge variant={"outline"} className="mb-4">Experience</Badge>

        {/* <div className='relative'>
            <h2 className='pb-2 text-3xl font-semibold font-sans first:mt-0 text-primary mb-4'>Where I&apos;ve Worked...</h2>
        </div> */}

        <h2 className="text-3xl font-semibold font-sans first:mt-0 text-primary">
          Where I&apos;ve worked...
        </h2>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: 50 },
        }}
      >
        <div className="container px-1">
          {/* <ul className="list-none relative h-max"> */}
          <ul className="exp-slider">
            <div className="underline"></div>
            {experiences.map((expereince, index) => {
              return (
                <li
                  className={`exp-slider-item hover:bg-accent transition-colors max-md:justify-center ${
                    index === selected &&
                    "exp-slider-item-selected max-md:justify-center max-md:bg-accent transition"
                  }`}
                  onClick={() => setSelected(index)}
                  key={expereince.shortname}
                >
                  <span>{expereince.shortname}</span>
                </li>
              );
            })}
          </ul>
          <div className="exp-details">
            <div className="text-2xl font-medium font-sans">
              <h3>
                <span>{experiences[selected].role}</span>
                <span className="text-accent-foreground text-2xl font-medium font-sans">
                  &nbsp;@&nbsp;
                  <Link href={experiences[selected].url}>
                    {experiences[selected].name}
                  </Link>
                </span>
              </h3>
              <p className="text-base font-medium text-muted-foreground font-mono pb-2">
                {experiences[selected].start} - {experiences[selected].end}
              </p>
              <ul className="text-sm text-muted-foreground font-sans pl-2">
                {experiences[selected].shortDescription.map(
                  (description, index) => (
                    <li
                      key={index}
                      className="text-sm text-muted-foreground font-sans pb-1"
                    >
                      {typeof description === "string" ? (
                        `- ${description}`
                      ) : (
                        <>
                          {`- `}
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
