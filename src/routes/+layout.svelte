<svelte:head>
  <meta property="og:site_name" content="Ethoz" />
  <meta property="og:locale" content="es_CL" />
  <meta name="application-name" content="Ethoz" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
</svelte:head>

<script lang="ts">
  import '../app.css';
  import { env } from '$env/dynamic/public';
  import { checkInternalFlag, checkInternalIP, isInternal } from '$lib/utils/internal';
  import { identifyVisitor } from '$lib/utils/visitor';
  import { getConsent } from '$lib/stores/consent.svelte';
  import { flushPendingEvents } from '$lib/utils/analytics';
  import { loadGtm } from '$lib/trackers/gtm';
  import { loadClarity } from '$lib/trackers/clarity';
  import { initSentry } from '$lib/sentry';
  import ConsentBanner from '$lib/components/ConsentBanner.svelte';

  let { children } = $props();
  const feedbackEnabled = env.PUBLIC_FEEDBACK_MODE === 'true';

  $effect(() => {
    if (typeof window === 'undefined') return;
    checkInternalFlag();
    checkInternalIP();
    initSentry();
  });

  $effect(() => {
    const c = getConsent();
    if (typeof window === 'undefined') return;
    if (isInternal()) return;
    if (c.analytics) {
      loadGtm();
      loadClarity();
      flushPendingEvents();
      setTimeout(() => identifyVisitor(), 1000);
    }
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
