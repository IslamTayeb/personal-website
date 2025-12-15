import fetch from 'node-fetch';

const VPN_INDICATORS = ['vpn', 'proxy', 'hosting', 'datacenter'];

export async function getGeolocation(ip) {
  if (!ip || ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return {
      country: 'Local',
      country_code: 'LOCAL',
      region: 'Local',
      city: 'Local',
      isp: 'Local Network',
      is_vpn: false
    };
  }

  try {
    // Using ip-api.com - free, no API key required, 45 requests/minute
    // Added lat, lon, as (ASN) fields
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,lat,lon,isp,org,as,asname,proxy,hosting`);
    const data = await response.json();

    if (data.status === 'fail') {
      console.error('Geolocation lookup failed:', data.message);
      return null;
    }

    // Detect VPN/Proxy
    const is_vpn = data.proxy ||
                   data.hosting ||
                   VPN_INDICATORS.some(indicator =>
                     (data.isp?.toLowerCase().includes(indicator) ||
                      data.org?.toLowerCase().includes(indicator))
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
      is_vpn
    };
  } catch (error) {
    console.error('Geolocation API error:', error);
    return null;
  }
}

// Alternative: ipapi.co (requires API key for higher limits)
export async function getGeolocationIPAPI(ip, apiKey) {
  try {
    const url = apiKey
      ? `https://ipapi.co/${ip}/json/?key=${apiKey}`
      : `https://ipapi.co/${ip}/json/`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error('IPAPI error:', data.reason);
      return null;
    }

    return {
      country: data.country_name,
      country_code: data.country_code,
      region: data.region,
      city: data.city,
      isp: data.org,
      is_vpn: data.asn?.type === 'hosting'
    };
  } catch (error) {
    console.error('IPAPI error:', error);
    return null;
  }
}
