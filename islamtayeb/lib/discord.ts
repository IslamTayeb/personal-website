import { GeolocationData } from './geolocation';
import { getCountryFlag } from './analytics-utils';

interface VisitorNotificationData {
  fingerprint: string;
  referrer?: string;
  ip_address?: string;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
}

interface SessionNotificationData {
  page_url: string;
  page_title?: string;
  browser: string;
  os: string;
  device_type: string;
  screen_resolution?: string;
  platform?: string;
  cpu_cores?: number;
  device_memory?: number;
  pixel_ratio?: number;
  cookies_enabled?: boolean;
  online?: boolean;
  pdf_viewer?: boolean;
  gpu_renderer?: string;
  gpu_vendor?: string;
  is_new_visitor: boolean;
}

export async function sendVisitorNotification(
  visitorData: VisitorNotificationData,
  sessionData: SessionNotificationData,
  geoData: GeolocationData | null
) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn(
      'Discord webhook URL not configured. Discord integration disabled.'
    );
    return;
  }

  try {
    // Detect environment (dev vs prod)
    const isDev =
      sessionData.page_url.includes('localhost') ||
      sessionData.page_url.includes('127.0.0.1');
    const envBadge = isDev ? '🟡 **DEV**' : '🟢 **PROD**';

    const flag = getCountryFlag(geoData?.country_code || null);
    const location = geoData?.city
      ? `${flag} ${geoData.city}, ${geoData.region}, ${geoData.country}`
      : `${flag} ${geoData?.country || 'Unknown'}`;

    // Browser & Network info
    const browserInfo = `Browser: ${sessionData.browser || 'Unknown'}. Online: ${sessionData.online ? 'online' : 'offline'}. Cookies: ${sessionData.cookies_enabled ? 'Enabled' : 'Disabled'}.`;

    // ISP & Organization
    const ispInfo = `ISP/Org: ${geoData?.isp || geoData?.organization || 'Unknown'}.`;

    // Network Information
    const networkInfo = [
      visitorData.ip_address && `IP Address: ${visitorData.ip_address}.`,
      geoData?.asn && `ASN: ${geoData.asn}.`,
    ]
      .filter(Boolean)
      .join(' ');

    // Location Details with coordinates
    const locationDetails =
      geoData?.latitude && geoData?.longitude
        ? `City: ${geoData.city}. Region: ${geoData.region}. Country: ${geoData.country}. Coordinates: ${geoData.latitude}, ${geoData.longitude}.`
        : `City: ${geoData?.city || 'Unknown'}. Region: ${geoData?.region || 'Unknown'}. Country: ${geoData?.country || 'Unknown'}.`;

    // System Resources
    const systemInfo = [
      sessionData.cpu_cores && `CPU Cores: ${sessionData.cpu_cores}.`,
      sessionData.device_memory
        ? `Memory: ${sessionData.device_memory}GB.`
        : 'Memory: unknown.',
      sessionData.pdf_viewer !== null
        ? `PDF Viewer: ${sessionData.pdf_viewer ? 'Yes' : 'No'}.`
        : '',
    ]
      .filter(Boolean)
      .join(' ');

    // Device Hardware
    const deviceInfo = [
      sessionData.platform && `Platform: ${sessionData.platform}.`,
      sessionData.screen_resolution &&
        `Screen: ${sessionData.screen_resolution}.`,
      sessionData.pixel_ratio && `Pixel Ratio: ${sessionData.pixel_ratio}x.`,
    ]
      .filter(Boolean)
      .join(' ');

    // GPU & Graphics
    const gpuInfo =
      sessionData.gpu_renderer && sessionData.gpu_vendor
        ? `Renderer: ${sessionData.gpu_renderer}. Vendor: ${sessionData.gpu_vendor}.`
        : 'GPU: Unknown.';

    const visitorType = sessionData.is_new_visitor
      ? '🔔 New Visitor'
      : '🔄 Returning Visitor';
    const title = `${flag} ${visitorType} | ${envBadge}`;

    const embed = {
      title: title,
      color: isDev
        ? 0xfee75c
        : sessionData.is_new_visitor
          ? 0x57f287
          : 0x5865f2,
      fields: [
        { name: '🌍 Location', value: location, inline: false },
        { name: '📱 Browser & Network', value: browserInfo, inline: false },
        { name: '🌐 ISP & Organization', value: ispInfo, inline: false },
        {
          name: '🔗 Network Information',
          value: networkInfo || 'N/A',
          inline: false,
        },
        {
          name: '📍 Coordinates',
          value:
            geoData?.latitude && geoData?.longitude
              ? `${geoData.latitude}, ${geoData.longitude}`
              : 'Unknown',
          inline: false,
        },
        {
          name: '💻 System Resources',
          value: systemInfo || 'N/A',
          inline: false,
        },
        {
          name: '🖥️ Device Hardware',
          value: deviceInfo || 'N/A',
          inline: false,
        },
        { name: '🎨 GPU & Graphics', value: gpuInfo, inline: false },
        {
          name: '📄 Page Visited',
          value: `[${sessionData.page_title || 'Untitled'}](${sessionData.page_url})`,
          inline: false,
        },
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: `Fingerprint: ${visitorData.fingerprint.substring(0, 12)}...`,
      },
    };

    if (geoData?.is_vpn) {
      embed.fields.push({
        name: '⚠️ VPN/Proxy',
        value: 'Detected',
        inline: true,
      });
    }

    if (visitorData.utm_source) {
      const utmInfo = [
        visitorData.utm_source && `Source: ${visitorData.utm_source}`,
        visitorData.utm_medium && `Medium: ${visitorData.utm_medium}`,
        visitorData.utm_campaign && `Campaign: ${visitorData.utm_campaign}`,
      ]
        .filter(Boolean)
        .join(' • ');

      if (utmInfo) {
        embed.fields.push({
          name: '🎯 Campaign',
          value: utmInfo,
          inline: false,
        });
      }
    }

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] }),
    });
  } catch (error) {
    console.error('Error sending Discord notification:', error);
  }
}
