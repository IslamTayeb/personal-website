#!/bin/bash
# Test script for enhanced tracking

echo "Testing Enhanced Visitor Analytics..."
echo ""

# Test data with all new fields
curl -X POST http://localhost:3001/api/track \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15" \
  -d '{
    "fingerprint": "test-fingerprint-enhanced-123",
    "page_url": "https://example.com/test-enhanced",
    "page_title": "Enhanced Tracking Test",
    "referrer": "https://google.com",
    "screen_resolution": "1710x1107",
    "viewport_size": "1200x800",
    "timezone": "America/New_York",
    "language": "en-US",
    "time_spent": 30,
    "scroll_depth": 75,
    "platform": "MacIntel",
    "cpu_cores": 8,
    "device_memory": 16,
    "pixel_ratio": 2,
    "cookies_enabled": true,
    "online": true,
    "pdf_viewer": true,
    "gpu_renderer": "Apple GPU",
    "gpu_vendor": "Apple Inc."
  }'

echo ""
echo ""
echo "✅ Test complete! Check your Discord channel for the enhanced notification."
echo ""
echo "Expected categories in Discord:"
echo "  📱 Browser & Network"
echo "  🌐 ISP & Organization"
echo "  🔗 Network Information"
echo "  📍 Location Details"
echo "  💻 System Resources"
echo "  🖥️ Device Hardware"
echo "  🎨 GPU & Graphics"
echo "  📄 Page Visited"
