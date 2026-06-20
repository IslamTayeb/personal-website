type GlyphProps = {
  size?: number;
  className?: string;
};

// ☾ — crescent, drawn as a boolean-subtracted disc so it stays crisp at any size.
export function MoonGlyph({ size = 16, className = '' }: GlyphProps) {
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
        d="M11.2 12.6A5.4 5.4 0 0 1 6.1 3.4a5.4 5.4 0 1 0 5.1 9.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

// ⊞ — squared plus. Hand-built so the plus is perfectly centered in the box,
// which is the exact thing the unicode glyph gets wrong.
export function SquaredPlusGlyph({ size = 16, className = '' }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect
        x="1.5"
        y="1.5"
        width="13"
        height="13"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M8 4.5v7M4.5 8h7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}
