# Quick Start Guide

Get your Sarlab Blog up and running in 5 minutes.

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Cloudflare account (for deployment)

## Setup (2 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env

# 3. Edit .env - set your API URL
nano .env  # or use your preferred editor
# Change: API_BASE_URL=https://api.sarlab.pro

# 4. Start dev server
npm run dev
```

Your site is now running at `http://localhost:4321`

## Deploy to Cloudflare (3 minutes)

### Option A: Git-based (Recommended)

1. Push code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Workers & Pages → Create → Pages → Connect to Git

3. Select your repository

4. Configure:
   - Build command: `npm run build`
   - Build output: `dist`

5. Add environment variables:
   ```
   API_BASE_URL=https://api.sarlab.pro
   PUBLIC_SITE_URL=https://sarlab.pro
   PUBLIC_SITE_NAME=Sarlab Blog
   PUBLIC_SITE_DESCRIPTION=Premium marketing and technology insights
   ```

6. Click "Save and Deploy"

Done! Your site is live at `https://your-project.pages.dev`

### Option B: CLI Deploy

```bash
# Install Wrangler
npm install -g wrangler

# Login
wrangler login

# Build and deploy
npm run build
wrangler pages deploy dist --project-name=sarlab-blog
```

## Test Your API

The blog expects these endpoints to work:

```bash
# Test posts endpoint
curl "https://api.sarlab.pro/api/public/blog/posts?lang=tr&page=1&limit=12"

# Test single post
curl "https://api.sarlab.pro/api/public/blog/posts/example-slug?lang=tr"

# Test categories
curl "https://api.sarlab.pro/api/public/blog/categories?lang=tr"

# Test tags
curl "https://api.sarlab.pro/api/public/blog/tags?lang=tr"
```

Expected response format:
```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 12
}
```

## Verify Deployment

Check these URLs after deployment:

- `https://your-site.com/` → Redirects to `/tr`
- `https://your-site.com/tr` → Turkish homepage
- `https://your-site.com/en` → English homepage
- `https://your-site.com/de` → German homepage
- `https://your-site.com/tr/blog` → Blog posts
- `https://your-site.com/robots.txt` → Robots file
- `https://your-site.com/sitemap.xml` → Sitemap
- `https://your-site.com/rss.xml` → RSS feed

## Common Issues

**"API not found" error**
- Verify API_BASE_URL in .env or Cloudflare settings
- Test API endpoint directly in browser

**Build fails**
- Check Node.js version: `node -v` (should be 18+)
- Clear cache: `rm -rf node_modules package-lock.json && npm install`

**No posts showing**
- Check API response format matches expected structure
- Verify API returns `{ data: [], total, page, limit }`

**Images not loading**
- Ensure coverImageUrl is a full URL (e.g., `https://...`)
- Check if images are publicly accessible

## Customize

### Colors
Edit `src/config/theme.ts`:
```typescript
colors: {
  primary: {
    main: '#0ea5e9', // Your color here
  }
}
```

### Site Name
Edit `.env`:
```env
PUBLIC_SITE_NAME=Your Blog Name
```

### Translations
Edit `src/lib/utils.ts` → `translations` object

## Next Steps

1. ✅ Deploy to Cloudflare
2. 🌐 Add custom domain in Cloudflare Pages settings
3. 🔍 Submit sitemap to Google Search Console
4. 📊 Add analytics (Google Analytics, Plausible, etc.)
5. 🎨 Customize colors and branding
6. 📝 Create legal pages (privacy, terms)

## Need Help?

- Full docs: [README.md](README.md)
- Implementation details: [IMPLEMENTATION.md](IMPLEMENTATION.md)
- Assumptions: [ASSUMPTIONS.md](ASSUMPTIONS.md)
- Astro docs: https://docs.astro.build
- Cloudflare docs: https://developers.cloudflare.com/pages

## Quick Reference

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run typecheck    # Type checking
npm run lint         # Lint code

# Deployment
wrangler login       # Login to Cloudflare
wrangler pages deploy dist  # Deploy to Cloudflare
```

That's it! Your blog is ready to go. 🚀
