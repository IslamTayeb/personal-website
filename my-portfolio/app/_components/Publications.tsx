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
      pubDate: "Dec. 2024",
      pubAuthors: (
        <>
          Hamid Zentou, Mansur Aliyu, Mahmoud A. Abdalla, Omar Y. Abdelaziz, Bosirul Hoque, Ahmed M. Alloush, <span className="font-semibold text-primary">Islam M. Tayeb</span>, Kumar Patchigolla, Mahmoud M. Abdelnaby
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
            This review comprehensively examines adsorption-based carbon capture technologies from fundamental science to industrial deployment. It explores solid sorbent materials, their molecular-level properties, and pilot-scale demonstrations while addressing engineering aspects crucial for implementation. The paper discusses integration with process simulation and economic evaluations to enhance efficiency and cost-effectiveness of CO<span style={{ verticalAlign: "sub", fontSize: 7.25, lineHeight: "1", fontWeight: "bold" }}>2</span> capture. It highlights technical, economic, and environmental challenges, proposing solutions through hybrid systems, renewable energy integration, and machine learning techniques to effectively combat global warming.
          </p>
          <p>
            I contributed to the materials science sections and analysis of adsorbent performance metrics, while collaborating on the technology deployment roadmap discussion and future research directions.
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
            This study enhances the UiO-66 metal-organic framework for direct
            air capture by modifying UiO-66-(OH)
            <span
              style={{
                verticalAlign: "sub",
                fontSize: 7.25,
                lineHeight: "1",
                fontWeight: "bold",
              }}
            >
              2
            </span>{" "}
            with APTES, resulting in a 15% increase in CO
            <span
              style={{
                verticalAlign: "sub",
                fontSize: 7.25,
                lineHeight: "1",
                fontWeight: "bold",
              }}
            >
              2
            </span>{" "}
            adsorption capacity and improved selectivity. The modified
            UiO-66-APTES demonstrates high stability and effectiveness in CO
            <span
              style={{
                verticalAlign: "sub",
                fontSize: 7.25,
                lineHeight: "1",
                fontWeight: "bold",
              }}
            >
              2
            </span>{" "}
            separation from air, making it a promising DAC adsorbent.
          </p>
          <p>
            I was involved in scheming and synthesizing all materials and
            performed full material characterization. I was further involved in
            writing the original manuscript and presenting it at 2 local
            symposiums in Saudi Arabia.
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
    {
      pubDate: "Jul. 2022",
      pubAuthors: (
        <>
          Abdullah Alsulaiman, Siraj Alharthi, Ahmed Albariqi, Rasha Mutabaqani,
          Fawzi Bokhari,{" "}
          <span className="font-semibold text-primary">Islam Tayeb</span>, Dalia
          Alharthi, Muhammad Tariq, Yasser Babaier
        </>
      ),
      pubImpact: "Impact Factor: 1.2",
      pubTitle:
        "KRAS G12C-Mutant Non-Small-Cell Lung Adenocarcinoma: First Documented Report in the Arabian Gulf",
      pubJournal: "Cureus Journal",
      pubJournalLink: "https://www.cureus.com/",
      pubType: "Case Report",
      pubDescription: (
        <>
          <p className="mb-1.5">
            This case report describes the first documented cases of KRAS
            G12C-mutant non-small-cell lung adenocarcinoma in the Arabian Gulf.
            Two Saudi males, aged 64 and 76, were diagnosed using reverse
            transcription-PCR. The 64-year-old, an ex-smoker, had generalized
            lymphadenopathy and a right lung mass. The 76-year-old, a
            non-smoker, had stage III-A left lung adenocarcinoma. The study
            calls for further research on KRAS mutations in the region to
            improve treatment strategies.
          </p>
          <p>
            I was involved in data collection and manuscript writing,
            collaborating with multiple physicians and describing their input
            and analyses.
          </p>
        </>
      ),
      pubLink: "http://dx.doi.org/10.7759/cureus.27090",
      pubCategory: [
        {
          name: "Medical Oncology",
          icon: "fa6-solid:ribbon",
        },
        {
          name: "Clinical Genetics",
          icon: "mdi:dna",
        },
        {
          name: "Regional Studies",
          icon: "fluent:location-16-filled",
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
            <div className="project max-md:w-full text-primary" key={pubTitle}>
              <div className="flex items-center gap-4 mx-2 ">
                <Accordion
                  type="single"
                  collapsible
                  className="w-full font-sans "
                >
                  <AccordionItem
                    value="item-1"
                    className="pb-4 text-pretty flex flex-row transition gap-4"
                  >
                    <div className="flex items-center text-muted-foreground text-sm w-min text-left font-mono">
                      <p className="">{pubDate}</p>
                    </div>
                    <div>
                      <div className="flex flex-row">
                        <div className="text-primary flex flex-col">
                          <div className="text-base font-medium text-foreground">
                            <Link
                              href={pubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <span className="transition text-primary">
                                {pubTitle}
                              </span>{" "}
                              <DefaultIcon icon={"gridicons:external"} className="inline-block w-3 ml-0.5" />
                            </Link>
                          </div>
                          <div className="text-muted-foreground text-sm font-normal text-[0.925em]">
                            <TooltipProvider delayDuration={50}>
                              <Tooltip>
                                <TooltipTrigger className="font-normal">
                                  {pubJournalLink ? (
                                    <div className="flex items-center gap-0">
                                      <div className="relative after:absolute after:bottom-0 after:left-0 before:h-[0.5px] after:h-[0.5px] after:w-full after:origin-bottom-left after:scale-x-100 hover:after:scale-x-0 after:transition-transform after:ease-in-out after:duration-200 after:bg-gray-500 text-foreground">
                                        <Link
                                          href={pubJournalLink}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {pubJournal}
                                        </Link>
                                      </div>
                                      {/* <DefaultIcon icon={"gridicons:external"} className="inline-block w-3 ml-1" /> */}
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
                    <AccordionTrigger className="pb-0 p-1" />
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
        className="text-xs leading-none ml-auto text-muted-foreground/80 hover:text-primary -mt-0.5 flex items-center transition-colors hover:underline tracking-wide"
      >
        See more on Scholar...
      </Link>
    </Section>
  );
};
