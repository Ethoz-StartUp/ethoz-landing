<script lang="ts">
  import Footer from '$lib/components/Footer.svelte';
  import NavBar from '$lib/components/NavBar.svelte';
  import { t } from '$lib/i18n/index.svelte';
  import { Check, Building, MapPin, Loader2 } from '@lucide/svelte';
  import { page } from '$app/state';
  import { browser } from '$app/environment';
  import { trackEvent } from '$lib/utils/analytics';
  import { updateLeadStatus } from '$lib/supabase';
  import { onMount } from 'svelte';

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
        window.history.replaceState({}, '', '/schedule');
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

  function captureError(err: unknown, context?: Record<string, unknown>) {
    if (!browser) return;
    import('@sentry/browser')
      .then((Sentry) => Sentry.captureException(err, { extra: context }))
      .catch(() => {});
  }

  // Load Cal.com embed script and render inline
  $effect(() => {
    if (!browser || !calContainer) return;

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

    // Build config with pre-filled data
    const config: Record<string, string> = {
      theme: 'light',
      timeFormat: '24',   // Force 24h format (Chile standard)
    };
    if (contactName) config.name = contactName;
    if (contactEmail) config.email = contactEmail;

    Cal('inline', {
      elementOrSelector: calContainer,
      calLink: 'ethoz/demo',
      config
    });

    Cal('ui', {
      theme: 'light',
      styles: { branding: {
        // lint-ok: Cal.com embed SDK expects hex literal; keep in sync with --primary (Cal black)
        brandColor: '#111111'
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
        trackEvent('demo_booked', { school: schoolName });

        if (contactEmail) {
          updateLeadStatus(
            contactEmail,
            'demo_scheduled',
            `Booked via Cal.com | School: ${schoolName}`
          ).catch((err) => captureError(err, { fn: 'schedule.updateLeadStatus' }));
        }
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
  <title>Agendar Demo — Ethoz</title>
  <meta name="description" content="Agenda una demostración personalizada de Ethoz para tu colegio." />
  <meta property="og:url" content="https://ethoz.cl/schedule" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Agendar Demo — Ethoz" />
  <meta property="og:description" content="Agenda una demostración personalizada de Ethoz para tu colegio." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Agendar Demo — Ethoz" />
  <meta name="twitter:description" content="Agenda una demostración personalizada de Ethoz para tu colegio." />
  <link rel="canonical" href="https://ethoz.cl/schedule" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Demo","item":"https://ethoz.cl/demo"},{"@type":"ListItem","position":3,"name":"Agendar Demo"}]})}</script>`}
</svelte:head>

<main class="flex min-h-dvh flex-col bg-background">
  <!-- Skip link — WCAG 2.4.1 Bypass Blocks -->
  <a
    href="#schedule-main"
    class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:border focus:border-foreground focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-foreground"
  >
    {t('nav.skip_to_content')}
  </a>
  <NavBar />

  <div id="schedule-main" class="mx-auto w-full max-w-7xl flex-1 px-4 py-12 pt-24 sm:py-16 sm:pt-28">
    <!-- Step indicator -->
    <nav aria-label="Progreso del proceso de demo" class="mb-8">
      <ol class="mx-auto flex max-w-lg items-center justify-center gap-3">
        {#each [{ label: 'Busca tu colegio', n: 1 }, { label: 'Completa tus datos', n: 2 }, { label: 'Agenda tu demo', n: 3 }] as s}
          <li class="flex items-center gap-2" aria-current={3 === s.n ? 'step' : undefined}>
            <span class="flex size-7 items-center justify-center rounded-full text-xs font-bold {3 >= s.n ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}" aria-hidden="true">
              {s.n}
            </span>
            <span class="hidden text-xs font-medium sm:block {3 >= s.n ? 'text-foreground' : 'text-muted-foreground'}">
              <span class="sr-only">Paso {s.n}{3 > s.n ? ' (completado)' : 3 === s.n ? ' (actual)' : ''}: </span>{s.label}
            </span>
            {#if s.n < 3}
              <span aria-hidden="true" class="ml-1 h-px w-8 {3 > s.n ? 'bg-primary' : 'bg-border'}"></span>
            {/if}
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
      <p class="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t('demo.step3.eyebrow')}</p>
      <h1 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
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
    <section aria-label="Calendario de agenda" class="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
      {#if !calLoaded}
        <div class="flex items-center justify-center py-20" role="status" aria-live="polite">
          <div class="flex flex-col items-center gap-3">
            <Loader2 class="size-8 animate-spin text-primary" aria-hidden="true" />
            <p class="text-sm text-muted-foreground">{t('a11y.calendar.loading')}</p>
          </div>
        </div>
      {/if}
      {#if calError}
        <div class="flex flex-col items-center gap-3 py-12 text-center" role="alert">
          <p class="text-sm text-muted-foreground">{t('a11y.calendar.error')}</p>
          <a href="https://cal.com/ethoz/demo" target="_blank" rel="noopener noreferrer" class="text-sm font-medium text-primary underline-offset-4 hover:underline">
            Agendar directamente en Cal.com
            <span class="sr-only">(se abre en una pestaña nueva)</span>
          </a>
        </div>
      {/if}
      <div bind:this={calContainer} class="w-full"></div>
    </section>
  </div>

  <Footer />
</main>
