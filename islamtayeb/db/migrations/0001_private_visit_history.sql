CREATE TABLE visitor_profiles (
  client_id text PRIMARY KEY,
  first_seen_at timestamptz NOT NULL,
  last_seen_at timestamptz NOT NULL,
  first_referrer text NOT NULL,
  last_referrer text NOT NULL,
  latest_session_id text NOT NULL,
  latest_ip inet,
  latest_country text,
  latest_region text,
  latest_city text,
  latest_postal_code text,
  latest_latitude numeric(9, 6),
  latest_longitude numeric(9, 6),
  latest_network_timezone text,
  latest_asn text,
  latest_as_name text,
  latest_as_domain text,
  pageview_count bigint NOT NULL DEFAULT 1 CHECK (pageview_count > 0),
  CHECK (last_seen_at >= first_seen_at)
);

CREATE TABLE pageview_events (
  event_id text PRIMARY KEY,
  event_kind text NOT NULL CHECK (event_kind = 'pageview'),
  client_id text NOT NULL,
  session_id text NOT NULL,
  first_visit boolean NOT NULL,
  path text NOT NULL,
  title text NOT NULL,
  referrer text NOT NULL,
  viewport text NOT NULL,
  screen text NOT NULL,
  browser_timezone text NOT NULL,
  language text NOT NULL,
  reason text NOT NULL,
  client_at timestamptz NOT NULL,
  server_at timestamptz NOT NULL,
  client_ip inet,
  country text,
  region text,
  city text,
  postal_code text,
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  network_timezone text,
  user_agent text NOT NULL,
  host text NOT NULL,
  sec_fetch_site text,
  sec_fetch_mode text,
  sec_fetch_dest text,
  asn text,
  as_name text,
  as_domain text,
  bot_label text NOT NULL,
  bot_evidence text NOT NULL
);

CREATE INDEX pageview_events_server_at_idx
  ON pageview_events (server_at DESC);

CREATE INDEX pageview_events_client_server_at_idx
  ON pageview_events (client_id, server_at DESC);

CREATE INDEX pageview_events_location_idx
  ON pageview_events (country, region, city, server_at DESC);

CREATE INDEX pageview_events_coordinates_idx
  ON pageview_events (latitude, longitude)
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

CREATE INDEX visitor_profiles_last_seen_at_idx
  ON visitor_profiles (last_seen_at DESC);
