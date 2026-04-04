<script lang="ts">
  import { t, toggleLocale, getLocale } from '$lib/i18n/index.svelte';
  import { Globe } from '@lucide/svelte';

  let { mode = 'page' }: { mode?: 'landing' | 'page' } = $props();
</script>

<footer>
  <!-- Upper footer — links -->
  <div class="border-t border-border bg-background">
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="grid grid-cols-2 gap-6 sm:grid-cols-4">
        <div>
          <a href="/" class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="size-6" aria-hidden="true">
              <rect x="2" y="7" width="18" height="22" rx="4.5" fill="none" stroke="currentColor" stroke-width="2.2" class="text-foreground"/>
              <rect x="12" y="3" width="18" height="22" rx="4.5" fill="none" stroke="currentColor" stroke-width="2.2" class="text-primary"/>
            </svg>
            <span class="text-lg font-bold tracking-tight"><span class="text-foreground">Etho</span><span class="text-primary">z</span></span>
          </a>
          <p class="mt-2 text-xs leading-relaxed text-muted-foreground">
            {t('footer.tagline')}
          </p>
        </div>
        <div>
          <h4 class="text-xs font-semibold uppercase tracking-wider text-foreground">{t('footer.product')}</h4>
          <ul class="mt-2 flex flex-col gap-1.5">
            <li><a href="/compliance" class="text-xs text-muted-foreground transition-colors hover:text-foreground">{t('footer.compliance')}</a></li>
            <li><a href="/get-started" class="text-xs text-muted-foreground transition-colors hover:text-foreground">{t('footer.pricing')}</a></li>
            <li><a href="/blog" class="text-xs text-muted-foreground transition-colors hover:text-foreground">{t('footer.blog')}</a></li>
            <li><a href="/demo" class="text-xs text-muted-foreground transition-colors hover:text-foreground">{t('nav.cta')}</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-xs font-semibold uppercase tracking-wider text-foreground">{t('footer.company')}</h4>
          <ul class="mt-2 flex flex-col gap-1.5">
            <li><a href="/about" class="text-xs text-muted-foreground transition-colors hover:text-foreground">{t('footer.about')}</a></li>
            <li><a href="/contact" class="text-xs text-muted-foreground transition-colors hover:text-foreground">{t('footer.contact')}</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-xs font-semibold uppercase tracking-wider text-foreground">{t('footer.legal')}</h4>
          <ul class="mt-2 flex flex-col gap-1.5">
            <li><a href="/privacy" class="text-xs text-muted-foreground transition-colors hover:text-foreground">{t('footer.privacy')}</a></li>
            <li><a href="/terms" class="text-xs text-muted-foreground transition-colors hover:text-foreground">{t('footer.terms')}</a></li>
            <li><a href="https://www.bcn.cl/leychile/navegar?idNorma=1209272" target="_blank" rel="noopener noreferrer" class="text-xs text-muted-foreground transition-colors hover:text-foreground">{t('footer.law_21719')}</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- Lower footer — copyright + language (subtle darker tone) -->
  <div class="border-t border-border bg-secondary">
    <div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 sm:flex-row sm:px-6 lg:px-8">
      <p class="text-[11px] text-muted-foreground">{t('footer.rights')}</p>
      <button
        type="button"
        onclick={toggleLocale}
        class="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50"
      >
        <Globe class="size-3" />
        {getLocale() === 'es' ? 'English' : 'Español'}
      </button>
    </div>
  </div>
</footer>
