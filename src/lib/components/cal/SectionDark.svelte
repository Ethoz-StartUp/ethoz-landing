<!--
  SectionDark.svelte — full-bleed editorial section wrapper. Surface depends on variant:
  - variant="cta": DARK closing band (bg-surface-dark) — the deliberate dark surface
    that closes the page, stacked above the dark Footer. Inner text uses
    text-on-dark / text-on-dark-soft; CTA is inverse primary (bg-on-dark).
  - variant="compliance": LIGHT mid-page band (bg-surface-soft) — per .impeccable.md the
    only dark content surfaces are the closing CTA + Footer; mid-page bands stay light.
    Inner text uses text-foreground / text-muted-foreground; CTA is standard primary.
  Footer stays its own dark surface — does NOT use this wrapper.
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

  const innerMaxW = $derived(variant === 'cta' ? 'max-w-4xl' : 'max-w-7xl');
  // cta = dark closing band; compliance = light mid-page band (children retokenize accordingly).
  const surface = $derived(
    variant === 'cta' ? 'bg-surface-dark text-on-dark' : 'bg-surface-soft text-foreground'
  );
</script>

<section
  {id}
  aria-labelledby={ariaLabelledby}
  aria-label={ariaLabel}
  class="section-editorial {surface}"
>
  <div class="mx-auto {innerMaxW} px-4 sm:px-6 lg:px-8">
    {@render children()}
  </div>
</section>
