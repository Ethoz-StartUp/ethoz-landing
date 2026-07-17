# Ethoz — Logo & Brand Assets

> Sistema de marca Launch UI v2 (dark-first). Spine: Near-black `#0A0A0A` + Elevated charcoal `#171717`.
> Acento: Amber `#F97316`. Tipografia: Inter Variable para todo.

## Logo final

El logo de Ethoz combina dos elementos:

1. **Icono "Interseccion"** — Dos rectangulos redondeados superpuestos (foreground + amber). Representa capas de proteccion, transparencia, y la dualidad privacidad/acceso.
2. **Wordmark con Z acentuada** — "Etho" en foreground + "z" en amber/primary, en Inter 500. La Z es el elemento distintivo de la marca.

## Paleta de colores

| Rol | Color | Hex |
|-----|-------|-----|
| Foreground (texto/icono base) | Foreground | `#FAFAFA` |
| Amber (acento/z) | Primary | `#F97316` |
| Fondo oscuro | Background | `#0A0A0A` |
| Tarjeta elevada | Card | `#171717` |

El wordmark en pantalla usa los tokens `text-foreground` + `text-primary` (amber). El swatch de marca se reserva para el icono y rellenos.

## Archivos finales

```
static/logos/
  ethoz-final-light.svg    ← Logo completo (icono + wordmark), fondo oscuro
  ethoz-final-dark.svg     ← Logo completo (icono + wordmark), fondo oscuro (mismo que light en dark-only)
  ethoz-final-icon.svg     ← Solo icono interseccion (favicon, app icon)
static/favicon.svg         ← Icono interseccion sobre tile oscuro (tab del navegador)
static/images/og-default.svg ← Tarjeta social (dark + amber + Inter)
```

PNG rasterizados (regenerar con `rsvg-convert`; Inter Variable disponible):

```
static/favicon.png, static/apple-touch-icon.png
static/logos/png/ethoz-icon-{32,64,128,256,512}.png
static/logos/png/ethoz-horizontal-{light,dark}-{256,512,1024}.png
static/logos/png/ethoz-favicon-192.png, ethoz-linkedin-profile.png
static/images/og-default.png
```

## Donde se usa el logo en el sitio

| Ubicacion | Archivo | Implementacion |
|-----------|---------|---------------|
| **Favicon** | `static/favicon.svg` | Icono interseccion sobre tile oscuro (referenciado en `app.html`, `?v=4`) |
| **NavBar** | `src/lib/components/NavBar.svelte` | SVG inline + wordmark `font-heading` con Z acentuada |
| **Footer** | `src/lib/components/Footer.svelte` | SVG inline (z en `text-primary`) + wordmark `font-heading` |

## Implementacion tecnica

El logo en NavBar y Footer usa SVG inline con `currentColor` para adaptarse via tokens:

```svelte
<!-- Icono -->
<svg viewBox="0 0 32 32" class="size-7">
  <rect x="2" y="7" width="18" height="22" rx="5"
    fill="none" stroke="currentColor" stroke-width="2.2" class="text-foreground"/>
  <rect x="12" y="3" width="18" height="22" rx="5"
    fill="none" stroke="currentColor" stroke-width="2.2" class="text-primary"/>
</svg>

<!-- Wordmark -->
<span class="font-heading text-xl font-medium tracking-tight">
  <span class="text-foreground">Etho</span><span class="text-primary">z</span>
</span>
```

## Tamanos

| Contexto | Tamano icono | Tamano texto |
|----------|-------------|-------------|
| NavBar | `size-7` (28px) | `text-xl` |
| Footer | `size-6` (24px) | `text-lg` |
| Favicon | 32x32 | N/A |

## Tipografia

El wordmark usa **Inter Variable 500** (`font-heading`) via `@fontsource-variable/inter`. Para exportar a PNG con texto, las pesas estaticas de Inter estan disponibles localmente para que `rsvg-convert` rasterice correctamente.
