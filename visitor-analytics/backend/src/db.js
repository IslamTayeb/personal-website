import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../data/analytics.db');
const db = new Database(dbPath);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS visitors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visitor_fingerprint TEXT NOT NULL,
    ip_address TEXT,
    ip_hash TEXT,
    country TEXT,
    country_code TEXT,
    region TEXT,
    city TEXT,
    latitude REAL,
    longitude REAL,
    isp TEXT,
    organization TEXT,
    asn TEXT,
    asn_name TEXT,
    is_vpn BOOLEAN DEFAULT 0,
    timezone TEXT,
    language TEXT,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_term TEXT,
    utm_content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visitor_id INTEGER NOT NULL,
    page_url TEXT NOT NULL,
    page_title TEXT,
    user_agent TEXT,
    browser TEXT,
    browser_version TEXT,
    os TEXT,
    os_version TEXT,
    device_type TEXT,
    screen_resolution TEXT,
    viewport_size TEXT,
    platform TEXT,
    cpu_cores INTEGER,
    device_memory REAL,
    pixel_ratio REAL,
    cookies_enabled BOOLEAN,
    online BOOLEAN,
    pdf_viewer BOOLEAN,
    gpu_renderer TEXT,
    gpu_vendor TEXT,
    time_spent INTEGER,
    scroll_depth INTEGER,
    is_new_visitor BOOLEAN DEFAULT 1,
    session_start DATETIME DEFAULT CURRENT_TIMESTAMP,
    session_end DATETIME,
    FOREIGN KEY (visitor_id) REFERENCES visitors(id)
  );

  CREATE INDEX IF NOT EXISTS idx_visitors_fingerprint ON visitors(visitor_fingerprint);
  CREATE INDEX IF NOT EXISTS idx_visitors_created ON visitors(created_at);
  CREATE INDEX IF NOT EXISTS idx_sessions_visitor ON sessions(visitor_id);
  CREATE INDEX IF NOT EXISTS idx_sessions_start ON sessions(session_start);
  CREATE INDEX IF NOT EXISTS idx_sessions_url ON sessions(page_url);
`);

// Prepared statements for better performance
const statements = {
  insertVisitor: db.prepare(`
    INSERT INTO visitors (
      visitor_fingerprint, ip_address, ip_hash, country, country_code,
      region, city, latitude, longitude, isp, organization, asn, asn_name, is_vpn,
      timezone, language, referrer,
      utm_source, utm_medium, utm_campaign, utm_term, utm_content
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),

  insertSession: db.prepare(`
    INSERT INTO sessions (
      visitor_id, page_url, page_title, user_agent, browser, browser_version,
      os, os_version, device_type, screen_resolution, viewport_size,
      platform, cpu_cores, device_memory, pixel_ratio,
      cookies_enabled, online, pdf_viewer, gpu_renderer, gpu_vendor,
      time_spent, scroll_depth, is_new_visitor
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),

  findVisitorByFingerprint: db.prepare(`
    SELECT * FROM visitors WHERE visitor_fingerprint = ? ORDER BY created_at DESC LIMIT 1
  `),

  getStatsToday: db.prepare(`
    SELECT
      COUNT(DISTINCT v.id) as unique_visitors,
      COUNT(s.id) as total_sessions,
      AVG(s.time_spent) as avg_time_spent,
      SUM(CASE WHEN s.is_new_visitor = 1 THEN 1 ELSE 0 END) as new_visitors
    FROM visitors v
    LEFT JOIN sessions s ON v.id = s.visitor_id
    WHERE date(v.created_at) = date('now')
  `),

  getStatsWeek: db.prepare(`
    SELECT
      COUNT(DISTINCT v.id) as unique_visitors,
      COUNT(s.id) as total_sessions,
      AVG(s.time_spent) as avg_time_spent,
      SUM(CASE WHEN s.is_new_visitor = 1 THEN 1 ELSE 0 END) as new_visitors
    FROM visitors v
    LEFT JOIN sessions s ON v.id = s.visitor_id
    WHERE date(v.created_at) >= date('now', '-7 days')
  `),

  getTopPages: db.prepare(`
    SELECT
      page_url,
      page_title,
      COUNT(*) as visits,
      AVG(time_spent) as avg_time_spent
    FROM sessions
    WHERE session_start >= datetime('now', '-7 days')
    GROUP BY page_url
    ORDER BY visits DESC
    LIMIT ?
  `),

  getTopLocations: db.prepare(`
    SELECT
      country,
      country_code,
      city,
      COUNT(*) as visits
    FROM visitors
    WHERE created_at >= datetime('now', '-7 days')
    GROUP BY country, city
    ORDER BY visits DESC
    LIMIT ?
  `),

  getTopReferrers: db.prepare(`
    SELECT
      CASE
        WHEN referrer = '' OR referrer IS NULL THEN 'Direct'
        ELSE referrer
      END as source,
      COUNT(*) as visits
    FROM visitors
    WHERE created_at >= datetime('now', '-7 days')
    GROUP BY source
    ORDER BY visits DESC
    LIMIT ?
  `),

  getRecentVisitors: db.prepare(`
    SELECT
      v.*,
      s.page_url,
      s.page_title,
      s.browser,
      s.os,
      s.device_type
    FROM visitors v
    LEFT JOIN sessions s ON v.id = s.visitor_id
    ORDER BY v.created_at DESC
    LIMIT ?
  `),

  lookupByIp: db.prepare(`
    SELECT v.*, s.*
    FROM visitors v
    LEFT JOIN sessions s ON v.id = s.visitor_id
    WHERE v.ip_address = ?
    ORDER BY v.created_at DESC
  `),

  lookupById: db.prepare(`
    SELECT v.*, s.*
    FROM visitors v
    LEFT JOIN sessions s ON v.id = s.visitor_id
    WHERE v.id = ?
  `)
};

export { db, statements };
