import { projects } from '@/data/projects';
import { ExternalLink } from '@/components/primitives/external-link';
import { BorderedPanel, Section } from '@/components/primitives/section';

const categoryColor = {
  Product: 'text-roy-r',
  Systems: 'text-roy-o',
  Applet: 'text-roy-y',
} as const;

export function Projects() {
  return (
    <Section
      id="projects"
      index="3"
      title="Projects"
      accent="text-roy-r"
      note="Dense text-first project rows. No thumbnails, no autoplay, no image reveal effects."
    >
      <BorderedPanel>
        <ul className="divide-y divide-border">
          {projects.map((project) => (
            <li
              key={project.title}
              className="grid gap-1.5 py-2.5 first:pt-0 last:pb-0"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="text-sm font-medium leading-tight text-foreground">
                  {project.title}
                </h3>
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.14em] ${
                    categoryColor[project.category]
                  }`}
                >
                  {project.category}
                </span>
              </div>
              <p className="text-sm leading-snug text-muted-foreground text-pretty">
                {project.desc}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <ul className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <li
                      key={tag}
                      className="border border-dashed border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
                <ul className="flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  {project.links.map((link) => (
                    <li key={`${project.title}-${link.label}`}>
                      <ExternalLink href={link.href} section="r">
                        {link.label}
                      </ExternalLink>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </BorderedPanel>
    </Section>
  );
}
