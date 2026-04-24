<script lang="ts">
  import Footer from '$lib/components/Footer.svelte';
  import NavBar from '$lib/components/NavBar.svelte';
  import { Button } from '$lib/components/ui/button';
  import { t } from '$lib/i18n/index.svelte';
  import { Mail, CalendarDays, Loader2, Check, Clock, ExternalLink } from '@lucide/svelte';
  import { CONTACT } from '$lib/config';
  import { saveLead } from '$lib/supabase';
  import { trackEvent } from '$lib/utils/analytics';
  import { executeRecaptcha, getRecaptchaScriptUrl } from '$lib/utils/recaptcha';
  import { browser } from '$app/environment';

  // ── State ──
  let name = $state('');
  let email = $state('');
  let message = $state('');
  let submitting = $state(false);
  let submitted = $state(false);
  let errorMessage = $state('');
  let recaptchaFailed = $state(false);

  function captureError(err: unknown, context?: Record<string, unknown>) {
    if (!browser) return;
    import('@sentry/browser')
      .then((Sentry) => Sentry.captureException(err, { extra: context }))
      .catch(() => {});
  }

  const mailtoFallback = `mailto:${CONTACT.email.address}?subject=${encodeURIComponent('Contacto desde ethoz.cl')}`;

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

  // ── Handlers ──
  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (submitting) return; // double-submit guard
    submitting = true;
    errorMessage = '';
    recaptchaFailed = false;

    let recaptchaToken: string | null = null;
    try {
      recaptchaToken = await executeRecaptcha('submit_contact');
    } catch (err) {
      captureError(err, { fn: 'contact.executeRecaptcha' });
      recaptchaFailed = true;
      errorMessage = 'No pudimos verificar que seas humano. Escríbenos directamente al correo indicado arriba.';
      submitting = false;
      return;
    }

    // Save to Supabase as a lead (with server-side reCAPTCHA verification)
    const result = await saveLead({
      school_name: '',
      contact_name: name,
      contact_role: 'contact_form',
      contact_email: email,
      contact_source: 'contact_page',
      notes: message,
      status: 'new',
    }, recaptchaToken);

    if (!result.ok) {
      console.error('[Contact] Lead save failed:', result.error);
      errorMessage = 'No pudimos enviar tu mensaje. Por favor intenta de nuevo.';
      submitting = false;
      return;
    }

    trackEvent('contact_form_submitted', { source: 'contact_page' });

    submitting = false;
    submitted = true;
    name = '';
    email = '';
    message = '';
  }
</script>

<svelte:head>
  <title>{t('contact.meta.title')}</title>
  <meta property="og:url" content="https://ethoz.cl/contact" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Contacto — Ethoz" />
  <meta property="og:description" content="Contáctanos para saber más sobre Ethoz, la plataforma de seguridad escolar para Chile." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Contacto — Ethoz" />
  <meta name="twitter:description" content="Contáctanos para saber más sobre Ethoz, la plataforma de seguridad escolar para Chile." />
  <meta name="description" content="Contacta al equipo de Ethoz. Escríbenos por email o agenda una demo para tu colegio." />
  <link rel="canonical" href="https://ethoz.cl/contact" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Contacto"}]})}</script>`}
</svelte:head>

<main class="flex min-h-dvh flex-col bg-background">
  <!-- Skip link — WCAG 2.4.1 Bypass Blocks -->
  <a
    href="#contact-main"
    class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:border focus:border-foreground focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-foreground"
  >
    {t('nav.skip_to_content')}
  </a>
  <NavBar />

  <!-- Content -->
  <div id="contact-main" class="mx-auto flex-1 w-full max-w-7xl px-4 pt-24 pb-10 sm:pt-28 sm:pb-12 sm:px-6 lg:px-8">

    <!-- HEADING — editorial -->
    <div class="mb-12">
      <p class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        <span class="text-primary">Contacto institucional</span>
        <span aria-hidden="true" class="text-border">·</span>
        <span>Horario de respuesta · L-V 9:00-18:00 CLT</span>
      </p>
      <span class="mt-6 block h-px w-12 bg-foreground" aria-hidden="true"></span>
      <h1 class="mt-6 font-heading text-[2rem] font-medium italic leading-[1.15] tracking-tight text-foreground sm:text-[2.5rem]">
        {t('contact.heading')}
      </h1>
      <p class="mt-6 max-w-[68ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
        {t('contact.subheading')}
      </p>
    </div>

    <!-- Contact methods — editorial grid -->
    <div class="mb-12">
      <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-4">Canales directos</p>
      <div class="grid gap-4 sm:grid-cols-2">
        <a
          href={CONTACT.email.link}
          class="group flex flex-col gap-3 rounded-lg border border-border bg-card p-5 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-[0_2px_0_0_rgba(5,28,44,0.10)]"
        >
          <div class="flex items-center gap-2.5">
            <Mail class="size-4 shrink-0 text-primary" />
            <p class="text-sm font-semibold text-foreground">{t('contact.email.label')}</p>
          </div>
          <p class="text-sm text-muted-foreground">{CONTACT.email.address}</p>
          <span class="mt-auto inline-flex items-center gap-1 border-b border-primary self-start pb-0.5 text-xs font-semibold text-primary group-hover:border-b-2">
            Escribir correo
          </span>
        </a>

        <a
          href="/demo"
          class="group flex flex-col gap-3 rounded-lg border border-border bg-card p-5 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-[0_2px_0_0_rgba(5,28,44,0.10)]"
        >
          <div class="flex items-center gap-2.5">
            <CalendarDays class="size-4 shrink-0 text-primary" />
            <p class="text-sm font-semibold text-foreground">{t('contact.demo.label')}</p>
          </div>
          <p class="text-sm text-muted-foreground">Sesión de 30 minutos con un especialista</p>
          <span class="mt-auto inline-flex items-center gap-1 border-b border-primary self-start pb-0.5 text-xs font-semibold text-primary group-hover:border-b-2">
            Agendar demo
          </span>
        </a>

        <a
          href="https://www.linkedin.com/company/ethozcl/"
          target="_blank"
          rel="noopener noreferrer"
          class="group flex flex-col gap-3 rounded-lg border border-border bg-card p-5 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-[0_2px_0_0_rgba(5,28,44,0.10)]"
        >
          <div class="flex items-center gap-2.5">
            <ExternalLink class="size-4 shrink-0 text-primary" />
            <p class="text-sm font-semibold text-foreground">LinkedIn</p>
          </div>
          <p class="text-sm text-muted-foreground">Seguimiento institucional, novedades normativas</p>
          <span class="mt-auto inline-flex items-center gap-1 border-b border-primary self-start pb-0.5 text-xs font-semibold text-primary group-hover:border-b-2">
            Seguir en LinkedIn
          </span>
        </a>

        <div class="flex flex-col gap-3 rounded-lg border border-border bg-card p-5">
          <div class="flex items-center gap-2.5">
            <Clock class="size-4 shrink-0 text-primary" />
            <p class="text-sm font-semibold text-foreground">Horario de atención</p>
          </div>
          <dl class="space-y-1.5 text-sm text-muted-foreground">
            <div class="flex items-baseline justify-between gap-2"><dt>Lunes a viernes</dt><dd class="font-medium text-foreground">9:00 – 18:00</dd></div>
            <div class="flex items-baseline justify-between gap-2"><dt>Sábado</dt><dd>10:00 – 13:00</dd></div>
            <div class="flex items-baseline justify-between gap-2"><dt>Zona horaria</dt><dd class="font-medium text-foreground">CLT · Santiago</dd></div>
          </dl>
        </div>
      </div>
    </div>

    <!-- Contact form -->
    <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-4">Formulario</p>
    <div class="rounded-lg border border-border bg-card p-6 sm:p-8">
      {#if submitted}
        <div class="flex flex-col items-center gap-3 py-8 text-center" role="status" aria-live="polite">
          <div class="flex size-12 items-center justify-center rounded-full bg-success/10" aria-hidden="true">
            <Check class="size-6 text-success" />
          </div>
          <h2 class="font-heading text-xl font-medium text-foreground">{t('contact.form.success.title')}</h2>
          <p class="text-sm text-muted-foreground">{t('contact.form.success.message')}</p>
        </div>
      {:else}
      <h2 class="mb-6 font-heading text-xl font-medium text-foreground">
        {t('contact.form.title')}
      </h2>

      <form onsubmit={handleSubmit} class="space-y-4" aria-busy={submitting}>
        <!-- Name -->
        <div class="space-y-1.5">
          <label for="contact-name" class="block text-sm font-medium text-foreground">
            {t('contact.form.name')} <span class="text-destructive">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            required
            bind:value={name}
            placeholder={t('contact.form.name.placeholder')}
            autocomplete="name"
            class="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <!-- Email -->
        <div class="space-y-1.5">
          <label for="contact-email" class="block text-sm font-medium text-foreground">
            {t('contact.form.email')} <span class="text-destructive">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            required
            bind:value={email}
            placeholder={t('contact.form.email.placeholder')}
            autocomplete="email"
            class="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <!-- Message -->
        <div class="space-y-1.5">
          <label for="contact-message" class="block text-sm font-medium text-foreground">
            {t('contact.form.message')} <span class="text-destructive">*</span>
          </label>
          <textarea
            id="contact-message"
            required
            bind:value={message}
            placeholder={t('contact.form.message.placeholder')}
            rows={4}
            class="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          ></textarea>
        </div>

        <Button
          type="submit"
          size="xl"
          class="w-full"
          disabled={submitting || !name.trim() || !email.trim() || !message.trim()}
        >
          {#if submitting}
            <Loader2 class="size-4 animate-spin" />
            {t('contact.form.submitting')}
          {:else}
            {t('contact.form.submit')}
          {/if}
        </Button>
        {#if errorMessage}
          <div class="mt-2 rounded-lg bg-destructive/10 px-4 py-2.5 text-center text-sm text-destructive" role="alert">
            <p>{errorMessage}</p>
            {#if recaptchaFailed}
              <a
                href={mailtoFallback}
                class="mt-1 inline-block font-medium underline underline-offset-2 hover:text-destructive/80"
              >
                Escribir por correo <span aria-hidden="true">→</span>
              </a>
            {/if}
          </div>
        {/if}

      </form>
      {/if}
    </div>

    <!-- CTA -->
    <div class="mt-8 rounded-xl border border-dashed border-border bg-background/50 px-6 py-5 text-center">
      <p class="text-sm text-muted-foreground">{t('contact.cta.label')}</p>
      <a
        href="/demo"
        class="mt-2 inline-block text-sm font-medium text-primary transition-colors hover:text-primary"
      >
        {t('contact.cta.link')}
      </a>
    </div>
  </div>

  <Footer />
</main>
