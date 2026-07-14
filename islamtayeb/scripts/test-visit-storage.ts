import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import {
  buildVisitStorageRecord,
  buildVisitStorageStatement,
  persistVisit,
  type VisitStorageExecutor,
  type VisitStorageInput,
} from '../lib/visit-storage';

const input: VisitStorageInput = {
  visit: {
    kind: 'pageview',
    eventId: 'event-1234567890',
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
  },
  context: {
    clientIp: '203.0.113.41',
    country: 'US',
    region: 'NC',
    city: 'Durham',
    postalCode: '27708',
    latitude: '35.9940',
    longitude: '-78.8986',
    timezone: 'America/New_York',
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    host: 'islamtayeb.dev',
    secFetchSite: 'same-origin',
    secFetchMode: 'cors',
    secFetchDest: 'empty',
  },
  network: {
    asn: 'AS13371',
    asName: 'Duke University',
    asDomain: 'duke.edu',
  },
  serverAt: '2026-06-23T12:00:01.000Z',
};

const record = buildVisitStorageRecord(input);

assert.equal(record.clientIp, '203.0.113.41');
assert.equal(record.latitude, 35.994);
assert.equal(record.longitude, -78.8986);
assert.equal(record.asn, 'AS13371');
assert.equal(record.asName, 'Duke University');
assert.equal(record.asDomain, 'duke.edu');
assert.equal(record.botLabel, '✅ Likely human');
assert.equal(record.clientAt, '2026-06-23T12:00:00.000Z');
assert.equal(record.serverAt, '2026-06-23T12:00:01.000Z');

const unknownRecord = buildVisitStorageRecord({
  ...input,
  context: {
    ...input.context,
    clientIp: 'not-an-ip',
    latitude: '91',
    longitude: 'unknown',
  },
  network: {
    asn: 'unknown',
    asName: 'unknown',
    asDomain: 'unknown',
  },
});

assert.equal(unknownRecord.clientIp, null);
assert.equal(unknownRecord.latitude, null);
assert.equal(unknownRecord.longitude, null);
assert.equal(unknownRecord.asn, null);
assert.equal(unknownRecord.asName, null);
assert.equal(unknownRecord.asDomain, null);

assert.throws(
  () => buildVisitStorageRecord({ ...input, serverAt: 'not-a-date' }),
  /serverAt must be a valid timestamp/
);

const statement = buildVisitStorageStatement(record);

assert.equal(statement.values.length, 33);
assert.equal(statement.values[0], input.visit.eventId);
assert.equal(statement.values[15], input.context.clientIp);
assert.doesNotMatch(statement.text, new RegExp(input.visit.clientId));
assert.match(statement.text, /ON CONFLICT \(event_id\) DO NOTHING/);
assert.match(statement.text, /FROM inserted_event/);
assert.match(
  statement.text,
  /pageview_count = visitor_profiles\.pageview_count \+ 1/
);
assert.match(statement.text, /first_seen_at = LEAST/);
assert.match(statement.text, /last_seen_at = GREATEST/);

const migration = readFileSync(
  path.resolve('db/migrations/0001_private_visit_history.sql'),
  'utf8'
);

assert.match(migration, /CREATE TABLE visitor_profiles/);
assert.match(migration, /CREATE TABLE pageview_events/);
assert.match(migration, /client_ip inet/);
assert.match(migration, /server_at timestamptz NOT NULL/);
assert.match(migration, /latitude numeric\(9, 6\)/);
assert.match(migration, /pageview_events_client_server_at_idx/);
assert.match(migration, /pageview_events_location_idx/);
assert.match(migration, /pageview_events_coordinates_idx/);

async function testIdempotentExecutor() {
  const eventIds = new Set<string>();
  const pageviewCounts = new Map<string, number>();
  const statements: string[] = [];

  const executor: VisitStorageExecutor = async (query) => {
    statements.push(query.text);

    const eventId = String(query.values[0]);
    const clientId = String(query.values[2]);
    const inserted = !eventIds.has(eventId);

    if (inserted) {
      eventIds.add(eventId);
      pageviewCounts.set(clientId, (pageviewCounts.get(clientId) ?? 0) + 1);
    }

    return {
      rows: [
        {
          inserted,
          pageview_count: String(pageviewCounts.get(clientId) ?? 0),
        },
      ],
    };
  };

  const first = await persistVisit(input, executor);
  const duplicate = await persistVisit(input, executor);
  const next = await persistVisit(
    {
      ...input,
      visit: {
        ...input.visit,
        eventId: 'event-0987654321',
        firstVisit: false,
      },
    },
    executor
  );

  assert.deepEqual(first, { inserted: true, pageviewCount: 1 });
  assert.deepEqual(duplicate, { inserted: false, pageviewCount: 1 });
  assert.deepEqual(next, { inserted: true, pageviewCount: 2 });
  assert.equal(eventIds.size, 2);
  assert.equal(pageviewCounts.get(input.visit.clientId), 2);
  assert.equal(statements.length, 3);
}

async function testMissingDatabaseUrlFailsLoudly() {
  const previousDatabaseUrl = process.env.DATABASE_URL;

  delete process.env.DATABASE_URL;

  try {
    await assert.rejects(
      () => persistVisit(input),
      /DATABASE_URL is required to persist private pageview history/
    );
  } finally {
    if (previousDatabaseUrl === undefined) {
      delete process.env.DATABASE_URL;
    } else {
      process.env.DATABASE_URL = previousDatabaseUrl;
    }
  }
}

Promise.all([testIdempotentExecutor(), testMissingDatabaseUrlFailsLoudly()])
  .then(() => {
    console.log('visit storage ok');
  })
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
