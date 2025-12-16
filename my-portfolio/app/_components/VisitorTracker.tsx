'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface TrackerConfig {
  apiUrl: string;
  enabled?: boolean;
  debug?: boolean;
}

const defaultConfig: TrackerConfig = {
  apiUrl: '/api/track',
  enabled: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== 'false',
  debug: process.env.NODE_ENV === 'development'
};

export default function VisitorTracker({ config = defaultConfig }: { config?: Partial<TrackerConfig> }) {
  const pathname = usePathname();
  const startTimeRef = useRef<number>(Date.now());
  const maxScrollDepthRef = useRef<number>(0);
  const sentRef = useRef<boolean>(false);

  const finalConfig = { ...defaultConfig, ...config };

  useEffect(() => {
    if (!finalConfig.enabled) return;

    // Generate or retrieve visitor fingerprint
    const getFingerprint = (): string => {
      const stored = localStorage.getItem('visitor_fingerprint');
      if (stored) return stored;

      const fingerprint = generateFingerprint();
      localStorage.setItem('visitor_fingerprint', fingerprint);
      return fingerprint;
    };

    const generateFingerprint = (): string => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('fingerprint', 2, 2);
      }

      const components = [
        navigator.userAgent,
        navigator.language,
        screen.colorDepth,
        screen.width,
        screen.height,
        new Date().getTimezoneOffset(),
        canvas.toDataURL()
      ];

      return btoa(components.join('|')).substring(0, 32);
    };

    const getScrollDepth = (): number => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      return Math.min(Math.round(scrollPercent), 100);
    };

    const trackScrollDepth = () => {
      const currentDepth = getScrollDepth();
      if (currentDepth > maxScrollDepthRef.current) {
        maxScrollDepthRef.current = currentDepth;
      }
    };

    const getGPUInfo = (): { renderer: string | null; vendor: string | null } => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) return { renderer: null, vendor: null };

        const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
        if (!debugInfo) return { renderer: null, vendor: null };

        return {
          renderer: (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
          vendor: (gl as any).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
        };
      } catch {
        return { renderer: null, vendor: null };
      }
    };

    const sendTrackingData = async () => {
      if (sentRef.current) return;

      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const gpu = getGPUInfo();

      const data = {
        fingerprint: getFingerprint(),
        page_url: window.location.href,
        page_title: document.title,
        referrer: document.referrer,
        screen_resolution: `${screen.width}x${screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        time_spent: timeSpent,
        scroll_depth: maxScrollDepthRef.current,
        // Extended device info
        platform: navigator.platform,
        cpu_cores: (navigator as any).hardwareConcurrency || null,
        device_memory: (navigator as any).deviceMemory || null,
        pixel_ratio: window.devicePixelRatio || 1,
        // Browser capabilities
        cookies_enabled: navigator.cookieEnabled,
        online: navigator.onLine,
        pdf_viewer: navigator.pdfViewerEnabled || null,
        // GPU info
        gpu_renderer: gpu.renderer,
        gpu_vendor: gpu.vendor
      };

      if (finalConfig.debug) {
        console.log('📊 Tracking data:', data);
      }

      try {
        const response = await fetch(finalConfig.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          sentRef.current = true;
          if (finalConfig.debug) {
            const result = await response.json();
            console.log('✅ Tracking successful:', result);
          }
        }
      } catch (error) {
        if (finalConfig.debug) {
          console.error('❌ Tracking error:', error);
        }
      }
    };

    // Track scroll depth
    window.addEventListener('scroll', trackScrollDepth);
    trackScrollDepth();

    // Send tracking data after a delay (to capture initial scroll)
    const trackingTimer = setTimeout(() => {
      sendTrackingData();
    }, 2000);

    // Send data before page unload
    const handleBeforeUnload = () => {
      if (!sentRef.current) {
        const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const gpu = getGPUInfo();

        const data = {
          fingerprint: getFingerprint(),
          page_url: window.location.href,
          page_title: document.title,
          referrer: document.referrer,
          screen_resolution: `${screen.width}x${screen.height}`,
          viewport_size: `${window.innerWidth}x${window.innerHeight}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language,
          time_spent: timeSpent,
          scroll_depth: maxScrollDepthRef.current,
          // Extended device info
          platform: navigator.platform,
          cpu_cores: (navigator as any).hardwareConcurrency || null,
          device_memory: (navigator as any).deviceMemory || null,
          pixel_ratio: window.devicePixelRatio || 1,
          // Browser capabilities
          cookies_enabled: navigator.cookieEnabled,
          online: navigator.onLine,
          pdf_viewer: navigator.pdfViewerEnabled || null,
          // GPU info
          gpu_renderer: gpu.renderer,
          gpu_vendor: gpu.vendor
        };

        // Use sendBeacon for reliable tracking on page unload
        navigator.sendBeacon(
          finalConfig.apiUrl,
          JSON.stringify(data)
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('scroll', trackScrollDepth);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearTimeout(trackingTimer);
    };
  }, [pathname, finalConfig.apiUrl, finalConfig.enabled, finalConfig.debug]);

  return null;
}
