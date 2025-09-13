import React, { ComponentPropsWithoutRef } from "react";
import { Section } from "./Misc/Section";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordionv3";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { ArrowUpRight, Link as Link2, LucideGithub } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Code, DefaultIcon } from "./sharedComponents";

export const Publications = () => {
  const publicationsData = [
    {
      pubDate: "May 2025",
      pubAuthors: (
        <>
          <span className="font-semibold text-primary">Islam Tayeb</span>, Navid NaderiAlizadeh
        </>
      ),
      pubImpact: "Technical Report",
      pubTitle:
        "Primal Dual Continual Learning for Robust Antibody Design",
      pubJournal: null,
      pubJournalLink: null,
      pubType: "Technical Report",
      pubDescription: (
        <>
          <p className="mb-1.5">
            Framework for handling distribution shifts in antibody design using constrained continual learning. Uses dual variables to adaptively allocate memory and prevent catastrophic forgetting across design cycles.
          </p>
          <p>
            I developed the algorithm and implemented the full framework for the Antibody DomainBed benchmark.
          </p>
        </>
      ),
      pubLink: "https://doi.org/10.13140/RG.2.2.11182.98880",
      pubCategory: [
        {
          name: "Machine Learning",
          icon: "simple-icons:tensorflow",
        },
        {
          name: "Protein Design",
          icon: "fluent:molecule-16-filled",
        },
        {
          name: "Continual Learning",
          icon: "mdi:brain",
        },
      ],
    },
    {
      pubDate: "Dec. 2024",
      pubAuthors: (
        <>
          Hamid Zentou, Mansur Aliyu, Mahmoud A. Abdalla, Omar Y. Abdelaziz, Bosirul Hoque, Ahmed M. Alloush, <span className="font-semibold text-primary">Islam Tayeb</span>, Kumar Patchigolla, Mahmoud M. Abdelnaby
        </>
      ),
      pubImpact: "Impact Factor: 7.0",
      pubTitle:
        "Advancements and Challenges in Adsorption-Based Carbon Capture Technology: From Fundamentals to Deployment",
      pubJournal: "The Chemical Record",
      pubJournalLink: "https://onlinelibrary.wiley.com/journal/15280691",
      pubType: "Literature Review",
      pubDescription: (
        <>
          <p className="mb-1.5">
            Review of solid materials used to capture CO<span style={{ verticalAlign: "sub", fontSize: 7.25, lineHeight: "1", fontWeight: "bold" }}>2</span> from industrial sources, covering lab research to implementation. Discusses cost and engineering challenges for scaling up these technologies.
          </p>
          <p>
            I wrote the materials science sections and analyzed adsorbent performance data.
          </p>
        </>
      ),
      pubLink:
        "https://doi.org/10.1002/tcr.202400188",
      pubCategory: [
        {
          name: "Carbon Capture",
          icon: "carbon:chemistry",
        },
        {
          name: "Climate Mitigation",
          icon: "mdi:leaf",
        },
        {
          name: "Materials Science",
          icon: "mdi:pipe-disconnected",
        },
      ],
    },
    {
      pubDate: "Dec. 2023",
      pubAuthors: (
        <>
          Mahmoud Abdelnaby,{" "}
          <span className="font-semibold text-primary">Islam Tayeb</span>, Ahmed
          Alloush, Hussain Alyosef, Aljazi Alnoaimi, Mostafa Zeama, Mohammed
          Mohammed, Sagheer Onaizi
        </>
      ),
      pubImpact: "Impact Factor: 7.2",
      pubTitle:
        "Post-synthetic Modification of UiO-66 Analogue Metal-Organic Framework as Potential Solid Sorbent for Direct Air Capture",
      pubJournal: (
        <>
          Journal of CO
          <span
            style={{
              verticalAlign: "sub",
              fontSize: 8,
              lineHeight: "1",
            }}
          >
            2
          </span>{" "}
          Utilization
        </>
      ),
      pubJournalLink:
        "https://www.journals.elsevier.com/journal-of-co2-utilization",
      pubType: "Research Article",
      pubDescription: (
        <>
          <p className="mb-1.5">
            Modified a metal-organic framework polymer to better capture CO<span style={{ verticalAlign: "sub", fontSize: 7.25, lineHeight: "1", fontWeight: "bold" }}>2</span> directly from air. The modified version captured 15% more CO<span style={{ verticalAlign: "sub", fontSize: 7.25, lineHeight: "1", fontWeight: "bold" }}>2</span> than the original material.
          </p>
          <p>
            I designed and synthesized the materials in the lab, characterized their properties, and helped write the paper.
          </p>
        </>
      ),
      pubLink: "https://doi.org/10.1016/j.jcou.2023.102647",
      pubCategory: [
        {
          name: "Organic Chemistry",
          icon: "fluent:molecule-16-filled",
        },
        {
          name: "Materials Science",
          icon: "mdi:pipe-disconnected",
        },
        {
          name: "Environmental Tech",
          icon: "mdi:environment",
        },
      ],
    },
  ];

  return (
    <Section className="flex flex-col items-start gap-4">
      <Badge variant={"outline"} className="mb-1" id="publications">
        Selected Publications
      </Badge>

      {publicationsData.map(
        ({
          pubDate,
          pubAuthors,
          pubTitle,
          pubJournal,
          pubJournalLink,
          pubDescription,
          pubLink,
          pubImpact,
          pubType,
          pubCategory,
        }) => {
          return (
            <div className="project max-md:w-full text-primary w-full" key={pubTitle}>
              <div className="w-full mx-2">
                <Accordion
                  type="single"
                  collapsible
                  className="w-full font-sans"
                >
                  <AccordionItem
                    value="item-1"
                    className="pb-4 text-pretty flex flex-row transition gap-4 w-full"
                  >
                    <div className="flex items-center text-muted-foreground text-sm w-min text-left font-mono shrink-0">
                      <p className="">{pubDate}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-row w-full">
                        <div className="text-primary flex flex-col w-full">
                          <div className="text-base font-medium text-foreground w-full">
                            <span className="transition text-primary block">
                              {pubTitle}
                            </span>
                          </div>
                          <div className="text-muted-foreground text-sm font-normal text-[0.925em] ">
                            <Link href={pubLink} target="_blank" rel="noopener noreferrer" className="group">
                              <span className="underline group-hover:no-underline">Full-text</span>
                            </Link>
                            {pubJournal && <span className="font-normal"> – </span>}
                            <TooltipProvider delayDuration={50}>
                              <Tooltip>
                                <TooltipTrigger className="font-normal">
                                  {pubJournalLink ? (
                                    <div className="flex items-center gap-0">
                                      <div className="group">
                                        <Link
                                          href={pubJournalLink}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="group"
                                        >
                                          <span className="underline group-hover:no-underline">{pubJournal}</span>
                                        </Link>
                                      </div>
                                    </div>
                                  ) : (
                                    pubJournal
                                  )}
                                </TooltipTrigger>
                                <TooltipContent className="shadow-md shadow-card transition-all">
                                  <p>{pubImpact}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <span className="font-normal"> –</span>
                            <span className="font-light ml-0.5"> {pubType}</span>
                          </div>
                          <div className="text-muted-foreground  text-xs font-light py-1.5">
                            {typeof pubAuthors === "string" ? (
                              `- ${pubAuthors}`
                            ) : (
                              <>{pubAuthors}</>
                            )}
                          </div>
                        </div>
                      </div>
                      <AccordionContent className="mr-8 pb-3 pt-1 font-light">
                        {pubDescription}
                      </AccordionContent>
                      <div className="flex flex-wrap gap-2 text-xs leading-none">
                        {pubCategory.map((category) => (
                          // consider using max-md:text-nowrap
                          <Code
                            key={category.name}
                            className="inline-flex items-center"
                          >
                            <DefaultIcon
                              icon={category.icon}
                              className="text-current -mt-0"
                              height="14"
                            />
                            <span className="ml-2">{category.name}</span>
                          </Code>
                        ))}
                      </div>
                    </div>
                    <AccordionTrigger className="pb-0 p-1 flex-none" />
                  </AccordionItem>
                </Accordion>

              </div>
            </div>


          );
        }
      )}
      <Link
        href="https://scholar.google.com/citations?hl=en&user=2ZrlBUcAAAAJ"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs leading-none ml-auto text-muted-foreground/80 -mt-0.5 flex items-center underline hover:no-underline tracking-wide"
      >
        See more on Scholar...
      </Link>
    </Section>
  );
};
