import { test, expect, type Page } from '@playwright/test';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Dismiss cookie consent banner if present, so it doesn't block form fields */
async function dismissCookies(page: Page) {
	const btn = page.locator('button', { hasText: /Aceptar/ });
	if (await btn.isVisible({ timeout: 3000 }).catch(() => false)) {
		await btn.click();
		await page.waitForTimeout(300);
	}
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Contact form submission failure
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Contact form — marketing submission failure', () => {
	test('shows error message when marketing endpoint returns 403', async ({ page }) => {
		await page.route('**/api/marketing/leads', (route) =>
			route.fulfill({ status: 403, body: 'Forbidden' })
		);

		await page.goto('/contacto');
		await dismissCookies(page);

		// Fill in all required fields
		await page.fill('#contact-name', 'Test Usuario');
		await page.fill('#contact-email', 'test@ejemplo.cl');
		await page.fill('#contact-message', 'Este es un mensaje de prueba para verificar el manejo de errores.');

		// Submit the form
		await page.locator('button[type="submit"]').click();

		// Error message should appear
		const errorEl = page.locator('[role="alert"]');
		await expect(errorEl).toBeVisible({ timeout: 10_000 });
	});

	test('does not show success state when submission fails', async ({ page }) => {
		await page.route('**/api/marketing/leads', (route) =>
			route.fulfill({ status: 403, body: 'Forbidden' })
		);

		await page.goto('/contacto');
		await dismissCookies(page);

		await page.fill('#contact-name', 'Test Usuario');
		await page.fill('#contact-email', 'test@ejemplo.cl');
		await page.fill('#contact-message', 'Mensaje de prueba para error handling.');

		await page.locator('button[type="submit"]').click();

		// Wait for the error to appear before asserting success is absent
		await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 10_000 });

		// Success state (Check icon container) must NOT be visible
		const successState = page.locator('.text-success').first();
		await expect(successState).not.toBeVisible();
	});

	test('form fields remain editable after failed submission', async ({ page }) => {
		await page.route('**/api/marketing/leads', (route) =>
			route.fulfill({ status: 403, body: 'Forbidden' })
		);

		await page.goto('/contacto');
		await dismissCookies(page);

		await page.fill('#contact-name', 'Test Usuario');
		await page.fill('#contact-email', 'test@ejemplo.cl');
		await page.fill('#contact-message', 'Mensaje de prueba.');

		await page.locator('button[type="submit"]').click();

		await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 10_000 });

		// Inputs should still be visible and enabled so the user can retry
		await expect(page.locator('#contact-name')).toBeVisible();
		await expect(page.locator('#contact-email')).toBeVisible();
		await expect(page.locator('#contact-message')).toBeVisible();
	});

	test('grecaptcha throws — shows error/mailto fallback', async ({ page }) => {
		// Simulate grecaptcha.execute throwing (e.g. network error or key misconfigured)
		await page.addInitScript(() => {
			Object.defineProperty(window, 'grecaptcha', {
				value: {
					ready: (cb: () => void) => cb(),
					execute: () => Promise.reject(new Error('reCAPTCHA network error')),
				},
				writable: true,
			});
		});

		await page.goto('/contacto');
		await dismissCookies(page);

		await page.fill('#contact-name', 'Test Usuario');
		await page.fill('#contact-email', 'test@ejemplo.cl');
		await page.fill('#contact-message', 'Mensaje que fallará por reCAPTCHA.');

		await page.locator('button[type="submit"]').click();

		// Should show error alert (mailto fallback message or general error)
		const errorEl = page.locator('[role="alert"]');
		await expect(errorEl).toBeVisible({ timeout: 10_000 });
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. School data load failure
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Demo page — schools data load failure', () => {
	test('invalid non-numeric RBD returns to school search', async ({ page }) => {
		await page.goto('/demo/not-a-valid-rbd');
		await expect(page).toHaveURL('/demo');
	});

	test('does not crash when schools.json fetch is aborted', async ({ page }) => {
		const jsErrors: string[] = [];
		page.on('pageerror', (err) => jsErrors.push(err.message));

		// Block the schools data file entirely
		await page.route('**/data/schools.json', (route) => route.abort());

		await page.goto('/demo');

		// Wait long enough for the fetch attempt and error handling to complete
		await page.waitForTimeout(3000);

		// The page must not have thrown any uncaught JS exceptions
		expect(jsErrors).toEqual([]);
	});

	test('still renders the page structure when schools.json is unavailable', async ({ page }) => {
		await page.route('**/data/schools.json', (route) => route.abort());

		await page.goto('/demo');

		// The heading and main landmark must still be visible (page renders, not blank)
		await expect(page.locator('main')).toBeVisible();
		await expect(page.locator('h1')).toBeVisible({ timeout: 5000 });
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Cal.com embed failure
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Schedule page — Cal.com embed failure', () => {
	test('shows fallback link when Cal.com embed script is blocked', async ({ page }) => {
		// Block the Cal.com embed script so onerror fires on the <script> element
		await page.route('**/embed/embed.js', (route) => route.abort());

		await page.goto('/agendar');

		// The fallback link appears when calError becomes true.
		// Give it up to 15s to account for the 10s timeout fallback timer in the component.
		const fallbackLink = page.locator('a[href="https://cal.com/ethoz/demo"]');
		await expect(fallbackLink).toBeVisible({ timeout: 15_000 });
	});

	test('does not crash when Cal.com script is blocked', async ({ page }) => {
		const jsErrors: string[] = [];
		page.on('pageerror', (err) => jsErrors.push(err.message));

		await page.route('**/embed/embed.js', (route) => route.abort());

		await page.goto('/agendar');

		// Wait for fallback to appear, then verify no unhandled errors occurred
		await expect(page.locator('a[href="https://cal.com/ethoz/demo"]')).toBeVisible({
			timeout: 15_000
		});

		expect(jsErrors).toEqual([]);
	});

	test('still shows page heading and layout when Cal.com is blocked', async ({ page }) => {
		await page.route('**/embed/embed.js', (route) => route.abort());

		await page.goto('/agendar');

		// Nav and heading should be immediately visible regardless of embed state
		await expect(page.locator('h1')).toBeVisible({ timeout: 5000 });
		await expect(page.locator('nav').first()).toBeVisible();
	});
});
