import { loadAllPosts } from '$lib/data/posts';
import type { RequestHandler } from './$types';

export const prerender = true;

const ORIGIN = 'https://ethoz.cl';
const RELEASE_DATE = '2026-07-11';

// Public, canonical pages only. Funnel end states and internal tools are
// deliberately excluded because they carry noindex directives.
const staticPaths = [
	'/',
	'/about',
	'/blog',
	'/circular-30',
	'/comparativa',
	'/compliance',
	'/contact',
	'/demo',
	'/features/access-control',
	'/features/alerts',
	'/features/analytics',
	'/features/attendance',
	'/features/emergency',
	'/features/privacy-compliance',
	'/features/safe-pickups',
	'/features/smart-search',
	'/features/student-profile',
	'/get-started',
	'/glosario',
	'/integrations',
	'/ley-21719',
	'/para-directores',
	'/para-porteros',
	'/para-sostenedores',
	'/privacy',
	'/productos',
	'/proyecciones',
	'/resources',
	'/resources/breach-response-plan',
	'/resources/compliance-checklist',
	'/resources/data-inventory',
	'/resources/pickup-protocol',
	'/resources/privacy-notice',
	'/resources/roles-permissions-guide',
	'/roi-calculator',
	'/seguridad-datos',
	'/terms'
] as const;

function urlEntry(path: string, lastmod: string): string {
	return `  <url>\n    <loc>${ORIGIN}${path}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
}

export const GET: RequestHandler = async () => {
	const posts = await loadAllPosts();
	const entries = [
		...staticPaths.map((path) => urlEntry(path, RELEASE_DATE)),
		...posts.map((post) => urlEntry(`/blog/${post.slug}`, post.date))
	];

	const body = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		...entries,
		'</urlset>',
		''
	].join('\n');

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600, s-maxage=86400'
		}
	});
};
