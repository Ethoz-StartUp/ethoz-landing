<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { BRAND } from '$lib/brand';
  import { trackEvent } from '$lib/utils/analytics';
  import { t } from '$lib/i18n/index.svelte';
  import {
    ShieldCheck,
    AlertTriangle,
    CheckCircle,
    ArrowRight,
    Scale,
    Lock,
    Database,
    FileText,
    Clock,
    Users,
    Eye,
    Pencil,
    Trash2,
    Ban,
    Package,
    ExternalLink,
  } from '@lucide/svelte';

  $effect(() => {
    trackEvent('seo_page_viewed', { slug: 'ley-21719' });
  });

  const toc = [
    { href: '#que-es', labelKey: 'ley21719.toc_1' as const, n: '01' },
    { href: '#a-quien-aplica', labelKey: 'ley21719.toc_2' as const, n: '02' },
    { href: '#principios', labelKey: 'ley21719.toc_3' as const, n: '03' },
    { href: '#derechos-arco', labelKey: 'ley21719.toc_4' as const, n: '04' },
    { href: '#obligaciones', labelKey: 'ley21719.toc_5' as const, n: '05' },
    { href: '#multas', labelKey: 'ley21719.toc_6' as const, n: '06' },
    { href: '#plazos', labelKey: 'ley21719.toc_7' as const, n: '07' },
    { href: '#checklist', labelKey: 'ley21719.toc_8' as const, n: '08' },
    { href: '#como-ayuda-ethoz', labelKey: 'ley21719.toc_9' as const, n: '09' },
  ];

  const checklist = [
    'ley21719.checklist_1',
    'ley21719.checklist_2',
    'ley21719.checklist_3',
    'ley21719.checklist_4',
    'ley21719.checklist_5',
    'ley21719.checklist_6',
    'ley21719.checklist_7',
    'ley21719.checklist_8',
    'ley21719.checklist_9',
    'ley21719.checklist_10',
    'ley21719.checklist_11',
    'ley21719.checklist_12',
    'ley21719.checklist_13',
    'ley21719.checklist_14',
    'ley21719.checklist_15',
  ] as const;

  const sanctions = [
    {
      levelKey: 'ley21719.sanction_1_level' as const,
      examplesKey: 'ley21719.sanction_1_examples' as const,
      fineKey: 'ley21719.sanction_1_fine' as const,
      approx: '≈ $6,7M CLP',
    },
    {
      levelKey: 'ley21719.sanction_2_level' as const,
      examplesKey: 'ley21719.sanction_2_examples' as const,
      fineKey: 'ley21719.sanction_2_fine' as const,
      approx: '≈ $67M CLP',
    },
    {
      levelKey: 'ley21719.sanction_3_level' as const,
      examplesKey: 'ley21719.sanction_3_examples' as const,
      fineKey: 'ley21719.sanction_3_fine' as const,
      approx: '≈ $670M a $1.300M CLP',
    },
  ];

  const rights = [
    {
      letter: 'A',
      nameKey: 'ley21719.right_a_name' as const,
      icon: Eye,
      descKey: 'ley21719.right_a_desc' as const,
    },
    {
      letter: 'R',
      nameKey: 'ley21719.right_r_name' as const,
      icon: Pencil,
      descKey: 'ley21719.right_r_desc' as const,
    },
    {
      letter: 'C',
      nameKey: 'ley21719.right_c_name' as const,
      icon: Trash2,
      descKey: 'ley21719.right_c_desc' as const,
    },
    {
      letter: 'O',
      nameKey: 'ley21719.right_o_name' as const,
      icon: Ban,
      descKey: 'ley21719.right_o_desc' as const,
    },
    {
      letter: '+P',
      nameKey: 'ley21719.right_p_name' as const,
      icon: Package,
      descKey: 'ley21719.right_p_desc' as const,
    },
  ];

  const timeline = [
    { date: '13 dic 2024', eventKey: 'ley21719.timeline_1' as const, highlight: false },
    { date: 'Dic 2025', eventKey: 'ley21719.timeline_2' as const, highlight: false },
    { date: 'Jun 2026', eventKey: 'ley21719.timeline_3' as const, highlight: true },
    { date: 'Dic 2026', eventKey: 'ley21719.timeline_4' as const, highlight: true },
  ];
</script>

<svelte:head>
  <title>{t('ley21719.meta_title')}</title>
  <meta name="description" content={t('ley21719.meta_description')} />
  <meta property="og:title" content={t('ley21719.og_title')} />
  <meta property="og:description" content={t('ley21719.meta_description')} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://ethoz.cl/ley-21719" />
  <meta property="og:image" content="https://ethoz.cl/images/og-ley-21719.webp" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={t('ley21719.og_title')} />
  <meta name="twitter:description" content={t('ley21719.twitter_description')} />
  <link rel="canonical" href="https://ethoz.cl/ley-21719" />
  {@html `<script type="application/ld+json">${JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Ley 21.719: Guía completa para colegios, qué es, multas y cómo cumplir",
      "description": "Ley 21.719 colegios Chile: qué exige, multas hasta 20.000 UTM, derechos ARCO+P, plazos dic 2026. Guía práctica para sostenedores y directivos.",
      "datePublished": "2026-04-07",
      "dateModified": "2026-07-07",
      "author": { "@type": "Organization", "name": BRAND },
      "publisher": { "@type": "Organization", "name": BRAND, "logo": { "@type": "ImageObject", "url": "https://ethoz.cl/favicon.svg" }},
      "url": "https://ethoz.cl/ley-21719",
      "mainEntityOfPage": "https://ethoz.cl/ley-21719",
      "about": { "@type": "Thing", "name": "Ley 21.719 Protección de Datos Personales Chile" },
      "keywords": "ley 21719, proteccion datos personales chile, multa ley 21719, colegios ley datos, ARCO derechos datos chile"
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://ethoz.cl/" },
        { "@type": "ListItem", "position": 2, "name": "Ley 21.719", "item": "https://ethoz.cl/ley-21719" }
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

  <!-- ══════════════════════════════════════
       HERO — editorial, institutional
       ══════════════════════════════════════ -->
  <section class="pt-24 pb-12 sm:pt-28 sm:pb-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Eyebrow metadata line -->
      <p class="flex flex-wrap items-center gap-x-3 gap-y-1 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        <span class="text-primary">{t('ley21719.hero_eyebrow_doc')}</span>
        <span aria-hidden="true" class="hidden text-border sm:inline">·</span>
        <span>{t('ley21719.hero_eyebrow_updated')}</span>
        <span aria-hidden="true" class="hidden text-border sm:inline">·</span>
        <span>{t('ley21719.hero_eyebrow_readtime')}</span>
      </p>

      <!-- Short 48px rule -->
      <span class="mt-6 block h-px w-12 bg-foreground" aria-hidden="true"></span>

      <!-- Editorial italic statement -->
      <h1 class="page-title">
        {t('ley21719.hero_title')}
      </h1>

      <!-- Body lede -->
      <p class="mt-8 max-w-[68ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
        {t('ley21719.hero_lede')}
      </p>

      <!-- Metadata footer, McKinsey-style -->
      <dl class="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-6 sm:grid-cols-4">
        <div>
          <dt class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">{t('ley21719.hero_meta_promulgated_label')}</dt>
          <dd class="mt-1 text-sm font-medium text-foreground" data-numeric>13 dic 2024</dd>
        </div>
        <div>
          <dt class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">{t('ley21719.hero_meta_enforcement_label')}</dt>
          <dd class="mt-1 text-sm font-medium text-foreground" data-numeric>Dic 2026</dd>
        </div>
        <div>
          <dt class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">{t('ley21719.hero_meta_maxfine_label')}</dt>
          <dd class="mt-1 text-sm font-medium text-foreground" data-numeric>20.000 UTM</dd>
        </div>
        <div>
          <dt class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">{t('ley21719.hero_meta_regulator_label')}</dt>
          <dd class="mt-1 text-sm font-medium text-foreground">{t('ley21719.hero_meta_regulator_value')}</dd>
        </div>
      </dl>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       BODY — article + sticky TOC
       ══════════════════════════════════════ -->
  <div class="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
    <div class="grid gap-12 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] lg:gap-16">

      <!-- Sticky TOC (desktop) / inline (mobile) -->
      <aside class="lg:sticky lg:top-24 lg:self-start">
        <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">{t('ley21719.toc_heading')}</p>
        <nav class="mt-4 border-l border-border" aria-label={t('ley21719.toc_aria_label')}>
          <ol class="space-y-1">
            {#each toc as item}
              <li>
                <a
                  href={item.href}
                  class="group flex items-baseline gap-3 -ml-px border-l border-transparent py-1.5 pl-4 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                >
                  <span class="font-heading text-xs text-primary tabular-nums group-hover:text-primary" data-numeric>{item.n}</span>
                  <span>{t(item.labelKey)}</span>
                </a>
              </li>
            {/each}
          </ol>
        </nav>
      </aside>

      <!-- Article body -->
      <article class="mx-auto max-w-[68ch] space-y-20">

        <!-- SECCIÓN 1: QUÉ ES -->
        <section id="que-es">
          <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary" data-numeric>{t('ley21719.s1_eyebrow')}</p>
          <h2 class="mt-3 font-heading text-3xl text-foreground sm:text-4xl">{t('ley21719.s1_heading')}</h2>
          <div class="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              <strong class="text-foreground">{t('ley21719.s1_p1_strong')}</strong>{t('ley21719.s1_p1_rest')}
            </p>
            <p>
              {t('ley21719.s1_p2')}
            </p>
            <p>
              {t('ley21719.s1_p3_pre')}<strong class="text-foreground">{t('ley21719.s1_p3_strong')}</strong>{t('ley21719.s1_p3_post')}
            </p>
          </div>

          <!-- Pull quote moment: the thesis of the page -->
          <blockquote class="mt-10 border-l-2 border-primary pl-6 font-heading text-[1.5rem] leading-[1.4] text-foreground sm:text-[1.75rem]">
            {t('ley21719.s1_quote_pre')}<em>{t('ley21719.s1_quote_em')}</em>{t('ley21719.s1_quote_post')}
          </blockquote>

          <!-- Key date footnote -->
          <aside class="mt-10 border-t border-border pt-6">
            <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">{t('ley21719.s1_keydate_label')}</p>
            <p class="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t('ley21719.s1_keydate_pre')}<strong class="text-foreground">{t('ley21719.s1_keydate_strong1')}</strong>{t('ley21719.s1_keydate_mid')}<strong class="text-foreground">{t('ley21719.s1_keydate_strong2')}</strong>{t('ley21719.s1_keydate_post')}<sup class="ml-0.5 text-primary">1</sup>
            </p>
          </aside>
        </section>

        <!-- SECCIÓN 2: A QUIÉN APLICA -->
        <section id="a-quien-aplica">
          <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary" data-numeric>{t('ley21719.s2_eyebrow')}</p>
          <h2 class="mt-3 font-heading text-3xl text-foreground sm:text-4xl">{t('ley21719.s2_heading')}</h2>
          <p class="mt-6 max-w-[68ch] text-base leading-relaxed text-muted-foreground">
            {t('ley21719.s2_intro')}
          </p>

          <dl class="mt-8 divide-y divide-border border-y border-border">
            {#each [
              { titleKey: 'ley21719.s2_type1_title' as const, descKey: 'ley21719.s2_type1_desc' as const },
              { titleKey: 'ley21719.s2_type2_title' as const, descKey: 'ley21719.s2_type2_desc' as const },
              { titleKey: 'ley21719.s2_type3_title' as const, descKey: 'ley21719.s2_type3_desc' as const },
              { titleKey: 'ley21719.s2_type4_title' as const, descKey: 'ley21719.s2_type4_desc' as const },
            ] as item}
              <div class="grid gap-3 py-5 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-8">
                <dt class="font-semibold text-foreground">{t(item.titleKey)}</dt>
                <dd class="text-sm leading-relaxed text-muted-foreground">{t(item.descKey)}</dd>
              </div>
            {/each}
          </dl>

          <p class="mt-6 max-w-[68ch] text-sm leading-relaxed text-muted-foreground">
            {t('ley21719.s2_outro_pre')}<strong class="text-foreground">{t('ley21719.s2_outro_strong')}</strong>{t('ley21719.s2_outro_post')}<sup class="ml-0.5 text-primary">2</sup>
          </p>
        </section>

        <!-- SECCIÓN 3: PRINCIPIOS -->
        <section id="principios">
          <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary" data-numeric>{t('ley21719.s3_eyebrow')}</p>
          <h2 class="mt-3 font-heading text-3xl text-foreground sm:text-4xl">{t('ley21719.s3_heading')}</h2>
          <p class="mt-6 max-w-[68ch] text-base leading-relaxed text-muted-foreground">
            {t('ley21719.s3_intro')}
          </p>
          <ol class="mt-8 space-y-6 border-l border-border pl-6">
            {#each [
              { nameKey: 'ley21719.s3_p1_name' as const, descKey: 'ley21719.s3_p1_desc' as const },
              { nameKey: 'ley21719.s3_p2_name' as const, descKey: 'ley21719.s3_p2_desc' as const },
              { nameKey: 'ley21719.s3_p3_name' as const, descKey: 'ley21719.s3_p3_desc' as const },
              { nameKey: 'ley21719.s3_p4_name' as const, descKey: 'ley21719.s3_p4_desc' as const },
              { nameKey: 'ley21719.s3_p5_name' as const, descKey: 'ley21719.s3_p5_desc' as const },
              { nameKey: 'ley21719.s3_p6_name' as const, descKey: 'ley21719.s3_p6_desc' as const },
            ] as item, i}
              <li>
                <p class="flex items-baseline gap-3 font-semibold text-foreground">
                  <span class="font-heading text-xs text-primary tabular-nums" data-numeric>0{i + 1}</span>
                  <span>{t(item.nameKey)}</span>
                </p>
                <p class="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t(item.descKey)}</p>
              </li>
            {/each}
          </ol>
        </section>

        <!-- SECCIÓN 4: DERECHOS ARCO+P -->
        <section id="derechos-arco">
          <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary" data-numeric>{t('ley21719.s4_eyebrow')}</p>
          <h2 class="mt-3 font-heading text-3xl text-foreground sm:text-4xl">{t('ley21719.s4_heading')}</h2>
          <p class="mt-6 max-w-[68ch] text-base leading-relaxed text-muted-foreground">
            {t('ley21719.s4_intro_pre')}<strong class="text-foreground">{t('ley21719.s4_intro_strong')}</strong>{t('ley21719.s4_intro_post')}<sup class="ml-0.5 text-primary">3</sup>
          </p>
          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            {#each rights as right}
              <div class="group rounded-xl border border-border bg-card p-5 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] shadow-card-dark hover:shadow-card-dark-hover">
                <div class="flex items-baseline gap-3">
                  <span class="font-heading text-2xl leading-none text-primary group-hover:text-foreground">{right.letter}</span>
                  <h3 class="text-base font-semibold text-foreground">{t(right.nameKey)}</h3>
                </div>
                <p class="mt-3 text-sm leading-relaxed text-muted-foreground">{t(right.descKey)}</p>
              </div>
            {/each}
          </div>
          <aside class="mt-8 border-t border-border pt-6">
            <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">{t('ley21719.s4_minors_label')}</p>
            <p class="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t('ley21719.s4_minors_body')}
            </p>
          </aside>
        </section>

        <!-- SECCIÓN 5: OBLIGACIONES -->
        <section id="obligaciones">
          <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary" data-numeric>{t('ley21719.s5_eyebrow')}</p>
          <h2 class="mt-3 font-heading text-3xl text-foreground sm:text-4xl">{t('ley21719.s5_heading')}</h2>
          <p class="mt-6 max-w-[68ch] text-base leading-relaxed text-muted-foreground">
            {t('ley21719.s5_intro')}
          </p>
          <dl class="mt-8 divide-y divide-border border-y border-border">
            {#each [
              { titleKey: 'ley21719.s5_o1_title' as const, bodyKey: 'ley21719.s5_o1_body' as const, ref: 'Art. 12-14' },
              { titleKey: 'ley21719.s5_o2_title' as const, bodyKey: 'ley21719.s5_o2_body' as const, ref: 'Art. 16' },
              { titleKey: 'ley21719.s5_o3_title' as const, bodyKey: 'ley21719.s5_o3_body' as const, ref: 'Art. 48' },
              { titleKey: 'ley21719.s5_o4_title' as const, bodyKey: 'ley21719.s5_o4_body' as const, ref: 'Art. 30' },
              { titleKey: 'ley21719.s5_o5_title' as const, bodyKey: 'ley21719.s5_o5_body' as const, ref: 'Art. 17' },
              { titleKey: 'ley21719.s5_o6_title' as const, bodyKey: 'ley21719.s5_o6_body' as const, ref: 'Art. 24' },
            ] as item}
              <div class="grid gap-3 py-6 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-8">
                <dt>
                  <p class="font-semibold text-foreground">{t(item.titleKey)}</p>
                  <p class="mt-1 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary" data-numeric>{item.ref} · {t('ley21719.s5_ref_law')}</p>
                </dt>
                <dd class="text-sm leading-relaxed text-muted-foreground">{t(item.bodyKey)}</dd>
              </div>
            {/each}
          </dl>
        </section>

        <!-- SECCIÓN 6: MULTAS -->
        <section id="multas">
          <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary" data-numeric>{t('ley21719.s6_eyebrow')}</p>
          <h2 class="mt-3 font-heading text-3xl text-foreground sm:text-4xl">{t('ley21719.s6_heading')}</h2>
          <p class="mt-6 max-w-[68ch] text-base leading-relaxed text-muted-foreground">
            {t('ley21719.s6_intro_pre')}<strong class="text-foreground">{t('ley21719.s6_intro_strong')}</strong>{t('ley21719.s6_intro_post')}
          </p>
          <div class="mt-8 divide-y divide-border border-y border-border">
            {#each sanctions as s, i}
              <div class="grid gap-3 py-6 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)_minmax(0,12rem)] sm:items-baseline sm:gap-8">
                <div>
                  <p class="font-heading text-2xl leading-none text-foreground tabular-nums" data-numeric>0{i + 1}</p>
                  <p class="mt-2 text-base font-semibold text-foreground">{t(s.levelKey)}</p>
                </div>
                <p class="text-sm leading-relaxed text-muted-foreground">{t(s.examplesKey)}</p>
                <div class="sm:text-right">
                  <p class="text-sm font-semibold text-foreground">{t(s.fineKey)}</p>
                  <p class="mt-1 text-xs text-muted-foreground">{s.approx}</p>
                </div>
              </div>
            {/each}
          </div>
          <aside class="mt-8 border-t border-border pt-6">
            <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">{t('ley21719.s6_note_label')}</p>
            <p class="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t('ley21719.s6_note_pre')}<strong class="text-foreground">{t('ley21719.s6_note_strong')}</strong>{t('ley21719.s6_note_post')}
            </p>
          </aside>
        </section>

        <!-- SECCIÓN 7: PLAZOS -->
        <section id="plazos">
          <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary" data-numeric>{t('ley21719.s7_eyebrow')}</p>
          <h2 class="mt-3 font-heading text-3xl text-foreground sm:text-4xl">{t('ley21719.s7_heading')}</h2>
          <ol class="mt-8 divide-y divide-border border-y border-border">
            {#each timeline as item}
              <li class="grid gap-3 py-5 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)] sm:items-baseline sm:gap-8">
                <span class="text-sm font-semibold {item.highlight ? 'text-primary' : 'text-muted-foreground'} tabular-nums" data-numeric>{item.date}</span>
                <p class="text-sm leading-relaxed {item.highlight ? 'text-foreground font-medium' : 'text-muted-foreground'}">{t(item.eventKey)}</p>
              </li>
            {/each}
          </ol>
          <p class="mt-6 max-w-[68ch] text-sm leading-relaxed text-muted-foreground">
            {t('ley21719.s7_outro')}
          </p>
        </section>

        <!-- SECCIÓN 8: CHECKLIST -->
        <section id="checklist">
          <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary" data-numeric>{t('ley21719.s8_eyebrow')}</p>
          <h2 class="mt-3 font-heading text-3xl text-foreground sm:text-4xl">{t('ley21719.s8_heading')}</h2>
          <p class="mt-6 max-w-[68ch] text-base leading-relaxed text-muted-foreground">
            {t('ley21719.s8_intro')}
          </p>
          <ol class="mt-8 divide-y divide-border border-y border-border">
            {#each checklist as item, i}
              <li class="flex items-start gap-4 py-3">
                <span class="font-heading text-xs text-primary tabular-nums pt-0.5 w-6 shrink-0" data-numeric>{(i + 1).toString().padStart(2, '0')}</span>
                <span class="size-5 shrink-0 mt-0.5 border border-muted-foreground/40 rounded-[4px]"></span>
                <p class="text-sm text-foreground">{t(item)}</p>
              </li>
            {/each}
          </ol>
          <p class="mt-6 text-sm text-muted-foreground">
            {t('ley21719.s8_cta_pre')} <a href="/demo" class="border-b border-primary pb-0.5 font-semibold text-primary hover:border-b-2">{t('ley21719.s8_cta_link')}</a>.
          </p>
        </section>

        <!-- SECCIÓN 9: CÓMO AYUDA ETHOZ -->
        <section id="como-ayuda-ethoz">
          <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary" data-numeric>{t('ley21719.s9_eyebrow')}</p>
          <h2 class="mt-3 font-heading text-3xl text-foreground sm:text-4xl">{t('ley21719.s9_heading')}</h2>
          <p class="mt-6 max-w-[68ch] text-base leading-relaxed text-muted-foreground">
            {t('ley21719.s9_intro')}
          </p>
          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            {#each [
              { titleKey: 'ley21719.s9_f1_title' as const, descKey: 'ley21719.s9_f1_desc' as const, link: '/seguridad-datos' },
              { titleKey: 'ley21719.s9_f2_title' as const, descKey: 'ley21719.s9_f2_desc' as const, link: '/seguridad-datos' },
              { titleKey: 'ley21719.s9_f3_title' as const, descKey: 'ley21719.s9_f3_desc' as const, link: '/cumplimiento' },
              { titleKey: 'ley21719.s9_f4_title' as const, descKey: 'ley21719.s9_f4_desc' as const, link: '/integraciones' },
            ] as item}
              <a href={item.link} class="group block rounded-xl border border-border bg-card p-5 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] shadow-card-dark hover:shadow-card-dark-hover">
                <h3 class="font-semibold text-foreground">{t(item.titleKey)}</h3>
                <p class="mt-2 text-sm leading-relaxed text-muted-foreground">{t(item.descKey)}</p>
                <span class="mt-4 inline-flex items-center gap-1 border-b border-primary pb-0.5 text-sm font-semibold text-primary group-hover:border-b-2">
                  {t('ley21719.s9_learn_more')} <ArrowRight class="size-3.5" />
                </span>
              </a>
            {/each}
          </div>
        </section>

        <!-- Footnotes -->
        <footer class="border-t border-border pt-8">
          <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">{t('ley21719.refs_label')}</p>
          <ol class="mt-4 space-y-2 text-xs leading-relaxed text-muted-foreground">
            <li><sup class="mr-1.5 text-primary">1</sup><span>{t('ley21719.ref_1')}</span></li>
            <li><sup class="mr-1.5 text-primary">2</sup><span>{t('ley21719.ref_2')}</span></li>
            <li><sup class="mr-1.5 text-primary">3</sup><span>{t('ley21719.ref_3')}</span></li>
          </ol>
          <a
            href="https://www.bcn.cl/leychile/navegar?idNorma=1209272"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline underline-offset-2"
          >
            {t('ley21719.refs_bcn_link')} <ExternalLink class="size-3" />
          </a>
        </footer>

      </article>
    </div>
  </div>

  <!-- ══════════════════════════════════════
       FINAL CTA — dark navy editorial closing
       ══════════════════════════════════════ -->
  <section class="bg-secondary py-20 text-foreground sm:py-24" aria-labelledby="final-cta-law">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <span class="mx-auto block h-px w-12 bg-foreground/60" aria-hidden="true"></span>
      <p class="mt-6 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-foreground/85">{t('ley21719.cta_eyebrow')}</p>
      <h2 id="final-cta-law" class="mt-5 font-heading text-3xl leading-[1.15] text-foreground sm:text-4xl lg:text-5xl">
        {t('ley21719.cta_title')}
      </h2>
      <p class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-foreground/80">
        {t('ley21719.cta_body')}
      </p>
      <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href="/demo"
          class="inline-flex h-14 items-center justify-center gap-2 rounded-md bg-gradient-to-b from-primary to-primary-hover px-10 text-base font-semibold text-cta-text transition-colors hover:from-primary-hover hover:to-primary-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {t('ley21719.cta_primary')}
          <ArrowRight class="size-5" />
        </a>
        <a
          href="/glosario"
          class="group inline-flex min-h-11 items-center gap-1 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
        >
          <span class="border-b border-foreground/60 pb-0.5 transition-colors group-hover:border-foreground">{t('ley21719.cta_secondary')}</span>
        </a>
      </div>
    </div>
  </section>

  <!-- Related pages -->
  <section class="py-12 bg-background border-t border-border">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <p class="text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-5">{t('ley21719.related_label')}</p>
      <div class="flex flex-wrap gap-3">
        {#each [
          { href: '/circular-30', labelKey: 'ley21719.related_1' as const },
          { href: '/seguridad-datos', labelKey: 'ley21719.related_2' as const },
          { href: '/comparativa', labelKey: 'ley21719.related_3' as const },
          { href: '/glosario', labelKey: 'ley21719.related_4' as const },
          { href: '/cumplimiento', labelKey: 'ley21719.related_5' as const },
        ] as item}
          <a href={item.href} class="border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted/40 hover:border-foreground hover:text-foreground rounded-md">
            {t(item.labelKey)}
          </a>
        {/each}
      </div>
    </div>
  </section>
  </main>

  <Footer />
</div>
