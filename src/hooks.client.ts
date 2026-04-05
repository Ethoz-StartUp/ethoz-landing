import { initSentry } from '$lib/sentry';
import * as Sentry from '@sentry/browser';

// Initialize Sentry
initSentry();

// SvelteKit client error handler
export function handleError({ error, event }: { error: unknown; event: any }) {
  const err = error instanceof Error ? error : new Error(String(error));

  console.error('[App Error]', err.message, {
    url: event?.url?.pathname,
    stack: err.stack,
  });

  // Send to Sentry if initialized
  try {
    Sentry.captureException(err, {
      extra: { url: event?.url?.pathname },
    });
  } catch {
    // Sentry not initialized — that's fine
  }

  return {
    message: 'Ha ocurrido un error inesperado.',
  };
}
