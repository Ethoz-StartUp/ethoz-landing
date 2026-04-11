#!/usr/bin/env node
/**
 * check-i18n.js — Detect hardcoded user-facing strings in Svelte templates.
 *
 * Extracts text content nodes (between > and <) and flags those with
 * alphabetic characters that aren't wrapped in {t(...)} expressions.
 *
 * Usage:
 *   node scripts/check-i18n.js              # check all pages + components
 *   node scripts/check-i18n.js src/routes   # check specific directory
 */

import { readFileSync, readdirSync } from 'fs';
import { join, relative } from 'path';

const ROOT = process.argv[2] || 'src';
const IGNORE_DIRS = ['components/ui', 'node_modules', '.svelte-kit', 'routes/admin', 'routes/pitch'];
const IGNORE_FILES = ['+error.svelte', '+page.server.ts', '+page.ts', '+layout.server.ts'];
// Pages with intentionally Spanish-only long-form content (legal, SEO articles)
const IGNORE_PATHS = ['privacy/', 'terms/', 'suggestions/', 'blog/'];

// Strings that are OK to hardcode
const ALLOWED = new Set([
  'Ethoz', 'Etho', 'ethoz.cl', 'RUT', 'RBD', 'PIE', 'UTP', 'ARCO', 'DPO',
  'CLP', 'UTM', 'PDF', 'OK', 'BLOQ', 'WhatsApp', 'Esc', 'Feedback',
  'legal@ethoz.cl', 'contacto@ethoz.cl',
]);

let totalIssues = 0;
let filesWithIssues = 0;

function getAllSvelteFiles(dir) {
  const results = [];
  try {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (IGNORE_DIRS.some(d => fullPath.includes(d))) continue;
        results.push(...getAllSvelteFiles(fullPath));
      } else if (entry.name.endsWith('.svelte') && !IGNORE_FILES.includes(entry.name)) {
        if (!IGNORE_PATHS.some(p => fullPath.includes(p))) {
          results.push(fullPath);
        }
      }
    }
  } catch { /* skip unreadable dirs */ }
  return results;
}

function extractTextNodes(content) {
  // Remove <script>, <style>, <svelte:head> blocks entirely
  const template = content
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<svelte:head>[\s\S]*?<\/svelte:head>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');

  const issues = [];

  // Find text between > and < that contains letters
  const textBetweenTags = />[^<{]*[a-záéíóúñüA-ZÁÉÍÓÚÑÜ][^<{]*</g;
  let match;

  while ((match = textBetweenTags.exec(template)) !== null) {
    const text = match[0].slice(1, -1).trim();

    if (text.length < 3) continue;
    if (ALLOWED.has(text)) continue;

    // Skip if inside an attribute value
    const before = template.substring(Math.max(0, match.index - 100), match.index);
    if (/=["'][^"']*$/.test(before)) continue;

    // Skip pure numbers with units
    if (/^[\d.,]+\s*(px|rem|em|%|ms|s|vw|vh|UTM|CLP|UF)$/.test(text)) continue;

    // Skip brand abbreviations and technical identifiers
    if (/^[A-Z0-9_.:-]+$/.test(text)) continue;

    // Find line number in original content
    const textIndex = content.indexOf(text);
    let lineNum = 0;
    if (textIndex >= 0) {
      lineNum = content.substring(0, textIndex).split('\n').length;
    }

    issues.push({
      line: lineNum,
      text: text.length > 70 ? text.substring(0, 70) + '...' : text,
    });
  }

  return issues;
}

function checkFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const issues = extractTextNodes(content);

  const seen = new Set();
  const unique = issues.filter(i => {
    if (seen.has(i.text)) return false;
    seen.add(i.text);
    return true;
  });

  if (unique.length > 0) {
    filesWithIssues++;
    const relPath = relative('.', filePath);
    console.log(`\n  ${relPath}`);
    for (const issue of unique) {
      totalIssues++;
      console.log(`    ${issue.line}:  "${issue.text}"`);
    }
  }
}

// Main
console.log('Checking for hardcoded strings in Svelte templates...\n');

const files = getAllSvelteFiles(ROOT);
for (const f of files) {
  checkFile(f);
}

// Baseline: known existing hardcoded strings (update after each i18n cleanup pass)
const BASELINE = 1274;

console.log(`\n  Found: ${totalIssues} hardcoded string(s) in ${filesWithIssues} file(s) (baseline: ${BASELINE})`);
console.log(`  Scanned ${files.length} .svelte files\n`);

if (totalIssues > BASELINE) {
  console.log(`FAIL: ${totalIssues - BASELINE} NEW hardcoded string(s) introduced above baseline.`);
  console.log('Fix: wrap each string with t(\'key\') and add the key to es.ts + en.ts');
  process.exit(1);
} else if (totalIssues < BASELINE) {
  console.log(`NICE: ${BASELINE - totalIssues} hardcoded string(s) cleaned up! Update BASELINE to ${totalIssues} in check-i18n.js`);
} else {
  console.log('OK: No new hardcoded strings introduced.');
}
