import chokidar from 'chokidar';

import { buildSite } from '../src/build/build-site.mjs';

let queued = false;
let building = false;

async function rebuild(reason) {
  if (building) {
    queued = true;
    return;
  }

  building = true;

  try {
    await buildSite();
    console.log(`[apmoverflow] rebuilt (${reason})`);
  } catch (error) {
    console.error(`[apmoverflow] build failed (${reason})`);
    console.error(error.stack ?? error.message);
  } finally {
    building = false;

    if (queued) {
      queued = false;
      await rebuild('queued change');
    }
  }
}

await rebuild('startup');

chokidar
  .watch(['content/posts/**/*.{md,json}', 'src/**/*.mjs'], {
    ignoreInitial: true,
  })
  .on('all', (event, file) => {
    void rebuild(`${event} ${file}`);
  });
