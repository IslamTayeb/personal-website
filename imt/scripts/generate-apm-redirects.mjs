import { readFileSync, writeFileSync } from 'node:fs';
import {
  apmRedirectPairs,
  apmShellConfigPath,
  renderApmShellConfig,
} from '../lib/apm-redirects.mjs';

const existingText = readFileSync(apmShellConfigPath, 'utf8');

writeFileSync(apmShellConfigPath, renderApmShellConfig(existingText));
console.log(
  `wrote apmoverflow/vercel.json (${apmRedirectPairs().length} redirects)`
);
