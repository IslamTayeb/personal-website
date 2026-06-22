import { monthNames } from '../site.config.mjs';

export function assertValidDate(value, label) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`${label} must be a valid date string`);
  }

  return date;
}

export function formatDate(value) {
  const date = assertValidDate(value, 'date');
  const month = monthNames[date.getUTCMonth()];
  const day = String(date.getUTCDate()).padStart(2, '0');
  const year = date.getUTCFullYear();

  return `${month} ${day}, ${year}`;
}

export function datetime(value) {
  return assertValidDate(value, 'datetime')
    .toISOString()
    .replace(/:00\.000Z$/, 'Z')
    .replace(/\.000Z$/, 'Z');
}

export function toFeedDate(value) {
  return assertValidDate(value, 'feed date')
    .toISOString()
    .replace(/\.\d{3}Z$/, '+00:00');
}

export function toRssDate(value) {
  return assertValidDate(value, 'rss date').toUTCString();
}
