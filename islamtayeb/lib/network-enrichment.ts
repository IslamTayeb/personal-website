import { isIP } from 'node:net';

const IPINFO_LITE_BASE_URL = 'https://api.ipinfo.io/lite';
const DEFAULT_TIMEOUT_MS = 2_000;
const MAX_AS_NAME_LENGTH = 180;

export type NetworkEnrichment = {
  asn: string;
  asName: string;
  asDomain: string;
};

export const UNKNOWN_NETWORK_ENRICHMENT: NetworkEnrichment = Object.freeze({
  asn: 'unknown',
  asName: 'unknown',
  asDomain: 'unknown',
});

type ResolveNetworkEnrichmentOptions = {
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
  token?: string;
};

function compactValue(value: unknown, maxLength: number) {
  if (typeof value !== 'string') {
    return 'unknown';
  }

  const compacted = value.replace(/\s+/g, ' ').trim();

  if (!compacted || compacted.length > maxLength) {
    return 'unknown';
  }

  return compacted;
}

function normalizeAsn(value: unknown) {
  const asn = compactValue(value, 16).toUpperCase();

  return /^AS\d{1,12}$/.test(asn) ? asn : 'unknown';
}

function normalizeDomain(value: unknown) {
  const domain = compactValue(value, 253).toLowerCase();

  if (
    domain === 'unknown' ||
    !/^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(
      domain
    )
  ) {
    return 'unknown';
  }

  return domain;
}

export async function resolveNetworkEnrichment(
  clientIp: string,
  options: ResolveNetworkEnrichmentOptions = {}
): Promise<NetworkEnrichment> {
  if (isIP(clientIp) === 0) {
    return UNKNOWN_NETWORK_ENRICHMENT;
  }

  const token = (options.token ?? process.env.SITE_VISIT_IPINFO_TOKEN)?.trim();

  if (!token) {
    return UNKNOWN_NETWORK_ENRICHMENT;
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? DEFAULT_TIMEOUT_MS
  );

  try {
    const response = await (options.fetchImpl ?? fetch)(
      `${IPINFO_LITE_BASE_URL}/${encodeURIComponent(clientIp)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      return UNKNOWN_NETWORK_ENRICHMENT;
    }

    const payload = (await response.json()) as Record<string, unknown>;

    return {
      asn: normalizeAsn(payload.asn),
      asName: compactValue(payload.as_name, MAX_AS_NAME_LENGTH),
      asDomain: normalizeDomain(payload.as_domain),
    };
  } catch {
    return UNKNOWN_NETWORK_ENRICHMENT;
  } finally {
    clearTimeout(timeout);
  }
}

export function formatNetworkOrganization(network: NetworkEnrichment) {
  const asName = compactValue(network.asName, MAX_AS_NAME_LENGTH);
  const asn = normalizeAsn(network.asn);
  const asDomain = normalizeDomain(network.asDomain);
  const details = [asn, asDomain].filter((value) => value !== 'unknown');

  if (asName !== 'unknown') {
    return details.length > 0 ? `${asName} (${details.join(', ')})` : asName;
  }

  if (details.length === 0) {
    return 'unknown';
  }

  return details.length === 1 ? details[0] : `${details[0]} (${details[1]})`;
}
