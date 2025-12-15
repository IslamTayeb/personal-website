# Enhanced Visitor Tracking

This document describes the comprehensive tracking enhancements added to the visitor analytics system.

## New Data Being Tracked

The system now collects detailed information similar to professional analytics platforms, organized into categories:

### 📱 Browser & Network
- **Browser**: Browser name and version (e.g., "Safari 17.2")
- **Online Status**: Whether the visitor is currently online
- **Cookies**: Whether cookies are enabled in the browser

### 🌐 ISP & Organization
- **ISP**: Internet Service Provider (e.g., "Comcast Cable")
- **Organization**: Organization name (e.g., "University of Pennsylvania")

### 🔗 Network Information
- **IP Address**: Full IPv4 or IPv6 address (with optional anonymization)
- **ASN**: Autonomous System Number (e.g., "AS55")
- **ASN Name**: Name of the autonomous system

### 📍 Location Details
- **City**: City name (e.g., "Philadelphia")
- **Region**: State/Region (e.g., "Pennsylvania")
- **Country**: Country name with country code (e.g., "United States (US)")
- **Coordinates**: Latitude and longitude (e.g., "39.9597, -75.1995")

### 💻 System Resources
- **CPU Cores**: Number of logical CPU cores (e.g., 8)
- **Device Memory**: RAM in GB (when available)
- **PDF Viewer**: Whether a PDF viewer is available

### 🖥️ Device Hardware
- **Platform**: Operating system platform (e.g., "MacIntel")
- **Screen Resolution**: Screen dimensions (e.g., "1710x1107")
- **Pixel Ratio**: Device pixel ratio (e.g., "2x" for Retina displays)

### 🎨 GPU & Graphics
- **GPU Renderer**: Graphics renderer (e.g., "Apple GPU")
- **GPU Vendor**: Graphics vendor (e.g., "Apple Inc.")

## Discord Notifications

When a visitor arrives, you'll receive a detailed Discord notification with all categories organized clearly:

```
🔔 New Visitor / 🔄 Returning Visitor

📱 Browser & Network
Browser: Safari. Online: online. Cookies: Enabled.

🌐 ISP & Organization
ISP/Org: University of Pennsylvania.

🔗 Network Information
IP Address: 2607:f470:6:1001:93:3c7e:d632:f6dc. ASN: AS55.

📍 Location Details
City: Philadelphia. Region: Pennsylvania. Country: United States. Coordinates: 39.9597, -75.1995.

💻 System Resources
CPU Cores: 8. Memory: unknown. PDF Viewer: Yes.

🖥️ Device Hardware
Platform: MacIntel. Screen: 1710x1107. Pixel Ratio: 2x.

🎨 GPU & Graphics
Renderer: Apple GPU. Vendor: Apple Inc.

📄 Page Visited
[Page Title](https://yourdomain.com/page)

Visitor ID: 123
```

## Discord Commands

Use the `/lookup` command to view detailed visitor information:

```
/lookup 12345
/lookup 192.168.1.1
```

This will show all the categories above in an organized format.

## Database Schema

### Visitors Table - New Columns
- `latitude` (REAL) - Visitor latitude
- `longitude` (REAL) - Visitor longitude
- `organization` (TEXT) - Organization name
- `asn` (TEXT) - Autonomous System Number
- `asn_name` (TEXT) - ASN name

### Sessions Table - New Columns
- `platform` (TEXT) - OS platform
- `cpu_cores` (INTEGER) - Number of CPU cores
- `device_memory` (REAL) - Device memory in GB
- `pixel_ratio` (REAL) - Device pixel ratio
- `cookies_enabled` (BOOLEAN) - Cookies enabled status
- `online` (BOOLEAN) - Online status
- `pdf_viewer` (BOOLEAN) - PDF viewer availability
- `gpu_renderer` (TEXT) - GPU renderer
- `gpu_vendor` (TEXT) - GPU vendor

## Privacy Considerations

All existing privacy features still work:

- **IP Anonymization**: Set `ANONYMIZE_IPS=true` to anonymize IP addresses
- **Do Not Track**: Respects DNT header when `RESPECT_DNT=true`
- **Admin Exclusion**: Exclude your own IP with `ADMIN_IPS`

## Frontend Changes

The `VisitorTracker.tsx` component now automatically collects:
- WebGL GPU information via canvas context
- Hardware concurrency (CPU cores)
- Device memory (when available)
- Navigator platform information
- Pixel ratio and display information
- Browser capabilities (cookies, online status, PDF viewer)

## Backend Changes

The backend now:
- Requests extended geolocation data (coordinates, ASN)
- Stores all new fields in the database
- Passes detailed information to Discord notifications
- Supports the enhanced `/lookup` command format

## Migration

If you have an existing database, the migration script will add the new columns:

```bash
# Inside the container
docker exec visitor-analytics npm run migrate

# Or manually
docker exec visitor-analytics node src/db-migration.js
```

**Note**: For a fresh start (recommended), just recreate the containers:

```bash
docker-compose down -v
docker-compose up -d
```

## API Changes

The `/api/track` endpoint now accepts additional fields:

```json
{
  "fingerprint": "...",
  "page_url": "...",
  // ... existing fields ...

  // New fields
  "platform": "MacIntel",
  "cpu_cores": 8,
  "device_memory": 16,
  "pixel_ratio": 2,
  "cookies_enabled": true,
  "online": true,
  "pdf_viewer": true,
  "gpu_renderer": "Apple GPU",
  "gpu_vendor": "Apple Inc."
}
```

All new fields are optional and will default to `null` if not provided.

## Testing

Visit your website and check Discord for the enhanced notification format. You should see:

1. All 8 information categories
2. Detailed system information
3. GPU details (if browser allows WebGL access)
4. Complete network information

Use `/lookup [visitor_id]` to verify all data is being stored correctly.

## Comparison with Previous Version

**Before:**
- Basic browser/OS detection
- Simple location (city, country)
- Basic ISP detection
- Screen resolution

**After:**
- Complete browser capabilities
- Precise coordinates
- ASN and organization details
- CPU/GPU information
- Device memory
- Pixel ratio
- Platform details
- Online/cookies status
- PDF viewer detection

## Limitations

Some fields may not be available depending on:
- **Browser privacy settings**: Some browsers block WebGL for fingerprinting prevention
- **Device API support**: `deviceMemory` is not supported in all browsers
- **Platform differences**: Mobile vs desktop differences in available APIs

These will show as "unknown" or `null` in the database and Discord notifications.
