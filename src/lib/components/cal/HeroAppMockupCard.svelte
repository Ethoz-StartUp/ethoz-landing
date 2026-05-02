<!--
  HeroAppMockupCard — Stripe Press hero right-side artifact.
  Outer frame: cream-elevated + 2px navy left-rule spine (editorial column mount).
  Inner card: white bg (dashboard carousel was designed for white — must stay white).
  rounded-2xl (16px), border-hairline-warm, shadow-mockup at rest.
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

<!-- Outer cream-elevated frame with navy left-rule spine -->
<div class="rounded-xl border-l-2 border-ink bg-canvas-elevated p-3 sm:p-4">
  <!-- Inner white card (unchanged from original) -->
  <div class="overflow-hidden rounded-lg border border-hairline-warm bg-background shadow-mockup">
    {#if title}
      <div class="border-b border-hairline-warm-soft px-6 py-4">
        <h4 class="text-sm font-semibold text-ink">{title}</h4>
      </div>
    {/if}
    <div class="p-6">
      {@render children()}
    </div>
  </div>
</div>
