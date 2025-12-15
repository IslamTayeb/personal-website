# Next.js Integration Guide

This guide shows you how to integrate the visitor analytics system with your Next.js website.

## Step 1: Copy the Tracker Component

The tracker component is already created at:
```
my-portfolio/app/_components/VisitorTracker.tsx
```

If you need to move it or customize it, the file exports a `VisitorTracker` component that handles all tracking logic.

## Step 2: Add Environment Variables

Add these to your Next.js `.env.local` file:

```env
# Analytics API URL
NEXT_PUBLIC_ANALYTICS_API=http://localhost:3001

# Enable/disable tracking
NEXT_PUBLIC_ANALYTICS_ENABLED=true
```

For production:
```env
NEXT_PUBLIC_ANALYTICS_API=https://analytics.yourdomain.com
NEXT_PUBLIC_ANALYTICS_ENABLED=true
```

## Step 3: Add Tracker to Root Layout

Update your root layout to include the tracker:

```tsx
// app/layout.tsx
import VisitorTracker from './_components/VisitorTracker';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <VisitorTracker />
      </body>
    </html>
  );
}
```

That's it! The tracker will now:
- Automatically track all page visits
- Send data to your analytics backend
- Track time spent and scroll depth
- Work with Next.js navigation (App Router)

## Advanced Configuration

### Custom Configuration

You can pass custom configuration to the tracker:

```tsx
<VisitorTracker
  config={{
    apiUrl: 'https://custom-analytics.example.com',
    enabled: true,
    debug: process.env.NODE_ENV === 'development'
  }}
/>
```

### Conditional Tracking

Only track in production:

```tsx
<VisitorTracker
  config={{
    enabled: process.env.NODE_ENV === 'production'
  }}
/>
```

### Exclude Specific Pages

Modify the component to skip certain pages:

```tsx
'use client';

import { usePathname } from 'next/navigation';
import VisitorTracker from './_components/VisitorTracker';

export default function ConditionalTracker() {
  const pathname = usePathname();

  // Don't track admin or private pages
  const excludedPaths = ['/admin', '/dashboard', '/private'];
  const shouldTrack = !excludedPaths.some(path => pathname.startsWith(path));

  if (!shouldTrack) return null;

  return <VisitorTracker />;
}
```

## What Gets Tracked

The tracker automatically collects:

### Page Information
- Current URL (including UTM parameters)
- Page title
- Referrer URL

### Visitor Information
- Unique fingerprint (stored in localStorage)
- Timezone
- Browser language
- Screen resolution
- Viewport size

### Engagement Metrics
- Time spent on page
- Maximum scroll depth
- New vs returning visitor

### Technical Details
- User agent (parsed server-side for browser/OS)
- IP address (captured server-side)
- Geolocation (determined server-side)

## Privacy & Compliance

### Cookie Consent

If you need cookie consent, wrap the tracker:

```tsx
'use client';

import { useState, useEffect } from 'react';
import VisitorTracker from './_components/VisitorTracker';

export default function ConsentTracker() {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('analytics_consent');
    setHasConsent(consent === 'true');
  }, []);

  if (!hasConsent) return null;

  return <VisitorTracker />;
}
```

### GDPR Compliance

The backend supports:
- IP anonymization (`ANONYMIZE_IPS=true`)
- Do Not Track header respect (`RESPECT_DNT=true`)
- Admin IP exclusion

Configure these in the backend `.env` file.

## Testing

### Development Testing

1. Start your analytics backend:
   ```bash
   cd visitor-analytics
   docker-compose up
   ```

2. Start your Next.js app:
   ```bash
   cd my-portfolio
   npm run dev
   ```

3. Visit `http://localhost:3000`

4. Check:
   - Browser console for tracking logs (if debug enabled)
   - Discord channel for notification
   - Backend logs: `docker-compose logs -f`

### Production Testing

Before deploying:

1. ✅ Set `NEXT_PUBLIC_ANALYTICS_API` to your production URL
2. ✅ Configure CORS in backend with production domain
3. ✅ Set up HTTPS for the analytics API
4. ✅ Test Discord notifications work
5. ✅ Verify your admin IP is excluded
6. ✅ Test with different browsers and devices

## Troubleshooting

### "Failed to fetch" errors

**Problem:** Browser console shows fetch errors

**Solutions:**
- Verify `NEXT_PUBLIC_ANALYTICS_API` is correct
- Check analytics backend is running
- Ensure CORS is configured correctly
- Check browser network tab for exact error

### No data being tracked

**Problem:** No visitors showing in Discord

**Solutions:**
- Check `NEXT_PUBLIC_ANALYTICS_ENABLED=true`
- Verify component is mounted (check React DevTools)
- Open browser console - tracking logs should appear in debug mode
- Check if your IP is in `ADMIN_IPS` exclusion list
- Verify Do Not Track is not blocking you

### Tracker conflicts with other analytics

**Problem:** Multiple analytics tools interfering

**Solution:** Ensure trackers load in correct order:
```tsx
<body>
  {children}
  {/* Load your tracker last */}
  <GoogleAnalytics />
  <PlausibleAnalytics />
  <VisitorTracker />
</body>
```

### Build errors

**Problem:** Next.js build fails

**Solutions:**
- Ensure component is marked `'use client'`
- Check all imports are correct
- Verify TypeScript types if using TypeScript

## Performance Impact

The tracker is designed to be lightweight:

- **Bundle size:** ~3KB gzipped
- **Network:** Single POST request per page view
- **Runtime:** Minimal - runs after page load
- **Storage:** Single localStorage item

The tracker:
- Does not block page rendering
- Sends data asynchronously
- Uses `sendBeacon` for page unload
- Has no external dependencies

## Migration from Other Analytics

### From Google Analytics

The tracker captures similar data to GA4:
- Page views → Automatic
- Referrers → Automatic
- UTM parameters → Automatic
- User engagement → Time spent & scroll depth

You can run both simultaneously if needed.

### From Plausible/Umami

Similar tracking approach:
- Privacy-friendly ✓
- Self-hosted ✓
- Lightweight ✓
- No cookies required ✓

Main difference: Discord integration for real-time notifications.

## Next Steps

After integration:
1. Monitor Discord channel for incoming visitors
2. Try Discord slash commands to query data
3. Consider building a dashboard using `/api/stats/summary`
4. Set up database backups
5. Configure privacy settings as needed

## Custom Events (Future Enhancement)

While not implemented yet, you can extend the tracker for custom events:

```tsx
// Add to VisitorTracker.tsx
export const trackEvent = async (eventName: string, data?: any) => {
  await fetch(`${apiUrl}/api/track-event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fingerprint: getFingerprint(),
      event: eventName,
      data,
      timestamp: Date.now()
    })
  });
};
```

Then use it anywhere in your app:
```tsx
import { trackEvent } from './_components/VisitorTracker';

// Track button clicks
<button onClick={() => trackEvent('cta_click', { button: 'signup' })}>
  Sign Up
</button>
```
