<script lang="ts">
  import * as Sheet from '$lib/components/ui/sheet';
  import { Button } from '$lib/components/ui/button';
  import { Switch } from '$lib/components/ui/switch';
  import { getConsent, setConsent } from '$lib/stores/consent.svelte';

  let { open = $bindable(false), onsaved }: { open?: boolean; onsaved?: () => void } = $props();

  const current = getConsent();
  let analytics = $state(current.analytics);
  let marketing = $state(current.marketing);

  function save() {
    setConsent({ analytics, marketing });
    open = false;
    onsaved?.();
  }
</script>

<Sheet.Root bind:open>
  <Sheet.Content side="right" class="w-full sm:max-w-md">
    <Sheet.Header>
      <Sheet.Title>Preferencias de cookies</Sheet.Title>
      <Sheet.Description>
        Elige qué categorías de cookies aceptas. Las cookies esenciales son necesarias para el funcionamiento del sitio y no pueden desactivarse.
      </Sheet.Description>
    </Sheet.Header>

    <div class="mt-6 space-y-5">
      <div class="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-4">
        <div>
          <p class="text-sm font-medium text-foreground">Esenciales</p>
          <p class="mt-1 text-xs text-muted-foreground">
            Necesarias para el funcionamiento del sitio, incluido el monitoreo básico de errores.
          </p>
        </div>
        <Switch checked={true} disabled aria-label="Cookies esenciales (siempre activas)" />
      </div>

      <div class="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-4">
        <div>
          <p class="text-sm font-medium text-foreground">Análisis</p>
          <p class="mt-1 text-xs text-muted-foreground">
            Nos ayudan a entender cómo se usa el sitio. Incluye Google Analytics y Microsoft Clarity.
          </p>
        </div>
        <Switch bind:checked={analytics} aria-label="Cookies de análisis" />
      </div>

      <div class="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-4">
        <div>
          <p class="text-sm font-medium text-foreground">Marketing</p>
          <p class="mt-1 text-xs text-muted-foreground">
            Permiten medir la efectividad de campañas y personalizar el contenido.
          </p>
        </div>
        <Switch bind:checked={marketing} aria-label="Cookies de marketing" />
      </div>
    </div>

    <Sheet.Footer class="mt-6">
      <Button onclick={save} class="w-full">Guardar preferencias</Button>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>
