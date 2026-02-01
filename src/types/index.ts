export type Language = 'tr' | 'en' | 'de';

// Blog Settings from API
export interface BlogSettings {
  siteName: string;
  siteDescription: string;
  logoUrl?: string;
  faviconUrl?: string;
  ogImageUrl?: string;
  navigation: NavigationItem[];
  footerLinks: FooterSection[];
  footerText?: string;
  socialLinks: SocialLink[];
  seoTitle?: string;
  seoDescription?: string;
  twitterHandle?: string;
  enableNewsletter?: boolean;
  newsletterTitle?: string;
  newsletterDescription?: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
  icon?: string;
}

export interface FooterSection {
  title: string;
  links: NavigationItem[];
}

export interface SocialLink {
  platform: 'twitter' | 'facebook' | 'linkedin' | 'instagram' | 'github' | 'youtube';
  url: string;
  label?: string;
}

// Post Types
export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  bodyMarkdown: string;
  coverImageUrl?: string;
  authorName: string;
  authorAvatar?: string;
  publishedAt: string;
  updatedAt: string;
  lang: Language;
  tags: Tag[];
  categories: Category[];
  canonicalUrl?: string;
  noIndex?: boolean;
  featured?: boolean;
  blocks?: PostBlocks;
  seoTitle?: string;
  seoDescription?: string;
  ogImageUrl?: string;
}

export interface PostBlocks {
  cta?: CTABlock;
  relatedLinks?: RelatedLink[];
  redirectLinks?: RedirectLink[];
}

export interface CTABlock {
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  style?: 'primary' | 'secondary' | 'outline';
}

export interface RelatedLink {
  title: string;
  description?: string;
  url: string;
  imageUrl?: string;
}

export interface RedirectLink {
  slug: string;
  title: string;
  description?: string;
  icon?: string;
}

export interface Category {
  id?: string;
  slug: string;
  name: string;
  description?: string;
  lang?: Language;
}

export interface Tag {
  id?: string;
  slug: string;
  name: string;
  lang?: Language;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface SingleResponse<T> {
  data: T;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  noIndex?: boolean;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  lang: Language;
  alternates?: Array<{ lang: Language; href: string }>;
  twitterHandle?: string;
}

export interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}
