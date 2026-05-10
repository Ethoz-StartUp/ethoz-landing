<!--
  HeroAppMockupCard — hero right-side artifact wrapper for product UI fragments.
  Outer frame: muted bg + 2px Cal-black left-rule spine.
  Inner card: card bg (white) with hairline border.
  rounded-xl outer / rounded-lg inner, shadow-mockup at rest.
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

<!-- Outer muted frame with Cal-black left-rule spine -->
<div class="rounded-xl border-l-2 border-foreground bg-muted p-3 sm:p-4">
  <!-- Inner white card — bg-card stays explicitly white as the mockup's design ground. -->
  <div class="overflow-hidden rounded-lg border border-border bg-card shadow-mockup">
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
