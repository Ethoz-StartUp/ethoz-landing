<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import ResourceGate from '$lib/components/ResourceGate.svelte';
  import { Button } from '$lib/components/ui/button';
  import { t } from '$lib/i18n/index.svelte';
  import {
    ClipboardCheck,
    UserCheck,
    ShieldAlert,
    Users,
    Database,
    FileWarning,
    Download,
    ArrowRight
  } from '@lucide/svelte';

  let gateOpen = $state(false);
  let gateSlug = $state('');
  let gatePdf = $state('');
  let gateTitle = $state('');

  function openGate(slug: string, pdf: string, title: string, e: MouseEvent) {
    e.preventDefault();
    gateSlug = slug;
    gatePdf = pdf;
    gateTitle = title;
    gateOpen = true;
  }

  const resources = [
    {
      icon: ClipboardCheck,
      title: 'Checklist de Cumplimiento Ley 21.719',
      description: '20 ítems en 4 secciones para verificar tu estado de cumplimiento: gobernanza, consentimiento, seguridad técnica y derechos de los titulares.',
      href: '/resources/compliance-checklist',
      pdf: '/downloads/checklist-cumplimiento-ley-21719.pdf',
      slug: 'compliance-checklist',
      tag: 'Cumplimiento',
      meta: '20 ítems · 10 min',
      article: 'Art. 16 Ley 21.719'
    },
    {
      icon: UserCheck,
      title: 'Protocolo de Retiros Seguros',
      description: 'Procedimiento completo de 8 pasos para gestionar retiros de alumnos, incluyendo casos especiales y trazabilidad.',
      href: '/resources/pickup-protocol',
      pdf: '/downloads/protocolo-retiros-seguros.pdf',
      slug: 'pickup-protocol',
      tag: 'Operaciones',
      meta: '8 pasos · 6 min',
      article: 'Ley 21.430 · MINEDUC'
    },
    {
      icon: ShieldAlert,
      title: 'Modelo de Aviso de Privacidad Escolar',
      description: 'Plantilla conforme al Art. 14 de la Ley 21.719 lista para adaptar con los datos de tu establecimiento.',
      href: '/resources/privacy-notice',
      pdf: '/downloads/aviso-privacidad-escolar.pdf',
      slug: 'privacy-notice',
      tag: 'Legal',
      meta: '10 secciones · 12 min',
      article: 'Art. 14 Ley 21.719'
    },
    {
      icon: Users,
      title: 'Guía de Roles y Permisos',
      description: 'Matriz de permisos recomendada para Director, Inspector, UTP, Orientador, Docente, Portero y Auxiliar.',
      href: '/resources/roles-permissions-guide',
      pdf: '/downloads/guia-roles-permisos.pdf',
      slug: 'roles-permissions-guide',
      tag: 'Gobernanza',
      meta: '7 roles · Matriz',
      article: 'Art. 27 Ley 21.719'
    },
    {
      icon: Database,
      title: 'Plantilla de Inventario de Datos Personales',
      description: 'Inventario estructurado de todas las categorías de datos tratados por el colegio, con base legal y plazos de retención.',
      href: '/resources/data-inventory',
      pdf: '/downloads/inventario-datos-personales.pdf',
      slug: 'data-inventory',
      tag: 'Cumplimiento',
      meta: '5 categorías · 24 campos',
      article: 'Art. 16 Ley 21.719'
    },
    {
      icon: FileWarning,
      title: 'Plan de Respuesta a Brechas de Datos',
      description: 'Plantilla completa con equipo de respuesta, clasificación de brechas y procedimiento de notificación en 72 horas (Art. 30).',
      href: '/resources/breach-response-plan',
      pdf: '/downloads/plan-respuesta-brechas.pdf',
      slug: 'breach-response-plan',
      tag: 'Incidentes',
      meta: '7 secciones · 72 h',
      article: 'Art. 30 Ley 21.719'
    }
  ];
</script>

<svelte:head>
  <title>Recursos gratuitos — Ley 21.719 para colegios | Ethoz</title>
  <meta name="description" content="Descarga plantillas, checklists y guías gratuitas para cumplir con la Ley 21.719 de Protección de Datos Personales en tu colegio." />
  <meta property="og:url" content="https://ethoz.cl/resources" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Recursos gratuitos — Ley 21.719 para colegios | Ethoz" />
  <meta property="og:description" content="Descarga plantillas, checklists y guías gratuitas para cumplir con la Ley 21.719 de Protección de Datos Personales en tu colegio." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Recursos gratuitos Ley 21.719 | Ethoz" />
  <meta name="twitter:description" content="Plantillas y checklists gratuitos para protección de datos en colegios chilenos." />
  <link rel="canonical" href="https://ethoz.cl/resources" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Recursos gratuitos Ley 21.719",
    "description": "Plantillas, checklists y guías para cumplir con la Ley 21.719 en colegios chilenos.",
    "url": "https://ethoz.cl/resources",
    "publisher": { "@type": "Organization", "name": "Ethoz", "url": "https://ethoz.cl" }
  })}</script>`}
</svelte:head>

<main class="flex min-h-dvh flex-col bg-background">
  <NavBar />

  <!-- HERO — editorial -->
  <section class="pt-24 pb-12 sm:pt-28 sm:pb-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <p class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        <span class="text-primary">{t('resources.free_badge')}</span>
        <span aria-hidden="true" class="text-border">·</span>
        <span>{resources.length} documentos</span>
        <span aria-hidden="true" class="text-border">·</span>
        <span>Descargables · PDF</span>
      </p>
      <span class="mt-6 block h-px w-12 bg-foreground" aria-hidden="true"></span>
      <h1 class="mt-6 font-heading text-[2rem] font-medium italic leading-[1.15] tracking-tight text-foreground sm:text-[2.5rem] lg:text-[3rem]">
        {t('resources.hero.title')}
      </h1>
      <p class="mt-8 max-w-[68ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
        {t('resources.hero.subtitle')}
      </p>
    </div>
  </section>

  <!-- RESOURCES GRID -->
  <section class="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 sm:pb-24">
    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {#each resources as resource, i}
        <div class="group flex flex-col rounded-lg border border-border bg-card p-6 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-[0_2px_0_0_rgba(5,28,44,0.10)]">
          <div class="flex items-center justify-between">
            <span class="font-heading text-2xl font-medium leading-none tracking-tight text-primary tabular-nums group-hover:text-foreground" data-numeric>{(i + 1).toString().padStart(2, '0')}</span>
            <resource.icon class="size-4 shrink-0 text-primary" />
          </div>
          <h2 class="mt-5 font-heading text-lg font-medium leading-tight tracking-tight text-foreground">{resource.title}</h2>
          <p class="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{resource.description}</p>

          <!-- Metadata strip -->
          <dl class="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4 text-[11px]">
            <div>
              <dt class="font-semibold uppercase tracking-[0.14em] text-muted-foreground">Área</dt>
              <dd class="mt-0.5 font-medium text-foreground">{resource.tag}</dd>
            </div>
            <div>
              <dt class="font-semibold uppercase tracking-[0.14em] text-muted-foreground">Alcance</dt>
              <dd class="mt-0.5 font-medium text-foreground">{resource.meta}</dd>
            </div>
            <div class="col-span-2">
              <dt class="font-semibold uppercase tracking-[0.14em] text-muted-foreground">Norma</dt>
              <dd class="mt-0.5 font-medium text-primary">{resource.article}</dd>
            </div>
          </dl>

          <!-- Actions -->
          <div class="mt-5 flex gap-2">
            <a
              href={resource.pdf}
              download
              onclick={(e) => openGate(resource.slug, resource.pdf, resource.title, e)}
              class="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-pressed"
            >
              <Download class="size-4" />
              {t('resources.download_pdf')}
            </a>
            <a
              href={resource.href}
              class="inline-flex items-center justify-center rounded-md border border-border bg-background px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/40 hover:border-foreground"
            >
              {t('resources.view_online')}
            </a>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- FINAL CTA — dark navy -->
  <section class="bg-foreground py-20 text-background sm:py-24" aria-labelledby="final-cta-resources">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <span class="mx-auto block h-px w-12 bg-background/60" aria-hidden="true"></span>
      <p class="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-background/85">Más allá de las plantillas</p>
      <h2 id="final-cta-resources" class="mt-5 font-heading text-3xl font-medium leading-[1.15] tracking-tight text-background sm:text-4xl">
        {t('resources.cta_title')}
      </h2>
      <p class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-background/80">
        {t('resources.cta_desc')}
      </p>
      <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href="/demo"
          class="inline-flex h-14 items-center justify-center gap-2 rounded-md bg-background px-10 text-base font-semibold text-foreground transition-colors hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
        >
          {t('resources.request_demo')}
          <ArrowRight class="size-5" />
        </a>
      </div>
    </div>
  </section>

  <Footer />

  <ResourceGate
    bind:open={gateOpen}
    slug={gateSlug}
    pdfUrl={gatePdf}
    title={gateTitle}
    onclose={() => {}}
  />
</main>
