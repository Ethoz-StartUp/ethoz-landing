<!--
  ProductMockupCard — generic wrapper for embedding real product UI fragments
  inside marketing cards (registry list, retiros table, visit log, etc.).
  rounded-xl (12px), hairline border, shadow-mockup, padding 24px.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    title?: string;
    eyebrow?: string;
    children: Snippet;
  };

  let { title, eyebrow, children }: Props = $props();
</script>

<div class="rounded-xl border border-hairline bg-background shadow-mockup overflow-hidden">
  {#if eyebrow || title}
    <div class="border-b border-hairline-soft px-6 py-4">
      {#if eyebrow}
        <p class="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{eyebrow}</p>
      {/if}
      {#if title}
        <h4 class="mt-0.5 text-sm font-semibold text-foreground">{title}</h4>
      {/if}
    </div>
  {/if}
  <div class="p-6">
    {@render children()}
  </div>
</div>
