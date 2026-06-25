<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Printer, ArrowLeft } from '@lucide/svelte';
  import { BRAND } from '$lib/brand';
  import { t } from '$lib/i18n/index.svelte';
</script>

<svelte:head>
  <title>{t('resPickupProtocol.meta_title')}</title>
  <meta name="description" content={t('resPickupProtocol.meta_description')} />
  <meta property="og:url" content="https://ethoz.cl/resources/pickup-protocol" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={t('resPickupProtocol.og_title')} />
  <meta property="og:description" content={t('resPickupProtocol.og_description')} />
  <link rel="canonical" href="https://ethoz.cl/resources/pickup-protocol" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": t('resPickupProtocol.schema_name'),
    "description": t('resPickupProtocol.schema_description'),
    "url": "https://ethoz.cl/resources/pickup-protocol",
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
        {t('resPickupProtocol.back_to_resources')}
      </Button>
      <Button href="/downloads/protocolo-retiros-seguros.pdf" download size="lg" class="gap-2">
        <Printer class="size-4" />
        {t('resPickupProtocol.download_pdf')}
      </Button>
    </div>
  </div>

  <div class="mx-auto max-w-7xl px-4 py-10 sm:py-14">
    <!-- Header -->
    <div class="mb-12 border-b border-border pb-10">
      <p class="flex flex-wrap items-center gap-x-3 gap-y-1 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground print:hidden">
        <span class="text-primary">{t('resPickupProtocol.eyebrow_category')}</span>
        <span aria-hidden="true" class="text-border">·</span>
        <span>{t('resPickupProtocol.eyebrow_steps')}</span>
        <span aria-hidden="true" class="text-border">·</span>
        <span>{t('resPickupProtocol.eyebrow_legal')}</span>
      </p>
      <span class="mt-5 block h-px w-12 bg-foreground print:hidden" aria-hidden="true"></span>
      <h1 class="mt-5 font-heading leading-[1.15] text-foreground">{t('resPickupProtocol.hero_title')}</h1>
      <p class="mt-6 max-w-[68ch] text-base leading-relaxed text-muted-foreground">{t('resPickupProtocol.hero_subtitle')}</p>
      <p class="mt-4 text-xs text-muted-foreground">{t('resPickupProtocol.version_line')}</p>
    </div>

    <div class="space-y-10 text-sm leading-relaxed text-foreground">

      <!-- 1. Objetivo -->
      <section>
        <h2 class="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <span class="flex size-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">1</span>
          {t('resPickupProtocol.s1_title')}
        </h2>
        <p class="text-muted-foreground">
          {t('resPickupProtocol.s1_body')}
        </p>
      </section>

      <!-- 2. Alcance -->
      <section>
        <h2 class="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <span class="flex size-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">2</span>
          {t('resPickupProtocol.s2_title')}
        </h2>
        <p class="text-muted-foreground mb-2">{t('resPickupProtocol.s2_intro')}</p>
        <ul class="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>{t('resPickupProtocol.s2_item1')}</li>
          <li>{t('resPickupProtocol.s2_item2')}</li>
          <li>{t('resPickupProtocol.s2_item3')}</li>
          <li>{t('resPickupProtocol.s2_item4')}</li>
        </ul>
      </section>

      <!-- 3. Responsables -->
      <section>
        <h2 class="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <span class="flex size-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">3</span>
          {t('resPickupProtocol.s3_title')}
        </h2>
        <div class="overflow-x-auto rounded-lg border border-border">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-border bg-muted/50">
                <th class="px-4 py-3 text-left font-medium text-foreground">{t('resPickupProtocol.s3_th_role')}</th>
                <th class="px-4 py-3 text-left font-medium text-foreground">{t('resPickupProtocol.s3_th_responsibility')}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr>
                <td class="px-4 py-3 font-medium">{t('resPickupProtocol.s3_role1')}</td>
                <td class="px-4 py-3 text-muted-foreground">{t('resPickupProtocol.s3_resp1')}</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-medium">{t('resPickupProtocol.s3_role2')}</td>
                <td class="px-4 py-3 text-muted-foreground">{t('resPickupProtocol.s3_resp2')}</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-medium">{t('resPickupProtocol.s3_role3')}</td>
                <td class="px-4 py-3 text-muted-foreground">{t('resPickupProtocol.s3_resp3')}</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-medium">{t('resPickupProtocol.s3_role4')}</td>
                <td class="px-4 py-3 text-muted-foreground">{t('resPickupProtocol.s3_resp4')}</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-medium">{t('resPickupProtocol.s3_role5')}</td>
                <td class="px-4 py-3 text-muted-foreground">{t('resPickupProtocol.s3_resp5')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- 4. Procedimiento -->
      <section>
        <h2 class="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <span class="flex size-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">4</span>
          {t('resPickupProtocol.s4_title')}
        </h2>
        <div class="space-y-4">
          {#each [
            { n: 1, titleKey: 'resPickupProtocol.s4_step1_title' as const, detailKey: 'resPickupProtocol.s4_step1_detail' as const },
            { n: 2, titleKey: 'resPickupProtocol.s4_step2_title' as const, detailKey: 'resPickupProtocol.s4_step2_detail' as const },
            { n: 3, titleKey: 'resPickupProtocol.s4_step3_title' as const, detailKey: 'resPickupProtocol.s4_step3_detail' as const },
            { n: 4, titleKey: 'resPickupProtocol.s4_step4_title' as const, detailKey: 'resPickupProtocol.s4_step4_detail' as const },
            { n: 5, titleKey: 'resPickupProtocol.s4_step5_title' as const, detailKey: 'resPickupProtocol.s4_step5_detail' as const },
            { n: 6, titleKey: 'resPickupProtocol.s4_step6_title' as const, detailKey: 'resPickupProtocol.s4_step6_detail' as const },
            { n: 7, titleKey: 'resPickupProtocol.s4_step7_title' as const, detailKey: 'resPickupProtocol.s4_step7_detail' as const },
            { n: 8, titleKey: 'resPickupProtocol.s4_step8_title' as const, detailKey: 'resPickupProtocol.s4_step8_detail' as const }
          ] as step}
            <div class="flex gap-4 rounded-xl border border-border bg-card p-4">
              <div class="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary-active text-xs font-bold mt-0.5">{step.n}</div>
              <div>
                <p class="font-medium text-foreground mb-1">{t(step.titleKey)}</p>
                <p class="text-muted-foreground text-sm">{t(step.detailKey)}</p>
              </div>
            </div>
          {/each}
        </div>
      </section>

      <!-- 5. Casos especiales -->
      <section>
        <h2 class="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <span class="flex size-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">5</span>
          {t('resPickupProtocol.s5_title')}
        </h2>
        <div class="space-y-4">
          <div class="rounded-lg border border-warning/20 bg-warning/10 p-4">
            <p class="font-medium text-warning-foreground mb-1">{t('resPickupProtocol.s5_case1_title')}</p>
            <p class="text-sm text-warning-foreground">{t('resPickupProtocol.s5_case1_body')}</p>
          </div>
          <div class="rounded-lg border border-destructive/20 bg-destructive/10   p-4">
            <p class="font-medium text-destructive mb-1">{t('resPickupProtocol.s5_case2_title')}</p>
            <p class="text-sm text-destructive">{t('resPickupProtocol.s5_case2_body')}</p>
          </div>
          <div class="rounded-xl border border-border bg-card p-4">
            <p class="font-medium text-foreground mb-1">{t('resPickupProtocol.s5_case3_title')}</p>
            <p class="text-sm text-muted-foreground">{t('resPickupProtocol.s5_case3_body')}</p>
          </div>
          <div class="rounded-lg border border-muted bg-muted/30 p-4">
            <p class="font-medium text-foreground mb-1">{t('resPickupProtocol.s5_case4_title')}</p>
            <p class="text-sm text-muted-foreground">{t('resPickupProtocol.s5_case4_body')}</p>
          </div>
        </div>
      </section>

      <!-- 6. Registro y trazabilidad -->
      <section>
        <h2 class="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <span class="flex size-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">6</span>
          {t('resPickupProtocol.s6_title')}
        </h2>
        <p class="text-muted-foreground mb-3">{t('resPickupProtocol.s6_intro')}</p>
        <div class="rounded-lg border border-border bg-muted/30 p-4">
          <ul class="space-y-1.5 text-muted-foreground">
            <li class="flex items-start gap-2"><span class="text-primary mt-0.5">→</span> {t('resPickupProtocol.s6_field1')}</li>
            <li class="flex items-start gap-2"><span class="text-primary mt-0.5">→</span> {t('resPickupProtocol.s6_field2')}</li>
            <li class="flex items-start gap-2"><span class="text-primary mt-0.5">→</span> {t('resPickupProtocol.s6_field3')}</li>
            <li class="flex items-start gap-2"><span class="text-primary mt-0.5">→</span> {t('resPickupProtocol.s6_field4')}</li>
            <li class="flex items-start gap-2"><span class="text-primary mt-0.5">→</span> {t('resPickupProtocol.s6_field5')}</li>
            <li class="flex items-start gap-2"><span class="text-primary mt-0.5">→</span> {t('resPickupProtocol.s6_field6')}</li>
            <li class="flex items-start gap-2"><span class="text-primary mt-0.5">→</span> {t('resPickupProtocol.s6_field7')}</li>
          </ul>
        </div>
        <p class="mt-3 text-xs text-muted-foreground">{t('resPickupProtocol.s6_note')}</p>
      </section>

      <!-- 7. Revisión anual -->
      <section>
        <h2 class="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <span class="flex size-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">7</span>
          {t('resPickupProtocol.s7_title')}
        </h2>
        <p class="text-muted-foreground mb-3">{t('resPickupProtocol.s7_intro')}</p>
        <ul class="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>{t('resPickupProtocol.s7_item1')}</li>
          <li>{t('resPickupProtocol.s7_item2')}</li>
          <li>{t('resPickupProtocol.s7_item3')}</li>
          <li>{t('resPickupProtocol.s7_item4')}</li>
          <li>{t('resPickupProtocol.s7_item5')}</li>
        </ul>
        <div class="mt-4 rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground">
          <p><strong class="text-foreground">{t('resPickupProtocol.s7_signoff_approval_date')}</strong> ___________________________</p>
          <p class="mt-1"><strong class="text-foreground">{t('resPickupProtocol.s7_signoff_director')}</strong> ___________________________</p>
          <p class="mt-1"><strong class="text-foreground">{t('resPickupProtocol.s7_signoff_inspector')}</strong> ___________________________</p>
          <p class="mt-1"><strong class="text-foreground">{t('resPickupProtocol.s7_signoff_next_review')}</strong> ___________________________</p>
        </div>
      </section>
    </div>

    <div class="print:hidden mt-10 text-center">
      <p class="text-sm text-muted-foreground mb-4">{t('resPickupProtocol.cta_text')}</p>
      <Button href="/demo">{t('resPickupProtocol.cta_button')}</Button>
    </div>
  </div>
</main>

<div class="print:hidden">
  <Footer />
</div>

<style>
  @media print {
    /* Print: force high-contrast B&W regardless of theme */
    :global(body) { font-size: 11px; color: black; background: white; }
    main { padding: 0; }
  }
</style>
