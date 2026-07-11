<script lang="ts">
  import { Cookie } from '@lucide/svelte';
  import { Button } from '$lib/components/ui/button';
  import Footer from '$lib/components/Footer.svelte';
  import NavBar from '$lib/components/NavBar.svelte';
  import { trackEvent } from '$lib/utils/analytics';
  import { t } from '$lib/i18n/index.svelte';

  const OPEN_CONSENT_PREFERENCES_EVENT = 'ethoz:open-consent-preferences';

  function openConsentPreferences() {
    window.dispatchEvent(new CustomEvent(OPEN_CONSENT_PREFERENCES_EVENT));
  }

  $effect(() => { trackEvent('privacy_viewed'); });
</script>

<svelte:head>
  <title>{t('privacy.meta.title')}</title>
  <meta name="description" content={t('privacy.meta.description')} />
  <meta property="og:url" content="https://ethoz.cl/privacidad" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={t('privacy.meta.og_title')} />
  <meta property="og:description" content={t('privacy.meta.description')} />
  <meta property="og:image" content="https://ethoz.cl/images/og-default.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={t('privacy.meta.og_title')} />
  <meta name="twitter:description" content={t('privacy.meta.description')} />
  <meta name="twitter:image" content="https://ethoz.cl/images/og-default.png" />
  <link rel="canonical" href="https://ethoz.cl/privacidad" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('privacy.breadcrumb.home'),
        item: 'https://ethoz.cl/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('privacy.breadcrumb.current'),
        item: 'https://ethoz.cl/privacidad'
      }
    ]
  })}</script>`}
</svelte:head>

<div class="flex min-h-dvh flex-col bg-background">
  <a
    href="#main-content"
    class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:border focus:border-foreground focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-foreground"
  >
    {t('nav.skip_to_content')}
  </a>
  <NavBar />

  <main id="main-content" class="flex-1">
    <article class="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8">
      <div class="max-w-4xl">
      <header class="max-w-3xl">
        <p class="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-primary">
          {t('privacy.eyebrow')}
        </p>
        <h1 class="mt-3 text-balance text-3xl font-bold text-foreground sm:text-4xl">
          {t('privacy.title')}
        </h1>
        <p class="mt-3 text-sm text-muted-foreground">{t('privacy.updated')}</p>
        <p class="mt-6 text-pretty text-base leading-relaxed text-muted-foreground">
          {t('privacy.intro')}
        </p>
      </header>

      <div class="mt-12 divide-y divide-hairline border-y border-border">
        <section class="py-8" aria-labelledby="privacy-scope">
          <h2 id="privacy-scope" class="text-xl font-bold text-foreground">
            {t('privacy.scope.title')}
          </h2>
          <div class="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>{t('privacy.scope.controller')}</p>
            <p>{t('privacy.scope.boundary')}</p>
          </div>
        </section>

        <section class="py-8" aria-labelledby="privacy-data">
          <h2 id="privacy-data" class="text-xl font-bold text-foreground">
            {t('privacy.data.title')}
          </h2>
          <p class="mt-4 text-sm leading-relaxed text-muted-foreground">{t('privacy.data.intro')}</p>
          <ul class="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>
              <strong class="text-foreground">{t('privacy.data.contact_label')}</strong>
              {t('privacy.data.contact_body')}
            </li>
            <li>
              <strong class="text-foreground">{t('privacy.data.school_label')}</strong>
              {t('privacy.data.school_body')}
            </li>
            <li>
              <strong class="text-foreground">{t('privacy.data.technical_label')}</strong>
              {t('privacy.data.technical_body')}
            </li>
            <li>
              <strong class="text-foreground">{t('privacy.data.preferences_label')}</strong>
              {t('privacy.data.preferences_body')}
            </li>
          </ul>
          <p class="mt-4 rounded-lg border border-border bg-surface-elevated p-4 text-sm leading-relaxed text-foreground">
            {t('privacy.data.student_notice')}
          </p>
        </section>

        <section class="py-8" aria-labelledby="privacy-purposes">
          <h2 id="privacy-purposes" class="text-xl font-bold text-foreground">
            {t('privacy.purposes.title')}
          </h2>
          <ul class="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>{t('privacy.purposes.forms')}</li>
            <li>{t('privacy.purposes.operation')}</li>
            <li>{t('privacy.purposes.analytics')}</li>
            <li>{t('privacy.purposes.marketing')}</li>
          </ul>
        </section>

        <section class="py-8" aria-labelledby="privacy-technologies">
          <h2 id="privacy-technologies" class="text-xl font-bold text-foreground">
            {t('privacy.technologies.title')}
          </h2>
          <div class="mt-5 space-y-6">
            <div>
              <h3 class="text-base font-semibold text-foreground">{t('privacy.technologies.essential_title')}</h3>
              <p class="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t('privacy.technologies.essential_body')}
              </p>
              <p class="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t('privacy.technologies.recaptcha_body')}
              </p>
            </div>
            <div>
              <h3 class="text-base font-semibold text-foreground">{t('privacy.technologies.analytics_title')}</h3>
              <p class="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t('privacy.technologies.analytics_body')}
              </p>
            </div>
            <div>
              <h3 class="text-base font-semibold text-foreground">{t('privacy.technologies.marketing_title')}</h3>
              <p class="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t('privacy.technologies.marketing_body')}
              </p>
            </div>
            <div>
              <h3 class="text-base font-semibold text-foreground">{t('privacy.technologies.scheduling_title')}</h3>
              <p class="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t('privacy.technologies.scheduling_body')}
              </p>
            </div>
          </div>
        </section>

        <section class="py-8" aria-labelledby="privacy-storage">
          <h2 id="privacy-storage" class="text-xl font-bold text-foreground">
            {t('privacy.storage.title')}
          </h2>
          <div class="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>{t('privacy.storage.local')}</p>
            <p>{t('privacy.storage.cookies')}</p>
            <p>{t('privacy.storage.retention')}</p>
          </div>
        </section>

        <section class="py-8" aria-labelledby="privacy-providers">
          <h2 id="privacy-providers" class="text-xl font-bold text-foreground">
            {t('privacy.providers.title')}
          </h2>
          <p class="mt-4 text-sm leading-relaxed text-muted-foreground">{t('privacy.providers.intro')}</p>
          <ul class="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            <li>
              <a class="font-medium text-primary underline-offset-4 hover:underline" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                {t('privacy.providers.google')}
              </a>
            </li>
            <li>
              <a class="font-medium text-primary underline-offset-4 hover:underline" href="https://privacy.microsoft.com/privacystatement" target="_blank" rel="noopener noreferrer">
                {t('privacy.providers.microsoft')}
              </a>
            </li>
            <li>
              <a class="font-medium text-primary underline-offset-4 hover:underline" href="https://sentry.io/privacy/" target="_blank" rel="noopener noreferrer">
                {t('privacy.providers.sentry')}
              </a>
            </li>
            <li>
              <a class="font-medium text-primary underline-offset-4 hover:underline" href="https://cal.com/privacy" target="_blank" rel="noopener noreferrer">
                {t('privacy.providers.cal')}
              </a>
            </li>
          </ul>
          <p class="mt-4 text-sm leading-relaxed text-muted-foreground">{t('privacy.providers.international')}</p>
        </section>

        <section class="py-8" aria-labelledby="privacy-preferences">
          <h2 id="privacy-preferences" class="text-xl font-bold text-foreground">
            {t('privacy.preferences.title')}
          </h2>
          <div class="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>{t('privacy.preferences.body')}</p>
            <p>{t('privacy.preferences.effect')}</p>
          </div>
          <Button variant="outline" class="mt-5" onclick={openConsentPreferences} aria-haspopup="dialog">
            <Cookie class="size-4" aria-hidden="true" />
            {t('privacy.preferences.open')}
          </Button>
        </section>

        <section class="py-8" aria-labelledby="privacy-rights">
          <h2 id="privacy-rights" class="text-xl font-bold text-foreground">
            {t('privacy.rights.title')}
          </h2>
          <p class="mt-4 text-sm leading-relaxed text-muted-foreground">{t('privacy.rights.body')}</p>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('privacy.rights.contact_prefix')}
            <a
              href={`mailto:${t('privacy.contact.email')}`}
              class="font-medium text-primary underline underline-offset-4 hover:text-primary-pressed"
            >{t('privacy.contact.email')}</a>.
          </p>
        </section>

        <section class="py-8" aria-labelledby="privacy-security">
          <h2 id="privacy-security" class="text-xl font-bold text-foreground">
            {t('privacy.security.title')}
          </h2>
          <p class="mt-4 text-sm leading-relaxed text-muted-foreground">{t('privacy.security.body')}</p>
        </section>

        <section class="py-8" aria-labelledby="privacy-changes">
          <h2 id="privacy-changes" class="text-xl font-bold text-foreground">
            {t('privacy.changes.title')}
          </h2>
          <p class="mt-4 text-sm leading-relaxed text-muted-foreground">{t('privacy.changes.body')}</p>
        </section>
      </div>
      </div>
    </article>
  </main>

  <Footer />
</div>
