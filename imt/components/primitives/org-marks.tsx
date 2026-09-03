// Organization marks for the experience rail, normalized into a 16x16 box.
// Sources are noted per mark. Each mark is one or more filled paths and
// renders in currentColor. `box` is the tight bounds inside the 16x16 box, and
// `ink` the filled area, so marks can be sized to equal visual weight.

export type OrgKey = 'duke' | 'kfupm' | 'yc' | 'soff' | 'life-edit' | 'dihi';

type OrgMarkDef = {
  label: string;
  box: [number, number, number, number];
  // Filled area in 16x16 box units, measured from a raster of the paths.
  ink: number;
  // Optional perceptual nudge on the balanced height. Equal ink still reads
  // unequal: wide sparse marks look heavy, compact dense ones look light.
  weight?: number;
  paths: string[];
};

const orgMarks: Record<OrgKey, OrgMarkDef> = {
  // Duke Athletics "D" (Wikimedia Commons, Duke_Athletics_logo.svg)
  duke: {
    label: 'Duke University',
    box: [0.0, 0.88, 16.0, 14.24],
    ink: 152.2,
    weight: 1.1,
    paths: [
      'M8.9 0.88L10.9 4.18L10.9 11.81L8.9 15.12L13.09 15.12C14.7 15.11 16 13.82 16 12.14L16 3.93C16 2.24 14.7 0.88 13.09 0.88L8.9 0.88L8.9 0.88M0 0.88L2 4.18L2 11.81L0 15.12L8.46 15.12L6.46 11.81L6.46 4.18L8.46 0.88L0 0.88L0 0.88Z',
    ],
  },
  // Emblem cropped from kfupm.edu.sa/images/default-source/default-album/kfupm_logo_en.svg,
  // with the sixteen window cutouts merged into one tower opening so it reads at 12px
  kfupm: {
    label: 'KFUPM',
    box: [0.52, 0.0, 14.95, 16.0],
    ink: 130.0,
    weight: 1.08,
    paths: [
      'M14.83 4L11.73 0.68C11.32 0.25 10.77 0 10.19 0L5.8 0C5.23 0 4.68 0.25 4.27 0.68L1.17 4C0.76 4.44 0.53 5.03 0.53 5.65L0.53 10.35C0.53 10.96 0.76 11.56 1.17 11.99L4.27 15.32C4.68 15.75 5.23 16 5.81 16L10.19 16C10.77 16 11.32 15.75 11.73 15.32L14.83 11.99C15.24 11.56 15.47 10.96 15.47 10.35L15.47 5.65C15.47 5.03 15.24 4.44 14.83 4ZM4.46 4.66L4.74 4.47L4.88 4.38L5.45 4L6.01 3.75L6.48 3.67L7.42 3.51L7.66 3.47L8.35 3.47L8.82 3.55L9.76 3.71L9.99 3.75L10.55 4L10.69 4.09L11.26 4.47L11.55 4.66L10.23 15.28L5.78 15.28L4.46 4.66Z',
    ],
  },
  // Simple Icons "ycombinator"
  yc: {
    label: 'Y Combinator',
    box: [0.0, 0.0, 16.0, 16.0],
    ink: 241.4,
    paths: [
      'M0 16L0 0L16 0L16 16L0 16M4.63 3.93L7.38 9.07L7.38 12.45L8.43 12.45L8.43 9.13L11.2 3.93L10.03 3.93L8.39 7.18C8.14 7.68 7.93 8.14 7.93 8.14C7.93 8.14 7.74 7.67 7.5 7.18L5.89 3.93L4.63 3.93Z',
    ],
  },
  // Traced from the Soff logo PNG on ycombinator.com/companies/soff (black on white)
  soff: {
    label: 'Soff',
    box: [-0.0, 3.14, 16.0, 9.72],
    ink: 64.1,
    weight: 0.85,
    paths: [
      'M0 12.72C0 12.64 0.24 11.98 0.53 11.25C1.48 8.88 2.65 8 4.9 8C6.3 8 6.94 7.8 7.39 7.23C7.55 7.03 8.02 6.02 8.43 5L9.18 3.14L12.59 3.14L16 3.14L15.72 3.84C15.03 5.61 14.6 6.38 14.01 6.91C13.17 7.66 12.57 7.88 11.15 7.95C8.66 8.08 8.64 8.09 7.5 10.86L6.68 12.86L3.34 12.86C1.22 12.86 0 12.81 0 12.72Z',
    ],
  },
  // Six-bar mark, bars condensed to 40% gaps, from lifeeditinc.com/wp-content/uploads/2024/04/logo.svg (Wayback, Feb 2025)
  'life-edit': {
    label: 'Life Edit Therapeutics',
    box: [0.0, 1.2, 16.0, 13.6],
    ink: 83.8,
    paths: [
      'M1 13.07C0.43 13.07 0 12.64 0 12.07L0 4.37C0 3.8 0.44 3.36 1 3.36C1.56 3.36 2 3.8 2 4.37L2 12.07C2 12.64 1.57 13.07 1 13.07Z',
      'M3.8 7.48C3.23 7.48 2.8 7.04 2.8 6.47L2.8 2.22C2.8 1.66 3.23 1.22 3.8 1.22C4.36 1.22 4.8 1.66 4.8 2.22L4.8 6.47C4.76 7.04 4.32 7.48 3.8 7.48Z',
      'M6.6 9.79C6.03 9.79 5.6 9.36 5.6 8.79L5.6 4.54C5.6 3.98 6.03 3.54 6.6 3.54C7.16 3.54 7.6 3.98 7.6 4.54L7.6 8.79C7.6 9.36 7.16 9.79 6.6 9.79Z',
      'M9.4 6.21C9.96 6.21 10.4 6.64 10.4 7.21L10.4 11.46C10.4 12.03 9.96 12.46 9.4 12.46C8.83 12.46 8.4 12.03 8.4 11.46L8.4 7.21C8.4 6.64 8.83 6.21 9.4 6.21Z',
      'M12.2 8.52C12.77 8.52 13.2 8.96 13.2 9.53L13.2 13.78C13.2 14.34 12.76 14.78 12.2 14.78C11.64 14.78 11.2 14.34 11.2 13.78L11.2 9.53C11.2 8.96 11.63 8.52 12.2 8.52L12.2 8.52Z',
      'M15 2.92C15.56 2.92 16 3.36 16 3.93L16 11.63C16 12.2 15.56 12.64 15 12.64C14.43 12.64 14 12.2 14 11.63L14 3.93C14.04 3.36 14.48 2.92 15 2.92Z',
    ],
  },
  // Solid horned bulb and one merged base block from dihi.org/wp-content/uploads/2020/02/DIHI-Logo-RGB.svg,
  // without the tail or wordmark so it reads at 12px
  dihi: {
    label: 'Duke Institute for Health Innovation',
    box: [2.85, 0.0, 10.3, 16.0],
    ink: 103.6,
    paths: [
      'M12.7 3.28C13.16 2.41 13.28 1.49 12.96 0.54C12.95 0.52 12.94 0.49 12.92 0.44C12.62 0.99 12.25 1.46 11.75 1.82C10.76 0.65 9.53 0 8 0L7.99 0C6.46 0 5.23 0.65 4.25 1.82C3.74 1.46 3.38 0.99 3.07 0.44C3.05 0.49 3.04 0.51 3.03 0.54C2.71 1.49 2.84 2.41 3.29 3.28C3.16 4.13 3.16 4.69 3.24 5.26C3.37 6.1 3.67 6.9 4.03 7.67C4.42 8.53 4.85 9.38 5.22 10.25C5.53 10.97 5.77 11.73 6.05 12.5L6.18 12.5Q7.09 12.5 8 12.5Q8.91 12.5 9.82 12.5L9.94 12.5C10.23 11.73 10.47 10.97 10.78 10.25C11.15 9.38 11.57 8.53 11.97 7.67C12.32 6.9 12.63 6.11 12.75 5.26C12.84 4.69 12.83 4.13 12.68 3.57Z',
      'M6.12 14.6L6.13 13.45L6.14 13.33L6.18 13.23L6.25 13.16L6.36 13.12L6.49 13.11L9.51 13.11L9.65 13.12L9.75 13.16L9.82 13.23L9.87 13.33L9.88 13.46L9.88 14.56L9.86 14.69L9.82 14.79L9.04 15.86L8.97 15.93L8.88 15.98L8.76 16L7.23 16L7.12 15.98L7.02 15.93L6.96 15.86L6.15 14.73Z',
    ],
  },
};

export const orgKeys = Object.keys(orgMarks) as OrgKey[];

// Ink area of a mark rendered `height` px tall with its natural width.
function inkAtHeight(org: OrgKey, height: number) {
  const mark = orgMarks[org];
  const scale = height / mark.box[3];

  return mark.ink * scale * scale;
}

// Height that moves this mark toward the ink area of the plain square rail
// dot of side `dotSize`. `strength` 1 makes every mark carry exactly the dot's
// filled area; 0.5 goes halfway there, so sparse marks grow less.
export function orgMarkBalancedHeight(
  org: OrgKey,
  dotSize: number,
  strength = 0.5,
  bounds?: [number, number]
) {
  const target = dotSize * dotSize;
  const height =
    dotSize *
    Math.pow(target / inkAtHeight(org, dotSize), 0.5 * strength) *
    (orgMarks[org].weight ?? 1);
  const clamped = bounds
    ? Math.min(bounds[1], Math.max(bounds[0], height))
    : height;

  return Math.round(clamped * 100) / 100;
}

export function OrgMark({
  org,
  size = 16,
  fit = 'contain',
  className,
}: {
  org: OrgKey;
  size?: number;
  // `contain` fits the mark in a `size` square; `height` makes `size` the
  // height and lets the width follow the mark's aspect ratio.
  fit?: 'contain' | 'height';
  className?: string;
}) {
  const mark = orgMarks[org];
  const [, , boxWidth, boxHeight] = mark.box;
  const width =
    fit === 'height'
      ? Math.round(((size * boxWidth) / boxHeight) * 100) / 100
      : size;

  return (
    <svg
      width={width}
      height={size}
      viewBox={mark.box.join(' ')}
      fill="currentColor"
      aria-hidden
      data-org-mark={org}
      className={className}
    >
      {mark.paths.map((d, index) => (
        <path key={index} d={d} />
      ))}
    </svg>
  );
}
