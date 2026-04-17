import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';
import { getConsent } from '$lib/stores/consent.svelte';

let initialized = false;

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
      integrations: [
        Sentry.replayIntegration({
          maskAllText: true,
          maskAllInputs: true,
          blockAllMedia: true,
        }),
      ],
      beforeSend(event) {
        if (typeof localStorage !== 'undefined' && localStorage.getItem('ethoz_internal') === '1') return null;
        const ua = (event.request?.headers?.['User-Agent'] as string | undefined) ?? '';
        const url = event.request?.url ?? '';
        if (ua.includes('HeadlessChrome') || ua.includes('Playwright')) return null;
        if (url.startsWith('http://localhost') || url.startsWith('http://127.0.0.1')) return null;
        return scrubFromSentry(event);
      },
    });
    initialized = true;
    console.info('[Sentry] ✔ Error monitoring active (replay=' + (replayAllowed ? 'on' : 'off') + ')');
  } catch (err) {
    console.warn('[Sentry] Failed to initialize:', err);
  }
}
