<!--
  FeatureCardCal — Cal.com-style light-gray feature card.
  Background uses bg-surface-card-cal token, rounded-xl (12px), padding 32px.
  Icon + title inline (per .impeccable.md hard rule). Body in --body color.
  Optional CTA link with persistent arrow affordance (anti-pattern memory #10).
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
    /** Use white-canvas variant instead of light-gray (Cal feature-icon-card pattern). */
    variant?: 'gray' | 'white';
  };

  let {
    icon: IconComponent,
    title,
    description,
    href,
    cta = 'Conocer más',
    variant = 'gray',
  }: Props = $props();

  const surfaceClass = $derived(
    variant === 'gray'
      ? 'bg-surface-card-cal'
      : 'bg-background border border-hairline'
  );
</script>

{#if href}
  <a
    {href}
    class="group flex flex-col gap-4 rounded-xl {surfaceClass} p-8 transition-colors hover:bg-hairline-soft"
  >
    {#if IconComponent}
      <div class="flex items-center gap-3">
        <IconComponent class="size-5 text-foreground" />
        <h3 class="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
      </div>
    {:else}
      <h3 class="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
    {/if}
    <p class="text-base leading-relaxed text-muted-foreground">{description}</p>
    <span class="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-foreground">
      {cta}
      <ArrowRight class="size-4 transition-transform group-hover:translate-x-0.5" />
    </span>
  </a>
{:else}
  <div class="flex flex-col gap-4 rounded-xl {surfaceClass} p-8">
    {#if IconComponent}
      <div class="flex items-center gap-3">
        <IconComponent class="size-5 text-foreground" />
        <h3 class="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
      </div>
    {:else}
      <h3 class="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
    {/if}
    <p class="text-base leading-relaxed text-muted-foreground">{description}</p>
  </div>
{/if}
