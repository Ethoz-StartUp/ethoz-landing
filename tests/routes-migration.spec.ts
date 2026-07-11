import { expect, test } from '@playwright/test';

const ROUTE_REDIRECTS = [
	['/about', '/nosotros'],
	['/contact', '/contacto'],
	['/integrations', '/integraciones'],
	['/get-started', '/como-contratar'],
	['/compliance', '/cumplimiento'],
	['/resources', '/recursos'],
	['/roi-calculator', '/calculadora-roi'],
	['/privacy', '/privacidad'],
	['/terms', '/terminos'],
	['/schedule', '/agendar'],
	['/pitch', '/presentacion'],
	['/suggestions', '/sugerencias'],
	['/features/student-profile', '/funcionalidades/ficha-alumno'],
	['/features/safe-pickups', '/funcionalidades/retiros-seguros'],
	['/features/access-control', '/funcionalidades/acceso-por-rol'],
	['/features/smart-search', '/funcionalidades/busqueda-contextual'],
	['/features/privacy-compliance', '/funcionalidades/privacidad-datos'],
	['/features/alerts', '/funcionalidades/alertas'],
	['/features/analytics', '/funcionalidades/indicadores'],
	['/features/emergency', '/funcionalidades/emergencias'],
	['/features/attendance', '/funcionalidades/asistencia'],
	['/resources/breach-response-plan', '/recursos/plan-respuesta-brechas'],
	['/resources/compliance-checklist', '/recursos/checklist-cumplimiento'],
	['/resources/data-inventory', '/recursos/inventario-datos'],
	['/resources/pickup-protocol', '/recursos/protocolo-retiros'],
	['/resources/privacy-notice', '/recursos/aviso-privacidad'],
	['/resources/roles-permissions-guide', '/recursos/guia-roles-permisos']
] as const;

const HOSTING_REDIRECTS = [...ROUTE_REDIRECTS, ['/en', '/'] as const];

const firebaseHostingOrigin = process.env.TEST_FIREBASE_ORIGIN ?? process.env.TEST_PROD_ORIGIN;
const FIREBASE_HOSTING_ORIGIN = firebaseHostingOrigin?.replace(/\/$/, '');

const redirectsEnabled =
	process.env.TEST_FIREBASE_REDIRECTS === '1' || process.env.TEST_PROD_HEADERS === '1';

if (redirectsEnabled && !FIREBASE_HOSTING_ORIGIN) {
	throw new Error(
		'TEST_FIREBASE_ORIGIN or TEST_PROD_ORIGIN is required when redirect validation is enabled'
	);
}

function isLegacyPath(pathname: string): boolean {
	return ROUTE_REDIRECTS.some(
		([legacy]) => pathname === legacy || pathname.startsWith(`${legacy}/`)
	);
}

function extractHrefs(html: string): string[] {
	return Array.from(html.matchAll(/\bhref\s*=\s*["']([^"']+)["']/gi), (match) => match[1]);
}

test.describe('Slug migration — Firebase Hosting redirects', () => {
	for (const [legacy, destination] of HOSTING_REDIRECTS) {
		test(`${legacy} returns one 301 to ${destination} and preserves attribution`, async ({
			request
		}) => {
			test.skip(
				!redirectsEnabled || !FIREBASE_HOSTING_ORIGIN,
				'Set TEST_FIREBASE_REDIRECTS=1 and TEST_FIREBASE_ORIGIN to a Firebase Emulator/live Hosting origin'
			);

			const query = '?utm_source=slug-migration&ref=playwright';
			const response = await request.get(`${FIREBASE_HOSTING_ORIGIN!}${legacy}${query}`, {
				maxRedirects: 0
			});

			expect(response.status(), `${legacy} must return one permanent redirect`).toBe(301);

			const locationHeader = response.headers()['location'];
			expect(locationHeader, `${legacy} must include a Location header`).toBeTruthy();

			const location = new URL(locationHeader!, FIREBASE_HOSTING_ORIGIN!);
			expect(location.origin, `${legacy} must remain on the tested Hosting origin`).toBe(
				FIREBASE_HOSTING_ORIGIN
			);
			expect(location.pathname, `${legacy} must point directly to its final destination`).toBe(
				destination
			);
			expect(location.searchParams.get('utm_source'), `${legacy} must preserve attribution`).toBe(
				'slug-migration'
			);
			expect(location.searchParams.get('ref'), `${legacy} must preserve the full query`).toBe(
				'playwright'
			);

			const finalResponse = await request.get(location.toString(), { maxRedirects: 0 });
			expect(
				finalResponse.status(),
				`${destination} must be the final 200 response, not another redirect`
			).toBe(200);
		});
	}

	test('redirect globs cover trailing slashes and nested legacy paths', async ({ request }) => {
		test.skip(
			!redirectsEnabled,
			'Set TEST_FIREBASE_REDIRECTS=1 and TEST_FIREBASE_ORIGIN to a Firebase Emulator/live Hosting origin'
		);

		const cases = [
			['/about/', '/nosotros'],
			['/about/legacy-child', '/nosotros'],
			['/features/alerts/legacy-child', '/funcionalidades/alertas'],
			['/resources/privacy-notice/legacy-child', '/recursos/aviso-privacidad'],
			['/en/legacy-child', '/']
		] as const;

		for (const [legacy, destination] of cases) {
			const response = await request.get(
				`${FIREBASE_HOSTING_ORIGIN!}${legacy}?utm_source=glob-probe`,
				{ maxRedirects: 0 }
			);
			expect(response.status(), `${legacy} must redirect permanently`).toBe(301);

			const location = new URL(response.headers()['location'], FIREBASE_HOSTING_ORIGIN!);
			expect(location.origin).toBe(FIREBASE_HOSTING_ORIGIN);
			expect(location.pathname).toBe(destination);
			expect(location.searchParams.get('utm_source')).toBe('glob-probe');
		}
	});

	test('renamed internal routes retain crawler-blocking Hosting headers', async ({ request }) => {
		test.skip(
			!redirectsEnabled,
			'Set TEST_FIREBASE_REDIRECTS=1 and TEST_FIREBASE_ORIGIN to a Firebase Emulator/live Hosting origin'
		);

		for (const route of ['/agendar', '/presentacion', '/sugerencias', '/demo/1001']) {
			const response = await request.get(`${FIREBASE_HOSTING_ORIGIN!}${route}`);
			expect(response.status(), `${route} must remain reachable`).toBe(200);
			expect(
				response.headers()['x-robots-tag']?.toLowerCase(),
				`${route} must stay noindex`
			).toContain('noindex');
		}
	});
});

test.describe('Slug migration — canonical route integrity', () => {
	test('sitemap and internal hrefs contain no legacy slugs', async ({ request }) => {
		const sitemapResponse = await request.get('/sitemap.xml');
		expect(sitemapResponse.status()).toBe(200);
		const sitemap = await sitemapResponse.text();
		const sitemapUrls = Array.from(
			sitemap.matchAll(/<loc>(https:\/\/ethoz\.cl[^<]+)<\/loc>/g),
			(match) => match[1]
		);
		expect(sitemapUrls.length, 'sitemap audit must inspect the complete public route set').toBeGreaterThan(
			50
		);

		const legacySitemapUrls = sitemapUrls.filter((url) => isLegacyPath(new URL(url).pathname));
		expect(legacySitemapUrls, 'sitemap.xml must contain only canonical Spanish routes').toEqual([]);

		const routesToScan = [
			...new Set([
				'/',
				...sitemapUrls.map((url) => new URL(url).pathname),
				'/demo',
				'/agendar',
				'/presentacion',
				'/sugerencias'
			])
		];

		const pages = await Promise.all(
			routesToScan.map(async (route) => {
				const response = await request.get(route);
				expect(response.status(), `${route} must load while auditing internal links`).toBe(200);
				return { route, html: await response.text() };
			})
		);

		const staleLinks: string[] = [];
		for (const { route, html } of pages) {
			for (const href of extractHrefs(html)) {
				let resolved: URL;
				try {
					resolved = new URL(href.replaceAll('&amp;', '&'), 'https://ethoz.cl');
				} catch {
					continue;
				}

				if (
					['ethoz.cl', 'www.ethoz.cl'].includes(resolved.hostname) &&
					isLegacyPath(resolved.pathname)
				) {
					staleLinks.push(`${route} -> ${href}`);
				}
			}

			for (const match of html.matchAll(/https?:\/\/(?:www\.)?ethoz\.cl\/[^"'<>\\\s]*/gi)) {
				const absoluteUrl = new URL(match[0].replaceAll('&amp;', '&'));
				if (isLegacyPath(absoluteUrl.pathname)) {
					staleLinks.push(`${route} -> ${match[0]}`);
				}
			}
		}

		expect(
			staleLinks,
			'internal links and canonical hrefs must not reference legacy slugs'
		).toEqual([]);
	});
});
