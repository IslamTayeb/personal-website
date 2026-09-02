import { isIP } from 'node:net';

const IPINFO_LITE_BASE_URL = 'https://api.ipinfo.io/lite';
const IPINFO_PUBLIC_BASE_URL = 'https://ipinfo.io';
const DEFAULT_TIMEOUT_MS = 2_000;
const MAX_AS_NAME_LENGTH = 180;

export const UNKNOWN = 'unknown';

export type NetworkEnrichment = {
  asn: string;
  asName: string;
  asDomain: string;
};

export const UNKNOWN_NETWORK_ENRICHMENT: NetworkEnrichment = Object.freeze({
  asn: UNKNOWN,
  asName: UNKNOWN,
  asDomain: UNKNOWN,
});

type ResolveNetworkEnrichmentOptions = {
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
  token?: string;
};

export function configuredValue(value: string | undefined) {
  const trimmed = value?.trim();

  return trimmed ? trimmed : undefined;
}

function compactValue(value: unknown, maxLength: number) {
  if (typeof value !== 'string') {
    return UNKNOWN;
  }

  const compacted = value.replace(/\s+/g, ' ').trim();

  if (!compacted || compacted.length > maxLength) {
    return UNKNOWN;
  }

  return compacted;
}

function normalizeAsn(value: unknown) {
  const asn = compactValue(value, 16).toUpperCase();

  return /^AS\d{1,12}$/.test(asn) ? asn : UNKNOWN;
}

function normalizeDomain(value: unknown) {
  const domain = compactValue(value, 253).toLowerCase();

  if (
    domain === UNKNOWN ||
    !/^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(
      domain
    )
  ) {
    return UNKNOWN;
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

  const token = configuredValue(
    options.token ?? process.env.SITE_VISIT_IPINFO_TOKEN
  );
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? DEFAULT_TIMEOUT_MS
  );

  try {
    const fetchImpl = options.fetchImpl ?? fetch;

    if (token) {
      const response = await fetchImpl(
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
    }

    const response = await fetchImpl(
      `${IPINFO_PUBLIC_BASE_URL}/${encodeURIComponent(clientIp)}/org`,
      {
        headers: {
          Accept: 'text/plain',
        },
        cache: 'no-store',
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      return UNKNOWN_NETWORK_ENRICHMENT;
    }

    const publicOrganization = compactValue(
      await response.text(),
      MAX_AS_NAME_LENGTH + 20
    );
    const match = /^(AS\d{1,12})\s+(.{1,180})$/i.exec(publicOrganization);

    if (!match) {
      return UNKNOWN_NETWORK_ENRICHMENT;
    }

    return {
      asn: normalizeAsn(match[1]),
      asName: compactValue(match[2], MAX_AS_NAME_LENGTH),
      asDomain: UNKNOWN,
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
  const details = [asn, asDomain].filter((value) => value !== UNKNOWN);

  if (asName !== UNKNOWN) {
    return details.length > 0 ? `${asName} (${details.join(', ')})` : asName;
  }

  if (details.length === 0) {
    return UNKNOWN;
  }

  return details.length === 1 ? details[0] : `${details[0]} (${details[1]})`;
}
