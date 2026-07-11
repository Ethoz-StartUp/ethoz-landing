<svelte:head>
  <meta property="og:site_name" content={BRAND} />
  <meta property="og:locale" content="es_CL" />
  <meta name="application-name" content={BRAND} />
</svelte:head>

<script lang="ts">
  import '../app.css';
  import { BRAND } from '$lib/brand';
  import { env } from '$env/dynamic/public';
  import { checkInternalFlag, isInternal } from '$lib/utils/internal';
  import { identifyVisitor } from '$lib/utils/visitor';
  import { getConsent } from '$lib/stores/consent.svelte';
  import { flushPendingEvents } from '$lib/utils/analytics';
  import { loadGtm } from '$lib/trackers/gtm';
  import { loadClarity } from '$lib/trackers/clarity';
  import { captureAttribution } from '$lib/utils/attribution';
  import ConsentBanner from '$lib/components/ConsentBanner.svelte';

  let { children } = $props();
  const feedbackEnabled = env.PUBLIC_FEEDBACK_MODE === 'true';

  type IdleWindow = Window & {
    requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
    cancelIdleCallback?: (id: number) => void;
  };

  function scheduleWhenIdle(task: () => void, delay = 0): () => void {
    const idleWindow = window as IdleWindow;
    let idleId: number | undefined;
    let delayId: ReturnType<typeof setTimeout> | undefined;
    let fallbackId: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const scheduleIdleCallback = () => {
      if (cancelled) return;
      if (idleWindow.requestIdleCallback) {
        idleId = idleWindow.requestIdleCallback(task, { timeout: 4000 });
      } else {
        fallbackId = setTimeout(task, 1500);
      }
    };

    const run = () => {
      delayId = setTimeout(scheduleIdleCallback, delay);
    };

    if (document.readyState === 'complete') run();
    else window.addEventListener('load', run, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener('load', run);
      if (idleId !== undefined) idleWindow.cancelIdleCallback?.(idleId);
      if (delayId !== undefined) clearTimeout(delayId);
      if (fallbackId !== undefined) clearTimeout(fallbackId);
    };
  }

  $effect(() => {
    if (typeof window === 'undefined') return;
    checkInternalFlag();
    captureAttribution();
    return scheduleWhenIdle(() => {
      void import('$lib/sentry')
        .then(({ initSentry }) => initSentry())
        .catch(() => {});
    }, 6000);
  });

  $effect(() => {
    const c = getConsent();
    if (typeof window === 'undefined') return;
    if (isInternal()) return;
    if (!c.analytics) return;

    // Consent is active, so move buffered events into the first-party
    // dataLayer immediately. The remote tracker scripts can consume them
    // later without delaying consent feedback or losing navigation events.
    flushPendingEvents();

    let identifyTimer: ReturnType<typeof setTimeout> | undefined;
    const cancel = scheduleWhenIdle(() => {
      // Consent or the internal flag can change while this task is queued.
      if (!getConsent().analytics || isInternal()) return;
      loadGtm();
      loadClarity();
      identifyTimer = setTimeout(() => identifyVisitor(), 1000);
    }, 1500);

    return () => {
      cancel();
      if (identifyTimer !== undefined) clearTimeout(identifyTimer);
    };
  });
</script>

<div class="min-h-screen overflow-x-hidden bg-background text-foreground antialiased">
  {@render children()}
  {#if feedbackEnabled}
    {#await import('$lib/components/FeedbackOverlay.svelte') then { default: FeedbackOverlay }}
      <FeedbackOverlay />
    {/await}
  {/if}
  <ConsentBanner />
</div>
