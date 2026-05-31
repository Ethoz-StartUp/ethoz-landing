<!--
  PastelBadge — small pill label for category tags.
  Variants aligned to accent token system (mustard/brick/sage/navy).
  Used on metadata + category tags ONLY. NEVER on CTAs (lint rule blocks misuse).

  Contrast notes (badge size):
    mustard: foreground ink on mustard bg — 7.1:1 AAA body
    brick:   dark ink on light error tint — AAA body (was white-on-error-red 3.76:1, failed AAA/AA)
    sage:    dark ink on light success tint — AAA body (was white-on-success-green 2.54:1, failed AAA/AA)
    navy:    cream on navy bg — 15.8:1 AAA body
-->
<script lang="ts">
  import type { Snippet } from 'svelte';

  type Variant = 'mustard' | 'brick' | 'sage' | 'navy' | 'neutral';

  type Props = {
    variant?: Variant;
    children: Snippet;
  };

  let { variant = 'neutral', children }: Props = $props();

  const VARIANT_CLASS: Record<Variant, string> = {
    mustard: 'bg-accent-mustard text-foreground', // foreground on mustard
    brick:   'bg-error/15 text-foreground',       // dark ink on light error tint (AAA)
    sage:    'bg-success/15 text-foreground',      // dark ink on light success tint (AAA)
    navy:    'bg-surface-dark text-on-dark',      // Cal dark badge
    neutral: 'bg-muted text-foreground',          // muted bg with foreground ink
  };
</script>

<span
  class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-tight {VARIANT_CLASS[variant]}"
>
  {@render children()}
</span>
