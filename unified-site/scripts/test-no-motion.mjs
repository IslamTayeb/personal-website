import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const scannedDirs = ['app', 'components', 'data', 'lib'];
const blocked = [
  'transition',
  'animate',
  'framer-motion',
  'react-spring',
  'ResizeObserver',
  'getBoundingClientRect',
  'requestAnimationFrame',
  'useEffect',
  'useLayoutEffect',
  'useSyncExternalStore',
  'canvas',
  'dither',
];
const extensions = new Set(['.ts', '.tsx', '.css']);
const issues = [];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await walk(fullPath);
      continue;
    }

    if (!extensions.has(path.extname(entry.name))) {
      continue;
    }

    const text = await readFile(fullPath, 'utf8');
    const relative = path.relative(root, fullPath);

    for (const token of blocked) {
      if (text.includes(token)) {
        issues.push(`${relative}: contains "${token}"`);
      }
    }
  }
}

for (const dir of scannedDirs) {
  await walk(path.join(root, dir));
}

if (issues.length > 0) {
  throw new Error(`No-motion check failed:\n${issues.join('\n')}`);
}

console.log('no-motion ok');
