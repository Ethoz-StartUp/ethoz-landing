import type { Handle } from '@sveltejs/kit';

// Extend SvelteKit's default preload set (js + css) with fonts so the
// prerendered HTML emits <link rel="preload" as="font"> for the three
// above-the-fold woff2 files (DM Sans, Inter, JetBrains Mono declared in
// app.css). Without this the browser only discovers them after downloading
// and parsing the CSS, causing a visible late swap on the hero.
export const handle: Handle = ({ event, resolve }) =>
	resolve(event, {
		preload: ({ type }) => type === 'font' || type === 'css' || type === 'js'
	});
