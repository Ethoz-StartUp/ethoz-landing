<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Printer, ArrowLeft } from '@lucide/svelte';
  import { BRAND } from '$lib/brand';
  import { t } from '$lib/i18n/index.svelte';

  const rights = [
    { rightKey: 'resPrivacyNotice.right_access_label' as const, descKey: 'resPrivacyNotice.right_access_desc' as const },
    { rightKey: 'resPrivacyNotice.right_rectification_label' as const, descKey: 'resPrivacyNotice.right_rectification_desc' as const },
    { rightKey: 'resPrivacyNotice.right_cancellation_label' as const, descKey: 'resPrivacyNotice.right_cancellation_desc' as const },
    { rightKey: 'resPrivacyNotice.right_opposition_label' as const, descKey: 'resPrivacyNotice.right_opposition_desc' as const },
    { rightKey: 'resPrivacyNotice.right_portability_label' as const, descKey: 'resPrivacyNotice.right_portability_desc' as const },
    { rightKey: 'resPrivacyNotice.right_revocation_label' as const, descKey: 'resPrivacyNotice.right_revocation_desc' as const }
  ];
</script>

<svelte:head>
  <title>{t('resPrivacyNotice.meta_title')}</title>
  <meta name="description" content={t('resPrivacyNotice.meta_description')} />
  <meta property="og:url" content="https://ethoz.cl/resources/privacy-notice" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={t('resPrivacyNotice.og_title')} />
  <meta property="og:description" content={t('resPrivacyNotice.og_description')} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={t('resPrivacyNotice.og_title')} />
  <meta name="twitter:description" content={t('resPrivacyNotice.og_description')} />
  <link rel="canonical" href="https://ethoz.cl/resources/privacy-notice" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LegalDocument",
    "name": t('resPrivacyNotice.og_title'),
    "description": t('resPrivacyNotice.meta_description'),
    "url": "https://ethoz.cl/resources/privacy-notice",
    "publisher": { "@type": "Organization", "name": BRAND, "url": "https://ethoz.cl" }
  })}</script>`}
</svelte:head>

<!-- Skip link — WCAG 2.4.1 Bypass Blocks -->
<a
  href="#main-content"
  class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:border focus:border-foreground focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-foreground"
>
  {t('nav.skip_to_content')}
</a>

<div class="print:hidden">
  <NavBar />
</div>

<main id="main-content" class="min-h-dvh bg-background">
  <div class="print:hidden sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur-sm">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
      <Button href="/resources" variant="ghost" size="sm" class="gap-2 text-muted-foreground">
        <ArrowLeft class="size-4" />
        {t('resPrivacyNotice.back_to_resources')}
      </Button>
      <Button href="/downloads/aviso-privacidad-escolar.pdf" download size="lg" class="gap-2">
        <Printer class="size-4" />
        {t('resPrivacyNotice.download_pdf')}
      </Button>
    </div>
  </div>

  <div class="mx-auto max-w-7xl px-4 py-10 sm:py-14">
    <div class="mb-12 border-b border-border pb-10">
      <p class="flex flex-wrap items-center gap-x-3 gap-y-1 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground print:hidden">
        <span class="text-primary">{t('resPrivacyNotice.eyebrow_category')}</span>
        <span aria-hidden="true" class="text-border">·</span>
        <span>{t('resPrivacyNotice.eyebrow_article')}</span>
        <span aria-hidden="true" class="text-border">·</span>
        <span>{t('resPrivacyNotice.eyebrow_sections')}</span>
      </p>
      <span class="mt-5 block h-px w-12 bg-foreground print:hidden" aria-hidden="true"></span>
      <h1 class="mt-5 font-heading leading-[1.15] text-foreground">{t('resPrivacyNotice.page_title')}</h1>
      <p class="mt-6 max-w-[68ch] text-base leading-relaxed text-muted-foreground">{t('resPrivacyNotice.intro_before_brackets')} <span class="font-medium text-primary">{t('resPrivacyNotice.intro_brackets')}</span> {t('resPrivacyNotice.intro_after_brackets')}</p>
      <p class="mt-4 text-xs text-muted-foreground">{t('resPrivacyNotice.attribution')}</p>
    </div>

    <!-- Document -->
    <div class="space-y-8 text-sm leading-relaxed">

      <!-- Header of document -->
      <div class="rounded-xl border-2 border-border bg-muted/20 p-6 text-center">
        <p class="text-xs uppercase tracking-widest text-muted-foreground mb-2">{t('resPrivacyNotice.doc_kicker')}</p>
        <h2 class="text-xl text-foreground">{t('resPrivacyNotice.doc_establishment_placeholder')}</h2>
        <p class="text-muted-foreground text-xs mt-1">{t('resPrivacyNotice.doc_rbd_rut')}</p>
        <p class="text-muted-foreground text-xs">{t('resPrivacyNotice.doc_address')}</p>
        <p class="text-xs text-muted-foreground mt-3">{t('resPrivacyNotice.doc_validity')}</p>
      </div>

      <section>
        <h3 class="font-semibold text-foreground mb-2">{t('resPrivacyNotice.s1_title')}</h3>
        <p class="text-muted-foreground">{t('resPrivacyNotice.s1_p_a')} <strong>{t('resPrivacyNotice.s1_ph_establishment')}</strong>{t('resPrivacyNotice.s1_p_b')} <strong>{t('resPrivacyNotice.s1_ph_rut')}</strong>{t('resPrivacyNotice.s1_p_c')} <strong>{t('resPrivacyNotice.s1_ph_address')}</strong>{t('resPrivacyNotice.s1_p_d')} <strong>{t('resPrivacyNotice.s1_ph_commune')}</strong>{t('resPrivacyNotice.s1_p_e')} <strong>{t('resPrivacyNotice.s1_ph_region')}</strong>{t('resPrivacyNotice.s1_p_f')} <strong>{t('resPrivacyNotice.s1_ph_email')}</strong>{t('resPrivacyNotice.s1_p_g')} <strong>{t('resPrivacyNotice.s1_ph_phone')}</strong>{t('resPrivacyNotice.s1_p_h')}</p>
      </section>

      <section>
        <h3 class="font-semibold text-foreground mb-2">{t('resPrivacyNotice.s2_title')}</h3>
        <p class="text-muted-foreground mb-3">{t('resPrivacyNotice.s2_intro')}</p>
        <ul class="space-y-2 text-muted-foreground">
          <li class="flex items-start gap-2"><span class="text-primary mt-0.5 shrink-0">a)</span> <span><strong>{t('resPrivacyNotice.s2_a_label')}</strong> {t('resPrivacyNotice.s2_a_desc')}</span></li>
          <li class="flex items-start gap-2"><span class="text-primary mt-0.5 shrink-0">b)</span> <span><strong>{t('resPrivacyNotice.s2_b_label')}</strong> {t('resPrivacyNotice.s2_b_desc')}</span></li>
          <li class="flex items-start gap-2"><span class="text-primary mt-0.5 shrink-0">c)</span> <span><strong>{t('resPrivacyNotice.s2_c_label')}</strong> {t('resPrivacyNotice.s2_c_desc')}</span></li>
          <li class="flex items-start gap-2"><span class="text-primary mt-0.5 shrink-0">d)</span> <span><strong>{t('resPrivacyNotice.s2_d_label')}</strong> {t('resPrivacyNotice.s2_d_desc')}</span></li>
          <li class="flex items-start gap-2"><span class="text-primary mt-0.5 shrink-0">e)</span> <span><strong>{t('resPrivacyNotice.s2_e_label')}</strong> {t('resPrivacyNotice.s2_e_desc')}</span></li>
          <li class="flex items-start gap-2"><span class="text-primary mt-0.5 shrink-0">f)</span> <span><strong>{t('resPrivacyNotice.s2_f_label')}</strong> {t('resPrivacyNotice.s2_f_desc')}</span></li>
        </ul>
      </section>

      <section>
        <h3 class="font-semibold text-foreground mb-2">{t('resPrivacyNotice.s3_title')}</h3>
        <p class="text-muted-foreground">{t('resPrivacyNotice.s3_intro')}</p>
        <ul class="mt-2 space-y-1.5 text-muted-foreground list-disc pl-6">
          <li><strong>{t('resPrivacyNotice.s3_a_label')}</strong> {t('resPrivacyNotice.s3_a_desc')}</li>
          <li><strong>{t('resPrivacyNotice.s3_b_label')}</strong> {t('resPrivacyNotice.s3_b_desc')}</li>
          <li><strong>{t('resPrivacyNotice.s3_c_label')}</strong> {t('resPrivacyNotice.s3_c_desc')}</li>
          <li><strong>{t('resPrivacyNotice.s3_d_label')}</strong> {t('resPrivacyNotice.s3_d_desc')}</li>
        </ul>
      </section>

      <section>
        <h3 class="font-semibold text-foreground mb-2">{t('resPrivacyNotice.s4_title')}</h3>
        <div class="overflow-x-auto rounded-xl border border-border">
          <table class="w-full min-w-[480px] text-sm">
            <thead>
              <tr class="border-b border-border bg-muted/50">
                <th class="whitespace-nowrap px-4 py-2.5 text-left font-medium">{t('resPrivacyNotice.s4_col_category')}</th>
                <th class="whitespace-nowrap px-4 py-2.5 text-left font-medium">{t('resPrivacyNotice.s4_col_examples')}</th>
                <th class="whitespace-nowrap px-4 py-2.5 text-left font-medium">{t('resPrivacyNotice.s4_col_sensitive')}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border text-muted-foreground">
              <tr><td class="px-4 py-2.5">{t('resPrivacyNotice.s4_r1_cat')}</td><td class="px-4 py-2.5">{t('resPrivacyNotice.s4_r1_ex')}</td><td class="px-4 py-2.5">{t('resPrivacyNotice.s4_sensitive_no')}</td></tr>
              <tr><td class="px-4 py-2.5">{t('resPrivacyNotice.s4_r2_cat')}</td><td class="px-4 py-2.5">{t('resPrivacyNotice.s4_r2_ex')}</td><td class="px-4 py-2.5">{t('resPrivacyNotice.s4_sensitive_no')}</td></tr>
              <tr><td class="px-4 py-2.5">{t('resPrivacyNotice.s4_r3_cat')}</td><td class="px-4 py-2.5">{t('resPrivacyNotice.s4_r3_ex')}</td><td class="px-4 py-2.5">{t('resPrivacyNotice.s4_sensitive_no')}</td></tr>
              <tr><td class="px-4 py-2.5">{t('resPrivacyNotice.s4_r4_cat')}</td><td class="px-4 py-2.5">{t('resPrivacyNotice.s4_r4_ex')}</td><td class="px-4 py-2.5"><span class="text-warning-foreground font-medium">{t('resPrivacyNotice.s4_sensitive_yes')}</span></td></tr>
              <tr><td class="px-4 py-2.5">{t('resPrivacyNotice.s4_r5_cat')}</td><td class="px-4 py-2.5">{t('resPrivacyNotice.s4_r5_ex')}</td><td class="px-4 py-2.5">{t('resPrivacyNotice.s4_sensitive_partial')}</td></tr>
              <tr><td class="px-4 py-2.5">{t('resPrivacyNotice.s4_r6_cat')}</td><td class="px-4 py-2.5">{t('resPrivacyNotice.s4_r6_ex')}</td><td class="px-4 py-2.5">{t('resPrivacyNotice.s4_sensitive_no')}</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 class="font-semibold text-foreground mb-2">{t('resPrivacyNotice.s5_title')}</h3>
        <p class="text-muted-foreground mb-2">{t('resPrivacyNotice.s5_intro')}</p>
        <ul class="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>{t('resPrivacyNotice.s5_item1')}</li>
          <li>{t('resPrivacyNotice.s5_item2')}</li>
          <li>{t('resPrivacyNotice.s5_item3')}</li>
          <li>{t('resPrivacyNotice.s5_item4')}</li>
          <li><strong>{t('resPrivacyNotice.s5_item5_ph')}</strong>{t('resPrivacyNotice.s5_item5_rest')}</li>
        </ul>
      </section>

      <section>
        <h3 class="font-semibold text-foreground mb-2">{t('resPrivacyNotice.s6_title')}</h3>
        <p class="text-muted-foreground">
          {t('resPrivacyNotice.s6_option_a')}<br/>
          {t('resPrivacyNotice.s6_option_b')}
        </p>
      </section>

      <section>
        <h3 class="font-semibold text-foreground mb-2">{t('resPrivacyNotice.s7_title')}</h3>
        <p class="text-muted-foreground">{t('resPrivacyNotice.s7_intro')}</p>
        <ul class="mt-2 list-disc pl-6 space-y-1 text-muted-foreground">
          <li>{t('resPrivacyNotice.s7_item1_pre')} <strong>{t('resPrivacyNotice.s7_item1_strong')}</strong> {t('resPrivacyNotice.s7_item1_post')}</li>
          <li>{t('resPrivacyNotice.s7_item2_pre')} <strong>{t('resPrivacyNotice.s7_item2_strong')}</strong> {t('resPrivacyNotice.s7_item2_post')}</li>
          <li>{t('resPrivacyNotice.s7_item3_pre')} <strong>{t('resPrivacyNotice.s7_item3_strong')}</strong> {t('resPrivacyNotice.s7_item3_post')}</li>
          <li>{t('resPrivacyNotice.s7_item4')}</li>
        </ul>
      </section>

      <section>
        <h3 class="font-semibold text-foreground mb-2">{t('resPrivacyNotice.s8_title')}</h3>
        <p class="text-muted-foreground mb-3">{t('resPrivacyNotice.s8_intro')}</p>
        <div class="grid gap-3 sm:grid-cols-2">
          {#each rights as r}
            <div class="rounded-xl border border-border bg-card p-3">
              <p class="font-medium text-foreground text-xs mb-1">{t(r.rightKey)}</p>
              <p class="text-xs text-muted-foreground">{t(r.descKey)}</p>
            </div>
          {/each}
        </div>
      </section>

      <section>
        <h3 class="font-semibold text-foreground mb-2">{t('resPrivacyNotice.s9_title')}</h3>
        <p class="text-muted-foreground">{t('resPrivacyNotice.s9_intro')}</p>
        <ul class="mt-2 list-disc pl-6 space-y-1 text-muted-foreground">
          <li>{t('resPrivacyNotice.s9_item1_pre')} <strong>{t('resPrivacyNotice.s9_item1_ph')}</strong> {t('resPrivacyNotice.s9_item1_post')}</li>
          <li>{t('resPrivacyNotice.s9_item2')}</li>
          <li>{t('resPrivacyNotice.s9_item3_pre')} <strong>{t('resPrivacyNotice.s9_item3_ph')}</strong></li>
        </ul>
        <p class="mt-3 text-muted-foreground">{t('resPrivacyNotice.s9_response_pre')} <strong>{t('resPrivacyNotice.s9_response_strong')}</strong> {t('resPrivacyNotice.s9_response_post')}</p>
      </section>

      <section>
        <h3 class="font-semibold text-foreground mb-2">{t('resPrivacyNotice.s10_title')}</h3>
        <div class="rounded-xl border border-border bg-card p-4 text-muted-foreground">
          <p><strong class="text-foreground">{t('resPrivacyNotice.s10_name_label')}</strong> {t('resPrivacyNotice.s10_name_ph')}</p>
          <p><strong class="text-foreground">{t('resPrivacyNotice.s10_email_label')}</strong> {t('resPrivacyNotice.s10_email_ph')}</p>
          <p><strong class="text-foreground">{t('resPrivacyNotice.s10_phone_label')}</strong> {t('resPrivacyNotice.s10_phone_ph')}</p>
          <p class="mt-2 text-xs">{t('resPrivacyNotice.s10_complaint_pre')} <strong>{t('resPrivacyNotice.s10_complaint_strong')}</strong> {t('resPrivacyNotice.s10_complaint_post')}</p>
        </div>
      </section>

    </div>

    <div class="print:hidden mt-10 text-center">
      <p class="text-sm text-muted-foreground mb-4">{t('resPrivacyNotice.cta_text')}</p>
      <Button href="/demo">{t('resPrivacyNotice.cta_button')}</Button>
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
