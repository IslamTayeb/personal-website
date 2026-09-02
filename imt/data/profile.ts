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
      text: "I'm a rising senior studying CS + Chemistry at ",
    },
    { text: 'Duke University', href: profileLinks.dukeUniversity },
    {
      text: " in Durham, NC. I'm researching systems in ML, particularly agent correctness and efficiency. I usually use science, data, and coding as motivating domains.",
    },
  ],
  [
    {
      text: 'I was born and raised in Egypt, but moved to Taif, Saudi Arabia during high school. I like to play ',
    },
    { text: 'Tetris', href: profileLinks.tetris },
    { text: ' and ' },
    { text: 'Monkeytype', href: profileLinks.monkeytype },
    { text: ' in my free time.' },
  ],
  [
    { text: 'In high school, I worked as a graphic designer for an ' },
    { text: 'esports team', href: profileLinks.esports },
    { text: '. I also played ' },
    { text: 'osu!', href: profileLinks.osu },
    { text: ' competitively and designed a ' },
    { text: 'few', href: profileLinks.skinOne },
    { text: ' ' },
    { text: 'skins', href: profileLinks.skinTwo },
    { text: ' (500K+ downloads).' },
  ],
];
