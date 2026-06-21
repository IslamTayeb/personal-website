import type { Publication } from '@/types/content';

export const scholarProfileUrl =
  'https://scholar.google.com/citations?hl=en&user=2ZrlBUcAAAAJ';

export const publications: Publication[] = [
  {
    date: 'Sep 2025',
    title:
      'Machine learning for predicting and optimizing the CO₂ uptake in porous organic polymers',
    authors: 'Hamid Zentou, Ali Tayeb, Islam Tayeb, Mahmoud Abdelnaby',
    venue: 'Journal of Environmental Chemical Engineering',
    venueHref:
      'https://www.journals.elsevier.com/journal-of-environmental-chemical-engineering',
    type: 'Research Article',
    href: 'https://doi.org/10.1016/j.jece.2025.119315',
    desc: [
      'Developed a machine learning framework to predict CO₂ adsorption capacity in porous organic polymers using gradient boosting and genetic algorithms.',
      'I helped develop the ML framework, performed data curation and processing, and helped write the original manuscript.',
    ],
  },
  {
    date: 'May 2025',
    title: 'Primal dual continual learning for robust antibody design',
    authors: 'Islam Tayeb, Navid NaderiAlizadeh',
    type: 'Pre-print',
    href: 'https://doi.org/10.13140/RG.2.2.11182.98880',
    desc: [
      'Framework for handling distribution shifts in antibody design using constrained continual learning.',
      'I developed the algorithm and implemented the full framework for the Antibody DomainBed benchmark.',
    ],
  },
  {
    date: 'Jan 2024',
    title:
      'Post-synthetic modification of UiO-66 analogue metal-organic framework as potential solid sorbent for direct air capture',
    authors:
      'Mahmoud Abdelnaby, Islam Tayeb, Ahmed Alloush, Hussain Alyosef, Aljazi Alnoaimi, Mostafa Zeama, Mohammed Mohammed, Sagheer Onaizi',
    venue: 'Journal of CO₂ Utilization',
    venueHref: 'https://www.journals.elsevier.com/journal-of-co2-utilization',
    type: 'Research Article',
    href: 'https://doi.org/10.1016/j.jcou.2023.102647',
    desc: [
      'Modified a metal-organic framework polymer to better capture CO₂ directly from air.',
      'I designed and synthesized the materials in the lab, characterized their properties, and helped write the paper.',
    ],
  },
];
