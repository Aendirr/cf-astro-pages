# New Architecture: Settings-Driven Blog

This document explains the new API-driven architecture where all branding, navigation, footer, and social links come from the backend API.

## Key Changes

### 1. Settings API Endpoint

**New Endpoint**: `GET /api/public/blog/settings`

**Response Format**:
```json
{
  "data": {
    "siteName": "Sarlab",
    "siteDescription": "Premium marketing insights",
    "logoUrl": "https://cdn.sarlab.pro/logo.png",
    "faviconUrl": "https://cdn.sarlab.pro/favicon.ico",
    "ogImageUrl": "https://cdn.sarlab.pro/og-default.jpg",
    "navigation": [
      { "label": "Home", "href": "/" },
      { "label": "Blog", "href": "/blog" },
      { "label": "About", "href": "/about" },
      { "label": "Contact", "href": "/contact", "external": false }
    ],
    "footerLinks": [
      {
        "title": "Company",
        "links": [
          { "label": "About", "href": "/about" },
          { "label": "Careers", "href": "/careers" }
        ]
      },
      {
        "title": "Legal",
        "links": [
          { "label": "Privacy", "href": "/privacy" },
          { "label": "Terms", "href": "/terms" }
        ]
      }
    ],
    "footerText": "Making marketing measurable.",
    "socialLinks": [
      { "platform": "twitter", "url": "https://twitter.com/sarlab" },
      { "platform": "linkedin", "url": "https://linkedin.com/company/sarlab" }
    ],
    "seoTitle": "Sarlab - Marketing Intelligence",
    "seoDescription": "Data-driven marketing insights",
    "twitterHandle": "@sarlab",
    "enableNewsletter": true,
    "newsletterTitle": "Stay Updated",
    "newsletterDescription": "Get weekly insights"
  }
}
```

### 2. Post Blocks for CTA, Related Links, Redirect Links

**Updated Post Type**:
```json
{
  "id": "123",
  "slug": "example-post",
  "title": "Example Post",
  "excerpt": "Short description",
  "bodyMarkdown": "# Full markdown content...",
  "coverImageUrl": "https://...",
  "authorName": "John Doe",
  "authorAvatar": "https://...",
  "publishedAt": "2025-01-15T10:00:00Z",
  "updatedAt": "2025-01-20T15:30:00Z",
  "lang": "tr",
  "tags": [...],
  "categories": [...],
  "seoTitle": "Custom SEO Title",
  "seoDescription": "Custom SEO description",
  "ogImageUrl": "https://custom-og-image.jpg",
  "blocks": {
    "cta": {
      "title": "Ready to get started?",
      "description": "Sign up for our platform today",
      "buttonText": "Start Free Trial",
      "buttonUrl": "https://app.sarlab.pro/signup",
      "style": "primary"
    },
    "relatedLinks": [
      {
        "title": "Related Article 1",
        "description": "Learn more about...",
        "url": "https://sarlab.pro/blog/related-1",
        "imageUrl": "https://..."
      }
    ],
    "redirectLinks": [
      {
        "slug": "product-demo",
        "title": "Watch Product Demo",
        "description": "5-minute video",
        "icon": "🎥"
      }
    ]
  }
}
```

### 3. Updated Components

#### Header Component
Now accepts `settings` prop from API:
- Displays `settings.logoUrl` if available, otherwise `settings.siteName`
- Renders navigation from `settings.navigation[]`
- Supports external links with `target="_blank"`

#### Footer Component
Now accepts `settings` prop from API:
- Displays `settings.siteName`, `settings.siteDescription`, `settings.footerText`
- Renders social links from `settings.socialLinks[]`
- Renders footer sections from `settings.footerLinks[]`
- Auto-adds language prefix to internal links

#### SEO Component
- Now accepts `twitterHandle` from settings
- Uses post-level SEO overrides: `post.seoTitle`, `post.seoDescription`, `post.ogImageUrl`

### 4. New Block Components

**CTABlock.astro** (`src/components/blocks/CTABlock.astro`)
- Renders call-to-action from `post.blocks.cta`
- Supports 3 styles: primary, secondary, outline
- Premium gradient design

**RelatedLinks.astro** (`src/components/blocks/RelatedLinks.astro`)
- Renders related resources from `post.blocks.relatedLinks[]`
- Optional images
- External link support

**RedirectLinks.astro** (`src/components/blocks/RedirectLinks.astro`)
- Renders quick links that go through `/r/:slug` for tracking
- Uses `post.blocks.redirectLinks[]`
- Supports icons and descriptions

### 5. Updated BaseLayout

**Before**:
```astro
---
const siteName = import.meta.env.PUBLIC_SITE_NAME;
---
<Header lang={lang} />
<slot />
<Footer lang={lang} />
```

**After**:
```astro
---
import { api } from '@/lib/api';
const settings = await api.getSettings(); // Cached for 5 minutes
---
<head>
  {settings.faviconUrl && <link rel="icon" href={settings.faviconUrl} />}
  <SEO {...seo} twitterHandle={settings.twitterHandle} />
</head>
<Header lang={lang} settings={settings} />
<slot />
<Footer lang={lang} settings={settings} />
```

### 6. Updated Pages

All pages now fetch settings once and pass to layout:

```astro
---
import { api } from '@/lib/api';

const settings = await api.getSettings();
const posts = await api.getPosts({ lang, page: 1, limit: 12 });
---

<BaseLayout
  lang={lang}
  seo={{
    title: settings.seoTitle || settings.siteName,
    description: settings.seoDescription || settings.siteDescription,
    image: settings.ogImageUrl,
    ...
  }}
  settings={settings}
>
  <!-- Page content -->
</BaseLayout>
```

### 7. Post Rendering with Blocks

**PostLayout.astro** now renders blocks:

```astro
---
import CTABlock from '@/components/blocks/CTABlock.astro';
import RelatedLinks from '@/components/blocks/RelatedLinks.astro';
import RedirectLinks from '@/components/blocks/RedirectLinks.astro';
import { renderMarkdown } from '@/lib/utils';

const { post } = Astro.props;
const bodyHtml = await renderMarkdown(post.bodyMarkdown);
---

<article>
  <!-- Post header, cover, etc. -->

  <!-- Markdown content -->
  <div class="prose" set:html={bodyHtml} />

  <!-- Blocks -->
  {post.blocks?.cta && <CTABlock block={post.blocks.cta} />}
  {post.blocks?.relatedLinks && <RelatedLinks links={post.blocks.relatedLinks} />}
  {post.blocks?.redirectLinks && <RedirectLinks links={post.blocks.redirectLinks} />}

  <!-- Rest of post -->
</article>
```

## Migration Steps

### 1. Update API Client
✅ **Done** - Added `getSettings()` method with 5-minute caching

### 2. Update Types
✅ **Done** - Added:
- `BlogSettings` interface
- `NavigationItem`, `FooterSection`, `SocialLink`
- `PostBlocks`, `CTABlock`, `RelatedLink`, `RedirectLink`
- Updated `Post` interface

### 3. Update Components
✅ **Done**:
- Header.astro - accepts `settings` prop
- Footer.astro - accepts `settings` prop, renders from API
- SEO.astro - accepts `twitterHandle`

✅ **Done** - Created block components:
- CTABlock.astro
- RelatedLinks.astro
- RedirectLinks.astro

### 4. Update Layouts
🔄 **In Progress** - Need to update:
- `src/layouts/BaseLayout.astro` - fetch settings, pass to components
- `src/layouts/PostLayout.astro` - render post blocks

### 5. Update All Pages
🔄 **In Progress** - Need to update all pages in `src/pages/`:
- Pass `settings` to `BaseLayout`
- Use `settings.siteName`, etc. instead of env vars

### 6. Update SEO/Sitemap/RSS
🔄 **Pending** - Update to use settings:
- sitemap.xml.ts - use settings for site name
- rss.xml.ts - use settings for feed metadata
- robots.txt.ts - works as-is

## Benefits of New Architecture

1. **No Rebuilds**: Change logo, navigation, footer links without redeploying
2. **Centralized Control**: All branding managed in backend
3. **Flexible Content**: Add CTA blocks, related links dynamically
4. **Better Tracking**: Redirect links via `/r/:slug` for analytics
5. **SEO Flexibility**: Per-post SEO overrides
6. **Multi-tenant Ready**: Easy to support multiple blogs from one codebase

## Example: Adding a CTA to a Post

In your backend, update a post:

```json
{
  "slug": "marketing-automation-guide",
  "blocks": {
    "cta": {
      "title": "Ready to automate your marketing?",
      "description": "Join 1000+ companies using our platform",
      "buttonText": "Start Free Trial",
      "buttonUrl": "https://app.sarlab.pro/signup",
      "style": "primary"
    }
  }
}
```

The CTA will automatically render in the post - no code changes needed!

## Next Steps

1. ✅ Update all components to use settings
2. ⏳ Update BaseLayout to fetch and pass settings
3. ⏳ Update all pages to work with new architecture
4. ⏳ Test with real API endpoints
5. ⏳ Update documentation

## API Backend Requirements

Your backend must implement:

1. **Settings Endpoint**:
   - `GET /api/public/blog/settings`
   - Returns `BlogSettings` object
   - Cacheable (set Cache-Control headers)

2. **Updated Posts Endpoint**:
   - Include `blocks` object in post responses
   - Support `seoTitle`, `seoDescription`, `ogImageUrl` overrides
   - Include `authorAvatar` if available

3. **Redirect Endpoint** (optional but recommended):
   - `GET /r/:slug` - redirects to target URL
   - Track clicks for analytics
   - Return 301/302 redirect

## Environment Variables

Update `.env`:
```env
API_BASE_URL=https://api.sarlab.pro

# These are now optional - settings come from API
# But keep as fallbacks if API fails
PUBLIC_SITE_URL=https://sarlab.pro
PUBLIC_SITE_NAME=Sarlab
PUBLIC_SITE_DESCRIPTION=Premium marketing insights
```

## Testing

Test the new architecture:

1. **Settings API**:
```bash
curl https://api.sarlab.pro/api/public/blog/settings
```

2. **Post with Blocks**:
```bash
curl "https://api.sarlab.pro/api/public/blog/posts/example?lang=tr"
```

3. **Local Dev**:
```bash
npm run dev
# Visit http://localhost:4321/tr
# Check that logo, nav, footer render from API
```

4. **Build & Deploy**:
```bash
npm run build
wrangler pages deploy dist
```

## Troubleshooting

**Settings not loading**:
- Check API endpoint is accessible
- Verify response format matches `BlogSettings` interface
- Check browser console for errors
- Settings cache TTL is 5 minutes - clear cache if testing

**Blocks not rendering**:
- Verify `post.blocks` is present in API response
- Check component imports in PostLayout
- Verify block data matches TypeScript interfaces

**Links broken**:
- Internal links get `/${lang}` prefix automatically
- External links should have full URL
- Redirect links use `/r/:slug` format
