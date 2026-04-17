<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import { trackEvent } from '$lib/utils/analytics';
  import { Download, Loader2 } from '@lucide/svelte';
  import { browser } from '$app/environment';

  type Props = {
    open: boolean;
    slug: string;
    pdfUrl: string;
    title: string;
    onclose: () => void;
  };

  let { open = $bindable(false), slug, pdfUrl, title, onclose }: Props = $props();

  let email = $state('');
  let submitting = $state(false);
  let error = $state('');

  function downloadAndClose(withEmail = false) {
    if (!browser) return;
    trackEvent(withEmail ? 'pdf_downloaded' : 'pdf_downloaded_anonymous', {
      resource_slug: slug,
    });
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = '';
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (submitting) return;
    submitting = true;
    error = '';

    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      error = 'Ingresa un correo válido.';
      submitting = false;
      return;
    }

    try {
      const supabaseUrl = (import.meta.env.VITE_PUBLIC_SUPABASE_URL as string) ?? '';
      // Fire-and-forget — deliver PDF even if the request fails.
      if (supabaseUrl) {
        fetch(`${supabaseUrl}/functions/v1/request-resource`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: trimmed, resource_slug: slug }),
        }).catch(() => {});
      }
      downloadAndClose(true);
      email = '';
      open = false;
      onclose();
    } finally {
      submitting = false;
    }
  }

  function skip() {
    trackEvent('resource_gate_skipped', { resource_slug: slug });
    downloadAndClose(false);
    open = false;
    onclose();
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header>
      <Dialog.Title>Descargar: {title}</Dialog.Title>
      <Dialog.Description>
        Déjanos tu correo y te enviaremos el PDF junto con material complementario. Sin spam.
      </Dialog.Description>
    </Dialog.Header>

    <form onsubmit={handleSubmit} class="mt-4 space-y-4">
      <div class="space-y-1.5">
        <label for="resource-email" class="block text-sm font-medium text-foreground">
          Correo electrónico
        </label>
        <input
          id="resource-email"
          type="email"
          required
          bind:value={email}
          placeholder="tucorreo@colegio.cl"
          autocomplete="email"
          class="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        {#if error}
          <p class="text-xs text-destructive">{error}</p>
        {/if}
      </div>

      <Button type="submit" class="w-full gap-2" disabled={submitting}>
        {#if submitting}
          <Loader2 class="size-4 animate-spin" />
          Enviando…
        {:else}
          <Download class="size-4" />
          Enviar y descargar
        {/if}
      </Button>

      <button
        type="button"
        onclick={skip}
        class="block w-full text-center text-sm text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
      >
        No gracias, descargar igual
      </button>
    </form>
  </Dialog.Content>
</Dialog.Root>
