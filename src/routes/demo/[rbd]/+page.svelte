<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { browser } from '$app/environment';
  import { BRAND } from '$lib/brand';
  import NavBar from '$lib/components/NavBar.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { t } from '$lib/i18n/index.svelte';
  import { captureException } from '$lib/sentry';
  import { schoolStore } from '$lib/stores/schools.svelte';
  import { trackEvent } from '$lib/utils/analytics';
  import { saveLead } from '$lib/marketing';
  import { executeRecaptcha, getRecaptchaScriptUrl } from '$lib/utils/recaptcha';
  import { tick, untrack } from 'svelte';
  import StepIndicator from '../StepIndicator.svelte';
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
  let errorElement = $state<HTMLParagraphElement | null>(null);

  let mapContainer = $state<HTMLDivElement | null>(null);
  let mapInstance: any = null;
  let mapFailed = $state(false);

  const selectedSchoolIsReady = $derived(
    isManual || schoolStore.selectedSchool?.rbd === rbd
  );

  function captureError(err: unknown, context?: Record<string, unknown>) {
    if (!browser) return;
    captureException(err, context);
  }

  // ── Load school by RBD (skip if manual) ──
  $effect(() => {
    if (!isManual && (!Number.isInteger(rbd) || rbd <= 0)) {
      goto('/demo', { replaceState: true });
    }
  });

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
        if (!manualSchoolName) manualSchoolName = data.schoolName ?? '';
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
      source: contactSource,
      schoolName: manualSchoolName
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
          // lint-ok: Leaflet div-icon API requires hex literal in raw HTML string; keep in sync with the 8020 sky accent (#0495FE)
          html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32" width="28" height="36" aria-hidden="true"><path d="M12 0C5.4 0 0 5.4 0 12c0 8.4 12 20 12 20s12-11.6 12-20C24 5.4 18.6 0 12 0z" fill="#0495FE"/><circle cx="12" cy="12" r="4.5" fill="#FFFFFF"/></svg>',
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
      1: t('demo.dep_type.municipal'),
      2: t('demo.dep_type.subsidized'),
      3: t('demo.dep_type.paid'),
      4: t('demo.dep_type.delegated')
    };
    return labels[depType] ?? '';
  }

  function persistForm(): void {
    if (!browser) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
      name: contactName,
      role: contactRole,
      email: contactEmail,
      phone: contactPhone,
      source: contactSource,
      schoolName: manualSchoolName
    }));
  }

  function handleChangeSchool(): void {
    persistForm();
    schoolStore.clearSelection();
  }

  async function showFormError(message: string): Promise<void> {
    errorMessage = message;
    await tick();
    errorElement?.focus();
  }

  // ── Submit ──
  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (submitting) return; // double-submit guard
    submitting = true;
    errorMessage = '';

    try {
      let recaptchaToken: string | null = null;
      try {
        recaptchaToken = await executeRecaptcha('submit_demo');
      } catch (err) {
        captureError(err, { fn: 'demo.executeRecaptcha' });
        await showFormError(t('demo.error.recaptcha_failed'));
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
        notes: isManual ? t('demo.manual.lead_note') : undefined,
        status: 'new',
      }, recaptchaToken);

      if (!result.ok) {
        console.error('[Demo] Lead save failed:', result.error);
        captureError(new Error(result.error ?? 'Lead save failed'), { fn: 'demo.saveLead' });
        await showFormError(t('demo.error.save_failed'));
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
  <title>{t('meta.demo_rbd_title')}</title>
  <meta name="description" content={t('meta.demo_rbd_description')} />
  <meta name="robots" content="noindex, nofollow" />
  <meta property="og:url" content="https://ethoz.cl/demo" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={t('meta.demo_rbd_title')} />
  <meta property="og:description" content={t('meta.demo_rbd_description')} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={t('meta.demo_rbd_title')} />
  <meta name="twitter:description" content={t('meta.demo_rbd_description')} />
  <link rel="canonical" href="https://ethoz.cl/demo" />
</svelte:head>

<div class="flex min-h-dvh flex-col bg-secondary pt-28 sm:pt-32">
  <!-- Skip link — WCAG 2.4.1 Bypass Blocks -->
  <a
    href="#demo-form-main"
    class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:border focus:border-foreground focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-foreground"
  >
    {t('nav.skip_to_content')}
  </a>
  <NavBar />

  <main id="main-content" class="flex flex-1 flex-col">

  <StepIndicator currentStep={2} onBeforeBack={handleChangeSchool} />

  <!-- Content -->
  <div id="demo-form-main" class="mx-auto flex-1 max-w-7xl px-4 py-12 sm:py-16">
    {#if !isManual && schoolStore.loadError}
      <div class="mx-auto max-w-xl rounded-xl border border-border bg-background px-5 py-8 text-center" role="alert">
        <Building aria-hidden="true" class="mx-auto mb-3 size-7 text-muted-foreground" />
        <p class="text-sm font-semibold text-foreground">{t('prospecting.schools_load_error')}</p>
        <a
          href="/demo/0?manual=1"
          class="mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          {t('demo.manual')}
          <ChevronRight aria-hidden="true" class="size-4" />
        </a>
      </div>
    {:else if !selectedSchoolIsReady}
      <div class="flex flex-col items-center gap-3 py-16" role="status" aria-live="polite">
        <Loader2 class="size-8 animate-spin text-primary" aria-hidden="true" />
        <p class="text-sm text-muted-foreground">{t('demo.search.loading')}</p>
      </div>
    {:else}
      {@const school = isManual ? null : schoolStore.selectedSchool}
      <div class="space-y-8">
        <div class="text-center">
          <p class="mb-3 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">{t('demo.step2.eyebrow')}</p>
          <h1 class="text-2xl text-foreground">
            {t('demo.step2.title')}
          </h1>
          <p class="mx-auto mt-3 max-w-md text-xs leading-relaxed text-muted-foreground">
            {t('demo.step2.description')}
          </p>
          <a
            href="/demo"
            onclick={handleChangeSchool}
            class="mt-3 inline-flex min-h-11 items-center gap-1 rounded-md px-2 text-sm text-primary-active transition-colors hover:bg-accent-tint hover:text-primary-active"
          >
            <ChevronLeft aria-hidden="true" class="size-4" />
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
                  <h2 class="text-base font-semibold text-foreground">{t('demo.manual.school_title')}</h2>
                </div>
                <div class="space-y-3">
                  <div class="space-y-1.5">
                    <label for="manual-school" class="block text-sm font-medium text-foreground">
                      {t('demo.manual.school_name_label')} <span aria-hidden="true" class="text-destructive">*</span>
                    </label>
                    <input
                      id="manual-school"
                      form="demo-contact-form"
                      type="text"
                      required
                      bind:value={manualSchoolName}
                      placeholder={t('demo.manual.school_name_placeholder')}
                      autocapitalize="words"
                      class="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <p class="mt-3 text-xs text-muted-foreground">
                  {t('demo.manual.fallback_note')}
                </p>
              </div>
            {:else}
            <!-- Selected school card -->
            <div class="rounded-xl border border-primary/20 bg-background shadow-sm">
              <!-- Card header -->
              <div class="border-b border-border px-5 py-4">
                <div class="flex items-start gap-3">
                  <GraduationCap class="mt-0.5 size-5 shrink-0 text-primary" />
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
                    <p class="text-mockup-xs font-medium uppercase tracking-wide text-muted-foreground">{t('demo.commune')}</p>
                    <p class="truncate text-sm text-foreground">{school?.commune}</p>
                  </div>
                </div>
                <div class="flex items-start gap-2.5 bg-background px-4 py-3">
                  <MapPin class="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  <div class="min-w-0">
                    <p class="text-mockup-xs font-medium uppercase tracking-wide text-muted-foreground">{t('demo.region')}</p>
                    <p class="truncate text-sm text-foreground">{regionName(school?.regionCode ?? 0)}</p>
                  </div>
                </div>
                <div class="flex items-start gap-2.5 bg-background px-4 py-3">
                  <Users class="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  <div class="min-w-0">
                    <p class="text-mockup-xs font-medium uppercase tracking-wide text-muted-foreground">{t('demo.enrollment.label')}</p>
                    <p class="text-sm text-foreground">{school?.enrollment.toLocaleString('es-CL')} {t('demo.enrollment')}</p>
                  </div>
                </div>
                <div class="flex items-start gap-2.5 bg-background px-4 py-3">
                  <Building class="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  <div class="min-w-0">
                    <p class="text-mockup-xs font-medium uppercase tracking-wide text-muted-foreground">{t('demo.dependencia')}</p>
                    <p class="text-sm text-foreground">{depTypeLabel(school?.depType ?? 0)}</p>
                  </div>
                </div>
                <div class="col-span-2 flex items-start gap-2.5 bg-background px-4 py-3">
                  <Building class="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  <div class="min-w-0">
                    <p class="text-mockup-xs font-medium uppercase tracking-wide text-muted-foreground">{t('demo.sostenedor')}</p>
                    <p class="truncate text-sm text-foreground">{school?.sostenedor}</p>
                  </div>
                </div>
              </div>

            </div>

            <!-- Map — desktop only -->
            {#if school?.lat !== 0}
              {#if mapFailed}
                <div class="hidden rounded-xl border border-border bg-background p-4 text-sm text-muted-foreground lg:block">
                  <p class="font-medium text-foreground">{t('demo.location')}</p>
                  <p class="mt-1">{school?.commune}{school ? `, ${regionName(school.regionCode)}` : ''}</p>
                  {#if school?.name}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(school.name + ' ' + (school.commune ?? ''))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="mt-2 inline-block text-primary underline-offset-2 hover:underline"
                    >
                      {t('demo.view_google_maps')} →
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
            <form id="demo-contact-form" onsubmit={handleSubmit} class="space-y-4" aria-busy={submitting}>
              <div class="space-y-1.5">
                <label for="contact-name" class="block text-sm font-medium text-foreground">
                  {t('demo.form.name')} <span aria-hidden="true" class="text-destructive">*</span>
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
                  {t('demo.form.role')} <span aria-hidden="true" class="text-destructive">*</span>
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
                    <option value="docente">{t('roles.teacher.title')}</option>
                    <option value="orientador">{t('roles.counselor.title')}</option>
                    <option value="porteria">{t('roles.porter.title')}</option>
                    <option value="apoderado">{t('home.roles.apoderado.title')}</option>
                    <option value="administrador">{t('roles.admin.title')}</option>
                    <option value="other">{t('demo.form.role.other')}</option>
                  </select>
                  <ChevronDown class="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              <div class="space-y-1.5">
                <label for="contact-email" class="block text-sm font-medium text-foreground">
                  {t('demo.form.email')} <span aria-hidden="true" class="text-destructive">*</span>
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
                  {t('demo.whatsapp_label')}
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  inputmode="tel"
                  bind:value={contactPhone}
                  placeholder={t('demo.form.phone.placeholder')}
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
                <p
                  bind:this={errorElement}
                  class="mt-2 rounded-lg bg-destructive/10 px-4 py-2.5 text-center text-sm text-error-text"
                  role="alert"
                  tabindex="-1"
                >
                  {errorMessage}
                </p>
              {/if}
              <p class="mt-2 text-center text-mockup-xs text-muted-foreground">
                {t('demo.privacy_notice')}
                <a href="/privacy" class="underline underline-offset-2 hover:text-foreground">{t('demo.privacy_link')}</a>
              </p>
              <p class="mt-2 text-center text-mockup-xs text-muted-foreground">
                {t('demo.recaptcha_notice')}
              </p>
            </form>
          </div>
        </div>
      </div>
    {/if}
  </div>

  </main>

  <footer class="border-t border-border bg-background py-4 text-center text-mockup-sm text-muted-foreground">
    &copy; {new Date().getFullYear()} {BRAND}
    <span aria-hidden="true" class="mx-1">·</span>
    <a href="/privacy" class="underline underline-offset-2 hover:text-foreground">{t('demo.privacy_link')}</a>
  </footer>
</div>
