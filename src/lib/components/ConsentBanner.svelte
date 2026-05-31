<script lang="ts">
  import { slide } from 'svelte/transition';
  import { setConsent, hasDecided } from '$lib/stores/consent.svelte';
  import { Button } from '$lib/components/ui/button';
  import { t } from '$lib/i18n/index.svelte';
  import ConsentSheet from './ConsentSheet.svelte';

  let sheetOpen = $state(false);
  let dismissed = $state(hasDecided());
  let announcement = $state('');
  let acceptAllBtn = $state<HTMLButtonElement | null>(null);

  $effect(() => {
    if (!dismissed && acceptAllBtn) {
      queueMicrotask(() => acceptAllBtn?.focus());
    }
  });

  function announceSaved() {
    announcement = t('consentBanner.saved_announcement');
    setTimeout(() => (announcement = ''), 1500);
  }

  function acceptAll() {
    setConsent({ analytics: true, marketing: true });
    dismissed = true;
    announceSaved();
  }

  function acceptEssential() {
    setConsent({ analytics: false, marketing: false });
    dismissed = true;
    announceSaved();
  }

  function openSheet() {
    sheetOpen = true;
  }
</script>

<!-- Live region stays mounted so screen readers hear the update after the banner unmounts. -->
<div class="sr-only" role="status" aria-live="polite">{announcement}</div>

{#if !dismissed}
  <div
    role="region"
    aria-label={t('consentBanner.region_label')}
    transition:slide={{ duration: 300 }}
    class="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background shadow-lg"
  >
    <div class="mx-auto flex max-w-7xl flex-col gap-2.5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
      <p class="text-xs leading-snug text-muted-foreground sm:flex-1 sm:text-sm sm:leading-normal">
        {t('consentBanner.description')}
        <a href="/privacy" class="font-medium text-foreground underline underline-offset-2 hover:text-primary">{t('consentBanner.privacy_link')}</a>.
      </p>
      <div class="flex shrink-0 flex-wrap gap-2">
        <Button variant="ghost" onclick={openSheet}>{t('consentBanner.cta_customize')}</Button>
        <Button variant="outline" onclick={acceptEssential}>{t('consentBanner.cta_essential')}</Button>
        <Button bind:ref={acceptAllBtn} onclick={acceptAll}>{t('consentBanner.cta_accept_all')}</Button>
      </div>
    </div>
  </div>
{/if}

<ConsentSheet bind:open={sheetOpen} onsaved={() => { dismissed = true; announceSaved(); }} />
