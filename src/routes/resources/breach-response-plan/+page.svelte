<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Printer, ArrowLeft } from '@lucide/svelte';
  import { BRAND } from '$lib/brand';
  import { t } from '$lib/i18n/index.svelte';
</script>

<svelte:head>
  <title>{t('resBreachResponse.meta_title')}</title>
  <meta name="description" content={t('resBreachResponse.meta_description')} />
  <meta property="og:url" content="https://ethoz.cl/resources/breach-response-plan" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={t('resBreachResponse.og_title')} />
  <meta property="og:description" content={t('resBreachResponse.og_description')} />
  <link rel="canonical" href="https://ethoz.cl/resources/breach-response-plan" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": t('resBreachResponse.schema_name'),
    "description": t('resBreachResponse.schema_description'),
    "url": "https://ethoz.cl/resources/breach-response-plan",
    "publisher": { "@type": "Organization", "name": BRAND, "url": "https://ethoz.cl" }
  })}</script>`}
</svelte:head>

<div class="print:hidden">
  <NavBar />
</div>

<main class="min-h-dvh bg-background">
  <div class="print:hidden sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur-sm">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
      <Button href="/resources" variant="ghost" size="sm" class="gap-2 text-muted-foreground">
        <ArrowLeft class="size-4" />
        {t('resBreachResponse.back_to_resources')}
      </Button>
      <Button href="/downloads/plan-respuesta-brechas.pdf" download size="lg" class="gap-2">
        <Printer class="size-4" />
        {t('resBreachResponse.download_pdf')}
      </Button>
    </div>
  </div>

  <div class="mx-auto max-w-7xl px-4 py-10 sm:py-14">
    <div class="mb-12 border-b border-border pb-10">
      <p class="flex flex-wrap items-center gap-x-3 gap-y-1 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground print:hidden">
        <span class="text-primary">{t('resBreachResponse.eyebrow_kind')}</span>
        <span aria-hidden="true" class="text-border">·</span>
        <span>{t('resBreachResponse.eyebrow_law')}</span>
        <span aria-hidden="true" class="text-border">·</span>
        <span>{t('resBreachResponse.eyebrow_deadline')}</span>
      </p>
      <span class="mt-5 block h-px w-12 bg-foreground print:hidden" aria-hidden="true"></span>
      <h1 class="mt-5 font-heading leading-[1.15] text-foreground">{t('resBreachResponse.hero_title')}</h1>
      <p class="mt-6 max-w-[68ch] text-base leading-relaxed text-muted-foreground">{t('resBreachResponse.hero_lead_pre')} <strong class="text-foreground">{t('resBreachResponse.hero_lead_emphasis')}</strong> {t('resBreachResponse.hero_lead_post')}</p>
      <p class="mt-4 text-xs text-muted-foreground">{t('resBreachResponse.hero_attribution')}</p>
    </div>

    <div class="space-y-10 text-sm leading-relaxed">

      <!-- 1. Equipo de respuesta -->
      <section>
        <h2 class="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <span class="flex size-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">1</span>
          {t('resBreachResponse.s1_title')}
        </h2>
        <div class="overflow-x-auto rounded-xl border border-border">
          <table class="w-full min-w-[640px] text-sm">
            <thead>
              <tr class="border-b border-border bg-muted/50">
                <th class="whitespace-nowrap px-4 py-2.5 text-left font-medium text-foreground">{t('resBreachResponse.s1_th_role')}</th>
                <th class="whitespace-nowrap px-4 py-2.5 text-left font-medium text-foreground">{t('resBreachResponse.s1_th_name')}</th>
                <th class="whitespace-nowrap px-4 py-2.5 text-left font-medium text-foreground">{t('resBreachResponse.s1_th_phone')}</th>
                <th class="whitespace-nowrap px-4 py-2.5 text-left font-medium text-foreground">{t('resBreachResponse.s1_th_email')}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border text-muted-foreground">
              <tr><td class="px-4 py-2.5 font-medium text-foreground">{t('resBreachResponse.s1_role_dpo')}</td><td class="px-4 py-2.5">{t('resBreachResponse.ph_name')}</td><td class="px-4 py-2.5">{t('resBreachResponse.ph_phone')}</td><td class="px-4 py-2.5">{t('resBreachResponse.ph_email')}</td></tr>
              <tr><td class="px-4 py-2.5 font-medium text-foreground">{t('resBreachResponse.s1_role_director')}</td><td class="px-4 py-2.5">{t('resBreachResponse.ph_name')}</td><td class="px-4 py-2.5">{t('resBreachResponse.ph_phone')}</td><td class="px-4 py-2.5">{t('resBreachResponse.ph_email')}</td></tr>
              <tr><td class="px-4 py-2.5 font-medium text-foreground">{t('resBreachResponse.s1_role_it')}</td><td class="px-4 py-2.5">{t('resBreachResponse.ph_name')}</td><td class="px-4 py-2.5">{t('resBreachResponse.ph_phone')}</td><td class="px-4 py-2.5">{t('resBreachResponse.ph_email')}</td></tr>
              <tr><td class="px-4 py-2.5 font-medium text-foreground">{t('resBreachResponse.s1_role_legal')}</td><td class="px-4 py-2.5">{t('resBreachResponse.ph_name_signature')}</td><td class="px-4 py-2.5">{t('resBreachResponse.ph_phone')}</td><td class="px-4 py-2.5">{t('resBreachResponse.ph_email')}</td></tr>
              <tr><td class="px-4 py-2.5 font-medium text-foreground">{t('resBreachResponse.s1_role_comms')}</td><td class="px-4 py-2.5">{t('resBreachResponse.ph_name')}</td><td class="px-4 py-2.5">{t('resBreachResponse.ph_phone')}</td><td class="px-4 py-2.5">{t('resBreachResponse.ph_email')}</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- 2. Clasificación -->
      <section>
        <h2 class="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <span class="flex size-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">2</span>
          {t('resBreachResponse.s2_title')}
        </h2>
        <div class="space-y-3">
          <div class="rounded-xl border border-success/20 bg-success/10   p-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="rounded-full bg-success px-2.5 py-0.5 text-mockup-sm font-bold text-foreground">{t('resBreachResponse.s2_level_low')}</span>
              <span class="text-xs text-muted-foreground">{t('resBreachResponse.s2_low_obligation')}</span>
            </div>
            <p class="text-sm text-muted-foreground">{t('resBreachResponse.s2_low_desc')}</p>
          </div>
          <div class="rounded-xl border border-warning/20 bg-warning/10 p-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="rounded-full bg-warning px-2.5 py-0.5 text-mockup-sm font-bold text-warning-foreground">{t('resBreachResponse.s2_level_serious')}</span>
              <span class="text-xs text-muted-foreground">{t('resBreachResponse.s2_serious_obligation')}</span>
            </div>
            <p class="text-sm text-muted-foreground">{t('resBreachResponse.s2_serious_desc')}</p>
          </div>
          <div class="rounded-xl border border-destructive/20 bg-destructive/10   p-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="rounded-full bg-destructive px-2.5 py-0.5 text-mockup-sm font-bold text-white">{t('resBreachResponse.s2_level_critical')}</span>
              <span class="text-xs text-muted-foreground">{t('resBreachResponse.s2_critical_obligation')}</span>
            </div>
            <p class="text-sm text-muted-foreground">{t('resBreachResponse.s2_critical_desc')}</p>
          </div>
        </div>
      </section>

      <!-- 3. Procedimiento 72 horas -->
      <section>
        <h2 class="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <span class="flex size-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">3</span>
          {t('resBreachResponse.s3_title')}
        </h2>
        <div class="space-y-3">
          {#each [
            { time: 'resBreachResponse.s3_t0_time' as const, title: 'resBreachResponse.s3_t0_title' as const, detail: 'resBreachResponse.s3_t0_detail' as const },
            { time: 'resBreachResponse.s3_t1_time' as const, title: 'resBreachResponse.s3_t1_title' as const, detail: 'resBreachResponse.s3_t1_detail' as const },
            { time: 'resBreachResponse.s3_t2_time' as const, title: 'resBreachResponse.s3_t2_title' as const, detail: 'resBreachResponse.s3_t2_detail' as const },
            { time: 'resBreachResponse.s3_t3_time' as const, title: 'resBreachResponse.s3_t3_title' as const, detail: 'resBreachResponse.s3_t3_detail' as const },
            { time: 'resBreachResponse.s3_t4_time' as const, title: 'resBreachResponse.s3_t4_title' as const, detail: 'resBreachResponse.s3_t4_detail' as const },
            { time: 'resBreachResponse.s3_t5_time' as const, title: 'resBreachResponse.s3_t5_title' as const, detail: 'resBreachResponse.s3_t5_detail' as const },
            { time: 'resBreachResponse.s3_t6_time' as const, title: 'resBreachResponse.s3_t6_title' as const, detail: 'resBreachResponse.s3_t6_detail' as const },
          ] as step}
            <div class="flex gap-4 rounded-xl border border-border bg-card p-4">
              <div class="shrink-0 w-12 text-right">
                <span class="text-xs font-mono font-bold text-primary">{t(step.time)}</span>
              </div>
              <div class="flex-1">
                <p class="font-medium text-foreground mb-1">{t(step.title)}</p>
                <p class="text-sm text-muted-foreground">{t(step.detail)}</p>
              </div>
            </div>
          {/each}
        </div>
      </section>

      <!-- 4. Evaluación de impacto -->
      <section>
        <h2 class="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <span class="flex size-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">4</span>
          {t('resBreachResponse.s4_title')}
        </h2>
        <p class="text-muted-foreground mb-3">{t('resBreachResponse.s4_intro')}</p>
        <div class="overflow-x-auto rounded-xl border border-border">
          <table class="w-full min-w-[640px] text-sm">
            <thead>
              <tr class="border-b border-border bg-muted/50">
                <th class="whitespace-nowrap px-4 py-2.5 text-left font-medium">{t('resBreachResponse.s4_th_factor')}</th>
                <th class="whitespace-nowrap px-4 py-2.5 text-left font-medium">{t('resBreachResponse.s4_th_low')}</th>
                <th class="whitespace-nowrap px-4 py-2.5 text-left font-medium">{t('resBreachResponse.s4_th_medium')}</th>
                <th class="whitespace-nowrap px-4 py-2.5 text-left font-medium">{t('resBreachResponse.s4_th_high')}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border text-muted-foreground text-xs">
              <tr><td class="px-4 py-2.5 font-medium text-foreground">{t('resBreachResponse.s4_r1_factor')}</td><td class="px-4 py-2.5">{t('resBreachResponse.s4_r1_low')}</td><td class="px-4 py-2.5">{t('resBreachResponse.s4_r1_medium')}</td><td class="px-4 py-2.5">{t('resBreachResponse.s4_r1_high')}</td></tr>
              <tr><td class="px-4 py-2.5 font-medium text-foreground">{t('resBreachResponse.s4_r2_factor')}</td><td class="px-4 py-2.5">{t('resBreachResponse.s4_r2_low')}</td><td class="px-4 py-2.5">{t('resBreachResponse.s4_r2_medium')}</td><td class="px-4 py-2.5">{t('resBreachResponse.s4_r2_high')}</td></tr>
              <tr><td class="px-4 py-2.5 font-medium text-foreground">{t('resBreachResponse.s4_r3_factor')}</td><td class="px-4 py-2.5">{t('resBreachResponse.s4_r3_low')}</td><td class="px-4 py-2.5">{t('resBreachResponse.s4_r3_medium')}</td><td class="px-4 py-2.5">{t('resBreachResponse.s4_r3_high')}</td></tr>
              <tr><td class="px-4 py-2.5 font-medium text-foreground">{t('resBreachResponse.s4_r4_factor')}</td><td class="px-4 py-2.5">{t('resBreachResponse.s4_r4_low')}</td><td class="px-4 py-2.5">{t('resBreachResponse.s4_r4_medium')}</td><td class="px-4 py-2.5">{t('resBreachResponse.s4_r4_high')}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="mt-2 text-xs text-muted-foreground">{t('resBreachResponse.s4_scoring')}</p>
      </section>

      <!-- 5. Comunicación a afectados -->
      <section>
        <h2 class="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <span class="flex size-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">5</span>
          {t('resBreachResponse.s5_title')}
        </h2>
        <p class="text-muted-foreground mb-3">{t('resBreachResponse.s5_intro')}</p>
        <ul class="list-disc pl-6 space-y-1.5 text-muted-foreground">
          <li>{t('resBreachResponse.s5_item1')}</li>
          <li>{t('resBreachResponse.s5_item2')}</li>
          <li>{t('resBreachResponse.s5_item3')}</li>
          <li>{t('resBreachResponse.s5_item4')}</li>
          <li>{t('resBreachResponse.s5_item5')}</li>
          <li>{t('resBreachResponse.s5_item6')}</li>
        </ul>
      </section>

      <!-- 6. Documentación -->
      <section>
        <h2 class="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <span class="flex size-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">6</span>
          {t('resBreachResponse.s6_title')}
        </h2>
        <p class="text-muted-foreground mb-3">{t('resBreachResponse.s6_intro')}</p>
        <div class="rounded-xl border border-border bg-card p-4 space-y-1.5 text-xs text-muted-foreground">
          <p><strong class="text-foreground">{t('resBreachResponse.s6_f1')}</strong> ___________________________</p>
          <p><strong class="text-foreground">{t('resBreachResponse.s6_f2')}</strong> ___________________________</p>
          <p><strong class="text-foreground">{t('resBreachResponse.s6_f3')}</strong> ___________________________</p>
          <p><strong class="text-foreground">{t('resBreachResponse.s6_f4')}</strong> ___________________________</p>
          <p><strong class="text-foreground">{t('resBreachResponse.s6_f5')}</strong> ___________________________</p>
          <p><strong class="text-foreground">{t('resBreachResponse.s6_f6')}</strong> ___________________________</p>
          <p><strong class="text-foreground">{t('resBreachResponse.s6_f7')}</strong> ___________________________</p>
          <p><strong class="text-foreground">{t('resBreachResponse.s6_f8')}</strong> ___________________________</p>
          <p><strong class="text-foreground">{t('resBreachResponse.s6_f9')}</strong> ___________________________</p>
        </div>
      </section>

      <!-- 7. Plantilla de reporte -->
      <section>
        <h2 class="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <span class="flex size-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">7</span>
          {t('resBreachResponse.s7_title')}
        </h2>
        <div class="rounded-xl border-2 border-dashed border-border bg-muted/20 p-6 space-y-4 text-sm text-muted-foreground">
          <p class="font-semibold text-foreground text-center">{t('resBreachResponse.s7_header_line1')}<br/>{t('resBreachResponse.s7_header_line2')}</p>
          <div class="space-y-2">
            <p><strong class="text-foreground">{t('resBreachResponse.s7_f1_label')}</strong><br/>{t('resBreachResponse.s7_f1_body')}</p>
            <p><strong class="text-foreground">{t('resBreachResponse.s7_f2_label')}</strong><br/>{t('resBreachResponse.s7_f2_body')}</p>
            <p><strong class="text-foreground">{t('resBreachResponse.s7_f3_label')}</strong><br/>{t('resBreachResponse.s7_f3_body')}</p>
            <p><strong class="text-foreground">{t('resBreachResponse.s7_f4_label')}</strong><br/>{t('resBreachResponse.s7_f4_body')}</p>
            <p><strong class="text-foreground">{t('resBreachResponse.s7_f5_label')}</strong><br/>{t('resBreachResponse.s7_f5_body')}</p>
            <p><strong class="text-foreground">{t('resBreachResponse.s7_f6_label')}</strong><br/>{t('resBreachResponse.s7_f6_body')}</p>
            <p><strong class="text-foreground">{t('resBreachResponse.s7_f7_label')}</strong><br/>{t('resBreachResponse.s7_f7_body')}</p>
            <p><strong class="text-foreground">{t('resBreachResponse.s7_f8_label')}</strong><br/>{t('resBreachResponse.s7_f8_body')}</p>
            <p><strong class="text-foreground">{t('resBreachResponse.s7_f9_label')}</strong><br/>___________________________</p>
          </div>
        </div>
      </section>

    </div>

    <div class="print:hidden mt-10 text-center">
      <p class="text-sm text-muted-foreground mb-4">{t('resBreachResponse.cta_text')}</p>
      <Button href="/demo">{t('resBreachResponse.cta_button')}</Button>
    </div>
  </div>
</main>

<div class="print:hidden">
  <Footer />
</div>

<style>
  @media print {
    /* Print: force high-contrast B&W regardless of theme */
    :global(body) { font-size: 10px; color: black; background: white; }
    main { padding: 0; }
  }
</style>
