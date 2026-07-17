import { loadAllPosts } from '$lib/data/posts';
import type { RequestHandler } from './$types';

export const prerender = true;

const ORIGIN = 'https://ethoz.cl';
const RELEASE_DATE = '2026-07-11';

// Public, canonical pages only. Funnel end states and internal tools are
// deliberately excluded because they carry noindex directives.
const staticPaths = [
	'/',
	'/nosotros',
	'/blog',
	'/circular-30',
	'/comparativa',
	'/cumplimiento',
	'/contacto',
	'/demo',
	'/funcionalidades/acceso-por-rol',
	'/funcionalidades/actas-y-descargos',
	'/funcionalidades/alertas',
	'/funcionalidades/indicadores',
	'/funcionalidades/asistencia',
	'/funcionalidades/emergencias',
	'/funcionalidades/privacidad-datos',
	'/funcionalidades/retiros-seguros',
	'/funcionalidades/busqueda-contextual',
	'/funcionalidades/ficha-alumno',
	'/como-contratar',
	'/glosario',
	'/integraciones',
	'/ley-21719',
	'/para-directores',
	'/para-porteros',
	'/para-sostenedores',
	'/privacidad',
	'/productos',
	'/proyecciones',
	'/recursos',
	'/recursos/plan-respuesta-brechas',
	'/recursos/checklist-cumplimiento',
	'/recursos/inventario-datos',
	'/recursos/protocolo-retiros',
	'/recursos/aviso-privacidad',
	'/recursos/guia-roles-permisos',
	'/calculadora-roi',
	'/seguridad-datos',
	'/terminos'
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
