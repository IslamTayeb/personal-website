const MAX_FIELD_LENGTH = 900;
const MAX_TITLE_LENGTH = 180;
const MAX_PATH_LENGTH = 240;
const LOCAL_CLIENT_IP = '127.0.0.1';

export type ClientVisitPayload = {
  kind: 'pageview';
  path: string;
  title: string;
  referrer: string;
  clientId: string;
  sessionId: string;
  firstVisit: boolean;
  viewport: string;
  screen: string;
  timezone: string;
  language: string;
  reason: string;
  at: string;
};

export type VisitRequestContext = {
  clientIp: string;
  country: string;
  region: string;
  city: string;
  latitude: string;
  longitude: string;
  timezone: string;
  userAgent: string;
  host: string;
};

type DiscordField = {
  name: string;
  value: string;
  inline?: boolean;
};

type DiscordEmbed = {
  title: string;
  description: string;
  color: number;
  fields: DiscordField[];
  timestamp: string;
  footer: {
    text: string;
  };
};

export type DiscordWebhookPayload = {
  embeds: DiscordEmbed[];
  allowed_mentions: {
    parse: [];
  };
};

const legacyWebhookEnvName = ['DISCORD', 'WEBHOOK', 'URL'].join('_');

function asString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

function asBoolean(value: unknown) {
  return value === true;
}

function compactWhitespace(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

function limit(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1)}...`;
}

function safeDiscordText(
  value: string,
  maxLength = MAX_FIELD_LENGTH,
  fallback = 'unknown'
) {
  const text = compactWhitespace(value).replaceAll('@', '@\u200b');

  return limit(text || fallback, maxLength);
}

function safePath(value: unknown) {
  const path = compactWhitespace(asString(value, '/'));

  if (!path.startsWith('/')) {
    return '/';
  }

  return limit(path, MAX_PATH_LENGTH);
}

function safeIsoDate(value: unknown) {
  const date = new Date(asString(value));

  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }

  return date.toISOString();
}

function readHeader(request: Request, name: string) {
  return request.headers.get(name) ?? '';
}

function configuredValue(value: string | undefined) {
  const trimmed = value?.trim();

  return trimmed ? trimmed : undefined;
}

function decodeHeaderValue(value: string) {
  if (!value) {
    return 'unknown';
  }

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function readClientIp(request: Request) {
  const forwarded = readHeader(request, 'x-forwarded-for');

  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || LOCAL_CLIENT_IP;
  }

  return readHeader(request, 'x-real-ip') || LOCAL_CLIENT_IP;
}

export function anonymizeClientIp(clientIp: string) {
  if (clientIp.includes(':')) {
    return `${clientIp.split(':').slice(0, 3).join(':')}::`;
  }

  const parts = clientIp.split('.');

  if (parts.length !== 4) {
    return clientIp;
  }

  return `${parts.slice(0, 3).join('.')}.0`;
}

export function buildVisitRequestContext(
  request: Request
): VisitRequestContext {
  return {
    clientIp: readClientIp(request),
    country: readHeader(request, 'x-vercel-ip-country') || 'unknown',
    region:
      readHeader(request, 'x-vercel-ip-country-region') ||
      readHeader(request, 'x-vercel-ip-region') ||
      'unknown',
    city: decodeHeaderValue(readHeader(request, 'x-vercel-ip-city')),
    latitude: readHeader(request, 'x-vercel-ip-latitude') || 'unknown',
    longitude: readHeader(request, 'x-vercel-ip-longitude') || 'unknown',
    timezone: readHeader(request, 'x-vercel-ip-timezone') || 'unknown',
    userAgent: readHeader(request, 'user-agent') || 'unknown',
    host: readHeader(request, 'host') || 'unknown',
  };
}

export function normalizeVisitPayload(input: unknown) {
  if (!input || typeof input !== 'object') {
    return null;
  }

  const candidate = input as Record<string, unknown>;

  if (candidate.kind !== 'pageview') {
    return null;
  }

  return {
    kind: 'pageview',
    path: safePath(candidate.path),
    title: safeDiscordText(
      asString(candidate.title, 'Untitled'),
      MAX_TITLE_LENGTH,
      'Untitled'
    ),
    referrer: safeDiscordText(
      asString(candidate.referrer, 'direct'),
      undefined,
      'direct'
    ),
    clientId: safeDiscordText(asString(candidate.clientId, 'unknown'), 80),
    sessionId: safeDiscordText(asString(candidate.sessionId, 'unknown'), 80),
    firstVisit: asBoolean(candidate.firstVisit),
    viewport: safeDiscordText(asString(candidate.viewport, 'unknown'), 40),
    screen: safeDiscordText(asString(candidate.screen, 'unknown'), 40),
    timezone: safeDiscordText(asString(candidate.timezone, 'unknown'), 80),
    language: safeDiscordText(asString(candidate.language, 'unknown'), 40),
    reason: safeDiscordText(asString(candidate.reason, 'load'), 40),
    at: safeIsoDate(candidate.at),
  } satisfies ClientVisitPayload;
}

export function shouldAcceptVisitRequest(request: Request) {
  const site = readHeader(request, 'sec-fetch-site');

  if (site && site !== 'same-origin' && site !== 'none') {
    return false;
  }

  const origin = readHeader(request, 'origin');
  const host = readHeader(request, 'host');

  if (!origin || !host) {
    return true;
  }

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function shouldSkipVisitRequest(request: Request, clientIp: string) {
  if (
    process.env.SITE_VISIT_RESPECT_DNT === 'true' &&
    (readHeader(request, 'dnt') === '1' ||
      readHeader(request, 'sec-gpc') === '1')
  ) {
    return true;
  }

  const suppressedIps =
    process.env.SITE_VISIT_SUPPRESS_CLIENT_IPS?.split(',')
      .map((value) => value.trim())
      .filter(Boolean) ?? [];

  return suppressedIps.some((suppressedIp) => clientIp.includes(suppressedIp));
}

export function buildDiscordVisitPayload(
  visit: ClientVisitPayload,
  context: VisitRequestContext
): DiscordWebhookPayload {
  const shouldIncludeClientIp =
    process.env.SITE_VISIT_INCLUDE_CLIENT_IP !== 'false';
  const displayedClientIp =
    process.env.SITE_VISIT_ANONYMIZE_CLIENT_IP === 'true'
      ? anonymizeClientIp(context.clientIp)
      : context.clientIp;
  const location = [context.city, context.region, context.country].filter(
    (part) => part && part !== 'unknown'
  );

  const fields: DiscordField[] = [
    {
      name: 'Page',
      value: `/${visit.path.replace(/^\/+/, '')}`,
      inline: false,
    },
    {
      name: 'Location',
      value: safeDiscordText(
        location.length > 0 ? location.join(', ') : 'unknown'
      ),
      inline: true,
    },
    {
      name: 'Coordinates',
      value: safeDiscordText(`${context.latitude}, ${context.longitude}`),
      inline: true,
    },
    {
      name: 'Client',
      value: safeDiscordText(
        [
          visit.firstVisit ? 'first seen' : 'returning',
          `client ${visit.clientId.slice(0, 12)}`,
          `session ${visit.sessionId.slice(0, 12)}`,
        ].join(' | ')
      ),
      inline: false,
    },
    {
      name: 'Device',
      value: safeDiscordText(
        [
          `viewport ${visit.viewport}`,
          `screen ${visit.screen}`,
          `language ${visit.language}`,
          `timezone ${visit.timezone}`,
        ].join(' | ')
      ),
      inline: false,
    },
    {
      name: 'Referrer',
      value: visit.referrer || 'direct',
      inline: false,
    },
    {
      name: 'User agent',
      value: safeDiscordText(context.userAgent),
      inline: false,
    },
  ];

  if (shouldIncludeClientIp) {
    fields.splice(2, 0, {
      name: 'Client IP',
      value: safeDiscordText(displayedClientIp),
      inline: true,
    });
  }

  return {
    embeds: [
      {
        title: visit.firstVisit ? 'New site visitor' : 'Site pageview',
        description: safeDiscordText(visit.title, MAX_TITLE_LENGTH),
        color: visit.firstVisit ? 0xee3a43 : 0x2f80ed,
        fields,
        timestamp: visit.at,
        footer: {
          text: safeDiscordText(
            `host ${context.host} | reason ${visit.reason}`,
            180
          ),
        },
      },
    ],
    allowed_mentions: {
      parse: [],
    },
  };
}

export async function sendVisitWebhook(
  visit: ClientVisitPayload,
  context: VisitRequestContext
) {
  const webhookUrl =
    configuredValue(process.env.SITE_VISIT_WEBHOOK_URL) ??
    configuredValue(process.env[legacyWebhookEnvName]);

  if (!webhookUrl) {
    console.warn('No pageview webhook URL is configured; pageview not sent.');
    return;
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(buildDiscordVisitPayload(visit, context)),
  });

  if (!response.ok) {
    throw new Error(`Visit webhook failed with HTTP ${response.status}`);
  }

  if (visit.reason.startsWith('codex-validation')) {
    console.log(
      `Pageview webhook validation succeeded for ${visit.path} with HTTP ${response.status}.`
    );
  }
}
