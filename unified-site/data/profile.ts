import { profileLinks, type LinkItem } from './links';

export type TextSegment = {
  text: string;
  href?: string;
  external?: boolean;
};

export const profile = {
  name: 'Islam Tayeb',
  location: 'Durham, NC',
  hometown: 'Egypt',
  email: 'islam.tayeb@duke.edu',
  role: 'Duke student finding lazy automations',
};

export const heroParagraphs: TextSegment[][] = [
  [
    { text: 'Duke student finding lazy automations. Love reading about ' },
    { text: 'cool', href: profileLinks.coolInfraStory },
    { text: ' ' },
    { text: 'infra', href: profileLinks.notionInfra },
    { text: ' ' },
    { text: 'stories', href: profileLinks.sqliteStory },
    {
      text: ' and over-optimizing configs. Also interested in building for science. Currently based in Durham, NC.',
    },
  ],
  [
    { text: 'I grew up in Egypt. I also enjoy playing ' },
    { text: 'Tetris', href: profileLinks.tetris },
    { text: ' and ' },
    { text: 'Monkeytype', href: profileLinks.monkeytype },
    { text: " in my free time. I've also been writing on " },
    { text: 'APM Overflow', href: profileLinks.apmOverflow, external: false },
    { text: '.' },
  ],
  [
    { text: 'In high school, I worked as a graphic designer for an ' },
    { text: 'esports team', href: profileLinks.esports },
    { text: '. Around the same time, I was playing ' },
    { text: 'osu!', href: profileLinks.osu },
    { text: ' competitively and designed a ' },
    { text: 'few', href: profileLinks.skinOne },
    { text: ' ' },
    { text: 'skins', href: profileLinks.skinTwo },
    { text: ' (500K+ downloads).' },
  ],
  [
    { text: 'Feel free to reach out at ' },
    {
      text: profile.email,
      href: `mailto:${profile.email}`,
      external: false,
    },
    { text: '!' },
  ],
];

export const heroMeta: LinkItem[] = [
  {
    label: 'location',
    href: '#',
    external: false,
  },
];
