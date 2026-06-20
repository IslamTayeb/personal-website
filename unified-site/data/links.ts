export type LinkItem = {
  label: string;
  href: string;
  external?: boolean;
};

export const contactLinks: LinkItem[] = [
  {
    label: 'email',
    href: 'mailto:islam.tayeb@duke.edu',
    external: false,
  },
  {
    label: 'github',
    href: 'https://github.com/IslamTayeb',
  },
  {
    label: 'x',
    href: 'https://x.com/IslamTyb',
  },
  {
    label: 'linkedin',
    href: 'https://www.linkedin.com/in/islam-tayeb/',
  },
  {
    label: 'scholar',
    href: 'https://scholar.google.com/citations?hl=en&user=2ZrlBUcAAAAJ',
  },
];

export const profileLinks = {
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
