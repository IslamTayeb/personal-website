export type MoonVariant =
  | 'heavy-cut'
  | 'sickle'
  | 'compact'
  | 'round-cut'
  | 'open'
  | 'half'
  | 'angle'
  | 'dot-cut';

type GlyphProps = {
  size?: number;
  className?: string;
};

type MoonGlyphProps = GlyphProps & {
  variant?: MoonVariant;
};

const cutout = 'var(--background)';

// Crescent candidates. The default is intentionally thicker than a text glyph
// and no longer tries to share the square grammar of the blog icon.
export function MoonGlyph({
  size = 16,
  className = '',
  variant = 'heavy-cut',
}: MoonGlyphProps) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 16 16',
    fill: 'none',
    'aria-hidden': true,
    className,
  };

  if (variant === 'sickle') {
    return (
      <svg {...common}>
        <path
          d="M11.9 12.9A6.1 6.1 0 0 1 7.2 2.2a5.3 5.3 0 1 0 4.7 10.7Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (variant === 'compact') {
    return (
      <svg {...common}>
        <path
          d="M11.1 11.6A4.8 4.8 0 0 1 7.7 3.1a4.6 4.6 0 1 0 3.4 8.5Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (variant === 'round-cut') {
    return (
      <svg {...common}>
        <circle cx="7.4" cy="8" r="5.4" fill="currentColor" />
        <circle cx="10" cy="6.7" r="4.8" fill={cutout} />
      </svg>
    );
  }

  if (variant === 'open') {
    return (
      <svg {...common}>
        <path
          d="M11.3 12.3A5.6 5.6 0 0 1 11.3 3.7"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="square"
        />
      </svg>
    );
  }

  if (variant === 'half') {
    return (
      <svg {...common}>
        <path d="M8 2.4a5.6 5.6 0 0 0 0 11.2V2.4Z" fill="currentColor" />
      </svg>
    );
  }

  if (variant === 'angle') {
    return (
      <svg {...common}>
        <path
          d="M11.7 13H8.9L5.3 10.9 4.1 8 5.3 5.1 8.9 3h2.8A5.4 5.4 0 1 0 11.7 13Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (variant === 'dot-cut') {
    return (
      <svg {...common}>
        <circle cx="7.8" cy="8" r="5.2" fill="currentColor" />
        <circle cx="10.4" cy="6.7" r="4.2" fill={cutout} />
        <circle cx="5.1" cy="11.2" r="0.9" fill={cutout} />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <circle cx="7.4" cy="8" r="5.6" fill="currentColor" />
      <circle cx="10.4" cy="6.8" r="4.7" fill={cutout} />
    </svg>
  );
}

// Single large sparkle, drawn instead of using the multi-sparkle emoji.
export function SparkleGlyph({ size = 16, className = '' }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M8 1.8 9.7 6.3 14.2 8 9.7 9.7 8 14.2 6.3 9.7 1.8 8 6.3 6.3 8 1.8Z"
        fill="currentColor"
      />
    </svg>
  );
}
