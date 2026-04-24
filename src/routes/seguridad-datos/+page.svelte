<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { trackEvent } from '$lib/utils/analytics';
  import {
    ShieldCheck,
    Lock,
    Database,
    ArrowRight,
    CheckCircle,
    Eye,
    Server,
    Clock,
    Key,
    FileText,
    AlertTriangle,
    RefreshCw,
    Globe,
  } from '@lucide/svelte';

  $effect(() => {
    trackEvent('seo_page_viewed', { slug: 'seguridad-datos' });
  });

  const toc = [
    { href: '#cifrado', label: 'Cifrado en tránsito y at-rest', n: '01' },
    { href: '#rls', label: 'Row-Level Security', n: '02' },
    { href: '#autenticacion', label: 'Autenticación y sesiones', n: '03' },
    { href: '#audit-log', label: 'Audit log', n: '04' },
    { href: '#aislamiento', label: 'Aislamiento por colegio', n: '05' },
    { href: '#respaldo', label: 'Respaldo y recuperación', n: '06' },
    { href: '#infraestructura', label: 'Infraestructura', n: '07' },
    { href: '#cumplimiento', label: 'Cumplimiento normativo', n: '08' },
    { href: '#divulgacion', label: 'Divulgación responsable', n: '09' },
  ];

  const infraItems = [
    { name: 'Supabase (Postgres)', location: 'AWS São Paulo (sa-east-1)', role: 'Base de datos principal, Auth, RLS, Storage' },
    { name: 'Firebase Hosting', location: 'CDN global (Google)', role: 'Hosting del frontend, distribución de assets' },
    { name: 'Cloudflare', location: 'Red global edge', role: 'DNS, DDoS protection, WAF, TLS termination' },
  ];

  const complianceItems = [
    { label: 'Ley 21.719 by design', desc: 'Privacidad incorporada desde el diseño. Control de acceso, audit log y minimización de datos son nativos, no añadidos.' },
    { label: 'GDPR-compatible', desc: 'Derechos de acceso, rectificación, supresión y portabilidad implementados. Consentimiento granular y trazable.' },
    { label: 'Circular N°30', desc: 'Trazabilidad e integridad del libro de clases digital cumplidas mediante audit log inmutable y autenticación robusta.' },
    { label: 'SOC 2 roadmap', desc: 'Proceso de certificación SOC 2 Type II en planificación para 2026. Controles técnicos ya implementados.' },
  ];
</script>

<svelte:head>
  <title>Seguridad de datos en Ethoz — por diseño, no por parche | Ethoz</title>
  <meta name="description" content="Cómo Ethoz protege los datos de su colegio: TLS 1.3, cifrado at-rest, Row-Level Security, audit log, backups diarios y cumplimiento Ley 21.719 por diseño." />
  <meta property="og:title" content="Seguridad de datos en Ethoz — por diseño, no por parche" />
  <meta property="og:description" content="Cómo Ethoz protege los datos de su colegio: TLS 1.3, cifrado at-rest, Row-Level Security, audit log, backups diarios y Ley 21.719." />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://ethoz.cl/seguridad-datos" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="canonical" href="https://ethoz.cl/seguridad-datos" />
  {@html `<script type="application/ld+json">${JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Seguridad de datos en Ethoz — por diseño, no por parche",
      "description": "Cómo Ethoz protege los datos de su colegio: TLS 1.3, cifrado at-rest, Row-Level Security, audit log, backups diarios y Ley 21.719.",
      "datePublished": "2026-04-07",
      "dateModified": "2026-04-07",
      "author": { "@type": "Organization", "name": "Ethoz" },
      "publisher": { "@type": "Organization", "name": "Ethoz", "logo": { "@type": "ImageObject", "url": "https://ethoz.cl/favicon.svg" }},
      "url": "https://ethoz.cl/seguridad-datos",
      "mainEntityOfPage": "https://ethoz.cl/seguridad-datos",
      "keywords": "seguridad datos ethoz, como protege ethoz datos, cifrado datos colegio, row level security educacion"
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://ethoz.cl/" },
        { "@type": "ListItem", "position": 2, "name": "Seguridad de datos", "item": "https://ethoz.cl/seguridad-datos" }
      ]
    }
  ])}</script>`}
</svelte:head>

<main class="min-h-screen bg-background">
  <NavBar />

  <!-- HERO -->
  <section class="pt-24 pb-12 sm:pt-28 sm:pb-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <p class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        <span class="text-primary">Documento técnico · 03</span>
        <span aria-hidden="true" class="text-border">·</span>
        <span>Arquitectura de seguridad</span>
        <span aria-hidden="true" class="text-border">·</span>
        <span>10 min de lectura</span>
      </p>

      <span class="mt-6 block h-px w-12 bg-foreground" aria-hidden="true"></span>

      <h1 class="mt-6 font-heading text-[2rem] font-medium italic leading-[1.15] tracking-tight text-foreground sm:text-[2.5rem] lg:text-[3rem]">
        La seguridad no es una capa sobre el producto — es el producto.
      </h1>

      <p class="mt-8 max-w-[68ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
        Por diseño, no por parche. Cada decisión de arquitectura en Ethoz —cifrado, aislamiento por colegio, Row-Level Security, audit log inmutable— tiene un fundamento en la protección de los datos de su comunidad escolar. Este documento describe esas decisiones con el detalle suficiente para una revisión técnica institucional.
      </p>

      <dl class="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-6 sm:grid-cols-4">
        <div>
          <dt class="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Cifrado en tránsito</dt>
          <dd class="mt-1 text-sm font-medium text-foreground">TLS 1.3</dd>
        </div>
        <div>
          <dt class="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Cifrado at-rest</dt>
          <dd class="mt-1 text-sm font-medium text-foreground">AES-256</dd>
        </div>
        <div>
          <dt class="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Aislamiento</dt>
          <dd class="mt-1 text-sm font-medium text-foreground">RLS Postgres</dd>
        </div>
        <div>
          <dt class="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Región datos</dt>
          <dd class="mt-1 text-sm font-medium text-foreground">São Paulo</dd>
        </div>
      </dl>
    </div>
  </section>

  <!-- BODY with sticky TOC -->
  <div class="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
    <div class="grid gap-12 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] lg:gap-16">

      <aside class="lg:sticky lg:top-24 lg:self-start">
        <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Contenido</p>
        <nav class="mt-4 border-l border-border" aria-label="Índice del documento">
          <ol class="space-y-1">
            {#each toc as item}
              <li>
                <a href={item.href} class="group flex items-baseline gap-3 -ml-px border-l border-transparent py-1.5 pl-4 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground">
                  <span class="font-heading text-xs text-primary tabular-nums group-hover:text-primary" data-numeric>{item.n}</span>
                  <span>{item.label}</span>
                </a>
              </li>
            {/each}
          </ol>
        </nav>
      </aside>

      <article class="max-w-[68ch] space-y-20">

        <!-- CIFRADO -->
        <section id="cifrado">
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary" data-numeric>01 · Transporte y almacenamiento</p>
          <h2 class="mt-3 font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">Cifrado en tránsito y at-rest</h2>
          <div class="mt-8 grid gap-5 sm:grid-cols-2">
            <div class="border border-border bg-card p-5 rounded-lg">
              <div class="flex items-center gap-2.5">
                <Globe class="size-4 shrink-0 text-primary" />
                <h3 class="text-sm font-semibold text-foreground">En tránsito · TLS 1.3</h3>
              </div>
              <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
                Toda comunicación entre el navegador del usuario y los servidores de Ethoz utiliza <strong class="text-foreground">TLS 1.3</strong>. Cloudflare actúa como capa de terminación TLS, con certificados gestionados automáticamente y renovación antes de vencimiento.
              </p>
            </div>
            <div class="border border-border bg-card p-5 rounded-lg">
              <div class="flex items-center gap-2.5">
                <Database class="size-4 shrink-0 text-primary" />
                <h3 class="text-sm font-semibold text-foreground">At-rest · AES-256</h3>
              </div>
              <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
                Los datos almacenados en la base Postgres de Supabase están cifrados con <strong class="text-foreground">AES-256</strong>. Las claves son gestionadas por AWS KMS en la región São Paulo. Un acceso físico no autorizado al servidor no permite leer datos en texto plano.
              </p>
            </div>
          </div>
        </section>

        <!-- RLS -->
        <section id="rls">
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary" data-numeric>02 · Control de acceso</p>
          <h2 class="mt-3 font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">Row-Level Security</h2>
          <p class="mt-6 text-base leading-relaxed text-muted-foreground">
            Row-Level Security es el mecanismo de control de acceso más granular disponible en bases de datos relacionales. En Ethoz, cada consulta es evaluada por una política RLS antes de retornar cualquier resultado.
          </p>

          <blockquote class="mt-10 border-l-2 border-primary pl-6 font-heading text-[1.5rem] font-normal italic leading-[1.4] text-foreground">
            Sin autenticación válida, RLS retorna cero filas — independientemente de la tabla consultada.
          </blockquote>

          <h3 class="mt-10 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Cómo funciona en la práctica</h3>
          <ul class="mt-4 space-y-3 border-l border-border pl-6">
            <li class="text-sm leading-relaxed text-muted-foreground"><strong class="text-foreground">Un docente</strong> consulta asistencia → RLS retorna solo los registros de sus propios cursos.</li>
            <li class="text-sm leading-relaxed text-muted-foreground"><strong class="text-foreground">Un inspector</strong> consulta asistencia global → RLS retorna datos del establecimiento completo, sin informes psicológicos.</li>
            <li class="text-sm leading-relaxed text-muted-foreground"><strong class="text-foreground">Un sostenedor</strong> consulta métricas → RLS retorna datos agregados de todos sus colegios, sin datos individuales de estudiantes.</li>
            <li class="text-sm leading-relaxed text-muted-foreground"><strong class="text-foreground">Solicitud sin autenticación</strong> → cero filas, sin importar la tabla.</li>
          </ul>

          <p class="mt-6 text-sm leading-relaxed text-muted-foreground">
            Esta arquitectura garantiza el principio de <strong class="text-foreground">mínimo privilegio</strong> exigido implícitamente por la Ley 21.719 y explícitamente por las buenas prácticas de protección de datos.
          </p>
        </section>

        <!-- AUTENTICACIÓN -->
        <section id="autenticacion">
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary" data-numeric>03 · Identidad</p>
          <h2 class="mt-3 font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">Autenticación y sesiones</h2>
          <dl class="mt-8 divide-y divide-border border-y border-border">
            {#each [
              { title: 'Supabase Auth con JWT', body: 'La autenticación usa Supabase Auth con JSON Web Tokens firmados en RS256. Cada token contiene el identificador del usuario y su rol, verificado por RLS en cada consulta.', icon: Key },
              { title: 'Sesiones con expiración automática', body: 'Los tokens de acceso tienen expiración corta (1 hora por defecto). Los refresh tokens permiten renovación silenciosa mientras la sesión está activa, y se invalidan al cerrar sesión o tras inactividad.', icon: Clock },
              { title: 'Rotación de tokens', body: 'Cada renovación genera un nuevo refresh token e invalida el anterior. Esto limita el impacto de un token comprometido: la ventana de uso es acotada.', icon: RefreshCw },
              { title: 'Multi-factor authentication (roadmap)', body: 'MFA mediante TOTP está en el roadmap para cuentas de directivos y sostenedores. Supabase Auth soporta MFA nativamente.', icon: ShieldCheck },
            ] as item}
              {@const Icon = item.icon}
              <div class="grid gap-3 py-6 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-8">
                <dt class="flex items-center gap-2.5">
                  <Icon class="size-4 shrink-0 text-primary" />
                  <span class="font-semibold text-foreground">{item.title}</span>
                </dt>
                <dd class="text-sm leading-relaxed text-muted-foreground">{item.body}</dd>
              </div>
            {/each}
          </dl>
        </section>

        <!-- AUDIT LOG -->
        <section id="audit-log">
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary" data-numeric>04 · Trazabilidad</p>
          <h2 class="mt-3 font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">Audit log</h2>
          <p class="mt-6 text-base leading-relaxed text-muted-foreground">
            Cada acción sensible queda registrada en un log de auditoría inmutable. No es posible eliminar entradas sin acceso directo a la base de datos con privilegios de administrador.
          </p>

          <div class="mt-8 border border-border bg-card rounded-lg overflow-hidden">
            <div class="border-b border-border bg-muted/50 px-5 py-3">
              <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Estructura de una entrada del audit log</p>
            </div>
            <div class="p-5">
              <pre class="text-xs leading-relaxed text-muted-foreground overflow-x-auto"><code>{`{
  "id":         "uuid",
  "timestamp":  "2026-04-07T14:32:11.000Z",
  "user_id":    "uuid-del-usuario",
  "user_role":  "docente",
  "action":     "UPDATE",
  "resource":   "libro_clases.asistencia",
  "record_id":  "uuid-del-registro",
  "old_value":  { "presente": true },
  "new_value":  { "presente": false },
  "ip_address": "192.168.1.xxx",
  "user_agent": "Mozilla/5.0 ..."
}`}</code></pre>
            </div>
          </div>

          <dl class="mt-10 divide-y divide-border border-y border-border">
            {#each [
              { label: 'Qué acciones se registran', items: ['Modificaciones al libro de clases', 'Retiros de estudiantes', 'Cambios de contraseña', 'Acceso a datos sensibles', 'Exportaciones de datos'] },
              { label: 'Quién puede consultar el log', items: ['Director del establecimiento', 'Sostenedor (vista agregada)', 'Autoridades de fiscalización', 'Ethoz (soporte técnico)'] },
              { label: 'Retención', items: ['Mínimo 5 años por defecto', 'Configurable por sostenedor', 'Cumple plazos Ley 21.719', 'Exportable en CSV/JSON'] },
            ] as auditItem}
              <div class="grid gap-3 py-6 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-8">
                <dt class="text-sm font-semibold text-foreground">{auditItem.label}</dt>
                <dd>
                  <ul class="space-y-1.5">
                    {#each auditItem.items as item}
                      <li class="flex gap-2 text-sm text-muted-foreground">
                        <CheckCircle class="size-4 shrink-0 text-primary mt-0.5" />
                        <span>{item}</span>
                      </li>
                    {/each}
                  </ul>
                </dd>
              </div>
            {/each}
          </dl>
        </section>

        <!-- AISLAMIENTO -->
        <section id="aislamiento">
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary" data-numeric>05 · Tenancy</p>
          <h2 class="mt-3 font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">Aislamiento de datos por colegio</h2>
          <p class="mt-6 text-base leading-relaxed text-muted-foreground">
            Cada colegio y cada sede tienen sus datos aislados mediante políticas RLS. No existe mecanismo por el cual un usuario de un colegio pueda acceder a datos de otro establecimiento, incluso si ambos pertenecen al mismo sostenedor.
          </p>
          <h3 class="mt-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Jerarquía de aislamiento</h3>
          <dl class="mt-4 divide-y divide-border border-y border-border">
            {#each [
              { level: 'Sostenedor', desc: 've métricas agregadas de todos sus colegios' },
              { level: 'Colegio', desc: 've solo sus propios datos, sin cruce con otros' },
              { level: 'Sede', desc: 'para sostenedores multi-sede, cada sede es un ámbito independiente' },
              { level: 'Rol', desc: 'cada usuario accede solo a lo que su rol permite dentro de su colegio' },
            ] as item}
              <div class="grid gap-3 py-4 sm:grid-cols-[minmax(0,8rem)_minmax(0,1fr)] sm:gap-8">
                <dt class="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">{item.level}</dt>
                <dd class="text-sm leading-relaxed text-muted-foreground">{item.desc}</dd>
              </div>
            {/each}
          </dl>
        </section>

        <!-- RESPALDO -->
        <section id="respaldo">
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary" data-numeric>06 · Continuidad</p>
          <h2 class="mt-3 font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">Respaldo y recuperación</h2>
          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            {#each [
              { title: 'Backups diarios automáticos', desc: 'Supabase realiza snapshots completos de la base cada 24 horas. Los backups se almacenan en S3 con cifrado AES-256 y replicación en múltiples zonas.' },
              { title: 'Point-in-time recovery', desc: 'Es posible restaurar la base a cualquier punto en el tiempo dentro de la ventana de retención (hasta 30 días). Crítico ante ransomware o eliminación accidental.' },
              { title: 'RTO y RPO', desc: 'Recovery Time Objective: menos de 4 horas para incidentes mayores. Recovery Point Objective: máximo 24 horas de pérdida (un ciclo de backup).' },
              { title: 'Plan de continuidad', desc: 'Ethoz mantiene un plan de recuperación ante desastres documentado. Los colegios son notificados ante cualquier incidente que afecte la disponibilidad.' },
            ] as rtoItem}
              <div class="border border-border bg-card p-5 rounded-lg">
                <h3 class="text-sm font-semibold text-foreground">{rtoItem.title}</h3>
                <p class="mt-2 text-sm leading-relaxed text-muted-foreground">{rtoItem.desc}</p>
              </div>
            {/each}
          </div>
        </section>

        <!-- INFRAESTRUCTURA -->
        <section id="infraestructura">
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary" data-numeric>07 · Stack</p>
          <h2 class="mt-3 font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">Infraestructura</h2>
          <p class="mt-6 text-base leading-relaxed text-muted-foreground">
            Ethoz opera sobre infraestructura de clase empresarial, seleccionada por su madurez en seguridad, disponibilidad geográfica en la región y compliance con estándares internacionales.
          </p>
          <div class="mt-8 border-y border-border">
            <div class="grid grid-cols-3 gap-4 py-3 border-b border-border">
              <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Componente</p>
              <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Ubicación</p>
              <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Función</p>
            </div>
            {#each infraItems as item, i}
              <div class="grid grid-cols-3 gap-4 py-4 {i !== infraItems.length - 1 ? 'border-b border-border' : ''}">
                <p class="text-sm font-semibold text-foreground">{item.name}</p>
                <p class="text-sm text-muted-foreground">{item.location}</p>
                <p class="text-sm text-muted-foreground">{item.role}</p>
              </div>
            {/each}
          </div>
          <p class="mt-6 text-sm leading-relaxed text-muted-foreground">
            Los datos de los colegios chilenos se almacenan en la región <strong class="text-foreground">AWS São Paulo</strong>, la más cercana a Chile disponible en Supabase y con tiempos de latencia óptimos para usuarios en el país.
          </p>
        </section>

        <!-- CUMPLIMIENTO -->
        <section id="cumplimiento">
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary" data-numeric>08 · Marco normativo</p>
          <h2 class="mt-3 font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">Cumplimiento normativo</h2>
          <dl class="mt-8 divide-y divide-border border-y border-border">
            {#each complianceItems as item}
              <div class="grid gap-3 py-6 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-8">
                <dt class="flex items-start gap-2.5">
                  <CheckCircle class="size-4 shrink-0 text-primary mt-0.5" />
                  <span class="font-semibold text-foreground">{item.label}</span>
                </dt>
                <dd class="text-sm leading-relaxed text-muted-foreground">{item.desc}</dd>
              </div>
            {/each}
          </dl>
        </section>

        <!-- DIVULGACIÓN -->
        <section id="divulgacion">
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary" data-numeric>09 · Reporte</p>
          <h2 class="mt-3 font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">Divulgación responsable</h2>
          <p class="mt-6 text-base leading-relaxed text-muted-foreground">
            Si descubre una vulnerabilidad de seguridad en Ethoz, le pedimos que la reporte de forma responsable antes de divulgarla públicamente.
          </p>
          <dl class="mt-8 divide-y divide-border border-y border-border">
            <div class="grid gap-3 py-6 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-8">
              <dt class="font-semibold text-foreground">Cómo reportar</dt>
              <dd class="text-sm leading-relaxed text-muted-foreground">
                Envíe un correo a <strong class="text-foreground">security@ethoz.cl</strong> con descripción del hallazgo, pasos para reproducirlo y el impacto estimado.
              </dd>
            </div>
            <div class="grid gap-3 py-6 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-8">
              <dt class="font-semibold text-foreground">Nuestro compromiso</dt>
              <dd>
                <ul class="space-y-1.5">
                  <li class="flex gap-2 text-sm text-muted-foreground"><CheckCircle class="size-4 shrink-0 text-primary mt-0.5" /><span>Respuesta en máximo 48 horas</span></li>
                  <li class="flex gap-2 text-sm text-muted-foreground"><CheckCircle class="size-4 shrink-0 text-primary mt-0.5" /><span>Comunicación del estado de la corrección</span></li>
                  <li class="flex gap-2 text-sm text-muted-foreground"><CheckCircle class="size-4 shrink-0 text-primary mt-0.5" /><span>Reconocimiento público si el investigador lo desea</span></li>
                  <li class="flex gap-2 text-sm text-muted-foreground"><CheckCircle class="size-4 shrink-0 text-primary mt-0.5" /><span>Bug bounty en evaluación para 2026</span></li>
                </ul>
              </dd>
            </div>
          </dl>
        </section>

      </article>
    </div>
  </div>

  <!-- FINAL CTA -->
  <section class="bg-foreground py-20 text-background sm:py-24" aria-labelledby="final-cta-sec">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
      <span class="mx-auto block h-px w-12 bg-background/60" aria-hidden="true"></span>
      <p class="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-background/85">Sesión técnica</p>
      <h2 id="final-cta-sec" class="mt-5 font-heading text-3xl font-medium leading-[1.15] tracking-tight text-background sm:text-4xl">
        ¿Quiere revisar el modelo de seguridad en detalle?
      </h2>
      <p class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-background/80">
        Sesión con el equipo técnico. Respondemos preguntas específicas de su DPO o responsable de TI y evaluamos compatibilidad con los requisitos de su colegio.
      </p>
      <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href="/demo"
          class="inline-flex h-14 items-center justify-center gap-2 rounded-md bg-background px-10 text-base font-semibold text-foreground transition-colors hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
        >
          Solicitar sesión técnica
          <ArrowRight class="size-5" />
        </a>
        <a href="/ley-21719" class="inline-flex items-center gap-1 border-b border-background/60 pb-0.5 text-sm font-medium text-background/80 transition-colors hover:border-background hover:text-background">
          Ver guía Ley 21.719
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
          { href: '/glosario', label: 'Glosario normativo' },
          { href: '/comparativa', label: 'Comparativa de plataformas' },
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
