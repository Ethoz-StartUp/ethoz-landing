<!--
  FeatureCardCal — Stripe Press editorial feature card.
  Default (accent='none'): full hairline border + cream-elevated bg + navy ink heading.
  Accented variants: 2px colored left rule only (no top/right/bottom border).
  Icon + title inline (per .impeccable.md hard rule). CTA arrow stays persistent (anti-pattern #10).
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

  // Icon color tracks accent
  const iconClass = $derived(
    accent === 'mustard' ? 'text-accent-mustard' :
    accent === 'brick'   ? 'text-accent-brick'   :
    accent === 'sage'    ? 'text-accent-sage'     :
    'text-ink'  // navy or none
  );

  // Wrapper class: full-border for 'none', left-rule-only for accented variants
  const wrapperClass = $derived(
    accent === 'none'
      ? [
          'rounded-xl border border-hairline-warm bg-canvas-elevated p-8',
          'transition-all duration-200',
          'hover:bg-canvas-strong hover:border-ink/30 hover:-translate-y-px hover:shadow-card-hover',
        ].join(' ')
      : [
          'border-l-2 bg-canvas-elevated p-8',
          accent === 'mustard' ? 'border-accent-mustard' :
          accent === 'brick'   ? 'border-accent-brick'   :
          accent === 'sage'    ? 'border-accent-sage'    :
          'border-ink',  // navy
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
        <h3 class="font-heading text-lg font-semibold tracking-tight text-ink">{title}</h3>
      </div>
    {:else}
      <h3 class="font-heading text-lg font-semibold tracking-tight text-ink">{title}</h3>
    {/if}
    <p class="text-base leading-relaxed text-ink-soft">{description}</p>
    <span class="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-ink">
      {cta}
      <ArrowRight class="size-4 transition-transform group-hover:translate-x-0.5" />
    </span>
  </a>
{:else}
  <div class="flex flex-col gap-4 {wrapperClass}">
    {#if IconComponent}
      <div class="flex items-center gap-3">
        <IconComponent class="size-5 {iconClass}" />
        <h3 class="font-heading text-lg font-semibold tracking-tight text-ink">{title}</h3>
      </div>
    {:else}
      <h3 class="font-heading text-lg font-semibold tracking-tight text-ink">{title}</h3>
    {/if}
    <p class="text-base leading-relaxed text-ink-soft">{description}</p>
  </div>
{/if}
