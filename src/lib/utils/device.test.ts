import { describe, it, expect, beforeEach } from 'vitest';
import { getDeviceMetadata } from './device';

function setUA(ua: string) {
  Object.defineProperty(navigator, 'userAgent', {
    writable: true,
    configurable: true,
    value: ua,
  });
}

beforeEach(() => {
  // Reset to a neutral desktop UA
  setUA('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36');
  Object.defineProperty(window, 'location', {
    writable: true,
    configurable: true,
    value: { href: 'http://localhost/' },
  });
  Object.defineProperty(document, 'referrer', {
    writable: true,
    configurable: true,
    value: '',
  });
});

describe('getDeviceMetadata', () => {
  it('returns an object with the expected keys', () => {
    const meta = getDeviceMetadata();
    expect(meta).not.toBeNull();
    expect(meta).toHaveProperty('device');
    expect(meta).toHaveProperty('os');
    expect(meta).toHaveProperty('browser');
    expect(meta).toHaveProperty('screen');
    expect(meta).toHaveProperty('language');
    expect(meta).toHaveProperty('referrer');
    expect(meta).toHaveProperty('url');
    expect(meta).toHaveProperty('timestamp');
    expect(meta).toHaveProperty('timezone');
  });

  it('uses "directo" when document.referrer is empty', () => {
    const meta = getDeviceMetadata();
    expect(meta?.referrer).toBe('directo');
  });

  it('uses document.referrer when present', () => {
    Object.defineProperty(document, 'referrer', {
      writable: true,
      configurable: true,
      value: 'https://google.com',
    });
    const meta = getDeviceMetadata();
    expect(meta?.referrer).toBe('https://google.com');
  });
});

describe('device type detection', () => {
  it('detects Desktop for standard desktop UA', () => {
    setUA('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120');
    expect(getDeviceMetadata()?.device).toBe('Desktop');
  });

  it('detects Mobile for iPhone UA', () => {
    setUA('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile/15E148');
    expect(getDeviceMetadata()?.device).toBe('Mobile');
  });

  it('detects Mobile for Android UA', () => {
    setUA('Mozilla/5.0 (Linux; Android 13; Pixel 7) Mobile Safari/537.36');
    expect(getDeviceMetadata()?.device).toBe('Mobile');
  });

  it('detects Tablet for iPad UA', () => {
    setUA('Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15');
    expect(getDeviceMetadata()?.device).toBe('Tablet');
  });
});

describe('OS detection', () => {
  it('detects macOS', () => {
    setUA('Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 Chrome/120');
    expect(getDeviceMetadata()?.os).toBe('macOS');
  });

  it('detects Windows', () => {
    setUA('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120');
    expect(getDeviceMetadata()?.os).toBe('Windows');
  });

  it('detects iOS for iPhone (no Mac OS X in UA)', () => {
    setUA('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) Mobile/15E148');
    expect(getDeviceMetadata()?.os).toBe('iOS');
  });

  it('detects Android', () => {
    setUA('Mozilla/5.0 (Linux; Android 13; Pixel 7) Mobile Safari/537.36');
    expect(getDeviceMetadata()?.os).toBe('Android');
  });

  it('detects Linux', () => {
    setUA('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120');
    expect(getDeviceMetadata()?.os).toBe('Linux');
  });
});

describe('browser detection', () => {
  it('detects Chrome', () => {
    setUA('Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    expect(getDeviceMetadata()?.browser).toBe('Chrome');
  });

  it('detects Safari (no Chrome in UA)', () => {
    setUA('Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15');
    expect(getDeviceMetadata()?.browser).toBe('Safari');
  });

  it('detects Firefox', () => {
    setUA('Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0');
    expect(getDeviceMetadata()?.browser).toBe('Firefox');
  });

  it('detects Edge', () => {
    setUA('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0');
    expect(getDeviceMetadata()?.browser).toBe('Edge');
  });
});
