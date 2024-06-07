"use client";
import React, { ComponentPropsWithoutRef } from "react";
import { Section } from "./Misc/Section";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

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

export const Publications = () => {
  const publicationsData = [
    {
      pubDate: "Dec. 2023",
      pubAuthors: (
        <>
          Mahmoud Abdelnaby, <span className="font-extrabold">Islam Tayeb</span>
          , Ahmed Alloush, Hussain Alyosef, Aljazi Alnoaimi, Mostafa Zeama,
          Mohammed Mohammed, Sagheer Onaizi
        </>
      ),
      pubTitle:
        "Post-synthetic Modification of UiO-66 Analogue Metal-Organic Framework as Potential Solid Sorbent for Direct Air Capture",
      pubJournal: "Journal of CO₂ Utilization",
      pubDescription:
        "Tempor laboris velit fugiat cupidatat cupidatat anim. Occaecat aute ex incididunt amet aliqua. Qui cillum adipisicing eiusmod in est consectetur. Ex aliquip ut ipsum dolore do id eu excepteur nostrud nostrud Lorem. Ea velit incididunt non nulla id elit. Qui incididunt elit amet esse anim laborum exercitation cupidatat occaecat eu dolor in qui est. Ea pariatur cillum incididunt ut.",
      pubLink: "https://doi.org/10.1016/j.jcou.2023.102647",
      pubCategory: [
        "Metal-Organic Frameworks",
        "Post-synthetic Modification",
        "Direct Air Capture",
      ],
    },
    {
      pubDate: "Jul. 2022",
      pubAuthors: (
        <>
          Abdullah Alsulaiman, Siraj Alharthi, Ahmed Albariqi, Rasha Mutabaqani,
          Fawzi Bokhari, <span className="font-extrabold">Islam Tayeb</span>,
          Dalia Alharthi, Muhammad Tariq, Yasser Babaier
        </>
      ),
      pubTitle:
        "KRAS G12C-Mutant Non-Small-Cell Lung Adenocarcinoma: First Documented Report in the Arabian Gulf",
      pubJournal: "Cureus",
      pubDescription:
        "Tempor laboris velit fugiat cupidatat cupidatat anim. Occaecat aute ex incididunt amet aliqua. Qui cillum adipisicing eiusmod in est consectetur. Ex aliquip ut ipsum dolore do id eu excepteur nostrud nostrud Lorem. Ea velit incididunt non nulla id elit. Qui incididunt elit amet esse anim laborum exercitation cupidatat occaecat eu dolor in qui est. Ea pariatur cillum incididunt ut.",
      pubLink: "http://dx.doi.org/10.7759/cureus.27090",
      pubCategory: [
        "Metal-Organic Frameworks",
        "Post-synthetic Modification",
        "Direct Air Capture",
      ],
    },
    {
      pubDate: "Jun. 2022",
      pubAuthors: (
        <>
          Siraj Alharthi, <span className="font-extrabold">Islam Tayeb</span>,
          Romar Pascual, Salman Aloufi, Rasha Mutabbaqani, Dalia Alharthi, Ahmed
          Al-Bariqi, Basem Almutiri, Abdullah Alsulaiman
        </>
      ),
      pubTitle:
        "RAS Gene Mutations and Their Prevalence in Non-Small Cell Lung Cancer: A Review",
      pubJournal: "Bioscience Research",
      pubDescription:
        "Tempor laboris velit fugiat cupidatat cupidatat anim. Occaecat aute ex incididunt amet aliqua. Qui cillum adipisicing eiusmod in est consectetur. Ex aliquip ut ipsum dolore do id eu excepteur nostrud nostrud Lorem. Ea velit incididunt non nulla id elit. Qui incididunt elit amet esse anim laborum exercitation cupidatat occaecat eu dolor in qui est. Ea pariatur cillum incididunt ut.",
      pubLink:
        "https://www.researchgate.net/publication/361118570_RAS_gene_mutations_and_their_prevalence_in_non-small_Cell_lung_cancer_A_Review",
      pubCategory: [
        "Metal-Organic Frameworks",
        "Post-synthetic Modification",
        "Direct Air Capture",
      ],
    },
    {
      pubDate: "Apr. 2022",
      pubAuthors: (
        <>
          Siraj Alharthi, <span className="font-extrabold">Islam Tayeb</span>,
          Romar Pascual, Salman Aloufi, Khalid Alotaibi
        </>
      ),
      pubTitle:
        "Medicinal Effects and Phytochemical Composition of Capparis Cartilaginea Decne: A Review",
      pubJournal: "Bioscience Research",
      pubDescription:
        "Tempor laboris velit fugiat cupidatat cupidatat anim. Occaecat aute ex incididunt amet aliqua. Qui cillum adipisicing eiusmod in est consectetur. Ex aliquip ut ipsum dolore do id eu excepteur nostrud nostrud Lorem. Ea velit incididunt non nulla id elit. Qui incididunt elit amet esse anim laborum exercitation cupidatat occaecat eu dolor in qui est. Ea pariatur cillum incididunt ut.",
      pubLink:
        "https://www.researchgate.net/publication/359931677_Medicinal_effects_and_Phytochemical_composition_of_Capparis_Cartilaginea_Decne_A_Review",
      pubCategory: [
        "Metal-Organic Frameworks",
        "Post-synthetic Modification",
        "Direct Air Capture",
      ],
    },
  ];
  return (
    <Section className="flex flex-col items-start gap-4">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: 50 },
        }}
      >
        <Badge variant={"outline"} className="mb-4">
          Publications
        </Badge>
        <h2 className="text-3xl font-semibold font-sans first:mt-0 text-primary">
          Check out my publications...
        </h2>
      </motion.div>

      {/* <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: 50 },
        }}
      > */}
      {/* // <div className="w-full">
      //   <Card className="font-sans font-medium p-4 flex gap-12">
      //     <div>{pubDate}</div>
      //     <div className="flex-col flex gap-12 ">
      //       {pubTitle}
      //       <div>
      //         {pubAuthors}
      //       </div>
      //     </div>
      //   </Card>
      // </div> */}
      {publicationsData.map(
        ({
          pubDate,
          pubAuthors,
          pubTitle,
          pubJournal,
          pubDescription,
          pubLink,
          pubCategory,
        }) => {
          return (
            <motion.div
            className="project max-md:w-full"
            key={pubTitle}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={{
              visible: { opacity: 1, y: 0 },
              hidden: { opacity: 0, y: 50 },
            }}
          >
            {/* // <Card className="p-4"> */}
            <div className="flex items-center gap-4">
              <div className="text-muted-foreground text-sm w-min pb-2.5">
                {pubDate}
              </div>
              <Accordion
                type="single"
                collapsible
                className="w-full font-sans "
              >
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left gap-4">
                    <div className="text-primary flex flex-col">
                      <div className="text-base font-semibold text-foreground">{pubTitle}</div>
                      <div className="text-muted-foreground">{pubJournal}</div>
                      <div className="text-muted-foreground text-xs font-light mt-0.5">
                        {typeof pubAuthors === "string" ? (
                          `- ${pubAuthors}`
                        ) : (
                          <>{pubAuthors}</>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="mr-8">
                    {pubDescription}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            {/* // </Card> */}
            </motion.div>
          );
        }
      )}
      {/* </motion.div> */}
    </Section>
  );
};
