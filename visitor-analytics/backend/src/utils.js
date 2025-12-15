import crypto from 'crypto';
import UAParser from 'ua-parser-js';

export function hashIP(ip) {
  return crypto.createHash('sha256').update(ip).digest('hex');
}

export function anonymizeIP(ip) {
  if (ip.includes(':')) {
    // IPv6: Keep first 48 bits
    const parts = ip.split(':');
    return parts.slice(0, 3).join(':') + '::0';
  } else {
    // IPv4: Keep first 3 octets
    const parts = ip.split('.');
    return parts.slice(0, 3).join('.') + '.0';
  }
}

export function parseUserAgent(userAgent) {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  return {
    browser: result.browser.name || 'Unknown',
    browser_version: result.browser.version || 'Unknown',
    os: result.os.name || 'Unknown',
    os_version: result.os.version || 'Unknown',
    device_type: result.device.type || 'desktop'
  };
}

export function extractUTMParams(url) {
  try {
    const urlObj = new URL(url);
    return {
      utm_source: urlObj.searchParams.get('utm_source') || null,
      utm_medium: urlObj.searchParams.get('utm_medium') || null,
      utm_campaign: urlObj.searchParams.get('utm_campaign') || null,
      utm_term: urlObj.searchParams.get('utm_term') || null,
      utm_content: urlObj.searchParams.get('utm_content') || null
    };
  } catch {
    return {
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_term: null,
      utm_content: null
    };
  }
}

export function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() ||
         req.headers['x-real-ip'] ||
         req.socket.remoteAddress;
}

export function getCountryFlag(countryCode) {
  if (!countryCode || countryCode === 'LOCAL') return '🏠';

  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));

  return String.fromCodePoint(...codePoints);
}

export function formatDuration(seconds) {
  if (!seconds || seconds < 0) return '0s';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(' ');
}

export function shouldTrack(req) {
  const adminIPs = process.env.ADMIN_IPS?.split(',') || [];
  const clientIP = getClientIP(req);

  // Don't track admin IPs
  if (adminIPs.some(ip => clientIP.includes(ip))) {
    return false;
  }

  // Respect Do Not Track header
  if (process.env.RESPECT_DNT === 'true' && req.headers.dnt === '1') {
    return false;
  }

  return true;
}
