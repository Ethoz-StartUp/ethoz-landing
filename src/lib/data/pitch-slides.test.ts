import { describe, it, expect } from 'vitest';
import { pitchSlides, getDaysUntilEnforcement, ENFORCEMENT_DATE } from './pitch-slides';

describe('pitchSlides', () => {
  it('has at least one slide', () => {
    expect(pitchSlides.length).toBeGreaterThan(0);
  });

  it('slides are sorted by start time', () => {
    for (let i = 1; i < pitchSlides.length; i++) {
      expect(pitchSlides[i].start).toBeGreaterThanOrEqual(pitchSlides[i - 1].start);
    }
  });

  it('slides are contiguous (each start === previous end)', () => {
    for (let i = 1; i < pitchSlides.length; i++) {
      expect(pitchSlides[i].start).toBe(pitchSlides[i - 1].end);
    }
  });

  it('first slide starts at 0', () => {
    expect(pitchSlides[0].start).toBe(0);
  });

  it('every slide has a non-empty id', () => {
    for (const slide of pitchSlides) {
      expect(slide.id.trim().length).toBeGreaterThan(0);
    }
  });

  it('every slide has a non-empty subtitle', () => {
    for (const slide of pitchSlides) {
      expect(slide.subtitle.trim().length).toBeGreaterThan(0);
    }
  });

  it('all slide ids are unique', () => {
    const ids = pitchSlides.map(s => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('getDaysUntilEnforcement', () => {
  it('returns a non-negative number', () => {
    expect(getDaysUntilEnforcement()).toBeGreaterThanOrEqual(0);
  });

  it('returns an integer', () => {
    const days = getDaysUntilEnforcement();
    expect(days).toBe(Math.floor(days));
  });
});

describe('ENFORCEMENT_DATE', () => {
  it('is a valid date string', () => {
    expect(new Date(ENFORCEMENT_DATE).getTime()).not.toBeNaN();
  });

  it('targets December 2026', () => {
    const d = new Date(ENFORCEMENT_DATE);
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(11); // December = 11
  });
});
