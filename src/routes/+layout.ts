import { ensureLegacyEs } from '$lib/i18n/index.svelte';
import type { LayoutLoad } from './$types';

export const prerender = true;

// Universal layout loads run before SSR, hydration, and client navigation.
// Reading url.pathname also makes SvelteKit rerun this guard when the route
// changes, so legacy copy is never rendered against the home-only subset.
export const load: LayoutLoad = async ({ url }) => {
  if (url.pathname !== '/') await ensureLegacyEs();
  return {};
};
