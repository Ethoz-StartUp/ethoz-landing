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

<main class="min-h-screen bg-background">
  <NavBar />

  <!-- HERO -->
  <section class="pt-24 pb-12 sm:pt-28 sm:pb-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <p class="flex flex-wrap items-center gap-x-3 gap-y-1 text-mockup-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        <span class="text-primary">{t('circular30.hero_eyebrow_doc')}</span>
        <span aria-hidden="true" class="text-border">·</span>
        <span>{t('circular30.hero_eyebrow_authority')}</span>
        <span aria-hidden="true" class="text-border">·</span>
        <span>{t('circular30.hero_eyebrow_readtime')}</span>
      </p>

      <span class="mt-6 block h-px w-12 bg-foreground" aria-hidden="true"></span>

      <h1 class="mt-6 font-heading leading-[1.15] text-foreground">
        {t('circular30.hero_title')}
      </h1>

      <p class="mt-8 max-w-[68ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
        {t('circular30.hero_lede')}
      </p>

      <dl class="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-6 sm:grid-cols-3">
        <div>
          <dt class="text-mockup-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t('circular30.hero_meta_authority_label')}</dt>
          <dd class="mt-1 text-sm font-medium text-foreground">{t('circular30.hero_meta_authority_value')}</dd>
        </div>
        <div>
          <dt class="text-mockup-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t('circular30.hero_meta_identity_label')}</dt>
          <dd class="mt-1 text-sm font-medium text-foreground">{t('circular30.hero_meta_identity_value')}</dd>
        </div>
        <div>
          <dt class="text-mockup-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t('circular30.hero_meta_axes_label')}</dt>
          <dd class="mt-1 text-sm font-medium text-foreground" data-numeric>04</dd>
        </div>
      </dl>
    </div>
  </section>

  <div class="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
    <article class="mx-auto max-w-[68ch] space-y-20">

      <!-- SECCIÓN 1: QUÉ EXIGE -->
      <section id="que-exige">
        <p class="text-mockup-sm font-semibold uppercase tracking-[0.18em] text-primary" data-numeric>{t('circular30.s1_eyebrow')}</p>
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
                <p class="mt-1 text-mockup-sm font-semibold uppercase tracking-[0.18em] text-primary" data-numeric>{t('circular30.pillar_label')} 0{i + 1}</p>
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
        <p class="text-mockup-sm font-semibold uppercase tracking-[0.18em] text-primary" data-numeric>{t('circular30.s2_eyebrow')}</p>
        <h2 class="mt-3 font-heading text-3xl text-foreground sm:text-4xl">{t('circular30.s2_title')}</h2>
        <p class="mt-6 text-base leading-relaxed text-muted-foreground">
          {t('circular30.s2_lede')}
        </p>

        <!-- Requirements table -->
        <div class="mt-8 border-y border-border">
          <div class="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_auto] gap-4 py-3 border-b border-border">
            <p class="text-mockup-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t('circular30.s2_col_requirement')}</p>
            <p class="text-mockup-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t('circular30.s2_col_why')}</p>
            <p class="text-mockup-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t('circular30.s2_col_brand')}</p>
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
        <p class="text-mockup-sm font-semibold uppercase tracking-[0.18em] text-primary" data-numeric>{t('circular30.s3_eyebrow')}</p>
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
                  <span class="ml-2 inline-block align-middle text-mockup-xs font-semibold uppercase tracking-[0.18em] text-destructive">{t('circular30.s3_critical_badge')}</span>
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
        <p class="text-mockup-sm font-semibold uppercase tracking-[0.18em] text-primary" data-numeric>{t('circular30.s4_eyebrow')}</p>
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
            <div class="group rounded-xl border border-border bg-card p-5 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-card-hover">
              <h3 class="font-semibold text-foreground">{t(item.title)}</h3>
              <p class="mt-2 text-sm leading-relaxed text-muted-foreground">{t(item.desc)}</p>
            </div>
          {/each}
        </div>
      </section>

    </article>
  </div>

  <!-- FINAL CTA — dark navy -->
  <section class="bg-foreground py-20 text-background sm:py-24" aria-labelledby="final-cta-circular">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <span class="mx-auto block h-px w-12 bg-background/60" aria-hidden="true"></span>
      <p class="mt-6 text-mockup-sm font-semibold uppercase tracking-[0.18em] text-background/85">{t('circular30.cta_eyebrow')}</p>
      <h2 id="final-cta-circular" class="mt-5 font-heading text-3xl leading-[1.15] text-background sm:text-4xl">
        {t('circular30.cta_title')}
      </h2>
      <p class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-background/80">
        {t('circular30.cta_lede')}
      </p>
      <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href="/demo"
          class="inline-flex h-14 items-center justify-center gap-2 rounded-md bg-background px-10 text-base font-semibold text-foreground transition-colors hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
        >
          {t('circular30.cta_primary')}
          <ArrowRight class="size-5" />
        </a>
        <a href="/ley-21719" class="inline-flex items-center gap-1 border-b border-background/60 pb-0.5 text-sm font-medium text-background/80 transition-colors hover:border-background hover:text-background">
          {t('circular30.cta_secondary')}
        </a>
      </div>
    </div>
  </section>

  <section class="py-12 bg-background border-t border-border">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <p class="text-mockup-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-5">{t('circular30.related_heading')}</p>
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

  <Footer />
</main>
