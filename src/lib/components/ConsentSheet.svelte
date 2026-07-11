<script lang="ts">
  import * as Sheet from '$lib/components/ui/sheet';
  import { Button } from '$lib/components/ui/button';
  import { Switch } from '$lib/components/ui/switch';
  import { getConsent, setConsent } from '$lib/stores/consent.svelte';
  import { t } from '$lib/i18n/index.svelte';

  let { open = $bindable(false), onsaved }: { open?: boolean; onsaved?: () => void } = $props();

  let analytics = $state(false);
  let marketing = $state(false);

  // Refresh from the consent store every time the sheet opens. This keeps the
  // controls accurate when preferences were changed during an earlier visit.
  $effect(() => {
    if (!open) return;
    const current = getConsent();
    analytics = current.analytics;
    marketing = current.marketing;
  });

  function save() {
    setConsent({ analytics, marketing });
    open = false;
    onsaved?.();
  }
</script>

<Sheet.Root bind:open>
  <Sheet.Content side="right" class="w-full sm:max-w-md">
    <Sheet.Header>
      <Sheet.Title>{t('consentSheet.title')}</Sheet.Title>
      <Sheet.Description>
        {t('consentSheet.description')}
      </Sheet.Description>
    </Sheet.Header>

    <div class="mt-6 space-y-5">
      <div class="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-4">
        <div class="flex-1">
          <p class="text-sm font-medium text-foreground">{t('consentSheet.essential_title')}</p>
          <p class="mt-1 text-sm text-muted-foreground">
            {t('consentSheet.essential_desc')}
          </p>
        </div>
        <span class="flex min-h-[44px] items-center">
          <Switch checked={true} disabled aria-label={t('consentSheet.essential_aria')} />
        </span>
      </div>

      <div class="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-4">
        <div class="flex-1">
          <p class="text-sm font-medium text-foreground">{t('consentSheet.analytics_title')}</p>
          <p class="mt-1 text-sm text-muted-foreground">
            {t('consentSheet.analytics_desc')}
          </p>
        </div>
        <span class="flex min-h-[44px] items-center">
          <Switch bind:checked={analytics} aria-label={t('consentSheet.analytics_aria')} />
        </span>
      </div>

      <div class="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-4">
        <div class="flex-1">
          <p class="text-sm font-medium text-foreground">{t('consentSheet.marketing_title')}</p>
          <p class="mt-1 text-sm text-muted-foreground">
            {t('consentSheet.marketing_desc')}
          </p>
        </div>
        <span class="flex min-h-[44px] items-center">
          <Switch bind:checked={marketing} aria-label={t('consentSheet.marketing_aria')} />
        </span>
      </div>
    </div>

    <Sheet.Footer class="mt-6">
      <Button onclick={save} class="w-full">{t('consentSheet.save')}</Button>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>
