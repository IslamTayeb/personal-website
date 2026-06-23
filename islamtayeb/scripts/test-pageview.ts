import assert from 'node:assert/strict';
import {
  anonymizeClientIp,
  buildDiscordVisitPayload,
  buildVisitRequestContext,
  normalizeVisitPayload,
  sendVisitWebhook,
  shouldAcceptVisitRequest,
} from '../lib/visit-events';

const basePayload = {
  kind: 'pageview',
  path: '/blog/frontier-benchmarking?ref=test',
  title: 'Frontier Benchmarking',
  referrer: 'https://example.com/source',
  clientId: 'client-1234567890',
  sessionId: 'session-1234567890',
  firstVisit: true,
  viewport: '390x844',
  screen: '390x844',
  timezone: 'America/New_York',
  language: 'en-US',
  reason: 'pushState',
  at: '2026-06-23T12:00:00.000Z',
};

function request(headers: HeadersInit) {
  return new Request('https://islamtayeb.dev/api/pageview', {
    method: 'POST',
    headers,
  });
}

const normalizedPayload = normalizeVisitPayload(basePayload);

assert.ok(normalizedPayload, 'valid pageview payload should normalize');

const normalized = normalizedPayload;
assert.equal(normalized.path, '/blog/frontier-benchmarking?ref=test');
assert.equal(normalized.firstVisit, true);

assert.equal(
  normalizeVisitPayload({ ...basePayload, kind: 'click' }),
  null,
  'unexpected event kinds should be rejected'
);
assert.equal(
  normalizeVisitPayload({ ...basePayload, path: 'https://evil.example/path' })
    ?.path,
  '/',
  'paths should stay site-local'
);

assert.equal(
  shouldAcceptVisitRequest(
    request({
      host: 'islamtayeb.dev',
      origin: 'https://islamtayeb.dev',
      'sec-fetch-site': 'same-origin',
    })
  ),
  true
);
assert.equal(
  shouldAcceptVisitRequest(
    request({
      host: 'islamtayeb.dev',
      origin: 'https://not-islamtayeb.dev',
      'sec-fetch-site': 'cross-site',
    })
  ),
  false
);

const context = buildVisitRequestContext(
  request({
    host: 'islamtayeb.dev',
    'user-agent': 'Test Browser @everyone',
    'x-forwarded-for': '203.0.113.41, 10.0.0.2',
    'x-vercel-ip-country': 'US',
    'x-vercel-ip-country-region': 'NC',
    'x-vercel-ip-city': 'Durham',
    'x-vercel-ip-latitude': '35.9940',
    'x-vercel-ip-longitude': '-78.8986',
    'x-vercel-ip-timezone': 'America/New_York',
  })
);

assert.equal(context.clientIp, '203.0.113.41');
assert.equal(context.city, 'Durham');
assert.equal(anonymizeClientIp('203.0.113.41'), '203.0.113.0');

const discordPayload = buildDiscordVisitPayload(normalized, context);
const embed = discordPayload.embeds[0];

assert.equal(discordPayload.allowed_mentions.parse.length, 0);
assert.equal(embed.title, 'New site visitor');
assert.equal(
  embed.fields.some((field) => field.value.includes('@everyone')),
  false
);
assert.ok(
  embed.fields.some(
    (field) => field.name === 'Page' && field.value.includes('/blog/')
  ),
  'Discord payload should include the visited page'
);
assert.ok(
  embed.fields.some(
    (field) => field.name === 'Location' && field.value.includes('Durham')
  ),
  'Discord payload should include Vercel location headers'
);

async function assertWebhookFallback() {
  const previousSiteWebhookUrl = process.env.SITE_VISIT_WEBHOOK_URL;
  const previousDiscordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
  const previousFetch = globalThis.fetch;
  const webhookCalls: string[] = [];

  globalThis.fetch = (async (url: string | URL | Request) => {
    webhookCalls.push(String(url));

    return new Response(null, { status: 204 });
  }) as typeof fetch;

  process.env.DISCORD_WEBHOOK_URL = 'https://discord.example/webhook';

  delete process.env.SITE_VISIT_WEBHOOK_URL;
  await sendVisitWebhook(
    { ...normalized, reason: 'codex-validation-local' },
    context
  );

  process.env.SITE_VISIT_WEBHOOK_URL = '';
  await sendVisitWebhook(
    { ...normalized, reason: 'codex-validation-empty-primary' },
    context
  );

  assert.deepEqual(webhookCalls, [
    'https://discord.example/webhook',
    'https://discord.example/webhook',
  ]);

  if (previousSiteWebhookUrl === undefined) {
    delete process.env.SITE_VISIT_WEBHOOK_URL;
  } else {
    process.env.SITE_VISIT_WEBHOOK_URL = previousSiteWebhookUrl;
  }

  if (previousDiscordWebhookUrl === undefined) {
    delete process.env.DISCORD_WEBHOOK_URL;
  } else {
    process.env.DISCORD_WEBHOOK_URL = previousDiscordWebhookUrl;
  }

  globalThis.fetch = previousFetch;
}

assertWebhookFallback()
  .then(() => {
    console.log('pageview ok');
  })
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
