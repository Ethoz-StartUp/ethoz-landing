import { expect, test } from '@playwright/test';

async function seedEssentialConsent(page: import('@playwright/test').Page) {
	await page.addInitScript(() => {
		localStorage.setItem(
			'ethoz_consent_v1',
			JSON.stringify({ essential: true, analytics: false, marketing: false, updatedAt: Date.now() })
		);
	});
}

for (const viewport of [
	{ name: 'mobile', width: 390, height: 844 },
	{ name: 'tablet', width: 834, height: 1112 },
	{ name: 'desktop', width: 1440, height: 1000 }
]) {
	test.describe(`Home regressions, ${viewport.name}`, () => {
		test.use({ viewport: { width: viewport.width, height: viewport.height } });

		test.beforeEach(async ({ page }) => {
			await seedEssentialConsent(page);
			await page.goto('/');
		});

		test('operational mockup remains visible with the full student name', async ({ page }) => {
			await expect(page.getByText('Ethoz · Demo operacional', { exact: true })).toBeVisible();
			const studentName = page.getByText('Alumno de ejemplo', { exact: true }).first();
			await expect(studentName).toBeVisible();
			expect(
				await studentName.evaluate((element) => ({
					text: element.textContent?.trim(),
					textOverflow: getComputedStyle(element).textOverflow,
					overflows: element.scrollWidth > element.clientWidth + 1
				}))
			).toEqual({ text: 'Alumno de ejemplo', textOverflow: 'clip', overflows: false });
		});

		test('fast scrolling never makes reveal sections transparent', async ({ page }) => {
			await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
			await expect
				.poll(() => page.evaluate(() => window.scrollY > 0))
				.toBe(true);

			const hiddenSections = await page.locator('section.reveal').evaluateAll((sections) =>
				sections.filter((section) => {
					const style = getComputedStyle(section);
					return Number(style.opacity) < 0.99 || style.visibility === 'hidden';
				}).length
			);
			expect(hiddenSections).toBe(0);
		});

		test('layout has no horizontal overflow', async ({ page }) => {
			const dimensions = await page.evaluate(() => ({
				viewport: window.innerWidth,
				document: document.documentElement.scrollWidth
			}));
			expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport + 1);
		});
	});
}

test('home CTAs use real links', async ({ page }) => {
	await seedEssentialConsent(page);
	await page.goto('/');
	// Primary action of the pivot: the Protocol Audit offer.
	const auditLinks = page.locator('main a[href="/auditoria"]');
	expect(await auditLinks.count()).toBeGreaterThanOrEqual(4);
	// The demo remains reachable as the secondary path.
	const demoLinks = page.locator('main a[href="/demo"]');
	expect(await demoLinks.count()).toBeGreaterThanOrEqual(2);
	await expect(
		page.locator('main button').filter({ hasText: /Agendar demo|Auditar mis protocolos/i })
	).toHaveCount(0);
});

test('essential cookie consent is stored on the first visible click', async ({ page }) => {
	await page.addInitScript(() => {
		localStorage.removeItem('cookie-consent');
		localStorage.removeItem('ethoz_consent_v1');
	});
	await page.goto('/');

	const banner = page.getByRole('region', { name: /cookies|consent/i });
	await expect(banner).toBeVisible();
	await banner.getByRole('button', { name: /solo esenciales|essential only/i }).click();
	await expect(banner).toBeHidden();

	await expect
		.poll(() =>
			page.evaluate(() => {
				const stored = localStorage.getItem('ethoz_consent_v1');
				return stored ? JSON.parse(stored) : null;
			})
		)
		.toMatchObject({ essential: true, analytics: false, marketing: false });
});
