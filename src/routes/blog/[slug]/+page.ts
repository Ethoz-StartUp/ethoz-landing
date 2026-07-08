import { error } from '@sveltejs/kit';
import { getPost, getPostSlugs } from '$lib/data/posts';
import type { PageLoad } from './$types';

export const prerender = true;

export const load: PageLoad = async ({ params }) => {
	const post = await getPost(params.slug);
	if (!post) throw error(404, 'Post not found');
	return { post };
};

export function entries() {
	return getPostSlugs().map((slug) => ({ slug }));
}
