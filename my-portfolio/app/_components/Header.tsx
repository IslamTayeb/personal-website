import Link from "next/link";
import { Section } from "./Misc/Section";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LinkedInIcon } from "./Icons/LinkedInIcon";
import { GithubIcon } from "./Icons/GithubIcon";
import { ResearchGateIcon } from "./Icons/ResearchGateIcon";
import { ArrowBigDown, Layers2, Scroll, ScrollText } from "lucide-react";


export const Header = () => {
  return (
    <header className="sticky top-0 py-3 z-50 bg-card bg-clip-padding bg-opacity-80">
      <Section className="flex items-baseline">
        <h1 className="text-lg font-semibold text-primary"><Link href="islamtayeb.net">islamtayeb.net</Link></h1>
        <div className="flex-1" />
        <ul className="flex items-center gap-2">
          <Link
            href="https://www.researchgate.net/profile/Islam-Tayeb"
            className={cn(buttonVariants({ variant: "outline" }), "size-6 p-0")}
          >
            <ResearchGateIcon size={12} className="text-foreground" />
          </Link>

          <Link
            href="https://linkedin.com/in/islam-tayeb"
            className={cn(buttonVariants({ variant: "outline" }), "size-6 p-0")}
          >
            <LinkedInIcon size={12} className="text-foreground" />
          </Link>

          <Link
            href="https://github.com/IslamTayeb"
            className={cn(buttonVariants({ variant: "outline" }), "size-6 p-0")}
          >
            <GithubIcon size={12} className="text-foreground" />
          </Link>

          <Link
            href="resume"
            className={cn(buttonVariants({ variant: "outline" }), "size-6 p-0")}
          >
            <ScrollText size={12} className="text-foreground" />
          </Link>
        </ul>
      </Section>
    </header>
  );
};
