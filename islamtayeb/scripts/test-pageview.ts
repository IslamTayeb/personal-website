import assert from 'node:assert/strict';
import {
  anonymizeClientIp,
  buildDiscordVisitPayload,
  buildVisitRequestContext,
  classifyBotSignal,
  normalizeVisitPayload,
  sendVisitWebhook,
  shouldAcceptVisitRequest,
  shouldSkipVisitRequest,
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
    'x-vercel-ip-postal-code': '27708',
    'x-vercel-ip-latitude': '35.9940',
    'x-vercel-ip-longitude': '-78.8986',
    'x-vercel-ip-timezone': 'America/New_York',
  })
);

assert.equal(context.clientIp, '203.0.113.41');
assert.equal(context.city, 'Durham');
assert.equal(context.postalCode, '27708');
assert.equal(anonymizeClientIp('203.0.113.41'), '203.0.113.0');

const discordPayload = buildDiscordVisitPayload(normalized, context);
const embed = discordPayload.embeds[0];

function fieldValue(payload: typeof discordPayload, name: string) {
  return (
    payload.embeds[0].fields.find((field) => field.name === name)?.value ?? ''
  );
}

assert.equal(discordPayload.allowed_mentions.parse.length, 0);
assert.equal(embed.title, '🔔 New site visitor');
assert.equal(
  embed.fields.some((field) => field.value.includes('@everyone')),
  false
);
assert.match(
  fieldValue(discordPayload, '📄 Page'),
  /\/blog\/frontier-benchmarking\?ref=test/,
  'Discord payload should include the visited page'
);
assert.match(
  fieldValue(discordPayload, '📍 Approx network location'),
  /Durham, North Carolina, United States/,
  'Discord payload should include Vercel location headers with US state names'
);
assert.match(
  fieldValue(discordPayload, '📍 Approx network location'),
  /Postal code: 27708/,
  'Discord payload should include Vercel postal code when present'
);
assert.match(
  fieldValue(discordPayload, '📍 Approx network location'),
  /Map: \[35\.9940, -78\.8986\]\(https:\/\/www\.google\.com\/maps\?q=35\.9940%2C%20-78\.8986\)/,
  'Discord payload should include a coordinates map link when present'
);
assert.match(fieldValue(discordPayload, '🌐 Network'), /IP: 203\.0\.113\.41/);
assert.match(fieldValue(discordPayload, '🌐 Network'), /UA: Test Browser/);
assert.match(fieldValue(discordPayload, '🤖 Bot signal'), /❓ Unknown/);
assert.match(fieldValue(discordPayload, '🤖 Bot signal'), /UA not recognized/);
assert.match(
  fieldValue(discordPayload, '📱 Device'),
  /Browser timezone: America\/New_York/
);
assert.match(fieldValue(discordPayload, '🧭 Visit'), /First seen client/);
assert.match(
  fieldValue(discordPayload, '↩️ Referrer'),
  /https:\/\/example\.com\/source/
);

const previousIncludeIp = process.env.SITE_VISIT_INCLUDE_CLIENT_IP;
const previousAnonymizeIp = process.env.SITE_VISIT_ANONYMIZE_CLIENT_IP;

process.env.SITE_VISIT_INCLUDE_CLIENT_IP = 'false';
assert.match(
  fieldValue(buildDiscordVisitPayload(normalized, context), '🌐 Network'),
  /IP: hidden/,
  'Discord payload should honor hidden IP configuration'
);

process.env.SITE_VISIT_INCLUDE_CLIENT_IP = 'true';
process.env.SITE_VISIT_ANONYMIZE_CLIENT_IP = 'true';
assert.match(
  fieldValue(buildDiscordVisitPayload(normalized, context), '🌐 Network'),
  /IP: 203\.0\.113\.0/,
  'Discord payload should honor anonymized IP configuration'
);

if (previousIncludeIp === undefined) {
  delete process.env.SITE_VISIT_INCLUDE_CLIENT_IP;
} else {
  process.env.SITE_VISIT_INCLUDE_CLIENT_IP = previousIncludeIp;
}

if (previousAnonymizeIp === undefined) {
  delete process.env.SITE_VISIT_ANONYMIZE_CLIENT_IP;
} else {
  process.env.SITE_VISIT_ANONYMIZE_CLIENT_IP = previousAnonymizeIp;
}

const previousRespectDnt = process.env.SITE_VISIT_RESPECT_DNT;
const previousSuppressedIps = process.env.SITE_VISIT_SUPPRESS_CLIENT_IPS;

process.env.SITE_VISIT_RESPECT_DNT = 'true';
assert.equal(
  shouldSkipVisitRequest(request({ dnt: '1' }), context.clientIp),
  true,
  'DNT should skip pageview webhook delivery when configured'
);
assert.equal(
  shouldSkipVisitRequest(request({ 'sec-gpc': '1' }), context.clientIp),
  true,
  'GPC should skip pageview webhook delivery when configured'
);

process.env.SITE_VISIT_RESPECT_DNT = 'false';
process.env.SITE_VISIT_SUPPRESS_CLIENT_IPS = '198.51.100,203.0.113';
assert.equal(
  shouldSkipVisitRequest(request({}), context.clientIp),
  true,
  'configured suppressed IP fragments should skip pageview webhook delivery'
);

process.env.SITE_VISIT_SUPPRESS_CLIENT_IPS = '198.51.100';
assert.equal(
  shouldSkipVisitRequest(request({}), context.clientIp),
  false,
  'non-matching suppressed IP fragments should not skip delivery'
);

if (previousRespectDnt === undefined) {
  delete process.env.SITE_VISIT_RESPECT_DNT;
} else {
  process.env.SITE_VISIT_RESPECT_DNT = previousRespectDnt;
}

if (previousSuppressedIps === undefined) {
  delete process.env.SITE_VISIT_SUPPRESS_CLIENT_IPS;
} else {
  process.env.SITE_VISIT_SUPPRESS_CLIENT_IPS = previousSuppressedIps;
}

const missingLocationPayload = buildDiscordVisitPayload(
  normalized,
  buildVisitRequestContext(request({ host: 'islamtayeb.dev' }))
);
const missingLocation =
  missingLocationPayload.embeds[0].fields.find(
    (field) => field.name === '📍 Approx network location'
  )?.value ?? '';

assert.match(missingLocation, /Location: unknown/);
assert.doesNotMatch(missingLocation, /Postal code:/);
assert.doesNotMatch(missingLocation, /Map:/);

const chromeUserAgent =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

assert.deepEqual(
  classifyBotSignal(normalized, { ...context, userAgent: chromeUserAgent }),
  {
    label: '✅ Likely human',
    evidence: 'browser beacon + normal UA',
  }
);
assert.deepEqual(
  classifyBotSignal(normalized, {
    ...context,
    userAgent:
      'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  }),
  {
    label: '🤖 Known bot',
    evidence: 'UA matched Googlebot',
  }
);
assert.deepEqual(
  classifyBotSignal(normalized, { ...context, userAgent: 'curl/8.7.1' }),
  {
    label: '⚠️ Likely automation',
    evidence: 'UA matched curl',
  }
);

const unknownPayload = normalizeVisitPayload({
  ...basePayload,
  clientId: 'unknown',
  sessionId: 'unknown',
  viewport: 'unknown',
  screen: 'unknown',
  timezone: 'unknown',
  language: 'unknown',
  reason: 'manual',
});

assert.ok(unknownPayload, 'unknown-ish pageview payload should normalize');
assert.deepEqual(
  classifyBotSignal(unknownPayload, { ...context, userAgent: 'unknown' }),
  {
    label: '⚠️ Likely automation',
    evidence: 'missing browser viewport/screen/language/timezone',
  }
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
