<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { t } from '$lib/i18n/index.svelte';
  import { Menu, X, ChevronDown, Shield, Search, ClipboardList, Bell, Fingerprint } from '@lucide/svelte';
  import { env } from '$env/dynamic/public';
  import { tick } from 'svelte';
  import { page } from '$app/state';

  let mobileOpen = $state(false);
  let productsOpen = $state(false);
  let productsTimeout: ReturnType<typeof setTimeout>;
  let scrolled = $state(false);
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

  // Keep the legal ribbon available near the top and while scrolling up, but
  // yield its vertical space while scrolling down. The fixed header is outside
  // document flow, so this does not move page content or create layout shift.
  $effect(() => {
    if (typeof window === 'undefined') return;
    let lastScrollY = Math.max(window.scrollY, 0);
    let scrollFrame = 0;

    const updateHeader = () => {
      const currentScrollY = Math.max(window.scrollY, 0);
      scrolled = currentScrollY > 4;

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

  // A menu opened on mobile must not keep the page locked if the viewport is
  // resized past the desktop breakpoint.
  $effect(() => {
    if (typeof window === 'undefined') return;
    const desktopViewport = window.matchMedia('(min-width: 48rem)');
    const closeAtDesktop = () => {
      if (desktopViewport.matches && mobileOpen) closeMobileMenu(false);
    };
    desktopViewport.addEventListener('change', closeAtDesktop);
    return () => desktopViewport.removeEventListener('change', closeAtDesktop);
  });

  const products = [
    { icon: ClipboardList, name: 'nav.product_student_profile_name' as const, href: '/features/student-profile', desc: 'nav.product_student_profile_desc' as const },
    { icon: Bell, name: 'nav.product_safe_pickups_name' as const, href: '/features/safe-pickups', desc: 'nav.product_safe_pickups_desc' as const },
    { icon: Fingerprint, name: 'nav.product_access_control_name' as const, href: '/features/access-control', desc: 'nav.product_access_control_desc' as const },
    { icon: Search, name: 'nav.product_smart_search_name' as const, href: '/features/smart-search', desc: 'nav.product_smart_search_desc' as const },
    { icon: Shield, name: 'nav.product_privacy_compliance_name' as const, href: '/features/privacy-compliance', desc: 'nav.product_privacy_compliance_desc' as const },
  ];

  const navLinksBefore = [
    { key: 'nav.about' as const, href: '/about' },
    { key: 'nav.pricing' as const, href: '/get-started' },
  ];
  const navLinksAfter = [
    { key: 'nav.integrations' as const, href: '/integrations' },
    { key: 'nav.blog' as const, href: '/blog' },
    { key: 'nav.contact' as const, href: '/contact' },
  ];

  function isActive(href: string): boolean {
    const path = page.url.pathname;
    if (href === '/') return path === '/';
    return path.startsWith(href);
  }

  function isProductActive(): boolean {
    const path = page.url.pathname;
    return path.startsWith('/features') || path === '/compliance' || path === '/productos';
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
    // Pointer hover has already opened the disclosure. Keyboard activation
    // retains native button toggle behaviour.
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

  // Escape closes whichever disclosure is open (dropdown + mobile menu).
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
  class="fixed top-0 right-0 left-0 isolate z-[100] border-b border-border bg-background shadow-sm transition-colors duration-150 {scrolled ? 'md:bg-background/90 md:backdrop-blur-lg' : ''}"
>
  <!-- Top ribbon — Ley 21.719 urgency. Part of the fixed chrome so it
       doesn't get covered by the nav. Hidden on the /admin area.
       No CTA here — the NavBar below already has "Agendar Demo". -->
  {#if !page.url.pathname.startsWith('/admin')}
    <div
      class="grid transition-[grid-template-rows,opacity] duration-200 {ribbonVisible ? 'grid-rows-[1fr] opacity-100' : 'pointer-events-none grid-rows-[0fr] opacity-0'}"
      aria-hidden={!ribbonVisible}
      inert={!ribbonVisible}
    >
      <div class="min-h-0 overflow-hidden">
        <div class="border-b border-hairline bg-surface-soft text-foreground">
          <div class="mx-auto flex max-w-7xl items-center justify-center px-4 py-1.5 text-xs sm:px-6 lg:px-8">
            <!-- Below sm: only the dot + "Ley 21.719" show. Full detail on sm+. -->
            <a href="/ley-21719" class="group flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 text-center">
              <span aria-hidden="true" class="inline-flex size-1.5 shrink-0 rounded-full bg-destructive"></span>
              <span class="text-xs font-semibold uppercase text-primary group-hover:underline group-hover:underline-offset-4">{t('nav.ribbon_law_label')}</span>
              <span class="hidden text-border sm:inline" aria-hidden="true">·</span>
              <span class="hidden text-muted-foreground sm:inline">{t('nav.ribbon_full_enforcement')}</span>
              <span class="hidden text-border sm:inline" aria-hidden="true">·</span>
              <span class="hidden text-muted-foreground sm:inline">{t('nav.ribbon_fines_prefix')} <span class="font-semibold text-foreground">{t('nav.ribbon_fines_value')}</span></span>
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
        <span class="font-heading text-xl font-extrabold tracking-normal"><span class="text-foreground">Etho</span><span class="text-primary">z</span></span>
      </a>
    </div>

    <!-- Desktop nav -->
    <div class="hidden items-center gap-0.5 md:flex">
      <!-- Links before dropdown (¿Qué es?) -->
      {#each navLinksBefore as link (link.href)}
        <a
          href={link.href}
          aria-current={isActive(link.href) ? 'page' : undefined}
          class="rounded-lg px-3 py-2 text-sm font-medium transition-colors
            {isActive(link.href)
              ? 'bg-primary/5 text-primary-active'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
        >
          {t(link.key)}
        </a>
      {/each}

      <!-- Productos dropdown (APG disclosure-of-links pattern: aria-expanded
           trigger + plain list of links; no menu roles) -->
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
        <!-- Native disclosure button: Enter/Space toggles, ArrowDown opens and
             moves focus into the links, Escape closes and restores focus. -->
        <button
          bind:this={productsTrigger}
          type="button"
          aria-expanded={productsOpen}
          aria-controls="products-menu"
          class="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors
            {isProductActive()
              ? 'bg-primary/5 text-primary-active'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
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
            class="absolute left-1/2 top-full mt-2 w-[420px] -translate-x-1/2 rounded-xl border border-border bg-card p-3 shadow-popover"
            role="presentation"
            onmouseenter={openProducts}
            onmouseleave={closeProducts}
          >
            <div class="grid grid-cols-2 gap-1">
              {#each products as product (product.href)}
                {@const Icon = product.icon}
                <a
                  href={product.href}
                  class="flex items-start gap-2.5 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted"
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
              class="mt-2 block border-t border-border pt-2 text-center text-xs font-medium text-primary transition-colors hover:text-primary"
              onclick={() => (productsOpen = false)}
            >
              {t('nav.all_products')}
            </a>
          </div>
        {/if}
      </div>

      <!-- Links after dropdown -->
      {#each navLinksAfter as link (link.href)}
        <a
          href={link.href}
          aria-current={isActive(link.href) ? 'page' : undefined}
          class="rounded-lg px-3 py-2 text-sm font-medium transition-colors
            {isActive(link.href)
              ? 'bg-primary/5 text-primary-active'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
        >
          {t(link.key)}
        </a>
      {/each}
    </div>
    <div class="md:hidden"></div>

    <!-- Actions -->
    <div class="flex items-center justify-end gap-2">
      <a
        href={env.PUBLIC_APP_URL ?? 'https://app.ethoz.cl/login'}
        class="hidden rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:inline-flex"
      >
        {t('nav.login')}
      </a>
      <Button size="sm" href="/demo" class="hidden md:inline-flex">
        {t('nav.cta')}
      </Button>

      <button
        bind:this={mobileToggle}
        type="button"
        class="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
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
    <!-- A solid viewport overlay prevents page glows and the sticky CTA from
         bleeding through. It is immediate rather than opacity-animated so the
         underlying page is never briefly exposed. -->
    <div
      bind:this={mobileMenu}
      id="mobile-menu"
      role="dialog"
      tabindex="-1"
      aria-modal="true"
      aria-label={t('nav.menu_label')}
      class="fixed inset-x-0 bottom-0 z-10 overflow-y-auto overscroll-contain border-t border-border bg-background px-4 pb-5 pt-3 shadow-popover md:hidden"
      style:top={`${navHeight}px`}
      onkeydown={handleMobileMenuKeydown}
    >
      <div class="flex flex-col gap-0.5">
        <!-- ¿Qué es? -->
        {#each navLinksBefore as link (link.href)}
          <a
            href={link.href}
            class="rounded-lg px-3 py-3 text-sm font-medium transition-colors
              {isActive(link.href)
                ? 'bg-primary/5 text-primary-active'
                : 'text-foreground hover:bg-muted'}"
            aria-current={isActive(link.href) ? 'page' : undefined}
            onclick={() => closeMobileMenu(false)}
          >
            {t(link.key)}
          </a>
        {/each}

        <!-- Productos -->
        <a
          href="/productos"
          class="rounded-lg px-3 py-3 text-sm font-medium transition-colors
            {isActive('/productos') || isProductActive()
              ? 'bg-primary/5 text-primary-active'
              : 'text-foreground hover:bg-muted'}"
          aria-current={isActive('/productos') ? 'page' : undefined}
          onclick={() => closeMobileMenu(false)}
        >
          {t('nav.features')}
        </a>

        <!-- Integraciones -->
        <a
          href="/integrations"
          class="rounded-lg px-3 py-3 text-sm font-medium transition-colors
            {isActive('/integrations')
              ? 'bg-primary/5 text-primary-active'
              : 'text-foreground hover:bg-muted'}"
          aria-current={isActive('/integrations') ? 'page' : undefined}
          onclick={() => closeMobileMenu(false)}
        >
          {t('nav.integrations')}
        </a>

        <!-- Blog -->
        <a
          href="/blog"
          class="rounded-lg px-3 py-3 text-sm font-medium transition-colors
            {isActive('/blog')
              ? 'bg-primary/5 text-primary-active'
              : 'text-foreground hover:bg-muted'}"
          aria-current={isActive('/blog') ? 'page' : undefined}
          onclick={() => closeMobileMenu(false)}
        >
          {t('nav.blog')}
        </a>

        <!-- Contacto -->
        <a
          href="/contact"
          class="rounded-lg px-3 py-3 text-sm font-medium transition-colors
            {isActive('/contact')
              ? 'bg-primary/5 text-primary-active'
              : 'text-foreground hover:bg-muted'}"
          aria-current={isActive('/contact') ? 'page' : undefined}
          onclick={() => closeMobileMenu(false)}
        >
          {t('nav.contact')}
        </a>
      </div>
      <div class="mt-4 flex flex-col gap-3 border-t border-border pt-4">
        <a
          href={env.PUBLIC_APP_URL ?? 'https://app.ethoz.cl/login'}
          class="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          onclick={() => closeMobileMenu(false)}
        >
          {t('nav.login')}
        </a>
        <Button size="default" href="/demo" class="w-full justify-center" onclick={() => closeMobileMenu(false)}>
          {t('nav.cta')}
        </Button>
      </div>
    </div>
  {/if}
</nav>
