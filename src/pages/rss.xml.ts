import type { APIRoute } from 'astro';
import type { Language } from '@/types';
import { api } from '@/lib/api';
import { getCacheHeaders } from '@/lib/utils';
import { stripHtml, truncateText } from '@/lib/sanitizer';

export const GET: APIRoute = async () => {
  const siteUrl = import.meta.env.PUBLIC_SITE_URL || 'https://sarlab.pro';

  try {
    // Fetch settings and latest posts in parallel
    const [settings, response] = await Promise.all([
      api.getSettings(),
      api.getPosts({ lang: 'tr' as Language, page: 1, limit: 20 }),
    ]);

    const posts = response.data.filter(post => !post.noIndex);

    // Build RSS feed
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">\n';
    xml += '  <channel>\n';
    xml += `    <title>${escapeXml(settings.siteName)}</title>\n`;
    xml += `    <link>${siteUrl}/tr</link>\n`;
    xml += `    <description>${escapeXml(settings.siteDescription)}</description>\n`;
    xml += `    <language>tr</language>\n`;
    xml += `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n`;
    xml += `    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />\n`;

    posts.forEach(post => {
      const postUrl = `${siteUrl}/${post.lang}/blog/${post.slug}`;
      const pubDate = new Date(post.publishedAt).toUTCString();
      const description = stripHtml(post.excerpt);
      const content = post.bodyMarkdown || post.excerpt;

      xml += '    <item>\n';
      xml += `      <title>${escapeXml(post.title)}</title>\n`;
      xml += `      <link>${postUrl}</link>\n`;
      xml += `      <guid isPermaLink="true">${postUrl}</guid>\n`;
      xml += `      <pubDate>${pubDate}</pubDate>\n`;
      xml += `      <description>${escapeXml(description)}</description>\n`;
      xml += `      <content:encoded><![CDATA[${content}]]></content:encoded>\n`;
      xml += `      <author>${escapeXml(post.authorName)}</author>\n`;

      post.categories.forEach(cat => {
        xml += `      <category>${escapeXml(cat.name)}</category>\n`;
      });

      if (post.coverImageUrl) {
        xml += `      <enclosure url="${post.coverImageUrl}" type="image/jpeg" />\n`;
      }

      xml += '    </item>\n';
    });

    xml += '  </channel>\n';
    xml += '</rss>';

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        ...getCacheHeaders('static'),
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);

    // Fallback settings
    const fallbackSettings = await api.getSettings();

    // Return minimal feed on error
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<rss version="2.0">\n';
    xml += '  <channel>\n';
    xml += `    <title>${escapeXml(fallbackSettings.siteName)}</title>\n`;
    xml += `    <link>${siteUrl}</link>\n`;
    xml += `    <description>${escapeXml(fallbackSettings.siteDescription)}</description>\n`;
    xml += '  </channel>\n';
    xml += '</rss>';

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=60',
      },
    });
  }
};

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
