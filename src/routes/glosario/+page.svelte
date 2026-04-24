<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { trackEvent } from '$lib/utils/analytics';
  import { ArrowRight } from '@lucide/svelte';

  $effect(() => {
    trackEvent('seo_page_viewed', { slug: 'glosario' });
  });

  interface Term {
    term: string;
    def: string;
    link?: string;
    tag?: string;
  }

  const glossary: Record<string, Term[]> = {
    A: [
      { term: 'ARCO+P', def: 'Conjunto de derechos que la Ley 21.719 garantiza a los titulares de datos: Acceso, Rectificación, Cancelación, Oposición y Portabilidad. Los colegios deben responder solicitudes en 30 días hábiles.', link: '/ley-21719#derechos-arco', tag: 'Ley 21.719' },
      { term: 'Apoderado', def: 'Persona mayor de edad designada como responsable legal de un estudiante ante el establecimiento. En protección de datos, ejerce los derechos ARCO+P en nombre de los menores a su cargo.', tag: 'Educación' },
      { term: 'Audit log', def: 'Registro cronológico e inmutable de acciones realizadas sobre datos o sistemas. Cada entrada incluye: quién realizó la acción, qué acción fue, sobre qué dato y cuándo. Exigido por la Circular N°30.', link: '/seguridad-datos', tag: 'Seguridad' },
    ],
    B: [
      { term: 'Bitácora', def: 'Registro sistemático de eventos o actividades en un contexto escolar. Bajo la Circular N°30, la bitácora digital de accesos y modificaciones al libro de clases debe ser inmutable y trazable.', tag: 'Educación' },
      { term: 'Brecha de seguridad', def: 'Incidente que provoca el acceso, modificación, pérdida o destrucción no autorizada de datos personales. La Ley 21.719 exige notificarla a la autoridad en un máximo de 72 horas.', link: '/seguridad-datos', tag: 'Ley 21.719' },
    ],
    C: [
      { term: 'Circular N°30', def: 'Normativa de la Superintendencia de Educación que regula el libro de clases digital en Chile. Exige trazabilidad, integridad, verificación de identidad (Clave Única) y disponibilidad para fiscalización.', link: '/circular-30', tag: 'Normativa' },
      { term: 'Consentimiento informado', def: 'Base de legitimación para el tratamiento de datos personales. Debe ser libre, específico, informado y verificable. Para datos de menores de 14 años, lo otorgan los padres o tutores legales.', link: '/ley-21719', tag: 'Ley 21.719' },
      { term: 'Confidencialidad', def: 'Principio de la Ley 21.719 que obliga a quienes acceden a datos personales a mantenerlos en reserva, incluso después de terminar su relación con el establecimiento.', tag: 'Ley 21.719' },
      { term: 'Convivencia escolar', def: 'Marco normativo y práctico que regula las relaciones entre los miembros de la comunidad escolar. Los registros del libro de convivencia son datos personales protegidos por la Ley 21.719.', tag: 'Educación' },
      { term: 'Cifrado at-rest', def: 'Técnica de seguridad que protege datos almacenados mediante algoritmos de cifrado. Garantiza que un acceso físico no autorizado al servidor no exponga datos legibles.', link: '/seguridad-datos', tag: 'Seguridad' },
    ],
    D: [
      { term: 'Datos sensibles', def: 'Categoría especial de datos personales que incluye origen étnico, salud, vida sexual, datos biométricos, opiniones políticas, creencias religiosas y datos de menores. Requieren consentimiento explícito.', link: '/ley-21719', tag: 'Ley 21.719' },
      { term: 'Directiva escolar', def: 'Equipo directivo de un establecimiento: director, subdirector, inspector general y UTP. En protección de datos, son los responsables de implementar las políticas de tratamiento.', tag: 'Educación' },
      { term: 'DPO', def: 'Delegado de Protección de Datos. Cargo obligatorio para responsables de tratamiento de datos a gran escala o datos sensibles. Actúa como punto de contacto entre el establecimiento, los titulares y la autoridad de control.', link: '/ley-21719#obligaciones', tag: 'Ley 21.719' },
      { term: 'DPIA', def: 'Evaluación de Impacto en Protección de Datos. Proceso obligatorio antes de implementar sistemas que traten datos personales a gran escala o datos sensibles. Identifica y mitiga riesgos de privacidad.', tag: 'Ley 21.719' },
    ],
    I: [
      { term: 'Inventario de datos', def: 'Registro interno que documenta qué datos personales trata el colegio, con qué finalidad, quién los accede, cuánto tiempo se conservan y con qué medidas de seguridad. Obligatorio bajo la Ley 21.719.', link: '/ley-21719#obligaciones', tag: 'Ley 21.719' },
    ],
    L: [
      { term: 'Ley 21.663 (Ciberseguridad)', def: 'Ley Marco de Ciberseguridad de Chile, promulgada en 2024. Aplica a operadores de servicios esenciales e infraestructura crítica. Establece obligaciones de reporte de incidentes y gestión de vulnerabilidades.', tag: 'Normativa' },
      { term: 'Ley 21.719 (Protección de Datos)', def: 'Nueva ley de protección de datos personales de Chile, promulgada el 13 de diciembre de 2024. Reemplaza la Ley 19.628. Plena vigencia en diciembre de 2026. Multas hasta 20.000 UTM o 4% de la facturación.', link: '/ley-21719', tag: 'Normativa' },
      { term: 'Ley Aula Segura', def: 'Ley 21.128 que refuerza las herramientas disciplinarias de los establecimientos escolares, incluyendo suspensión y expulsión. Los registros asociados son datos personales sensibles.', tag: 'Normativa' },
      { term: 'Libro de clases digital', def: 'Sistema digital que reemplaza el libro de clases en papel. Para cumplir la Circular N°30, debe garantizar integridad, trazabilidad, autenticación robusta y disponibilidad para la Superintendencia.', link: '/circular-30', tag: 'Normativa' },
    ],
    O: [
      { term: 'Observaciones por categoría', def: 'Clasificación de anotaciones en el libro de clases por tipo: conducta, académico, asistencia, convivencia. Cada categoría puede tener distintos niveles de acceso según el rol del usuario.', tag: 'Educación' },
      { term: 'Orden de alejamiento', def: 'Medida judicial que prohíbe a una persona acercarse a otra. El colegio debe registrar y actuar conforme a órdenes de alejamiento en el sistema de control de acceso y retiros.', tag: 'Seguridad' },
    ],
    P: [
      { term: 'Portería', def: 'Punto de control de acceso físico del establecimiento. En Ethoz, la portería es un módulo con verificación de identidad, control de retiros y alertas en tiempo real para el personal autorizado.', tag: 'Seguridad' },
      { term: 'Privacidad por diseño', def: 'Principio que exige incorporar la protección de datos desde el diseño de sistemas y procesos, no como añadido posterior. Obligación implícita de la Ley 21.719 y estándar de buenas prácticas internacionales.', link: '/seguridad-datos', tag: 'Ley 21.719' },
      { term: 'Protocolo de retiro', def: 'Procedimiento documentado que establece cómo se autoriza, verifica y registra el retiro de un estudiante. Debe incluir verificación de identidad del adulto y registro del responsable que autorizó.', tag: 'Seguridad' },
    ],
    R: [
      { term: 'RBD', def: 'Rol Base de Datos. Identificador único asignado por el Ministerio de Educación a cada establecimiento educacional en Chile. Número de referencia estándar en todos los sistemas del sector educacional.', tag: 'Educación' },
      { term: 'Retiro escolar', def: 'Proceso de salida de un estudiante del establecimiento durante la jornada escolar. Requiere autorización del apoderado y verificación de identidad del adulto que retira. Ethoz digitaliza y audita este proceso.', tag: 'Seguridad' },
      { term: 'RLS', def: 'Row-Level Security. Mecanismo de seguridad en bases de datos que filtra los datos que cada usuario puede ver a nivel de fila, según su rol. Implementado en Ethoz vía Supabase.', link: '/seguridad-datos', tag: 'Seguridad' },
    ],
    S: [
      { term: 'Seudonimización', def: 'Técnica que reemplaza identificadores directos (nombre, RUT) por seudónimos, reduciendo el riesgo de re-identificación. Los datos seudonimizados siguen siendo datos personales bajo la Ley 21.719.', tag: 'Ley 21.719' },
      { term: 'Sostenedor', def: 'Persona jurídica responsable de la administración de uno o más establecimientos educacionales. Puede ser municipio, corporación, fundación o empresa. Es el responsable principal del tratamiento de datos bajo la Ley 21.719.', tag: 'Educación' },
    ],
    T: [
      { term: 'Tutor legal', def: 'Persona designada legalmente como responsable de un menor cuando los padres no están disponibles o han sido privados de la tuición. Ejerce los derechos ARCO+P en nombre del menor.', tag: 'Educación' },
    ],
    U: [
      { term: 'UTP', def: 'Unidad Técnico-Pedagógica. Unidad responsable de la gestión curricular y pedagógica del establecimiento. Accede a datos académicos del libro de clases; bajo la Circular N°30 y la Ley 21.719, su acceso debe estar controlado y auditado.', tag: 'Educación' },
    ],
    V: [
      { term: 'Verificación de identidad', def: 'Proceso de confirmar que una persona es quien dice ser. Bajo la Circular N°30, el estándar de referencia es la Clave Única del Estado. En portería, puede incluir validación de RUT, huella dactilar o reconocimiento facial.', link: '/circular-30', tag: 'Seguridad' },
    ],
  };

  const allLetters = Object.keys(glossary).sort();
  const totalTerms = Object.values(glossary).reduce((sum, arr) => sum + arr.length, 0);

  const tagColors: Record<string, string> = {
    'Ley 21.719': 'text-primary',
    'Normativa': 'text-primary',
    'Seguridad': 'text-foreground',
    'Educación': 'text-muted-foreground',
  };
</script>

<svelte:head>
  <title>Glosario Ethoz — términos clave para la protección escolar | Ethoz</title>
  <meta name="description" content="Glosario completo de términos de protección escolar y cumplimiento normativo en Chile: Ley 21.719, Circular N°30, ARCO+P, RLS, DPO, RBD, sostenedor y más." />
  <meta property="og:title" content="Glosario Ethoz — términos de protección escolar" />
  <meta property="og:description" content="Glosario completo de términos de protección escolar y cumplimiento normativo en Chile: Ley 21.719, Circular N°30, ARCO+P, RLS, DPO, RBD, sostenedor y más." />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://ethoz.cl/glosario" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="canonical" href="https://ethoz.cl/glosario" />
  {@html `<script type="application/ld+json">${JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "DefinedTermSet",
      "name": "Glosario Ethoz — protección escolar y cumplimiento normativo",
      "description": "Glosario completo de términos de protección escolar y cumplimiento normativo en Chile.",
      "url": "https://ethoz.cl/glosario",
      "publisher": { "@type": "Organization", "name": "Ethoz", "logo": { "@type": "ImageObject", "url": "https://ethoz.cl/favicon.svg" }}
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://ethoz.cl/" },
        { "@type": "ListItem", "position": 2, "name": "Glosario", "item": "https://ethoz.cl/glosario" }
      ]
    }
  ])}</script>`}
</svelte:head>

<main class="min-h-screen bg-background">
  <NavBar />

  <!-- HERO -->
  <section class="pt-24 pb-12 sm:pt-28 sm:pb-16">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <p class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        <span class="text-primary">Referencia</span>
        <span aria-hidden="true" class="text-border">·</span>
        <span><span data-numeric>{totalTerms}</span> términos</span>
        <span aria-hidden="true" class="text-border">·</span>
        <span>{allLetters.length} secciones</span>
      </p>

      <span class="mt-6 block h-px w-12 bg-foreground" aria-hidden="true"></span>

      <h1 class="mt-6 font-heading text-[2rem] font-medium italic leading-[1.15] tracking-tight text-foreground sm:text-[2.5rem] lg:text-[3rem]">
        El vocabulario precede al cumplimiento.
      </h1>

      <p class="mt-8 max-w-[68ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
        Términos clave para entender la protección escolar, el cumplimiento normativo y la seguridad de datos en establecimientos educacionales chilenos. Cada definición incluye la norma que la respalda y enlaces a los documentos donde se aplica.
      </p>

      <!-- Alphabet nav -->
      <nav class="mt-10 flex flex-wrap gap-1.5" aria-label="Navegación alfabética">
        {#each allLetters as letter}
          <a
            href="#{letter}"
            class="flex size-9 items-center justify-center border border-border bg-card font-heading text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/40 hover:border-foreground hover:text-foreground rounded-md"
          >
            {letter}
          </a>
        {/each}
      </nav>
    </div>
  </section>

  <!-- GLOSSARY -->
  <div class="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
    <div class="space-y-20">
      {#each allLetters as letter, i}
        <!-- Editorial break every 4 letters -->
        {#if i > 0 && i % 4 === 0}
          <div class="py-6 text-center">
            <span class="mx-auto block h-px w-12 bg-border" aria-hidden="true"></span>
          </div>
        {/if}

        <section id={letter}>
          <div class="flex items-baseline justify-between border-b border-border pb-4">
            <h2 class="font-heading text-6xl font-medium leading-none text-foreground sm:text-7xl">{letter}</h2>
            <span class="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground" data-numeric>
              {glossary[letter].length} {glossary[letter].length === 1 ? 'término' : 'términos'}
            </span>
          </div>
          <dl class="mt-8 divide-y divide-border border-b border-border">
            {#each glossary[letter] as item}
              <div class="grid gap-3 py-6 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] sm:gap-8">
                <dt>
                  <dfn class="font-heading text-lg font-medium not-italic text-foreground">{item.term}</dfn>
                  {#if item.tag}
                    <p class="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] {tagColors[item.tag] ?? 'text-muted-foreground'}">{item.tag}</p>
                  {/if}
                </dt>
                <dd>
                  <p class="text-sm leading-relaxed text-muted-foreground">{item.def}</p>
                  {#if item.link}
                    <a href={item.link} class="mt-3 inline-flex items-center gap-1 border-b border-primary pb-0.5 text-xs font-semibold text-primary hover:border-b-2">
                      Ver documento <ArrowRight class="size-3" />
                    </a>
                  {/if}
                </dd>
              </div>
            {/each}
          </dl>
        </section>
      {/each}
    </div>
  </div>

  <!-- FINAL CTA -->
  <section class="bg-foreground py-20 text-background sm:py-24" aria-labelledby="final-cta-glossary">
    <div class="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
      <span class="mx-auto block h-px w-12 bg-background/60" aria-hidden="true"></span>
      <p class="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-background/70">Consulta especializada</p>
      <h2 id="final-cta-glossary" class="mt-5 font-heading text-3xl font-medium leading-[1.15] tracking-tight text-background sm:text-4xl">
        ¿Hay un término que no encontró?
      </h2>
      <p class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-background/80">
        Este glosario se actualiza continuamente. Si tiene dudas sobre normativa escolar o protección de datos, nuestro equipo puede responderlas directamente.
      </p>
      <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href="/demo"
          class="inline-flex h-14 items-center justify-center gap-2 rounded-md bg-background px-10 text-base font-semibold text-foreground transition-colors hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
        >
          Hablar con un especialista
          <ArrowRight class="size-5" />
        </a>
        <a href="/ley-21719" class="inline-flex items-center gap-1 border-b border-background/60 pb-0.5 text-sm font-medium text-background/80 transition-colors hover:border-background hover:text-background">
          Guía Ley 21.719
        </a>
      </div>
    </div>
  </section>

  <section class="py-12 bg-background border-t border-border">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-5">También puede interesarle</p>
      <div class="flex flex-wrap gap-3">
        {#each [
          { href: '/ley-21719', label: 'Ley 21.719 — guía completa' },
          { href: '/circular-30', label: 'Circular N°30 — libro de clases digital' },
          { href: '/seguridad-datos', label: 'Seguridad de datos en Ethoz' },
          { href: '/comparativa', label: 'Comparativa de plataformas' },
          { href: '/compliance', label: 'Cumplimiento normativo' },
        ] as item}
          <a href={item.href} class="border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted/40 hover:border-foreground hover:text-foreground rounded-md">
            {item.label}
          </a>
        {/each}
      </div>
    </div>
  </section>

  <Footer />
</main>
