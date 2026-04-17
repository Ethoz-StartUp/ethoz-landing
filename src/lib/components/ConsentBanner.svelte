<script lang="ts">
  import { slide } from 'svelte/transition';
  import { setConsent, hasDecided } from '$lib/stores/consent.svelte';
  import { Button } from '$lib/components/ui/button';
  import ConsentSheet from './ConsentSheet.svelte';

  let sheetOpen = $state(false);
  let dismissed = $state(hasDecided());

  function acceptAll() {
    setConsent({ analytics: true, marketing: true });
    dismissed = true;
  }

  function acceptEssential() {
    setConsent({ analytics: false, marketing: false });
    dismissed = true;
  }

  function openSheet() {
    sheetOpen = true;
  }
</script>

{#if !dismissed}
  <div
    role="region"
    aria-label="Preferencias de cookies"
    transition:slide={{ duration: 300 }}
    class="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-md"
  >
    <div class="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p class="text-xs text-muted-foreground sm:flex-1">
        Usamos cookies para mejorar tu experiencia y medir el rendimiento del sitio. Puedes aceptar todo, mantener solo las esenciales o personalizar tus preferencias. Revisa nuestra
        <a href="/privacy" class="underline underline-offset-2 hover:text-foreground">política de privacidad</a>.
      </p>
      <div class="flex shrink-0 flex-wrap gap-2">
        <Button variant="ghost" size="sm" onclick={openSheet}>Personalizar</Button>
        <Button variant="outline" size="sm" onclick={acceptEssential}>Solo esenciales</Button>
        <Button size="sm" onclick={acceptAll}>Aceptar todo</Button>
      </div>
    </div>
  </div>
{/if}

<ConsentSheet bind:open={sheetOpen} onsaved={() => (dismissed = true)} />
