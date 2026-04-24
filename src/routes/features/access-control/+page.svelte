<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { t } from '$lib/i18n/index.svelte';
  import { Button } from '$lib/components/ui/button';
  import {
    Fingerprint, ArrowRight, ArrowLeft, UserCog, GanttChartSquare, EyeOff,
    Check, X, ShieldCheck, BadgeCheck, Lock, Users
  } from '@lucide/svelte';
  import { trackEvent } from '$lib/utils/analytics';

  $effect(() => { trackEvent('feature_page_viewed', { feature: 'access-control' }); });

  // Roles and permissions matrix
  const roles = [
    { name: 'Director/a', abbr: 'DIR', color: 'text-primary' },
    { name: 'Inspector/a', abbr: 'INS', color: 'text-foreground' },
    { name: 'Orientador/a', abbr: 'ORI', color: 'text-foreground' },
    { name: 'Docente', abbr: 'DOC', color: 'text-foreground' },
    { name: 'UTP', abbr: 'UTP', color: 'text-foreground' },
    { name: 'Portero/a', abbr: 'POR', color: 'text-muted-foreground' },
  ];

  const permissions = [
    { label: 'Ver ficha básica',        values: [true,  true,  true,  true,  true,  false] },
    { label: 'Ver alertas médicas',     values: [true,  false, true,  false, false, false] },
    { label: 'Ver datos judiciales',    values: [true,  true,  true,  false, false, false] },
    { label: 'Registrar retiro',        values: [true,  true,  false, false, false, true]  },
    { label: 'Agregar observación',     values: [true,  true,  true,  true,  false, false] },
    { label: 'Exportar datos',          values: [true,  false, false, false, true,  false] },
    { label: 'Gestionar usuarios',      values: [true,  false, false, false, false, false] },
  ];

  let activeRole = $state<string | null>(null);
</script>

<svelte:head>
  <title>Ethoz — {t('features.rbac.title')}</title>
  <meta name="description" content="Cada persona ve exactamente lo que necesita, ni más ni menos." />
  <meta property="og:url" content="https://ethoz.cl/features/access-control" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Ethoz — Control de Acceso Granular por Roles" />
  <meta property="og:description" content="Cada persona ve exactamente lo que necesita, ni más ni menos." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Ethoz — Control de Acceso Granular por Roles" />
  <meta name="twitter:description" content="Cada persona ve exactamente lo que necesita, ni más ni menos." />
  <link rel="canonical" href="https://ethoz.cl/features/access-control" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Productos","item":"https://ethoz.cl/productos"},{"@type":"ListItem","position":3,"name":"Control de Acceso por Roles"}]})}</script>`}
</svelte:head>

<main class="flex min-h-dvh flex-col bg-background">
  <NavBar />

  <!-- Hero -->
  <section class="bg-secondary pt-24 pb-10 sm:pt-28 sm:pb-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <a href="/#features" class="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft class="size-3.5" />
        Volver a características
      </a>
      <div class="mt-6 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <div class="lg:pt-4">
          <div class="flex items-center gap-3">
            <Fingerprint class="size-6 shrink-0 text-primary" />
            <h1 class="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t('features.rbac.title')}
            </h1>
          </div>
          <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
            {t('features.rbac.desc')}
          </p>
          <ul class="mt-6 space-y-3">
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              6 roles preconfigurados para el ecosistema escolar chileno: Director, Inspector, Orientador, Docente, UTP y Portero
            </li>
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              El portero solo ve lo estrictamente necesario para verificar retiros — ningún dato sensible en pantalla
            </li>
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              Cambios de rol aplicados en tiempo real, sin necesidad de reinicio del sistema
            </li>
          </ul>
        </div>

        <!-- Permission matrix mockup -->
        <div class="w-full rounded-xl border border-border bg-card shadow-card-hover overflow-hidden">
          <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <div class="size-2.5 rounded-full bg-destructive/60"></div>
            <div class="size-2.5 rounded-full bg-warning/60"></div>
            <div class="size-2.5 rounded-full bg-success/60"></div>
            <span class="ml-2 text-[11px] font-medium text-muted-foreground">Ethoz — Matriz de Permisos por Rol</span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-[10px]">
              <caption class="sr-only">Matriz de permisos por rol: detalla qué acciones puede realizar cada rol (Director, Inspector, Orientador, Docente, UTP, Portero) en Ethoz.</caption>
              <thead>
                <tr class="border-b border-border bg-muted/30">
                  <th scope="col" class="px-3 py-2 text-left font-semibold text-muted-foreground">Permiso</th>
                  {#each roles as role}
                    <th scope="col" class="px-2 py-2 text-center font-semibold {role.color}" title={role.name}>{role.abbr}</th>
                  {/each}
                </tr>
              </thead>
              <tbody class="divide-y divide-border">
                {#each permissions as perm}
                  <tr class="hover:bg-muted transition-colors">
                    <th scope="row" class="px-3 py-2 text-left font-normal text-muted-foreground whitespace-nowrap">{perm.label}</th>
                    {#each perm.values as val, vi}
                      <td class="px-2 py-2 text-center">
                        {#if val}
                          <span class="inline-flex items-center justify-center size-4 rounded-full bg-success/10 mx-auto" aria-label={`${roles[vi].name}: permitido`}>
                            <Check aria-hidden="true" class="size-2.5 text-success" />
                          </span>
                        {:else}
                          <span class="inline-flex items-center justify-center size-4 rounded-full bg-muted mx-auto" aria-label={`${roles[vi].name}: no permitido`}>
                            <X aria-hidden="true" class="size-2.5 text-muted-foreground" />
                          </span>
                        {/if}
                      </td>
                    {/each}
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
          <div class="px-4 py-2.5 border-t border-border bg-muted/20">
            <p class="text-[9px] text-muted-foreground">Permisos configurables por el Director del establecimiento. Cambios auditados.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Editorial anchor — privacy principle -->
  <section class="py-12 sm:py-14" aria-labelledby="rbac-editorial">
    <div class="mx-auto max-w-3xl px-4 text-center sm:px-6">
      <span class="mx-auto block h-px w-12 bg-foreground" aria-hidden="true"></span>
      <p id="rbac-editorial" class="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t('featurePage.accessControl.editorial.eyebrow')}</p>
      <blockquote class="mt-5 font-heading text-2xl font-normal italic leading-[1.35] text-foreground sm:text-[2rem] lg:text-[2.25rem] lg:leading-[1.3]">
        {t('featurePage.accessControl.editorial.statement')}
      </blockquote>
      <p class="mt-6 text-sm text-muted-foreground">
        {t('featurePage.accessControl.editorial.body')}
      </p>
    </div>
  </section>

  <!-- Role cards section -->
  <section class="py-12 sm:py-14">
    <div class="mx-auto max-w-4xl px-4 sm:px-6">
      <p class="mb-2 text-sm font-bold uppercase tracking-widest text-primary">Por rol</p>
      <h2 class="mb-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">Cada rol, una interfaz distinta</h2>
      <p class="mb-10 text-sm leading-relaxed text-muted-foreground max-w-2xl">
        Ethoz no oculta campos en una interfaz genérica. Cada cargo tiene una vista construida para su tarea específica, reduciendo el error humano y la sobrecarga de información.
      </p>
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {#each [
          {
            role: 'Director/a',
            icon: ShieldCheck,
            color: 'text-primary',
            desc: 'Acceso completo a todos los módulos. Configura roles, aprueba protocolos y recibe resúmenes ejecutivos del establecimiento.',
            can: ['Ver todo el expediente', 'Gestionar usuarios y roles', 'Exportar informes completos'],
          },
          {
            role: 'Inspector/a',
            icon: Users,
            color: 'text-foreground',
            desc: 'Gestiona retiros, atrasos y el libro de clases. Ve alertas de convivencia sin acceder a datos médicos confidenciales.',
            can: ['Registrar retiros y atrasos', 'Ver alertas de convivencia', 'No ve datos médicos'],
          },
          {
            role: 'Portero/a',
            icon: Lock,
            color: 'text-foreground',
            desc: 'Interfaz ultra-simplificada: solo búsqueda de alumno, lista de autorizados y botón de confirmar. Nada más en pantalla.',
            can: ['Buscar alumno', 'Ver lista de autorizados', 'Confirmar retiro'],
          },
        ] as card}
          <div class="group rounded-lg border border-border bg-card p-5 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-[0_2px_0_0_rgba(5,28,44,0.10)]">
            <div class="flex items-center gap-2.5 mb-3">
              <card.icon class="size-5 shrink-0 {card.color}" />
              <h3 class="text-sm font-semibold text-foreground">{card.role}</h3>
            </div>
            <p class="text-xs leading-relaxed text-muted-foreground mb-3">{card.desc}</p>
            <ul class="space-y-1">
              {#each card.can as item}
                <li class="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Check class="size-3 shrink-0 text-success" />
                  {item}
                </li>
              {/each}
            </ul>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Detail cards -->
  <section class="bg-secondary py-12 sm:py-14">
    <div class="mx-auto max-w-4xl px-4 sm:px-6">
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

        <div class="group rounded-lg border border-border bg-card p-6 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-[0_2px_0_0_rgba(5,28,44,0.10)]">
          <div class="flex items-center gap-2.5">
            <UserCog class="size-5 shrink-0 text-primary" />
            <h2 class="text-base font-semibold text-foreground">Vistas personalizadas por cargo</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.rbac.bullet1')}
          </p>
        </div>

        <div class="group rounded-lg border border-border bg-card p-6 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-[0_2px_0_0_rgba(5,28,44,0.10)]">
          <div class="flex items-center gap-2.5">
            <GanttChartSquare class="size-5 shrink-0 text-primary" />
            <h2 class="text-base font-semibold text-foreground">Interfaz de portería ultra-restringida</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.rbac.bullet2')}
          </p>
        </div>

        <div class="group rounded-lg border border-border bg-card p-6 transition-all duration-[160ms] hover:border-foreground hover:bg-muted/40 hover:-translate-y-[1px] hover:shadow-[0_2px_0_0_rgba(5,28,44,0.10)]">
          <div class="flex items-center gap-2.5">
            <EyeOff class="size-5 shrink-0 text-primary" />
            <h2 class="text-base font-semibold text-foreground">Confidencialidad filtrada por rol</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.rbac.bullet3')}
          </p>
        </div>

      </div>
    </div>
  </section>

  <!-- Final CTA — dark navy editorial close -->
  <section class="bg-foreground py-20 text-background sm:py-24" aria-labelledby="rbac-cta">
    <div class="mx-auto max-w-3xl px-4 text-center sm:px-6">
      <span class="mx-auto block h-px w-12 bg-background/60" aria-hidden="true"></span>
      <p class="mt-6 text-[12px] font-semibold uppercase tracking-[0.14em] text-background/70">{t('featurePage.accessControl.finalCta.eyebrow')}</p>
      <h2 id="rbac-cta" class="mt-5 font-heading text-3xl font-medium leading-[1.1] tracking-tight text-background sm:text-4xl">
        {t('featurePage.accessControl.finalCta.title')}
      </h2>
      <p class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-background/80">
        {t('featurePage.accessControl.finalCta.subtitle')}
      </p>
      <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href="/demo"
          class="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-background px-8 text-sm font-semibold text-foreground transition-colors hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
        >
          Agendar demo
          <ArrowRight class="size-4" />
        </a>
        <a
          href="/#features"
          class="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-background/70 bg-transparent px-8 text-sm font-semibold text-background transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
        >
          Ver todas las funciones
        </a>
      </div>
    </div>
  </section>

  <Footer />
</main>
