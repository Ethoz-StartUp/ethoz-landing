// SvelteKit client error handler
export function handleError({ error, event }: { error: unknown; event: any }) {
  const err = error instanceof Error ? error : new Error(String(error));

  console.error('[App Error]', err.message, {
    url: event?.url?.pathname,
    stack: err.stack,
  });

  // An actual client error is the one path allowed to bypass idle loading.
  void import('$lib/sentry')
    .then(({ captureException }) => captureException(err, { url: event?.url?.pathname }))
    .catch(() => {});

  return {
    message: 'Ha ocurrido un error inesperado.',
  };
}
