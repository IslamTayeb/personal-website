import { after } from 'next/server';
import {
  buildVisitRequestContext,
  normalizeVisitPayload,
  sendVisitWebhook,
  shouldAcceptVisitRequest,
  shouldSkipVisitRequest,
} from '@/lib/visit-events';

export const runtime = 'nodejs';

const noStoreHeaders = {
  'Cache-Control': 'no-store',
};

export async function POST(request: Request) {
  if (process.env.SITE_VISIT_EVENTS_ENABLED === 'false') {
    return new Response(null, { status: 204, headers: noStoreHeaders });
  }

  if (!shouldAcceptVisitRequest(request)) {
    return new Response(null, { status: 403, headers: noStoreHeaders });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return new Response(null, { status: 400, headers: noStoreHeaders });
  }

  const visit = normalizeVisitPayload(body);

  if (!visit) {
    return new Response(null, { status: 400, headers: noStoreHeaders });
  }

  const context = buildVisitRequestContext(request);

  if (shouldSkipVisitRequest(request, context.clientIp)) {
    return new Response(null, { status: 204, headers: noStoreHeaders });
  }

  after(async () => {
    try {
      await sendVisitWebhook(visit, context);
    } catch (error) {
      console.error('Failed to send pageview event.', error);
    }
  });

  return new Response(null, { status: 204, headers: noStoreHeaders });
}
