export type SourceReference = {
  id: string;
  title: string;
  image: string;
  alt: string;
  note: string;
};

export type TranslationMove = {
  id: string;
  sourceMove: string;
  whyItWorks: string;
  localTranslation: string;
  avoid: string;
  fit: 'strong' | 'medium' | 'weak';
};

export type StudyOption = {
  id: 'ledger' | 'specimen' | 'bulletin';
  label: string;
  status: string;
  thesis: string;
  before: string;
  after: string;
  tokens: string[];
  risks: string[];
  score: {
    fit: string;
    effort: string;
    risk: string;
  };
};

export type BeforeAfter = {
  id: string;
  surface: string;
  before: string;
  after: string;
  keep: string;
  cut: string;
};

export const sourceReferences: SourceReference[] = [
  {
    id: 'office',
    title: 'Office sheet',
    image: '/studies/usgraphics/office-desktop-top.jpg',
    alt: 'U.S. Graphics office page top viewport',
    note: 'Small type, bordered sheet, control-like nav, dotted separators, and a table that states the philosophy.',
  },
  {
    id: 'catalog',
    title: 'Catalog ledger',
    image: '/studies/usgraphics/catalog-ledger.jpg',
    alt: 'U.S. Graphics catalog rows and SKU labels',
    note: 'The table is the interface: identifiers, availability, price, grouping rows, and action cells all stay visible.',
  },
  {
    id: 'specimen',
    title: 'Typeface specimen',
    image: '/studies/usgraphics/berkeley-specimen.jpg',
    alt: 'Berkeley Mono product page with specimen image',
    note: 'The product is explained through concrete specimens and compact labels instead of hero-scale marketing.',
  },
  {
    id: 'current-lab',
    title: 'Current lab',
    image: '/studies/usgraphics/component-lab-current.jpg',
    alt: 'Current component lab typography workbench',
    note: 'The existing lab has the right paper, ROYB, and sharp-border base; it needs more visible state and evidence.',
  },
];

export const translationMoves: TranslationMove[] = [
  {
    id: 'table-argument',
    sourceMove: 'Table as argument',
    whyItWorks:
      'Rows carry evidence, status, hierarchy, and actions without creating decorative sections.',
    localTranslation:
      'Use a ledger mode for experience, projects, and writing: id, state, period, system, evidence, action.',
    avoid:
      'Do not make the personal site feel like ecommerce or a product catalog.',
    fit: 'strong',
  },
  {
    id: 'id-chips',
    sourceMove: 'Identifier chips',
    whyItWorks:
      'SKU labels make scanning exact and give repeated rows a compact visual handle.',
    localTranslation:
      'Use research-native ids like SYS-02, EVAL, VALID, WR-03, and RUN with ROYB tints.',
    avoid:
      'Do not borrow U.S. Graphics SKU names, yellow tags, or commercial language.',
    fit: 'strong',
  },
  {
    id: 'calibration-strip',
    sourceMove: 'Calibration strip',
    whyItWorks:
      'The color ruler is small but gives the page a physical systems feel.',
    localTranslation:
      'Make the existing ROYB bar double as a legend for section families and active mode.',
    avoid: 'Do not copy the exact multicolor company scale.',
    fit: 'medium',
  },
  {
    id: 'specimen-board',
    sourceMove: 'Specimen board',
    whyItWorks:
      'The visual proof is the object itself: type, glyphs, release notes, and samples.',
    localTranslation:
      'Show real artifacts: validator output, benchmark rows, traces, or compact blog metadata.',
    avoid: 'Do not turn every section into a black terminal panel.',
    fit: 'strong',
  },
  {
    id: 'sheet-frame',
    sourceMove: 'Bounded sheet',
    whyItWorks:
      'A narrow bordered body makes the site feel like a manufactured document.',
    localTranslation:
      'Test a light sheet frame only in lab; production already has its own paper/ink restraint.',
    avoid:
      'Do not wrap the whole personal site in a U.S. Graphics clone frame.',
    fit: 'weak',
  },
];

export const studyOptions: StudyOption[] = [
  {
    id: 'ledger',
    label: 'Experience ledger',
    status: 'Best first prototype',
    thesis:
      'Turn the experience rail into a dense evidence table while preserving dates, advisors, states, and compact copy.',
    before:
      'A polished vertical rail with role titles, dates, and one-line descriptions.',
    after:
      'A row ledger with explicit identifiers, states, systems, evidence labels, and a small action cell.',
    tokens: ['SYS-02', 'RE-01', 'VALID', 'RUN', 'INCOMING', 'PRESENT'],
    risks: [
      'Could become too bureaucratic if every row gets an id.',
      'Dates need priority on phone so rows do not overflow.',
    ],
    score: {
      fit: 'high',
      effort: 'medium',
      risk: 'low',
    },
  },
  {
    id: 'specimen',
    label: 'Systems specimen',
    status: 'Most distinctive',
    thesis:
      'Make typography tests use the actual world of the site: validators, benchmark traces, project rows, and writing metadata.',
    before: 'A generic paragraph tests font readability and tone.',
    after:
      'A specimen board shows the same font against code-adjacent rows, error states, and research artifacts.',
    tokens: ['EVAL', 'TRACE', 'PASS', 'FAIL', 'SMILES', 'HARD20'],
    risks: [
      'Too much terminal styling would fight the paper/ink identity.',
      'The sample data has to stay truthful to real work.',
    ],
    score: {
      fit: 'high',
      effort: 'medium',
      risk: 'medium',
    },
  },
  {
    id: 'bulletin',
    label: 'Writing bulletin',
    status: 'Good second pass',
    thesis:
      'Expose post metadata as a small publication table: words, minutes, status, source, related system.',
    before: 'A normal blog index with title, date, and excerpt.',
    after:
      'A bulletin-style index that makes source-backed, listed, hidden, and draft states visible.',
    tokens: ['WR-01', 'LISTED', 'HIDDEN', '3K', '5 mins', 'SOURCE'],
    risks: [
      'Can feel fussy on short casual posts.',
      'Needs careful copy so it does not read like a changelog.',
    ],
    score: {
      fit: 'medium',
      effort: 'low',
      risk: 'low',
    },
  },
];

export const beforeAfters: BeforeAfter[] = [
  {
    id: 'hero',
    surface: 'Lab header',
    before: 'Large headline dominates the first viewport.',
    after:
      'Compact study masthead exposes source count, candidate moves, and active prototype earlier.',
    keep: 'ROYB strip, paper base, direct naming.',
    cut: 'Oversized type when the page is a workbench rather than a hero.',
  },
  {
    id: 'experience',
    surface: 'Experience',
    before:
      'Rail reads cleanly but hides category/state structure inside prose.',
    after:
      'Ledger rows expose id, status, date, system, organization, and evidence in one scan.',
    keep: 'One-line compact descriptions and restrained links.',
    cut: 'Decorative row chrome that does not encode information.',
  },
  {
    id: 'writing',
    surface: 'Writing',
    before: 'Blog previews can look like ordinary title/excerpt lists.',
    after:
      'Bulletin rows surface listed/hidden/source-backed states and reading metadata.',
    keep: 'The human title and the existing reading metadata format.',
    cut: 'Catalog language, prices, stock metaphors.',
  },
];

export const ledgerRows = [
  /*
  {
    id: 'RE-01',
    state: 'incoming',
    date: 'Aug 2026',
    system: 'protein search',
    owner: 'Duke / Dallago',
    evidence: 'GPU acceleration',
    action: 'lab',
  },
  */
  {
    id: 'SYS-02',
    state: 'present',
    date: 'Apr 2026 - Present',
    system: 'coding agents',
    owner: 'Duke / Lentz',
    evidence: 'runtime benchmarks',
    action: 'trace',
  },
  {
    id: 'BIO-03',
    state: 'present',
    date: 'Aug 2025 - Present',
    system: 'chem agents',
    owner: 'Duke / Romero',
    evidence: 'validators',
    action: 'paper',
  },
  {
    id: 'ENG-04',
    state: 'ended',
    date: 'May 2025 - Oct 2025',
    system: 'sales agents',
    owner: 'Soff YC S24',
    evidence: 'manufacturer workflows',
    action: 'note',
  },
];

export const specimenRows = [
  ['RUN', 'validate_smiles', 'pass', 'canonical labels survive rendering'],
  ['EVAL', 'hard20', 'fail', 'wrong-answer trace needs explanation'],
  [
    'TRACE',
    'reasoning_output_tokens',
    'watch',
    'budget pressure changes behavior',
  ],
  ['NOTE', '3K words (5 mins)', 'listed', 'reading metadata stays compact'],
];
