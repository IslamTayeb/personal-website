import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);

export const paths = {
  root,
  contentRoot: path.join(root, 'content', 'posts'),
  blogIndex: path.join(root, 'blog', 'index.html'),
  feedDir: path.join(root, 'feed'),
  home: path.join(root, 'index.html'),
};

export const site = {
  name: 'APM Overflow',
  url: 'https://apmoverflow.xyz',
  author: 'islamtayeb',
  mediaBaseUrl:
    'https://raw.githubusercontent.com/islamtayeb/obsidian-files/main/',
};

export const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
