import { NextRequest, NextResponse } from 'next/server';
import { getGeolocation } from '@/lib/geolocation';
import { sendVisitorNotification } from '@/lib/discord';
import {
  hashIP,
  anonymizeIP,
  parseUserAgent,
  extractUTMParams,
  getClientIP,
  shouldTrack,
} from '@/lib/analytics-utils';

export async function POST(req: NextRequest) {
  try {
    // Check if we should track this request
    if (!shouldTrack(req)) {
      return NextResponse.json({
        success: true,
        tracked: false,
        reason: 'excluded',
      });
    }

    const body = await req.json();
    const {
      fingerprint,
      page_url,
      page_title,
      referrer,
      screen_resolution,
      viewport_size,
      timezone,
      language,
      time_spent,
      scroll_depth,
      // Extended device info
      platform,
      cpu_cores,
      device_memory,
      pixel_ratio,
      cookies_enabled,
      online,
      pdf_viewer,
      gpu_renderer,
      gpu_vendor,
    } = body;

    if (!fingerprint || !page_url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get client IP
    const clientIP = getClientIP(req);
    const ipToStore =
      process.env.ANONYMIZE_IPS === 'true' ? anonymizeIP(clientIP) : clientIP;

    // Parse user agent
    const userAgent = req.headers.get('user-agent') || '';
    const deviceInfo = parseUserAgent(userAgent);

    // Extract UTM parameters
    const utmParams = extractUTMParams(page_url);

    // Get geolocation
    const geoData = await getGeolocation(clientIP);

    // Determine if likely a new visitor (client-side fingerprint check)
    // Since we have no database, we rely on the client telling us
    const isNewVisitor = true; // Could be enhanced with client-side localStorage check

    // Send Discord notification
    await sendVisitorNotification(
      {
        fingerprint,
        referrer,
        ip_address: ipToStore,
        utm_source: utmParams.utm_source,
        utm_medium: utmParams.utm_medium,
        utm_campaign: utmParams.utm_campaign,
      },
      {
        page_url,
        page_title,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        device_type: deviceInfo.device_type,
        screen_resolution,
        platform,
        cpu_cores,
        device_memory,
        pixel_ratio,
        cookies_enabled,
        online,
        pdf_viewer,
        gpu_renderer,
        gpu_vendor,
        is_new_visitor: isNewVisitor,
      },
      geoData
    );

    return NextResponse.json({ success: true, tracked: true });
  } catch (error) {
    console.error('Error tracking visitor:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
