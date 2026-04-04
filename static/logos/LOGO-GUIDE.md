# Ethoz — Logo & Brand Assets

## Logo final

El logo de Ethoz combina dos elementos:

1. **Icono "Interseccion"** — Dos rectangulos redondeados superpuestos (navy + azul). Representa transparencia, capas de proteccion, y la dualidad privacidad/acceso.
2. **Wordmark con Z acentuada** — "Etho" en navy/foreground + "z" en azul primary. La Z es el elemento distintivo de la marca.

## Paleta de colores

| Rol | Color | Hex |
|-----|-------|-----|
| Navy (texto/icono) | Slate 900 | `#0F172A` |
| Azul (acento/z) | Blue 600 | `#2563EB` |
| Azul claro (dark mode) | Blue 500 | `#3B82F6` |
| Texto dark mode | Slate 100 | `#F1F5F9` |

## Archivos finales

```
static/logos/
  ethoz-final-light.svg    ← Logo completo (icono + wordmark), fondo claro
  ethoz-final-dark.svg     ← Logo completo (icono + wordmark), fondo oscuro
  ethoz-final-icon.svg     ← Solo icono interseccion (favicon, app icon)
```

## Donde se usa el logo en el sitio

| Ubicacion | Archivo | Implementacion |
|-----------|---------|---------------|
| **Favicon** | `static/favicon.svg` | Icono interseccion (referenciado en `app.html`) |
| **NavBar** | `src/lib/components/NavBar.svelte` | SVG inline + wordmark con Z acentuada |
| **Footer** | `src/lib/components/Footer.svelte` | SVG inline + wordmark con Z acentuada (mas pequeno) |

## Implementacion tecnica

El logo en NavBar y Footer usa SVG inline con `currentColor` para adaptarse automaticamente a temas claro/oscuro:

```svelte
<!-- Icono -->
<svg viewBox="0 0 32 32" class="size-7">
  <rect x="2" y="7" width="18" height="22" rx="4.5"
    fill="none" stroke="currentColor" stroke-width="2.2" class="text-foreground"/>
  <rect x="12" y="3" width="18" height="22" rx="4.5"
    fill="none" stroke="currentColor" stroke-width="2.2" class="text-primary"/>
</svg>

<!-- Wordmark -->
<span class="text-xl font-extrabold tracking-tight">
  <span class="text-foreground">Etho</span>
  <span class="text-primary">z</span>
</span>
```

## Tamanos

| Contexto | Tamano icono | Tamano texto |
|----------|-------------|-------------|
| NavBar | `size-7` (28px) | `text-xl` |
| Footer | `size-6` (24px) | `text-lg` |
| Favicon | 32x32 | N/A |

## Tipografia

El wordmark usa la fuente del sistema (`Inter` via Tailwind). Para exportar a produccion externa, convertir texto a outlines en Figma o Inkscape.

## Archivos adicionales (conceptos anteriores)

Los siguientes archivos son variaciones exploradas durante el proceso de diseno. Se conservan como referencia:

```
static/logos/
  ethoz-wordmark-*.svg     ← Concepto 1: solo wordmark con Z acentuada
  ethoz-shield-*.svg       ← Concepto 2: escudo con checkmark
  ethoz-mark-*.svg         ← Concepto 3: E geometrica
  ethoz-embrace-*.svg      ← Alternativa A: arcos protectores
  ethoz-intersect-*.svg    ← Alternativa B: interseccion (VERSION ELEGIDA)
  ethoz-nodes-*.svg        ← Alternativa C: nodos conectados
  ethoz-portal-*.svg       ← Alternativa D: arco/portal
  ethoz-guardian-*.svg     ← Sesion anterior
  ethoz-network-*.svg      ← Sesion anterior
  ethoz-keystone-*.svg     ← Sesion anterior
  ethoz-fusion-*.svg       ← Sesion anterior
  preview.html             ← Pagina de preview visual
```
