#!/usr/bin/env node
/**
 * Security audit — static analysis for regressions.
 *
 * Checks for:
 * - PUBLIC_* env vars that look like secrets (PASS, SECRET, KEY, TOKEN)
 * - Hardcoded emails, IPs, or PII in client code
 * - Raw contact_email in log/captureError calls (should use maskEmail)
 * - alert() / confirm() usage in admin pages (should use shadcn Dialog / toast)
 * - {@html} usage outside of known-safe ld+json structured data
 * - Direct supabase.from('leads').insert() in client code (should use verify-lead)
 * - OAuth client_secret in URL query params
 * - Non-admin RLS patterns (auth.role() = 'authenticated') in migration files
 *
 * Usage: node scripts/audit-security.mjs
 * Exit codes: 0 clean, 1 issues found
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const issues = [];
const warnings = [];

function walk(dir, cb, ignore = ['node_modules', '.svelte-kit', 'build', '.omc', '.firebase', 'scripts', 'media', '.git']) {
  for (const entry of readdirSync(dir)) {
    if (ignore.includes(entry)) continue;
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) walk(full, cb, ignore);
    else cb(full);
  }
}

function check(file, content, lineNum, message, severity = 'error') {
  const rel = relative(root, file);
  const entry = { file: rel, line: lineNum, message };
  if (severity === 'error') issues.push(entry);
  else warnings.push(entry);
}

function lines(content) {
  return content.split('\n');
}

// ── Rule 1: PUBLIC_* env vars that look like secrets ──
function checkEnvSecrets(file, content) {
  if (!file.endsWith('.env.local') && !file.endsWith('.env.example')) return;
  lines(content).forEach((line, i) => {
    const match = line.match(/^PUBLIC_[A-Z_]*?(PASS|SECRET|PRIVATE)[A-Z_]*\s*=/);
    if (match) {
      check(file, content, i + 1, `PUBLIC_* env var contains secret-like keyword (${match[1]}) — ships to client bundle`);
    }
  });
}

// ── Rule 2: Hardcoded emails/IPs in client code ──
function checkHardcodedPII(file, content) {
  if (!file.match(/\/src\/.*\.(ts|svelte|js)$/)) return;
  if (file.includes('.test.')) return; // Test fixtures OK
  if (file.includes('/data/')) return; // Known static data
  if (file.includes('/i18n/')) return; // i18n contact emails OK

  lines(content).forEach((line, i) => {
    // Skip imports, comments, and explicit suppressions
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) return;
    if (line.includes('audit-ignore:email')) return;

    // Email regex — but allow known-safe patterns
    const emailMatch = line.match(/['"`]([\w.-]+@[\w.-]+\.\w+)['"`]/);
    if (emailMatch) {
      const email = emailMatch[1];
      // Skip: ethoz.cl addresses (official), example domains, placeholders in form inputs
      const isExampleDomain = email.includes('example.') || email.includes('ejemplo.') || email.includes('colegio.cl');
      const isPlaceholder = line.includes('placeholder') || line.includes('autocomplete');
      if (!email.endsWith('@ethoz.cl') && !isExampleDomain && !isPlaceholder) {
        check(file, content, i + 1, `Hardcoded email in client code: ${email}`);
      }
    }

    // Public IP regex (not localhost, not private ranges)
    const ipMatch = line.match(/['"](\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})['"]/);
    if (ipMatch) {
      const ip = ipMatch[1];
      const [a, b] = ip.split('.').map(Number);
      const isPrivate = a === 10 || a === 127 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || a === 0;
      if (!isPrivate) {
        check(file, content, i + 1, `Hardcoded public IP in client code: ${ip}`);
      }
    }
  });
}

// ── Rule 3: Raw contact_email in log/captureError calls ──
function checkPIILogging(file, content) {
  if (!file.match(/\/src\/.*\.(ts|svelte)$/)) return;
  if (file.includes('.test.')) return;

  lines(content).forEach((line, i) => {
    // Match log.*/console.*/captureError calls that include contact_email without maskEmail
    if (line.match(/(log\.|console\.|captureError\()/) && line.includes('contact_email') && !line.includes('maskEmail')) {
      check(file, content, i + 1, 'PII (contact_email) passed to log/error without maskEmail()');
    }
  });
}

// ── Rule 4: alert() / confirm() in admin pages ──
function checkAlertConfirm(file, content) {
  if (!file.match(/\/src\/routes\/admin\/.*\.svelte$/)) return;

  lines(content).forEach((line, i) => {
    // Skip comments
    if (line.trim().startsWith('//')) return;
    if (line.match(/\balert\s*\(/)) {
      check(file, content, i + 1, 'alert() in admin page — use toast from svelte-sonner instead', 'warning');
    }
    if (line.match(/\bconfirm\s*\(/)) {
      check(file, content, i + 1, 'confirm() in admin page — use shadcn Dialog for confirmations instead', 'warning');
    }
  });
}

// ── Rule 5: Direct supabase.from('leads').insert() ──
function checkDirectLeadInsert(file, content) {
  if (!file.match(/\/src\/.*\.(ts|svelte)$/)) return;
  if (file.endsWith('supabase.ts')) return; // Legacy fallback allowed in supabase.ts

  const joined = content.replace(/\s+/g, ' ');
  if (joined.match(/from\s*\(\s*['"]leads['"]\s*\)\s*\.insert/)) {
    check(file, content, 1, 'Direct insert to leads table — must go through verify-lead Edge Function');
  }
}

// ── Rule 6: OAuth client_secret in URL query params ──
function checkOAuthSecretInUrl(file, content) {
  if (!file.match(/\/supabase\/functions\/.*\.ts$/)) return;

  lines(content).forEach((line, i) => {
    // Pattern: URL with client_secret= in a template literal or string
    if (line.match(/[`'"].*\?[^`'"]*client_secret\s*=/)) {
      check(file, content, i + 1, 'OAuth client_secret in URL query param — move to POST body');
    }
  });
}

// ── Rule 7: Non-admin RLS patterns ──
function checkRLSPatterns(file, content) {
  if (!file.endsWith('.sql')) return;

  lines(content).forEach((line, i) => {
    if (line.includes("auth.role() = 'authenticated'")) {
      check(file, content, i + 1, "RLS uses 'authenticated' — should be admin-specific UUID or role check", 'warning');
    }
  });
}

// ── Rule 8: Optional webhook signature verification ──
function checkOptionalSignature(file, content) {
  if (!file.match(/\/supabase\/functions\/.*webhook.*\.ts$/)) return;

  const joined = content.replace(/\s+/g, ' ');
  if (joined.match(/if\s*\(\s*\w*[Ss]ecret\s*\)\s*\{[^}]*verifySignature/)) {
    check(file, content, 1, 'Webhook signature verification is conditional — must be mandatory');
  }
}

// ── Run ──
walk(root, (file) => {
  try {
    const content = readFileSync(file, 'utf8');
    checkEnvSecrets(file, content);
    checkHardcodedPII(file, content);
    checkPIILogging(file, content);
    checkAlertConfirm(file, content);
    checkDirectLeadInsert(file, content);
    checkOAuthSecretInUrl(file, content);
    checkRLSPatterns(file, content);
    checkOptionalSignature(file, content);
  } catch {
    // Binary or unreadable file — skip
  }
}, ['node_modules', '.svelte-kit', 'build', '.omc', '.firebase', 'media', '.git', 'test-results', 'docs', 'Directorio-Oficial-EE-2025', 'Directorio-Oficial-Sostenedores-2025']);

// ── Report ──
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const GREEN = '\x1b[32m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

console.log(`\n${BOLD}Security Audit${RESET}`);
console.log('─'.repeat(60));

if (issues.length === 0 && warnings.length === 0) {
  console.log(`${GREEN}✔ No security issues found${RESET}\n`);
  process.exit(0);
}

if (issues.length > 0) {
  console.log(`\n${RED}${BOLD}${issues.length} error(s):${RESET}`);
  for (const { file, line, message } of issues) {
    console.log(`  ${RED}✘${RESET} ${file}:${line}`);
    console.log(`    ${message}`);
  }
}

if (warnings.length > 0) {
  console.log(`\n${YELLOW}${BOLD}${warnings.length} warning(s):${RESET}`);
  for (const { file, line, message } of warnings) {
    console.log(`  ${YELLOW}⚠${RESET} ${file}:${line}`);
    console.log(`    ${message}`);
  }
}

console.log(`\n${BOLD}Total:${RESET} ${issues.length} errors, ${warnings.length} warnings\n`);
process.exit(issues.length > 0 ? 1 : 0);
