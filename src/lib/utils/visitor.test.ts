import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getVisitorId, identifyGA4, identifyClarity } from './visitor';

beforeEach(() => {
  localStorage.clear();
  // Reset window globals
  (window as any).dataLayer = undefined;
  (window as any).clarity = undefined;
});

describe('getVisitorId', () => {
  it('creates a UUID on first call', () => {
    const vid = getVisitorId();
    expect(vid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  it('returns the same UUID on subsequent calls', () => {
    const first = getVisitorId();
    const second = getVisitorId();
    expect(first).toBe(second);
  });

  it('persists UUID to localStorage', () => {
    const vid = getVisitorId();
    expect(localStorage.getItem('ethoz_vid')).toBe(vid);
  });

  it('reuses existing UUID from localStorage', () => {
    const existing = 'aaaabbbb-cccc-4ddd-8eee-ffffffffffff';
    localStorage.setItem('ethoz_vid', existing);
    expect(getVisitorId()).toBe(existing);
  });
});

describe('identifyGA4', () => {
  it('pushes user_id and ethoz_visitor_id to dataLayer when present', () => {
    (window as any).dataLayer = [];
    identifyGA4('test-vid');
    expect((window as any).dataLayer).toContainEqual({ user_id: 'test-vid', ethoz_visitor_id: 'test-vid' });
  });

  it('does nothing when dataLayer is not defined', () => {
    // Should not throw
    expect(() => identifyGA4('test-vid')).not.toThrow();
  });

  it('does nothing when vid is empty', () => {
    (window as any).dataLayer = [];
    identifyGA4('');
    expect((window as any).dataLayer).toHaveLength(0);
  });
});

describe('identifyClarity', () => {
  it('calls clarity("identify", vid) when clarity is available', () => {
    const mockClarity = vi.fn();
    (window as any).clarity = mockClarity;
    identifyClarity('test-vid');
    expect(mockClarity).toHaveBeenCalledWith('identify', 'test-vid');
  });

  it('does nothing when clarity is not defined', () => {
    expect(() => identifyClarity('test-vid')).not.toThrow();
  });

  it('does nothing when vid is empty', () => {
    const mockClarity = vi.fn();
    (window as any).clarity = mockClarity;
    identifyClarity('');
    expect(mockClarity).not.toHaveBeenCalled();
  });
});
