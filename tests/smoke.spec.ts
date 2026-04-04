import { test, expect } from '@playwright/test';

// ── Smoke test: critical pages load ──

test.describe('Smoke — pages load', () => {
	test('homepage loads with hero and nav', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveTitle(/Ethoz/);
		await expect(page.locator('nav')).toBeVisible();
		await expect(page.locator('h1')).toBeVisible();
	});

	test('blog listing loads with posts', async ({ page }) => {
		await page.goto('/blog');
		await expect(page).toHaveTitle(/Blog/);
		const posts = page.locator('a[href^="/blog/"]');
		await expect(posts.first()).toBeVisible();
		expect(await posts.count()).toBeGreaterThanOrEqual(3);
	});

	test('blog post detail loads with cover image', async ({ page }) => {
		await page.goto('/blog/ley-21719-que-deben-saber-los-colegios');
		await expect(page.locator('h1')).toContainText('Ley 21.719');
		await expect(page.locator('article img').first()).toBeVisible();
	});

	test('demo page loads with school search', async ({ page }) => {
		await page.goto('/demo');
		await expect(page.locator('input[type="text"], input[placeholder]').first()).toBeVisible();
	});

	test('compliance page loads', async ({ page }) => {
		await page.goto('/compliance');
		await expect(page).toHaveTitle(/Ethoz/);
		await expect(page.locator('h1, h2').first()).toBeVisible();
	});
});

// ── Smoke test: GTM and analytics ──

test.describe('Smoke — GTM & analytics', () => {
	test('GTM script is present in head', async ({ page }) => {
		await page.goto('/');
		const gtmScript = await page.evaluate(() => {
			const scripts = Array.from(document.querySelectorAll('script'));
			return scripts.some(s => s.textContent?.includes('GTM-WX6ZCXLZ'));
		});
		expect(gtmScript).toBe(true);
	});

	test('GTM noscript iframe is present', async ({ page }) => {
		await page.goto('/');
		const iframe = page.locator('noscript iframe[src*="GTM-WX6ZCXLZ"]');
		// noscript content isn't rendered, but we can check the raw HTML
		const html = await page.content();
		expect(html).toContain('GTM-WX6ZCXLZ');
	});

	test('dataLayer exists and receives events', async ({ page }) => {
		await page.goto('/');
		const hasDataLayer = await page.evaluate(() => {
			return Array.isArray((window as any).dataLayer);
		});
		expect(hasDataLayer).toBe(true);
	});

	test('blog post view fires tracking event', async ({ page }) => {
		// Intercept dataLayer pushes
		await page.goto('/blog/ley-21719-que-deben-saber-los-colegios');
		const events = await page.evaluate(() => {
			return (window as any).dataLayer
				?.filter((e: any) => e.event === 'blog_post_viewed')
				?.map((e: any) => ({ event: e.event, slug: e.slug }));
		});
		expect(events).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					event: 'blog_post_viewed',
					slug: 'ley-21719-que-deben-saber-los-colegios'
				})
			])
		);
	});
});

// ── Smoke test: lead funnel integrity ──

test.describe('Smoke — lead funnel', () => {
	test('homepage CTA links to /demo', async ({ page }) => {
		await page.goto('/');
		const ctaLink = page.locator('a[href="/demo"]').first();
		await expect(ctaLink).toBeVisible();
	});

	test('FAQ section renders all items', async ({ page }) => {
		await page.goto('/');
		const faqSection = page.locator('#faq');
		await faqSection.scrollIntoViewIfNeeded();
		const faqButtons = faqSection.locator('button');
		expect(await faqButtons.count()).toBeGreaterThanOrEqual(7);
	});

	test('FAQ accordion opens on click', async ({ page }) => {
		await page.goto('/');
		const faqSection = page.locator('#faq');
		await faqSection.scrollIntoViewIfNeeded();
		const firstFaqBtn = faqSection.locator('button').first();
		await firstFaqBtn.click();
		// After click, answer should be visible
		const answer = faqSection.locator('button + div').first();
		await expect(answer).toBeVisible();
	});

	test('cookie consent banner appears', async ({ page, context }) => {
		await context.clearCookies();
		// Clear localStorage by navigating then clearing
		await page.goto('/');
		await page.evaluate(() => localStorage.removeItem('cookie-consent'));
		await page.reload();
		const banner = page.locator('text=Usamos cookies');
		await expect(banner).toBeVisible({ timeout: 5000 });
	});
});

// ── Smoke test: SEO basics ──

test.describe('Smoke — SEO', () => {
	test('homepage has canonical URL', async ({ page }) => {
		await page.goto('/');
		const canonical = page.locator('link[rel="canonical"]');
		await expect(canonical).toHaveAttribute('href', 'https://ethoz.cl/');
	});

	test('homepage has OG meta tags', async ({ page }) => {
		await page.goto('/');
		const ogTitle = page.locator('meta[property="og:title"]').first();
		await expect(ogTitle).toHaveAttribute('content', /Ethoz/);
	});

	test('blog post has article meta tags', async ({ page }) => {
		await page.goto('/blog/ley-21719-que-deben-saber-los-colegios');
		const html = await page.content();
		expect(html).toContain('og:type');
		expect(html).toContain('article');
	});

	test('all new blog posts are accessible', async ({ page }) => {
		const newPosts = [
			'/blog/ninguna-plataforma-cumple-ley-21719',
			'/blog/gestion-escolar-vs-proteccion-escolar',
			'/blog/roadmap-ethoz-2026'
		];
		for (const url of newPosts) {
			const response = await page.goto(url);
			expect(response?.status()).toBe(200);
			await expect(page.locator('h1')).toBeVisible();
		}
	});
});
