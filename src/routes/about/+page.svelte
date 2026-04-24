<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { t } from '$lib/i18n/index.svelte';
  import { ArrowRight, ChevronDown } from '@lucide/svelte';
  import { trackEvent } from '$lib/utils/analytics';

  const faqs = [
    { q: 'about.faq.q1' as const, a: 'about.faq.a1' as const },
    { q: 'about.faq.q2' as const, a: 'about.faq.a2' as const },
    { q: 'about.faq.q3' as const, a: 'about.faq.a3' as const },
    { q: 'about.faq.q4' as const, a: 'about.faq.a4' as const },
  ];

  let openFaq = $state<number | null>(null);

  function toggleFaq(i: number) {
    openFaq = openFaq === i ? null : i;
  }

  $effect(() => { trackEvent('about_page_viewed'); });

  // Institutional roadmap — quarters in which the thesis manifests
  const roadmap = [
    { period: '2026 · Q2', label: 'Fundación', body: 'ETHOZ SpA se constituye en abril de 2026 con tesis explícita: proteger los datos de los colegios chilenos antes de que la Ley 21.719 entre en vigencia plena.', state: 'done' as const },
    { period: '2026 · Q3', label: 'Primeros sostenedores', body: 'Implementación con sostenedores piloto: redes multi-colegio del Tier 1 con necesidades concretas de compliance. Integración con Napsis, Syscol y Lirmi.', state: 'active' as const },
    { period: '2026 · Q4', label: 'Ley 21.719 en vigencia', body: 'Diciembre de 2026: enforcement pleno por el Consejo para la Transparencia. Ethoz opera como capa de compliance para sostenedores ya implementados.', state: 'upcoming' as const },
    { period: '2027 · H1', label: 'SOC 2 Type II', body: 'Certificación SOC 2 Type II en curso. Controles técnicos ya implementados; el proceso de auditoría cierra el roadmap de compliance institucional.', state: 'upcoming' as const },
  ];
</script>

<svelte:head>
  <title>Ethoz — {t('about.title')}</title>
  <meta name="description" content="Ethoz: plataforma de seguimiento integral y seguridad escolar construida en Chile." />
  <meta property="og:url" content="https://ethoz.cl/about" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Ethoz — Construido en Chile, para colegios chilenos" />
  <meta property="og:description" content="Conoce Ethoz, la plataforma de gestión y protección de datos escolares para Chile." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Ethoz — Construido en Chile, para colegios chilenos" />
  <meta name="twitter:description" content="Conoce Ethoz, la plataforma de gestión y protección de datos escolares para Chile." />
  <link rel="canonical" href="https://ethoz.cl/about" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Nosotros"}]})}</script>`}
</svelte:head>

<main class="flex min-h-dvh flex-col bg-background">
  <NavBar />

  <!-- HERO — thesis declaration -->
  <section class="pt-24 pb-12 sm:pt-28 sm:pb-16">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <p class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        <span class="text-primary">Institucional</span>
        <span aria-hidden="true" class="text-border">·</span>
        <span>ETHOZ SpA</span>
        <span aria-hidden="true" class="text-border">·</span>
        <span>Fundada en 2026</span>
      </p>
      <span class="mt-6 block h-px w-12 bg-foreground" aria-hidden="true"></span>
      <h1 class="mt-6 font-heading text-[2rem] font-medium italic leading-[1.15] tracking-tight text-foreground sm:text-[2.5rem] lg:text-[3rem]">
        {t('about.title')}
      </h1>
      <p class="mt-8 max-w-[68ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
        {t('about.intro')}
      </p>
    </div>
  </section>

  <!-- EDITORIAL ANCHOR — the thesis, institutional declaration -->
  <section class="border-y border-border py-16 sm:py-20">
    <div class="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
      <span class="mx-auto block h-px w-12 bg-foreground" aria-hidden="true"></span>
      <p class="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">La tesis</p>
      <blockquote class="mt-5 font-heading text-2xl font-normal italic leading-[1.35] text-foreground sm:text-[2rem] lg:text-[2.25rem] lg:leading-[1.3]">
        Los colegios chilenos no necesitan otro sistema que reemplazar el que tienen — necesitan una capa que proteja lo que ya existe, antes de que diciembre de 2026 convierta las brechas en sanciones.
      </blockquote>
    </div>
    <div class="mx-auto mt-12 max-w-5xl px-4 sm:mt-14 sm:px-6 lg:px-8">
      <dl class="grid grid-cols-1 border-y border-border sm:grid-cols-3 sm:divide-x sm:divide-border">
        <div class="px-6 py-6 text-center sm:py-8">
          <dt class="sr-only">Establecimientos en Chile</dt>
          <dd class="font-heading text-5xl font-medium leading-none tracking-tight text-foreground sm:text-6xl" data-numeric>
            12.038
          </dd>
          <p class="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Colegios en Chile
          </p>
        </div>
        <div class="border-t border-border px-6 py-6 text-center sm:border-t-0 sm:py-8">
          <dt class="sr-only">Sostenedores a cargo</dt>
          <dd class="font-heading text-5xl font-medium leading-none tracking-tight text-foreground sm:text-6xl" data-numeric>
            5.777
          </dd>
          <p class="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Sostenedores a cargo
          </p>
        </div>
        <div class="border-t border-border px-6 py-6 text-center sm:border-t-0 sm:py-8">
          <dt class="sr-only">Vigencia plena</dt>
          <dd class="font-heading text-5xl font-medium leading-none tracking-tight text-foreground sm:text-6xl" data-numeric>
            Dic 2026
          </dd>
          <p class="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Entrada en plena vigencia
          </p>
        </div>
      </dl>
      <p class="mt-4 text-center text-xs text-muted-foreground">
        Fuentes: Mineduc (2024) · Ley N° 21.719
      </p>
    </div>
  </section>

  <!-- MISSION — what Ethoz is NOT, and what it IS -->
  <section class="py-16 sm:py-20">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary" data-numeric>01 · Qué es Ethoz</p>
      <h2 class="mt-3 font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
        {t('about.mission_title')}
      </h2>
      <p class="mt-6 max-w-[68ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
        {t('about.mission_desc')}
      </p>

      <!-- Contrast: what Ethoz complements vs. what it is -->
      <div class="mt-10 grid gap-6 border-y border-border py-10 sm:grid-cols-2 sm:gap-10">
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Ethoz no es</p>
          <ul class="mt-4 space-y-3 text-sm text-muted-foreground">
            <li class="flex gap-3"><span class="text-border" aria-hidden="true">—</span><span>Un reemplazo de Napsis, Syscol o Lirmi.</span></li>
            <li class="flex gap-3"><span class="text-border" aria-hidden="true">—</span><span>Un ERP escolar ni un sistema de gestión académica.</span></li>
            <li class="flex gap-3"><span class="text-border" aria-hidden="true">—</span><span>Una capa de marketing o comunicaciones.</span></li>
          </ul>
        </div>
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">Ethoz es</p>
          <ul class="mt-4 space-y-3 text-sm text-foreground">
            <li class="flex gap-3"><span class="text-primary" aria-hidden="true">→</span><span>La capa de seguridad, compliance y trazabilidad sobre lo que ya usa el colegio.</span></li>
            <li class="flex gap-3"><span class="text-primary" aria-hidden="true">→</span><span>Una plataforma diseñada por defecto para la Ley 21.719 y la Circular N°30.</span></li>
            <li class="flex gap-3"><span class="text-primary" aria-hidden="true">→</span><span>Un proyecto chileno, con datos alojados en la región, construido para sostenedores conservadores.</span></li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- ROADMAP — institutional transparency replaces "values" AI slop -->
  <section class="border-t border-border py-16 sm:py-20">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary" data-numeric>02 · Trayectoria</p>
      <h2 class="mt-3 font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
        Hoja de ruta institucional
      </h2>
      <p class="mt-6 max-w-[68ch] text-base leading-relaxed text-muted-foreground">
        Un proyecto joven se juzga por la precisión de su plan, no por la cantidad de valores en su página "Nosotros". Estas son las fechas en las que se compromete Ethoz.
      </p>

      <ol class="mt-10 divide-y divide-border border-y border-border">
        {#each roadmap as item, i}
          <li class="grid gap-4 py-6 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)_auto] sm:items-baseline sm:gap-8">
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary" data-numeric>{item.period}</p>
              <p class="mt-1 font-heading text-xs font-medium text-muted-foreground tabular-nums" data-numeric>0{i + 1}</p>
            </div>
            <div>
              <p class="font-semibold text-foreground">{item.label}</p>
              <p class="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
            <div class="sm:text-right">
              {#if item.state === 'done'}
                <span class="text-[11px] font-semibold uppercase tracking-[0.14em] text-success">Completado</span>
              {:else if item.state === 'active'}
                <span class="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                  <span class="relative flex size-1.5">
                    <span class="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-70"></span>
                    <span class="relative inline-flex size-1.5 rounded-full bg-primary"></span>
                  </span>
                  En curso
                </span>
              {:else}
                <span class="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Planificado</span>
              {/if}
            </div>
          </li>
        {/each}
      </ol>
    </div>
  </section>

  <!-- FAQ — subtle, editorial -->
  <section class="border-t border-border py-16 sm:py-20">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary" data-numeric>03 · Preguntas frecuentes</p>
      <h2 class="mt-3 font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
        {t('about.faq.title')}
      </h2>

      <div class="mt-10 divide-y divide-border border-y border-border">
        {#each faqs as faq, i}
          <div>
            <button
              type="button"
              class="flex w-full items-center justify-between gap-4 py-5 text-left text-sm font-semibold text-foreground transition-colors hover:bg-muted/40"
              onclick={() => toggleFaq(i)}
              aria-expanded={openFaq === i}
            >
              <span class="flex items-baseline gap-4">
                <span class="font-heading text-xs text-primary tabular-nums" data-numeric>0{i + 1}</span>
                <span>{t(faq.q)}</span>
              </span>
              <ChevronDown class="size-4 shrink-0 text-muted-foreground transition-transform {openFaq === i ? 'rotate-180' : ''}" />
            </button>
            {#if openFaq === i}
              <div class="pl-10 pb-5 text-sm leading-relaxed text-muted-foreground">
                {t(faq.a)}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- FINAL CTA — dark navy -->
  <section class="bg-foreground py-20 text-background sm:py-24" aria-labelledby="final-cta-about">
    <div class="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
      <span class="mx-auto block h-px w-12 bg-background/60" aria-hidden="true"></span>
      <p class="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-background/70">Conversación directa</p>
      <h2 id="final-cta-about" class="mt-5 font-heading text-3xl font-medium leading-[1.15] tracking-tight text-background sm:text-4xl">
        {t('pricing.cta.title')}
      </h2>
      <p class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-background/80">
        {t('pricing.cta.subtitle')}
      </p>
      <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href="/demo"
          class="inline-flex h-14 items-center justify-center gap-2 rounded-md bg-background px-10 text-base font-semibold text-foreground transition-colors hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
        >
          {t('pricing.cta.primary')}
          <ArrowRight class="size-5" />
        </a>
        <a
          href="/compliance"
          class="inline-flex items-center gap-1 border-b border-background/60 pb-0.5 text-sm font-medium text-background/80 transition-colors hover:border-background hover:text-background"
        >
          Ver cumplimiento normativo
        </a>
      </div>
    </div>
  </section>

  <Footer />
</main>
