import React from "react";
import { Section } from "./Misc/Section";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Icon } from "@iconify/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Code, DefaultIcon } from "./sharedComponents";

export const Skills = () => {

  const skillsData = [
    {
      category: "Programming Languages",
      technologies: [
        { name: "Python", icon: "akar-icons:python-fill" },
        { name: "TypeScript", icon: "akar-icons:typescript-fill" },
        { name: "JavaScript", icon: "akar-icons:javascript-fill" },
        { name: "Java", icon: "fa6-brands:java" },
        { name: "SQL", icon: "fa-solid:database" },
        { name: "R Language", icon: "devicon-plain:r" },
        { name: "MATLAB", icon: "file-icons:matlab" },
        { name: "C Language", icon: "devicon-plain:c" },
        { name: "HTML5", icon: "simple-icons:html5" },
        { name: "CSS3", icon: "simple-icons:css3" },
      ],
    },
    {
      category: "Machine Learning",
      technologies: [
        { name: "TensorFlow", icon: "simple-icons:tensorflow" },
        { name: "PyTorch", icon: "simple-icons:pytorch" },
        { name: "LangChain", icon: "simple-icons:langchain" },
        { name: "RAG", icon: "carbon:rag" },
        { name: "AutoGen", icon: "cib:microsoft" },
        { name: "Google BERT", icon: "bi:google" },
        // { name: "Gemini", icon: "simple-icons:googlegemini" },
        { name: "OpenAI", icon: "simple-icons:openai" },
        { name: "SciKit-Learn", icon: "simple-icons:scikitlearn" },
        { name: "PyRosetta", icon: "fluent:molecule-24-filled" },
      ],
    },
    {
      category: "Frontend Development",
      technologies: [
        { name: "React", icon: "akar-icons:react-fill" },
        { name: "Next.js", icon: "simple-icons:nextdotjs" },
        { name: "Angular", icon: "cib:angular" },
        { name: "SCSS", icon: "simple-icons:sass" },
        { name: "Framer Motion", icon: "teenyicons:framer-solid" },
      ],
    },
    {
      category: "Backend Development",
      technologies: [
        { name: "Node.js", icon: "simple-icons:nodedotjs" },
        { name: "Flask", icon: "simple-icons:flask" },
        { name: "PostgreSQL", icon: "akar-icons:postgresql-fill" },
        { name: "Redis", icon: "devicon-plain:redis" },
        { name: "Supabase", icon: "simple-icons:supabase" },
        { name: "Pinecone", icon: "teenyicons:vector-document-solid" },
        { name: "Celery", icon: "simple-icons:celery" },
        { name: "Selenium", icon: "simple-icons:selenium" },
      ],
    },
    {
      category: <>Deployment&nbsp;& Cloud</>,
      technologies: [
        { name: "Linux", icon: "devicon-plain:linux" },
        { name: "Git", icon: "simple-icons:git" },
        { name: "Docker", icon: "simple-icons:docker" },
        { name: "AWS", icon: "cib:amazon-aws" },
        { name: "GCP", icon: "cib:google-cloud" },
        { name: "Vercel", icon: "ion:logo-vercel" },
      ],
    },
  ];

  return (
    <Section className="flex flex-col items-start gap-4">
      <Badge variant={"outline"} className="" id="skills">
        Technical Skills
      </Badge>

      <div className="w-full">
        <Table className="">
          <TableHeader>
            <TableRow>
              <TableHead className="text-left w-1/6 font-extrabold text-foreground">
                Category
              </TableHead>
              <TableHead className="text-left w-5/6 font-extrabold text-foreground">
                Technologies
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-accent-foreground">
            {skillsData.map((skillCategory) => (
              <TableRow key={skillCategory.category.toString()}>
                <TableCell className="font-medium text-muted-foreground">
                  {skillCategory.category}
                </TableCell>
                <TableCell className="flex gap-3">
                  {skillCategory.technologies.map((tech) => (
                    <TooltipProvider key={tech.name} delayDuration={50}>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="p-1">
                            <Icon
                              className="hover:blur-[6px] absolute transition-all opacity-35"
                              icon={tech.icon}
                              width="2.25em"
                              height="2.25em"
                            />
                            <Icon
                              className=""
                              icon={tech.icon}
                              width="2.25em"
                              height="2.25em"
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-semibold">{tech.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Section>
  );
};
