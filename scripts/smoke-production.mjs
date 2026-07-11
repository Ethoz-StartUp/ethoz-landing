#!/usr/bin/env node

/**
 * Read-only production smoke test.
 *
 * Uses Node's HTTP client through fetch, so it does not execute landing-page
 * JavaScript, grant analytics consent, or submit any form/lead payload.
 */

const DEFAULT_BASE_URL = 'https://ethoz.cl';
const CANONICAL_ORIGIN = 'https://ethoz.cl';
const REQUEST_TIMEOUT_MS = 10_000;
const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1_000;

const baseUrl = normalizeBaseUrl(process.env.SMOKE_BASE_URL ?? DEFAULT_BASE_URL);
let checks = 0;

function normalizeBaseUrl(input) {
  const url = new URL(input);
  if (url.protocol !== 'https:') {
    throw new Error(`SMOKE_BASE_URL must use HTTPS (received ${url.protocol})`);
  }

  url.pathname = '/';
  url.search = '';
  url.hash = '';
  return url;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function pass(message) {
  checks += 1;
  console.log(`PASS ${message}`);
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function request(path, { method = 'GET', origin = baseUrl } = {}) {
  const url = new URL(path, origin);
  let lastError;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        method,
        redirect: 'manual',
        signal: controller.signal,
        headers: {
          accept: method === 'HEAD' ? '*/*' : 'text/html,application/xml,text/plain;q=0.9,*/*;q=0.8',
          'user-agent': 'Ethoz-CI-Smoke/1.0',
        },
      });

      if (response.status < 500 || attempt === MAX_ATTEMPTS) return { response, url };
      lastError = new Error(`${url.href} returned HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
      if (attempt === MAX_ATTEMPTS) break;
    } finally {
      clearTimeout(timeout);
    }

    await delay(RETRY_DELAY_MS * attempt);
  }

  throw new Error(`Request failed after ${MAX_ATTEMPTS} attempts: ${url.href}`, {
    cause: lastError,
  });
}

function getCanonical(html) {
  const linkTags = html.match(/<link\b[^>]*>/gi) ?? [];
  const canonicalTag = linkTags.find((tag) => /\brel=["']canonical["']/i.test(tag));
  return canonicalTag?.match(/\bhref=["']([^"']+)["']/i)?.[1] ?? null;
}

async function checkPage(path) {
  const { response, url } = await request(path);
  const html = await response.text();
  const expectedCanonical = new URL(path, CANONICAL_ORIGIN).href;

  assert(response.status === 200, `${url.href}: expected HTTP 200, received ${response.status}`);
  assert(
    response.headers.get('content-type')?.toLowerCase().includes('text/html'),
    `${url.href}: expected an HTML content type`,
  );
  assert(/<html\b[^>]*\blang=["']es["']/i.test(html), `${url.href}: missing <html lang="es">`);
  assert(
    getCanonical(html) === expectedCanonical,
    `${url.href}: expected canonical ${expectedCanonical}, received ${getCanonical(html) ?? 'none'}`,
  );

  pass(`${path} returns canonical HTML`);
  return response;
}

async function checkRedirect(path, expectedLocation, origin = baseUrl.origin) {
  const { response, url: requestUrl } = await request(path, { method: 'HEAD', origin });

  const location = response.headers.get('location');
  const actualUrl = location ? new URL(location, requestUrl).href : null;
  const expectedUrl = new URL(expectedLocation, baseUrl).href;

  assert(response.status === 301, `${requestUrl.href}: expected HTTP 301, received ${response.status}`);
  assert(
    actualUrl === expectedUrl,
    `${requestUrl.href}: expected redirect to ${expectedUrl}, received ${actualUrl ?? 'no Location header'}`,
  );
  pass(`${requestUrl.pathname} permanently redirects and preserves query params`);
}

function checkSecurityHeaders(response) {
  const expectations = [
    ['strict-transport-security', 'max-age=31536000'],
    ['content-security-policy', "default-src 'self'"],
    ['x-frame-options', 'DENY'],
    ['x-content-type-options', 'nosniff'],
    ['referrer-policy', 'strict-origin-when-cross-origin'],
    ['permissions-policy', 'camera=()'],
  ];

  for (const [header, expectedValue] of expectations) {
    const actualValue = response.headers.get(header);
    assert(
      actualValue?.includes(expectedValue),
      `/: expected ${header} to include ${expectedValue}, received ${actualValue ?? 'no header'}`,
    );
  }

  pass('required production security headers are present');
}

async function checkDiscoveryFiles() {
  const robotsResult = await request('/robots.txt');
  const robots = await robotsResult.response.text();
  assert(robotsResult.response.status === 200, `/robots.txt returned ${robotsResult.response.status}`);
  assert(
    robots.includes('Sitemap: https://ethoz.cl/sitemap.xml'),
    '/robots.txt does not reference the canonical sitemap',
  );
  pass('/robots.txt references the canonical sitemap');

  const sitemapResult = await request('/sitemap.xml');
  const sitemap = await sitemapResult.response.text();
  assert(sitemapResult.response.status === 200, `/sitemap.xml returned ${sitemapResult.response.status}`);
  assert(sitemap.includes('<loc>https://ethoz.cl/</loc>'), '/sitemap.xml does not include the homepage');
  assert(sitemap.includes('<loc>https://ethoz.cl/contacto</loc>'), '/sitemap.xml does not include /contacto');
  pass('/sitemap.xml includes canonical Spanish routes');
}

async function main() {
  console.log(`Running read-only smoke against ${baseUrl.origin}`);

  const homeResponse = await checkPage('/');
  checkSecurityHeaders(homeResponse);

  for (const path of ['/demo', '/contacto', '/agendar', '/seguridad-datos']) {
    await checkPage(path);
  }

  await checkDiscoveryFiles();

  await checkRedirect('/contact?utm_source=ci-smoke', '/contacto?utm_source=ci-smoke');
  await checkRedirect('/schedule?utm_source=ci-smoke', '/agendar?utm_source=ci-smoke');
  await checkRedirect(
    '/features/access-control?utm_source=ci-smoke',
    '/funcionalidades/acceso-por-rol?utm_source=ci-smoke',
  );

  if (baseUrl.hostname === 'ethoz.cl') {
    await checkRedirect(
      '/contacto?utm_source=ci-smoke',
      'https://ethoz.cl/contacto?utm_source=ci-smoke',
      'https://www.ethoz.cl',
    );
  }

  console.log(`Smoke complete: ${checks} checks passed.`);
}

main().catch((error) => {
  console.error(`FAIL ${error.message}`);
  if (error.cause) console.error(`Cause: ${error.cause.message ?? error.cause}`);
  process.exitCode = 1;
});
