<!--
  NavPillGroup — Cal.com signature pill-in-pill sub-nav.
  Outer wrapper: bg-surface-soft, rounded-full, padding 6px.
  Active segment: bg-background, rounded-full, soft drop shadow.
  Inactive: transparent text in muted-foreground.
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
  class="inline-flex items-center gap-1 rounded-full bg-surface-soft p-1.5"
>
  {#each items as item (item.label)}
    {#if item.href}
      <a
        href={item.href}
        role="tab"
        aria-selected={item.active}
        class={[
          padX,
          padY,
          fontSize,
          'rounded-full font-medium transition-all',
          item.active
            ? 'bg-background text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
            : 'text-muted-foreground hover:text-foreground',
        ].join(' ')}
        onclick={(ev) => handleClick(item, ev)}
      >
        {item.label}
      </a>
    {:else}
      <button
        type="button"
        role="tab"
        aria-selected={item.active}
        class={[
          padX,
          padY,
          fontSize,
          'rounded-full font-medium transition-all',
          item.active
            ? 'bg-background text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
            : 'text-muted-foreground hover:text-foreground',
        ].join(' ')}
        onclick={(ev) => handleClick(item, ev)}
      >
        {item.label}
      </button>
    {/if}
  {/each}
</div>
