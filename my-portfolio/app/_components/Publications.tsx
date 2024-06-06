"use client";
import React from "react";
import { Section } from "./Misc/Section";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const Publications = () => {
  const publicationsData = [
    {
      pubDate: "Dec. 2023",
      pubAuthors:
        "Mahmoud M. Abdelnaby, Islam M. Tayeb, Ahmed M. Alloush, Hussain A. Alyosef, Aljazi Alnoaimi, Mostafa Zeama, Mohammed G. Mohammed, Sagheer A. Onaizi",
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
      pubDate: "Dec. 2023",
      pubAuthors:
        "Mahmoud M. Abdelnaby, Islam M. Tayeb, Ahmed M. Alloush, Hussain A. Alyosef, Aljazi Alnoaimi, Mostafa Zeama, Mohammed G. Mohammed, Sagheer A. Onaizi",
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
      pubDate: "Dec. 2023",
      pubAuthors:
        "Mahmoud M. Abdelnaby, Islam M. Tayeb, Ahmed M. Alloush, Hussain A. Alyosef, Aljazi Alnoaimi, Mostafa Zeama, Mohammed G. Mohammed, Sagheer A. Onaizi",
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
            <div>
              <Card className="font-sans font-medium w-full h-full gap-2 p-4">
                <div className="w-full"></div>
              </Card>
            </div>
          );
        }
      )}
      {/* </motion.div> */}
    </Section>
  );
};
