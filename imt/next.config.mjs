import { apmRedirectPairs } from './lib/apm-redirects.mjs';

const oldHosts = ['apmoverflow.xyz', 'www.apmoverflow.xyz'];

function redirectForHost(source, destination, host) {
  return {
    source,
    has: [
      {
        type: 'host',
        value: host,
      },
    ],
    destination,
    permanent: true,
  };
}

function oldHostRedirects(source, destination) {
  return oldHosts.map((host) => redirectForHost(source, destination, host));
}

function apmOverflowRedirects() {
  return apmRedirectPairs().flatMap(([source, destination]) =>
    oldHostRedirects(source, destination)
  );
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return apmOverflowRedirects();
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
