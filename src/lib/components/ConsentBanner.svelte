<script lang="ts">
  import { slide } from 'svelte/transition';
  import { setConsent, hasDecided } from '$lib/stores/consent.svelte';
  import { Button } from '$lib/components/ui/button';
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
    announcement = 'Preferencias guardadas.';
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
    aria-label="Preferencias de cookies"
    transition:slide={{ duration: 300 }}
    class="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background shadow-lg"
  >
    <div class="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p class="text-sm text-muted-foreground sm:flex-1">
        Usamos cookies para mejorar tu experiencia y medir el rendimiento del sitio. Puedes aceptar todo, mantener solo las esenciales o personalizar tus preferencias. Revisa nuestra
        <a href="/privacy" class="font-medium text-foreground underline underline-offset-2 hover:text-primary">política de privacidad</a>.
      </p>
      <div class="flex shrink-0 flex-wrap gap-2">
        <Button variant="ghost" onclick={openSheet}>Personalizar</Button>
        <Button variant="outline" onclick={acceptEssential}>Solo esenciales</Button>
        <Button bind:ref={acceptAllBtn} onclick={acceptAll}>Aceptar todo</Button>
      </div>
    </div>
  </div>
{/if}

<ConsentSheet bind:open={sheetOpen} onsaved={() => { dismissed = true; announceSaved(); }} />
