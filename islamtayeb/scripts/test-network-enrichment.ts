import assert from 'node:assert/strict';
import {
  formatNetworkOrganization,
  resolveNetworkEnrichment,
  UNKNOWN_NETWORK_ENRICHMENT,
} from '../lib/network-enrichment';

async function run() {
  let fetchCalls = 0;

  const complete = await resolveNetworkEnrichment('152.3.72.6', {
    token: 'test-token',
    fetchImpl: (async (url: string | URL | Request, init?: RequestInit) => {
      fetchCalls += 1;
      assert.equal(String(url), 'https://api.ipinfo.io/lite/152.3.72.6');
      assert.equal(
        new Headers(init?.headers).get('authorization'),
        'Bearer test-token'
      );

      return Response.json({
        asn: 'AS13371',
        as_name: 'Duke University',
        as_domain: 'duke.edu',
        country: 'United States',
        latitude: 'must be ignored',
      });
    }) as typeof fetch,
  });

  assert.deepEqual(complete, {
    asn: 'AS13371',
    asName: 'Duke University',
    asDomain: 'duke.edu',
  });
  assert.equal(
    formatNetworkOrganization(complete),
    'Duke University (AS13371, duke.edu)'
  );

  const partial = await resolveNetworkEnrichment('2001:db8::1', {
    token: 'test-token',
    fetchImpl: (async () =>
      Response.json({
        asn: 'not-an-asn',
        as_name: 'Example Network',
        as_domain: 'https://invalid.example',
      })) as typeof fetch,
  });

  assert.deepEqual(partial, {
    asn: 'unknown',
    asName: 'Example Network',
    asDomain: 'unknown',
  });
  assert.equal(formatNetworkOrganization(partial), 'Example Network');

  assert.deepEqual(
    await resolveNetworkEnrichment('not-an-ip', {
      token: 'test-token',
      fetchImpl: (async () => {
        fetchCalls += 1;
        throw new Error('invalid IP should not be fetched');
      }) as typeof fetch,
    }),
    UNKNOWN_NETWORK_ENRICHMENT
  );
  assert.equal(fetchCalls, 1, 'invalid IP addresses should not call IPinfo');

  const publicFallback = await resolveNetworkEnrichment('152.3.72.6', {
    token: '',
    fetchImpl: (async (url: string | URL | Request, init?: RequestInit) => {
      assert.equal(String(url), 'https://ipinfo.io/152.3.72.6/org');
      assert.equal(new Headers(init?.headers).get('accept'), 'text/plain');

      return new Response('AS13371 Duke University\n');
    }) as typeof fetch,
  });

  assert.deepEqual(publicFallback, {
    asn: 'AS13371',
    asName: 'Duke University',
    asDomain: 'unknown',
  });
  assert.equal(
    formatNetworkOrganization(publicFallback),
    'Duke University (AS13371)'
  );

  assert.deepEqual(
    await resolveNetworkEnrichment('203.0.113.8', {
      token: '',
      fetchImpl: (async () => new Response('malformed')) as typeof fetch,
    }),
    UNKNOWN_NETWORK_ENRICHMENT
  );

  assert.deepEqual(
    await resolveNetworkEnrichment('203.0.113.8', {
      token: '',
      fetchImpl: (async () =>
        new Response(null, { status: 429 })) as typeof fetch,
    }),
    UNKNOWN_NETWORK_ENRICHMENT
  );

  assert.deepEqual(
    await resolveNetworkEnrichment('203.0.113.8', {
      token: 'test-token',
      fetchImpl: (async () =>
        new Response(null, { status: 429 })) as typeof fetch,
    }),
    UNKNOWN_NETWORK_ENRICHMENT
  );

  assert.deepEqual(
    await resolveNetworkEnrichment('203.0.113.8', {
      token: 'test-token',
      timeoutMs: 5,
      fetchImpl: ((_: string | URL | Request, init?: RequestInit) =>
        new Promise<Response>((_, reject) => {
          init?.signal?.addEventListener('abort', () => {
            reject(new DOMException('aborted', 'AbortError'));
          });
        })) as typeof fetch,
    }),
    UNKNOWN_NETWORK_ENRICHMENT
  );

  assert.equal(
    formatNetworkOrganization(UNKNOWN_NETWORK_ENRICHMENT),
    'unknown'
  );
  assert.equal(
    formatNetworkOrganization({
      asn: 'AS64500',
      asName: 'unknown',
      asDomain: 'example.net',
    }),
    'AS64500 (example.net)'
  );

  console.log('network enrichment ok');
}

run().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
