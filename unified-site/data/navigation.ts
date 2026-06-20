export type NavItem = {
  label: string;
  href: string;
  surface: 'islam' | 'blog';
};

export const navItems: NavItem[] = [
  { label: 'experience', href: '/#experience', surface: 'islam' },
  { label: 'publications', href: '/#publications', surface: 'islam' },
  { label: 'courses', href: '/#courses', surface: 'islam' },
  { label: 'writing', href: '/blog', surface: 'blog' },
];
