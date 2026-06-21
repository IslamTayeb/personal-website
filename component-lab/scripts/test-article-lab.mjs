import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import path from 'node:path';

const root = process.cwd();
const port = 3012;
let url = `http://localhost:${port}`;
const existingUrl = process.env.ARTICLE_LAB_BASE_URL ?? 'http://localhost:3001';
const nextBin = path.join(root, 'node_modules', '.bin', 'next');

async function isServerReady(targetUrl) {
  try {
    const response = await fetch(targetUrl);

    return response.ok;
  } catch {
    return false;
  }
}

async function waitForServer(targetUrl) {
  const deadline = Date.now() + 90_000;

  while (Date.now() < deadline) {
    if (await isServerReady(targetUrl)) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for ${targetUrl}`);
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
  'Experience icon lab',
  'A — row icon column',
  'B — company icon column',
  'Tokenminning and codegen correctness for agents with runtime-error repair feedback loops.',
];

const useExistingServer = await isServerReady(existingUrl);
const server = useExistingServer
  ? null
  : spawn(nextBin, ['dev', '-p', String(port)], {
      cwd: root,
      stdio: 'ignore',
      env: {
        ...process.env,
        NEXT_TELEMETRY_DISABLED: '1',
      },
    });

if (useExistingServer) {
  url = existingUrl;
}

try {
  await waitForServer(url);

  const html = await (await fetch(url)).text();

  for (const text of expectedText) {
    assert.ok(html.includes(text), `article lab missing: ${text}`);
  }

  assert.ok(
    html.indexOf('Writing — continuous rail') <
      html.indexOf('Article / Blog primitives'),
    'article lab should be appended after existing lab sections'
  );
  assert.ok(
    html.indexOf('Layout diagnosis') < html.indexOf('Experience icon lab'),
    'experience icon lab should come after layout diagnosis'
  );

  console.log('article lab ok');
} finally {
  server?.kill();
}
