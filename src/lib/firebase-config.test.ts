import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

type HostingConfig = {
	rewrites?: Array<{ source: string; destination: string }>;
	headers?: Array<{ source: string; headers: Array<{ key: string; value: string }> }>;
	trailingSlash?: boolean;
};

const firebaseConfig = JSON.parse(
	readFileSync(join(process.cwd(), 'firebase.json'), 'utf8')
) as { hosting: HostingConfig[] };

describe('Firebase Hosting SEO boundaries', () => {
	it('keeps the SPA fallback scoped to dynamic demo routes', () => {
		for (const hosting of firebaseConfig.hosting) {
			expect(hosting.rewrites).toEqual([
				{ source: '/suggestions', destination: '/200.html' },
				{ source: '/demo/**', destination: '/200.html' }
			]);
			expect(hosting.trailingSlash).toBe(false);
		}
	});

	it('sends noindex headers for private funnel and internal pages', () => {
		const expectedSources = [
			'/schedule',
			'/pitch',
			'/suggestions',
			'/demo/**',
			'/logos/preview{,.html}'
		];

		for (const hosting of firebaseConfig.hosting) {
			for (const source of expectedSources) {
				const rule = hosting.headers?.find((entry) => entry.source === source);
				expect(rule?.headers).toContainEqual({
					key: 'X-Robots-Tag',
					value: 'noindex, nofollow'
				});
			}
		}
	});

	it('does not retain the removed IP lookup in the CSP', () => {
		for (const hosting of firebaseConfig.hosting) {
			const globalHeaders = hosting.headers?.find((entry) => entry.source === '**');
			const csp = globalHeaders?.headers.find(
				(header) => header.key === 'Content-Security-Policy'
			)?.value;
			expect(csp).not.toContain('api.ipify.org');
		}
	});
});
