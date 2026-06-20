import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import path from 'node:path';

const root = process.cwd();
const port = 3012;
const url = `http://localhost:${port}`;
const nextBin = path.join(root, 'node_modules', '.bin', 'next');

async function waitForServer() {
  const deadline = Date.now() + 45_000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        return;
      }
    } catch {
      // keep polling until the local Next server is ready
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for ${url}`);
}

const expectedText = [
  'Article / Blog primitives',
  'Index A — APM baseline',
  'Index B — grey field',
  'Index C — corner ticks',
  'Index D — compact rail',
  'Index E — dense ledger',
  'Headings A — strong H2 / mono H3',
  'Code A — default highlight',
  'Code B — ROYB syntax',
  'Code C — saturated default',
  'Table A — APM baseline',
  'Table B — alternating rows',
  'Table C — captioned table',
  'Table D — dense ledger',
  'References A — compact inline',
  'References B — muted bracket',
  'References C — side note line',
  'References D — APM ordered footnotes',
  'Media — APM caption baseline',
];

const server = spawn(nextBin, ['dev', '-p', String(port)], {
  cwd: root,
  stdio: 'ignore',
  env: {
    ...process.env,
    NEXT_TELEMETRY_DISABLED: '1',
  },
});

try {
  await waitForServer();

  const html = await (await fetch(url)).text();

  for (const text of expectedText) {
    assert.ok(html.includes(text), `article lab missing: ${text}`);
  }

  assert.ok(
    html.indexOf('Writing — continuous rail') <
      html.indexOf('Article / Blog primitives'),
    'article lab should be appended after existing lab sections'
  );

  console.log('article lab ok');
} finally {
  server.kill();
}
