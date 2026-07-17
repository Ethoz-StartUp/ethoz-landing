import type { Handle } from '@sveltejs/kit';

// Extend SvelteKit's default preload set (js + css) with fonts so the
// prerendered HTML emits <link rel="preload"> for above-the-fold fonts.
// Without this, font discovery can happen only after CSS parse, causing a
// visible late swap on the hero.
export const handle: Handle = ({ event, resolve }) =>
	resolve(event, {
		preload: ({ type }) => type === 'font' || type === 'css' || type === 'js'
	});
