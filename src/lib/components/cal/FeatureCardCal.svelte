<!--
  FeatureCardCal — Cal-style feature card.
  Full hairline border + muted bg + foreground heading.
  Icon + title inline (per .impeccable.md hard rule). CTA arrow stays persistent.
-->
<script lang="ts">
  import type { Component } from 'svelte';
  import { ArrowRight } from '@lucide/svelte';

  type Props = {
    icon?: Component;
    title: string;
    description: string;
    href?: string;
    cta?: string;
  };

  let {
    icon: IconComponent,
    title,
    description,
    href,
    cta = 'Conocer más',
  }: Props = $props();

  // Uniform full-border frame (8020 card: border + soft warm shadow).
  // Mono-first: icon color stays foreground, no per-card accent tints.
  const wrapperClass = [
    'rounded-xl border border-hairline bg-card p-8 shadow-card',
    'transition-[transform,box-shadow,border-color] duration-200',
    'hover:border-foreground/25 hover:-translate-y-px shadow-card hover:shadow-card-hover',
  ].join(' ');
</script>

{#if href}
  <a {href} class="group flex flex-col gap-4 {wrapperClass}">
    {#if IconComponent}
      <div class="flex items-center gap-3">
        <IconComponent class="size-5 text-foreground" />
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
        <IconComponent class="size-5 text-foreground" />
        <h3 class="font-heading text-lg text-foreground">{title}</h3>
      </div>
    {:else}
      <h3 class="font-heading text-lg text-foreground">{title}</h3>
    {/if}
    <p class="text-base leading-relaxed text-body">{description}</p>
  </div>
{/if}
