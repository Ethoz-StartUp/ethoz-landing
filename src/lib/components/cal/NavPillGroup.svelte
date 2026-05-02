<!--
  NavPillGroup — Stripe Press pill-in-pill sub-nav.
  Outer wrapper: bg-canvas-elevated, rounded-full, padding 6px.
  Active segment: bg-canvas (cream) with shadow-card-hover.
  Inactive: transparent text in text-ink-soft. Hover changes ≥2 properties.
-->
<script lang="ts">
  type Item = {
    label: string;
    href?: string;
    onClick?: () => void;
    active?: boolean;
  };

  type Props = {
    items: Item[];
    size?: 'sm' | 'md';
    /** Optional aria-label for the pill group */
    label?: string;
  };

  let { items, size = 'md', label = 'Sub navigation' }: Props = $props();

  const padX = $derived(size === 'sm' ? 'px-3' : 'px-4');
  const padY = $derived(size === 'sm' ? 'py-1' : 'py-1.5');
  const fontSize = $derived(size === 'sm' ? 'text-xs' : 'text-sm');

  function itemClasses(item: Item): string {
    return [
      padX,
      padY,
      fontSize,
      'rounded-full font-medium transition-all',
      item.active
        ? 'bg-canvas text-ink shadow-card-hover'
        : 'text-ink-soft hover:text-ink hover:bg-canvas',
    ].join(' ');
  }

  function handleClick(item: Item, ev: MouseEvent) {
    if (item.onClick) {
      ev.preventDefault();
      item.onClick();
    }
  }
</script>

<div
  role="tablist"
  aria-label={label}
  class="inline-flex items-center gap-1 rounded-full bg-canvas-elevated p-1.5"
>
  {#each items as item (item.label)}
    {#if item.href}
      <a
        href={item.href}
        role="tab"
        aria-selected={item.active}
        class={itemClasses(item)}
        onclick={(ev) => handleClick(item, ev)}
      >
        {item.label}
      </a>
    {:else}
      <button
        type="button"
        role="tab"
        aria-selected={item.active}
        class={itemClasses(item)}
        onclick={(ev) => handleClick(item, ev)}
      >
        {item.label}
      </button>
    {/if}
  {/each}
</div>
