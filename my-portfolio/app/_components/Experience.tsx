"use client"

import { Calendar, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Code, DefaultIcon } from "./sharedComponents"
import { Section } from "./Misc/Section"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import dynamic from "next/dynamic"

// Create a component registry object
const logoComponentRegistry = {
  "Duke Health": dynamic(() => import("./Icons/Duke Health").then(mod => mod.DukeHealth), { ssr: false }),
  "DIHI": dynamic(() => import("./Icons/DIHI").then(mod => mod.DIHI), { ssr: false }),
  "Aramco": dynamic(() => import("./Icons/Aramco").then(mod => mod.Aramco), { ssr: false }),
  "Helian": dynamic(() => import("./Icons/Helian").then(mod => mod.Helian), { ssr: false }),
  "Lifeedit": dynamic(() => import("./Icons/Lifeedit").then(mod => mod.Lifeedit), { ssr: false }),
  "Sapien": dynamic(() => import("./Icons/Sapien").then(mod => mod.Sapien), { ssr: false }),
  "Reveal": dynamic(() => import("./Icons/Reveal").then(mod => mod.Reveal), { ssr: false }),
  "Soff": dynamic(() => import("./Icons/Soff").then(mod => mod.Soff), { ssr: false }),
  "DukeUni": dynamic(() => import("./Icons/DukeUni").then(mod => mod.DukeUni), { ssr: false }),
  "DukeUni2": dynamic(() => import("./Icons/DukeUni2").then(mod => mod.DukeUni2), { ssr: false }),
}

export function Experience() {
  const renderLogo = (logo: string, company: string) => {
    // Handle TSX components
    if (typeof logo === 'string' && logo.endsWith('.tsx')) {
      const componentPath = logo.replace('.tsx', '');
      const componentName = componentPath.split('/').pop();

      if (componentName && componentName in logoComponentRegistry) {
        const LogoComponent = logoComponentRegistry[componentName as keyof typeof logoComponentRegistry];
        return <LogoComponent className="w-full h-full" />
      }

      return <div className="w-full h-full flex items-center justify-center">{company[0]}</div>
    }

    // Handle image URLs and icon strings
    return (
      <Avatar className="w-12 h-12 flex items-center justify-center rounded-md min-w-12 min-h-12">
        {typeof logo === 'string' && (logo.startsWith('http') || logo.startsWith('/')) ? (
          <AvatarImage src={logo} className="object-contain" />
        ) : (
          <DefaultIcon icon={logo} className="w-6 h-6" />
        )}
        <AvatarFallback className="bg-primary text-primary-foreground flex items-center justify-center rounded-md">
          {company[0]}
        </AvatarFallback>
      </Avatar>
    )
  }

  return (
    <Section className="mx-auto space-y-4">
      <Badge variant="outline" className="" id="experience">
        Experience
      </Badge>
      {experiences.map((experience, index) => (
        <div
          key={index}
          className="border border-secondary rounded-lg p-4 bg-card hover:bg-card/75 transition-colors"
        >
          <div className="flex flex-col gap-2">
            {/* Header with logo, role, company */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 min-w-12 min-h-12 text-primary">
                {renderLogo(experience.logo, experience.company)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-lg leading-snug font-sans text-primary">{experience.role}</h3>
                  {experience.status === "present" && <Badge variant="default" className="rounded-full font-semibold text-[0.4em] p-[0.165rem] h-fit text-nowrap font-mono leading-none px-1">Present</Badge>}
                  {experience.status === "incoming" && <Badge variant="secondary" className="rounded-full font-semibold text-[0.4em] p-[0.165rem] h-fit text-nowrap font-mono leading-none px-1">Incoming</Badge>}
                  {experience.company === "Soff" && (
                    <Badge variant="outline" className="rounded-full font-semibold text-[0.4em] p-[0.2rem] px-1.5 h-fit text-nowrap font-mono leading-none">
                      Employee #2
                    </Badge>
                  )}
                </div>
                <div className="text-muted-foreground font-normal text-sm space-x-1.5">
                  {experience.website ? (
                    <span className="inline-flex items-center">
                      <a
                        href={experience.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-normal font-sans inline-flex items-center text-foreground underline underline-offset-2 hover:no-underline transition-all gap-0.5"
                      >
                        {experience.company}
                      <ExternalLink className="inline-block w-3 h-3 ml-1" />
                      </a>
                    </span>
                  ) : (
                    <span className="font-normal font-sans text-foreground">
                      {experience.company}
                    </span>
                  )}
                  {experience.period && (
                    <>
                      <span>•</span>
                      <span className="font-light text-muted-foreground">{experience.period}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-muted-foreground font-light text-sm font-sans">
              {experience.responsibilities[0]}
            </p>

            {/* Skills */}
            {experience.skills && experience.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {experience.skills.map((skill, skillIndex) => (
                  <Code key={skillIndex}>
                    <span className="flex items-center gap-1.5 h-4 text-sm">
                      <DefaultIcon icon={skill.icon} className="inline text-current mt-[0.75px]"
                        height="14px"
                      />
                      {skill.name}
                    </span>
                  </Code>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </Section>
  )
}

const experiences = [
  {
    role: "Software Engineer",
    company: "Duke University",
    logo: "Icons/DukeUni2.tsx",
    period: "Aug 2025 – Present",
    location: "Durham, NC",
    status: "present",
    website: "https://www.romerolab.org/",
    responsibilities: [
      "Building assay discovery platform for enzyme design using NLP and chemical similarity",
    ],
    skills: [
      { name: "Python", icon: "simple-icons:python" },
      { name: "PyTorch", icon: "simple-icons:pytorch" },
    ],
  },
  {
    role: "Software Engineer",
    company: "Soff (YC S24)",
    website: "https://soff.ai/",
    logo: "Icons/Soff.tsx",
    period: "May 2025 – Present",
    location: "San Francisco, CA",
    status: "present",
    responsibilities: [
      "Building sales automation and procurement tools for supply chain intelligence platform",
    ],
    skills: [
      { name: "Next.js", icon: "simple-icons:nextdotjs" },
      { name: "TypeScript", icon: "simple-icons:typescript" },
      { name: "Node.js", icon: "simple-icons:nodedotjs" },
      { name: "AWS", icon: "simple-icons:amazonaws" },
    ],
  },
  {
    role: "Software Engineer Intern",
    company: "Helian",
    website: "https://www.helian.ai/",
    logo: "Icons/Helian.tsx",
    period: "Dec 2024 – May 2025",
    location: "Durham, NC",
    responsibilities: [
      "Developed AI-powered document analysis tools for medical research workflows",
    ],
    skills: [
      { name: "Next.js", icon: "simple-icons:nextdotjs" },
      { name: "Python", icon: "simple-icons:python" },
      { name: "FastAPI", icon: "simple-icons:fastapi" },
      { name: "AWS", icon: "simple-icons:amazonaws" },
    ],
  },
  {
    role: "Software Engineer Intern",
    company: "Life Edit Therapeutics",
    website: "https://lifeeditinc.com/",
    logo: "Icons/Lifeedit.tsx",
    period: "Sep 2024 – May 2025",
    location: "Durham, NC",
    responsibilities: [
      "Built RNA-seq analysis dashboard and validation pipeline for CRISPR experiments",
    ],
    skills: [
      { name: "Python", icon: "simple-icons:python" },
      { name: "Dash", icon: "simple-icons:plotly" },
    ],
  },
  {
    role: "ML Research Assistant",
    company: "Duke University",
    logo: "Icons/DukeUni2.tsx",
    period: "Oct 2024 – Apr 2025",
    location: "Durham, NC",
    website: "https://sites.duke.edu/navid/",
    responsibilities: [
      "Developed continual learning frameworks and antibody screening tools for therapeutic protein design",
    ],
    skills: [
      { name: "Python", icon: "simple-icons:python" },
      { name: "PyTorch", icon: "simple-icons:pytorch" },
    ],
  },
  {
    role: "Software Engineer Intern",
    company: "Duke Institute for Health Innovation",
    website: "https://dihi.org/",
    logo: "Icons/DIHI.tsx",
    period: "Jun 2024 – Aug 2024",
    location: "Durham, NC",
    responsibilities: [
      "Built automated literature review systems and medical record analysis tools for health innovation",
    ],
    skills: [
      { name: "Python", icon: "simple-icons:python" },
      { name: "Docker", icon: "simple-icons:docker" },
    ],
  },
  {
    role: "Software Engineer Intern",
    company: "Project: Sapien",
    website: "https://www.projectsapien.com/",
    logo: "Icons/Sapien.tsx",
    period: "Nov 2023 – Feb 2024",
    location: "Princeton, NJ",
    responsibilities: [
      "Built survey platform and NLP classification tools for population health research studies",
    ],
    skills: [
      { name: "React", icon: "simple-icons:react" },
      { name: "TypeScript", icon: "simple-icons:typescript" },
      { name: "Node.js", icon: "simple-icons:nodedotjs" },
      { name: "AWS", icon: "simple-icons:amazonaws" },
    ],
  },
]
