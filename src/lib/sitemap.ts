import type { Language, Post } from '@/types';
import { api } from '@/lib/api';

export const SITEMAP_LANGUAGES: Language[] = ['tr', 'en', 'de'];

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
  const posts = await api.getAllPostsForSitemap();
  return posts.filter((post) => post.lang === lang && !post.noIndex);
}

export async function buildLanguageSitemapXml(lang: Language): Promise<string> {
  const siteUrl = getSiteUrl();
  const posts = await getIndexablePostsForLanguage(lang);

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  const staticEntries = [
    { loc: `${siteUrl}/${lang}`, priority: '1.0', changefreq: 'daily' },
    { loc: `${siteUrl}/${lang}/blog`, priority: '0.9', changefreq: 'daily' },
  ];

  for (const entry of staticEntries) {
    xml += '  <url>\n';
    xml += `    <loc>${escapeXml(entry.loc)}</loc>\n`;
    for (const altLang of SITEMAP_LANGUAGES) {
      const href = entry.loc.replace(`/${lang}`, `/${altLang}`);
      xml += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${escapeXml(href)}" />\n`;
    }
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(siteUrl)}" />\n`;
    xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    xml += `    <priority>${entry.priority}</priority>\n`;
    xml += '  </url>\n';
  }

  for (const post of posts) {
    const lastmod = new Date(post.updatedAt).toISOString().split('T')[0];
    const loc = `${siteUrl}/${post.lang}/blog/${post.slug}`;
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

export function buildSitemapIndexXml(): string {
  const siteUrl = getSiteUrl();

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const lang of SITEMAP_LANGUAGES) {
    xml += '  <sitemap>\n';
    xml += `    <loc>${siteUrl}/sitemap-${lang}.xml</loc>\n`;
    xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
    xml += '  </sitemap>\n';
  }

  xml += '</sitemapindex>';
  return xml;
}
