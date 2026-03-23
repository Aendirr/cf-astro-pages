import type { APIRoute } from 'astro';
import { buildUrl } from '@/lib/utils';

export const GET: APIRoute = () => {
  const siteUrl = buildUrl();

  const robotsTxt = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# Sitemaps
Sitemap: ${siteUrl}/sitemap.xml

# Disallow search and other dynamic pages
Disallow: /search
Disallow: /api/
`;

  return new Response(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400', // 1 day
    },
  });
};
