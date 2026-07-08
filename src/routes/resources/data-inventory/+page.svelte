<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Printer, ArrowLeft } from '@lucide/svelte';
  import { BRAND } from '$lib/brand';
  import { t } from '$lib/i18n/index.svelte';

  const inventory = [
    {
      categoryKey: 'resDataInventory.cat_student_id' as const,
      sensitivityKey: 'resDataInventory.sens_basic' as const,
      sensitivityColor: 'green',
      fields: [
        { field: 'Nombre completo', baseLegal: 'Art. 13 b) · Contrato matrícula', finalidad: 'Gestión educativa, comunicaciones', retention: '5 años post egreso' },
        { field: 'RUT', baseLegal: 'Art. 13 b) · Contrato matrícula', finalidad: 'Identificación única, reportes MINEDUC', retention: '5 años post egreso' },
        { field: 'Fecha de nacimiento', baseLegal: 'Art. 13 b) · Contrato matrícula', finalidad: 'Matrícula SAE, estadísticas educativas', retention: '5 años post egreso' },
        { field: 'Fotografía', baseLegal: 'Art. 13 a) · Consentimiento', finalidad: 'Identificación visual, carnet escolar', retention: 'Vigencia matrícula' },
        { field: 'Dirección domicilio', baseLegal: 'Art. 13 b) · Contrato matrícula', finalidad: 'Contacto, verificación zona escolar', retention: '2 años post egreso' },
      ]
    },
    {
      categoryKey: 'resDataInventory.cat_guardians' as const,
      sensitivityKey: 'resDataInventory.sens_basic' as const,
      sensitivityColor: 'green',
      fields: [
        { field: 'Nombre completo apoderado titular', baseLegal: 'Art. 13 b) · Contrato matrícula', finalidad: 'Contacto principal, autorizaciones', retention: '5 años post egreso' },
        { field: 'RUT apoderado', baseLegal: 'Art. 13 b) · Contrato matrícula', finalidad: 'Identificación, verificación retiros', retention: '5 años post egreso' },
        { field: 'Teléfono de contacto', baseLegal: 'Art. 13 b) · Contrato matrícula', finalidad: 'Comunicaciones urgentes, emergencias', retention: 'Vigencia matrícula' },
        { field: 'Correo electrónico', baseLegal: 'Art. 13 b) · Contrato matrícula', finalidad: 'Comunicaciones académicas, circulares', retention: 'Vigencia matrícula' },
        { field: 'Parentesco con el alumno', baseLegal: 'Art. 13 b) · Contrato matrícula', finalidad: 'Determinar titularidad del consentimiento', retention: '5 años post egreso' },
        { field: 'Personas autorizadas para retiro', baseLegal: 'Art. 13 a) · Consentimiento', finalidad: 'Control de retiros y seguridad', retention: 'Hasta revocación' },
      ]
    },
    {
      categoryKey: 'resDataInventory.cat_academic' as const,
      sensitivityKey: 'resDataInventory.sens_basic' as const,
      sensitivityColor: 'green',
      fields: [
        { field: 'Notas y calificaciones', baseLegal: 'Art. 13 b) / Art. 13 c) · Ley General de Educación', finalidad: 'Evaluación aprendizaje, informes MINEDUC', retention: '5 años post egreso' },
        { field: 'Registro de asistencia', baseLegal: 'Art. 13 c) · Decreto 67 MINEDUC', finalidad: 'Control obligatorio, subvención estatal', retention: '5 años post egreso' },
        { field: 'Observaciones pedagógicas', baseLegal: 'Art. 13 b) / Art. 13 e) · Interés legítimo', finalidad: 'Seguimiento aprendizaje, apoyo docente', retention: '5 años post egreso' },
        { field: 'Informes de evaluación diferenciada (PIE)', baseLegal: 'Art. 13 a) · Consentimiento + Art. 13 c) · DL 170', finalidad: 'Adecuaciones curriculares, apoyos SEP', retention: '10 años post egreso' },
        { field: 'Registro de convivencia escolar', baseLegal: 'Art. 13 c) · Ley 20.536', finalidad: 'Gestión de convivencia, protocolos', retention: '5 años post egreso' },
      ]
    },
    {
      categoryKey: 'resDataInventory.cat_sensitive' as const,
      sensitivityKey: 'resDataInventory.sens_sensitive' as const,
      sensitivityColor: 'red',
      fields: [
        { field: 'Diagnósticos médicos y condiciones de salud', baseLegal: 'Art. 13 a) · Consentimiento explícito', finalidad: 'Atención primaria, primeros auxilios', retention: '10 años post egreso' },
        { field: 'Alergias y medicamentos', baseLegal: 'Art. 13 a) · Consentimiento explícito', finalidad: 'Prevención riesgos de salud en establecimiento', retention: 'Vigencia matrícula + 5 años' },
        { field: 'Ficha de salud mental (orientación)', baseLegal: 'Art. 13 a) · Consentimiento explícito', finalidad: 'Apoyo psicosocial, alertas de riesgo', retention: '5 años post egreso' },
        { field: 'Situación familiar (vulnerabilidad, Mejor Niñez)', baseLegal: 'Art. 13 a) · Consentimiento / Art. 13 c) · Ley 21.430', finalidad: 'Protección de la infancia, redes de apoyo', retention: '5 años post egreso' },
        { field: 'Alertas judiciales y órdenes de alejamiento', baseLegal: 'Art. 13 c) · Orden judicial', finalidad: 'Protección física del alumno, seguridad', retention: 'Mientras esté vigente la orden' },
      ]
    },
    {
      categoryKey: 'resDataInventory.cat_audit' as const,
      sensitivityKey: 'resDataInventory.sens_technical' as const,
      sensitivityColor: 'blue',
      fields: [
        { field: 'Logs de acceso al sistema', baseLegal: 'Art. 27 · Seguridad técnica', finalidad: 'Trazabilidad, detección de incidentes', retention: '2 años' },
        { field: 'Registros de retiro de alumnos', baseLegal: 'Art. 13 e) · Interés legítimo / Seguridad', finalidad: 'Trazabilidad, verificación en auditorías', retention: '5 años' },
        { field: 'Logs de modificaciones de datos', baseLegal: 'Art. 27 · Seguridad técnica', finalidad: 'Auditoría de cumplimiento, ARCO', retention: '3 años' },
        { field: 'Registros de consentimiento', baseLegal: 'Art. 14 · Documentación', finalidad: 'Prueba del consentimiento otorgado', retention: '5 años post expiración' },
      ]
    }
  ];

  const sensitivityStyle: Record<string, string> = {
    green: 'bg-success/10 text-success',
    red: 'bg-destructive/10 text-destructive',
    blue: 'bg-primary/10 text-primary-active',
  };
</script>

<svelte:head>
  <title>{t('resDataInventory.meta_title')}</title>
  <meta name="description" content={t('resDataInventory.meta_description')} />
  <meta property="og:url" content="https://ethoz.cl/resources/data-inventory" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={t('resDataInventory.og_title')} />
  <meta property="og:description" content={t('resDataInventory.og_description')} />
  <link rel="canonical" href="https://ethoz.cl/resources/data-inventory" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": "Inventario de Datos Personales para Colegios",
    "description": "Plantilla de inventario de datos personales conforme a la Ley 21.719.",
    "url": "https://ethoz.cl/resources/data-inventory",
    "publisher": { "@type": "Organization", "name": BRAND, "url": "https://ethoz.cl" }
  })}</script>`}
</svelte:head>

<!-- Skip link — WCAG 2.4.1 Bypass Blocks -->
<a
  href="#main-content"
  class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:border focus:border-foreground focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-foreground"
>
  {t('nav.skip_to_content')}
</a>

<div class="print:hidden">
  <NavBar />
</div>

<main id="main-content" class="min-h-dvh bg-background">
  <div class="print:hidden sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur-sm">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
      <Button href="/resources" variant="ghost" size="sm" class="gap-2 text-muted-foreground">
        <ArrowLeft class="size-4" />
        {t('resDataInventory.back_to_resources')}
      </Button>
      <Button href="/downloads/inventario-datos-personales.pdf" download size="lg" class="gap-2">
        <Printer class="size-4" />
        {t('resDataInventory.download_pdf')}
      </Button>
    </div>
  </div>

  <div class="mx-auto max-w-7xl px-4 py-10 sm:py-14">
    <div class="mb-12 border-b border-border pb-10">
      <p class="flex flex-wrap items-center gap-x-3 gap-y-1 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground print:hidden">
        <span class="text-primary">{t('resDataInventory.eyebrow_category')}</span>
        <span aria-hidden="true" class="hidden text-border sm:inline">·</span>
        <span>{t('resDataInventory.eyebrow_legal')}</span>
        <span aria-hidden="true" class="hidden text-border sm:inline">·</span>
        <span>{t('resDataInventory.eyebrow_count')}</span>
      </p>
      <span class="mt-5 block h-px w-12 bg-foreground print:hidden" aria-hidden="true"></span>
      <h1 class="mt-5 font-heading leading-[1.15] text-foreground">{t('resDataInventory.hero_title')}</h1>
      <p class="mt-6 max-w-[68ch] text-base leading-relaxed text-muted-foreground">{t('resDataInventory.hero_subtitle')}</p>
      <p class="mt-4 text-xs text-muted-foreground">{t('resDataInventory.version_line')}</p>
    </div>

    <!-- Legend -->
    <div class="mb-8 flex flex-wrap gap-3 text-xs">
      <div class="flex items-center gap-1.5"><span class="inline-block size-3 rounded-sm bg-success/20"></span> {t('resDataInventory.legend_basic')}</div>
      <div class="flex items-center gap-1.5"><span class="inline-block size-3 rounded-sm bg-destructive/20"></span> {t('resDataInventory.legend_sensitive')}</div>
      <div class="flex items-center gap-1.5"><span class="inline-block size-3 rounded-sm bg-primary/20"></span> {t('resDataInventory.legend_technical')}</div>
    </div>

    <!-- Inventory sections -->
    <div class="space-y-10">
      {#each inventory as section}
        <div>
          <div class="mb-3 flex items-center gap-3">
            <h2 class="text-base font-semibold text-foreground">{t(section.categoryKey)}</h2>
            <span class="rounded-full px-2.5 py-0.5 text-mockup-sm font-medium {sensitivityStyle[section.sensitivityColor]}">{t(section.sensitivityKey)}</span>
          </div>
          <div class="overflow-x-auto rounded-xl border border-border">
            <table class="w-full text-xs">
              <thead>
                <tr class="border-b border-border bg-muted/50">
                  <th class="px-4 py-2.5 text-left font-medium text-foreground min-w-[160px]">{t('resDataInventory.th_field')}</th>
                  <th class="px-4 py-2.5 text-left font-medium text-foreground min-w-[200px]">{t('resDataInventory.th_legal_basis')}</th>
                  <th class="px-4 py-2.5 text-left font-medium text-foreground min-w-[200px]">{t('resDataInventory.th_purpose')}</th>
                  <th class="px-4 py-2.5 text-left font-medium text-foreground min-w-[140px]">{t('resDataInventory.th_retention')}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border">
                {#each section.fields as row}
                  <tr class="hover:bg-muted/40 transition-colors">
                    <td class="px-4 py-2.5 font-medium text-foreground">{row.field}</td>
                    <td class="px-4 py-2.5 text-muted-foreground">{row.baseLegal}</td>
                    <td class="px-4 py-2.5 text-muted-foreground">{row.finalidad}</td>
                    <td class="px-4 py-2.5 text-muted-foreground">{row.retention}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {/each}
    </div>

    <!-- Notes -->
    <div class="mt-10 space-y-4">
      <div class="rounded-lg border border-warning/20 bg-warning/10 p-4 text-sm">
        <p class="font-medium text-warning-foreground mb-1">{t('resDataInventory.sensitive_note_title')}</p>
        <p class="text-warning-foreground text-xs">{t('resDataInventory.sensitive_note_body')}</p>
      </div>
      <div class="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
        <p class="font-medium text-foreground mb-1">{t('resDataInventory.legal_note_title')}</p>
        <p class="text-xs">{t('resDataInventory.legal_note_body')}</p>
      </div>
    </div>

    <div class="print:hidden mt-8 text-center">
      <p class="text-sm text-muted-foreground mb-4">{t('resDataInventory.cta_text')}</p>
      <Button href="/demo">{t('resDataInventory.cta_button')}</Button>
    </div>
  </div>
</main>

<div class="print:hidden">
  <Footer />
</div>

<style>
  @media print {
    :global(body) { font-size: 9px; color: #000; background: #fff; }
    main { padding: 0; }
  }
</style>
