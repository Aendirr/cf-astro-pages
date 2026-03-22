import type { APIRoute } from 'astro';
import { getCacheHeaders } from '@/lib/utils';
import { buildLanguageSitemapXml } from '@/lib/sitemap';

export const GET: APIRoute = async () => {
  const xml = await buildLanguageSitemapXml('tr');

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      ...getCacheHeaders('static'),
    },
  });
};
