export const mediaBaseUrl =
  'https://raw.githubusercontent.com/islamtayeb/obsidian-files/main/';

export function mediaUrl(filename: string) {
  return `${mediaBaseUrl}${encodeURIComponent(filename).replaceAll('%2F', '/')}`;
}

export function filenameFromUrl(value: string) {
  const url = new URL(value);
  return decodeURIComponent(url.pathname.split('/').at(-1) ?? '');
}
