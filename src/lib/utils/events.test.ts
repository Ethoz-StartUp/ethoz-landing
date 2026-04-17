import { describe, it, expect } from 'vitest';
import { scrubEvent } from './events';

describe('scrubEvent', () => {
  it('removes email-shaped values', () => {
    const out = scrubEvent({ email: 'a@b.com', source: 'home' });
    expect(out).not.toHaveProperty('email');
    expect(out.source).toBe('home');
  });

  it('removes phone-shaped values (chilean +56 9 ####)', () => {
    const out = scrubEvent({ phone: '+56912345678', name: 'Ana' });
    expect(out).not.toHaveProperty('phone');
    expect(out).not.toHaveProperty('name');
  });

  it('removes common PII keys by name even if the value is safe', () => {
    const out = scrubEvent({ email: 'n/a', first_name: 'Ana', rut: '12345678-9', source: 'x' });
    expect(out).not.toHaveProperty('email');
    expect(out).not.toHaveProperty('first_name');
    expect(out).not.toHaveProperty('rut');
    expect(out.source).toBe('x');
  });

  it('keeps primitives that look safe', () => {
    const out = scrubEvent({ source: 'contact_page', count: 3, ok: true });
    expect(out).toEqual({ source: 'contact_page', count: 3, ok: true });
  });

  it('drops values that embed an email substring', () => {
    const out = scrubEvent({ message: 'contact me at foo@bar.com please' });
    expect(out).not.toHaveProperty('message');
  });

  it('returns a new object, not the input', () => {
    const input = { source: 'home' };
    const out = scrubEvent(input);
    expect(out).not.toBe(input);
  });
});
