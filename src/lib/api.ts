import type { Language, Post, Category, Tag, PaginatedResponse, SingleResponse, BlogSettings } from '@/types';

const API_BASE_URL = import.meta.env.API_BASE_URL || 'https://api.sarlab.pro';
const REQUEST_TIMEOUT = 10000; // 10 seconds

// In-memory cache for settings
let settingsCache: BlogSettings | null = null;
let settingsCacheTime = 0;
const SETTINGS_CACHE_TTL = 300000; // 5 minutes

interface FetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
}

/**
 * Fetch with timeout and retry logic
 */
async function fetchWithTimeout(url: string, options: FetchOptions = {}): Promise<Response> {
  const { timeout = REQUEST_TIMEOUT, retries = 1, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok && retries > 0 && response.status >= 500) {
      // Retry on server errors
      await new Promise(resolve => setTimeout(resolve, 500));
      return fetchWithTimeout(url, { ...options, retries: retries - 1 });
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }

    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return fetchWithTimeout(url, { ...options, retries: retries - 1 });
    }

    throw error;
  }
}

/**
 * API client methods
 */
export const api = {
  /**
   * Get blog settings (cached)
   */
  async getSettings(): Promise<BlogSettings> {
    const now = Date.now();

    if (settingsCache && (now - settingsCacheTime) < SETTINGS_CACHE_TTL) {
      return settingsCache;
    }

    try {
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/api/public/blog/settings`,
        { retries: 1 }
      );

      if (!response.ok) {
        throw new Error(`API responded with ${response.status}`);
      }

      const result: SingleResponse<BlogSettings> = await response.json();
      settingsCache = result.data;
      settingsCacheTime = now;

      return result.data;
    } catch (error) {
      console.error('Error fetching settings:', error);
      return {
        siteName: 'Sarlab Blog',
        siteDescription: 'Premium marketing and technology insights',
        navigation: [
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
        ],
        footerLinks: [],
        socialLinks: [],
      };
    }
  },

  /**
   * Get paginated posts
   */
  async getPosts(params: {
    lang: Language;
    page?: number;
    limit?: number;
    categorySlug?: string;
    tagSlug?: string;
    search?: string;
  }): Promise<PaginatedResponse<Post>> {
    const { lang, page = 1, limit = 12, categorySlug, tagSlug, search } = params;

    const queryParams = new URLSearchParams({
      lang,
      page: page.toString(),
      limit: limit.toString(),
    });

    if (categorySlug) queryParams.set('category', categorySlug);
    if (tagSlug) queryParams.set('tag', tagSlug);
    if (search) queryParams.set('q', search);

    try {
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/api/public/blog/posts?${queryParams}`,
        { retries: 1 }
      );

      if (!response.ok) {
        throw new Error(`API responded with ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching posts:', error);
      // Return empty result on error
      return {
        data: [],
        total: 0,
        page: 1,
        limit: 12,
      };
    }
  },

  /**
   * Get single post by slug
   */
  async getPost(slug: string, lang: Language): Promise<Post | null> {
    try {
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/api/public/blog/posts/${slug}?lang=${lang}`,
        { retries: 1 }
      );

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`API responded with ${response.status}`);
      }

      const result: SingleResponse<Post> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching post:', error);
      return null;
    }
  },

  /**
   * Get all categories for a language
   */
  async getCategories(lang: Language): Promise<Category[]> {
    try {
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/api/public/blog/categories?lang=${lang}`,
        { retries: 1 }
      );

      if (!response.ok) {
        throw new Error(`API responded with ${response.status}`);
      }

      const result: { data: Category[] } = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  /**
   * Get all tags for a language
   */
  async getTags(lang: Language): Promise<Tag[]> {
    try {
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/api/public/blog/tags?lang=${lang}`,
        { retries: 1 }
      );

      if (!response.ok) {
        throw new Error(`API responded with ${response.status}`);
      }

      const result: { data: Tag[] } = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching tags:', error);
      return [];
    }
  },

  /**
   * Get all posts for sitemap (all languages)
   */
  async getAllPostsForSitemap(): Promise<Post[]> {
    try {
      const languages: Language[] = ['tr', 'en', 'de'];
      const allPosts: Post[] = [];

      for (const lang of languages) {
        let page = 1;
        let hasMore = true;

        while (hasMore) {
          const response = await this.getPosts({ lang, page, limit: 100 });
          allPosts.push(...response.data);

          hasMore = response.data.length === 100;
          page++;
        }
      }

      return allPosts;
    } catch (error) {
      console.error('Error fetching posts for sitemap:', error);
      return [];
    }
  },
};
