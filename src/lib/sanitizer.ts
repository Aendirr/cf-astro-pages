/**
 * Lightweight HTML sanitizer that is safe in Cloudflare Workers.
 * We keep this intentionally conservative and runtime-independent because
 * DOM-based sanitizers can fail in some edge runtimes during SSR.
 */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/\son\w+=(["']).*?\1/gi, '')
    .replace(/\son\w+=([^\s>]+)/gi, '')
    .replace(/\s(href|src)=(["'])\s*javascript:[^"']*\2/gi, '')
    .replace(/\s(href|src)=([^\s>]*javascript:[^\s>]*)/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^>]*>/gi, '');
}

/**
 * Extract plain text from HTML (for excerpts, meta descriptions)
 */
export function stripHtml(html: string): string {
  const clean = sanitizeHtml(html);
  return clean.replace(/<[^>]*>/g, '').trim();
}

/**
 * Truncate text to a specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}
