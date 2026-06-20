'use client';

import { useEffect, useRef } from 'react';
import { Section, Variant } from './frame';

type DitherOption = {
  label: string;
  tag?: string;
  desc: string;
  kind: 'ink-edge' | 'royb-edge' | 'rail' | 'link' | 'ambient';
};

const ditherOptions: DitherOption[] = [
  {
    label: 'A — ink band, bottom dither',
    tag: 'reference',
    kind: 'ink-edge',
    desc: 'Closest to the reference: a hard document rule with only the bottom edge breaking into halftone paper.',
  },
  {
    label: 'B — ROYB band, bottom dither',
    tag: 'masthead',
    kind: 'royb-edge',
    desc: 'The same bottom-fade idea applied to the top ROYB bar, with each color dissolving separately.',
  },
  {
    label: 'C — rail fade',
    kind: 'rail',
    desc: 'Use dithering where a rail continues or fades, especially for hidden/incoming state.',
  },
  {
    label: 'D — dither-fade link highlight',
    kind: 'link',
    desc: 'A lower-opacity dot-screen highlight that fades in only on hover, separate from the regular link style.',
  },
  {
    label: 'E — active dither field',
    tag: 'state',
    kind: 'ambient',
    desc: 'A static active-state texture for selected rows, loading areas, or one special masthead moment.',
  },
];

const bayer4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
].map((row) => row.map((value) => (value + 0.5) / 16));

function OrderedDitherBar({
  className = '',
  colors,
}: {
  className?: string;
  colors: string[];
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) {
      return;
    }

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      const dpr = window.devicePixelRatio || 1;
      const cellSize = 3;
      const fadeRows = height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return;
      }

      ctx.imageSmoothingEnabled = false;
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      for (let x = 0; x < width; x += cellSize) {
        const color =
          colors[
            Math.min(
              colors.length - 1,
              Math.floor(((x + cellSize / 2) / width) * colors.length)
            )
          ];
        ctx.fillStyle = color;

        for (let y = 0; y < height; y += cellSize) {
          const t = y / Math.max(1, fadeRows - cellSize);
          const density = Math.max(
            0,
            0.94 * (1 - Math.log1p(Math.pow(t, 3.6) * 5) / Math.log1p(5))
          );
          const threshold =
            bayer4[Math.floor(y / cellSize) % 4][Math.floor(x / cellSize) % 4];

          if (density > threshold) {
            ctx.fillRect(x, y, cellSize, cellSize);
          }
        }
      }
    };

    render();

    const resizeObserver = new ResizeObserver(render);
    resizeObserver.observe(canvas);

    return () => resizeObserver.disconnect();
  }, [colors]);

  return (
    <canvas
      ref={ref}
      className={`h-8 w-full [image-rendering:pixelated] ${className}`}
      aria-hidden
    />
  );
}

function DitherDemo({ kind }: { kind: DitherOption['kind'] }) {
  if (kind === 'ink-edge') {
    return (
      <div className="flex flex-col gap-2">
        <OrderedDitherBar
          className="border-t border-foreground/80"
          colors={['#171717']}
        />
        <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          hard ink, dithered bottom edge
        </div>
      </div>
    );
  }

  if (kind === 'royb-edge') {
    return (
      <OrderedDitherBar
        className="border-t border-border"
        colors={['#ff2536', '#ff7900', '#f5d019', '#0875d1']}
      />
    );
  }

  if (kind === 'rail') {
    return (
      <div className="flex gap-4 py-1">
        <div className="dither-rail ml-[3.5px] w-2" />
        <div className="grid flex-1 gap-2">
          <div className="h-2 w-2 bg-roy-o" />
          <div className="h-px w-3/5 bg-border" />
          <div className="h-px w-4/5 bg-border" />
          <div className="h-2 w-2 border border-roy-o bg-background" />
          <div className="h-px w-2/3 bg-border" />
        </div>
      </div>
    );
  }

  if (kind === 'link') {
    return (
      <p className="text-sm leading-snug text-foreground">
        Love reading about{' '}
        <a
          href="https://www.wired.com/2015/09/whatsapp-serves-900-million-users-50-engineers/"
          target="_blank"
          rel="noreferrer external"
          className="dither-link-hover text-roy-b"
        >
          cool infra stories
        </a>
        , then writing on APM Overflow.
      </p>
    );
  }

  return (
    <div className="relative h-24 overflow-hidden border border-border">
      <div className="dither-static-field absolute inset-0" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between border-t border-border bg-background/80 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
        <span>active dither</span>
        <span>static</span>
      </div>
    </div>
  );
}

export function DitheringSection() {
  return (
    <Section
      index="8"
      title="Dithering — texture tests"
      accent="text-roy-b"
      cols={1}
      note="Five places to test dithering without letting it take over the page: the masthead ROYB bar, compact rails, link highlights, and one static active-state texture."
    >
      {ditherOptions.map((option) => (
        <Variant key={option.label} label={option.label} tag={option.tag}>
          <div className="grid gap-3">
            <DitherDemo kind={option.kind} />
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              {option.desc}
            </p>
          </div>
        </Variant>
      ))}
    </Section>
  );
}
