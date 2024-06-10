"use client";
import React from "react";
import { Section } from "./Misc/Section";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export const Contact = () => {
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
          Contact
        </Badge>
        <h2 className="text-3xl font-semibold font-sans first:mt-0 text-primary">
          Let's work together!
        </h2>
      </motion.div>

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
        <div>Contacts:</div>
      </motion.div>
    </Section>
  );
};
