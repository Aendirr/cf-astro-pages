import type { APIRoute } from 'astro';
import { api } from '@/lib/api';
import { getCacheHeaders, getSiteLanguage } from '@/lib/utils';
import { buildSitemapXml } from '@/lib/sitemap';

export const GET: APIRoute = async () => {
  const settings = await api.getSettings();
  const xml = await buildSitemapXml(getSiteLanguage(settings));

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      ...getCacheHeaders('static'),
    },
  });
};
