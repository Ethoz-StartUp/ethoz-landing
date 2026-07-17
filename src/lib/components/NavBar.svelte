<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { t } from '$lib/i18n/index.svelte';
  import { Menu, X, ChevronDown, Shield, Search, ClipboardList, Bell, Fingerprint, Sparkles } from '@lucide/svelte';
  import { env } from '$env/dynamic/public';
  import { tick } from 'svelte';
  import { slide } from 'svelte/transition';
  import { page } from '$app/state';

  let mobileOpen = $state(false);
  let mobileProductsOpen = $state(false);
  let productsOpen = $state(false);
  let productsTimeout: ReturnType<typeof setTimeout>;
  let _scrolled = $state(false);
  let ribbonVisible = $state(true);
  let navHeight = $state(0);
  let mobileMenu = $state<HTMLElement | null>(null);
  let mobileToggle = $state<HTMLButtonElement | null>(null);
  let productsContainer = $state<HTMLElement | null>(null);
  let productsTrigger = $state<HTMLButtonElement | null>(null);
  let productsMenu = $state<HTMLElement | null>(null);

  $effect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('overflow-hidden', mobileOpen);
      document.documentElement.classList.toggle('overflow-hidden', mobileOpen);
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.classList.remove('overflow-hidden');
        document.documentElement.classList.remove('overflow-hidden');
      }
    };
  });

  $effect(() => {
    if (typeof window === 'undefined') return;
    let lastScrollY = Math.max(window.scrollY, 0);
    let scrollFrame = 0;

    const updateHeader = () => {
      const currentScrollY = Math.max(window.scrollY, 0);
      _scrolled = currentScrollY > 4;

      if (!mobileOpen) {
        if (currentScrollY <= 24) {
          ribbonVisible = true;
        } else if (currentScrollY > lastScrollY + 2 && currentScrollY > 96) {
          ribbonVisible = false;
        } else if (currentScrollY < lastScrollY - 2) {
          ribbonVisible = true;
        }
      }

      lastScrollY = currentScrollY;
      scrollFrame = 0;
    };

    const onScroll = () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateHeader);
    };

    updateHeader();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
    };
  });

  $effect(() => {
    if (typeof window === 'undefined') return;
    const desktopViewport = window.matchMedia('(min-width: 64rem)');
    const closeAtDesktop = () => {
      if (desktopViewport.matches && mobileOpen) closeMobileMenu(false);
    };
    desktopViewport.addEventListener('change', closeAtDesktop);
    return () => desktopViewport.removeEventListener('change', closeAtDesktop);
  });

  const products = [
    { icon: Sparkles, name: 'nav.product_actas_name' as const, href: '/funcionalidades/actas-y-descargos', desc: 'nav.product_actas_desc' as const },
    { icon: ClipboardList, name: 'nav.product_student_profile_name' as const, href: '/funcionalidades/ficha-alumno', desc: 'nav.product_student_profile_desc' as const },
    { icon: Bell, name: 'nav.product_safe_pickups_name' as const, href: '/funcionalidades/retiros-seguros', desc: 'nav.product_safe_pickups_desc' as const },
    { icon: Fingerprint, name: 'nav.product_access_control_name' as const, href: '/funcionalidades/acceso-por-rol', desc: 'nav.product_access_control_desc' as const },
    { icon: Search, name: 'nav.product_smart_search_name' as const, href: '/funcionalidades/busqueda-contextual', desc: 'nav.product_smart_search_desc' as const },
    { icon: Shield, name: 'nav.product_privacy_compliance_name' as const, href: '/funcionalidades/privacidad-datos', desc: 'nav.product_privacy_compliance_desc' as const },
  ];

  const navLinksBefore = [
    { key: 'nav.about' as const, href: '/nosotros' },
    { key: 'nav.pricing' as const, href: '/como-contratar' },
  ];
  const navLinksAfter = [
    { key: 'nav.integrations' as const, href: '/integraciones' },
    { key: 'nav.blog' as const, href: '/blog' },
    { key: 'nav.contact' as const, href: '/contacto' },
  ];

  function isActive(href: string): boolean {
    const path = page.url.pathname;
    if (href === '/') return path === '/';
    return path.startsWith(href);
  }

  function isProductActive(): boolean {
    const path = page.url.pathname;
    return path.startsWith('/funcionalidades') || path === '/cumplimiento' || path === '/productos';
  }

  function openProducts() {
    clearTimeout(productsTimeout);
    productsOpen = true;
  }

  function closeProducts() {
    productsTimeout = setTimeout(() => {
      if (!productsContainer?.contains(document.activeElement)) productsOpen = false;
    }, 150);
  }

  async function focusFirstProduct() {
    productsOpen = true;
    await tick();
    productsMenu?.querySelector<HTMLAnchorElement>('a[href]')?.focus();
  }

  function handleProductsTriggerClick(event: MouseEvent) {
    clearTimeout(productsTimeout);
    productsOpen = event.detail === 0 ? !productsOpen : true;
  }

  function handleProductsTriggerKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      void focusFirstProduct();
    }
  }

  function handleProductsKeydown(event: KeyboardEvent) {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    productsOpen = false;
    productsTrigger?.focus();
  }

  async function openMobileMenu() {
    productsOpen = false;
    mobileOpen = true;
    await tick();
    mobileMenu?.querySelector<HTMLAnchorElement>('a[href]')?.focus();
  }

  function closeMobileMenu(restoreFocus = true) {
    mobileOpen = false;
    mobileProductsOpen = false;
    if (restoreFocus && typeof window !== 'undefined') {
      window.requestAnimationFrame(() => mobileToggle?.focus());
    }
  }

  function toggleMobileMenu() {
    if (mobileOpen) closeMobileMenu();
    else void openMobileMenu();
  }

  function handleMobileMenuKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      closeMobileMenu();
      return;
    }

    if (event.key !== 'Tab' || !mobileMenu) return;
    const focusable = Array.from(
      mobileMenu.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || !mobileMenu.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function handleWindowKeydown(e: KeyboardEvent) {
    if (e.key !== 'Escape') return;
    if (mobileOpen) {
      e.preventDefault();
      closeMobileMenu();
      return;
    }
    if (productsOpen) {
      e.preventDefault();
      productsOpen = false;
      productsTrigger?.focus();
    }
  }
</script>

<svelte:window onkeydown={handleWindowKeydown} />

<nav
  bind:clientHeight={navHeight}
  class="fixed top-0 right-0 left-0 isolate z-[100] border-b border-foreground/5 bg-background/80 backdrop-blur-xl transition-colors duration-150"
>
  {#if !page.url.pathname.startsWith('/admin')}
    <div
      class="grid transition-[grid-template-rows,opacity] duration-200 {ribbonVisible ? 'grid-rows-[1fr] opacity-100' : 'pointer-events-none grid-rows-[0fr] opacity-0'}"
      aria-hidden={!ribbonVisible}
      inert={!ribbonVisible}
    >
      <div class="min-h-0 overflow-hidden">
        <div class="border-b border-foreground/5 bg-background">
          <div class="mx-auto flex max-w-7xl items-center justify-center px-4 py-1 text-xs sm:px-6 lg:px-8">
            <a href="/ley-21719" class="group flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-center">
              <span aria-hidden="true" class="inline-flex size-1.5 shrink-0 rounded-full bg-primary"></span>
              <span class="text-xs font-semibold uppercase text-primary group-hover:underline group-hover:underline-offset-4">{t('nav.ribbon_law_label')}</span>
              <span class="hidden text-foreground/10 sm:inline" aria-hidden="true">·</span>
              <span class="hidden text-muted-foreground sm:inline">{t('nav.ribbon_full_enforcement')}</span>
              <span class="hidden text-foreground/10 sm:inline" aria-hidden="true">·</span>
              <span class="hidden text-muted-foreground sm:inline">{t('nav.ribbon_fines_prefix')} <span class="font-semibold text-foreground/80">{t('nav.ribbon_fines_value')}</span></span>
            </a>
          </div>
        </div>
      </div>
    </div>
  {/if}
  <div class="relative mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:px-8">
    <div class="flex items-center">
      <a href="/" class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="size-7" aria-hidden="true">
          <rect x="2" y="7" width="18" height="22" rx="5" fill="none" stroke="currentColor" stroke-width="2.2" class="text-foreground"/>
          <rect x="12" y="3" width="18" height="22" rx="5" fill="none" stroke="currentColor" stroke-width="2.2" class="text-primary"/>
        </svg>
        <span class="font-heading text-xl font-bold tracking-normal"><span class="text-foreground">Etho</span><span class="text-primary">z</span></span>
      </a>
    </div>

    <!-- Desktop nav -->
    <div class="hidden items-center gap-1 text-[0.75rem] lg:flex xl:gap-1.5 xl:text-sm">
      {#each navLinksBefore as link (link.href)}
        <a
          href={link.href}
          aria-current={isActive(link.href) ? 'page' : undefined}
          class="whitespace-nowrap rounded-lg px-1.5 py-1.5 font-medium transition-colors
            {isActive(link.href)
              ? 'bg-foreground/5 text-foreground'
              : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'}"
        >
          {t(link.key)}
        </a>
      {/each}

      <div
        bind:this={productsContainer}
        class="relative"
        role="presentation"
        onmouseenter={openProducts}
        onmouseleave={closeProducts}
        onfocusin={() => clearTimeout(productsTimeout)}
        onfocusout={(e) => {
          const container = e.currentTarget as HTMLElement;
          if (!container.contains(e.relatedTarget as Node | null)) productsOpen = false;
        }}
        onkeydown={handleProductsKeydown}
      >
        <button
          bind:this={productsTrigger}
          type="button"
          aria-expanded={productsOpen}
          aria-controls="products-menu"
          class="whitespace-nowrap flex items-center gap-1 rounded-lg px-1.5 py-1.5 font-medium transition-colors
            {isProductActive()
              ? 'bg-foreground/5 text-foreground'
              : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'}"
          onclick={handleProductsTriggerClick}
          onkeydown={handleProductsTriggerKeydown}
        >
          {t('nav.features')}
          <ChevronDown class="size-3.5 transition-transform {productsOpen ? 'rotate-180' : ''}" aria-hidden="true" />
        </button>

        {#if productsOpen}
          <div
            bind:this={productsMenu}
            id="products-menu"
            class="absolute left-1/2 top-full mt-2 w-[420px] -translate-x-1/2 rounded-xl border border-foreground/10 bg-card p-3 shadow-popover"
            role="presentation"
            onmouseenter={openProducts}
            onmouseleave={closeProducts}
          >
            <div class="grid grid-cols-2 gap-1">
              {#each products as product (product.href)}
                {@const Icon = product.icon}
                <a
                  href={product.href}
                  class="flex items-start gap-2.5 rounded-lg px-3 py-2.5 transition-colors hover:bg-foreground/5"
                  onclick={() => (productsOpen = false)}
                >
                  <Icon class="mt-0.5 size-4 shrink-0 text-primary" />
                  <div>
                    <p class="text-xs font-semibold text-foreground">{t(product.name)}</p>
                    <p class="text-xs text-muted-foreground">{t(product.desc)}</p>
                  </div>
                </a>
              {/each}
            </div>
            <a
              href="/productos"
              class="mt-2 block border-t border-foreground/10 pt-2 text-center text-xs font-medium text-primary transition-colors hover:text-primary-hover"
              onclick={() => (productsOpen = false)}
            >
              {t('nav.all_products')}
            </a>
          </div>
        {/if}
      </div>

      {#each navLinksAfter as link (link.href)}
        <a
          href={link.href}
          aria-current={isActive(link.href) ? 'page' : undefined}
          class="whitespace-nowrap rounded-lg px-1.5 py-1.5 font-medium transition-colors
            {isActive(link.href)
              ? 'bg-foreground/5 text-foreground'
              : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'}"
        >
          {t(link.key)}
        </a>
      {/each}
    </div>
    <div class="lg:hidden"></div>

    <!-- Actions -->
    <div class="flex items-center justify-end gap-2">
      <a
        href={env.PUBLIC_APP_URL ?? 'https://app.ethoz.cl/login'}
        class="hidden rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground lg:inline-flex"
      >
        {t('nav.login')}
      </a>
      <Button size="sm" href="/auditoria" class="hidden h-8 px-2.5 text-xs lg:inline-flex">
        {t('nav.cta')}
      </Button>

      <button
        bind:this={mobileToggle}
        type="button"
        class="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-foreground/10 p-2.5 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground lg:hidden"
        onclick={toggleMobileMenu}
        aria-label={mobileOpen ? t('nav.close_menu') : t('nav.open_menu')}
        aria-expanded={mobileOpen}
        aria-controls="mobile-menu"
      >
        {#if mobileOpen}
          <X class="size-5" />
        {:else}
          <Menu class="size-5" />
        {/if}
      </button>
    </div>
  </div>

  <!-- Mobile menu -->
  {#if mobileOpen}
    <div
      bind:this={mobileMenu}
      id="mobile-menu"
      role="dialog"
      tabindex="-1"
      aria-modal="true"
      aria-label={t('nav.menu_label')}
      class="fixed inset-x-0 bottom-0 z-10 overflow-y-auto overscroll-contain border-t border-foreground/10 bg-background px-4 pb-6 pt-4 shadow-popover lg:hidden"
      style:top={`${navHeight}px`}
      style:height={`calc(100dvh - ${navHeight}px)`}
      onkeydown={handleMobileMenuKeydown}
    >
      <div class="flex flex-col gap-1 font-heading">
        {#each navLinksBefore as link (link.href)}
          <a
            href={link.href}
            class="rounded-lg px-3 py-3 text-base font-semibold tracking-tight transition-colors
              {isActive(link.href)
                ? 'bg-foreground/5 text-primary'
                : 'text-foreground/90 hover:bg-foreground/5'}"
            aria-current={isActive(link.href) ? 'page' : undefined}
            onclick={() => closeMobileMenu(false)}
          >
            {t(link.key)}
          </a>
        {/each}

        <div class="flex flex-col">
          <button
            type="button"
            aria-expanded={mobileProductsOpen}
            class="flex items-center justify-between rounded-lg px-3 py-3 text-base font-semibold tracking-tight transition-colors
              {isProductActive()
                ? 'bg-foreground/5 text-primary'
                : 'text-foreground/90 hover:bg-foreground/5'}"
            onclick={() => (mobileProductsOpen = !mobileProductsOpen)}
          >
            {t('nav.features')}
            <ChevronDown class="size-4 transition-transform {mobileProductsOpen ? 'rotate-180' : ''}" aria-hidden="true" />
          </button>

          {#if mobileProductsOpen}
            <div class="flex flex-col gap-0.5 pb-2 pl-3 pr-1 pt-1" transition:slide={{ duration: 200 }}>
              {#each products as product (product.href)}
                {@const Icon = product.icon}
                <a
                  href={product.href}
                  class="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-foreground/5"
                  onclick={() => closeMobileMenu(false)}
                >
                  <Icon class="mt-0.5 size-4 shrink-0 text-primary" />
                  <div>
                    <p class="text-sm font-semibold text-foreground">{t(product.name)}</p>
                    <p class="text-xs text-muted-foreground">{t(product.desc)}</p>
                  </div>
                </a>
              {/each}
              <a
                href="/productos"
                class="mt-1 block rounded-lg px-3 py-2.5 text-center text-sm font-semibold text-primary transition-colors hover:bg-foreground/5"
                onclick={() => closeMobileMenu(false)}
              >
                {t('nav.all_products')}
              </a>
            </div>
          {/if}
        </div>

        {#each navLinksAfter as link (link.href)}
          <a
            href={link.href}
            class="rounded-lg px-3 py-3 text-base font-semibold tracking-tight transition-colors
              {isActive(link.href)
                ? 'bg-foreground/5 text-primary'
                : 'text-foreground/90 hover:bg-foreground/5'}"
            aria-current={isActive(link.href) ? 'page' : undefined}
            onclick={() => closeMobileMenu(false)}
          >
            {t(link.key)}
          </a>
        {/each}
      </div>
      <div class="mt-5 flex flex-col gap-3 border-t border-foreground/10 pt-5">
        <a
          href={env.PUBLIC_APP_URL ?? 'https://app.ethoz.cl/login'}
          class="rounded-lg px-3 py-2.5 text-center text-base font-semibold tracking-tight text-foreground/90 transition-colors hover:bg-foreground/5"
          onclick={() => closeMobileMenu(false)}
        >
          {t('nav.login')}
        </a>
        <Button size="default" href="/auditoria" class="w-full justify-center font-heading text-base font-semibold tracking-tight" onclick={() => closeMobileMenu(false)}>
          {t('nav.cta')}
        </Button>
      </div>
    </div>
  {/if}
</nav>
