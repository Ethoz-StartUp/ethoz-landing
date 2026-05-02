<!--
  SectionDark.svelte — full-bleed navy section wrapper.
  Used by Compliance + Final CTA bands per spec §6 sections 7 + 10.
  Footer stays its own deeper-navy surface — does NOT use this wrapper.

  Inside SectionDark, all text MUST use text-on-navy / text-on-navy-soft / text-on-navy-mustard.
  Mustard CTAs are allowed inside (9.1:1 boundary on navy bg).
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
  class="section-editorial bg-section-navy text-on-navy"
>
  <div class="mx-auto {innerMaxW} px-4 sm:px-6 lg:px-8">
    {@render children()}
  </div>
</section>
