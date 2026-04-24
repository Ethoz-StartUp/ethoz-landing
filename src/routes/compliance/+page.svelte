<script lang="ts">
  import Footer from '$lib/components/Footer.svelte';
  import NavBar from '$lib/components/NavBar.svelte';
  import { Button } from '$lib/components/ui/button';
  import { t } from '$lib/i18n/index.svelte';
  import {
    ShieldCheck,
    Lock,
    FileText,
    Database,
    Users,
    MapPin,
    ArrowRight,
    CheckCircle,
    Clock,
    ExternalLink,
    Scale,
  } from '@lucide/svelte';
  import { trackEvent } from '$lib/utils/analytics';

  $effect(() => { trackEvent('compliance_page_viewed'); });

  // ── Compliance pillars ──
  const pillars = [
    {
      icon: Users,
      titleKey: 'compliance_page.pillar1.title' as const,
      descKey: 'compliance_page.pillar1.desc' as const,
      articleKey: 'compliance_page.pillar1.article' as const,
    },
    {
      icon: FileText,
      titleKey: 'compliance_page.pillar2.title' as const,
      descKey: 'compliance_page.pillar2.desc' as const,
      articleKey: 'compliance_page.pillar2.article' as const,
    },
    {
      icon: Lock,
      titleKey: 'compliance_page.pillar3.title' as const,
      descKey: 'compliance_page.pillar3.desc' as const,
      articleKey: 'compliance_page.pillar3.article' as const,
    },
    {
      icon: ShieldCheck,
      titleKey: 'compliance_page.pillar4.title' as const,
      descKey: 'compliance_page.pillar4.desc' as const,
      articleKey: 'compliance_page.pillar4.article' as const,
    },
    {
      icon: Database,
      titleKey: 'compliance_page.pillar5.title' as const,
      descKey: 'compliance_page.pillar5.desc' as const,
      articleKey: 'compliance_page.pillar5.article' as const,
    },
    {
      icon: MapPin,
      titleKey: 'compliance_page.pillar6.title' as const,
      descKey: 'compliance_page.pillar6.desc' as const,
      articleKey: 'compliance_page.pillar6.article' as const,
    },
  ] as const;

  // ── Architecture stack items ──
  const stackItems = [
    { labelKey: 'compliance_page.arch.item1.label' as const, descKey: 'compliance_page.arch.item1.desc' as const },
    { labelKey: 'compliance_page.arch.item2.label' as const, descKey: 'compliance_page.arch.item2.desc' as const },
    { labelKey: 'compliance_page.arch.item3.label' as const, descKey: 'compliance_page.arch.item3.desc' as const },
    { labelKey: 'compliance_page.arch.item4.label' as const, descKey: 'compliance_page.arch.item4.desc' as const },
  ] as const;

  // ── Timeline events ──
  // Dec 2024 = published, Dec 2026 = enforcement
  // "Now" is April 2026 — between the two
  const now = new Date();
  const published = new Date('2024-12-01');
  const enforcement = new Date('2026-12-01');
  const totalMs = enforcement.getTime() - published.getTime();
  const elapsedMs = now.getTime() - published.getTime();
  const progressPct = Math.min(100, Math.max(0, Math.round((elapsedMs / totalMs) * 100)));
</script>

<svelte:head>
  <title>{t('compliance_page.meta.title')}</title>
  <meta name="description" content={t('compliance_page.meta.desc')} />
  <meta property="og:url" content="https://ethoz.cl/compliance" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={t('compliance_page.meta.title')} />
  <meta property="og:description" content={t('compliance_page.meta.desc')} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={t('compliance_page.meta.title')} />
  <meta name="twitter:description" content={t('compliance_page.meta.desc')} />
  <link rel="canonical" href="https://ethoz.cl/compliance" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Cumplimiento Normativo"}]})}</script>`}
</svelte:head>

<main class="flex min-h-dvh flex-col bg-background">

  <NavBar />

  <!-- ══════════════════════════════════════
       HERO — editorial, institutional
       ══════════════════════════════════════ -->
  <section class="pt-24 pb-12 sm:pt-28 sm:pb-16">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <p class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        <span class="text-primary">{t('compliance_page.hero.badge')}</span>
        <span aria-hidden="true" class="text-border">·</span>
        <span>Ley 21.719 · Dic 2026</span>
      </p>
      <span class="mt-6 block h-px w-12 bg-foreground" aria-hidden="true"></span>
      <h1 class="mt-6 font-heading text-[2rem] font-medium italic leading-[1.15] tracking-tight text-foreground sm:text-[2.5rem] lg:text-[3rem]">
        {t('compliance_page.hero.title')}
      </h1>
      <p class="mt-8 max-w-[68ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
        {t('compliance_page.hero.subtitle')}
      </p>
      <p class="mt-5 max-w-[68ch] text-base leading-relaxed text-muted-foreground">
        {t('compliance_page.hero.body')}
      </p>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       OFFICIAL LAW REFERENCE
       ══════════════════════════════════════ -->
  <section class="py-8 sm:py-10 bg-background">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <a
        href="https://www.bcn.cl/leychile/navegar?idNorma=1209272"
        target="_blank"
        rel="noopener noreferrer"
        class="group flex items-start gap-4 rounded-lg border border-border bg-card p-5 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-[0_2px_0_0_rgba(5,28,44,0.10)]"
      >
        <Scale class="size-5 shrink-0 text-primary" />
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <p class="text-sm font-semibold text-foreground">{t('compliance_page.law_ref.title')}</p>
            <ExternalLink class="size-3.5 text-muted-foreground transition-colors group-hover:text-primary" />
          </div>
          <p class="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {t('compliance_page.law_ref.desc')}
          </p>
          <p class="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
            {t('compliance_page.law_ref.source')}
          </p>
        </div>
      </a>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       COMPLIANCE TIMELINE
       ══════════════════════════════════════ -->
  <section class="py-12 sm:py-14 bg-background">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div class="mb-12 text-center">
        <p class="text-sm font-bold uppercase tracking-widest text-primary">
          {t('compliance_page.timeline.overline')}
        </p>
        <h2 class="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t('compliance_page.timeline.title')}
        </h2>
        <p class="mt-4 text-base text-muted-foreground">
          {t('compliance_page.timeline.subtitle')}
        </p>
      </div>

      <!-- Timeline bar -->
      <div class="relative mx-auto max-w-2xl">
        <!-- Track -->
        <div class="relative h-2 rounded-full bg-border">
          <!-- Filled progress -->
          <div
            class="h-2 rounded-full bg-primary transition-all duration-700"
            style="width: {progressPct}%"
          ></div>
          <!-- "Now" marker -->
          <div
            class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
            style="left: {progressPct}%"
          >
            <div class="relative flex flex-col items-center">
              <div class="size-4 rounded-full border-2 border-primary bg-background shadow-md ring-4 ring-primary/20"></div>
              <div class="mt-2 whitespace-nowrap rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground shadow">
                {t('compliance_page.timeline.now')}
              </div>
            </div>
          </div>
        </div>

        <!-- Endpoints -->
        <div class="mt-8 flex justify-between">
          <!-- Published -->
          <div class="flex flex-col items-start gap-1">
            <div class="flex items-center gap-1.5">
              <CheckCircle class="size-4 text-primary" />
              <span class="text-sm font-semibold text-foreground">{t('compliance_page.timeline.event1.date')}</span>
            </div>
            <p class="text-sm font-medium text-foreground">{t('compliance_page.timeline.event1.label')}</p>
            <p class="text-xs text-muted-foreground">{t('compliance_page.timeline.event1.desc')}</p>
          </div>
          <!-- Enforcement -->
          <div class="flex flex-col items-end gap-1">
            <div class="flex items-center gap-1.5">
              <Clock class="size-4 text-muted-foreground" />
              <span class="text-sm font-semibold text-foreground">{t('compliance_page.timeline.event2.date')}</span>
            </div>
            <p class="text-sm font-medium text-foreground">{t('compliance_page.timeline.event2.label')}</p>
            <p class="text-xs text-muted-foreground">{t('compliance_page.timeline.event2.desc')}</p>
          </div>
        </div>
      </div>

      <!-- Context note -->
      <div class="mt-10 rounded-xl border border-border bg-card p-5 text-center shadow-sm">
        <p class="text-sm leading-relaxed text-muted-foreground">
          {t('compliance_page.timeline.note')}
        </p>
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       VISUAL: RBAC + PICKUPS
       ══════════════════════════════════════ -->
  <section class="py-12 sm:py-14 bg-secondary">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- RBAC -->
      <div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p class="text-sm font-bold uppercase tracking-widest text-primary">Control de acceso</p>
          <h2 class="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Cada rol ve solo lo que necesita
          </h2>
          <p class="mt-4 text-base leading-relaxed text-muted-foreground">
            El director ve indicadores agregados. El docente ve solo sus cursos. El portero ve foto y alertas de retiro. Nadie accede a información que no necesita para su función — y eso es exactamente lo que exige la Ley 21.719.
          </p>
        </div>
        <div class="flex justify-center">
          <img src="/images/pages/compliance-rbac.webp" alt="Control de acceso basado en roles" class="w-full max-w-xs rounded-2xl mix-blend-multiply" loading="lazy" />
        </div>
      </div>

      <!-- Pickups -->
      <div class="mt-20 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div class="order-2 flex justify-center lg:order-1">
          <img src="/images/pages/compliance-pickups.webp" alt="Retiros escolares seguros con verificación digital" class="w-full max-w-xs rounded-2xl mix-blend-multiply" loading="lazy" />
        </div>
        <div class="order-1 lg:order-2">
          <p class="text-sm font-bold uppercase tracking-widest text-primary">Retiros seguros</p>
          <h2 class="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Verificación digital en portería
          </h2>
          <p class="mt-4 text-base leading-relaxed text-muted-foreground">
            Cada retiro se valida contra la lista de personas autorizadas. Órdenes de alejamiento, custodia compartida y restricciones judiciales llegan al portero en tiempo real — no al día siguiente.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       6 COMPLIANCE PILLARS
       ══════════════════════════════════════ -->
  <section class="py-12 sm:py-14 bg-background">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-12 text-center">
        <p class="text-sm font-bold uppercase tracking-widest text-primary">
          {t('compliance_page.pillars.overline')}
        </p>
        <h2 class="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t('compliance_page.pillars.title')}
        </h2>
        <p class="mt-4 max-w-2xl mx-auto text-base text-muted-foreground">
          {t('compliance_page.pillars.subtitle')}
        </p>
      </div>

      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {#each pillars as pillar, i}
          {@const Icon = pillar.icon}
          <div class="group flex flex-col rounded-lg border border-border bg-card p-6 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-[0_2px_0_0_rgba(5,28,44,0.10)]">
            <span class="font-heading text-2xl font-medium leading-none tracking-tight text-primary/70 tabular-nums" data-numeric>0{i + 1}</span>
            <div class="mt-4 flex items-center gap-2.5">
              <Icon class="size-4 shrink-0 text-primary" />
              <h3 class="text-base font-semibold text-foreground leading-snug">{t(pillar.titleKey)}</h3>
            </div>
            <p class="mt-3 text-sm leading-relaxed text-muted-foreground">{t(pillar.descKey)}</p>
            <p class="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">{t(pillar.articleKey)} · Ley 21.719</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       VISUAL: AUDIT TRAIL
       ══════════════════════════════════════ -->
  <section class="py-12 sm:py-14 bg-secondary">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p class="text-sm font-bold uppercase tracking-widest text-primary">Trazabilidad completa</p>
          <h2 class="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Cada acción queda registrada
          </h2>
          <p class="mt-4 text-base leading-relaxed text-muted-foreground">
            Quién accedió a qué dato, cuándo y con qué finalidad. Si la Agencia de Protección de Datos solicita evidencia, su establecimiento puede entregar el registro completo en minutos — no en semanas de búsqueda en cuadernos.
          </p>
        </div>
        <div class="flex justify-center">
          <img src="/images/pages/compliance-audit.webp" alt="Registro de auditoría completo y trazable" class="w-full max-w-xs rounded-2xl mix-blend-multiply" loading="lazy" />
        </div>
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       ARCHITECTURE OVERVIEW
       ══════════════════════════════════════ -->
  <section class="py-12 sm:py-14 bg-background">
    <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div class="mb-12 text-center">
        <p class="text-sm font-bold uppercase tracking-widest text-primary">
          {t('compliance_page.arch.overline')}
        </p>
        <h2 class="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t('compliance_page.arch.title')}
        </h2>
        <p class="mt-4 max-w-2xl mx-auto text-base text-muted-foreground">
          {t('compliance_page.arch.subtitle')}
        </p>
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        {#each stackItems as item}
          <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
            <p class="text-sm font-bold text-foreground">{t(item.labelKey)}</p>
            <p class="mt-2 text-sm leading-relaxed text-muted-foreground">{t(item.descKey)}</p>
          </div>
        {/each}
      </div>

      <!-- Disclaimer note for legal audience -->
      <div class="mt-8 rounded-xl border border-border bg-secondary p-5">
        <p class="text-xs leading-relaxed text-muted-foreground">
          {t('compliance_page.arch.disclaimer')}
        </p>
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       CERTIFICATIONS / STANDARDS
       ══════════════════════════════════════ -->
  <section class="py-12 sm:py-14 bg-secondary">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div class="mb-10 text-center">
        <p class="text-sm font-bold uppercase tracking-widest text-primary">
          {t('compliance_page.certs.overline')}
        </p>
        <h2 class="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t('compliance_page.certs.title')}
        </h2>
        <p class="mt-4 text-base text-muted-foreground">
          {t('compliance_page.certs.subtitle')}
        </p>
      </div>

      <div class="grid gap-5 sm:grid-cols-3">
        <!-- Ley 21.719 -->
        <div class="rounded-lg border border-border bg-card p-5">
          <div class="flex items-center gap-2.5">
            <ShieldCheck class="size-4 shrink-0 text-primary" />
            <p class="text-sm font-semibold text-foreground">{t('compliance_page.certs.cert1.name')}</p>
          </div>
          <p class="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">{t('compliance_page.certs.cert1.status')}</p>
        </div>
        <!-- ISO 27001 placeholder -->
        <div class="rounded-lg border border-dashed border-border bg-card p-5">
          <div class="flex items-center gap-2.5">
            <Lock class="size-4 shrink-0 text-muted-foreground" />
            <p class="text-sm font-semibold text-foreground">{t('compliance_page.certs.cert2.name')}</p>
          </div>
          <p class="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t('compliance_page.certs.cert2.status')}</p>
        </div>
        <!-- SOC 2 placeholder -->
        <div class="rounded-lg border border-dashed border-border bg-card p-5">
          <div class="flex items-center gap-2.5">
            <FileText class="size-4 shrink-0 text-muted-foreground" />
            <p class="text-sm font-semibold text-foreground">{t('compliance_page.certs.cert3.name')}</p>
          </div>
          <p class="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t('compliance_page.certs.cert3.status')}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       FINAL CTA — dark navy editorial closing
       ══════════════════════════════════════ -->
  <section class="bg-foreground py-20 text-background sm:py-24" aria-labelledby="final-cta-compliance">
    <div class="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
      <span class="mx-auto block h-px w-12 bg-background/60" aria-hidden="true"></span>
      <p class="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-background/70">Evaluación institucional</p>
      <h2 id="final-cta-compliance" class="mt-5 font-heading text-3xl font-medium leading-[1.15] tracking-tight text-background sm:text-4xl">
        {t('compliance_page.cta.title')}
      </h2>
      <p class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-background/80">
        {t('compliance_page.cta.subtitle')}
      </p>
      <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href="/demo"
          class="inline-flex h-14 items-center justify-center gap-2 rounded-md bg-background px-10 text-base font-semibold text-foreground transition-colors hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
        >
          {t('compliance_page.cta.primary')}
          <ArrowRight class="size-5" />
        </a>
        <a
          href="/"
          class="inline-flex items-center gap-1 border-b border-background/60 pb-0.5 text-sm font-medium text-background/80 transition-colors hover:border-background hover:text-background"
        >
          {t('compliance_page.cta.secondary')}
        </a>
      </div>
    </div>
  </section>

  <Footer />
</main>
