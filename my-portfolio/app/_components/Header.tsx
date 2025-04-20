import Link from "next/link";
import { Section } from "./Misc/Section";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LinkedInIcon } from "./Icons/LinkedInIcon";
import { GithubIcon } from "./Icons/GithubIcon";
import { ResearchGateIcon } from "./Icons/ResearchGateIcon";
import { ArrowBigDown, Layers2, Scroll, ScrollText } from "lucide-react";
import { Code, DefaultIcon } from "./sharedComponents";
import { Icon } from "@iconify/react/dist/iconify.js";
export const Header = () => {
  return (
    <header className="sticky top-0 py-3 z-50 bg-card bg-clip-padding bg-opacity-80 h-12">
      <div className="flex max-w-3xl m-auto px-4">
        <h1 className="text-lg font-semibold text-primary leading-none my-auto">
          <Link href="#hero" className="leading-none">islamtayeb.dev</Link>
        </h1>
        <div className="flex-1" />
        <ul className="flex gap-2">
          <Link
            href="https://linkedin.com/in/islam-tayeb"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline" }), "border-dashed p-0 flex items-center justify-center h-6")}
          >
            <span className="flex items-center justify-center px-1 py-0">
              <DefaultIcon
                fontSize={12.7}
                className="text-foreground rounded-[2.5px] -mt-[0.04em]"
                icon={"bi:linkedin"}
              />
              <p className="text-foreground m-0 leading-none text-xs inline max-sm:hidden ml-[0.35em]">
                LinkedIn
              </p>
            </span>
          </Link>
          <Link
            href="https://github.com/IslamTayeb"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline" }), "border-dashed p-0 flex items-center justify-center h-6")}
          >
            <span className="flex items-center justify-center px-1 py-0">
              <DefaultIcon
                fontSize={15.25}
                className="text-foreground -mt-[0.5px]"
                icon={"jam:github"}
              />
              <p className="text-foreground m-0 leading-none text-xs inline max-sm:hidden ml-[0.35em]">
                GitHub
              </p>
            </span>
          </Link>
          <Link
            href="https://scholar.google.com/citations?hl=en&user=2ZrlBUcAAAAJ"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline" }), "border-dashed p-0 flex items-center justify-center h-6")}
          >
            <span className="flex items-center justify-center px-1 py-0">
              <Icon icon={"fa6-brands:google-scholar"} fontSize={12} className="rounded-[4px] text-foreground -mt-[0.1em]" />
              <p className="text-foreground m-0 leading-none text-xs inline max-sm:hidden ml-[0.35em]">
                Scholar
              </p>
            </span>
          </Link>
          <Link
            href="https://x.com/IslamTyb"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline" }), "border-dashed p-0 flex items-center justify-center h-6")}
          >
            <span className="flex items-center justify-center px-1">
              <Icon icon={"prime:twitter"} fontSize={12} className="text-foreground -mt-[0.1em]" />
              <p className="text-foreground m-0 leading-none text-xs inline max-sm:hidden ml-[0.35em]">
                X
              </p>
            </span>
          </Link>
          <Link
            href="/resume"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "border-dashed px-[4.5px] h-6 flex items-center justify-center"
            )}
          >
            <span className="w-[13px] h-[13px] flex items-center justify-center mr-1">
              <DefaultIcon
                fontSize={13}
                className="text-foreground"
                icon={"solar:file-bold"}
              />
            </span>
            <p className="text-foreground m-0 leading-none text-xs inline max-sm:hidden">
              Resume
            </p>
          </Link>
        </ul>
      </div>
    </header>
  );
};
