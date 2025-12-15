import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { statements } from './db.js';
import { initDiscordBot, sendVisitorNotification } from './discord.js';
import { getGeolocation } from './geolocation.js';
import {
  hashIP,
  anonymizeIP,
  parseUserAgent,
  extractUTMParams,
  getClientIP,
  shouldTrack
} from './utils.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Track visitor endpoint
app.post('/api/track', async (req, res) => {
  try {
    // Check if we should track this request
    if (!shouldTrack(req)) {
      return res.json({ success: true, tracked: false, reason: 'excluded' });
    }

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
      gpu_vendor
    } = req.body;

    if (!fingerprint || !page_url) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get client IP
    const clientIP = getClientIP(req);
    const ipToStore = process.env.ANONYMIZE_IPS === 'true' ? anonymizeIP(clientIP) : clientIP;
    const ipHash = hashIP(clientIP);

    // Parse user agent
    const userAgent = req.headers['user-agent'];
    const deviceInfo = parseUserAgent(userAgent);

    // Extract UTM parameters
    const utmParams = extractUTMParams(page_url);

    // Get geolocation
    const geoData = await getGeolocation(clientIP);

    // Check if visitor exists
    const existingVisitor = statements.findVisitorByFingerprint.get(fingerprint);
    const isNewVisitor = !existingVisitor;

    let visitorId;

    if (isNewVisitor) {
      // Insert new visitor
      const result = statements.insertVisitor.run(
        fingerprint,
        ipToStore,
        ipHash,
        geoData?.country || null,
        geoData?.country_code || null,
        geoData?.region || null,
        geoData?.city || null,
        geoData?.latitude || null,
        geoData?.longitude || null,
        geoData?.isp || null,
        geoData?.organization || null,
        geoData?.asn || null,
        geoData?.asn_name || null,
        geoData?.is_vpn ? 1 : 0,
        timezone || null,
        language || null,
        referrer || null,
        utmParams.utm_source,
        utmParams.utm_medium,
        utmParams.utm_campaign,
        utmParams.utm_term,
        utmParams.utm_content
      );
      visitorId = result.lastInsertRowid;
    } else {
      visitorId = existingVisitor.id;
    }

    // Insert session
    statements.insertSession.run(
      visitorId,
      page_url,
      page_title || null,
      userAgent || null,
      deviceInfo.browser,
      deviceInfo.browser_version,
      deviceInfo.os,
      deviceInfo.os_version,
      deviceInfo.device_type,
      screen_resolution || null,
      viewport_size || null,
      platform || null,
      cpu_cores || null,
      device_memory || null,
      pixel_ratio || null,
      cookies_enabled !== undefined ? (cookies_enabled ? 1 : 0) : null,
      online !== undefined ? (online ? 1 : 0) : null,
      pdf_viewer !== undefined ? (pdf_viewer ? 1 : 0) : null,
      gpu_renderer || null,
      gpu_vendor || null,
      time_spent || 0,
      scroll_depth || 0,
      isNewVisitor ? 1 : 0
    );

    // Send Discord notification
    await sendVisitorNotification(
      {
        visitor_id: visitorId,
        referrer,
        ip_address: ipToStore,
        ...utmParams
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
        is_new_visitor: isNewVisitor
      },
      geoData
    );

    res.json({ success: true, tracked: true, visitor_id: visitorId });

  } catch (error) {
    console.error('Error tracking visitor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Analytics endpoint for dashboard (optional)
app.get('/api/stats/summary', (req, res) => {
  try {
    const today = statements.getStatsToday.get();
    const week = statements.getStatsWeek.get();

    res.json({
      today,
      week
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
async function start() {
  try {
    // Initialize Discord bot
    await initDiscordBot();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Analytics API server running on port ${PORT}`);
      console.log(`📊 Database ready`);
      console.log(`🚀 Ready to track visitors!`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
