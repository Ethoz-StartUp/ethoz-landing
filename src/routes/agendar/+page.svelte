<script lang="ts">
  import Footer from '$lib/components/Footer.svelte';
  import NavBar from '$lib/components/NavBar.svelte';
  import { t } from '$lib/i18n/index.svelte';
  import { Check, Building, MapPin, Loader2 } from '@lucide/svelte';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { page } from '$app/state';
  import { browser } from '$app/environment';
  import { trackEvent } from '$lib/utils/analytics';
  import { onMount, untrack } from 'svelte';
  import { captureException } from '$lib/sentry';

  // Read from sessionStorage (preferred) or fall back to URL params for backwards compat
  let scheduleData = $state<Record<string, string>>({});
  $effect(() => {
    if (!browser) return;
    const stored = sessionStorage.getItem('ethoz-schedule');
    if (stored) {
      try { scheduleData = JSON.parse(stored); } catch {}
      sessionStorage.removeItem('ethoz-schedule');
    } else {
      // Backwards compatibility: read from URL params
      const p = new URLSearchParams(page.url.search);
      scheduleData = {
        school: p.get('school') ?? '',
        name: p.get('name') ?? '',
        email: p.get('email') ?? '',
        commune: p.get('commune') ?? '',
        region: p.get('region') ?? '',
      };
      // Clean PII from URL without reload
      if (p.has('email') || p.has('name')) {
        window.history.replaceState({}, '', '/agendar');
      }
    }
  });
  const schoolName = $derived(scheduleData.school ?? '');
  const contactName = $derived(scheduleData.name ?? '');
  const contactEmail = $derived(scheduleData.email ?? '');
  const commune = $derived(scheduleData.commune ?? '');
  const region = $derived(scheduleData.region ?? '');

  let calContainer = $state<HTMLDivElement | null>(null);
  let calLoaded = $state(false);
  let embedRendered = $state(false);
  let calError = $state(false);
  // One-shot guard: the Cal embed must register Cal('inline') / Cal('on', ...) exactly
  // once. sessionStorage hydration mutates contactName/contactEmail, which would otherwise
  // re-trigger this effect and register the booking listeners twice (duplicate analytics + DB writes).
  let calInitialized = $state(false);

  function captureError(err: unknown, context?: Record<string, unknown>) {
    if (!browser) return;
    captureException(err, context);
  }

  // Load Cal.com embed script and render inline
  $effect(() => {
    if (calInitialized || !browser || !calContainer) return;
    calInitialized = true;

    // Cal.com embed loader (official snippet)
    const win = window as any;
    (function (C: any, A: string, L: string) {
      const p = function (a: any, ar: any) { a.q.push(ar); };
      const d = C.document;
      C.Cal = C.Cal || function () {
        const cal = C.Cal;
        const ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          const s = d.createElement('script');
          s.src = A;
          s.onerror = () => { calLoaded = true; calError = true; };
          d.head.appendChild(s);
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api: any = function () { p(api, arguments); };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === 'string') {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ['initNamespace', namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(win, 'https://app.cal.com/embed/embed.js', 'init');

    const Cal = win.Cal;
    Cal('init', { origin: 'https://cal.com' });

    // Build config with pre-filled data. Read prefill values via untrack so that
    // sessionStorage hydration mutating contactName/contactEmail never re-triggers this effect.
    const prefill = untrack(() => ({ name: contactName, email: contactEmail, school: schoolName }));

    const config: Record<string, string> = {
      theme: 'light',
      timeFormat: '24',   // Force 24h format (Chile standard)
    };
    if (prefill.name) config.name = prefill.name;
    if (prefill.email) config.email = prefill.email;

    Cal('inline', {
      elementOrSelector: calContainer,
      calLink: 'ethoz/demo',
      config
    });

    Cal('ui', {
      theme: 'light',
      styles: { branding: {
        // lint-ok: Cal.com embed SDK expects hex literal; keep in sync with --primary (#F97316)
        brandColor: '#F97316'
      } },
      hideEventTypeDetails: false,
      hideBranding: true,
      layout: 'month_view'
    });

    // Embed is rendered when Cal fires linkReady — bookingSuccessful arrives later.
    Cal('on', {
      action: 'linkReady',
      callback: () => {
        embedRendered = true;
        calLoaded = true;
      }
    });

    // Listen for Cal.com events — client-side lead update (immediate)
    Cal('on', {
      action: 'bookingSuccessful',
      callback: () => {
        trackEvent('demo_booked', { school: prefill.school });
        // Lead status is handled by backend integrations; the public landing no longer writes directly to the database.
      }
    });

    // Timeout fallback if embed doesn't render (linkReady never fires).
    setTimeout(() => {
      if (!embedRendered) {
        calLoaded = true;
        calError = true;
        captureError(new Error('Cal.com embed failed to render within 10s'), {
          fn: 'schedule.embedTimeout'
        });
      }
    }, 10000);
  });

  onMount(() => {
    trackEvent('agendar_page_viewed', { school: schoolName });
  });
</script>

<svelte:head>
  <title>{t('meta.schedule_title')}</title>
  <meta name="description" content={t('meta.schedule_description')} />
  <meta name="robots" content="noindex, nofollow" />
  <meta property="og:url" content="https://ethoz.cl/agendar" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={t('meta.schedule_title')} />
  <meta property="og:description" content={t('meta.schedule_description')} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={t('meta.schedule_title')} />
  <meta name="twitter:description" content={t('meta.schedule_description')} />
  <link rel="canonical" href="https://ethoz.cl/agendar" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Demo","item":"https://ethoz.cl/demo"},{"@type":"ListItem","position":3,"name":"Agendar demo"}]})}</script>`}
</svelte:head>

<div class="flex min-h-dvh flex-col bg-background">
  <!-- Skip link — WCAG 2.4.1 Bypass Blocks -->
  <a
    href="#schedule-main"
    class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:border focus:border-foreground focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-foreground"
  >
    {t('nav.skip_to_content')}
  </a>
  <NavBar />

  <main id="main-content" class="flex flex-1 flex-col">

  <div id="schedule-main" class="mx-auto w-full max-w-7xl flex-1 px-4 py-12 pt-24 sm:py-16 sm:pt-28">
    <!-- Step indicator -->
    <nav aria-label={t('agendar.steps_nav_aria')} class="mb-8">
      <ol class="mx-auto flex max-w-lg items-center justify-center gap-3">
        {#each [{ labelKey: 'agendar.step_find_school' as const, n: 1 }, { labelKey: 'agendar.step_complete_data' as const, n: 2 }, { labelKey: 'agendar.step_schedule_demo' as const, n: 3 }] as s}
          <li class="flex items-center gap-2" aria-current={3 === s.n ? 'step' : undefined}>
            <span class="flex size-7 items-center justify-center rounded-full text-xs font-bold {3 >= s.n ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}" aria-hidden="true">
              {s.n}
            </span>
            <span class="hidden text-xs font-medium sm:block {3 >= s.n ? 'text-foreground' : 'text-muted-foreground'}">
              <span class="sr-only">{t('agendar.step_label_prefix')} {s.n}{3 > s.n ? t('agendar.step_completed_suffix') : 3 === s.n ? t('agendar.step_current_suffix') : ''}: </span>{t(s.labelKey)}
            {#if s.n < 3}
              <span aria-hidden="true" class="ml-1 h-px w-8 {3 > s.n ? 'bg-primary' : 'bg-border'}"></span>
            {/if}
            </span>
          </li>
        {/each}
      </ol>
    </nav>

    <!-- Success banner -->
    {#if schoolName || contactName || contactEmail}
      <div class="mb-8 flex items-start gap-4 rounded-xl border border-success/20 bg-success/5 p-5">
        <div class="flex size-10 shrink-0 items-center justify-center rounded-full bg-success/10">
          <Check class="size-5 text-success" />
        </div>
        <div>
          <h2 class="text-base font-semibold text-foreground">{t('agendar.received')}</h2>
          <div class="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span class="flex items-center gap-1.5">
              <Building class="size-3.5" />
              {schoolName}
            </span>
            {#if commune}
              <span class="flex items-center gap-1.5">
                <MapPin class="size-3.5" />
                {commune}{region ? `, ${region}` : ''}
              </span>
            {/if}
            {#if contactName}
              <span>{contactName}</span>
            {/if}
            {#if contactEmail}
              <span class="text-primary">{contactEmail}</span>
            {/if}
          </div>
        </div>
      </div>
    {/if}

    <!-- Heading -->
    <div class="mb-8 text-center">
      <p class="mb-3 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">{t('demo.step3.eyebrow')}</p>
      <h1 class="text-2xl text-foreground sm:text-3xl">
        {t('agendar.title')}
      </h1>
      <p class="mt-2 text-sm text-muted-foreground">
        {t('agendar.subtitle')}
      </p>
      <p class="mx-auto mt-4 max-w-lg text-xs leading-relaxed text-muted-foreground">
        {t('demo.step3.description')}
      </p>
    </div>

    <!-- Cal.com inline embed — auto-resizes, no double scroll -->
    <section aria-label={t('agendar.calendar_section_aria')} class="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
      {#if !calLoaded}
        <div class="px-6 py-12" role="status" aria-live="polite">
          <div class="flex flex-col items-center gap-3">
            <Loader2 class="size-8 animate-spin text-primary" aria-hidden="true" />
            <p class="text-sm text-muted-foreground">{t('a11y.calendar.loading')}</p>
          </div>
          <div class="mx-auto mt-8 w-full max-w-sm space-y-2" aria-hidden="true">
            <Skeleton class="h-7 w-32" />
            <Skeleton class="h-10 w-full" />
            <Skeleton class="h-10 w-full" />
            <Skeleton class="h-10 w-full" />
            <Skeleton class="h-10 w-full" />
          </div>
        </div>
      {/if}
      {#if calError}
        <div class="flex flex-col items-center gap-3 py-12 text-center" role="alert">
          <p class="text-sm text-muted-foreground">{t('a11y.calendar.error')}</p>
          <a href="https://cal.com/ethoz/demo" target="_blank" rel="noopener noreferrer" class="text-sm font-medium text-primary underline-offset-4 hover:underline">
            {t('agendar.cal_fallback_link')}
            <span class="sr-only">{t('agendar.opens_new_tab')}</span>
          </a>
        </div>
      {/if}
      <div bind:this={calContainer} class="w-full"></div>
    </section>
  </div>

  </main>

  <Footer />
</div>
