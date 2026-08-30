import { mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

/**
 * generate-l4-covers.mjs — local, API-free covers for the 6 PIVOTE-PLAN L4 posts.
 *
 * The AI cover pipeline (generate-blog-covers.mjs) needs a valid GEMINI_API_KEY.
 * These covers follow the same art direction (light background, abstract
 * geometric composition, blue accent, no text) rendered from SVG via sharp.
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const outDir = resolve(root, 'static/images/blog');
mkdirSync(outDir, { recursive: true });

const BG = '#FAFAF9';
const BLUE = '#2563EB';
const NAVY = '#1C1917';
const BORDER = '#E7E5E4';

// Interseccion brand mark (two overlapping rounded rectangles), low-key.
const mark = (x, y, scale, o1 = 0.9, o2 = 0.9) => `
  <g transform="translate(${x}, ${y}) scale(${scale})" opacity="1">
    <rect x="0" y="14" width="64" height="80" rx="16" fill="none" stroke="${NAVY}" stroke-opacity="${o1 * 0.55}" stroke-width="6"/>
    <rect x="34" y="0" width="64" height="80" rx="16" fill="none" stroke="${BLUE}" stroke-opacity="${o2}" stroke-width="6"/>
  </g>`;

const frame = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="627" viewBox="0 0 1200 627">
  <rect width="1200" height="627" fill="${BG}"/>
  <rect x="60" y="60" width="1080" height="507" rx="28" fill="#FFFFFF" stroke="${BORDER}" stroke-width="2"/>
  ${inner}
  <rect x="60" y="560" width="120" height="5" rx="2.5" fill="${BLUE}"/>
</svg>`;

const covers = [
  {
    // Descargos: documentos ordenados + línea de tiempo
    filename: 'descargos-superintendencia-educacion-guia.webp',
    svg: frame(`
      <rect x="140" y="150" width="220" height="280" rx="14" fill="#FFFFFF" stroke="${BORDER}" stroke-width="3"/>
      <rect x="180" y="130" width="220" height="280" rx="14" fill="#FFFFFF" stroke="${BLUE}" stroke-opacity="0.5" stroke-width="3"/>
      <rect x="210" y="170" width="130" height="10" rx="5" fill="${BLUE}" fill-opacity="0.35"/>
      <rect x="210" y="200" width="160" height="10" rx="5" fill="${NAVY}" fill-opacity="0.15"/>
      <rect x="210" y="230" width="160" height="10" rx="5" fill="${NAVY}" fill-opacity="0.15"/>
      <rect x="210" y="260" width="110" height="10" rx="5" fill="${NAVY}" fill-opacity="0.15"/>
      <rect x="560" y="240" width="480" height="6" rx="3" fill="${BLUE}" fill-opacity="0.5"/>
      <circle cx="600" cy="243" r="16" fill="${BLUE}"/>
      <circle cx="760" cy="243" r="12" fill="${BLUE}" fill-opacity="0.6"/>
      <circle cx="920" cy="243" r="12" fill="${BLUE}" fill-opacity="0.35"/>
      <circle cx="1030" cy="243" r="12" fill="${NAVY}" fill-opacity="0.2"/>
      ${mark(950, 120, 0.9, 0.5, 0.8)}
    `),
  },
  {
    // Protocolo con plazos: pasos ascendentes con marcadores
    filename: 'protocolo-bullying-plazos-colegio.webp',
    svg: frame(`
      <rect x="150" y="360" width="160" height="90" rx="14" fill="${BLUE}" fill-opacity="0.9"/>
      <rect x="350" y="290" width="160" height="90" rx="14" fill="${BLUE}" fill-opacity="0.6"/>
      <rect x="550" y="220" width="160" height="90" rx="14" fill="${BLUE}" fill-opacity="0.4"/>
      <rect x="750" y="150" width="160" height="90" rx="14" fill="#FFFFFF" stroke="${BLUE}" stroke-width="4"/>
      <circle cx="230" cy="330" r="10" fill="${NAVY}" fill-opacity="0.35"/>
      <circle cx="430" cy="260" r="10" fill="${NAVY}" fill-opacity="0.35"/>
      <circle cx="630" cy="190" r="10" fill="${NAVY}" fill-opacity="0.35"/>
      <circle cx="830" cy="120" r="14" fill="${BLUE}"/>
      <circle cx="830" cy="120" r="24" fill="none" stroke="${BLUE}" stroke-opacity="0.4" stroke-width="3"/>
      ${mark(980, 330, 0.9, 0.5, 0.8)}
    `),
  },
  {
    // Condena: balanza geométrica sobria
    filename: 'condena-sostenedor-45-millones-convivencia.webp',
    svg: frame(`
      <rect x="585" y="140" width="14" height="280" rx="7" fill="${NAVY}" fill-opacity="0.7"/>
      <rect x="330" y="140" width="540" height="10" rx="5" fill="${NAVY}" fill-opacity="0.7"/>
      <path d="M330 150 L250 330 L410 330 Z" fill="${BLUE}" fill-opacity="0.25" stroke="${BLUE}" stroke-width="4"/>
      <path d="M870 150 L790 330 L950 330 Z" fill="#FFFFFF" stroke="${BLUE}" stroke-width="4"/>
      <rect x="480" y="420" width="240" height="14" rx="7" fill="${NAVY}" fill-opacity="0.7"/>
      <circle cx="600" cy="105" r="22" fill="${BLUE}"/>
      ${mark(140, 130, 0.9, 0.5, 0.8)}
    `),
  },
  {
    // Reglamento a ejecutable: hoja que se ordena en bloques
    filename: 'reglamento-interno-protocolo-ejecutable.webp',
    svg: frame(`
      <rect x="150" y="160" width="240" height="300" rx="14" fill="#FFFFFF" stroke="${BORDER}" stroke-width="3" transform="rotate(-4 270 310)"/>
      <rect x="195" y="210" width="150" height="10" rx="5" fill="${NAVY}" fill-opacity="0.2" transform="rotate(-4 270 310)"/>
      <rect x="195" y="245" width="150" height="10" rx="5" fill="${NAVY}" fill-opacity="0.15" transform="rotate(-4 270 310)"/>
      <rect x="195" y="280" width="150" height="10" rx="5" fill="${NAVY}" fill-opacity="0.15" transform="rotate(-4 270 310)"/>
      <path d="M470 300 L560 300 M540 275 L575 300 L540 325" stroke="${BLUE}" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="640" y="170" width="180" height="70" rx="14" fill="${BLUE}" fill-opacity="0.85"/>
      <rect x="640" y="270" width="180" height="70" rx="14" fill="${BLUE}" fill-opacity="0.55"/>
      <rect x="640" y="370" width="180" height="70" rx="14" fill="${BLUE}" fill-opacity="0.35"/>
      <rect x="860" y="270" width="140" height="70" rx="14" fill="#FFFFFF" stroke="${BLUE}" stroke-width="4"/>
      ${mark(890, 130, 0.9, 0.5, 0.8)}
    `),
  },
  {
    // Checklist 21.719: lista con checks y escudo sutil
    filename: 'ley-21719-colegios-checklist-datos-estudiantes.webp',
    svg: frame(`
      <rect x="220" y="140" width="420" height="340" rx="16" fill="#FFFFFF" stroke="${BORDER}" stroke-width="3"/>
      <circle cx="270" cy="200" r="14" fill="${BLUE}"/>
      <path d="M262 200 l6 6 l12 -12" stroke="#FFFFFF" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="305" y="194" width="200" height="12" rx="6" fill="${NAVY}" fill-opacity="0.2"/>
      <circle cx="270" cy="265" r="14" fill="${BLUE}"/>
      <path d="M262 265 l6 6 l12 -12" stroke="#FFFFFF" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="305" y="259" width="200" height="12" rx="6" fill="${NAVY}" fill-opacity="0.2"/>
      <circle cx="270" cy="330" r="14" fill="${BLUE}"/>
      <path d="M262 330 l6 6 l12 -12" stroke="#FFFFFF" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="305" y="324" width="200" height="12" rx="6" fill="${NAVY}" fill-opacity="0.2"/>
      <circle cx="270" cy="395" r="14" fill="#FFFFFF" stroke="${BLUE}" stroke-width="3"/>
      <rect x="305" y="389" width="200" height="12" rx="6" fill="${NAVY}" fill-opacity="0.12"/>
      <path d="M810 160 c70 30 120 30 160 0 c0 160 -40 250 -160 300 c-120 -50 -160 -140 -160 -300 c40 30 90 30 160 0 Z" fill="${BLUE}" fill-opacity="0.14" stroke="${BLUE}" stroke-width="4"/>
      <path d="M760 305 l30 30 l60 -60" stroke="${BLUE}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    `),
  },
  {
    // Encargado/horas: reloj + pila de papel que se reduce
    filename: 'encargado-convivencia-escolar-horas-papeleo.webp',
    svg: frame(`
      <rect x="150" y="200" width="180" height="230" rx="12" fill="#FFFFFF" stroke="${BORDER}" stroke-width="3" transform="rotate(-3 240 315)"/>
      <rect x="170" y="180" width="180" height="230" rx="12" fill="#FFFFFF" stroke="${BORDER}" stroke-width="3" transform="rotate(2 260 295)"/>
      <rect x="195" y="225" width="120" height="9" rx="4.5" fill="${NAVY}" fill-opacity="0.15" transform="rotate(2 260 295)"/>
      <rect x="195" y="255" width="120" height="9" rx="4.5" fill="${NAVY}" fill-opacity="0.15" transform="rotate(2 260 295)"/>
      <rect x="195" y="285" width="90" height="9" rx="4.5" fill="${NAVY}" fill-opacity="0.15" transform="rotate(2 260 295)"/>
      <path d="M410 300 L490 300 M472 278 L504 300 L472 322" stroke="${BLUE}" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="560" y="300" width="120" height="130" rx="12" fill="${BLUE}" fill-opacity="0.3"/>
      <circle cx="830" cy="290" r="130" fill="#FFFFFF" stroke="${BLUE}" stroke-width="8"/>
      <path d="M830 290 L830 200 M830 290 L900 330" stroke="${NAVY}" stroke-opacity="0.75" stroke-width="10" stroke-linecap="round"/>
      <circle cx="830" cy="290" r="12" fill="${BLUE}"/>
      ${mark(220, 90, 0.8, 0.5, 0.8)}
    `),
  },
];

for (const cover of covers) {
  const outPath = resolve(outDir, cover.filename);
  if (existsSync(outPath)) {
    console.log('skip (exists):', cover.filename);
    continue;
  }
  await sharp(Buffer.from(cover.svg)).resize(1200, 627).webp({ quality: 85 }).toFile(outPath);
  console.log('✔', cover.filename);
}
console.log('Done.');
