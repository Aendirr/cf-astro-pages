# Settings-Driven Blog Architecture - Implementation Complete

## Overview

The blog has been updated to a **settings-driven architecture** where all branding, navigation, footer, social links, and post content blocks come from the backend API at runtime.

## ✅ What's Been Implemented

### 1. Core Infrastructure

- **TypeScript Types** (`src/types/index.ts`)
  - `BlogSettings` interface for site configuration
  - `PostBlocks`, `CTABlock`, `RelatedLink`, `RedirectLink` for post content blocks
  - Updated `Post` interface with blocks and SEO overrides
  - Social link platform types

- **API Client** (`src/lib/api.ts`)
  - `getSettings()` method with 5-minute caching
  - Fetch from `GET /api/public/blog/settings`
  - Automatic fallback to defaults on API failure

### 2. Components

✅ **Header** (`src/components/Header.astro`)
- Accepts `settings` prop
- Renders logo from `settings.logoUrl` or site name
- Dynamic navigation from `settings.navigation[]`
- Supports external links with target="_blank"

✅ **Footer** (`src/components/Footer.astro`)
- Accepts `settings` prop
- Renders social links from `settings.socialLinks[]`
- Dynamic footer sections from `settings.footerLinks[]`
- Displays site name, description, footer text
- Auto-prefixes language to internal links

✅ **SEO** (`src/components/SEO.astro`)
- Accepts `twitterHandle` from settings
- Supports post-level SEO overrides

✅ **BaseLayout** (`src/layouts/BaseLayout.astro`)
- Requires `settings` prop
- Passes settings to Header and Footer
- Uses `settings.faviconUrl` if available
- Passes `twitterHandle` to SEO component

### 3. Post Blocks Components

✅ **CTABlock** (`src/components/blocks/CTABlock.astro`)
- Renders call-to-action from `post.blocks.cta`
- 3 style variants: primary, secondary, outline
- Premium gradient design with button

✅ **RelatedLinks** (`src/components/blocks/RelatedLinks.astro`)
- Renders related resources from `post.blocks.relatedLinks[]`
- Supports optional images
- External link handling
- Hover animations

✅ **RedirectLinks** (`src/components/blocks/RedirectLinks.astro`)
- Renders quick links via `/r/:slug` for tracking
- Uses `post.blocks.redirectLinks[]`
- Supports icons and descriptions
- Opens in new tab

### 4. Example Files

✅ **Updated Homepage** (`src/pages/[lang]/index.NEW.astro`)
- Shows how to fetch settings
- Pass settings to BaseLayout
- Use settings for SEO and content

✅ **Updated PostLayout** (`src/layouts/PostLayout.NEW.astro`)
- Shows how to render post blocks
- Post-level SEO overrides
- Author avatar support
- JSON-LD with settings data

## 📋 What You Need to Do

### 1. Update All Existing Pages

All pages in `src/pages/` need to be updated to fetch settings and pass to BaseLayout.

**Pattern to follow**:
```astro
---
import { api } from '@/lib/api';

const settings = await api.getSettings();
// ... fetch other data
---

<BaseLayout
  lang={lang}
  settings={settings}  <!-- ADD THIS -->
  seo={{...}}
>
  <!-- content -->
</BaseLayout>
```

**Files to update**:
- ✅ `src/pages/[lang]/index.astro` - EXAMPLE PROVIDED (.NEW.astro)
- ⏳ `src/pages/[lang]/blog/index.astro`
- ⏳ `src/pages/[lang]/blog/page/[page].astro`
- ⏳ `src/pages/[lang]/blog/[slug].astro`
- ⏳ `src/pages/[lang]/category/[slug].astro`
- ⏳ `src/pages/[lang]/tag/[slug].astro`
- ⏳ `src/pages/[lang]/search.astro`

### 2. Update PostLayout

Replace `src/layouts/PostLayout.astro` with the new version:

```bash
cp src/layouts/PostLayout.NEW.astro src/layouts/PostLayout.astro
```

Or manually add:
1. Accept `settings` prop
2. Pass `settings` to `BaseLayout`
3. Import and render block components
4. Use post SEO overrides
5. Update JSON-LD with settings data

### 3. Update Other Components (Optional)

**Newsletter** (`src/components/Newsletter.astro`):
- Accept `title` and `description` props
- Use `settings.newsletterTitle`, `settings.newsletterDescription`

**Hero** (`src/components/Hero.astro`):
- Accept `title` and `subtitle` props for customization

### 4. Implement Backend API Endpoints

Your backend must provide:

#### Settings Endpoint
```
GET /api/public/blog/settings

Response:
{
  "data": {
    "siteName": "Sarlab",
    "siteDescription": "Premium marketing insights",
    "logoUrl": "https://cdn.sarlab.pro/logo.png",
    "faviconUrl": "https://cdn.sarlab.pro/favicon.ico",
    "ogImageUrl": "https://cdn.sarlab.pro/og-image.jpg",
    "navigation": [
      { "label": "Home", "href": "/" },
      { "label": "Blog", "href": "/blog" },
      { "label": "Contact", "href": "https://sarlab.pro/contact", "external": true }
    ],
    "footerLinks": [
      {
        "title": "Company",
        "links": [
          { "label": "About", "href": "/about" },
          { "label": "Careers", "href": "/careers" }
        ]
      }
    ],
    "footerText": "Making marketing measurable.",
    "socialLinks": [
      { "platform": "twitter", "url": "https://twitter.com/sarlab" },
      { "platform": "linkedin", "url": "https://linkedin.com/company/sarlab" }
    ],
    "twitterHandle": "@sarlab",
    "enableNewsletter": true,
    "newsletterTitle": "Stay Updated",
    "newsletterDescription": "Weekly insights"
  }
}
```

#### Updated Posts Endpoint
Add `blocks` to posts:
```
GET /api/public/blog/posts/:slug?lang=tr

{
  "data": {
    ...existing fields...,
    "bodyMarkdown": "# Content here...",
    "authorAvatar": "https://...",
    "seoTitle": "Custom SEO Title",
    "seoDescription": "Custom description",
    "ogImageUrl": "https://custom-og.jpg",
    "blocks": {
      "cta": {
        "title": "Ready to start?",
        "description": "Sign up today",
        "buttonText": "Start Free",
        "buttonUrl": "https://app.sarlab.pro/signup",
        "style": "primary"
      },
      "relatedLinks": [
        {
          "title": "Related Article",
          "description": "Learn more",
          "url": "/blog/related",
          "imageUrl": "https://..."
        }
      ],
      "redirectLinks": [
        {
          "slug": "demo",
          "title": "Watch Demo",
          "description": "5-min video",
          "icon": "🎥"
        }
      ]
    }
  }
}
```

#### Redirect Endpoint (Optional)
```
GET /r/:slug

- Redirects to target URL
- Tracks click for analytics
- Returns 301/302 redirect
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Test Locally

Create a `.env` file:
```env
API_BASE_URL=https://api.sarlab.pro
PUBLIC_SITE_URL=http://localhost:4321
```

Run dev server:
```bash
npm run dev
```

Visit: http://localhost:4321/tr

### 3. Deploy to Cloudflare Pages

```bash
npm run build
wrangler pages deploy dist
```

Or use Cloudflare Dashboard with Git integration.

## 📁 File Structure

```
src/
├── components/
│   ├── blocks/               # NEW: Post block components
│   │   ├── CTABlock.astro
│   │   ├── RelatedLinks.astro
│   │   └── RedirectLinks.astro
│   ├── Header.astro          # UPDATED: Uses settings
│   ├── Footer.astro          # UPDATED: Uses settings
│   └── SEO.astro             # UPDATED: Accepts twitterHandle
├── layouts/
│   ├── BaseLayout.astro      # UPDATED: Requires settings
│   ├── PostLayout.astro      # UPDATE NEEDED
│   └── PostLayout.NEW.astro  # EXAMPLE: With blocks
├── pages/
│   ├── [lang]/
│   │   ├── index.astro           # UPDATE NEEDED
│   │   ├── index.NEW.astro       # EXAMPLE: With settings
│   │   ├── blog/[slug].astro     # UPDATE NEEDED
│   │   └── ...                   # ALL NEED UPDATING
├── lib/
│   └── api.ts                # UPDATED: getSettings() method
└── types/
    └── index.ts              # UPDATED: BlogSettings, blocks
```

## 🧪 Testing Checklist

- [ ] Settings API returns correct data
- [ ] Logo displays from settings.logoUrl
- [ ] Navigation renders from settings.navigation
- [ ] Footer shows social links correctly
- [ ] Favicon loads from settings.faviconUrl
- [ ] Post blocks (CTA, related, redirect) render
- [ ] SEO meta tags include Twitter handle
- [ ] Multi-language switching works
- [ ] Responsive design on mobile/tablet/desktop
- [ ] Build completes without errors
- [ ] Deploy to Cloudflare works

## 📖 Documentation

- **NEW_ARCHITECTURE.md** - Full architecture explanation
- **IMPLEMENTATION_COMPLETE.md** - This file
- **README.md** - Original documentation
- **QUICKSTART.md** - Quick setup guide

## 🔗 Key Concepts

### 1. Settings Caching
Settings are cached for 5 minutes in memory to reduce API calls. Clear cache by restarting server.

### 2. Fallback Behavior
If settings API fails, fallback defaults are used:
```javascript
{
  siteName: 'Sarlab Blog',
  siteDescription: 'Premium marketing and technology insights',
  navigation: [{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }],
  footerLinks: [],
  socialLinks: []
}
```

### 3. Language Prefixing
Internal links automatically get `/${lang}` prefix:
- `/blog` → `/tr/blog`
- `/about` → `/en/about`

External links (full URLs) stay unchanged.

### 4. Post Blocks
Blocks are optional. If `post.blocks` is undefined or empty, no blocks render.

### 5. SEO Overrides
Post-level SEO fields override defaults:
- `post.seoTitle` → Page title
- `post.seoDescription` → Meta description
- `post.ogImageUrl` → Open Graph image

## 🎯 Next Steps

1. **Update all pages** to fetch and pass settings
2. **Test locally** with real API endpoints
3. **Deploy to staging** environment
4. **Verify SEO** with Google Search Console
5. **Monitor performance** with Cloudflare Analytics
6. **Add analytics** tracking to redirect links

## 💡 Pro Tips

1. **Settings caching**: Don't fetch settings in components, pass from page level
2. **Build time**: Settings are fetched at request time (SSR), not build time
3. **Error handling**: Always provide fallback UI if API fails
4. **Type safety**: Use TypeScript interfaces to catch errors early
5. **Testing**: Mock API responses for local development

## 🐛 Troubleshooting

**Settings not updating?**
- Check 5-minute cache TTL
- Restart dev server to clear cache
- Verify API endpoint is accessible

**Blocks not rendering?**
- Check `post.blocks` exists in API response
- Verify block components are imported
- Check browser console for errors

**Build fails?**
- Run `npm run typecheck` to find type errors
- Ensure all pages pass `settings` to BaseLayout
- Check for missing imports

---

**Status**: Core infrastructure complete, example files provided, pages need updating.

**Estimated work remaining**: 2-3 hours to update all pages and test.
