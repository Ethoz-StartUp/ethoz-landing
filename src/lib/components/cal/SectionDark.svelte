<!--
  SectionDark.svelte — full-bleed dark section wrapper (bg-surface-dark).
  Used by Compliance + Final CTA bands.
  Footer stays its own dark surface — does NOT use this wrapper.

  Inside SectionDark, all text uses text-on-dark / text-on-dark-soft.
  CTAs are white-on-dark (bg-on-dark text-surface-dark) — Cal's inverse primary.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';

  type Variant = 'compliance' | 'cta';
  let {
    variant = 'compliance',
    id,
    'aria-labelledby': ariaLabelledby,
    'aria-label': ariaLabel,
    children
  }: {
    variant?: Variant;
    id?: string;
    'aria-labelledby'?: string;
    'aria-label'?: string;
    children: Snippet;
  } = $props();

  // Both variants share bg + ink colors. Variant differs only in inner max-width.
  const innerMaxW = $derived(variant === 'cta' ? 'max-w-4xl' : 'max-w-7xl');
</script>

<section
  {id}
  aria-labelledby={ariaLabelledby}
  aria-label={ariaLabel}
  class="section-editorial bg-surface-dark text-on-dark"
>
  <div class="mx-auto {innerMaxW} px-4 sm:px-6 lg:px-8">
    {@render children()}
  </div>
</section>
