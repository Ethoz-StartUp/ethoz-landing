<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Printer, ArrowLeft } from '@lucide/svelte';
  import { BRAND } from '$lib/brand';
  import { t } from '$lib/i18n/index.svelte';

  const sections = [
    {
      title: 'resComplianceChecklist.section_governance' as const,
      color: 'blue',
      items: [
        {
          title: 'resComplianceChecklist.gov_dpo_title' as const,
          detail: 'resComplianceChecklist.gov_dpo_detail' as const,
          article: 'Art. 48 Ley 21.719'
        },
        {
          title: 'resComplianceChecklist.gov_inventory_title' as const,
          detail: 'resComplianceChecklist.gov_inventory_detail' as const,
          article: 'Art. 16 Ley 21.719'
        },
        {
          title: 'resComplianceChecklist.gov_privacy_policy_title' as const,
          detail: 'resComplianceChecklist.gov_privacy_policy_detail' as const,
          article: 'Art. 14 Ley 21.719'
        },
        {
          title: 'resComplianceChecklist.gov_breach_plan_title' as const,
          detail: 'resComplianceChecklist.gov_breach_plan_detail' as const,
          article: 'Art. 30 Ley 21.719'
        }
      ]
    },
    {
      title: 'resComplianceChecklist.section_consent' as const,
      color: 'green',
      items: [
        {
          title: 'resComplianceChecklist.consent_sensitive_title' as const,
          detail: 'resComplianceChecklist.consent_sensitive_detail' as const,
          article: 'Art. 16 Ley 21.719'
        },
        {
          title: 'resComplianceChecklist.consent_minors_title' as const,
          detail: 'resComplianceChecklist.consent_minors_detail' as const,
          article: 'Art. 20 Ley 21.719'
        },
        {
          title: 'resComplianceChecklist.consent_renewal_title' as const,
          detail: 'resComplianceChecklist.consent_renewal_detail' as const,
          article: 'Art. 13 Ley 21.719'
        },
        {
          title: 'resComplianceChecklist.consent_withdrawal_title' as const,
          detail: 'resComplianceChecklist.consent_withdrawal_detail' as const,
          article: 'Art. 13 Ley 21.719'
        },
        {
          title: 'resComplianceChecklist.consent_records_title' as const,
          detail: 'resComplianceChecklist.consent_records_detail' as const,
          article: 'Art. 14 Ley 21.719'
        }
      ]
    },
    {
      title: 'resComplianceChecklist.section_technical_security' as const,
      color: 'warning',
      items: [
        {
          title: 'resComplianceChecklist.sec_encryption_rest_title' as const,
          detail: 'resComplianceChecklist.sec_encryption_rest_detail' as const,
          article: 'Art. 27 Ley 21.719'
        },
        {
          title: 'resComplianceChecklist.sec_encryption_transit_title' as const,
          detail: 'resComplianceChecklist.sec_encryption_transit_detail' as const,
          article: 'Art. 27 Ley 21.719'
        },
        {
          title: 'resComplianceChecklist.sec_access_control_title' as const,
          detail: 'resComplianceChecklist.sec_access_control_detail' as const,
          article: 'Art. 27 Ley 21.719'
        },
        {
          title: 'resComplianceChecklist.sec_audit_logs_title' as const,
          detail: 'resComplianceChecklist.sec_audit_logs_detail' as const,
          article: 'Art. 27 Ley 21.719'
        },
        {
          title: 'resComplianceChecklist.sec_backup_title' as const,
          detail: 'resComplianceChecklist.sec_backup_detail' as const,
          article: 'Art. 27 Ley 21.719'
        },
        {
          title: 'resComplianceChecklist.sec_incident_detection_title' as const,
          detail: 'resComplianceChecklist.sec_incident_detection_detail' as const,
          article: 'Art. 30 Ley 21.719'
        }
      ]
    },
    {
      title: 'resComplianceChecklist.section_data_subject_rights' as const,
      color: 'purple',
      items: [
        {
          title: 'resComplianceChecklist.rights_access_title' as const,
          detail: 'resComplianceChecklist.rights_access_detail' as const,
          article: 'Art. 35 Ley 21.719'
        },
        {
          title: 'resComplianceChecklist.rights_rectification_title' as const,
          detail: 'resComplianceChecklist.rights_rectification_detail' as const,
          article: 'Art. 36 Ley 21.719'
        },
        {
          title: 'resComplianceChecklist.rights_cancellation_title' as const,
          detail: 'resComplianceChecklist.rights_cancellation_detail' as const,
          article: 'Art. 37 Ley 21.719'
        },
        {
          title: 'resComplianceChecklist.rights_portability_title' as const,
          detail: 'resComplianceChecklist.rights_portability_detail' as const,
          article: 'Art. 38 Ley 21.719'
        },
        {
          title: 'resComplianceChecklist.rights_response_time_title' as const,
          detail: 'resComplianceChecklist.rights_response_time_detail' as const,
          article: 'Art. 40 Ley 21.719'
        }
      ]
    }
  ];

  const colorMap: Record<string, string> = {
    blue: 'bg-primary/10 text-primary-active',
    green: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning-foreground',
    purple: 'bg-primary/10 text-primary-active'
  };
</script>

<svelte:head>
  <title>{t('resComplianceChecklist.meta_title')}</title>
  <meta name="description" content={t('resComplianceChecklist.meta_description')} />
  <meta property="og:url" content="https://ethoz.cl/resources/compliance-checklist" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={t('resComplianceChecklist.og_title')} />
  <meta property="og:description" content={t('resComplianceChecklist.og_description')} />
  <link rel="canonical" href="https://ethoz.cl/resources/compliance-checklist" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Checklist de Cumplimiento Ley 21.719",
    "description": "20 ítems para verificar el cumplimiento de la Ley 21.719 en establecimientos educacionales chilenos.",
    "url": "https://ethoz.cl/resources/compliance-checklist",
    "publisher": { "@type": "Organization", "name": BRAND, "url": "https://ethoz.cl" }
  })}</script>`}
</svelte:head>

<div class="print:hidden">
  <NavBar />
</div>

<main class="min-h-dvh bg-background">
  <!-- Actions bar (hidden on print) -->
  <div class="print:hidden sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur-sm">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
      <Button href="/resources" variant="ghost" size="sm" class="gap-2 text-muted-foreground">
        <ArrowLeft class="size-4" />
        {t('resComplianceChecklist.back_to_resources')}
      </Button>
      <Button href="/downloads/checklist-cumplimiento-ley-21719.pdf" download size="lg" class="gap-2">
        <Printer class="size-4" />
        {t('resComplianceChecklist.download_pdf')}
      </Button>
    </div>
  </div>

  <div class="mx-auto max-w-7xl px-4 py-10 sm:py-14">
    <!-- Header -->
    <div class="mb-12 border-b border-border pb-10">
      <p class="flex flex-wrap items-center gap-x-3 gap-y-1 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground print:hidden">
        <span class="text-primary">{t('resComplianceChecklist.eyebrow_template')}</span>
        <span aria-hidden="true" class="text-border">·</span>
        <span>Ley 21.719</span>
        <span aria-hidden="true" class="text-border">·</span>
        <span>{t('resComplianceChecklist.eyebrow_count')}</span>
      </p>
      <span class="mt-5 block h-px w-12 bg-foreground print:hidden" aria-hidden="true"></span>
      <h1 class="mt-5 font-heading leading-[1.15] text-foreground">{t('resComplianceChecklist.hero_title')}</h1>
      <p class="mt-6 max-w-[68ch] text-base leading-relaxed text-muted-foreground">
        {t('resComplianceChecklist.hero_intro_pre')} <strong class="text-foreground">{t('resComplianceChecklist.hero_intro_date')}</strong>{t('resComplianceChecklist.hero_intro_post')}
      </p>
      <p class="mt-4 text-xs text-muted-foreground">{t('resComplianceChecklist.byline')}</p>
    </div>

    <!-- Sections -->
    <div class="space-y-10">
      {#each sections as section, si}
        <div>
          <div class="mb-4 flex items-center gap-3">
            <span class="flex size-7 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">{si + 1}</span>
            <h2 class="text-lg font-semibold text-foreground">{t(section.title)}</h2>
            <span class="ml-auto text-xs text-muted-foreground">{section.items.length} {t('resComplianceChecklist.items_label')}</span>
          </div>

          <div class="space-y-3">
            {#each section.items as item, ii}
              <div class="flex gap-4 rounded-xl border border-border bg-card p-4">
                <!-- Checkbox -->
                <div class="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border-2 border-border print:border-foreground/40">
                  <span class="hidden print:block text-xs">☐</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex flex-wrap items-start gap-2 mb-1">
                    <p class="font-medium text-foreground text-sm leading-snug">{t(item.title)}</p>
                    <span class="shrink-0 rounded bg-muted px-1.5 py-0.5 text-mockup-xs text-muted-foreground font-mono">{item.article}</span>
                  </div>
                  <p class="text-xs text-muted-foreground leading-relaxed">{t(item.detail)}</p>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>

    <!-- Footer note -->
    <div class="mt-12 rounded-xl border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
      <p class="font-medium text-foreground mb-1">{t('resComplianceChecklist.legal_note_title')}</p>
      <p>{t('resComplianceChecklist.legal_note_body')}</p>
    </div>

    <div class="print:hidden mt-6 text-center">
      <p class="text-sm text-muted-foreground mb-4">{t('resComplianceChecklist.cta_prompt')}</p>
      <Button href="/demo">{t('resComplianceChecklist.cta_button')}</Button>
    </div>
  </div>
</main>

<div class="print:hidden">
  <Footer />
</div>

<style>
  @media print {
    /* Print: force high-contrast B&W regardless of theme */
    :global(body) {
      font-size: 11px;
      color: black;
      background: white;
    }

    main {
      padding: 0;
    }
  }
</style>
