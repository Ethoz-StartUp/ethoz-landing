import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';
import { getConsent } from '$lib/stores/consent.svelte';

let initialized = false;

const EXTENSION_SCHEMES = [
  'chrome-extension://',
  'moz-extension://',
  'safari-extension://',
  'safari-web-extension://',
  'ms-browser-extension://',
];

function isExtensionError(event: any): boolean {
  const frames: any[] =
    event?.exception?.values?.flatMap((v: any) => v?.stacktrace?.frames ?? []) ?? [];
  const innermost = frames[frames.length - 1];
  const file: string = innermost?.filename || innermost?.abs_path || event?.culprit || '';
  if (EXTENSION_SCHEMES.some((s) => file.startsWith(s))) return true;
  // Safari masks extension scripts behind this scheme — never actionable for us.
  return file.startsWith('webkit-masked-url://');
}

function scrubFromSentry(event: any): any {
  // Strip request body + form breadcrumbs (may contain PII)
  if (event?.request?.data) delete event.request.data;
  if (Array.isArray(event?.breadcrumbs)) {
    event.breadcrumbs = event.breadcrumbs.map((b: any) => {
      if (b?.category === 'ui.input') {
        return { ...b, message: '[redacted]', data: undefined };
      }
      return b;
    });
  }
  return event;
}

export async function initSentry(): Promise<void> {
  if (!browser || initialized) return;

  const dsn = env.PUBLIC_SENTRY_DSN;
  if (!dsn) {
    console.info('[Sentry] No DSN configured — error monitoring disabled');
    return;
  }

  try {
    const Sentry = await import('@sentry/browser');
    const replayAllowed = getConsent().analytics === true;
    Sentry.init({
      dsn,
      environment: window.location.hostname === 'ethoz.cl' ? 'production' : 'development',
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: replayAllowed ? 0.5 : 0,
      // Replay is registered only with analytics consent, so its rrweb
      // instrumentation never even initializes for non-consenting visitors.
      // NOTE on bundle weight: the rrweb code itself cannot be split out of
      // this chunk today. Vite wraps every dynamic import('@sentry/browser')
      // (marketing.ts, demo/[rbd], contact, schedule) in its preload helper,
      // which hides the namespace from Rollup, so the full export surface
      // (including the replay re-export) is always retained. Splitting it
      // requires converting those call sites to named imports first;
      // Sentry.lazyLoadIntegration is no help either: it fetches from the
      // Sentry CDN, which our CSP script-src blocks.
      integrations: replayAllowed
        ? [
            Sentry.replayIntegration({
              maskAllText: true,
              maskAllInputs: true,
              blockAllMedia: true,
            }),
          ]
        : [],
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
    initialized = true;
    console.info('[Sentry] ✔ Error monitoring active (replay=' + (replayAllowed ? 'on' : 'off') + ')');
  } catch (err) {
    console.warn('[Sentry] Failed to initialize:', err);
  }
}
