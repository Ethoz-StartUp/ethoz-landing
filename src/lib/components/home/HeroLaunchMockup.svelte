<script lang="ts">
  import { t } from '$lib/i18n/index.svelte';
  import { Shield, UserCheck, AlertTriangle, Bell, FileCheck } from '@lucide/svelte';
</script>

<div class="relative mx-auto w-full max-w-xl">
  <!-- Ambient glow behind -->
  <div class="pointer-events-none absolute -inset-6 rounded-full bg-primary/10 blur-[50px]" aria-hidden="true"></div>

  <!-- Main card -->
  <div class="relative overflow-hidden rounded-2xl border border-foreground/10 bg-card shadow-mockup">
    <!-- Chrome -->
    <div class="flex items-center justify-between gap-4 border-b border-foreground/10 px-4 py-2.5">
      <div class="flex items-center gap-2" aria-hidden="true">
        <span class="size-2 rounded-full bg-destructive"></span>
        <span class="size-2 rounded-full bg-primary"></span>
        <span class="size-2 rounded-full bg-success"></span>
      </div>
      <p class="truncate text-xs font-medium text-muted-foreground">{t('hero.panel.chrome_title')}</p>
      <span class="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-mockup-xs font-semibold text-primary-active">
        {t('home.demo_data_badge_short')}
      </span>
    </div>

    <div class="p-4 sm:p-5">
      <!-- Header -->
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-mockup-xs font-semibold uppercase tracking-wider text-primary">{t('hero.panel.kicker')}</p>
          <p class="mt-0.5 font-heading text-base font-medium text-foreground sm:text-lg">{t('hero.panel.title')}</p>
        </div>
        <div class="flex items-center gap-1.5 rounded-full border border-foreground/10 bg-background px-2 py-0.5 text-xs font-medium text-foreground/80">
          <Shield class="size-3 text-primary" />
          {t('hero.panel.ready_label')}
        </div>
      </div>

      <!-- Student row -->
      <div class="mt-4 flex items-center gap-3 rounded-xl border border-foreground/10 bg-background p-2.5">
        <div class="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary-active">
          <UserCheck class="size-5" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-sm font-medium text-foreground">{t('hero.student1.name')}</p>
          <p class="text-xs text-muted-foreground">{t('hero.student1.grade')}</p>
        </div>
        <span class="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-mockup-xs font-semibold text-destructive">
          <AlertTriangle class="size-3" />
          {t('hero.student1.alert')}
        </span>
      </div>

      <!-- Timeline -->
      <div class="mt-3 space-y-1.5">
        <div class="flex items-start gap-3 rounded-lg bg-foreground/[0.03] p-2">
          <AlertTriangle class="mt-0.5 size-4 shrink-0 text-destructive" />
          <div class="min-w-0">
            <p class="text-xs font-medium text-foreground/80">{t('hero.student1.timeline1.text')}</p>
            <p class="text-mockup-xs text-text-tertiary">{t('hero.student1.timeline1.meta')}</p>
          </div>
        </div>
        <div class="flex items-start gap-3 rounded-lg bg-foreground/[0.03] p-2.5">
          <Bell class="mt-0.5 size-4 shrink-0 text-primary" />
          <div class="min-w-0">
            <p class="text-xs font-medium text-foreground/80">{t('hero.student1.timeline2.text')}</p>
            <p class="text-mockup-xs text-text-tertiary">{t('hero.student1.timeline2.meta')}</p>
          </div>
        </div>
        <div class="flex items-start gap-3 rounded-lg bg-foreground/[0.03] p-2.5">
          <FileCheck class="mt-0.5 size-4 shrink-0 text-primary" />
          <div class="min-w-0">
            <p class="text-xs font-medium text-foreground/80">{t('hero.student1.timeline3.text')}</p>
            <p class="text-mockup-xs text-text-tertiary">{t('hero.student1.timeline3.meta')}</p>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="mt-4 grid grid-cols-3 divide-x divide-foreground/10 border-t border-foreground/10 pt-3">
        <div class="px-2 text-center first:pl-0">
          <p class="text-sm font-semibold text-foreground">{t('hero.panel.fact1_value')}</p>
          <p class="mt-0.5 text-mockup-xs uppercase tracking-wider text-text-tertiary">{t('hero.panel.fact1_label')}</p>
        </div>
        <div class="px-2 text-center">
          <p class="text-sm font-semibold text-foreground">{t('hero.panel.fact2_value')}</p>
          <p class="mt-0.5 text-mockup-xs uppercase tracking-wider text-text-tertiary">{t('hero.panel.fact2_label')}</p>
        </div>
        <div class="px-2 text-center last:pr-0">
          <p class="text-sm font-semibold text-foreground">{t('hero.panel.fact3_value')}</p>
          <p class="mt-0.5 text-mockup-xs uppercase tracking-wider text-text-tertiary">{t('hero.panel.fact3_label')}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Floating depth cards -->
  <div class="pointer-events-none absolute -left-4 top-8 z-10 hidden max-w-[10rem] -rotate-6 items-center gap-2 rounded-xl border border-destructive/20 bg-card px-3 py-2 shadow-card-dark sm:flex" aria-hidden="true">
    <AlertTriangle class="size-4 shrink-0 text-destructive" />
    <span class="text-xs font-semibold text-foreground">{t('hero.student1.alert')}</span>
  </div>
  <div class="pointer-events-none absolute -right-4 bottom-16 z-10 hidden max-w-[10rem] rotate-3 items-center gap-2 rounded-xl border border-primary/20 bg-card px-3 py-2 shadow-card-dark sm:flex" aria-hidden="true">
    <Shield class="size-4 shrink-0 text-primary" />
    <span class="text-xs font-semibold text-foreground">{t('hero.panel.step3_title')}</span>
  </div>
</div>
