<!--
  HeroAppMockupCard — Cal.com-style hero right-side artifact.
  Wraps real product UI fragment (counts, status rows, dashboard).
  rounded-2xl (16px), border-hairline, shadow-mockup at rest.
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

<div
  class="rounded-2xl border border-hairline bg-background shadow-mockup overflow-hidden"
>
  {#if title}
    <div class="border-b border-hairline-soft px-6 py-4">
      <h4 class="text-sm font-semibold text-foreground">{title}</h4>
    </div>
  {/if}
  <div class="p-6">
    {@render children()}
  </div>
</div>
