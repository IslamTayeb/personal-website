import type { MetadataRoute } from 'next';
import { getListedPosts } from '@/lib/blog/posts';
import { postSitemapEntry, staticSitemapEntries } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getListedPosts();

  return [...staticSitemapEntries(), ...posts.map(postSitemapEntry)];
}
