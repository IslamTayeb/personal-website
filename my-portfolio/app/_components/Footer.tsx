import React from "react";
import { Section } from "./Misc/Section";
import { Copyright, CopyrightIcon } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card">
      <Section>
        <p className="px-5 py-4 text-muted-foreground text-sm flex gap-x-1">
          <CopyrightIcon size={12.5} className="bottom-0 mt-1" /> {"2024"}{" "}
          {" All rights reserved."}{" "}
          <div className="ml-auto text-right">
            Made with love in <span className="italic">Durham, NC.</span>
          </div>
        </p>
      </Section>
    </footer>
  );
};
