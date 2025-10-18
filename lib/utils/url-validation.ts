/**
 * URL and Email Validation Utilities
 *
 * Security utilities to validate and sanitize URLs and email addresses
 * before rendering them in the application.
 */

// Branded types for type-level safety
export type ValidatedUrl = string & { __brand: 'ValidatedUrl' };
export type ValidatedEmail = string & { __brand: 'ValidatedEmail' };

/**
 * Validates if a URL string is well-formed and uses an allowed protocol
 * @param url - The URL string to validate
 * @param allowedProtocols - Array of allowed protocol strings (without colon)
 * @returns true if the URL is valid, false otherwise
 */
export function isValidUrl(
  url: string,
  allowedProtocols: string[] = ['http', 'https']
): boolean {
  try {
    const parsed = new URL(url);
    return allowedProtocols.includes(parsed.protocol.replace(':', ''));
  } catch {
    return false;
  }
}

/**
 * Validates if an email string is well-formed
 * @param email - The email string to validate
 * @returns true if the email is valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  // Basic email validation regex
  // Matches most standard email formats
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitizes a URL by validating it and returning undefined if invalid
 * @param url - The URL string to sanitize
 * @param allowedProtocols - Array of allowed protocol strings (without colon)
 * @returns The sanitized URL or undefined if invalid
 */
export function sanitizeUrl(
  url: string | undefined,
  allowedProtocols: string[] = ['http', 'https']
): ValidatedUrl | undefined {
  if (!url) return undefined;

  // Remove any leading/trailing whitespace
  url = url.trim();

  // Validate the URL
  if (!isValidUrl(url, allowedProtocols)) {
    console.warn(`Invalid URL detected and removed: ${url}`);
    return undefined;
  }

  return url as ValidatedUrl;
}

/**
 * Sanitizes an email by validating it and returning undefined if invalid
 * @param email - The email string to sanitize
 * @returns The sanitized email or undefined if invalid
 */
export function sanitizeEmail(
  email: string | undefined
): ValidatedEmail | undefined {
  if (!email) return undefined;

  email = email.trim();

  if (!isValidEmail(email)) {
    console.warn(`Invalid email detected and removed: ${email}`);
    return undefined;
  }

  return email as ValidatedEmail;
}

/**
 * Sanitizes an Instagram handle URL
 * Accepts both full URLs and @handles
 * @param handle - The Instagram handle or URL
 * @returns A sanitized Instagram URL or undefined if invalid
 */
export function sanitizeInstagramHandle(
  handle: string | undefined
): ValidatedUrl | undefined {
  if (!handle) return undefined;

  handle = handle.trim();

  // If it's already a URL, validate it
  if (handle.startsWith('http://') || handle.startsWith('https://')) {
    return sanitizeUrl(handle);
  }

  // If it's a handle (starts with @), convert to URL
  if (handle.startsWith('@')) {
    const username = handle.substring(1);
    return `https://instagram.com/${username}` as ValidatedUrl;
  }

  // If it's just a username without @
  return `https://instagram.com/${handle}` as ValidatedUrl;
}
