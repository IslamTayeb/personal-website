import assert from 'node:assert/strict';

import {
  UNKNOWN_NETWORK_ENRICHMENT,
  type NetworkEnrichment,
} from '../lib/network-enrichment';
import type {
  ClientVisitPayload,
  VisitRequestContext,
} from '../lib/visit-events';
import { processVisitEvent } from '../lib/visit-processing';

const visit: ClientVisitPayload = {
  kind: 'pageview',
  eventId: 'event-1234567890',
  path: '/blog/frontier-benchmarking',
  title: 'Frontier Benchmarking',
  referrer: 'direct',
  clientId: 'client-1234567890',
  sessionId: 'session-1234567890',
  firstVisit: true,
  viewport: '390x844',
  screen: '390x844',
  timezone: 'America/New_York',
  language: 'en-US',
  reason: 'load',
  at: '2026-06-23T12:00:00.000Z',
};

const context: VisitRequestContext = {
  clientIp: '203.0.113.41',
  country: 'US',
  region: 'NC',
  city: 'Durham',
  postalCode: '27708',
  latitude: '35.9940',
  longitude: '-78.8986',
  timezone: 'America/New_York',
  userAgent: 'Test Browser',
  host: 'imt.sh',
  secFetchSite: 'same-origin',
  secFetchMode: 'cors',
  secFetchDest: 'empty',
};

const enrichedNetwork: NetworkEnrichment = {
  asn: 'AS13371',
  asName: 'Duke University',
  asDomain: 'duke.edu',
};

async function run() {
  const errors: string[] = [];
  let persistedNetwork: NetworkEnrichment | undefined;
  let webhookNetwork: NetworkEnrichment | undefined;

  const persistenceFailure = await processVisitEvent(visit, context, {
    serverAt: '2026-06-23T12:00:01.000Z',
    dependencies: {
      resolveNetwork: async () => enrichedNetwork,
      persist: async (input) => {
        persistedNetwork = input.network;
        assert.equal(input.serverAt, '2026-06-23T12:00:01.000Z');
        throw new Error('database unavailable');
      },
      sendWebhook: async (_visit, _context, network) => {
        webhookNetwork = network;
      },
      reportError: (message) => errors.push(message),
    },
  });

  assert.equal(persistenceFailure.persistence.status, 'rejected');
  assert.equal(persistenceFailure.webhook.status, 'fulfilled');
  assert.deepEqual(persistedNetwork, enrichedNetwork);
  assert.deepEqual(webhookNetwork, enrichedNetwork);
  assert.deepEqual(errors, ['Failed to persist private pageview history.']);

  errors.length = 0;
  let persistenceCalls = 0;
  let webhookCalls = 0;

  const webhookFailure = await processVisitEvent(visit, context, {
    dependencies: {
      resolveNetwork: async () => {
        throw new Error('enrichment unavailable');
      },
      persist: async (input) => {
        persistenceCalls += 1;
        assert.deepEqual(input.network, UNKNOWN_NETWORK_ENRICHMENT);
        return { inserted: true, pageviewCount: 1 };
      },
      sendWebhook: async (_visit, _context, network) => {
        webhookCalls += 1;
        assert.deepEqual(network, UNKNOWN_NETWORK_ENRICHMENT);
        throw new Error('webhook unavailable');
      },
      reportError: (message) => errors.push(message),
    },
  });

  assert.equal(webhookFailure.persistence.status, 'fulfilled');
  assert.equal(webhookFailure.webhook.status, 'rejected');
  assert.equal(persistenceCalls, 1);
  assert.equal(webhookCalls, 1);
  assert.deepEqual(errors, [
    'Failed to resolve pageview network ownership.',
    'Failed to send pageview event.',
  ]);

  console.log('visit processing ok');
}

run().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
