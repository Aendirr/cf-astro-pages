import type { APIRoute } from 'astro';
import type { Language } from '@/types';
import { api } from '@/lib/api';
import { getCacheHeaders } from '@/lib/utils';

export const GET: APIRoute = async () => {
  const siteUrl = import.meta.env.PUBLIC_SITE_URL || 'https://sarlab.pro';
  const languages: Language[] = ['tr', 'en', 'de'];

  try {
    // Fetch all posts from API
    const posts = await api.getAllPostsForSitemap();

    // Filter out noIndex posts
    const indexablePosts = posts.filter(post => !post.noIndex);

    // Build sitemap XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add homepage for each language
    languages.forEach(lang => {
      xml += '  <url>\n';
      xml += `    <loc>${siteUrl}/${lang}</loc>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>1.0</priority>\n`;
      xml += '  </url>\n';

      // Add blog index for each language
      xml += '  <url>\n';
      xml += `    <loc>${siteUrl}/${lang}/blog</loc>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>0.9</priority>\n`;
      xml += '  </url>\n';
    });

    // Add all post pages
    indexablePosts.forEach(post => {
      const lastmod = new Date(post.updatedAt).toISOString().split('T')[0];

      xml += '  <url>\n';
      xml += `    <loc>${siteUrl}/${post.lang}/blog/${post.slug}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += '  </url>\n';
    });

    xml += '</urlset>';

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        ...getCacheHeaders('static'),
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);

    // Return minimal sitemap on error
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    languages.forEach(lang => {
      xml += '  <url>\n';
      xml += `    <loc>${siteUrl}/${lang}</loc>\n`;
      xml += '  </url>\n';
    });
    xml += '</urlset>';

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=60',
      },
    });
  }
};
