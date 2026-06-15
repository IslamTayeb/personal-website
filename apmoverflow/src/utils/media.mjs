import { site } from '../site.config.mjs';

export function encodeMediaFilename(filename) {
  return encodeURIComponent(filename).replace(
    /[!'()*]/g,
    (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`
  );
}

export function mediaUrl(filename) {
  return `${site.mediaBaseUrl}${encodeMediaFilename(filename)}`;
}

export function filenameFromUrl(value) {
  const pathname = new URL(value).pathname;

  return decodeURIComponent(pathname.slice(pathname.lastIndexOf('/') + 1));
}
