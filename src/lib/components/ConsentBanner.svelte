<script lang="ts">
  import { onMount, type Component } from 'svelte';
  import { slide } from 'svelte/transition';
  import { setConsent, hasDecided } from '$lib/stores/consent.svelte';
  import { Button } from '$lib/components/ui/button';
  import { t } from '$lib/i18n/index.svelte';

  type ConsentSheetProps = {
    open?: boolean;
    onsaved?: () => void;
  };

  let hydrated = $state(false);
  let sheetOpen = $state(false);
  let sheetLoading = $state(false);
  let ConsentSheet = $state<Component<ConsentSheetProps> | null>(null);
  let dismissed = $state(hasDecided());
  let announcement = $state('');

  // The prerendered page stays deny-by-default and contains no controls that
  // look interactive before Svelte has attached its event listeners.
  onMount(() => {
    hydrated = true;
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

  async function openSheet() {
    if (sheetLoading) return;
    sheetLoading = true;
    try {
      ConsentSheet ??= (await import('./ConsentSheet.svelte')).default;
      sheetOpen = true;
    } finally {
      sheetLoading = false;
    }
  }
</script>

<!-- Live region stays mounted so screen readers hear the update after the banner unmounts. -->
<div class="sr-only" role="status" aria-live="polite">{announcement}</div>

{#if hydrated && !dismissed}
  <div
    role="region"
    aria-label={t('consentBanner.region_label')}
    in:slide={{ duration: 200 }}
    class="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background shadow-popover"
  >
    <div class="mx-auto flex max-w-7xl flex-col gap-2.5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
      <p class="text-xs leading-snug text-muted-foreground sm:flex-1 sm:text-sm sm:leading-normal">
        {t('consentBanner.description')}
        <a href="/privacidad" class="font-medium text-foreground underline underline-offset-2 hover:text-primary">{t('consentBanner.privacy_link')}</a>.
      </p>
      <div class="flex shrink-0 flex-wrap gap-2">
        <Button size="lg" variant="ghost" onclick={openSheet} disabled={sheetLoading} aria-busy={sheetLoading}>{t('consentBanner.cta_customize')}</Button>
        <Button size="lg" variant="outline" onclick={acceptEssential}>{t('consentBanner.cta_essential')}</Button>
        <Button size="lg" onclick={acceptAll}>{t('consentBanner.cta_accept_all')}</Button>
      </div>
    </div>
  </div>
{/if}

{#if ConsentSheet}
  <ConsentSheet bind:open={sheetOpen} onsaved={() => { dismissed = true; announceSaved(); }} />
{/if}
