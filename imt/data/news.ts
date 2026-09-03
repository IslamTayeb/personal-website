export type NewsItem = {
  text: string;
  href?: string;
  date: string;
};

// Newest first. Kept to a few lines; each renders as a single rail row.
export const newsItems: NewsItem[] = [
  {
    text: 'Presented at the AI Research Scientist Workshop at Microsoft Research in Boston',
    href: 'https://ai-scientist-workshop.github.io/',
    date: 'Aug 2026',
  },
  {
    text: 'Accepted into the Anthropic AI for Science program',
    href: 'https://www.anthropic.com/news/ai-for-science-program',
    date: 'Jun 2026',
  },
];
