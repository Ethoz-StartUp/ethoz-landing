import type { BlogPost } from './types';

export type { BlogPost } from './types';

// Lazy loaders: each post stays in its own chunk, fetched on demand. Blog
// article pages load exactly one post instead of the full 22-post bundle.
const loaders = import.meta.glob(['./*.ts', '!./index.ts', '!./types.ts'], {
	import: 'post'
}) as Record<string, () => Promise<BlogPost>>;

// Post filenames are their slugs (prerender entries() relies on this).
export function getPostSlugs(): string[] {
	return Object.keys(loaders).map((path) => path.slice(2, -3));
}

export async function getPost(slug: string): Promise<BlogPost | undefined> {
	const loader = loaders[`./${slug}.ts`];
	return loader ? await loader() : undefined;
}

let allPostsPromise: Promise<BlogPost[]> | undefined;

/** All posts sorted newest first. Cached after the first call. */
export function loadAllPosts(): Promise<BlogPost[]> {
	allPostsPromise ??= Promise.all(Object.values(loaders).map((load) => load())).then((posts) =>
		posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
	);
	return allPostsPromise;
}

// Eager list kept ONLY for unit tests (src/lib/data/posts.test.ts). Routes must
// use the lazy API above so this static import graph gets tree-shaken out of
// the client bundle (post modules are pure const exports, so dropping the
// unused `allPosts` export drops their eager imports too).
const eagerPosts = import.meta.glob(['./*.ts', '!./index.ts', '!./types.ts'], {
	eager: true,
	import: 'post'
}) as Record<string, BlogPost>;

export const allPosts: BlogPost[] = /* @__PURE__ */ (() =>
	Object.values(eagerPosts).sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
	))();
