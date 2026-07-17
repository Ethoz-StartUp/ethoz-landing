import { test, expect, type Page } from '@playwright/test';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Patch dataLayer.push AFTER the page has loaded so we capture all subsequent
 * pushes. Must be called after page.goto() + waitForLoadState().
 * Returns captured events via _captured on window.
 */
async function patchDataLayer(page: Page) {
	await page.evaluate(() => {
		(window as any)._captured = [];
		const dl = (window as any).dataLayer;
		if (!dl) return;
		const orig = dl.push.bind(dl);
		dl.push = function (...args: any[]) {
			(window as any)._captured.push(...args);
			return orig(...args);
		};
		// Clear internal flag to ensure trackEvent fires
		localStorage.removeItem('ethoz_internal');
		sessionStorage.removeItem('ethoz_ip_checked');
	});
}

async function getCaptured(page: Page, eventName: string) {
	return page.evaluate(
		(name: string) => ((window as any)._captured ?? []).filter((e: any) => e.event === name),
		eventName
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Hero CTA buttons fire hero_cta_clicked
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Pre-seed localStorage with accepted consent so GTM loads and trackEvent
 * reaches dataLayer. Must be called BEFORE page.goto().
 */
async function acceptConsent(page: Page) {
	await page.addInitScript(() => {
		localStorage.setItem(
			'ethoz_consent_v1',
			JSON.stringify({ essential: true, analytics: true, marketing: true, updatedAt: Date.now() })
		);
	});
}

/**
 * Cancel SvelteKit client-side navigation while letting bubble-phase onclick
 * handlers (trackEvent) fire. SvelteKit bails out when defaultPrevented is set.
 */
async function blockNavigation(page: Page) {
	await page.evaluate(() => {
		addEventListener('click', (event) => event.preventDefault(), true);
	});
}

test.describe('Analytics — hero CTA trackEvent calls', () => {
	test('Request Audit hero link fires hero_cta_clicked with cta:request_audit location:hero', async ({
		page
	}) => {
		await acceptConsent(page);
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await patchDataLayer(page);
		await blockNavigation(page);

		const auditLink = page.locator('main a#hero-cta[href="/auditoria"]');
		await expect(auditLink).toBeVisible();
		await auditLink.click();
		await page.waitForTimeout(500);

		const events = await getCaptured(page, 'hero_cta_clicked');
		const requestAudit = events.filter(
			(e: any) => e.cta === 'request_audit' && e.location === 'hero'
		);
		expect(requestAudit.length).toBeGreaterThanOrEqual(1);
	});

	test('View Demo hero link fires hero_cta_clicked with cta:book_demo location:hero', async ({
		page
	}) => {
		await acceptConsent(page);
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await patchDataLayer(page);
		await blockNavigation(page);

		const bookDemoLink = page.locator('main a[href="/demo"]').first();
		await expect(bookDemoLink).toBeVisible();
		await bookDemoLink.click();
		await page.waitForTimeout(500);

		const events = await getCaptured(page, 'hero_cta_clicked');
		const bookDemo = events.filter(
			(e: any) => e.cta === 'book_demo' && e.location === 'hero'
		);
		expect(bookDemo.length).toBeGreaterThanOrEqual(1);
	});

	test('Sticky CTA fires hero_cta_clicked with cta:request_audit location:sticky', async ({
		page
	}) => {
		// Use mobile viewport so sticky CTA renders (md:hidden = hidden on ≥768px)
		await page.setViewportSize({ width: 375, height: 812 });
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await patchDataLayer(page);

		// Dismiss cookie consent banner — it sits in a fixed bottom overlay that
		// intercepts pointer events over the sticky CTA. Use the new consent store key.
		await page.evaluate(() => {
			localStorage.setItem(
				'ethoz_consent_v1',
				JSON.stringify({ essential: true, analytics: true, marketing: true, updatedAt: Date.now() })
			);
		});
		await page.reload();
		await page.waitForLoadState('networkidle');
		await patchDataLayer(page);

		// Scroll past 300px to trigger showStickyCta
		await page.evaluate(() => window.scrollTo(0, 500));
		await page.waitForTimeout(300);

		const stickyLink = page.locator('.fixed.bottom-0 a[href="/auditoria"]').first();
		await expect(stickyLink).toBeVisible({ timeout: 5000 });

		await blockNavigation(page);
		await stickyLink.click();
		await page.waitForTimeout(500);

		const events = await getCaptured(page, 'hero_cta_clicked');
		const stickyEvents = events.filter(
			(e: any) => e.cta === 'request_audit' && e.location === 'sticky'
		);
		expect(stickyEvents.length).toBeGreaterThanOrEqual(1);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Consent — reject flow
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Consent — reject flow', () => {
	test('no GTM/Clarity requests load when user picks "Solo esenciales"', async ({ page }) => {
		const gtmRequests: string[] = [];
		const clarityRequests: string[] = [];
		page.on('request', (req) => {
			const url = req.url();
			if (url.includes('googletagmanager.com/gtm.js')) gtmRequests.push(url);
			if (url.includes('clarity.ms/tag')) clarityRequests.push(url);
		});

		await page.goto('/');
		await page.getByRole('button', { name: 'Solo esenciales' }).click();

		// Navigate a couple of routes to let any lazy loader fire.
		await page.goto('/comparativa');
		await page.goto('/ley-21719');
		await page.waitForTimeout(2000);

		expect(gtmRequests).toHaveLength(0);
		expect(clarityRequests).toHaveLength(0);
	});

	test('trackEvent calls do not touch dataLayer pre-consent', async ({ page }) => {
		await page.goto('/');
		const countTrackedEvents = () => page.evaluate(() =>
			((window as any).dataLayer ?? []).filter((entry: any) =>
				entry?.event === 'hero_cta_clicked'
				|| (entry?.[0] === 'event' && entry?.[1] === 'hero_cta_clicked')
			).length
		);
		const eventsBefore = await countTrackedEvents();

		// Use a real tracked interaction with navigation cancelled. Consent
		// commands may legitimately enter dataLayer during hydration, so assert
		// specifically on measurement events rather than total queue length.
		await blockNavigation(page);
		const heroCta = page.locator('main a#hero-cta');
		await expect(heroCta).toBeVisible();
		await heroCta.click();
		await page.waitForTimeout(500);
		const eventsAfter = await countTrackedEvents();
		expect(eventsAfter).toBe(eventsBefore);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Consent — accept flow without pre-consent replay
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Consent — accept flow', () => {
	test('pre-consent events are dropped and only later interactions are measured', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		// Trigger a tracked interaction before any choice. Privacy-strict mode
		// drops it instead of persisting it for a later replay.
		await blockNavigation(page);
		const heroCta = page.locator('main a#hero-cta');
		await expect(heroCta).toBeVisible();
		await heroCta.click();
		await page.waitForTimeout(300);

		expect(await page.evaluate(() => sessionStorage.getItem('ethoz_pending_events'))).toBeNull();
		expect(
			await page.evaluate(() =>
				((window as any).dataLayer ?? []).some((entry: any) => entry?.event === 'hero_cta_clicked')
			)
		).toBe(false);

		// Grant consent and perform a new interaction.
		await page.getByRole('button', { name: 'Aceptar todo' }).click();
		await page.waitForTimeout(300);
		await heroCta.click();
		await page.waitForTimeout(300);

		const measured = await page.evaluate(() =>
			((window as any).dataLayer ?? []).some((e: any) => e.event === 'hero_cta_clicked')
		);
		expect(measured).toBe(true);
		expect(await page.evaluate(() => sessionStorage.getItem('ethoz_pending_events'))).toBeNull();
	});
});
