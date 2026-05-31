#!/usr/bin/env node
/**
 * merge-i18n-keys.mjs — Splice agent-extracted i18n keys into es.ts + en.ts.
 *
 * Reads /tmp/ethoz-i18n/<slug>.json files of shape:
 *   { "namespace.sub_key": { "es": "Texto", "en": "Text" }, ... }
 *
 * Validation (HALTS on any failure — never silently corrupts translations):
 *   - duplicate key emitted by two different scratch files
 *   - key already present in es.ts (agents must extend with NEW sub-keys)
 *   - missing/empty es or en value
 *
 * On success: appends grouped key blocks before `} as const;` in BOTH files,
 * keeping es/en parity. Idempotent-ish: run after each extraction wave.
 *
 * Usage: node scripts/merge-i18n-keys.mjs [scratchDir]
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const SCRATCH = process.argv[2] || '/tmp/ethoz-i18n';
const ES = 'src/lib/i18n/translations/es.ts';
const EN = 'src/lib/i18n/translations/en.ts';
const ANCHOR = '\n} as const;';

function fail(msg) {
  console.error(`\n✖ MERGE HALTED: ${msg}\n`);
  process.exit(1);
}

// Existing keys already defined in es.ts (top-level 'key': pattern).
function existingKeys(src) {
  const set = new Set();
  const re = /^\s{2}'([^']+)'\s*:/gm;
  let m;
  while ((m = re.exec(src)) !== null) set.add(m[1]);
  return set;
}

// TS single-quoted string literal.
function tsString(v) {
  return `'${String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')}'`;
}

const esSrc = readFileSync(ES, 'utf-8');
const enSrc = readFileSync(EN, 'utf-8');
if ((esSrc.match(/\n} as const;/g) || []).length !== 1) fail(`${ES}: expected exactly one '} as const;' anchor`);
if ((enSrc.match(/\n} as const;/g) || []).length !== 1) fail(`${EN}: expected exactly one '} as const;' anchor`);

const existing = existingKeys(esSrc);

let files;
try {
  files = readdirSync(SCRATCH).filter((f) => f.endsWith('.json')).sort();
} catch {
  fail(`scratch dir not readable: ${SCRATCH}`);
}
if (files.length === 0) fail(`no .json files in ${SCRATCH}`);

const owner = new Map(); // key -> scratch file that emitted it
const groups = []; // { slug, entries: [[key,{es,en}]] }
const conflicts = [];

for (const f of files) {
  const slug = f.replace(/\.json$/, '');
  let map;
  try {
    map = JSON.parse(readFileSync(join(SCRATCH, f), 'utf-8'));
  } catch (e) {
    fail(`${f}: invalid JSON — ${e.message}`);
  }
  const entries = Object.entries(map);
  const kept = [];
  for (const [key, val] of entries) {
    if (!key || typeof key !== 'string') { conflicts.push(`${f}: empty/non-string key`); continue; }
    if (!val || typeof val.es !== 'string' || typeof val.en !== 'string' || !val.es.trim() || !val.en.trim()) {
      conflicts.push(`${f}: key "${key}" missing es/en value`); continue;
    }
    if (existing.has(key)) { conflicts.push(`${f}: key "${key}" already exists in es.ts (use a new sub-key)`); continue; }
    if (owner.has(key)) { conflicts.push(`key "${key}" emitted by both ${owner.get(key)} and ${f}`); continue; }
    owner.set(key, f);
    kept.push([key, val]);
  }
  if (kept.length) groups.push({ slug, entries: kept });
}

if (conflicts.length) {
  console.error(`\n${conflicts.length} conflict(s):`);
  for (const c of conflicts.slice(0, 60)) console.error(`  - ${c}`);
  fail('resolve conflicts above (rename sub-keys in the scratch JSON + .svelte), then re-run');
}

let esBlock = '\n';
let enBlock = '\n';
let total = 0;
for (const g of groups) {
  esBlock += `\n  // ── i18n sweep: ${g.slug} ──\n`;
  enBlock += `\n  // ── i18n sweep: ${g.slug} ──\n`;
  for (const [key, val] of g.entries) {
    esBlock += `  ${tsString(key)}: ${tsString(val.es)},\n`;
    enBlock += `  ${tsString(key)}: ${tsString(val.en)},\n`;
    total++;
  }
}

const esOut = esSrc.replace(ANCHOR, esBlock + ANCHOR);
const enOut = enSrc.replace(ANCHOR, enBlock + ANCHOR);
writeFileSync(ES, esOut);
writeFileSync(EN, enOut);

// Parity self-check.
const esCount = (existingKeys(esOut)).size;
const enCount = (existingKeys(enOut)).size;
console.log(`✓ merged ${total} keys from ${groups.length} files`);
console.log(`  es.ts keys: ${esCount} | en.ts keys: ${enCount}${esCount === enCount ? ' (parity OK)' : ' ⚠ PARITY MISMATCH'}`);
if (esCount !== enCount) process.exit(2);
