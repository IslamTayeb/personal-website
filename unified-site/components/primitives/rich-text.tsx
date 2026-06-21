import type { ReactNode } from 'react';

export function RichText({ text }: { text: string }) {
  const parts = text.split(/(CO₂|CO2)/g);

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

        return part;
      })}
    </>
  );
}
