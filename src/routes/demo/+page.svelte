<script lang="ts">
  import { goto } from '$app/navigation';
  import { onDestroy, onMount } from 'svelte';
  import { BRAND } from '$lib/brand';
  import NavBar from '$lib/components/NavBar.svelte';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { t } from '$lib/i18n/index.svelte';
  import { schoolStore, type School } from '$lib/stores/schools.svelte';
  import { trackEvent } from '$lib/utils/analytics';
  import { normalize } from '$lib/utils/text';
  import StepIndicator from './StepIndicator.svelte';
  import {
    Search,
    ArrowRight,
    Building,
    MapPin,
    ChevronRight
  } from '@lucide/svelte';

  // ── State ──
  let searchInput = $state('');
  let highlightIndex = $state(-1);
  let searchPending = $state(false);
  let hydrated = $state(false);
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  let resultsListEl = $state<HTMLUListElement | null>(null);

  // ── Derived ──
  const schools = $derived(schoolStore.filteredSchools);
  const visibleSchools = $derived(schools.slice(0, 30));
  const queryIsReady = $derived(searchInput.trim().length >= 2);
  const hasResults = $derived(queryIsReady && !searchPending && visibleSchools.length > 0);
  const showNoResults = $derived(
    !schoolStore.loading && !schoolStore.loadError && queryIsReady && !searchPending && !hasResults
  );

  // ── Lifecycle ──
  onMount(() => {
    hydrated = true;
    void schoolStore.load();
  });

  // ── Helpers ──
  function highlightMatch(text: string, query: string) {
    if (query.length < 2) return null;
    const nt = normalize(text);
    const nq = normalize(query);
    const idx = nt.indexOf(nq);
    if (idx === -1) return null;
    return {
      before: text.slice(0, idx),
      match: text.slice(idx, idx + query.length),
      after: text.slice(idx + query.length)
    };
  }

  // ── Handlers ──
  function handleSearch(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    searchInput = value;
    highlightIndex = -1;
    if (debounceTimer) clearTimeout(debounceTimer);

    if (value.trim().length < 2) {
      searchPending = false;
      schoolStore.setSearch(value);
      return;
    }

    searchPending = true;
    debounceTimer = setTimeout(() => {
      schoolStore.setSearch(value);
      searchPending = false;
    }, 150);
  }

  function selectSchool(school: School) {
    trackEvent('school_selected', { rbd: school.rbd.toString(), name: school.name });
    goto(`/demo/${school.rbd}`);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      highlightIndex = -1;
      return;
    }
    if (!hasResults) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      highlightIndex = Math.min(highlightIndex + 1, visibleSchools.length - 1);
      scrollHighlighted();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      highlightIndex = Math.max(highlightIndex - 1, -1);
      scrollHighlighted();
    } else if (e.key === 'Home') {
      e.preventDefault();
      highlightIndex = 0;
      scrollHighlighted();
    } else if (e.key === 'End') {
      e.preventDefault();
      highlightIndex = visibleSchools.length - 1;
      scrollHighlighted();
    } else if (e.key === 'Enter' && highlightIndex >= 0) {
      e.preventDefault();
      selectSchool(visibleSchools[highlightIndex]);
    }
  }

  function scrollHighlighted() {
    requestAnimationFrame(() => {
      resultsListEl
        ?.querySelector('[data-highlighted="true"]')
        ?.scrollIntoView({ block: 'nearest', behavior: 'auto' });
    });
  }

  onDestroy(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
  });
</script>

<svelte:head>
  <title>{t('meta.demo_title')}</title>
  <meta name="description" content={t('meta.demo_description')} />
  <meta property="og:url" content="https://ethoz.cl/demo" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={t('meta.demo_title')} />
  <meta property="og:description" content={t('meta.demo_description')} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={t('meta.demo_title')} />
  <meta name="twitter:description" content={t('meta.demo_description')} />
  <link rel="canonical" href="https://ethoz.cl/demo" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Demo"}]})}</script>`}
</svelte:head>

<div class="flex min-h-dvh flex-col bg-secondary pt-28 sm:pt-32">
  <!-- Skip link — WCAG 2.4.1 Bypass Blocks -->
  <a
    href="#demo-search-main"
    class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:border focus:border-foreground focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-foreground"
  >
    {t('nav.skip_to_content')}
  </a>
  <NavBar />

  <main id="main-content" class="flex flex-1 flex-col">

  <StepIndicator currentStep={1} />

  <!-- Content -->
  <div id="demo-search-main" class="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 py-12 sm:py-16">
    <div class="space-y-6">
      <div class="text-center">
        <p class="mb-3 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">{t('demo.step1.eyebrow')}</p>
        <h1 class="text-2xl text-foreground">
          {t('demo.step1.title')}
        </h1>
        <p class="mt-2 text-sm text-muted-foreground">
          {t('demo.step1.subtitle')}
        </p>
        <p class="mx-auto mt-5 max-w-md text-xs leading-relaxed text-muted-foreground">
          {t('demo.step1.description')}
        </p>
      </div>

      {#if !hydrated || schoolStore.loading}
        <div class="space-y-3 py-8" role="status" aria-live="polite">
          <p class="text-center text-sm text-muted-foreground">{t('demo.search.loading')}</p>
          <div aria-hidden="true" class="space-y-2">
            {#each Array(3) as _}
              <div class="flex items-center gap-3 rounded-md border border-border bg-background px-4 py-3">
                <Skeleton class="size-4 shrink-0 rounded-full" />
                <div class="flex-1 space-y-2">
                  <Skeleton class="h-4 w-3/4" />
                  <Skeleton class="h-3 w-1/3" />
                </div>
              </div>
            {/each}
          </div>
        </div>
        <noscript>
          <div class="text-center">
            <a
              href="/demo/0?manual=1"
              class="inline-flex min-h-11 items-center gap-1.5 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              {t('demo.manual')}
              <ChevronRight aria-hidden="true" class="size-4" />
            </a>
          </div>
        </noscript>
      {:else if schoolStore.loadError}
        <div class="rounded-xl border border-border bg-background px-5 py-8 text-center" role="alert">
          <Search aria-hidden="true" class="mx-auto mb-3 size-7 text-muted-foreground" />
          <p class="text-sm font-semibold text-foreground">{t('prospecting.schools_load_error')}</p>
          <a
            href="/demo/0?manual=1"
            class="mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            {t('demo.manual')}
            <ChevronRight aria-hidden="true" class="size-4" />
          </a>
        </div>
      {:else}
        <!-- Search input — ARIA 1.2 combobox pattern -->
        <div class="sticky top-24 z-10 bg-secondary pb-3 pt-3">
          <label for="demo-school-search" class="sr-only">{t('demo.step1.title')}</label>
          <p id="demo-search-instructions" class="sr-only">{t('a11y.search.instructions')}</p>
          <div class="relative">
            <Search aria-hidden="true" class="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="demo-school-search"
              type="text"
              value={searchInput}
              oninput={handleSearch}
              onkeydown={handleKeydown}
              placeholder={t('demo.search.placeholder')}
              autocomplete="off"
              role="combobox"
              aria-autocomplete="list"
              aria-controls={hasResults ? 'demo-school-results' : undefined}
              aria-expanded={hasResults}
              aria-busy={searchPending}
              aria-activedescendant={hasResults && highlightIndex >= 0 ? `school-opt-${highlightIndex}` : undefined}
              aria-describedby="demo-search-instructions"
              class="w-full rounded-md border border-border bg-background py-4 pl-11 pr-4 text-base text-foreground shadow-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <!-- Live region for result count (polite, non-intrusive) -->
        <div class="sr-only" aria-live="polite" aria-atomic="true">
          {#if searchPending}
            {t('demo.search.loading')}
          {:else if hasResults}
            {visibleSchools.length === 1 ? t('a11y.search.results_count_one') : `${visibleSchools.length} ${t('a11y.search.results_count_many')}`}
          {:else if showNoResults}
            {t('a11y.search.no_results')}
          {/if}
        </div>

        {#if !queryIsReady}
          <p class="text-center text-xs text-muted-foreground">{t('demo.search.hint')}</p>
        {/if}

        {#if searchPending}
          <div aria-hidden="true" class="space-y-2">
            {#each Array(3) as _}
              <div class="flex items-center gap-3 rounded-md border border-border bg-background px-4 py-3">
                <Skeleton class="size-4 shrink-0 rounded-full" />
                <div class="flex-1 space-y-2">
                  <Skeleton class="h-4 w-2/3" />
                  <Skeleton class="h-3 w-1/4" />
                </div>
              </div>
            {/each}
          </div>
        {/if}

        <!-- Results list — flows in page, no nested scroll -->
        {#if hasResults}
          <ul
            bind:this={resultsListEl}
            id="demo-school-results"
            class="demo-result-list space-y-1"
            role="listbox"
            aria-label={t('demo.step1.title')}
          >
            {#each visibleSchools as school, i}
              {@const match = highlightMatch(school.name, searchInput.trim())}
              <li role="presentation">
                <button
                  id={`school-opt-${i}`}
                  type="button"
                  role="option"
                  aria-selected={highlightIndex === i}
                  data-highlighted={highlightIndex === i}
                  tabindex="-1"
                  onclick={() => selectSchool(school)}
                  class="flex w-full items-center gap-3 rounded-md border bg-background px-4 py-3 text-left shadow-sm transition-all hover:border-primary/30 hover:shadow-md {highlightIndex === i ? 'border-primary/30 shadow-md' : 'border-border'}"
                >
                  <Building aria-hidden="true" class="size-4 shrink-0 text-muted-foreground" />
                  <div class="min-w-0 flex-1">
                    <div class="text-sm font-medium text-foreground">
                      {#if match}
                        {match.before}<mark class="bg-primary/20 font-semibold text-foreground">{match.match}</mark>{match.after}
                      {:else}
                        {school.name}
                      {/if}
                    </div>
                    <div class="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin aria-hidden="true" class="size-3 shrink-0" />
                      <span>{school.commune}</span>
                    </div>
                  </div>
                  <ChevronRight aria-hidden="true" class="size-4 shrink-0 text-muted-foreground" />
                </button>
              </li>
            {/each}
          </ul>
        {/if}

        <!-- No results -->
        {#if showNoResults}
          <div class="rounded-xl border border-dashed border-border bg-background px-4 py-8 text-center">
            <Search aria-hidden="true" class="mx-auto mb-2 size-8 text-muted-foreground/50" />
            <p class="text-sm font-medium text-foreground">{t('demo.search.noresults')}</p>
            <a
              href={`/demo/0?manual=1&school=${encodeURIComponent(searchInput.trim())}`}
              class="mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t('demo.manual')}
              <ChevronRight aria-hidden="true" class="size-3.5" />
            </a>
          </div>
        {/if}

        <!-- Always show manual option -->
        {#if queryIsReady && !showNoResults && !searchPending}
          <div class="text-center">
            <a
              href={`/demo/0?manual=1&school=${encodeURIComponent(searchInput.trim())}`}
              class="inline-flex min-h-11 items-center text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              {t('demo.step1.manualFallback')}
            </a>
          </div>
        {/if}
      {/if}

      <!-- Network / corporation branch — quiet link, subordinate to the search flow -->
      <div class="rounded-xl border border-border bg-card p-5 text-center">
        <p class="text-sm text-muted-foreground">{t('demo.network_prompt')}</p>
        <a
          href="/contacto"
          class="mt-1.5 inline-flex items-center gap-1 text-sm font-semibold text-foreground underline-offset-4 hover:text-body hover:underline"
        >
          {t('demo.network_cta')}
          <ArrowRight class="size-3.5" />
        </a>
      </div>
    </div>
  </div>

  </main>

  <footer class="border-t border-border bg-background py-4 text-center text-mockup-sm text-muted-foreground">
    &copy; {new Date().getFullYear()} {BRAND}
  </footer>
</div>

<style>
  mark { background-color: inherit; color: inherit; }

  @media (prefers-reduced-motion: no-preference) {
    .demo-result-list {
      animation: demo-results-enter 180ms ease-out;
    }
  }

  @keyframes demo-results-enter {
    from {
      opacity: 0.8;
      transform: translateY(0.25rem);
    }
  }
</style>
