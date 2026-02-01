# Getting Started - Settings-Driven Sarlab Blog

## What You Have

A production-grade Astro blog with:
- **Settings API integration** - Logo, nav, footer, social from backend
- **Post blocks** - CTA, related links, redirect tracking links
- **Multi-language** - TR/EN/DE with hreflang
- **SEO optimized** - Canonical, OG, Twitter, JSON-LD, sitemap, RSS
- **Cloudflare ready** - SSR with edge caching

## Quick Start

### 1. Install
```bash
cd cf-astro-pages
npm install
```

### 2. Environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
API_BASE_URL=https://api.sarlab.pro
PUBLIC_SITE_URL=http://localhost:4321
```

### 3. Run
```bash
npm run dev
```

Visit: http://localhost:4321

## API Requirements

Your backend must provide:

### Settings Endpoint
```
GET /api/public/blog/settings
```

Returns site configuration (logo, nav, footer, social).

See `NEW_ARCHITECTURE.md` for full response format.

### Posts Endpoints
```
GET /api/public/blog/posts?lang=tr&page=1&limit=12
GET /api/public/blog/posts/:slug?lang=tr
GET /api/public/blog/categories?lang=tr
GET /api/public/blog/tags?lang=tr
```

Posts now support:
- `bodyMarkdown` field (rendered safely)
- `blocks` object for CTA, related links, redirect links
- SEO overrides: `seoTitle`, `seoDescription`, `ogImageUrl`
- `authorAvatar` URL

## File Structure

```
cf-astro-pages/
├── src/
│   ├── components/
│   │   ├── blocks/           # Post content blocks
│   │   │   ├── CTABlock.astro
│   │   │   ├── RelatedLinks.astro
│   │   │   └── RedirectLinks.astro
│   │   ├── Header.astro      # Settings-driven nav
│   │   ├── Footer.astro      # Settings-driven footer
│   │   └── SEO.astro
│   ├── layouts/
│   │   ├── BaseLayout.astro  # Requires settings prop
│   │   ├── PostLayout.NEW.astro  # Example with blocks
│   │   └── PostLayout.astro      # TO UPDATE
│   ├── pages/
│   │   └── [lang]/
│   │       ├── index.NEW.astro   # Example updated page
│   │       └── ...               # TO UPDATE
│   ├── lib/
│   │   └── api.ts            # getSettings() method
│   └── types/
│       └── index.ts          # BlogSettings, PostBlocks
├── GETTING_STARTED.md        # This file
├── IMPLEMENTATION_COMPLETE.md # What's done, what's needed
└── NEW_ARCHITECTURE.md        # Full architecture docs
```

## Current Status

✅ **Done**:
- TypeScript types for settings and blocks
- API client with getSettings() caching
- Header, Footer, SEO components updated
- Post block components (CTA, Related, Redirect)
- BaseLayout updated to use settings
- Example files for homepage and post layout

⏳ **Remaining Work**:
- Update all pages in `src/pages/` to fetch and pass settings
- Replace PostLayout with new version
- Test with real API endpoints
- Deploy to Cloudflare Pages

## Next Steps

### For Frontend Dev

1. **Update all pages** - Pattern:
   ```astro
   const settings = await api.getSettings();
   <BaseLayout settings={settings} ...>
   ```

2. **Update PostLayout**:
   ```bash
   cp src/layouts/PostLayout.NEW.astro src/layouts/PostLayout.astro
   ```

3. **Test locally** with mock API responses

### For Backend Dev

1. **Implement settings endpoint**:
   - Return BlogSettings format
   - Set cache headers (max-age=300)
   - See `NEW_ARCHITECTURE.md` for schema

2. **Update posts to include**:
   - `bodyMarkdown` field
   - Optional `blocks` object
   - Optional SEO overrides

3. **Create redirect endpoint** (optional):
   - `/r/:slug` redirects to target
   - Track clicks for analytics

## Example: Settings API Response

```json
{
  "data": {
    "siteName": "Sarlab",
    "siteDescription": "Marketing intelligence platform",
    "logoUrl": "https://cdn.sarlab.pro/logo.png",
    "faviconUrl": "https://cdn.sarlab.pro/favicon.ico",
    "navigation": [
      { "label": "Home", "href": "/" },
      { "label": "Blog", "href": "/blog" },
      { "label": "Pricing", "href": "https://sarlab.pro/pricing", "external": true }
    ],
    "footerLinks": [
      {
        "title": "Product",
        "links": [
          { "label": "Features", "href": "/features" },
          { "label": "Pricing", "href": "/pricing" }
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
    "socialLinks": [
      { "platform": "twitter", "url": "https://twitter.com/sarlab" },
      { "platform": "linkedin", "url": "https://linkedin.com/company/sarlab" }
    ],
    "twitterHandle": "@sarlab",
    "enableNewsletter": true,
    "newsletterTitle": "Stay in the loop",
    "newsletterDescription": "Weekly marketing insights"
  }
}
```

## Example: Post with Blocks

```json
{
  "data": {
    "slug": "marketing-automation-101",
    "title": "Marketing Automation 101",
    "bodyMarkdown": "# Introduction\n\nMarketing automation...",
    "authorAvatar": "https://cdn.sarlab.pro/authors/john.jpg",
    "seoTitle": "Complete Guide to Marketing Automation | Sarlab",
    "blocks": {
      "cta": {
        "title": "Ready to automate?",
        "description": "Start your free trial today",
        "buttonText": "Get Started",
        "buttonUrl": "https://app.sarlab.pro/signup",
        "style": "primary"
      },
      "relatedLinks": [
        {
          "title": "Email Marketing Guide",
          "url": "/blog/email-marketing",
          "imageUrl": "https://..."
        }
      ],
      "redirectLinks": [
        {
          "slug": "webinar",
          "title": "Watch Webinar",
          "icon": "🎥"
        }
      ]
    }
  }
}
```

## Deploy to Cloudflare Pages

### Via Dashboard
1. Push code to GitHub
2. Cloudflare → Workers & Pages → Create
3. Connect Git repository
4. Build command: `npm run build`
5. Build output: `dist`
6. Add environment variables:
   ```
   API_BASE_URL=https://api.sarlab.pro
   PUBLIC_SITE_URL=https://sarlab.pro
   ```

### Via CLI
```bash
npm install -g wrangler
wrangler login
npm run build
wrangler pages deploy dist --project-name=sarlab-blog
```

## Testing

### Local Development
```bash
npm run dev
```

Check:
- Logo from settings renders
- Navigation from settings works
- Footer shows social links
- Post with CTA block displays correctly

### TypeScript
```bash
npm run typecheck
```

### Build
```bash
npm run build
npm run preview
```

## Need Help?

- **Architecture**: Read `NEW_ARCHITECTURE.md`
- **Status**: Check `IMPLEMENTATION_COMPLETE.md`
- **API Format**: See examples above
- **Deploy**: Follow Cloudflare Pages docs

## FAQ

**Q: Why do pages need `settings` prop?**
A: Header and Footer components need settings for logo, nav, links. Pass from page → BaseLayout → components.

**Q: How often are settings cached?**
A: 5 minutes in memory. Restart server to clear cache.

**Q: What if settings API fails?**
A: Fallback defaults are used (basic site name, minimal nav).

**Q: Do I need all post blocks?**
A: No, all blocks are optional. Include only what you need.

**Q: Can I skip the redirect endpoint?**
A: Yes, redirect links will just link directly. But you lose click tracking.

**Q: How do I update navigation?**
A: Update settings in backend. Changes appear within 5 minutes (cache TTL).

---

**Ready to start?** Run `npm install && npm run dev`
**Need to update pages?** See example in `src/pages/[lang]/index.NEW.astro`
**Questions?** Check `IMPLEMENTATION_COMPLETE.md` for detailed status.
