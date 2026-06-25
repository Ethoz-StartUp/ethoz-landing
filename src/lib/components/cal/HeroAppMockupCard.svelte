<!--
  HeroAppMockupCard — hero right-side artifact wrapper for product UI fragments.
  Framed-bezel: outer mat is a full hairline-bordered card with a soft warm lift,
  inner screen is a bordered surface. rounded-2xl outer / rounded-xl inner.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    title?: string;
    /** Slot for fragment markup */
    children: Snippet;
  };

  let { title, children }: Props = $props();
</script>

<!-- Outer mat — full hairline frame with a soft warm lift (bezel). -->
<div class="rounded-2xl border border-hairline bg-card p-2.5 shadow-card-hover sm:p-3">
  <!-- Inner screen — bordered surface, the mockup's design ground. -->
  <div class="overflow-hidden rounded-xl border border-hairline bg-card shadow-mockup">
    {#if title}
      <div class="border-b border-hairline-soft px-6 py-4">
        <h4 class="text-sm font-semibold text-foreground">{title}</h4>
      </div>
    {/if}
    <div class="p-6">
      {@render children()}
    </div>
  </div>
</div>
