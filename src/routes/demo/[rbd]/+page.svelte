<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { browser } from '$app/environment';
  import NavBar from '$lib/components/NavBar.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { t } from '$lib/i18n/index.svelte';
  import { schoolStore } from '$lib/stores/schools.svelte';
  import { trackEvent } from '$lib/utils/analytics';
  import { saveLead } from '$lib/supabase';
  import { executeRecaptcha, getRecaptchaScriptUrl } from '$lib/utils/recaptcha';
  import { untrack } from 'svelte';
  import {
    Building,
    MapPin,
    ChevronRight,
    ChevronLeft,
    Loader2,
    GraduationCap,
    ChevronDown,
    Users
  } from '@lucide/svelte';

  // ── Route param ──
  const rbd = $derived(Number(page.params.rbd));
  const isManual = $derived(page.url.searchParams.get('manual') === '1');
  let manualSchoolName = $state(page.url.searchParams.get('school') ?? '');

  // ── Form state ──
  const STORAGE_KEY = 'ethoz-demo-form';
  let contactName = $state('');
  let contactRole = $state('');
  let contactEmail = $state('');
  let contactPhone = $state('');
  let contactSource = $state('');
  let submitting = $state(false);
  let formRestored = $state(false);
  let errorMessage = $state('');

  let mapContainer = $state<HTMLDivElement | null>(null);
  let mapInstance: any = null;
  let mapFailed = $state(false);
  let recaptchaFailed = $state(false);

  function captureError(err: unknown, context?: Record<string, unknown>) {
    if (!browser) return;
    import('@sentry/browser')
      .then((Sentry) => Sentry.captureException(err, { extra: context }))
      .catch(() => {});
  }

  // ── Load school by RBD (skip if manual) ──
  $effect(() => {
    if (!isManual) untrack(() => schoolStore.load());
  });

  $effect(() => {
    if (!isManual && schoolStore.loaded && rbd) {
      untrack(() => {
        schoolStore.selectSchool(rbd);
        if (!schoolStore.selectedSchool) {
          goto('/demo', { replaceState: true });
        }
      });
    }
  });

  // ── Restore form from sessionStorage ──
  $effect(() => {
    if (!browser || formRestored) return;
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        contactName = data.name ?? '';
        contactRole = data.role ?? '';
        contactEmail = data.email ?? '';
        contactPhone = data.phone ?? '';
        contactSource = data.source ?? '';
      } catch {}
    }
    formRestored = true;
  });

  // ── Auto-save form to sessionStorage ──
  $effect(() => {
    if (!formRestored || !browser) return;
    const data = {
      name: contactName,
      role: contactRole,
      email: contactEmail,
      phone: contactPhone,
      source: contactSource
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  });

  // ── Load reCAPTCHA script ──
  $effect(() => {
    if (!browser) return;
    const src = getRecaptchaScriptUrl();
    if (!src || document.querySelector(`script[src="${src}"]`)) return;
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.head.appendChild(script);
  });

  // ── Map ──
  $effect(() => {
    const school = schoolStore.selectedSchool;
    const container = mapContainer;
    if (!school || !container || school.lat === 0 || school.lng === 0) return;
    if (mapInstance || (container as any)._leaflet_id) return;

    import('leaflet/dist/leaflet.css');
    import('leaflet')
      .then((L) => {
        if (mapInstance || (container as any)._leaflet_id) return;
        mapInstance = L.map(container, {
          attributionControl: false,
          zoomControl: false,
          dragging: false,
          touchZoom: false,
          scrollWheelZoom: false,
          doubleClickZoom: false,
          boxZoom: false,
          keyboard: false,
        }).setView([school.lat, school.lng], 15);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(mapInstance);
        const pinIcon = L.divIcon({
          className: 'ethoz-map-pin',
          // lint-ok: Leaflet div-icon API requires hex literal in raw HTML string; keep in sync with --primary (#111111)
          html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32" width="28" height="36" aria-hidden="true"><path d="M12 0C5.4 0 0 5.4 0 12c0 8.4 12 20 12 20s12-11.6 12-20C24 5.4 18.6 0 12 0z" fill="#111111"/><circle cx="12" cy="12" r="4.5" fill="#FFFFFF"/></svg>',
          iconSize: [28, 36],
          iconAnchor: [14, 36],
        });
        L.marker([school.lat, school.lng], { icon: pinIcon }).addTo(mapInstance);
        setTimeout(() => mapInstance?.invalidateSize(), 100);
      })
      .catch((err) => {
        mapFailed = true;
        captureError(err, { fn: 'demo.leafletImport' });
      });

    return () => {
      if (mapInstance) {
        mapInstance.remove();
        mapInstance = null;
      }
    };
  });

  // ── Helpers ──
  function regionName(code: number): string {
    return schoolStore.regions.find((r) => r.code === code)?.name ?? '';
  }

  function depTypeLabel(depType: number): string {
    const labels: Record<number, string> = {
      1: 'Municipal',
      2: 'Part. Subvencionado',
      3: 'Part. Pagado',
      4: 'Corp. Adm. Delegada'
    };
    return labels[depType] ?? '';
  }

  // ── Submit ──
  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (submitting) return; // double-submit guard
    submitting = true;
    errorMessage = '';
    recaptchaFailed = false;

    try {
      let recaptchaToken: string | null = null;
      try {
        recaptchaToken = await executeRecaptcha('submit_demo');
      } catch (err) {
        captureError(err, { fn: 'demo.executeRecaptcha' });
        recaptchaFailed = true;
        errorMessage = 'No pudimos verificar que seas humano. Escríbenos a hola@ethoz.cl o intenta más tarde.';
        submitting = false;
        return;
      }
      const school = isManual ? null : schoolStore.selectedSchool;
      const schoolName = isManual ? manualSchoolName.trim() : (school?.name ?? '');

      const result = await saveLead({
        school_name: schoolName,
        school_rbd: school?.rbd,
        school_commune: school?.commune ?? '',
        contact_name: contactName,
        contact_role: contactRole,
        contact_email: contactEmail,
        contact_phone: contactPhone || undefined,
        contact_source: contactSource || undefined,
        notes: isManual ? 'Entrada manual — colegio no encontrado en directorio' : undefined,
        status: 'new',
      }, recaptchaToken);

      if (!result.ok) {
        console.error('[Demo] Lead save failed:', result.error);
        errorMessage = 'No pudimos guardar tu solicitud. Por favor intenta de nuevo.';
        submitting = false;
        return;
      }

      trackEvent('demo_form_submitted', { school: schoolName, manual: isManual });

      // Clear saved form
      if (browser) sessionStorage.removeItem(STORAGE_KEY);

      // Store form data in sessionStorage (avoid PII in URL params)
      if (browser) {
        sessionStorage.setItem('ethoz-schedule', JSON.stringify({
          school: schoolName,
          commune: school?.commune ?? '',
          region: school ? (schoolStore.regions.find(r => r.code === school.regionCode)?.name ?? '') : '',
          name: contactName,
          email: contactEmail,
        }));
      }

      goto('/schedule');
    } finally {
      submitting = false;
    }
  }
</script>

<svelte:head>
  <title>Ethoz — {t('nav.cta')}</title>
  <meta name="description" content="Solicita una demo personalizada de Ethoz para tu colegio. Agenda una presentación con nuestro equipo." />
  <meta property="og:url" content="https://ethoz.cl/demo" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Demo — Ethoz" />
  <meta property="og:description" content="Solicita una demo personalizada de Ethoz para tu colegio." />
  <link rel="canonical" href="https://ethoz.cl/demo" />
</svelte:head>

<main class="flex min-h-dvh flex-col bg-secondary pt-28 sm:pt-32">
  <!-- Skip link — WCAG 2.4.1 Bypass Blocks -->
  <a
    href="#demo-form-main"
    class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:border focus:border-foreground focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-foreground"
  >
    {t('nav.skip_to_content')}
  </a>
  <NavBar />

  <!-- Step indicator -->
  <nav aria-label="Progreso del proceso de demo" class="border-b border-border bg-background py-4">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <ol class="mx-auto flex max-w-2xl items-center justify-center gap-3">
      {#each [{ label: 'Busca tu colegio', n: 1 }, { label: 'Completa tus datos', n: 2 }, { label: 'Agenda tu demo', n: 3 }] as s}
        <li class="flex items-center gap-2" aria-current={2 === s.n ? 'step' : undefined}>
          <span class="flex size-7 items-center justify-center rounded-full text-xs font-bold {2 >= s.n ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}" aria-hidden="true">
            {s.n}
          </span>
          <span class="hidden text-xs font-medium sm:block {2 >= s.n ? 'text-foreground' : 'text-muted-foreground'}">
            <span class="sr-only">Paso {s.n}{2 > s.n ? ' (completado)' : 2 === s.n ? ' (actual)' : ''}: </span>{s.label}
          </span>
          {#if s.n < 3}
            <span aria-hidden="true" class="ml-1 h-px w-8 {2 > s.n ? 'bg-primary' : 'bg-border'}"></span>
          {/if}
        </li>
      {/each}
    </ol>
    </div>
  </nav>

  <!-- Content -->
  <div id="demo-form-main" class="mx-auto flex-1 max-w-7xl px-4 py-12 sm:py-16">
    {#if !isManual && (schoolStore.loading || !schoolStore.selectedSchool)}
      <div class="flex flex-col items-center gap-3 py-16" role="status" aria-live="polite">
        <Loader2 class="size-8 animate-spin text-primary" aria-hidden="true" />
        <p class="text-sm text-muted-foreground">{t('demo.search.loading')}</p>
      </div>
    {:else}
      {@const school = isManual ? null : schoolStore.selectedSchool}
      <div class="space-y-8">
        <div class="text-center">
          <p class="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t('demo.step2.eyebrow')}</p>
          <h1 class="text-2xl font-bold tracking-tight text-foreground">
            {t('demo.step2.title')}
          </h1>
          <p class="mx-auto mt-3 max-w-md text-xs leading-relaxed text-muted-foreground">
            {t('demo.step2.description')}
          </p>
          <a href="/demo" class="mt-3 inline-flex items-center gap-1 text-sm text-primary transition-colors hover:text-primary">
            <ChevronLeft class="size-4" />
            {t('demo.step2.change')}
          </a>
        </div>

        <div class="grid gap-8 lg:grid-cols-2">
          <!-- Left: school info + map -->
          <div class="space-y-6">
            {#if isManual}
              <!-- Manual entry card -->
              <div class="rounded-xl border border-border bg-background p-5 shadow-sm">
                <div class="flex items-center gap-2.5 mb-4">
                  <GraduationCap class="size-5 shrink-0 text-primary" />
                  <h2 class="text-base font-semibold text-foreground">Datos del colegio</h2>
                </div>
                <div class="space-y-3">
                  <div class="space-y-1.5">
                    <label for="manual-school" class="block text-sm font-medium text-foreground">
                      Nombre del colegio <span class="text-destructive">*</span>
                    </label>
                    <input
                      id="manual-school"
                      type="text"
                      required
                      bind:value={manualSchoolName}
                      placeholder="Ej: Colegio San Patricio"
                      autocapitalize="words"
                      class="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <p class="mt-3 text-xs text-muted-foreground">
                  No te preocupes si no encontraste tu colegio en el buscador. Completa los datos y nos pondremos en contacto contigo.
                </p>
              </div>
            {:else}
            <!-- Selected school card -->
            <div class="rounded-xl border border-primary/20 bg-background shadow-sm">
              <!-- Card header -->
              <div class="border-b border-border px-5 py-4">
                <div class="flex items-start gap-3">
                  <div class="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <GraduationCap class="size-5 text-primary" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <h2 class="text-base font-semibold leading-snug text-foreground">{school?.name}</h2>
                    <Badge variant="outline" class="mt-1 font-mono text-xs">
                      {t('demo.rbd')} {school?.rbd}
                    </Badge>
                  </div>
                </div>
              </div>

              <!-- Card body: detail grid -->
              <div class="grid grid-cols-2 gap-px bg-border">
                <div class="flex items-start gap-2.5 bg-background px-4 py-3">
                  <MapPin class="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  <div class="min-w-0">
                    <p class="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{t('demo.commune')}</p>
                    <p class="truncate text-sm text-foreground">{school?.commune}</p>
                  </div>
                </div>
                <div class="flex items-start gap-2.5 bg-background px-4 py-3">
                  <MapPin class="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  <div class="min-w-0">
                    <p class="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{t('demo.region')}</p>
                    <p class="truncate text-sm text-foreground">{regionName(school?.regionCode ?? 0)}</p>
                  </div>
                </div>
                <div class="flex items-start gap-2.5 bg-background px-4 py-3">
                  <Users class="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  <div class="min-w-0">
                    <p class="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{t('demo.enrollment.label')}</p>
                    <p class="text-sm text-foreground">{school?.enrollment.toLocaleString('es-CL')} {t('demo.enrollment')}</p>
                  </div>
                </div>
                <div class="flex items-start gap-2.5 bg-background px-4 py-3">
                  <Building class="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  <div class="min-w-0">
                    <p class="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Dependencia</p>
                    <p class="text-sm text-foreground">{depTypeLabel(school?.depType ?? 0)}</p>
                  </div>
                </div>
                <div class="col-span-2 flex items-start gap-2.5 bg-background px-4 py-3">
                  <Building class="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  <div class="min-w-0">
                    <p class="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{t('demo.sostenedor')}</p>
                    <p class="truncate text-sm text-foreground">{school?.sostenedor}</p>
                  </div>
                </div>
              </div>

            </div>

            <!-- Map — desktop only -->
            {#if school?.lat !== 0}
              {#if mapFailed}
                <div class="hidden rounded-xl border border-border bg-background p-4 text-sm text-muted-foreground lg:block">
                  <p class="font-medium text-foreground">Ubicación</p>
                  <p class="mt-1">{school?.commune}{school ? `, ${regionName(school.regionCode)}` : ''}</p>
                  {#if school?.name}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(school.name + ' ' + (school.commune ?? ''))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="mt-2 inline-block text-primary underline-offset-2 hover:underline"
                    >
                      Ver en Google Maps →
                    </a>
                  {/if}
                </div>
              {:else}
                <div
                  bind:this={mapContainer}
                  role="img"
                  aria-label={t('a11y.map.region_label')}
                  class="hidden h-64 w-full overflow-hidden rounded-xl border border-border lg:block"
                ></div>
              {/if}
            {/if}
            {/if}
          </div>

          <!-- Right: contact form -->
          <div>
            <form onsubmit={handleSubmit} class="space-y-4" aria-busy={submitting}>
              <div class="space-y-1.5">
                <label for="contact-name" class="block text-sm font-medium text-foreground">
                  {t('demo.form.name')} <span class="text-destructive">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  bind:value={contactName}
                  placeholder={t('demo.form.name.placeholder')}
                  autocomplete="name"
                  autocapitalize="words"
                  enterkeyhint="next"
                  class="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div class="space-y-1.5">
                <label for="contact-role" class="block text-sm font-medium text-foreground">
                  {t('demo.form.role')} <span class="text-destructive">*</span>
                </label>
                <div class="relative">
                  <select
                    id="contact-role"
                    required
                    bind:value={contactRole}
                    class="w-full cursor-pointer appearance-none rounded-lg border border-border bg-background py-3 pl-4 pr-10 text-base text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="" disabled>{t('demo.form.role.placeholder')}</option>
                    <option value="director">{t('demo.form.role.director')}</option>
                    <option value="subdirector">{t('demo.form.role.subdirector')}</option>
                    <option value="inspector">{t('demo.form.role.inspector')}</option>
                    <option value="utp">{t('demo.form.role.utp')}</option>
                    <option value="sostenedor">{t('demo.form.role.sostenedor')}</option>
                    <option value="other">{t('demo.form.role.other')}</option>
                  </select>
                  <ChevronDown class="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              <div class="space-y-1.5">
                <label for="contact-email" class="block text-sm font-medium text-foreground">
                  {t('demo.form.email')} <span class="text-destructive">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  bind:value={contactEmail}
                  placeholder={t('demo.form.email.placeholder')}
                  autocomplete="email"
                  enterkeyhint="next"
                  class="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div class="space-y-1.5">
                <label for="contact-phone" class="block text-sm font-medium text-foreground">
                  WhatsApp
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  inputmode="tel"
                  bind:value={contactPhone}
                  placeholder="+56 9 1234 5678"
                  autocomplete="tel"
                  enterkeyhint="next"
                  class="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div class="space-y-1.5">
                <label for="contact-source" class="block text-sm font-medium text-foreground">
                  {t('demo.form.source')}
                </label>
                <div class="relative">
                  <select
                    id="contact-source"
                    bind:value={contactSource}
                    class="w-full cursor-pointer appearance-none rounded-lg border border-border bg-background py-3 pl-4 pr-10 text-base text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">{t('demo.form.source.placeholder')}</option>
                    <option value="google">{t('demo.form.source.google')}</option>
                    <option value="referido">{t('demo.form.source.referral')}</option>
                    <option value="redes-sociales">{t('demo.form.source.social')}</option>
                    <option value="evento">{t('demo.form.source.event')}</option>
                    <option value="mineduc">{t('demo.form.source.mineduc')}</option>
                    <option value="otro">{t('demo.form.source.other')}</option>
                  </select>
                  <ChevronDown class="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              <Button
                type="submit"
                size="xl"
                class="w-full"
                disabled={submitting || !contactName.trim() || !contactRole || !contactEmail.trim() || (isManual && !manualSchoolName.trim())}
              >
                {#if submitting}
                  <Loader2 class="size-4 animate-spin" />
                {:else}
                  {t('demo.form.submit')}
                  <ChevronRight class="size-4" />
                {/if}
              </Button>
              {#if errorMessage}
                <p class="mt-2 rounded-lg bg-destructive/10 px-4 py-2.5 text-center text-sm text-destructive" role="alert">{errorMessage}</p>
              {/if}
              <p class="mt-2 text-center text-[10px] text-muted-foreground">
                Protegido por reCAPTCHA de Google.
              </p>
            </form>
          </div>
        </div>
      </div>
    {/if}
  </div>

  <footer class="border-t border-border bg-background py-4 text-center text-[11px] text-muted-foreground">
    &copy; {new Date().getFullYear()} Ethoz
  </footer>
</main>
