export const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function assertValidDate(value: string, label: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`${label} must be a valid date string`);
  }

  return date;
}

export function formatDate(value: string) {
  const date = assertValidDate(value, 'date');
  const month = monthNames[date.getUTCMonth()];
  const day = String(date.getUTCDate()).padStart(2, '0');
  const year = date.getUTCFullYear();

  return `${month} ${day}, ${year}`;
}

export function formatMonthYear(value: string) {
  const date = assertValidDate(value, 'date');
  const month = monthNames[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  return `${month} ${year}`;
}

export function datetime(value: string) {
  return assertValidDate(value, 'datetime')
    .toISOString()
    .replace(/:00\.000Z$/, 'Z')
    .replace(/\.000Z$/, 'Z');
}

export function toFeedDate(value: string) {
  return assertValidDate(value, 'feed date')
    .toISOString()
    .replace(/\.\d{3}Z$/, '+00:00');
}

export function toRssDate(value: string) {
  return assertValidDate(value, 'RSS date').toUTCString();
}
