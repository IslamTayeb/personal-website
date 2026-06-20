export type CourseCategory = 'Systems' | 'Theory' | 'Biochemistry';

export type Course = {
  name: string;
  code: string;
  category: CourseCategory;
  desc: string;
  locked: boolean;
};

export type Publication = {
  date: string;
  title: string;
  authors: string;
  venue?: string;
  venueHref?: string;
  type: string;
  href: string;
  desc: string[];
};
