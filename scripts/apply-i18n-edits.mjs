// apply-i18n-edits.mjs — key-anchored, structure-safe apply of i18n copy edits.
// Usage: node scripts/apply-i18n-edits.mjs <edits.json>
// edits.json: [{ key, es, en }]  (es/en are raw string contents, no surrounding quotes)
//
// For each edit, replaces ONLY the quoted value attached to that exact key in
// es.ts / en.ts. Key-anchored so duplicate values never cross-contaminate.
// Refuses any new value that still contains an em-dash / en-dash (8020 rule).
import { readFileSync, writeFileSync } from 'node:fs';

const editsPath = process.argv[2];
if (!editsPath) { console.error('usage: apply-i18n-edits.mjs <edits.json>'); process.exit(1); }
const edits = JSON.parse(readFileSync(editsPath, 'utf8'));

const FILES = {
  es: 'src/lib/i18n/translations/es.ts',
  en: 'src/lib/i18n/translations/en.ts',
};

// raw string -> safe single-quoted TS literal
function lit(s) {
  return "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
}
function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

const report = { es: { ok: 0, miss: 0, skip: 0 }, en: { ok: 0, miss: 0, skip: 0 } };
const misses = [];

for (const lang of ['es', 'en']) {
  let src = readFileSync(FILES[lang], 'utf8');
  for (const e of edits) {
    const val = e[lang];
    if (val == null) continue;
    if (/[—–]/.test(val)) { report[lang].skip++; misses.push(`DASH-IN-NEW ${lang} ${e.key}`); continue; }
    // match  'key':  <ws/newline>  '...value...'   (single quoted, escaped-aware)
    const re = new RegExp("('" + escRe(e.key) + "'\\s*:\\s*)'(?:[^'\\\\]|\\\\.)*'");
    if (!re.test(src)) { report[lang].miss++; misses.push(`NOKEY ${lang} ${e.key}`); continue; }
    src = src.replace(re, (_m, pfx) => pfx + lit(val));
    report[lang].ok++;
  }
  writeFileSync(FILES[lang], src);
}

console.log(JSON.stringify(report));
if (misses.length) { console.log('ISSUES:\n' + misses.slice(0, 60).join('\n')); }
