import { profileLinks } from './links';

export type TextSegment = {
  text: string;
  href?: string;
  external?: boolean;
};

export const profile = {
  name: 'Islam Tayeb',
  location: 'Durham, NC',
  hometown: 'Egypt',
  email: 'islam.moh.islamm@gmail.com',
  role: 'Duke CS student researching ML systems',
};

export const heroParagraphs: TextSegment[][] = [
  [
    {
      text: "Hey! I'm a Duke CS student based in Durham, NC, researching ML systems, particularly agent correctness and efficiency.",
    },
    { text: ' I also enjoy ' },
    { text: 'writing', href: profileLinks.apmOverflow, external: false },
    { text: ' technical and opinion pieces.' },
  ],
  [
    {
      text: 'I was born and raised in Egypt, but later moved to Taif, Saudi Arabia during high school. I play ',
    },
    { text: 'Tetris', href: profileLinks.tetris },
    { text: ' and ' },
    { text: 'Monkeytype', href: profileLinks.monkeytype },
    { text: ' in my free time.' },
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
