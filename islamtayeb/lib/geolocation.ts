const VPN_INDICATORS = ['vpn', 'proxy', 'hosting', 'datacenter'];

export interface GeolocationData {
  country: string;
  country_code: string;
  region: string;
  city: string;
  latitude?: number;
  longitude?: number;
  isp: string;
  organization?: string;
  asn?: string;
  asn_name?: string;
  is_vpn: boolean;
}

export async function getGeolocation(
  ip: string
): Promise<GeolocationData | null> {
  if (
    !ip ||
    ip === '::1' ||
    ip === '127.0.0.1' ||
    ip.startsWith('192.168.') ||
    ip.startsWith('10.')
  ) {
    return {
      country: 'Local',
      country_code: 'LOCAL',
      region: 'Local',
      city: 'Local',
      isp: 'Local Network',
      is_vpn: false,
    };
  }

  try {
    // Using ip-api.com - free, no API key required, 45 requests/minute
    const response = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,lat,lon,isp,org,as,asname,proxy,hosting`,
      { cache: 'no-store' }
    );
    const data = await response.json();

    if (data.status === 'fail') {
      console.error('Geolocation lookup failed:', data.message);
      return null;
    }

    // Detect VPN/Proxy
    const is_vpn =
      data.proxy ||
      data.hosting ||
      VPN_INDICATORS.some(
        (indicator) =>
          data.isp?.toLowerCase().includes(indicator) ||
          data.org?.toLowerCase().includes(indicator)
      );

    return {
      country: data.country,
      country_code: data.countryCode,
      region: data.regionName,
      city: data.city,
      latitude: data.lat,
      longitude: data.lon,
      isp: data.isp,
      organization: data.org,
      asn: data.as,
      asn_name: data.asname,
      is_vpn,
    };
  } catch (error) {
    console.error('Geolocation API error:', error);
    return null;
  }
}
