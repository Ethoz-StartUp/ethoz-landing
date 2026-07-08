import { loadAllPosts } from '$lib/data/posts';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	return { posts: await loadAllPosts() };
};
