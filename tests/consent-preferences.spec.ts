import { expect, test, type Page } from '@playwright/test';

async function seedConsent(page: Page, analytics = false, marketing = false) {
	await page.addInitScript(
		({ analyticsChoice, marketingChoice }) => {
			localStorage.setItem(
				'ethoz_consent_v1',
				JSON.stringify({
					essential: true,
					analytics: analyticsChoice,
					marketing: marketingChoice,
					updatedAt: Date.now()
				})
			);
		},
		{ analyticsChoice: analytics, marketingChoice: marketing }
	);
}

test('footer cookie control reopens saved preferences and restores focus on Escape', async ({ page }) => {
	await seedConsent(page);
	await page.goto('/');

	const trigger = page.locator('footer').getByRole('button', { name: 'Cookies', exact: true });
	await trigger.scrollIntoViewIfNeeded();
	await expect(trigger).toBeVisible();
	await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
	await trigger.click();

	const dialog = page.getByRole('dialog');
	await expect(dialog).toBeVisible();
	await expect(dialog.getByRole('heading', { name: 'Preferencias de cookies' })).toBeVisible();

	const analytics = dialog.getByRole('switch', { name: 'Cookies de análisis' });
	const marketing = dialog.getByRole('switch', { name: 'Cookies de marketing' });
	await expect(analytics).toHaveAttribute('data-state', 'unchecked');
	await expect(marketing).toHaveAttribute('data-state', 'unchecked');

	await analytics.click();
	await dialog.getByRole('button', { name: 'Guardar preferencias' }).click();
	await expect(dialog).toBeHidden();

	await expect
		.poll(() =>
			page.evaluate(() => {
				const saved = localStorage.getItem('ethoz_consent_v1');
				return saved ? JSON.parse(saved) : null;
			})
		)
		.toMatchObject({ essential: true, analytics: true, marketing: false });

	await trigger.click();
	await expect(dialog).toBeVisible();
	await expect(analytics).toHaveAttribute('data-state', 'checked');
	await expect(marketing).toHaveAttribute('data-state', 'unchecked');

	await page.keyboard.press('Escape');
	await expect(dialog).toBeHidden();
	await expect(trigger).toBeFocused();
});

test('privacy notice documents providers, preferences, and localized metadata', async ({ page }) => {
	await seedConsent(page);
	await page.goto('/privacidad');

	await expect(page).toHaveTitle('Política de privacidad y cookies · Ethoz');
	await expect(page.getByRole('heading', { level: 1, name: 'Política de privacidad y cookies' })).toBeVisible();
	await expect(page.getByText('Última actualización: julio de 2026')).toBeVisible();
	await expect(page.getByText(/Google Tag Manager, Google Analytics 4 y Microsoft Clarity/)).toBeVisible();
	await expect(page.getByText(/Sentry funciona como monitoreo técnico esencial/)).toBeVisible();
	await expect(page.getByText(/formularios de contacto y demo usan reCAPTCHA de Google/)).toBeVisible();
	await expect(page.getByText(/página de agendamiento integra Cal.com/)).toBeVisible();

	const preferenceButton = page.getByRole('button', { name: 'Administrar cookies' });
	await preferenceButton.click();
	await expect(page.getByRole('dialog')).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(preferenceButton).toBeFocused();

	await page.locator('footer').getByRole('button', { name: 'English' }).click();
	await expect(page).toHaveTitle('Privacy and cookie policy · Ethoz');
	await expect(page.getByRole('heading', { level: 1, name: 'Privacy and cookie policy' })).toBeVisible();
	await expect(page.getByText('Last updated: July 2026')).toBeVisible();
	await expect(page.getByRole('button', { name: 'Manage cookies' })).toBeVisible();
});
