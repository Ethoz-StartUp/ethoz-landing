<script lang="ts">
  import { onMount } from 'svelte';
  import { Sun, Moon } from '@lucide/svelte';
  import { themeStore } from '$lib/stores/theme.svelte';

  onMount(() => themeStore.init());

  let isDark = $derived(themeStore.current === 'dark');
</script>

<button
  type="button"
  onclick={() => themeStore.toggle()}
  aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
  aria-pressed={isDark}
  title={isDark ? 'Tema claro' : 'Tema oscuro'}
  class="inline-flex size-9 items-center justify-center rounded-md border border-hairline bg-canvas text-ink transition-colors hover:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
>
  {#if isDark}
    <Sun class="size-4" aria-hidden="true" />
  {:else}
    <Moon class="size-4" aria-hidden="true" />
  {/if}
</button>
