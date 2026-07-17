<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import EditorialSection from '$lib/components/EditorialSection.svelte';
  import { t } from '$lib/i18n/index.svelte';
  import { BRAND } from '$lib/brand';
  import { Button } from '$lib/components/ui/button';
  import {
    Shield, ArrowRight, ArrowLeft, Building2, KeyRound, Users,
    BadgeCheck, CheckCircle, AlertTriangle, Clock, FileText, Lock,
    Eye, Download, Trash2, RefreshCw
  } from '@lucide/svelte';
  import { trackEvent } from '$lib/utils/analytics';

  $effect(() => { trackEvent('feature_page_viewed', { feature: 'privacy-compliance' }); });

  const auditLog = [
    { userKey: 'featurePage.privacyCompliance.audit_user_gonzalez' as const, actionKey: 'featurePage.privacyCompliance.audit_action_accessed_profile' as const, timeKey: 'featurePage.privacyCompliance.audit_time_12min' as const, icon: Eye, color: 'text-muted-foreground' },
    { userKey: 'featurePage.privacyCompliance.audit_user_munoz' as const, actionKey: 'featurePage.privacyCompliance.audit_action_registered_pickup' as const, timeKey: 'featurePage.privacyCompliance.audit_time_1h' as const, icon: CheckCircle, color: 'text-success' },
    { userKey: 'featurePage.privacyCompliance.audit_user_lagos' as const, actionKey: 'featurePage.privacyCompliance.audit_action_created_note' as const, timeKey: 'featurePage.privacyCompliance.audit_time_3h' as const, icon: FileText, color: 'text-primary' },
    { userKey: 'featurePage.privacyCompliance.audit_user_herrera' as const, actionKey: 'featurePage.privacyCompliance.audit_action_exported_report' as const, timeKey: 'featurePage.privacyCompliance.audit_time_5h' as const, icon: Download, color: 'text-primary' },
    { userKey: 'featurePage.privacyCompliance.audit_user_system' as const, actionKey: 'featurePage.privacyCompliance.audit_action_backup_done' as const, timeKey: 'featurePage.privacyCompliance.audit_time_6h' as const, icon: Lock, color: 'text-success' },
  ];

  const dataInventory = [
    { categoryKey: 'featurePage.privacyCompliance.inventory.cat_identification' as const, itemsKey: 'featurePage.privacyCompliance.inventory.items_identification' as const, law: 'Art. 4', level: 'basic', levelKey: 'featurePage.privacyCompliance.inventory.level_basic' as const },
    { categoryKey: 'featurePage.privacyCompliance.inventory.cat_family_contact' as const, itemsKey: 'featurePage.privacyCompliance.inventory.items_family_contact' as const, law: 'Art. 4', level: 'basic', levelKey: 'featurePage.privacyCompliance.inventory.level_basic' as const },
    { categoryKey: 'featurePage.privacyCompliance.inventory.cat_medical' as const, itemsKey: 'featurePage.privacyCompliance.inventory.items_medical' as const, law: 'Art. 16', level: 'sensitive', levelKey: 'featurePage.privacyCompliance.inventory.level_sensitive' as const },
    { categoryKey: 'featurePage.privacyCompliance.inventory.cat_judicial' as const, itemsKey: 'featurePage.privacyCompliance.inventory.items_judicial' as const, law: 'Art. 16', level: 'sensitive', levelKey: 'featurePage.privacyCompliance.inventory.level_sensitive' as const },
    { categoryKey: 'featurePage.privacyCompliance.inventory.cat_attendance' as const, itemsKey: 'featurePage.privacyCompliance.inventory.items_attendance' as const, law: 'Art. 4', level: 'basic', levelKey: 'featurePage.privacyCompliance.inventory.level_basic' as const },
    { categoryKey: 'featurePage.privacyCompliance.inventory.cat_conduct' as const, itemsKey: 'featurePage.privacyCompliance.inventory.items_conduct' as const, law: 'Art. 16', level: 'confidential', levelKey: 'featurePage.privacyCompliance.inventory.level_confidential' as const },
  ];
</script>

<svelte:head>
  <title>{BRAND} · {t('features.privacy.title')}</title>
  <meta name="description" content={t('featurePage.privacyCompliance.meta.description')} />
  <meta property="og:url" content="https://ethoz.cl/funcionalidades/privacidad-datos" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={t('featurePage.privacyCompliance.meta.og_title')} />
  <meta property="og:description" content={t('featurePage.privacyCompliance.meta.description')} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={t('featurePage.privacyCompliance.meta.og_title')} />
  <meta name="twitter:description" content={t('featurePage.privacyCompliance.meta.description')} />
  <link rel="canonical" href="https://ethoz.cl/funcionalidades/privacidad-datos" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Productos","item":"https://ethoz.cl/productos"},{"@type":"ListItem","position":3,"name":"Privacidad y Cumplimiento"}]})}</script>`}
</svelte:head>

<div class="flex min-h-dvh flex-col bg-background">
  <!-- Skip link — WCAG 2.4.1 Bypass Blocks -->
  <a
    href="#main-content"
    class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:border focus:border-foreground focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-foreground"
  >
    {t('nav.skip_to_content')}
  </a>
  <NavBar />

  <main id="main-content" class="flex-1">

  <!-- Hero -->
  <section class="bg-secondary pt-24 pb-8 sm:pt-28 sm:pb-10">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <a href="/#features" class="-mt-3 mb-5 inline-flex min-h-11 items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft class="size-3.5" />
        {t('featurePage.privacyCompliance.hero.back_link')}
      </a>
      <div class="mt-6 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <div class="lg:pt-4">
          <div class="flex items-center gap-4">
            <Shield class="size-10 lg:size-12 shrink-0 text-primary-active" />
            <h1 class="page-title">
              {t('features.privacy.title')}
            </h1>
          </div>
          <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
            {t('features.privacy.desc')}
          </p>
          <!-- Urgency callout -->
          <div class="mt-5 rounded-xl border border-warning/30 bg-warning/5 p-4">
            <div class="flex items-start gap-2.5">
              <AlertTriangle class="mt-0.5 size-4 shrink-0 text-warning-foreground" />
              <div>
                <p class="text-sm font-semibold text-foreground">{t('featurePage.privacyCompliance.urgency.title')}</p>
                <p class="mt-1 text-xs leading-relaxed text-muted-foreground">{t('featurePage.privacyCompliance.urgency.body')}</p>
              </div>
            </div>
          </div>
          <ul class="mt-5 space-y-3">
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              {t('featurePage.privacyCompliance.hero.bullet_1')}
            </li>
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              {t('featurePage.privacyCompliance.hero.bullet_2')}
            </li>
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              {t('featurePage.privacyCompliance.hero.bullet_3')}
            </li>
          </ul>
        </div>

        <!-- Compliance dashboard mockup -->
        <div aria-hidden="true" class="w-full rounded-xl border border-border bg-card shadow-card-dark-hover">
          <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <div class="size-2.5 rounded-full bg-destructive/60"></div>
            <div class="size-2.5 rounded-full bg-warning/60"></div>
            <div class="size-2.5 rounded-full bg-success/60"></div>
            <span class="ml-2 text-mockup-sm font-medium text-muted-foreground">{t('featurePage.privacyCompliance.dashboard.chrome_label')}</span>
          </div>
          <div class="p-4 sm:p-5">
            <!-- KPI row -->
            <div class="grid grid-cols-3 gap-2 mb-4">
              <div class="rounded-lg bg-success/5 border border-success/20 px-2.5 py-2.5 text-center">
                <p class="text-xl font-bold text-success">98%</p>
                <p class="text-mockup-2xs text-muted-foreground leading-tight mt-0.5">{t('featurePage.privacyCompliance.dashboard.kpi_consents')}</p>
              </div>
              <div class="rounded-lg bg-success/5 border border-success/20 px-2.5 py-2.5 text-center">
                <p class="text-xl font-bold text-success">0</p>
                <p class="text-mockup-2xs text-muted-foreground leading-tight mt-0.5">{t('featurePage.privacyCompliance.dashboard.kpi_irregular_access')}</p>
              </div>
              <div class="rounded-lg bg-warning/5 border border-warning/20 px-2.5 py-2.5 text-center">
                <p class="text-xl font-bold text-warning-foreground">1</p>
                <p class="text-mockup-2xs text-muted-foreground leading-tight mt-0.5">{t('featurePage.privacyCompliance.dashboard.kpi_arco_pending')}</p>
              </div>
            </div>

            <!-- Consent pending -->
            <div class="rounded-lg border border-warning/20 bg-warning/5 px-3 py-2 mb-3 flex items-center gap-2">
              <AlertTriangle class="size-3.5 shrink-0 text-warning-foreground" />
              <div class="flex-1 min-w-0">
                <p class="text-mockup-xs font-semibold text-warning-foreground">{t('featurePage.privacyCompliance.dashboard.consent_pending_title')}</p>
                <p class="text-mockup-2xs text-muted-foreground">{t('featurePage.privacyCompliance.dashboard.consent_pending_body')}</p>
              </div>
            </div>

            <!-- Audit log -->
            <p class="text-mockup-2xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{t('featurePage.privacyCompliance.dashboard.audit_log_heading')}</p>
            <div class="space-y-1.5">
              {#each auditLog.slice(0, 3) as entry}
                <div class="flex items-center gap-2 text-mockup-xs">
                  <div class="size-5 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <entry.icon class="size-2.5 {entry.color}" />
                  </div>
                  <span class="flex-1 text-muted-foreground truncate">{t(entry.userKey)} · {t(entry.actionKey)}</span>
                  <span class="text-mockup-2xs text-muted-foreground shrink-0">{t(entry.timeKey)}</span>
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Editorial anchor — privacy-by-design thesis -->
  <EditorialSection
    id="privacy-editorial"
    eyebrow={t('featurePage.privacyCompliance.editorial.eyebrow')}
    statement={t('featurePage.privacyCompliance.editorial.statement')}
    body={t('featurePage.privacyCompliance.editorial.body')}
  />

  <!-- Data inventory section -->
  <section class="py-10 sm:py-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <p class="mb-2 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-primary">{t('featurePage.privacyCompliance.inventory.eyebrow')}</p>
      <h2 class="mb-2 text-xl text-foreground sm:text-2xl">{t('featurePage.privacyCompliance.inventory.heading')}</h2>
      <p class="mb-8 text-sm leading-relaxed text-muted-foreground max-w-2xl">
        {t('featurePage.privacyCompliance.inventory.intro')}
      </p>
      <div class="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[28rem] text-sm">
            <thead>
              <tr class="border-b border-border bg-muted/30">
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">{t('featurePage.privacyCompliance.inventory.th_category')}</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap hidden sm:table-cell">{t('featurePage.privacyCompliance.inventory.th_data')}</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">{t('featurePage.privacyCompliance.inventory.th_legal_basis')}</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">{t('featurePage.privacyCompliance.inventory.th_level')}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              {#each dataInventory as row}
                <tr class="hover:bg-muted transition-colors">
                  <td class="px-4 py-3 text-sm font-medium text-foreground whitespace-nowrap">{t(row.categoryKey)}</td>
                  <td class="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">{t(row.itemsKey)}</td>
                  <td class="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{row.law}</td>
                  <td class="px-4 py-3">
                    <span class="inline-flex items-center rounded-full px-2 py-0.5 text-mockup-xs font-semibold {
                      row.level === 'sensitive' ? 'bg-destructive/10 text-destructive' :
                      row.level === 'confidential' ? 'bg-warning/10 text-warning-foreground' :
                      'bg-muted text-muted-foreground'
                    }">
                      {t(row.levelKey)}
                    </span>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
        <div class="border-t border-border px-4 py-2.5 bg-muted/20">
          <p class="text-mockup-xs text-muted-foreground">{t('featurePage.privacyCompliance.inventory.footer_caption')}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ARCO+P rights section -->
  <section class="bg-secondary py-10 sm:py-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 class="mb-2 text-xl text-foreground sm:text-2xl">{t('featurePage.privacyCompliance.arco.heading')}</h2>
      <p class="mb-8 text-sm leading-relaxed text-muted-foreground max-w-2xl">
        {t('featurePage.privacyCompliance.arco.intro')}
      </p>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {#each [
          { letter: 'A', rightKey: 'featurePage.privacyCompliance.arco.right_access' as const, descKey: 'featurePage.privacyCompliance.arco.desc_access' as const },
          { letter: 'R', rightKey: 'featurePage.privacyCompliance.arco.right_rectification' as const, descKey: 'featurePage.privacyCompliance.arco.desc_rectification' as const },
          { letter: 'C', rightKey: 'featurePage.privacyCompliance.arco.right_cancellation' as const, descKey: 'featurePage.privacyCompliance.arco.desc_cancellation' as const },
          { letter: 'O', rightKey: 'featurePage.privacyCompliance.arco.right_opposition' as const, descKey: 'featurePage.privacyCompliance.arco.desc_opposition' as const },
          { letter: 'P', rightKey: 'featurePage.privacyCompliance.arco.right_portability' as const, descKey: 'featurePage.privacyCompliance.arco.desc_portability' as const },
        ] as item}
          <div class="group rounded-xl border border-border bg-card p-4 text-center transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] shadow-card-dark hover:shadow-card-dark-hover">
            <span class="font-heading block text-4xl tabular-nums leading-none text-primary transition-colors group-hover:text-foreground">{item.letter}</span>
            <p class="mt-3 text-sm font-semibold text-foreground">{t(item.rightKey)}</p>
            <p class="mt-1 text-mockup-sm leading-relaxed text-muted-foreground">{t(item.descKey)}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Detail cards -->
  <section class="py-10 sm:py-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

        <div class="group rounded-xl border border-border bg-card p-6 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] shadow-card-dark hover:shadow-card-dark-hover">
          <div class="flex items-center gap-2.5">
            <Building2 class="size-5 shrink-0 text-primary" />
            <h2 class="text-base text-foreground">{t('featurePage.privacyCompliance.cards.isolation_title')}</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.privacy.bullet1')}
          </p>
        </div>

        <div class="group rounded-xl border border-border bg-card p-6 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] shadow-card-dark hover:shadow-card-dark-hover">
          <div class="flex items-center gap-2.5">
            <KeyRound class="size-5 shrink-0 text-primary" />
            <h2 class="text-base text-foreground">{t('featurePage.privacyCompliance.cards.encryption_title')}</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.privacy.bullet2')}
          </p>
        </div>

        <div class="group rounded-xl border border-border bg-card p-6 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] shadow-card-dark hover:shadow-card-dark-hover">
          <div class="flex items-center gap-2.5">
            <Users class="size-5 shrink-0 text-primary" />
            <h2 class="text-base text-foreground">{t('featurePage.privacyCompliance.cards.consent_title')}</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.privacy.bullet3')}
          </p>
        </div>

      </div>
    </div>
  </section>

  <!-- Final CTA — dark navy editorial close with deadline footnote -->
  <section class="bg-secondary py-20 text-foreground sm:py-24" aria-labelledby="privacy-cta">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <span class="mx-auto block h-px w-12 bg-foreground/60" aria-hidden="true"></span>
      <p class="mt-6 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-foreground/85">{t('featurePage.privacyCompliance.finalCta.eyebrow')}</p>
      <h2 id="privacy-cta" class="mt-5 font-heading text-3xl leading-[1.1] text-foreground sm:text-4xl">
        {t('featurePage.privacyCompliance.finalCta.title')}
      </h2>
      <p class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-foreground/80">
        {t('featurePage.privacyCompliance.finalCta.subtitle')}
      </p>
      <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href="/demo"
          class="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-gradient-to-b from-primary to-primary-hover px-8 text-sm font-semibold text-cta-text transition-colors hover:from-primary-hover hover:to-primary-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {t('featurePage.privacyCompliance.finalCta.cta_primary')}
          <ArrowRight class="size-4" />
        </a>
        <a
          href="/ley-21719"
          class="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-foreground/20 bg-transparent px-8 text-sm font-semibold text-foreground transition-colors hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {t('featurePage.privacyCompliance.finalCta.cta_secondary')}
        </a>
      </div>
      <p class="mt-8 text-xs text-foreground/80">
        {t('featurePage.privacyCompliance.finalCta.footnote')}
      </p>
    </div>
  </section>
  </main>

  <Footer />
</div>
