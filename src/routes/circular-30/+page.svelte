<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { BRAND } from '$lib/brand';
  import { t } from '$lib/i18n/index.svelte';
  import { trackEvent } from '$lib/utils/analytics';
  import {
    ShieldCheck,
    CheckCircle,
    XCircle,
    ArrowRight,
    Lock,
    Database,
    FileText,
    Clock,
    AlertTriangle,
    Users,
    Eye,
    ExternalLink,
  } from '@lucide/svelte';

  $effect(() => {
    trackEvent('seo_page_viewed', { slug: 'circular-30' });
  });

  const requirements = [
    { req: 'circular30.req_1_name' as const, why: 'circular30.req_1_why' as const },
    { req: 'circular30.req_2_name' as const, why: 'circular30.req_2_why' as const },
    { req: 'circular30.req_3_name' as const, why: 'circular30.req_3_why' as const },
    { req: 'circular30.req_4_name' as const, why: 'circular30.req_4_why' as const },
    { req: 'circular30.req_5_name' as const, why: 'circular30.req_5_why' as const },
    { req: 'circular30.req_6_name' as const, why: 'circular30.req_6_why' as const },
  ];

  const nonCompliant = [
    { system: 'circular30.noncompliant_1_system' as const, reason: 'circular30.noncompliant_1_reason' as const },
    { system: 'circular30.noncompliant_2_system' as const, reason: 'circular30.noncompliant_2_reason' as const },
    { system: 'circular30.noncompliant_3_system' as const, reason: 'circular30.noncompliant_3_reason' as const },
    { system: 'circular30.noncompliant_4_system' as const, reason: 'circular30.noncompliant_4_reason' as const },
  ];

  const selfAssessment = [
    { question: 'circular30.self_q1' as const, critical: true },
    { question: 'circular30.self_q2' as const, critical: true },
    { question: 'circular30.self_q3' as const, critical: true },
    { question: 'circular30.self_q4' as const, critical: false },
    { question: 'circular30.self_q5' as const, critical: false },
    { question: 'circular30.self_q6' as const, critical: true },
    { question: 'circular30.self_q7' as const, critical: false },
  ];
</script>

<svelte:head>
  <title>{t('circular30.meta_title')}</title>
  <meta name="description" content={t('circular30.meta_description')} />
  <meta property="og:title" content={t('circular30.og_title')} />
  <meta property="og:description" content={t('circular30.og_description')} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://ethoz.cl/circular-30" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="canonical" href="https://ethoz.cl/circular-30" />
  {@html `<script type="application/ld+json">${JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Circular N°30: libro de clases digital obligatorio en Chile",
      "description": "Circular N°30 libro de clases digital: qué exige, qué sistemas cumplen, autodiagnóstico para colegios chilenos.",
      "datePublished": "2026-04-07",
      "dateModified": "2026-04-07",
      "author": { "@type": "Organization", "name": BRAND },
      "publisher": { "@type": "Organization", "name": BRAND, "logo": { "@type": "ImageObject", "url": "https://ethoz.cl/favicon.svg" }},
      "url": "https://ethoz.cl/circular-30",
      "mainEntityOfPage": "https://ethoz.cl/circular-30",
      "keywords": "circular 30, libro de clases digital chile, libro digital colegio, superintendencia educacion"
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://ethoz.cl/" },
        { "@type": "ListItem", "position": 2, "name": "Circular N°30", "item": "https://ethoz.cl/circular-30" }
      ]
    }
  ])}</script>`}
</svelte:head>

<div class="min-h-screen bg-background">
  <!-- Skip link — WCAG 2.4.1 Bypass Blocks -->
  <a
    href="#main-content"
    class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:border focus:border-foreground focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-foreground"
  >
    {t('nav.skip_to_content')}
  </a>
  <NavBar />

  <main id="main-content">

  <!-- HERO -->
  <section class="pt-24 pb-12 sm:pt-28 sm:pb-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <p class="page-eyebrow">
        <span class="text-primary">{t('circular30.hero_eyebrow_doc')}</span>
        <span aria-hidden="true" class="hidden text-border sm:inline">·</span>
        <span>{t('circular30.hero_eyebrow_authority')}</span>
        <span aria-hidden="true" class="hidden text-border sm:inline">·</span>
        <span>{t('circular30.hero_eyebrow_readtime')}</span>
      </p>

      <span class="page-title-rule" aria-hidden="true"></span>

      <h1 class="page-title">
        {t('circular30.hero_title')}
      </h1>

      <p class="mt-8 max-w-[68ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
        {t('circular30.hero_lede')}
      </p>

      <dl class="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-6 sm:grid-cols-3">
        <div>
          <dt class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">{t('circular30.hero_meta_authority_label')}</dt>
          <dd class="mt-1 text-sm font-medium text-foreground">{t('circular30.hero_meta_authority_value')}</dd>
        </div>
        <div>
          <dt class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">{t('circular30.hero_meta_identity_label')}</dt>
          <dd class="mt-1 text-sm font-medium text-foreground">{t('circular30.hero_meta_identity_value')}</dd>
        </div>
        <div>
          <dt class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">{t('circular30.hero_meta_axes_label')}</dt>
          <dd class="mt-1 text-sm font-medium text-foreground" data-numeric>04</dd>
        </div>
      </dl>
    </div>
  </section>

  <!-- OFFICIAL REFERENCE -->
  <section class="py-8 sm:py-10 bg-background">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <a
        href="https://www.supereduc.cl"
        target="_blank"
        rel="noopener noreferrer"
        class="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] shadow-card-dark hover:shadow-card-dark-hover"
      >
        <FileText class="size-5 shrink-0 text-primary" />
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <p class="text-sm font-semibold text-foreground">{t('circular30.official_ref_title')}</p>
            <ExternalLink class="size-3.5 text-muted-foreground transition-colors group-hover:text-primary" />
          </div>
          <p class="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {t('circular30.official_ref_body')}
          </p>
          <p class="mt-2 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary">
            {t('circular30.official_ref_link')}
          </p>
        </div>
      </a>
    </div>
  </section>

  <div class="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
    <article class="mx-auto max-w-[68ch] space-y-20">

      <!-- SECCIÓN 1: QUÉ EXIGE -->
      <section id="que-exige">
        <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary" data-numeric>{t('circular30.s1_eyebrow')}</p>
        <h2 class="mt-3 font-heading text-3xl text-foreground sm:text-4xl">{t('circular30.s1_title')}</h2>
        <p class="mt-6 text-base leading-relaxed text-muted-foreground">
          {t('circular30.s1_lede')}
        </p>

        <dl class="mt-8 divide-y divide-border border-y border-border">
          {#each [
            { title: 'circular30.pillar_1_title' as const, icon: Database, desc: 'circular30.pillar_1_desc' as const },
            { title: 'circular30.pillar_2_title' as const, icon: Eye, desc: 'circular30.pillar_2_desc' as const },
            { title: 'circular30.pillar_3_title' as const, icon: Users, desc: 'circular30.pillar_3_desc' as const },
            { title: 'circular30.pillar_4_title' as const, icon: ShieldCheck, desc: 'circular30.pillar_4_desc' as const },
          ] as item, i}
            {@const Icon = item.icon}
            <div class="grid gap-3 py-6 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] sm:gap-8">
              <dt>
                <div class="flex items-center gap-2.5">
                  <Icon class="size-4 shrink-0 text-primary" />
                  <span class="font-semibold text-foreground">{t(item.title)}</span>
                </div>
                <p class="mt-1 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary" data-numeric>{t('circular30.pillar_label')} 0{i + 1}</p>
              </dt>
              <dd class="text-sm leading-relaxed text-muted-foreground">{t(item.desc)}</dd>
            </div>
          {/each}
        </dl>

        <!-- Pull-quote moment -->
        <blockquote class="mt-10 border-l-2 border-primary pl-6 font-heading text-[1.5rem] leading-[1.4] text-foreground sm:text-[1.75rem]">
          {t('circular30.s1_pullquote')}
        </blockquote>

        <p class="mt-6 text-sm leading-relaxed text-muted-foreground">{t('circular30.s1_questions_intro')}</p>
        <ul class="mt-4 space-y-3 border-l border-border pl-6">
          <li class="text-sm leading-relaxed text-muted-foreground"><strong class="text-foreground">{t('circular30.s1_case_1_label')}</strong> {t('circular30.s1_case_1_text')}</li>
          <li class="text-sm leading-relaxed text-muted-foreground"><strong class="text-foreground">{t('circular30.s1_case_2_label')}</strong> {t('circular30.s1_case_2_text')}</li>
          <li class="text-sm leading-relaxed text-muted-foreground"><strong class="text-foreground">{t('circular30.s1_case_3_label')}</strong> {t('circular30.s1_case_3_text')}</li>
        </ul>
      </section>

      <!-- SECCIÓN 2: QUÉ SISTEMAS CUMPLEN -->
      <section id="que-sistemas-cumplen">
        <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary" data-numeric>{t('circular30.s2_eyebrow')}</p>
        <h2 class="mt-3 font-heading text-3xl text-foreground sm:text-4xl">{t('circular30.s2_title')}</h2>
        <p class="mt-6 text-base leading-relaxed text-muted-foreground">
          {t('circular30.s2_lede')}
        </p>

        <!-- Requirements table -->
        <div class="mt-8 border-y border-border">
          <div class="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_auto] gap-4 py-3 border-b border-border">
            <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">{t('circular30.s2_col_requirement')}</p>
            <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">{t('circular30.s2_col_why')}</p>
            <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">{t('circular30.s2_col_brand')}</p>
          </div>
          {#each requirements as r, i}
            <div class="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_auto] gap-4 py-4 {i !== requirements.length - 1 ? 'border-b border-border' : ''}">
              <p class="text-sm font-medium text-foreground">{t(r.req)}</p>
              <p class="text-sm leading-relaxed text-muted-foreground">{t(r.why)}</p>
              <div class="flex items-start justify-end">
                <CheckCircle class="size-5 text-primary" />
              </div>
            </div>
          {/each}
        </div>

        <h3 class="mt-12 font-heading text-xl text-foreground">{t('circular30.s2_noncompliant_heading_pre')} <em>{t('circular30.s2_noncompliant_heading_em')}</em> {t('circular30.s2_noncompliant_heading_post')}</h3>
        <ul class="mt-6 divide-y divide-border border-y border-border">
          {#each nonCompliant as nc}
            <li class="grid gap-3 py-5 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] sm:gap-8">
              <div class="flex items-center gap-2.5">
                <XCircle class="size-4 shrink-0 text-destructive" />
                <span class="font-semibold text-foreground">{t(nc.system)}</span>
              </div>
              <p class="text-sm leading-relaxed text-muted-foreground">{t(nc.reason)}</p>
            </li>
          {/each}
        </ul>
      </section>

      <!-- SECCIÓN 3: AUTODIAGNÓSTICO -->
      <section id="autodiagnostico">
        <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary" data-numeric>{t('circular30.s3_eyebrow')}</p>
        <h2 class="mt-3 font-heading text-3xl text-foreground sm:text-4xl">{t('circular30.s3_title')}</h2>
        <p class="mt-6 text-base leading-relaxed text-muted-foreground">
          {t('circular30.s3_lede')}
        </p>
        <ol class="mt-8 divide-y divide-border border-y border-border">
          {#each selfAssessment as item, i}
            <li class="flex items-start gap-4 py-4">
              <span class="font-heading text-xs text-primary tabular-nums pt-0.5 w-6 shrink-0" data-numeric>{(i + 1).toString().padStart(2, '0')}</span>
              <span class="size-5 shrink-0 mt-0.5 border {item.critical ? 'border-destructive/50' : 'border-muted-foreground/40'} rounded-[4px]"></span>
              <p class="flex-1 text-sm text-foreground">
                {t(item.question)}
                {#if item.critical}
                  <span class="ml-2 inline-block align-middle text-mockup-xs font-mono font-semibold uppercase tracking-[0.1em] text-destructive">{t('circular30.s3_critical_badge')}</span>
                {/if}
              </p>
            </li>
          {/each}
        </ol>
        <p class="mt-6 text-sm leading-relaxed text-muted-foreground">
          {t('circular30.s3_outro')} <a href="/demo" class="border-b border-primary pb-0.5 font-semibold text-primary hover:border-b-2">{t('circular30.s3_outro_link')}</a>.
        </p>
      </section>

      <!-- SECCIÓN 4: INTEGRACIÓN CON ETHOZ -->
      <section id="integracion-ethoz">
        <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary" data-numeric>{t('circular30.s4_eyebrow')}</p>
        <h2 class="mt-3 font-heading text-3xl text-foreground sm:text-4xl">{t('circular30.s4_title')}</h2>
        <p class="mt-6 text-base leading-relaxed text-muted-foreground">
          {t('circular30.s4_lede')}
        </p>
        <div class="mt-8 grid gap-4 sm:grid-cols-2">
          {#each [
            { title: 'circular30.s4_card_1_title' as const, desc: 'circular30.s4_card_1_desc' as const },
            { title: 'circular30.s4_card_2_title' as const, desc: 'circular30.s4_card_2_desc' as const },
            { title: 'circular30.s4_card_3_title' as const, desc: 'circular30.s4_card_3_desc' as const },
            { title: 'circular30.s4_card_4_title' as const, desc: 'circular30.s4_card_4_desc' as const },
          ] as item}
            <div class="group rounded-xl border border-border bg-card p-5 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] shadow-card-dark hover:shadow-card-dark-hover">
              <h3 class="font-semibold text-foreground">{t(item.title)}</h3>
              <p class="mt-2 text-sm leading-relaxed text-muted-foreground">{t(item.desc)}</p>
            </div>
          {/each}
        </div>
      </section>

    </article>
  </div>

  <!-- FINAL CTA — dark navy -->
  <section class="bg-secondary py-20 text-foreground sm:py-24" aria-labelledby="final-cta-circular">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <span class="mx-auto block h-px w-12 bg-foreground/60" aria-hidden="true"></span>
      <p class="mt-6 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-foreground/85">{t('circular30.cta_eyebrow')}</p>
      <h2 id="final-cta-circular" class="mt-5 font-heading text-3xl leading-[1.15] text-foreground sm:text-4xl">
        {t('circular30.cta_title')}
      </h2>
      <p class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-foreground/80">
        {t('circular30.cta_lede')}
      </p>
      <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href="/demo"
          class="inline-flex h-14 items-center justify-center gap-2 rounded-md bg-gradient-to-b from-primary to-primary-hover px-10 text-base font-semibold text-cta-text transition-colors hover:from-primary-hover hover:to-primary-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {t('circular30.cta_primary')}
          <ArrowRight class="size-5" />
        </a>
        <a href="/ley-21719" class="group inline-flex min-h-11 items-center gap-1 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground">
          <span class="border-b border-foreground/60 pb-0.5 transition-colors group-hover:border-foreground">{t('circular30.cta_secondary')}</span>
        </a>
      </div>
    </div>
  </section>

  <section class="py-12 bg-background border-t border-border">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-5">{t('circular30.related_heading')}</p>
      <div class="flex flex-wrap gap-3">
        {#each [
          { href: '/ley-21719', label: 'circular30.related_1' as const },
          { href: '/seguridad-datos', label: 'circular30.related_2' as const },
          { href: '/glosario', label: 'circular30.related_3' as const },
          { href: '/comparativa', label: 'circular30.related_4' as const },
        ] as item}
          <a href={item.href} class="border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted/40 hover:border-foreground hover:text-foreground rounded-md">
            {t(item.label)}
          </a>
        {/each}
      </div>
    </div>
  </section>
  </main>

  <Footer />
</div>
