import React from 'react';
import { Section } from './Misc/Section';
import { Copyright, CopyrightIcon, Heart } from 'lucide-react';
import { Code, DefaultIcon } from './sharedComponents';
import { HeartFilledIcon } from '@radix-ui/react-icons';

export const Footer = () => {
  return (
    <footer className="bg-card border-border border-t border-dashed">
      <div className="py-3.5 text-muted-foreground text-sm flex gap-x-1 max-w-3xl m-auto px-4">
        <span className="">
          Last Updated 12/11/2025
        </span>
        <div className="ml-auto text-right max-[375px]:hidden">
          Made with <HeartFilledIcon className="inline -mt-1" width={11.5} /> in{' '}
          <span className="font-semibold">Durham, NC</span>
        </div>
      </div>
    </footer>
  );
};
