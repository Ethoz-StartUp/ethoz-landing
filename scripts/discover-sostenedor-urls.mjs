#!/usr/bin/env node
// Discovers candidate URLs for each MINEDUC sostenedor via:
//   1. DuckDuckGo HTML search (free, no API key, rate-limited via delays)
//   2. Pattern matching for municipalidades / DAEM / SLEPs
//   3. Wayback Machine CDX API
//
// Outputs:
//   - static/data/sostenedor-urls.json (local cache, gitignored)
//   - Optional: pushes to Supabase `sostenedor_urls` table if SUPABASE_SERVICE_ROLE_KEY is set
//
// Usage:
//   node scripts/discover-sostenedor-urls.mjs [--tier 1|2|3|all] [--limit N] [--dry-run] [--push]
//
// Examples:
//   node scripts/discover-sostenedor-urls.mjs --tier 1 --limit 50 --dry-run
//   node scripts/discover-sostenedor-urls.mjs --tier all --push
//
// Env (optional):
//   PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY  (required only with --push)

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const SCHOOLS_JSON = path.join(ROOT, 'static/data/schools.json');
const OUTPUT_JSON = path.join(ROOT, 'static/data/sostenedor-urls.json');

// ── CLI args ──
const args = process.argv.slice(2);
const TIER = (() => {
  const i = args.indexOf('--tier');
  if (i === -1) return 'all';
  return args[i + 1];
})();
const LIMIT = (() => {
  const i = args.indexOf('--limit');
  if (i === -1) return Infinity;
  return Number(args[i + 1]);
})();
const DRY_RUN = args.includes('--dry-run');
const PUSH = args.includes('--push');

// ── Tier scoring (mirror src/lib/utils/prospecting.ts) ──
const SCORE_DEP = { 4: 25, 3: 20, 5: 15, 1: 10, 2: 8, 6: 5 };
const scoreEnroll = (n) => n >= 10000 ? 35 : n >= 5000 ? 30 : n >= 2000 ? 25 : n >= 1000 ? 20 : n >= 500 ? 15 : n >= 200 ? 10 : 5;
const scoreCount = (n) => n >= 20 ? 30 : n >= 10 ? 25 : n >= 5 ? 20 : n >= 3 ? 15 : n >= 2 ? 10 : 5;
const getTier = (s) => s >= 70 ? 1 : s >= 50 ? 2 : 3;

// ── Build sostenedores from schools.json ──
function buildSostenedores(schools) {
  const map = new Map();
  for (const s of schools) {
    const key = s.s || 'Sin sostenedor';
    let e = map.get(key);
    if (!e) e = { name: key, schools: [], regions: new Set(), depTypes: new Set(), totalEnrollment: 0 };
    e.schools.push(s);
    e.totalEnrollment += s.m || 0;
    e.regions.add(s.rg);
    e.depTypes.add(s.d);
    map.set(key, e);
  }
  const out = [];
  for (const [, v] of map) {
    const depTypes = [...v.depTypes];
    const score = scoreEnroll(v.totalEnrollment) + scoreCount(v.schools.length) + Math.max(...depTypes.map((d) => SCORE_DEP[d] ?? 5)) + 5;
    out.push({
      name: v.name,
      schoolCount: v.schools.length,
      totalEnrollment: v.totalEnrollment,
      regions: [...v.regions],
      depTypes,
      primaryDepType: depTypes.sort((a, b) => (SCORE_DEP[b] ?? 0) - (SCORE_DEP[a] ?? 0))[0],
      score,
      tier: getTier(score),
    });
  }
  return out.sort((a, b) => b.score - a.score);
}

// ── URL discovery strategies ──

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

async function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

// 1. DuckDuckGo HTML scraping (no API key)
async function searchDuckDuckGo(query) {
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept': 'text/html' } });
    if (!res.ok) return [];
    const html = await res.text();
    const matches = [...html.matchAll(/<a[^>]+class="result__url"[^>]+href="([^"]+)"/g)];
    return matches.slice(0, 5).map((m) => {
      const raw = m[1];
      // DDG wraps with /l/?uddg=...
      const u = new URL(raw, 'https://duckduckgo.com');
      const target = u.searchParams.get('uddg') ?? raw;
      return { url: decodeURIComponent(target), source: 'duckduckgo', confidence: 0.5 };
    });
  } catch { return []; }
}

// 2. Pattern-based URL guesses for municipalidades / DAEM / SLEPs
function patternGuesses(name) {
  const slug = name
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/^(i\.\s*)?(municipalidad|i\.\s*municipalidad)\s+(de\s+)?/i, '')
    .replace(/^(corp(oracion)?\s+(municipal\s+)?(de\s+)?(educacion\s+(de\s+)?)?)/i, '')
    .replace(/^(servicio\s+local\s+(de\s+)?educ(acion)?\s+(publica\s+)?(de\s+)?)/i, '')
    .replace(/^(daem\s+(de\s+)?)/i, '')
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 30);
  if (!slug) return [];
  const isMunicipal = /municipal|i\.\s*municipalidad|corp.*municipal|daem/i.test(name);
  const isSLEP = /servicio\s+local|slep/i.test(name);
  const guesses = [];
  if (isMunicipal) {
    guesses.push(`https://www.municipalidad${slug}.cl`);
    guesses.push(`https://www.imunicipalidad${slug}.cl`);
    guesses.push(`https://www.daem${slug}.cl`);
    guesses.push(`https://www.cmd${slug}.cl`);
  }
  if (isSLEP) {
    guesses.push(`https://www.sle${slug}.cl`);
    guesses.push(`https://www.slep${slug}.cl`);
    guesses.push(`https://www.${slug}.cl`);
  }
  return guesses.map((url) => ({ url, source: 'pattern', confidence: 0.3 }));
}

// 3. Wayback Machine — verifies URLs that may be down currently
async function waybackLookup(domain) {
  try {
    const url = `https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(domain)}&output=json&limit=1&filter=statuscode:200`;
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length < 2) return null;
    const [, row] = data;
    const ts = row[1], original = row[2];
    return { url: `https://web.archive.org/web/${ts}/${original}`, source: 'wayback', confidence: 0.4 };
  } catch { return null; }
}

// ── Main per-sostenedor pipeline ──
async function discoverFor(sost) {
  const candidates = [];

  // Strategy 1: DDG search by sostenedor name + Chile
  const query = `"${sost.name}" Chile sitio oficial`;
  const ddgResults = await searchDuckDuckGo(query);
  candidates.push(...ddgResults);
  await sleep(2000 + Math.random() * 2000); // 2-4s delay

  // Strategy 2: Pattern guesses
  candidates.push(...patternGuesses(sost.name));

  // Strategy 3: Wayback for top DDG hit (if any)
  if (ddgResults[0]) {
    try {
      const dom = new URL(ddgResults[0].url).hostname;
      const wb = await waybackLookup(dom);
      if (wb) candidates.push(wb);
    } catch {}
  }

  // Dedup by URL, keep highest confidence
  const seen = new Map();
  for (const c of candidates) {
    let url;
    try { url = new URL(c.url).toString(); } catch { continue; }
    const existing = seen.get(url);
    if (!existing || c.confidence > existing.confidence) seen.set(url, { ...c, url });
  }
  return [...seen.values()];
}

// ── Optional Supabase push ──
async function pushToSupabase(rows) {
  const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error('[push] Missing PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    return;
  }
  // Batch insert via REST
  const endpoint = `${SUPABASE_URL}/rest/v1/sostenedor_urls`;
  const batchSize = 100;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=ignore-duplicates',
      },
      body: JSON.stringify(batch),
    });
    if (!res.ok) console.error(`[push] batch ${i}: ${res.status} ${await res.text()}`);
    else console.log(`[push] batch ${i}-${i + batch.length}: ok`);
  }
}

// ── Main ──
async function main() {
  console.log(`[discover] tier=${TIER} limit=${LIMIT} dryRun=${DRY_RUN} push=${PUSH}`);
  const data = JSON.parse(await fs.readFile(SCHOOLS_JSON, 'utf-8'));
  const sostenedores = buildSostenedores(data.schools);
  console.log(`[discover] ${sostenedores.length} total sostenedores`);

  let queue = sostenedores;
  if (TIER !== 'all') queue = queue.filter((s) => s.tier === Number(TIER));
  queue = queue.slice(0, LIMIT);
  console.log(`[discover] processing ${queue.length} (tier ${TIER}, limit ${LIMIT})`);

  const allRows = [];
  let i = 0;
  for (const s of queue) {
    i++;
    if (DRY_RUN && i > 5) break;
    process.stdout.write(`[${i}/${queue.length}] ${s.name.slice(0, 50)}... `);
    const candidates = await discoverFor(s);
    process.stdout.write(`${candidates.length} URLs\n`);
    for (const c of candidates) {
      let domain;
      try { domain = new URL(c.url).hostname; } catch {}
      allRows.push({
        sostenedor_name: s.name,
        url: c.url,
        domain,
        source: c.source,
        confidence: c.confidence,
        status: 'pending',
      });
    }
  }

  // Save local cache
  await fs.writeFile(OUTPUT_JSON, JSON.stringify({
    meta: { generated: new Date().toISOString(), count: allRows.length, tier: TIER, limit: LIMIT },
    rows: allRows,
  }, null, 2));
  console.log(`[discover] wrote ${allRows.length} rows → ${path.relative(ROOT, OUTPUT_JSON)}`);

  if (PUSH && !DRY_RUN) {
    console.log('[discover] pushing to Supabase...');
    await pushToSupabase(allRows);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
