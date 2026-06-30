export type LinkItem = {
  label: string;
  href: string;
  external?: boolean;
};

export const contactLinks: LinkItem[] = [
  {
    label: 'Email',
    href: 'mailto:islam.moh.islamm@gmail.com',
    external: false,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/islam-tayeb/',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/IslamTayeb',
  },
  {
    label: 'X',
    href: 'https://x.com/IslamTyb',
  },
  {
    label: 'Scholar',
    href: 'https://scholar.google.com/citations?hl=en&user=2ZrlBUcAAAAJ',
  },
];

export const profileLinks = {
  dukeUniversity: 'https://www.duke.edu/',
  coolInfraStory:
    'https://www.wired.com/2015/09/whatsapp-serves-900-million-users-50-engineers/',
  notionInfra:
    'https://www.notion.com/blog/building-and-scaling-notions-data-lake',
  sqliteStory: 'https://corecursive.com/066-sqlite-with-richard-hipp/',
  tetris: 'https://ch.tetr.io/u/mivi',
  monkeytype: 'https://monkeytype.com/profile/Mivi',
  apmOverflow: '/blog',
  esports: 'https://yuki.gg/',
  osu: 'https://osu.ppy.sh/users/11749586',
  skinOne: 'https://skins.osuck.net/skins/1762?v=0',
  skinTwo: 'https://skins.osuck.net/skins/1464?v=0',
};

export const footerQuote = {
  label: 'plz enjoy game',
  href: 'https://image2url.com/images/1759205331642-b0f15abc-1355-44f6-a3fb-22e16aeabc6c.png',
  credit: 'rrtyui',
  creditHref: 'https://www.youtube.com/watch?v=FWhwWUOm_Ck',
};
