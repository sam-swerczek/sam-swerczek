import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize user input using DOMPurify (industry-standard XSS protection)
 * Configured for plain text only - strips ALL HTML
 *
 * This prevents XSS attacks by using a battle-tested library rather than
 * custom regex patterns which are prone to bypasses.
 */
export function sanitizeText(input: string): string {
  // Use DOMPurify with strict configuration for plain text
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
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a'],
    ALLOWED_ATTR: ['href'],
    ALLOW_DATA_ATTR: false,
  });
}
