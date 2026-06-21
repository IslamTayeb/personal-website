import type { ReactNode } from 'react';

export function RichText({ text }: { text: string }) {
  const parts = text.split(/(CO₂|CO2|porous organic polymers)/g);

  return (
    <>
      {parts.map((part, index): ReactNode => {
        if (part === 'CO₂' || part === 'CO2') {
          return (
            <span key={`${part}-${index}`}>
              CO
              <sub className="font-semibold">2</sub>
            </span>
          );
        }

        if (part === 'porous organic polymers') {
          return (
            <span key={`${part}-${index}`} className="whitespace-nowrap">
              {part}
            </span>
          );
        }

        return part;
      })}
    </>
  );
}
