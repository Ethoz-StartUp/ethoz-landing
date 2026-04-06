import { describe, it, expect } from 'vitest';
import { allPosts } from './posts/index';

describe('blog posts data integrity', () => {
  it('has at least one post', () => {
    expect(allPosts.length).toBeGreaterThan(0);
  });

  it('every post has required fields', () => {
    for (const post of allPosts) {
      expect(post.slug, `Missing slug`).toBeTruthy();
      expect(post.title, `Missing title on ${post.slug}`).toBeTruthy();
      expect(post.date, `Missing date on ${post.slug}`).toBeTruthy();
      expect(post.author, `Missing author on ${post.slug}`).toBeTruthy();
      expect(post.content, `Missing content on ${post.slug}`).toBeTruthy();
      expect(post.description, `Missing description on ${post.slug}`).toBeTruthy();
    }
  });

  it('all slugs are unique', () => {
    const slugs = allPosts.map(p => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('all dates are valid ISO format', () => {
    for (const post of allPosts) {
      const parsed = new Date(post.date);
      expect(parsed.getTime(), `Invalid date on ${post.slug}: ${post.date}`).not.toBeNaN();
    }
  });

  it('posts are sorted newest first', () => {
    for (let i = 1; i < allPosts.length; i++) {
      const prev = new Date(allPosts[i - 1].date).getTime();
      const curr = new Date(allPosts[i].date).getTime();
      expect(prev).toBeGreaterThanOrEqual(curr);
    }
  });

  it('no slug contains spaces or uppercase', () => {
    for (const post of allPosts) {
      expect(post.slug).toBe(post.slug.toLowerCase());
      expect(post.slug).not.toContain(' ');
    }
  });

  it('every post has tags array', () => {
    for (const post of allPosts) {
      expect(Array.isArray(post.tags), `Tags not array on ${post.slug}`).toBe(true);
      expect(post.tags.length, `No tags on ${post.slug}`).toBeGreaterThan(0);
    }
  });

  it('every post has readTime', () => {
    for (const post of allPosts) {
      expect(post.readTime, `Missing readTime on ${post.slug}`).toBeTruthy();
    }
  });
});
