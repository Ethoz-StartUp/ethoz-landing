<!--
  FeatureCardCal — Cal-style feature card.
  Default (accent='none'): full hairline border + muted bg + foreground heading.
  Accented variants: 2px colored left rule only (no top/right/bottom border).
  Icon + title inline (per .impeccable.md hard rule). CTA arrow stays persistent.
-->
<script lang="ts">
  import type { Component } from 'svelte';
  import { ArrowRight } from '@lucide/svelte';

  type Accent = 'mustard' | 'brick' | 'sage' | 'navy' | 'none';

  type Props = {
    icon?: Component;
    title: string;
    description: string;
    href?: string;
    cta?: string;
    /** Editorial left-rule accent. 'none' = full hairline card (default). */
    accent?: Accent;
  };

  let {
    icon: IconComponent,
    title,
    description,
    href,
    cta = 'Conocer más',
    accent = 'none',
  }: Props = $props();

  // Icon color tracks accent (mono-first: accents collapse to foreground)
  const iconClass = $derived(
    accent === 'mustard' ? 'text-accent-mustard' :
    accent === 'brick'   ? 'text-accent-brick'   :
    accent === 'sage'    ? 'text-accent-sage'     :
    'text-foreground'  // navy or none
  );

  // Wrapper class: full-border for 'none', left-rule-only for accented variants
  const wrapperClass = $derived(
    accent === 'none'
      ? [
          'rounded-xl border border-border bg-muted p-8',
          'transition-all duration-200',
          'hover:bg-surface-card hover:border-foreground/30 hover:-translate-y-px hover:shadow-card-hover',
        ].join(' ')
      : [
          'border-l-2 bg-muted p-8',
          accent === 'mustard' ? 'border-accent-mustard' :
          accent === 'brick'   ? 'border-accent-brick'   :
          accent === 'sage'    ? 'border-accent-sage'    :
          'border-foreground',  // navy
          'transition-all duration-200',
          'hover:border-l-4 hover:-translate-y-px',
        ].join(' ')
  );
</script>

{#if href}
  <a {href} class="group flex flex-col gap-4 {wrapperClass}">
    {#if IconComponent}
      <div class="flex items-center gap-3">
        <IconComponent class="size-5 {iconClass}" />
        <h3 class="font-heading text-lg text-foreground">{title}</h3>
      </div>
    {:else}
      <h3 class="font-heading text-lg text-foreground">{title}</h3>
    {/if}
    <p class="text-base leading-relaxed text-body">{description}</p>
    <span class="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-foreground">
      {cta}
      <ArrowRight class="size-4 transition-transform group-hover:translate-x-0.5" />
    </span>
  </a>
{:else}
  <div class="flex flex-col gap-4 {wrapperClass}">
    {#if IconComponent}
      <div class="flex items-center gap-3">
        <IconComponent class="size-5 {iconClass}" />
        <h3 class="font-heading text-lg text-foreground">{title}</h3>
      </div>
    {:else}
      <h3 class="font-heading text-lg text-foreground">{title}</h3>
    {/if}
    <p class="text-base leading-relaxed text-body">{description}</p>
  </div>
{/if}
