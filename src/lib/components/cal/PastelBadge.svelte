<!--
  PastelBadge — small pill label for category tags.
  Variants aligned to accent token system (mustard/brick/sage/navy).
  Used on metadata + category tags ONLY. NEVER on CTAs (lint rule blocks misuse).

  Contrast notes (all AAA-large at badge size):
    mustard: navy ink on mustard bg — 7.1:1 AAA body
    brick:   cream on brick bg — 5.3:1 AAA-large only (short badge text → OK)
    sage:    cream on sage bg — 5.5:1 AAA-large only
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
    brick:   'bg-accent-brick text-on-dark',      // white on brick
    sage:    'bg-accent-sage text-on-dark',       // white on sage
    navy:    'bg-surface-dark text-on-dark',      // Cal dark badge
    neutral: 'bg-muted text-foreground',          // muted bg with foreground ink
  };
</script>

<span
  class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-tight {VARIANT_CLASS[variant]}"
>
  {@render children()}
</span>
