"use client"

import { useState } from "react"
import { ChevronDown, Calendar, MapPin, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
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
    // Add more as needed
}

export function Experience() {
    const [openIndices, setOpenIndices] = useState<number[]>([])

    const toggleAccordion = (index: number, status?: string) => {
        if (status !== "incoming" && experiences[index].responsibilities.length > 1) {
            setOpenIndices(prev => {
                // If already open, remove from array; otherwise add to array
                return prev.includes(index)
                    ? prev.filter(i => i !== index)
                    : [...prev, index]
            })
        }
    }

    const renderLogo = (logo: string, company: string) => {
        // Handle TSX components
        if (typeof logo === 'string' && logo.endsWith('.tsx')) {
            // Extract component name from path
            const componentPath = logo.replace('.tsx', '');
            const componentName = componentPath.split('/').pop();

            // Check if we have a matching component in registry
            if (componentName && componentName in logoComponentRegistry) {
                const LogoComponent = logoComponentRegistry[componentName as keyof typeof logoComponentRegistry];
                return <LogoComponent className="w-full h-full" />
            }

            // Fallback to first letter
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
                    className={cn(
                        "border border-secondary rounded-lg overflow-hidden transition-all duration-300",
                        openIndices.includes(index) && "shadow-md",
                    )}
                >
                    <div
                        onClick={() => toggleAccordion(index, experience.status)}
                        className={cn(
                            "w-full flex justify-between items-center p-3 text-left transition-all duration-300",
                            openIndices.includes(index) ? "bg-secondary/40" : "bg-card hover:bg-card/25 transition-all",
                            experience.status !== "incoming" && experience.responsibilities.length > 1 && "cursor-pointer"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-12 h-12 min-w-12 min-h-12 text-primary">
                                {renderLogo(experience.logo, experience.company)}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-medium text-lg tracking-tight font-sans text-primary">{experience.role}</h3>
                                    {experience.status === "present" && <Badge variant="default" className="rounded-full font-semibold text-[0.4em] p-[0.165rem] h-fit text-nowrap font-mono leading-none px-1">Present</Badge>}
                                    {experience.status === "incoming" && <Badge variant="secondary" className="rounded-full font-semibold text-[0.4em] p-[0.165rem] h-fit text-nowrap font-mono leading-none px-1">Incoming</Badge>}
                                    {experience.company === "Soff" && (
                                        <Badge variant="outline" className="rounded-full font-semibold text-[0.4em] p-[0.2rem] px-1.5 h-fit text-nowrap font-mono leading-none flex items-center gap-0.5">
                                            <DefaultIcon icon="simple-icons:ycombinator" className="w-2.5 h-2.5 mr-1 rounded-[1.5px]" />
                                            Backed by YC
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-muted-foreground font-normal text-sm space-x-1.5">
                                    {experience.website ? (
                                        <span className="inline-flex items-center">
                                            <a
                                                href={experience.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-normal font-sans inline-flex items-center relative md:after:absolute md:after:bottom-0 md:after:left-0 md:after:h-[0.5px] md:after:w-full md:after:origin-bottom-left md:after:scale-x-100 hover:md:after:scale-x-0 md:after:transition-transform md:after:ease-in-out md:after:duration-200 md:after:bg-gray-500 text-foreground underline md:no-underline brightness-105"
                                            >
                                                {experience.company}
                                            </a>
                                            <ExternalLink className="inline-block w-3 h-3 ml-1" />
                                        </span>
                                    ) : (
                                        <span className="font-normal font-sans text-foreground">
                                            {experience.company}
                                        </span>
                                    )}
                                    <span>•</span>
                                    <span className="font-light font-sans">{experience.responsibilities[0]}</span>
                                </p>
                            </div>
                        </div>
                        {experience.status !== "incoming" && experience.responsibilities.length > 1 && (
                            <ChevronDown
                                className={cn(
                                    "h-5 w-5 transition-transform duration-200 text-muted-foreground flex-shrink-0 self-center",
                                    openIndices.includes(index) && "rotate-180",
                                )}
                            />
                        )}
                    </div>

                    <div
                        className={cn(
                            "overflow-hidden transition-all duration-200 ease-in-out",
                            openIndices.includes(index) ? "max-h-[1000px]" : "max-h-0",
                        )}
                    >
                        <div className="p-4 border-t border-secondary bg-card">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-2.5 text-sm text-muted-foreground opacity-80">
                                <div className="flex items-center">
                                    <Calendar className="mr-1.5 h-4 w-4" />
                                    <span>{experience.period}</span>
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="mr-1.5 h-4 w-4" />
                                    <span>{experience.location}</span>
                                </div>
                            </div>

                            <div className="font-sans font-normal my-1 mt-3 text-[0.925em]">Responsibilities & Results:</div>
                            <ul className="list-disc pl-5 text-sm space-y-1.5 text-muted-foreground font-sans font-light">

                                {experience.responsibilities.slice(1).map((item, itemIndex) => (
                                    <li key={itemIndex}>{item}</li>
                                ))}
                            </ul>

                            <div className="flex flex-wrap gap-2 mt-3.5">
                                {(experience.skills || []).map((skill, skillIndex) => (
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

                        </div>
                    </div>
                </div>
            ))}
        </Section>
    )
}

const highlightStyle = "font-normal"; // You can change this once to update all highlights

const experiences = [
    {
        role: "ML Research Assistant",
        company: "Duke University",
        logo: "Icons/DukeUni2.tsx",
        // period: "Oct 2024 – Apr 2025",
        location: "Durham, NC",
        status: "incoming",
        website: "https://www.romerolab.org/",
        responsibilities: [
            "ML + infrastructure for enzyme design @ Romero Lab",
        ],
        skills: [
            { name: "Python", icon: "simple-icons:python" },
            { name: "PyTorch", icon: "simple-icons:pytorch" },
            { name: "Machine Learning", icon: "carbon:machine-learning" },
            { name: "Continual Learning", icon: "material-symbols:memory" },
            { name: "Distributed Training", icon: "carbon:network-4" },
            { name: "Domain Generalization", icon: "fluent:bezier-curve-square-12-filled" },
            { name: "HPC", icon: "charm:binary" },
            { name: "Bioinformatics", icon: "carbon:chemistry" },
        ],
    },
    {
        role: "Software Engineer Intern",
        company: "Soff",
        website: "https://soff.ai/",
        logo: "Icons/Soff.tsx",
        period: "May 2025 – Present",
        location: "San Francisco, CA",
        status: "present",
        responsibilities: [
            "AI + infrastructure for supply chain intelligence",
            // "Building cloud-native enterprise integration platform and CI/CD using Kubernetes + Docker + GitHub Actions",
        ],
        // skills: [
        //     { name: "Kubernetes", icon: "simple-icons:kubernetes" },
        //     { name: "Docker", icon: "simple-icons:docker" },
        //     { name: "GitHub Actions", icon: "simple-icons:githubactions" },
        //     { name: "CI/CD", icon: "carbon:continuous-deployment" },
        //     { name: "Cloud", icon: "carbon:cloud" },
        //     { name: "AI", icon: "carbon:ai" },
        // ],
    },
    {
        role: "Software Engineer",
        company: "Helian",
        website: "https://www.helian.ai/",
        logo: "Icons/Helian.tsx",
        period: "Dec 2024 – May 2025",
        location: "Durham, NC",
        // status: "present",
        responsibilities: [
            "Developing AI insight tool for medical research workflows",
            <>Engineered ETL pipeline achieving <span className={highlightStyle}>80%</span> speedup and <span className={highlightStyle}>65%</span> resource reduction</>,
            <>Built document processor embedding <span className={highlightStyle}>25K</span> daily PDFs with <span className={highlightStyle}>&lt;100ms</span> latency</>,
            <>Implemented caching system reducing costs by <span className={highlightStyle}>15%</span> and storage by <span className={highlightStyle}>10%</span></>,
            <>Optimized RAG reducing token usage by <span className={highlightStyle}>25%</span> and response time by <span className={highlightStyle}>40%</span></>,
        ],
        skills: [
            { name: "TypeScript", icon: "simple-icons:typescript" },
            { name: "Python", icon: "simple-icons:python" },
            { name: "Next.js", icon: "simple-icons:nextdotjs" },
            { name: "FastAPI", icon: "simple-icons:fastapi" },
            { name: "Supabase", icon: "simple-icons:supabase" },
            { name: "AWS", icon: "simple-icons:amazonaws" },
            { name: "Redis", icon: "devicon-plain:redis" },
            { name: "Celery", icon: "simple-icons:celery" },
            { name: "Docker", icon: "simple-icons:docker" },
            { name: "Git", icon: "simple-icons:git" },
        ],
    },
    {
        role: "ML Engineer Intern",
        company: "Reveal Genomics",
        website: "https://www.reveal-genomics.com/",
        logo: "Icons/Reveal.tsx",
        period: "Sep 2024 – Apr 2025",
        location: "Durham, NC",
        // status: "present",
        responsibilities: [
            "Breast cancer genomic analysis & biomarker discovery",
            <>Enhanced biomarker identification by <span className={highlightStyle}>55%</span> with <span className={highlightStyle}>Dask</span> + <span className={highlightStyle}>NetworkX</span> pipelines</>,
            <>Improved non-linear gene correlation detection by <span className={highlightStyle}>65%</span> using <span className={highlightStyle}>PCA</span> + <span className={highlightStyle}>t-SNE</span></>,
            <>Reduced R&D analysis time by <span className={highlightStyle}>85%</span> with custom genomic dashboards</>
        ],
        skills: [
            { name: "Python", icon: "simple-icons:python" },
            { name: "Pandas", icon: "simple-icons:pandas" },
            { name: "Streamlit", icon: "simple-icons:streamlit" },
            { name: "Dask", icon: "simple-icons:dask" },
            { name: "NetworkX", icon: "devicon-plain:networkx" },
            { name: "Scikit-Learn", icon: "simple-icons:scikitlearn" },
            { name: "PCA", icon: "carbon:chart-scatter" },
            { name: "Random Forest", icon: "carbon:decision-tree" },
            { name: "TF-IDF", icon: "carbon:text-mining" },
            { name: "t-SNE", icon: "carbon:chart-t-sne" },
            { name: "Git", icon: "simple-icons:git" },
        ],
    },
    {
        role: "ML Research Assistant",
        company: "Duke University",
        logo: "Icons/DukeUni2.tsx",
        period: "Oct 2024 – Apr 2025",
        location: "Durham, NC",
        // status: "present",
        website: "https://sites.duke.edu/navid/",
        responsibilities: [
            "ML for therapeutic protein design @ NaderiAlizadeh Lab",
            <>Engineered continual learning model increasing generalization by <span className={highlightStyle}>9%</span></>,
            <>Built distributed pipeline optimizing <span className={highlightStyle}>1M+</span> protein candidates with <span className={highlightStyle}>20%</span> speedup</>,
            <>Implemented GearNet integration boosting prediction accuracy by <span className={highlightStyle}>20%</span></>
        ],
        skills: [
            { name: "Python", icon: "simple-icons:python" },
            { name: "PyTorch", icon: "simple-icons:pytorch" },
            { name: "Machine Learning", icon: "carbon:machine-learning" },
            { name: "Continual Learning", icon: "material-symbols:memory" },
            { name: "Distributed Training", icon: "carbon:network-4" },
            { name: "Domain Generalization", icon: "fluent:bezier-curve-square-12-filled" },
            { name: "HPC", icon: "charm:binary" },
            { name: "Bioinformatics", icon: "carbon:chemistry" },
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
            "Automated health literature review system",
            <>Engineered review system processing <span className={highlightStyle}>250+</span> papers daily</>,
            <>Built classifier achieving <span className={highlightStyle}>98%</span> accuracy and <span className={highlightStyle}>95%</span> faster processing</>,
            <>Implemented grant-writing assistant serving <span className={highlightStyle}>350+</span> analysts across organizations</>,
            <>Developed BERT detector analyzing <span className={highlightStyle}>10K+</span> EHR records hourly</>
        ],
        skills: [
            { name: "Python", icon: "simple-icons:python" },
            { name: "BERT", icon: "ri:google-fill" },
            // { name: "NLP", icon: "carbon:text-mining" },
            { name: "AutoGen", icon: "uil:microsoft" },
            { name: "LLMs", icon: "carbon:ai" },
            { name: "GROBID", icon: "carbon:document" },
            { name: "EHR Analysis", icon: "carbon:data-structured" },
            { name: "Docker", icon: "simple-icons:docker" },
        ],
    },
    {
        role: "Software Engineer Intern",
        company: "Project: Sapien",
        website: "https://www.projectsapien.com/",
        logo: "Icons/Sapien.tsx",
        period: "Dec 2023 – Jan 2024",
        location: "Princeton, NJ",
        responsibilities: [
            "NLP + population health analysis dashboard",
            <>Engineered survey builder reducing creation time by <span className={highlightStyle}>25%</span></>,
            <>Built classification pipeline reducing analysis time by <span className={highlightStyle}>95%+</span></>,
            "Implemented HIPAA-compliant data anonymization ensuring privacy"
        ],
        skills: [
            { name: "JavaScript", icon: "simple-icons:javascript" },
            { name: "React", icon: "simple-icons:react" },
            { name: "Node.js", icon: "simple-icons:nodedotjs" },
            // { name: "NLP", icon: "carbon:text-mining" },
            { name: "BERT", icon: "carbon:machine-learning-model" },
            { name: "Regex", icon: "carbon:string-text" },
            { name: "Data Privacy", icon: "carbon:security" },
            { name: "HIPAA", icon: "carbon:certificate" },
        ],
    },
    {
        role: "ML Research Assistant",
        company: "Saudi Aramco, KFUPM",
        website: "https://ri.kfupm.edu.sa/irc-htcm",
        logo: "Icons/Aramco.tsx",
        period: "Jul 2022 – Sep 2023",
        location: "Saudi Arabia",
        responsibilities: [
            "Metal-organic polymers for CO₂ capture @ IRC-HTCM",
            <>Engineered simulations predicting capture capacity within <span className={highlightStyle}>12%</span> of results</>,
            <>Built meta-analysis analyzing <span className={highlightStyle}>300+</span> papers for proposals (<span className={highlightStyle}>3</span> publications)</>,
            <>Implemented breakthrough analysis interface processing <span className={highlightStyle}>36K+</span> points hourly</>
        ],
        skills: [
            { name: "MATLAB", icon: "file-icons:matlab" },
            { name: "Python", icon: "simple-icons:python" },
            { name: "Streamlit", icon: "simple-icons:streamlit" },
            { name: "Scikit-Learn", icon: "simple-icons:scikitlearn" },
            { name: "Seaborn", icon: "simple-icons:plotly" },
            { name: "Data Visualization", icon: "carbon:chart-line" },
            { name: "Monte Carlo", icon: "material-symbols:simulation" },
            { name: "Meta-Analysis", icon: "streamline:code-analysis-solid" },
        ],
    },
]
