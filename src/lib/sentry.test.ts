import { describe, expect, it } from 'vitest';
import { scrubSentryEvent } from './sentry';

describe('scrubSentryEvent', () => {
  it('removes URL parameters, request payloads, and sensitive headers', () => {
    const event = scrubSentryEvent({
      request: {
        url: 'https://ethoz.cl/demo?utm_source=test&email=user@example.com#form',
        query_string: 'utm_source=test',
        data: { contact_email: 'user@example.com' },
        headers: {
          Authorization: 'Bearer secret',
          Cookie: 'session=secret',
          'User-Agent': 'Browser',
        },
      },
    });

    expect(event.request.url).toBe('https://ethoz.cl/demo');
    expect(event.request).not.toHaveProperty('query_string');
    expect(event.request).not.toHaveProperty('data');
    expect(event.request.headers).toEqual({ 'User-Agent': 'Browser' });
  });

  it('redacts input and sanitizes URL-like breadcrumb fields', () => {
    const event = scrubSentryEvent({
      breadcrumbs: [
        { category: 'ui.input', message: 'user@example.com', data: { value: 'secret' } },
        {
          category: 'fetch',
          data: {
            url: 'https://ethoz.cl/contacto?email=user@example.com',
            body: 'contact_email=user@example.com',
            status_code: 500,
          },
        },
      ],
    });

    expect(event.breadcrumbs[0]).toEqual({
      category: 'ui.input',
      message: '[redacted]',
      data: undefined,
    });
    expect(event.breadcrumbs[1].data).toEqual({
      url: 'https://ethoz.cl/contacto',
      body: '[redacted]',
      status_code: 500,
    });
  });

  it('recursively redacts lead details from exception context', () => {
    const event = scrubSentryEvent({
      extra: {
        fn: 'saveLead',
        school: 'Colegio de Prueba',
        email: 'us***@example.com',
        nested: {
          contact_phone: '+56 9 1234 5678',
          url: 'https://ethoz.cl/demo?utm_source=test',
        },
      },
    });

    expect(event.extra).toEqual({
      fn: 'saveLead',
      school: '[redacted]',
      email: '[redacted]',
      nested: {
        contact_phone: '[redacted]',
        url: 'https://ethoz.cl/demo',
      },
    });
  });
});
