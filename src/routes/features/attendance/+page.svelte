<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { t } from '$lib/i18n/index.svelte';
  import { trackEvent } from '$lib/utils/analytics';
  import { CalendarCheck, ArrowRight, ArrowLeft, BookOpen, BadgeCheck, AlertTriangle, Clock, CheckCircle2, FileText } from '@lucide/svelte';

  $effect(() => { trackEvent('feature_page_viewed', { feature: 'attendance' }); });

  const students = [
    { name: 'Valentina Rojas', days: ['P', 'P', 'P', 'P', 'P'] },
    { name: 'Matías González', days: ['P', 'A', 'P', 'P', 'T'] },
    { name: 'Sofía Carrasco', days: ['P', 'P', 'J', 'P', 'P'] },
    { name: 'Diego Fuentes', days: ['A', 'P', 'P', 'P', 'P'] },
    { name: 'Catalina Vega', days: ['P', 'P', 'P', 'T', 'P'] },
    { name: 'Joaquín Soto', days: ['P', 'P', 'P', 'P', 'A'] },
    { name: 'Isidora Muñoz', days: ['J', 'P', 'P', 'P', 'P'] },
    { name: 'Sebastián Pino', days: ['P', 'P', 'A', 'A', 'P'] },
    { name: 'Javiera Torres', days: ['P', 'P', 'P', 'P', 'P'] },
    { name: 'Felipe Herrera', days: ['P', 'T', 'P', 'P', 'P'] },
    { name: 'Constanza Díaz', days: ['P', 'P', 'P', 'P', 'J'] },
    { name: 'Rodrigo Vargas', days: ['A', 'A', 'P', 'P', 'P'] },
    { name: 'Antonia Reyes', days: ['P', 'P', 'P', 'P', 'P'] },
  ];

  function dayColor(d: string) {
    if (d === 'P') return 'bg-success text-success-foreground';
    if (d === 'A') return 'bg-destructive text-destructive-foreground';
    if (d === 'T') return 'bg-warning text-warning-foreground';
    if (d === 'J') return 'bg-primary/20 text-primary';
    return 'bg-muted text-muted-foreground';
  }
</script>

<svelte:head>
  <title>Ethoz — Control de Asistencia Digital</title>
  <meta name="description" content="Libro digital de asistencia conforme a Circular N°30. Registro de presencia, atrasos y justificaciones con trazabilidad completa y cumplimiento MINEDUC." />
  <meta property="og:url" content="https://ethoz.cl/features/attendance" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Ethoz — Control de Asistencia Digital" />
  <meta property="og:description" content="Libro digital de asistencia conforme a Circular N°30. Trazabilidad completa y alertas automáticas de inasistencia reiterada." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Ethoz — Control de Asistencia Digital" />
  <meta name="twitter:description" content="Libro digital de asistencia conforme a Circular N°30. Trazabilidad completa y alertas automáticas de inasistencia reiterada." />
  <link rel="canonical" href="https://ethoz.cl/features/attendance" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Productos","item":"https://ethoz.cl/productos"},{"@type":"ListItem","position":3,"name":"Control de Asistencia"}]})}</script>`}
</svelte:head>

<main class="flex min-h-dvh flex-col bg-background">
  <NavBar />

  <!-- Hero -->
  <section class="bg-secondary pt-24 pb-10 sm:pt-28 sm:pb-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <a href="/productos" class="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft class="size-3.5" />
        Volver a productos
      </a>
      <div class="mt-6 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <div class="flex items-center gap-3">
            <CalendarCheck class="size-6 shrink-0 text-primary" />
            <h1 class="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Control de Asistencia Digital
            </h1>
          </div>
          <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
            Libro digital de clases conforme a Circular N°30. Registra presencia, atrasos y justificaciones con firma electrónica, detecta patrones de inasistencia y genera los reportes que exige el MINEDUC — sin papel.
          </p>
          <div class="mt-6 flex flex-wrap gap-2">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Circular N°30 MINEDUC</span>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">Libro digital</span>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-warning/15 px-3 py-1 text-xs font-medium text-warning-foreground">Ley 21.719</span>
          </div>
          <div class="mt-8 flex flex-wrap gap-3">
            <Button size="lg" href="/demo">
              Agendar Demo <ArrowRight class="size-4" />
            </Button>
            <Button size="lg" variant="outline" href="/productos">
              Ver todos los módulos
            </Button>
          </div>
        </div>

        <!-- Attendance grid mockup -->
        <div class="w-full rounded-xl border border-border bg-card shadow-card-hover">
          <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <div class="size-2.5 rounded-full bg-destructive/60"></div>
            <div class="size-2.5 rounded-full bg-warning/60"></div>
            <div class="size-2.5 rounded-full bg-success/60"></div>
            <span class="ml-2 text-[11px] font-medium text-muted-foreground">Ethoz — Asistencia · 7°B · Semana 7 abr</span>
          </div>
          <div class="p-3 sm:p-4">
            <!-- KPI bar -->
            <div class="mb-3 flex items-center gap-3">
              <div class="flex-1 rounded-lg bg-success/10 px-2.5 py-1.5 text-center">
                <p class="text-base font-bold text-success">94,2%</p>
                <p class="text-[9px] text-muted-foreground">Asistencia abril</p>
              </div>
              <div class="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[9px] font-semibold text-primary">
                <BadgeCheck class="size-3 shrink-0" />
                Circular N°30
              </div>
            </div>
            <!-- Day headers -->
            <div class="grid grid-cols-[1fr_repeat(5,_1.5rem)] gap-1 text-[8px] font-semibold uppercase tracking-wider text-muted-foreground px-1 mb-1">
              <span>Alumno</span>
              {#each ['L', 'M', 'X', 'J', 'V'] as d}
                <span class="text-center">{d}</span>
              {/each}
            </div>
            <!-- Student rows -->
            <div class="space-y-0.5 max-h-52 overflow-y-auto">
              {#each students as s}
                <div class="grid grid-cols-[1fr_repeat(5,_1.5rem)] gap-1 items-center rounded px-1 py-0.5 hover:bg-muted/20">
                  <span class="truncate text-[10px] text-foreground">{s.name}</span>
                  {#each s.days as d}
                    <span class="size-5 rounded text-[8px] font-bold flex items-center justify-center {dayColor(d)}">{d}</span>
                  {/each}
                </div>
              {/each}
            </div>
            <!-- Legend -->
            <div class="mt-2 flex flex-wrap gap-2 border-t border-border pt-2">
              {#each [['P','bg-success','Presente'],['A','bg-destructive','Ausente'],['T','bg-warning','Atraso'],['J','bg-primary/20','Justificado']] as [k,c,l]}
                <span class="flex items-center gap-1 text-[9px] text-muted-foreground">
                  <span class="size-3 rounded {c}"></span>{l}
                </span>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Editorial anchor — libro digital thesis -->
  <section class="py-12 sm:py-14" aria-labelledby="attendance-editorial">
    <div class="mx-auto max-w-3xl px-4 text-center sm:px-6">
      <span class="mx-auto block h-px w-12 bg-foreground" aria-hidden="true"></span>
      <p id="attendance-editorial" class="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Circular N°30 · Obligatoria desde 2024</p>
      <blockquote class="mt-5 font-heading text-2xl font-normal italic leading-[1.35] text-foreground sm:text-[2rem] lg:text-[2.25rem] lg:leading-[1.3]">
        El libro de clases en papel no cumple. Uno en PDF tampoco.
      </blockquote>
      <p class="mt-6 text-sm text-muted-foreground">
        La Circular N°30 del MINEDUC exige firma electrónica, trazabilidad y respaldo en nube. Lo que no es libro digital con esos tres pilares, no vale ante una fiscalización.
      </p>
    </div>
  </section>

  <!-- Features -->
  <section class="py-12 sm:py-14">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Conforme a Circular N°30 desde el primer día</h2>
          <p class="mt-4 text-base leading-relaxed text-muted-foreground">
            La Circular N°30 del MINEDUC exige que el libro de clases electrónico cumpla con requisitos de integridad, trazabilidad y respaldo. Ethoz los cumple todos.
          </p>
          <div class="mt-6 grid gap-4 sm:grid-cols-2">
            <div class="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div class="flex items-center gap-2">
                <BadgeCheck class="size-4 shrink-0 text-success" />
                <h3 class="text-sm font-semibold text-foreground">Firma electrónica</h3>
              </div>
              <p class="mt-2 text-xs text-muted-foreground">Cada registro de asistencia queda firmado digitalmente por el docente responsable, con timestamp inmutable.</p>
            </div>
            <div class="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div class="flex items-center gap-2">
                <BookOpen class="size-4 shrink-0 text-primary" />
                <h3 class="text-sm font-semibold text-foreground">Respaldo en nube</h3>
              </div>
              <p class="mt-2 text-xs text-muted-foreground">Datos replicados en 3 regiones. Disponibles para la Superintendencia de Educación ante cualquier fiscalización.</p>
            </div>
            <div class="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div class="flex items-center gap-2">
                <AlertTriangle class="size-4 shrink-0 text-warning-foreground" />
                <h3 class="text-sm font-semibold text-foreground">Alertas de riesgo</h3>
              </div>
              <p class="mt-2 text-xs text-muted-foreground">Alerta automática cuando un alumno supera el 15% de inasistencias. Notificación al apoderado y derivación a Orientación.</p>
            </div>
            <div class="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div class="flex items-center gap-2">
                <FileText class="size-4 shrink-0 text-primary" />
                <h3 class="text-sm font-semibold text-foreground">Reportes MINEDUC</h3>
              </div>
              <p class="mt-2 text-xs text-muted-foreground">Genera automáticamente el informe de asistencia mensual en el formato exigido por el MINEDUC para subvención escolar.</p>
            </div>
          </div>
        </div>

        <!-- Justification flow mockup -->
        <div class="rounded-xl border border-border bg-card shadow-mockup">
          <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <div class="size-2.5 rounded-full bg-destructive/60"></div>
            <div class="size-2.5 rounded-full bg-warning/60"></div>
            <div class="size-2.5 rounded-full bg-success/60"></div>
            <span class="ml-2 text-[11px] font-medium text-muted-foreground">Ethoz — Justificar inasistencia</span>
          </div>
          <div class="p-4 sm:p-5">
            <p class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Solicitud de justificación</p>
            <!-- Student info -->
            <div class="flex items-center gap-3 rounded-lg bg-muted/30 p-3 mb-3">
              <div class="size-8 rounded-full bg-primary/20 flex items-center justify-center text-[11px] font-bold text-primary">SR</div>
              <div>
                <p class="text-xs font-semibold text-foreground">Sebastián Pino Rojas</p>
                <p class="text-[10px] text-muted-foreground">7°B · Ausente: 9 y 10 abr 2026</p>
              </div>
            </div>
            <!-- Reason -->
            <div class="space-y-2 mb-3">
              <p class="text-[10px] font-medium text-foreground">Motivo seleccionado:</p>
              <div class="rounded-lg border-2 border-primary/30 bg-primary/5 px-3 py-2 flex items-center gap-2">
                <span class="size-1.5 rounded-full bg-primary"></span>
                <span class="text-xs text-foreground">Enfermedad con certificado médico</span>
              </div>
            </div>
            <!-- Document attached -->
            <div class="rounded-lg border border-border bg-muted/20 px-3 py-2 mb-3 flex items-center gap-2">
              <FileText class="size-4 shrink-0 text-muted-foreground" />
              <div class="flex-1 min-w-0">
                <p class="text-[10px] font-medium text-foreground truncate">certificado_dr_varela_09abr.pdf</p>
                <p class="text-[9px] text-muted-foreground">CESFAM Ñuñoa · Dr. R. Varela · 247 KB</p>
              </div>
              <CheckCircle2 class="size-3.5 shrink-0 text-success" />
            </div>
            <!-- Status -->
            <div class="rounded-lg bg-success/10 border border-success/20 px-3 py-2 flex items-center gap-2">
              <CheckCircle2 class="size-3.5 shrink-0 text-success" />
              <div>
                <p class="text-[11px] font-semibold text-success">Justificación aprobada</p>
                <p class="text-[9px] text-muted-foreground">Inspector J. Contreras · 10 abr 2026, 08:30</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Absence risk section -->
  <section class="bg-secondary py-12 sm:py-14">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">De la inasistencia al protocolo de intervención</h2>
        <p class="mt-3 text-base text-muted-foreground">Ethoz no solo registra — detecta el patrón y activa el flujo correcto.</p>
      </div>
      <div class="mt-10 grid gap-3 sm:grid-cols-4">
        {#each [
          { n: '1', label: 'Registro diario', desc: 'El docente registra asistencia desde el móvil. Sin papel, sin planilla.' },
          { n: '2', label: 'Detección automática', desc: 'Al superar 3 días consecutivos o 15% mensual, se activa la alerta.' },
          { n: '3', label: 'Notificación al apoderado', desc: 'El apoderado recibe un aviso con el detalle y el enlace para justificar.' },
          { n: '4', label: 'Derivación a Orientación', desc: 'Si el patrón persiste, el caso pasa automáticamente a la dupla psicosocial.' },
        ] as step}
          <div class="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div class="flex items-center gap-2.5 mb-3">
              <span class="size-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{step.n}</span>
              <h3 class="text-sm font-semibold text-foreground">{step.label}</h3>
            </div>
            <p class="text-xs leading-relaxed text-muted-foreground">{step.desc}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Por qué importa -->
  <section class="py-12 sm:py-14">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid gap-4 sm:grid-cols-3">
        <div class="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
          <p class="text-3xl font-bold text-destructive">20.000</p>
          <p class="mt-1 text-sm font-semibold text-foreground">UTM de multa máxima</p>
          <p class="mt-2 text-xs text-muted-foreground">Ley 21.719 — registros de asistencia de menores son datos personales sensibles con protección reforzada desde dic 2026</p>
        </div>
        <div class="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
          <p class="text-3xl font-bold text-primary">Circular N°30</p>
          <p class="mt-1 text-sm font-semibold text-foreground">libro electrónico obligatorio</p>
          <p class="mt-2 text-xs text-muted-foreground">El MINEDUC exige libro de clases electrónico para todos los establecimientos subvencionados desde 2024</p>
        </div>
        <div class="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
          <p class="text-3xl font-bold text-warning-foreground">15%</p>
          <p class="mt-1 text-sm font-semibold text-foreground">umbral de inasistencia</p>
          <p class="mt-2 text-xs text-muted-foreground">El MINEDUC obliga a intervenir antes de que un alumno supere el 15% de inasistencias. Ethoz lo detecta y activa el protocolo automáticamente.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Final CTA — dark navy editorial close -->
  <section class="bg-foreground py-20 text-background sm:py-24" aria-labelledby="attendance-cta">
    <div class="mx-auto max-w-3xl px-4 text-center sm:px-6">
      <span class="mx-auto block h-px w-12 bg-background/60" aria-hidden="true"></span>
      <p class="mt-6 text-[12px] font-semibold uppercase tracking-[0.14em] text-background/70">Asistencia · Conforme a Circular N°30</p>
      <h2 id="attendance-cta" class="mt-5 font-heading text-3xl font-medium leading-[1.1] tracking-tight text-background sm:text-4xl">
        Que el libro de clases deje de ser un riesgo y sea una herramienta.
      </h2>
      <p class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-background/80">
        Demo con los cursos de tu colegio cargados. Quince minutos.
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
          href="/productos"
          class="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-background/70 bg-transparent px-8 text-sm font-semibold text-background transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
        >
          Ver todos los módulos
        </a>
      </div>
    </div>
  </section>

  <Footer />
</main>
