import React from "react";
import { Section } from "./Misc/Section";
import { Copyright, CopyrightIcon, Heart } from "lucide-react";
import { Code, DefaultIcon } from "./sharedComponents";
import { HeartFilledIcon } from "@radix-ui/react-icons";

export const Footer = () => {
  return (
    <footer className="bg-card border-border">
      <Section>
        <p className="py-3.5 text-muted-foreground text-sm flex gap-x-1">
          {/* <Copyright size={12.5} className="bottom-0 mt-1" />{" "} */}
          <span className="">
            Last Updated 05/26/2025
            {/* {"2024"} {"All rights reserved"}{" "} */}
          </span>
          <div className="ml-auto text-right max-[375px]:hidden">
            Made with <HeartFilledIcon className="inline -mt-1" width={11.5}/> in{" "}
            <span className="font-semibold">Durham, NC</span>
          </div>
        </p>
      </Section>
    </footer>
  );
};
