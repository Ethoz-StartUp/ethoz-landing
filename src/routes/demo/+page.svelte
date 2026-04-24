<script lang="ts">
  import { goto } from '$app/navigation';
  import { onDestroy } from 'svelte';
  import NavBar from '$lib/components/NavBar.svelte';
  import { t } from '$lib/i18n/index.svelte';
  import { schoolStore, type School } from '$lib/stores/schools.svelte';
  import { trackEvent } from '$lib/utils/analytics';
  import { normalize } from '$lib/utils/text';
  import {
    Search,
    Building,
    MapPin,
    ChevronRight,
    Loader2,
    GraduationCap
  } from '@lucide/svelte';

  // ── State ──
  let searchInput = $state('');
  let highlightIndex = $state(-1);
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  let searchInputEl = $state<HTMLInputElement | null>(null);
  let resultsListEl = $state<HTMLUListElement | null>(null);

  // ── Derived ──
  const schools = $derived(schoolStore.filteredSchools);
  const hasResults = $derived(schools.length > 0);
  const showNoResults = $derived(
    !schoolStore.loading && searchInput.trim().length >= 2 && !hasResults
  );

  // ── Effects ──
  $effect(() => {
    schoolStore.load();
  });

  $effect(() => {
    if (schoolStore.loaded && searchInputEl) {
      setTimeout(() => searchInputEl?.focus(), 100);
    }
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
    debounceTimer = setTimeout(() => schoolStore.setSearch(value), 150);
  }

  function selectSchool(school: School) {
    trackEvent('school_selected', { rbd: school.rbd.toString(), name: school.name });
    goto(`/demo/${school.rbd}`);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (!hasResults) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      highlightIndex = Math.min(highlightIndex + 1, schools.length - 1);
      scrollHighlighted();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      highlightIndex = Math.max(highlightIndex - 1, -1);
      scrollHighlighted();
    } else if (e.key === 'Enter' && highlightIndex >= 0) {
      e.preventDefault();
      selectSchool(schools[highlightIndex]);
    }
  }

  function scrollHighlighted() {
    requestAnimationFrame(() => {
      resultsListEl
        ?.querySelector('[data-highlighted="true"]')
        ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  }

  onDestroy(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
  });
</script>

<svelte:window onkeydown={handleKeydown} />

<svelte:head>
  <title>Ethoz — {t('nav.cta')}</title>
  <meta name="description" content="Solicita una demo personalizada de Ethoz para tu colegio. Busca tu establecimiento y agenda una presentación." />
  <meta property="og:url" content="https://ethoz.cl/demo" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Demo — Ethoz" />
  <meta property="og:description" content="Solicita una demo personalizada de Ethoz para tu colegio." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Demo — Ethoz" />
  <meta name="twitter:description" content="Solicita una demo personalizada de Ethoz para tu colegio." />
  <link rel="canonical" href="https://ethoz.cl/demo" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Demo"}]})}</script>`}
</svelte:head>

<main class="flex min-h-dvh flex-col bg-secondary pt-16">
  <!-- Skip link — WCAG 2.4.1 Bypass Blocks -->
  <a
    href="#demo-search-main"
    class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:border focus:border-foreground focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-foreground"
  >
    {t('nav.skip_to_content')}
  </a>
  <NavBar />

  <!-- Step indicator -->
  <nav aria-label="Progreso del proceso de demo" class="border-b border-border bg-background py-4">
    <ol class="mx-auto flex max-w-lg items-center justify-center gap-3 px-4">
      {#each [{ label: 'Busca tu colegio', n: 1 }, { label: 'Completa tus datos', n: 2 }, { label: 'Agenda tu demo', n: 3 }] as s}
        <li class="flex items-center gap-2" aria-current={1 === s.n ? 'step' : undefined}>
          <span class="flex size-7 items-center justify-center rounded-full text-xs font-bold {1 >= s.n ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}" aria-hidden="true">
            {s.n}
          </span>
          <span class="hidden text-xs font-medium sm:block {1 >= s.n ? 'text-foreground' : 'text-muted-foreground'}">
            <span class="sr-only">Paso {s.n}{1 > s.n ? ' (completado)' : 1 === s.n ? ' (actual)' : ''}: </span>{s.label}
          </span>
          {#if s.n < 3}
            <span aria-hidden="true" class="ml-1 h-px w-8 {1 > s.n ? 'bg-primary' : 'bg-border'}"></span>
          {/if}
        </li>
      {/each}
    </ol>
  </nav>

  <!-- Content -->
  <div id="demo-search-main" class="mx-auto flex-1 max-w-lg px-4 py-12 sm:py-16">
    <div class="space-y-6">
      <div class="text-center">
        <div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10">
          <GraduationCap class="size-7 text-primary" />
        </div>
        <p class="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Demo personalizada · 30 minutos</p>
        <h1 class="text-2xl font-bold tracking-tight text-foreground">
          {t('demo.step1.title')}
        </h1>
        <p class="mt-2 text-sm text-muted-foreground">
          {t('demo.step1.subtitle')}
        </p>
        <p class="mx-auto mt-5 max-w-md text-xs leading-relaxed text-muted-foreground">
          Cargamos tu colegio, tus cursos y un caso real similar. No hablamos de features; te mostramos cómo quedaría el lunes próximo.
        </p>
      </div>

      {#if schoolStore.loading}
        <div class="flex flex-col items-center gap-3 py-16" role="status" aria-live="polite">
          <Loader2 class="size-8 animate-spin text-primary" aria-hidden="true" />
          <p class="text-sm text-muted-foreground">{t('demo.search.loading')}</p>
        </div>
      {:else}
        <!-- Search input — ARIA 1.2 combobox pattern -->
        <div class="sticky top-16 z-10 bg-secondary pb-3 pt-3">
          <label for="demo-school-search" class="sr-only">{t('demo.step1.title')}</label>
          <p id="demo-search-instructions" class="sr-only">{t('a11y.search.instructions')}</p>
          <div class="relative">
            <Search aria-hidden="true" class="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              bind:this={searchInputEl}
              id="demo-school-search"
              type="text"
              value={searchInput}
              oninput={handleSearch}
              placeholder={t('demo.search.placeholder')}
              autocomplete="off"
              role="combobox"
              aria-autocomplete="list"
              aria-controls="demo-school-results"
              aria-expanded={hasResults}
              aria-activedescendant={hasResults && highlightIndex >= 0 ? `school-opt-${highlightIndex}` : undefined}
              aria-describedby="demo-search-instructions"
              class="w-full rounded-xl border border-border bg-background py-4 pl-11 pr-4 text-base text-foreground shadow-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <!-- Live region for result count (polite, non-intrusive) -->
        <div class="sr-only" aria-live="polite" aria-atomic="true">
          {#if hasResults}
            {schools.length === 1 ? t('a11y.search.results_count_one') : `${schools.length} ${t('a11y.search.results_count_many')}`}
          {:else if showNoResults}
            {t('a11y.search.no_results')}
          {/if}
        </div>

        {#if searchInput.trim().length < 2 && !hasResults}
          <p class="text-center text-xs text-muted-foreground">{t('demo.search.hint')}</p>
        {/if}

        <!-- Results list — flows in page, no nested scroll -->
        {#if hasResults}
          <ul
            bind:this={resultsListEl}
            id="demo-school-results"
            class="space-y-1"
            role="listbox"
            aria-label={t('demo.step1.title')}
          >
            {#each schools.slice(0, 30) as school, i}
              {@const match = highlightMatch(school.name, searchInput.trim())}
              <li
                id={`school-opt-${i}`}
                role="option"
                aria-selected={highlightIndex === i}
                data-highlighted={highlightIndex === i}
              >
                <button
                  type="button"
                  tabindex="-1"
                  onclick={() => selectSchool(school)}
                  class="flex w-full items-center gap-3 rounded-xl border bg-background px-4 py-3 text-left shadow-sm transition-all hover:border-primary/30 hover:shadow-md {highlightIndex === i ? 'border-primary/30 shadow-md' : 'border-border'}"
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
            <button
              type="button"
              onclick={() => goto(`/demo/0?manual=1&school=${encodeURIComponent(searchInput.trim())}`)}
              class="mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t('demo.manual')}
              <ChevronRight aria-hidden="true" class="size-3.5" />
            </button>
          </div>
        {/if}

        <!-- Always show manual option -->
        {#if searchInput.trim().length >= 2}
          <div class="text-center">
            <button
              type="button"
              onclick={() => goto(`/demo/0?manual=1&school=${encodeURIComponent(searchInput.trim())}`)}
              class="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              ¿No encuentras tu colegio? Continúa con el nombre a mano
            </button>
          </div>
        {/if}
      {/if}
    </div>
  </div>

  <footer class="border-t border-border bg-background py-4 text-center text-[11px] text-muted-foreground">
    &copy; {new Date().getFullYear()} Ethoz
  </footer>
</main>

<style>
  mark { background-color: inherit; color: inherit; }
</style>
