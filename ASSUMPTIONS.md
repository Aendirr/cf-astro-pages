# Implementation Assumptions

This document lists all assumptions made during the implementation of the Sarlab Blog platform.

## API Assumptions

1. **Base URL**: The API is available at `https://api.sarlab.pro`

2. **Endpoints**: The following endpoints exist and return data in the specified format:
   - `GET /api/public/blog/posts?lang={lang}&page={page}&limit={limit}`
   - `GET /api/public/blog/posts/:slug?lang={lang}`
   - `GET /api/public/blog/categories?lang={lang}`
   - `GET /api/public/blog/tags?lang={lang}`

3. **Response Format**:
   - Paginated responses use: `{ data: T[], total, page, limit }`
   - Single item responses use: `{ data: T }`

4. **Post Content**: Posts can contain either:
   - `bodyMarkdown` (preferred - automatically rendered and sanitized)
   - `bodyHtml` (sanitized with DOMPurify before display)

5. **Search**: The API supports a `search` or `q` query parameter for post filtering. If not supported, client-side filtering is used.

6. **Category/Tag Filtering**: The API supports `category` and `tag` query parameters for filtering posts.

## Content Assumptions

1. **Languages**: Three languages are supported: Turkish (tr), English (en), German (de)
   - Default language is Turkish (tr)
   - All posts, categories, and tags have a `lang` field

2. **Featured Posts**: Posts can be marked as `featured` for homepage display

3. **Images**: All `coverImageUrl` values are valid, publicly accessible URLs

4. **Author**: Each post has a single `authorName` (string), not a complex author object

5. **Timestamps**: All dates (`publishedAt`, `updatedAt`) are ISO-8601 formatted strings

## SEO Assumptions

1. **Canonical URLs**: If not provided by the post, the canonical URL is auto-generated

2. **noIndex**: Posts with `noIndex: true` are excluded from sitemap and have appropriate meta tags

3. **Social Images**: Default Open Graph image is at `/og-default.jpg` if post has no cover image

4. **Logo**: Site logo for JSON-LD schema is at `/logo.png`

## Deployment Assumptions

1. **Platform**: Cloudflare Pages is the primary deployment target

2. **Environment Variables**:
   - `API_BASE_URL` - Backend API URL
   - `PUBLIC_SITE_URL` - Frontend site URL
   - `PUBLIC_SITE_NAME` - Site name for branding
   - `PUBLIC_SITE_DESCRIPTION` - Site description for SEO

3. **Build**: Standard Astro build process with Cloudflare adapter works without modification

4. **Edge Runtime**: All code is compatible with Cloudflare Workers runtime (no Node.js-specific APIs)

## Design Assumptions

1. **Typography**: Inter font is loaded from Google Fonts

2. **Icons**: SVG icons are used inline (no icon library dependency)

3. **Images**: No image optimization service is configured (relies on source images being optimized)

4. **Dark Mode**: Currently not implemented but can be added easily

5. **Newsletter**: Newsletter form is UI-only; backend integration required separately

## Security Assumptions

1. **HTML Content**: All HTML from the API is potentially unsafe and must be sanitized

2. **Markdown Content**: Markdown is safe to render after conversion to HTML

3. **CSP**: No Content Security Policy headers are set (should be configured in Cloudflare)

4. **CORS**: API endpoints support CORS for the blog domain

## Performance Assumptions

1. **API Latency**: API responses are fast enough for SSR (< 1 second)

2. **Cache**: Cloudflare automatically caches responses based on Cache-Control headers

3. **CDN**: Static assets are served via Cloudflare CDN

4. **Rate Limiting**: No rate limiting is implemented (relies on Cloudflare protection)

## Browser Assumptions

1. **Modern Browsers**: Target browsers support ES2020+ features

2. **JavaScript**: Progressive enhancement - core functionality works without JS

3. **CSS**: Tailwind CSS classes are supported by all target browsers

## Data Assumptions

1. **Pagination**: Default page size is 12 posts per page

2. **Related Posts**: Maximum 3 related posts are shown

3. **Reading Time**: Calculated at ~200 words per minute

4. **TOC**: Only H2 and H3 headings are included in table of contents

5. **Post Limits**: Sitemap/RSS fetch up to 100 pages of posts to generate complete lists

## Legal Pages

1. **Legal Routes**: Privacy, Terms, and Data Deletion pages are referenced but not implemented
   - You need to create: `/{lang}/privacy`, `/{lang}/terms`, `/{lang}/data-deletion`

## Social Features

1. **Share Buttons**: Share to Twitter, Facebook, LinkedIn, and copy link

2. **Social Links**: Footer social links are placeholders - update with real URLs

## Mobile Assumptions

1. **Responsive**: All layouts work on mobile (320px+), tablet (768px+), and desktop (1024px+)

2. **Touch**: Mobile menu and interactive elements work with touch events

3. **Performance**: Lazy loading and optimizations ensure good mobile performance

## Monitoring Assumptions

1. **Error Tracking**: No error tracking is configured (add Sentry or similar if needed)

2. **Analytics**: No analytics are configured (add Google Analytics, Plausible, etc. if needed)

3. **Logging**: Console errors are logged but not persisted
