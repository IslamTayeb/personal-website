import type { TextSegment } from '@/data/profile';

export type NewsItem = {
  // Only the segments that name something get an href.
  segments: TextSegment[];
  date: string;
};

// Newest first. Kept to a few lines; each renders as a single rail row.
export const newsItems: NewsItem[] = [
  {
    segments: [
      { text: 'Presented at the ' },
      {
        text: 'AI Research Scientist Workshop',
        href: 'https://ai-scientist-workshop.github.io/',
      },
      { text: ' at Microsoft Research in Boston' },
    ],
    date: 'Aug 2026',
  },
  {
    segments: [
      { text: 'Accepted into the ' },
      {
        text: 'Anthropic AI for Science program',
        href: 'https://www.anthropic.com/news/ai-for-science-program',
      },
      { text: ', thx for the compute!' },
    ],
    date: 'Jun 2026',
  },
  {
    segments: [
      { text: 'Posted ' },
      {
        text: 'On Agent Memory Fidelity',
        href: '/blog/on-agent-memory-fidelity',
      },
      { text: ', on giving agents adaptive, reversible forgetting' },
    ],
    date: 'Jun 2026',
  },
];
