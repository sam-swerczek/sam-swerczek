/**
 * Sanitize user input using DOMPurify (industry-standard XSS protection)
 * Configured for plain text only - strips ALL HTML
 *
 * This prevents XSS attacks by using a battle-tested library rather than
 * custom regex patterns which are prone to bypasses.
 *
 * Note: DOMPurify is lazy-loaded to avoid issues during Vercel build phase
 */
export function sanitizeText(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  // For server-side (Node.js), use DOMPurify with jsdom
  if (typeof window === 'undefined') {
    const { JSDOM } = require('jsdom');
    const createDOMPurify = require('dompurify');

    const window = new JSDOM('').window;
    const DOMPurify = createDOMPurify(window as unknown as Window);

    const sanitized = DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [],        // No HTML tags allowed
      ALLOWED_ATTR: [],        // No attributes allowed
      KEEP_CONTENT: true,      // Keep text content
      ALLOW_DATA_ATTR: false,  // No data attributes
    });

    return sanitized.trim();
  }

  // For client-side (browser)
  const createDOMPurify = require('dompurify');
  const DOMPurify = createDOMPurify(window);

  const sanitized = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],        // No HTML tags allowed
    ALLOWED_ATTR: [],        // No attributes allowed
    KEEP_CONTENT: true,      // Keep text content
    ALLOW_DATA_ATTR: false,  // No data attributes
  });

  return sanitized.trim();
}

/**
 * Sanitize HTML content (for future use if you need to allow some HTML)
 * Currently unused but available for rich text features
 */
export function sanitizeHTML(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  // For server-side (Node.js), use DOMPurify with jsdom
  if (typeof window === 'undefined') {
    const { JSDOM } = require('jsdom');
    const createDOMPurify = require('dompurify');

    const window = new JSDOM('').window;
    const DOMPurify = createDOMPurify(window as unknown as Window);

    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a'],
      ALLOWED_ATTR: ['href'],
      ALLOW_DATA_ATTR: false,
    });
  }

  // For client-side (browser)
  const createDOMPurify = require('dompurify');
  const DOMPurify = createDOMPurify(window);

  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a'],
    ALLOWED_ATTR: ['href'],
    ALLOW_DATA_ATTR: false,
  });
}
