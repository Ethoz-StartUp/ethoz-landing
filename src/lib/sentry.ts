import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';

type SentryClient = typeof import('$lib/sentry-client');

export type SentryBreadcrumb = {
  category?: string;
  message?: string;
  level?: 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';
  data?: Record<string, unknown>;
};

let client: SentryClient | null = null;
let initialization: Promise<SentryClient | null> | null = null;
let disabledLogged = false;

const EXTENSION_SCHEMES = [
  'chrome-extension://',
  'moz-extension://',
  'safari-extension://',
  'safari-web-extension://',
  'ms-browser-extension://',
];

function isExtensionError(event: any): boolean {
  const frames: any[] =
    event?.exception?.values?.flatMap((value: any) => value?.stacktrace?.frames ?? []) ?? [];
  const innermost = frames[frames.length - 1];
  const file: string = innermost?.filename || innermost?.abs_path || event?.culprit || '';
  if (EXTENSION_SCHEMES.some((scheme) => file.startsWith(scheme))) return true;
  return file.startsWith('webkit-masked-url://');
}

function stripUrlDetails(value: string): string {
  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname}`;
  } catch {
    return value.split(/[?#]/, 1)[0] ?? '';
  }
}

const SENSITIVE_EXTRA_KEY = /(^|_)(authorization|cookie|email|mail|name|nombre|apellido|phone|telefono|school|colegio|token|password|secret|notes?)($|_)/i;
const EMAIL_VALUE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE_VALUE = /(\+?56\s?9\s?\d{4}\s?\d{4})|(\+?\d[\d\s-]{7,})/;

function scrubExtraValue(value: unknown, key = '', depth = 0): unknown {
  if (SENSITIVE_EXTRA_KEY.test(key)) return '[redacted]';
  if (typeof value === 'string') {
    if (EMAIL_VALUE.test(value) || PHONE_VALUE.test(value)) return '[redacted]';
    if (/^(url|href|from|to)$/i.test(key)) return stripUrlDetails(value);
    return value;
  }
  if (depth >= 5) return '[truncated]';
  if (Array.isArray(value)) {
    return value.map((item) => scrubExtraValue(item, '', depth + 1));
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([childKey, childValue]) => [
        childKey,
        scrubExtraValue(childValue, childKey, depth + 1),
      ])
    );
  }
  return value;
}

export function scrubSentryEvent(event: any): any {
  if (event?.request) {
    if (event.request.data) delete event.request.data;
    if (event.request.query_string) delete event.request.query_string;
    if (typeof event.request.url === 'string') {
      event.request.url = stripUrlDetails(event.request.url);
    }
    if (event.request.headers && typeof event.request.headers === 'object') {
      for (const header of Object.keys(event.request.headers)) {
        if (/^(authorization|cookie|set-cookie|x-api-key)$/i.test(header)) {
          delete event.request.headers[header];
        }
      }
    }
  }
  if (Array.isArray(event?.breadcrumbs)) {
    event.breadcrumbs = event.breadcrumbs.map((breadcrumb: any) => {
      if (breadcrumb?.category === 'ui.input') {
        return { ...breadcrumb, message: '[redacted]', data: undefined };
      }
      if (!breadcrumb?.data || typeof breadcrumb.data !== 'object') return breadcrumb;
      const data = { ...breadcrumb.data };
      for (const [key, value] of Object.entries(data)) {
        if (/^(body|data|request_body)$/i.test(key)) {
          data[key] = '[redacted]';
        } else if (typeof value === 'string' && /^(url|href|from|to)$/i.test(key)) {
          data[key] = stripUrlDetails(value);
        }
      }
      return { ...breadcrumb, data };
    });
  }
  if (event?.extra && typeof event.extra === 'object') {
    event.extra = scrubExtraValue(event.extra);
  }
  return event;
}

async function initializeClient(): Promise<SentryClient | null> {
  if (!browser) return null;
  if (client) return client;

  const dsn = env.PUBLIC_SENTRY_DSN;
  if (!dsn) {
    if (!disabledLogged) {
      disabledLogged = true;
      console.info('[Sentry] No DSN configured, error monitoring disabled');
    }
    return null;
  }

  try {
    // This small facade uses named imports so Rollup can discard tracing,
    // replay and the rest of Sentry's unused public export surface.
    const Sentry = await import('$lib/sentry-client');
    Sentry.init({
      dsn,
      environment: window.location.hostname === 'ethoz.cl' ? 'production' : 'development',
      sendDefaultPii: false,
      maxBreadcrumbs: 30,
      beforeSend(event) {
        if (typeof localStorage !== 'undefined' && localStorage.getItem('ethoz_internal') === '1') return null;
        const ua = (event.request?.headers?.['User-Agent'] as string | undefined) ?? '';
        const url = event.request?.url ?? '';
        if (ua.includes('HeadlessChrome') || ua.includes('Playwright')) return null;
        if (url.startsWith('http://localhost') || url.startsWith('http://127.0.0.1')) return null;
        if (isExtensionError(event)) return null;
        return scrubSentryEvent(event);
      },
    });
    client = Sentry;
    console.info('[Sentry] Error monitoring active');
    return client;
  } catch (error) {
    console.warn('[Sentry] Failed to initialize:', error);
    return null;
  }
}

export async function initSentry(): Promise<void> {
  if (!browser || client) return;
  initialization ??= initializeClient();
  await initialization;
}

export function captureException(error: unknown, context?: Record<string, unknown>): void {
  if (!browser) return;
  initialization ??= initializeClient();
  void initialization.then((Sentry) => {
    Sentry?.captureException(error, { extra: context });
  });
}

export function addBreadcrumb(breadcrumb: SentryBreadcrumb): void {
  // Breadcrumbs should never trigger a large monitoring download while a
  // visitor is submitting a form. They are useful only once idle init ran.
  client?.addBreadcrumb(breadcrumb);
}
