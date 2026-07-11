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

function scrubFromSentry(event: any): any {
  if (event?.request?.data) delete event.request.data;
  if (Array.isArray(event?.breadcrumbs)) {
    event.breadcrumbs = event.breadcrumbs.map((breadcrumb: any) => {
      if (breadcrumb?.category === 'ui.input') {
        return { ...breadcrumb, message: '[redacted]', data: undefined };
      }
      return breadcrumb;
    });
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
        return scrubFromSentry(event);
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
