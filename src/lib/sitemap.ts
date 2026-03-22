import type { Language, Post } from '@/types';
import { api } from '@/lib/api';

export function getSiteUrl(): string {
  return import.meta.env.PUBLIC_SITE_URL || 'https://sarlab.pro';
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function getIndexablePostsForLanguage(lang: Language): Promise<Post[]> {
  const posts = await api.getAllPostsForSitemap(lang);
  return posts.filter((post) => post.lang === lang && !post.noIndex);
}

export async function buildSitemapXml(lang: Language): Promise<string> {
  const siteUrl = getSiteUrl();
  const [posts, categories, tags] = await Promise.all([
    getIndexablePostsForLanguage(lang),
    api.getCategories(lang),
    api.getTags(lang),
  ]);

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
  xml += '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n';
  xml += '        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n\n';

  const staticEntries = [
    { loc: `${siteUrl}/`, priority: '1.0', changefreq: 'daily' },
  ];

  for (const entry of staticEntries) {
    xml += '  <url>\n';
    xml += `    <loc>${escapeXml(entry.loc)}</loc>\n`;
    xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    xml += `    <priority>${entry.priority}</priority>\n`;
    xml += '  </url>\n';
  }

  for (const category of categories) {
    xml += '  <url>\n';
    xml += `    <loc>${escapeXml(`${siteUrl}/category/${category.slug}`)}</loc>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.6</priority>\n';
    xml += '  </url>\n';
  }

  for (const tag of tags) {
    xml += '  <url>\n';
    xml += `    <loc>${escapeXml(`${siteUrl}/tag/${tag.slug}`)}</loc>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.5</priority>\n';
    xml += '  </url>\n';
  }

  for (const post of posts) {
    const lastmod = new Date(post.updatedAt).toISOString().split('T')[0];
    const loc = `${siteUrl}/${post.slug}`;
    xml += '  <url>\n';
    xml += `    <loc>${escapeXml(loc)}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    xml += '  </url>\n';
  }

  xml += '</urlset>';
  return xml;
}
