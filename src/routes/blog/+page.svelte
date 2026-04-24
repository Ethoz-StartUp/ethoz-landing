<script lang="ts">
  import { Badge } from '$lib/components/ui/badge';
  import { t } from '$lib/i18n/index.svelte';
  import { Clock, Calendar } from '@lucide/svelte';
  import { allPosts } from '$lib/data/posts';
  import Footer from '$lib/components/Footer.svelte';
  import NavBar from '$lib/components/NavBar.svelte';
  import { trackEvent } from '$lib/utils/analytics';

  $effect(() => { trackEvent('blog_index_viewed'); });
</script>

<svelte:head>
  <title>Blog — Ethoz</title>
  <meta name="description" content="Artículos sobre protección de datos, seguridad escolar y cumplimiento normativo para colegios en Chile." />
  <meta property="og:url" content="https://ethoz.cl/blog" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Blog — Ethoz" />
  <meta property="og:description" content="Artículos sobre protección de datos, seguridad escolar y cumplimiento normativo para colegios en Chile." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Blog — Ethoz" />
  <meta name="twitter:description" content="Artículos sobre protección de datos, seguridad escolar y cumplimiento normativo para colegios en Chile." />
  <link rel="canonical" href="https://ethoz.cl/blog" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Blog"}]})}</script>`}
</svelte:head>

<main class="flex min-h-dvh flex-col bg-background">
  <NavBar />

  <div class="mx-auto flex-1 max-w-7xl px-4 pt-24 pb-10 sm:pt-28 sm:pb-12 sm:px-6 lg:px-8">
    <!-- Editorial header — McK pattern: eyebrow · meta · short rule · Playfair italic h1 · subtitle -->
    <header class="mb-12 max-w-3xl sm:mb-16">
      <p class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        <span class="text-primary">Publicaciones</span>
        <span aria-hidden="true" class="text-border">·</span>
        <span>Protección de datos, seguridad y cumplimiento</span>
      </p>
      <span class="mt-6 block h-px w-12 bg-foreground" aria-hidden="true"></span>
      <h1 class="mt-6 font-heading text-[2rem] font-medium italic leading-[1.15] tracking-tight text-foreground sm:text-[2.5rem] lg:text-[3rem]">
        {t('blog.title')}
      </h1>
      <p class="mt-6 max-w-[68ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
        {t('blog.subtitle')}
      </p>
    </header>

    <!-- Posts grid -->
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {#each allPosts as post, i}
        <a
          href="/blog/{post.slug}"
          class="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-[0_2px_0_0_rgba(5,28,44,0.10)] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px]"
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
                fetchpriority={i === 0 ? 'high' : 'auto'}
              />
            </div>
          {/if}

          <div class="flex flex-1 flex-col p-5">
            <div class="mb-2.5 flex flex-wrap gap-1.5">
              {#each post.tags.slice(0, 2) as tag}
                <Badge variant="secondary" class="text-[10px]">{tag}</Badge>
              {/each}
            </div>

            <h2 class="text-[0.95rem] font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
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
  <Footer />
</main>
