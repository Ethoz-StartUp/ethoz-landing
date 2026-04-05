import { browser } from '$app/environment';

export interface DeviceMetadata {
  device: string;
  os: string;
  browser: string;
  screen: string;
  language: string;
  referrer: string;
  url: string;
  timestamp: string;
  timezone: string;
}

export function getDeviceMetadata(): DeviceMetadata | null {
  if (!browser) return null;

  const ua = navigator.userAgent;

  return {
    device: getDeviceType(ua),
    os: getOS(ua),
    browser: getBrowser(ua),
    screen: `${screen.width}x${screen.height}`,
    language: navigator.language,
    referrer: document.referrer || 'directo',
    url: window.location.href,
    timestamp: new Date().toISOString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

function getDeviceType(ua: string): string {
  if (/iPad|tablet/i.test(ua)) return 'Tablet';
  if (/Mobile|Android|iPhone/i.test(ua)) return 'Mobile';
  return 'Desktop';
}

function getOS(ua: string): string {
  if (/Windows/i.test(ua)) return 'Windows';
  if (/Mac OS X/i.test(ua)) return 'macOS';
  if (/iPhone|iPad/i.test(ua)) return 'iOS';
  if (/Android/i.test(ua)) return 'Android';
  if (/Linux/i.test(ua)) return 'Linux';
  return 'Otro';
}

function getBrowser(ua: string): string {
  if (/Edg\//i.test(ua)) return 'Edge';
  if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) return 'Chrome';
  if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return 'Safari';
  if (/Firefox/i.test(ua)) return 'Firefox';
  return 'Otro';
}
