import { describe, it, expect, beforeEach, vi } from 'vitest';
import { isTestEmail, isInternal, checkInternalFlag } from './internal';

beforeEach(() => {
  localStorage.clear();
  // Reset window.location search
  Object.defineProperty(window, 'location', {
    writable: true,
    value: { search: '', pathname: '/', href: 'http://localhost/', replace: vi.fn() },
  });
  Object.defineProperty(window, 'history', {
    writable: true,
    value: { replaceState: vi.fn() },
  });
});

describe('isTestEmail', () => {
  it('returns true for known test email', () => {
    expect(isTestEmail('ignacioaraya1995@gmail.com')).toBe(true);
  });

  it('returns true regardless of case/whitespace', () => {
    expect(isTestEmail('  IGNACIOARAYA1995@GMAIL.COM  ')).toBe(true);
  });

  it('returns false for unknown email', () => {
    expect(isTestEmail('someone@example.com')).toBe(false);
  });
});

describe('isInternal', () => {
  it('returns false when localStorage flag is not set', () => {
    expect(isInternal()).toBe(false);
  });

  it('returns true when localStorage flag is set to "1"', () => {
    localStorage.setItem('ethoz_internal', '1');
    expect(isInternal()).toBe(true);
  });

  it('returns false when localStorage flag is set to something else', () => {
    localStorage.setItem('ethoz_internal', 'true');
    expect(isInternal()).toBe(false);
  });
});

describe('checkInternalFlag', () => {
  it('sets localStorage flag when ?_internal=1 is in URL', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        search: '?_internal=1',
        pathname: '/',
        href: 'http://localhost/?_internal=1',
      },
    });
    checkInternalFlag();
    expect(localStorage.getItem('ethoz_internal')).toBe('1');
  });

  it('removes localStorage flag when ?_internal=0 is in URL', () => {
    localStorage.setItem('ethoz_internal', '1');
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        search: '?_internal=0',
        pathname: '/',
        href: 'http://localhost/?_internal=0',
      },
    });
    checkInternalFlag();
    expect(localStorage.getItem('ethoz_internal')).toBeNull();
  });

  it('does nothing when no _internal param in URL', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        search: '',
        pathname: '/',
        href: 'http://localhost/',
      },
    });
    checkInternalFlag();
    expect(localStorage.getItem('ethoz_internal')).toBeNull();
  });
});
