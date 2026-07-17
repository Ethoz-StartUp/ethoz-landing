<script lang="ts">
  import { Badge } from '$lib/components/ui/badge';
  import { BRAND } from '$lib/brand';
  import { t } from '$lib/i18n/index.svelte';
  import { Clock, Calendar } from '@lucide/svelte';
  import Footer from '$lib/components/Footer.svelte';
  import NavBar from '$lib/components/NavBar.svelte';
  import { trackEvent } from '$lib/utils/analytics';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  $effect(() => { trackEvent('blog_index_viewed'); });
</script>

<svelte:head>
  <title>Blog · {BRAND}</title>
  <meta name="description" content="Artículos sobre protección de datos, seguridad escolar y cumplimiento normativo para colegios en Chile." />
  <meta property="og:url" content="https://ethoz.cl/blog" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={`Blog · ${BRAND}`} />
  <meta property="og:description" content="Artículos sobre protección de datos, seguridad escolar y cumplimiento normativo para colegios en Chile." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={`Blog · ${BRAND}`} />
  <meta name="twitter:description" content="Artículos sobre protección de datos, seguridad escolar y cumplimiento normativo para colegios en Chile." />
  <link rel="canonical" href="https://ethoz.cl/blog" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Blog"}]})}</script>`}
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

  <div class="mx-auto flex-1 max-w-7xl px-4 pt-24 pb-8 sm:pt-28 sm:pb-10 sm:px-6 lg:px-8">
    <!-- Editorial header — Launch UI pattern: eyebrow · meta · short rule · Inter display h1 · subtitle -->
    <header class="mb-12 max-w-3xl sm:mb-16">
      <p class="page-eyebrow">
        <span class="text-primary">Publicaciones</span>
        <span aria-hidden="true" class="hidden text-border sm:inline">·</span>
        <span>Protección de datos, seguridad y cumplimiento</span>
      </p>
      <span class="page-title-rule" aria-hidden="true"></span>
      <h1 class="page-title">
        {t('blog.title')}
      </h1>
      <p class="mt-6 max-w-[68ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
        {t('blog.subtitle')}
      </p>
    </header>

    <!-- Posts grid -->
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {#each data.posts as post, i}
        <a
          href="/blog/{post.slug}"
          class="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 shadow-card-dark hover:shadow-card-dark-hover hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px]"
        >
          <!-- Cover image -->
          {#if post.coverImage}
            <div class="aspect-[16/9] overflow-hidden bg-muted">
              <img
                src={post.coverImage}
                alt={post.title}
                width="1600"
                height="900"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                fetchpriority={i === 0 ? 'high' : 'auto'}
              />
            </div>
          {/if}

          <div class="flex flex-1 flex-col p-5">
            <div class="mb-2.5 flex flex-wrap gap-1.5">
              {#each post.tags.slice(0, 2) as tag}
                <Badge variant="secondary" class="text-mockup-xs">{tag}</Badge>
              {/each}
            </div>

            <h2 class="text-base font-semibold leading-snug text-foreground">
              {post.title}
            </h2>

            <p class="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
              {post.description}
            </p>

            <div class="mt-4 flex items-center gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
              <span class="flex items-center gap-1">
                <Calendar class="size-3" />
                {new Date(post.date).toLocaleDateString('es-CL', { month: 'short', day: 'numeric' })}
              </span>
              <span class="flex items-center gap-1">
                <Clock class="size-3" />
                {post.readTime}
              </span>
            </div>
          </div>
        </a>
      {/each}
    </div>
  </div>
  </main>

  <Footer />
</div>
