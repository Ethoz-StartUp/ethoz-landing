<script lang="ts">
  import { t, type TranslationKey } from '$lib/i18n/index.svelte';
  import { ShieldCheck } from '@lucide/svelte';

  const entries: Array<{
    time: TranslationKey;
    action: TranslationKey;
    role: TranslationKey;
  }> = [
    { time: 'home.audit.line1_time', action: 'home.audit.line1_action', role: 'home.audit.line1_role' },
    { time: 'home.audit.line2_time', action: 'home.audit.line2_action', role: 'home.audit.line2_role' },
    { time: 'home.audit.line3_time', action: 'home.audit.line3_action', role: 'home.audit.line3_role' },
    { time: 'home.audit.line4_time', action: 'home.audit.line4_action', role: 'home.audit.line4_role' },
  ];
</script>

<div class="overflow-hidden rounded-2xl border border-border bg-background text-foreground shadow-mockup">
  <div class="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
    <div class="flex items-center gap-2" aria-hidden="true">
      <span class="size-2.5 rounded-full bg-destructive"></span>
      <span class="size-2.5 rounded-full bg-warning"></span>
      <span class="size-2.5 rounded-full bg-success"></span>
    </div>
    <div class="flex min-w-0 items-center gap-2">
      <ShieldCheck class="size-4 shrink-0 text-primary" aria-hidden="true" />
      <p class="truncate font-mono text-xs font-semibold text-foreground">{t('home.audit.title')}</p>
    </div>
    <span class="inline-flex items-center gap-1.5 rounded-full border border-success/30 px-2 py-1 text-xs font-semibold text-foreground">
      <span class="size-1.5 rounded-full bg-success motion-safe:animate-pulse" aria-hidden="true"></span>
      {t('home.audit.status')}
    </span>
  </div>

  <ol class="audit-stream space-y-1.5 p-4 font-mono text-xs" aria-label={t('home.audit.list_label')}>
    {#each entries as entry, index (entry.time)}
      <li class="audit-line grid gap-1 rounded-lg bg-background-elevated px-3 py-2.5 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-3" style={`--audit-index:${index}`}>
        <span data-numeric class="text-primary">{t(entry.time)}</span>
        <span class="min-w-0 text-foreground">
          {t(entry.action)}
          <span class="mt-1 block text-muted-foreground">{t(entry.role)}</span>
        </span>
      </li>
    {/each}
  </ol>
</div>

<style>
  .audit-line {
    animation: audit-rise 8s var(--ease-standard) infinite;
    animation-delay: calc(var(--audit-index) * 900ms);
  }

  @keyframes audit-rise {
    0%, 74%, 100% { transform: translateY(0); }
    82%, 92% { transform: translateY(-3px); }
  }

  @media (prefers-reduced-motion: reduce) {
    .audit-line { animation: none; }
  }
</style>
