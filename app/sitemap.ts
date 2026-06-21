import { MetadataRoute } from 'next';
import { getAllPosts, getAllCategories, getAllTags } from '@/lib/mdx';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.aesthete.com';

  const posts = getAllPosts().filter((p): p is NonNullable<typeof p> => p !== null && p.published);
  const categories = getAllCategories();
  const tags = getAllTags();

  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt && !isNaN(new Date(post.updatedAt).getTime()) ? new Date(post.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const categoryUrls = categories.map((cat: any) => ({
    url: `${baseUrl}/categories/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  const tagUrls = tags.map((tag: any) => ({
    url: `${baseUrl}/tags/${tag.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/explore',
    '/categories',
    '/tags',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.6,
  }));

  return [...staticRoutes, ...categoryUrls, ...tagUrls, ...postUrls];
}
