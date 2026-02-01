import type { Language, Post, TableOfContentsItem } from '@/types';
import { marked } from 'marked';
import { sanitizeHtml } from './sanitizer';

/**
 * Translation strings
 */
export const translations = {
  tr: {
    home: 'Ana Sayfa',
    blog: 'Blog',
    categories: 'Kategoriler',
    tags: 'Etiketler',
    search: 'Ara',
    searchPlaceholder: 'Blog yazılarında ara...',
    readMore: 'Devamını Oku',
    readingTime: 'dk okuma',
    publishedOn: 'Yayınlanma',
    updatedOn: 'Güncellenme',
    by: 'Yazar',
    relatedPosts: 'İlgili Yazılar',
    allPosts: 'Tüm Yazılar',
    noPosts: 'Henüz yazı bulunmuyor.',
    page: 'Sayfa',
    previous: 'Önceki',
    next: 'Sonraki',
    subscribe: 'Abone Ol',
    subscribeCta: 'En son içeriklerden haberdar olun',
    emailPlaceholder: 'E-posta adresiniz',
    tableOfContents: 'İçindekiler',
    share: 'Paylaş',
    featuredPosts: 'Öne Çıkan Yazılar',
    latestPosts: 'Son Yazılar',
    privacy: 'Gizlilik Politikası',
    terms: 'Kullanım Koşulları',
    dataDeletion: 'Veri Silme',
  },
  en: {
    home: 'Home',
    blog: 'Blog',
    categories: 'Categories',
    tags: 'Tags',
    search: 'Search',
    searchPlaceholder: 'Search blog posts...',
    readMore: 'Read More',
    readingTime: 'min read',
    publishedOn: 'Published',
    updatedOn: 'Updated',
    by: 'By',
    relatedPosts: 'Related Posts',
    allPosts: 'All Posts',
    noPosts: 'No posts found.',
    page: 'Page',
    previous: 'Previous',
    next: 'Next',
    subscribe: 'Subscribe',
    subscribeCta: 'Stay updated with our latest content',
    emailPlaceholder: 'Your email address',
    tableOfContents: 'Table of Contents',
    share: 'Share',
    featuredPosts: 'Featured Posts',
    latestPosts: 'Latest Posts',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    dataDeletion: 'Data Deletion',
  },
  de: {
    home: 'Startseite',
    blog: 'Blog',
    categories: 'Kategorien',
    tags: 'Tags',
    search: 'Suchen',
    searchPlaceholder: 'Blog-Beiträge durchsuchen...',
    readMore: 'Weiterlesen',
    readingTime: 'Min. Lesezeit',
    publishedOn: 'Veröffentlicht',
    updatedOn: 'Aktualisiert',
    by: 'Von',
    relatedPosts: 'Ähnliche Beiträge',
    allPosts: 'Alle Beiträge',
    noPosts: 'Keine Beiträge gefunden.',
    page: 'Seite',
    previous: 'Zurück',
    next: 'Weiter',
    subscribe: 'Abonnieren',
    subscribeCta: 'Bleiben Sie auf dem Laufenden',
    emailPlaceholder: 'Ihre E-Mail-Adresse',
    tableOfContents: 'Inhaltsverzeichnis',
    share: 'Teilen',
    featuredPosts: 'Hervorgehobene Beiträge',
    latestPosts: 'Neueste Beiträge',
    privacy: 'Datenschutz',
    terms: 'Nutzungsbedingungen',
    dataDeletion: 'Datenlöschung',
  },
};

export function t(lang: Language, key: keyof typeof translations.en): string {
  return translations[lang][key] || translations.en[key];
}

/**
 * Calculate reading time in minutes
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, '');
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Format date for display
 */
export function formatDate(date: string, lang: Language): string {
  const locales = {
    tr: 'tr-TR',
    en: 'en-US',
    de: 'de-DE',
  };

  return new Date(date).toLocaleDateString(locales[lang], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date for ISO string (schema.org)
 */
export function formatDateISO(date: string): string {
  return new Date(date).toISOString();
}

/**
 * Generate slug from text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Get language display name
 */
export function getLanguageName(lang: Language): string {
  const names = {
    tr: 'Türkçe',
    en: 'English',
    de: 'Deutsch',
  };
  return names[lang];
}

/**
 * Render markdown to HTML safely
 */
export async function renderMarkdown(markdown: string): Promise<string> {
  const html = await marked(markdown, {
    gfm: true,
    breaks: true,
  });
  return sanitizeHtml(html);
}

/**
 * Extract table of contents from HTML
 */
export function extractTableOfContents(html: string): TableOfContentsItem[] {
  const headingRegex = /<h([2-3])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h\1>/gi;
  const toc: TableOfContentsItem[] = [];
  let match;

  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1]);
    const id = match[2];
    const text = match[3].replace(/<[^>]*>/g, '');

    toc.push({ id, text, level });
  }

  return toc;
}

/**
 * Add IDs to headings in HTML for TOC linking
 */
export function addHeadingIds(html: string): string {
  return html.replace(/<h([2-3])>(.*?)<\/h\1>/gi, (match, level, content) => {
    const text = content.replace(/<[^>]*>/g, '');
    const id = slugify(text);
    return `<h${level} id="${id}">${content}</h${level}>`;
  });
}

/**
 * Get cache headers based on page type
 */
export function getCacheHeaders(type: 'list' | 'post' | 'static', noIndex = false): Record<string, string> {
  if (noIndex) {
    return {
      'Cache-Control': 'private, no-cache',
    };
  }

  const headers = {
    list: 'public, s-maxage=60, stale-while-revalidate=600',
    post: 'public, s-maxage=300, stale-while-revalidate=3600',
    static: 'public, s-maxage=300, stale-while-revalidate=3600',
  };

  return {
    'Cache-Control': headers[type],
  };
}

/**
 * Build URL for language
 */
export function buildUrl(lang: Language, path: string = ''): string {
  const baseUrl = import.meta.env.PUBLIC_SITE_URL || 'https://sarlab.pro';
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${baseUrl}/${lang}${cleanPath ? '/' + cleanPath : ''}`;
}

/**
 * Get related posts (simple implementation based on shared tags/categories)
 */
export function getRelatedPosts(currentPost: Post, allPosts: Post[], limit = 3): Post[] {
  const currentTags = currentPost.tags.map(t => t.id);
  const currentCategories = currentPost.categories.map(c => c.id);

  const scored = allPosts
    .filter(post => post.id !== currentPost.id && post.lang === currentPost.lang)
    .map(post => {
      let score = 0;
      post.tags.forEach(tag => {
        if (currentTags.includes(tag.id)) score += 2;
      });
      post.categories.forEach(cat => {
        if (currentCategories.includes(cat.id)) score += 3;
      });
      return { post, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map(item => item.post);
}

/**
 * Validate language parameter
 */
export function isValidLanguage(lang: string): lang is Language {
  return ['tr', 'en', 'de'].includes(lang);
}
