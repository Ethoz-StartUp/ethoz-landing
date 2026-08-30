import { mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

/**
 * generate-og-images.mjs — Open Graph defaults in the current (Launch UI light)
 * aesthetic, composed from existing brand assets (static/logos/png/*).
 *
 * Replaces the retired dark "8020" og-default.png referenced from app.html and
 * creates the og-ley-21719.webp that /ley-21719 references (it was missing).
 * Local render only: SVG layout + sharp composite, no external API.
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const outDir = resolve(root, 'static/images');
mkdirSync(outDir, { recursive: true });

const BG = '#FAFAF9';
const CARD = '#FFFFFF';
const BORDER = '#E7E5E4';
const BLUE = '#2563EB';
const NAVY = '#1C1917';

const logoPath = resolve(root, 'static/logos/png/ethoz-horizontal-light-1024.png');

async function ogDefault() {
  // 1200x630 (app.html declares 1200x630)
  const logo = await sharp(logoPath).resize(520).png().toBuffer();
  const meta = await sharp(logo).metadata();
  const x = Math.round((1200 - (meta.width ?? 520)) / 2);
  const y = Math.round((630 - (meta.height ?? 142)) / 2) - 20;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="${BG}"/>
    <rect x="70" y="70" width="1060" height="490" rx="28" fill="${CARD}" stroke="${BORDER}" stroke-width="2"/>
    <circle cx="1050" cy="180" r="90" fill="${BLUE}" fill-opacity="0.08"/>
    <circle cx="150" cy="470" r="70" fill="${BLUE}" fill-opacity="0.06"/>
    <rect x="70" y="548" width="120" height="6" rx="3" fill="${BLUE}"/>
  </svg>`;

  await sharp(Buffer.from(svg))
    .composite([{ input: logo, left: x, top: y }])
    .png()
    .toFile(resolve(outDir, 'og-default.png'));
  console.log('✔ og-default.png');
}

async function ogLey21719() {
  // 1200x627 webp to match the blog cover convention
  const logo = await sharp(logoPath).resize(380).png().toBuffer();
  const meta = await sharp(logo).metadata();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="627" viewBox="0 0 1200 627">
    <rect width="1200" height="627" fill="${BG}"/>
    <rect x="60" y="60" width="1080" height="507" rx="28" fill="${CARD}" stroke="${BORDER}" stroke-width="2"/>
    <path d="M860 170 c70 30 120 30 160 0 c0 160 -40 250 -160 300 c-120 -50 -160 -140 -160 -300 c40 30 90 30 160 0 Z" fill="${BLUE}" fill-opacity="0.12" stroke="${BLUE}" stroke-width="4"/>
    <path d="M810 315 l30 30 l60 -60" stroke="${BLUE}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="140" y="300" width="380" height="12" rx="6" fill="${NAVY}" fill-opacity="0.15"/>
    <rect x="140" y="340" width="300" height="12" rx="6" fill="${NAVY}" fill-opacity="0.10"/>
    <rect x="140" y="380" width="340" height="12" rx="6" fill="${NAVY}" fill-opacity="0.10"/>
    <rect x="60" y="560" width="120" height="5" rx="2.5" fill="${BLUE}"/>
  </svg>`;

  await sharp(Buffer.from(svg))
    .composite([{ input: logo, left: 140, top: 170 }])
    .webp({ quality: 88 })
    .toFile(resolve(outDir, 'og-ley-21719.webp'));
  console.log('✔ og-ley-21719.webp');
}

await ogDefault();
await ogLey21719();
console.log('Done.');
