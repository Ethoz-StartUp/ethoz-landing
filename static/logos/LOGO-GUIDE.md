# Ethoz — Logo & Brand Assets

> Sistema de marca 8020 (vertical sky-blue). Spine: Cream `#FAF8F5` + Charcoal `#18181B`.
> Acento: Sky Blue `#0495FE`. Tipografia: DM Sans (display) / Inter (cuerpo) / JetBrains Mono (datos).

## Logo final

El logo de Ethoz combina dos elementos:

1. **Icono "Interseccion"** — Dos rectangulos redondeados superpuestos (charcoal + sky). Representa capas de proteccion, transparencia, y la dualidad privacidad/acceso.
2. **Wordmark con Z acentuada** — "Etho" en charcoal/foreground + "z" en sky/primary, en DM Sans 800. La Z es el elemento distintivo de la marca.

## Paleta de colores

| Rol | Color | Hex |
|-----|-------|-----|
| Charcoal (texto/icono base) | Ink | `#18181B` |
| Sky (acento/z, swatch marca) | Sky Blue | `#0495FE` |
| Sky accesible (texto/botones) | Sky deep | `#0B72C4` |
| Sky claro (sobre charcoal/dark) | Sky light | `#38A8FF` |
| Cream (fondo claro) | Cream | `#FAF8F5` |

El wordmark en pantalla usa los tokens `text-foreground` (charcoal) + `text-primary` (sky accesible). El swatch de marca `#0495FE` (`text-accent-bright`) se reserva para el icono y rellenos.

## Archivos finales

```
static/logos/
  ethoz-final-light.svg    ← Logo completo (icono + wordmark), fondo claro/cream
  ethoz-final-dark.svg     ← Logo completo (icono + wordmark), fondo charcoal/oscuro
  ethoz-final-icon.svg     ← Solo icono interseccion (favicon, app icon)
static/favicon.svg         ← Icono interseccion sobre tile charcoal (tab del navegador)
static/images/og-default.svg ← Tarjeta social (charcoal + sky + DM Sans)
```

PNG rasterizados (regenerar con `rsvg-convert`; DM Sans instalado via fonttools en `~/Library/Fonts`):

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
| **Favicon** | `static/favicon.svg` | Icono interseccion sobre tile charcoal (referenciado en `app.html`, `?v=4`) |
| **NavBar** | `src/lib/components/NavBar.svelte` | SVG inline + wordmark `font-heading` con Z acentuada |
| **Footer** | `src/lib/components/Footer.svelte` | SVG inline (z en `text-accent-bright`) + wordmark `font-heading` |

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
<span class="font-heading text-xl font-extrabold tracking-tight">
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

El wordmark usa **DM Sans 800** (`font-heading`) via `@fontsource-variable/dm-sans`. Para exportar a PNG con texto, las pesas estaticas de DM Sans estan instaladas localmente (fonttools woff2 to ttf) para que `rsvg-convert` rasterice correctamente.
