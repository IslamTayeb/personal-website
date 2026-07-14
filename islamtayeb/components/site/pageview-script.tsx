import Script from 'next/script';

const endpoint = '/api/pageview';

const pageviewScript = `
(function () {
  var endpoint = ${JSON.stringify(endpoint)};
  var clientKey = 'site_visit_client_id';
  var sessionKey = 'site_visit_session_id';
  var lastPath = '';
  var firstVisit = false;

  function randomId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }

    return String(Date.now()) + '-' + Math.random().toString(16).slice(2);
  }

  function storedId(storage, key) {
    try {
      var existing = storage.getItem(key);

      if (existing) {
        return existing;
      }

      var next = randomId();
      storage.setItem(key, next);

      if (key === clientKey) {
        firstVisit = true;
      }

      return next;
    } catch (_) {
      return randomId();
    }
  }

  function size(width, height) {
    return Math.round(width) + 'x' + Math.round(height);
  }

  function payload(reason) {
    var clientId = storedId(window.localStorage, clientKey);
    var sessionId = storedId(window.sessionStorage, sessionKey);

    return {
      kind: 'pageview',
      eventId: randomId(),
      path: window.location.pathname + window.location.search,
      title: document.title || 'Untitled',
      referrer: document.referrer || 'direct',
      clientId: clientId,
      sessionId: sessionId,
      firstVisit: firstVisit,
      viewport: size(window.innerWidth || 0, window.innerHeight || 0),
      screen: size(window.screen ? window.screen.width : 0, window.screen ? window.screen.height : 0),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown',
      language: navigator.language || 'unknown',
      reason: reason,
      at: new Date().toISOString()
    };
  }

  function send(reason) {
    var path = window.location.pathname + window.location.search;

    if (document.visibilityState === 'prerender' || path === lastPath) {
      return;
    }

    lastPath = path;

    var body = JSON.stringify(payload(reason));

    if (navigator.sendBeacon) {
      var queued = navigator.sendBeacon(
        endpoint,
        new Blob([body], { type: 'application/json' })
      );

      if (queued) {
        firstVisit = false;
        return;
      }
    }

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body,
      credentials: 'same-origin',
      keepalive: true
    }).catch(function () {});

    firstVisit = false;
  }

  function schedule(reason) {
    window.setTimeout(function () {
      send(reason);
    }, 0);
  }

  function wrapHistory(method) {
    var original = window.history[method];

    window.history[method] = function () {
      var result = original.apply(this, arguments);
      schedule(method);
      return result;
    };
  }

  wrapHistory('pushState');
  wrapHistory('replaceState');
  window.addEventListener('popstate', function () {
    schedule('popstate');
  });

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      function () {
        schedule('load');
      },
      { once: true }
    );
  } else {
    schedule('load');
  }
})();
`;

export function PageviewScript() {
  const enabled =
    process.env.NEXT_PUBLIC_SITE_VISIT_EVENTS === 'true' ||
    (process.env.NODE_ENV === 'production' &&
      process.env.NEXT_PUBLIC_SITE_VISIT_EVENTS !== 'false');

  if (!enabled) {
    return null;
  }

  return (
    <Script
      id="site-pageview-events"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: pageviewScript }}
    />
  );
}
