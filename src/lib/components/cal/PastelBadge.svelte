<!--
  PastelBadge — small pill label for category tags.
  Background = pastel hue. Label = ink (foreground) or on-dark depending on hue contrast.
  Used on metadata + category tags ONLY. NEVER on CTAs (lint rule blocks misuse).
-->
<script lang="ts">
  import type { Snippet } from 'svelte';

  type Variant = 'orange' | 'pink' | 'violet' | 'emerald' | 'neutral';

  type Props = {
    variant?: Variant;
    children: Snippet;
  };

  let { variant = 'neutral', children }: Props = $props();

  const palette: Record<Variant, string> = {
    // orange + emerald → dark ink (--foreground); pink + violet → light text (--on-dark)
    orange: 'bg-badge-orange text-foreground',
    pink: 'bg-badge-pink text-on-dark',
    violet: 'bg-badge-violet text-on-dark',
    emerald: 'bg-badge-emerald text-foreground',
    neutral: 'bg-surface-card-cal text-foreground',
  };
</script>

<span
  class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-tight {palette[variant]}"
>
  {@render children()}
</span>
