<script lang="ts">
  import { t } from '$lib/i18n/index.svelte';

  type Step = 1 | 2 | 3;

  let {
    currentStep,
    onBeforeBack
  }: {
    currentStep: Step;
    onBeforeBack?: () => void;
  } = $props();

  const steps = [
    { labelKey: 'demo.step_indicator.step1' as const, number: 1 as const },
    { labelKey: 'demo.step_indicator.step2' as const, number: 2 as const },
    { labelKey: 'demo.step_indicator.step3' as const, number: 3 as const }
  ];
</script>

<nav aria-label={t('demo.step_indicator.nav_label')} class="border-b border-border bg-background py-2">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <ol class="mx-auto flex max-w-2xl items-center justify-center gap-1 sm:gap-3">
      {#each steps as step (step.number)}
        {@const isCurrent = currentStep === step.number}
        {@const isComplete = currentStep > step.number}
        <li
          class="flex min-w-0 items-center gap-1 sm:gap-2"
          aria-current={isCurrent ? 'step' : undefined}
        >
          {#if isComplete && step.number === 1}
            <a
              href="/demo"
              onclick={onBeforeBack}
              class="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md px-2 text-foreground transition-colors hover:bg-primary/10 hover:text-primary-active sm:px-3"
            >
              <span
                aria-hidden="true"
                class="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
              >
                {step.number}
              </span>
              <span class="sr-only">{t('demo.step_indicator.step_prefix')} {step.number}: </span>
              <span class="sr-only text-xs font-medium sm:not-sr-only">{t(step.labelKey)}</span>
              <span class="sr-only"> ({t('demo.step_indicator.completed')})</span>
            </a>
          {:else}
            <span class="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 px-2 sm:px-3">
              <span
                aria-hidden="true"
                class="flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold {currentStep >= step.number ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}"
              >
                {step.number}
              </span>
              <span class="sr-only">{t('demo.step_indicator.step_prefix')} {step.number}: </span>
              <span class="sr-only text-xs font-medium sm:not-sr-only {currentStep >= step.number ? 'text-foreground' : 'text-muted-foreground'}">
                {t(step.labelKey)}
              </span>
              {#if isCurrent}
                <span class="sr-only"> ({t('demo.step_indicator.current')})</span>
              {/if}
            </span>
          {/if}

          {#if step.number < 3}
            <span
              aria-hidden="true"
              class="h-px w-4 shrink-0 {isComplete ? 'bg-primary' : 'bg-border'} sm:w-8"
            ></span>
          {/if}
        </li>
      {/each}
    </ol>
  </div>
</nav>
