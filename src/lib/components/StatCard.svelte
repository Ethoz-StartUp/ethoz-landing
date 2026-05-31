<script lang="ts">
  interface Props {
    /** Display value, e.g. "20.000" or "dic 2026". */
    value: string;
    /** Color utility for the value, e.g. "text-destructive". Defaults to neutral foreground. */
    valueClass?: string;
    label: string;
    description: string;
  }

  let { value, valueClass = 'text-foreground', label, description }: Props = $props();
</script>

<div class="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
  <p class="text-3xl font-bold {valueClass}">{value}</p>
  <p class="mt-1 text-sm font-semibold text-foreground">{label}</p>
  <p class="mt-2 text-xs text-muted-foreground">{description}</p>
</div>
