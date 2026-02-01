# Sarlab Blog - Astro + Cloudflare Pages

A modern, fast, SEO-optimized blog platform built with Astro and deployed on Cloudflare Pages. Features runtime data fetching, multi-language support (TR/EN/DE), and a premium marketing-focused design.

## Features

- **Astro SSR** with Cloudflare adapter for edge rendering
- **Multi-language support** (Turkish, English, German) with hreflang tags
- **Runtime data fetching** from API - no rebuild needed for new posts
- **Excellent SEO**: Canonical URLs, Open Graph, Twitter Cards, JSON-LD, sitemap, RSS
- **Premium UI/UX**: Clean design, responsive, accessible
- **Security-first**: HTML sanitization, CSP-friendly, no eval
- **Performance optimized**: Cloudflare caching, lazy images, minimal JS
- **TypeScript** for type safety
- **Tailwind CSS** for styling

## Project Structure

```
/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── SEO.astro
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── PostCard.astro
│   │   ├── Pagination.astro
│   │   └── ...
│   ├── layouts/          # Page layouts
│   │   ├── BaseLayout.astro
│   │   └── PostLayout.astro
│   ├── pages/            # Route pages
│   │   ├── [lang]/
│   │   │   ├── index.astro
│   │   │   ├── blog/
│   │   │   ├── category/
│   │   │   ├── tag/
│   │   │   └── search.astro
│   │   ├── robots.txt.ts
│   │   ├── sitemap.xml.ts
│   │   └── rss.xml.ts
│   ├── lib/              # Core utilities
│   │   ├── api.ts        # API client with retry/timeout
│   │   ├── utils.ts      # Helper functions
│   │   └── sanitizer.ts  # HTML sanitization
│   ├── types/            # TypeScript definitions
│   └── config/           # Theme configuration
├── public/               # Static assets
├── astro.config.mjs      # Astro configuration
├── tailwind.config.mjs   # Tailwind configuration
└── package.json
```

## Setup & Development

### Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cf-astro-pages
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
API_BASE_URL=https://api.sarlab.pro
PUBLIC_SITE_URL=https://sarlab.pro
PUBLIC_SITE_NAME=Sarlab Blog
PUBLIC_SITE_DESCRIPTION=Premium marketing and technology insights
```

### Local Development

Start the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:4321`

### Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

### Type Checking

Run TypeScript type checking:
```bash
npm run typecheck
```

## API Integration

The blog fetches data from your backend API at runtime. Required API endpoints:

### Posts
- `GET /api/public/blog/posts?lang=tr|en|de&page=1&limit=12`
- `GET /api/public/blog/posts/:slug?lang=tr|en|de`

Response format:
```json
{
  "data": [
    {
      "id": "string",
      "slug": "string",
      "title": "string",
      "excerpt": "string",
      "bodyHtml": "string",
      "bodyMarkdown": "string",
      "coverImageUrl": "string",
      "authorName": "string",
      "publishedAt": "ISO-8601",
      "updatedAt": "ISO-8601",
      "lang": "tr|en|de",
      "tags": [...],
      "categories": [...],
      "canonicalUrl": "string?",
      "noIndex": "boolean?",
      "featured": "boolean?"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 12
}
```

### Categories & Tags
- `GET /api/public/blog/categories?lang=tr|en|de`
- `GET /api/public/blog/tags?lang=tr|en|de`

## Deployment to Cloudflare Pages

### Option 1: Cloudflare Dashboard

1. Push your code to a Git repository (GitHub, GitLab, etc.)

2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)

3. Navigate to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**

4. Select your repository and configure:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Environment variables**: Add your environment variables from `.env`

5. Click **Save and Deploy**

### Option 2: Wrangler CLI

1. Install Wrangler:
```bash
npm install -g wrangler
```

2. Login to Cloudflare:
```bash
wrangler login
```

3. Build the project:
```bash
npm run build
```

4. Deploy:
```bash
wrangler pages deploy dist
```

### Environment Variables on Cloudflare

Set these in your Cloudflare Pages project settings:

```
API_BASE_URL=https://api.sarlab.pro
PUBLIC_SITE_URL=https://sarlab.pro
PUBLIC_SITE_NAME=Sarlab Blog
PUBLIC_SITE_DESCRIPTION=Premium marketing and technology insights
```

## Customization

### Theme

Edit colors and typography in `src/config/theme.ts`:

```typescript
export const theme = {
  colors: {
    primary: { main: '#0ea5e9', ... },
    neutral: { ... },
  },
  typography: { ... },
  // ... more configuration
};
```

### Translations

Add or modify translations in `src/lib/utils.ts`:

```typescript
export const translations = {
  tr: { ... },
  en: { ... },
  de: { ... },
};
```

### SEO

Meta tags and structured data are automatically generated. Customize in:
- `src/components/SEO.astro` - Meta tags
- `src/layouts/PostLayout.astro` - JSON-LD schema

## Routes

- `/` - Redirects to `/tr`
- `/{lang}` - Language home page (tr/en/de)
- `/{lang}/blog` - Blog post list
- `/{lang}/blog/page/{n}` - Paginated blog list
- `/{lang}/blog/{slug}` - Individual blog post
- `/{lang}/category/{slug}` - Posts by category
- `/{lang}/tag/{slug}` - Posts by tag
- `/{lang}/search` - Search posts
- `/robots.txt` - Robots file
- `/sitemap.xml` - XML sitemap
- `/rss.xml` - RSS feed

## Performance

The site implements several performance optimizations:

- **Edge caching**: Cloudflare caches pages at the edge
- **Cache headers**: Smart caching for list/post pages
- **Lazy loading**: Images load on demand
- **Minimal JavaScript**: Only essential client-side code
- **Optimized fonts**: Preconnect and display swap

## Security

- **HTML sanitization**: All user content is sanitized with DOMPurify
- **CSP-friendly**: No inline scripts or eval
- **Secure headers**: X-Frame-Options, X-Content-Type-Options
- **API timeouts**: Requests timeout after 10 seconds
- **Input validation**: All user input is validated

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

[Your License Here]

## Support

For issues and questions:
- GitHub Issues: [Your Repo URL]
- Email: support@sarlab.pro
