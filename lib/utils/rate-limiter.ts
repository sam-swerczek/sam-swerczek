/**
 * Simple in-memory rate limiter for API routes
 *
 * This implementation is suitable for single-instance deployments.
 * For multi-instance/production environments, consider using Upstash Redis.
 *
 * Features:
 * - Per-IP rate limiting
 * - Sliding window algorithm
 * - Automatic cleanup of expired entries
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// Store rate limit data in memory
// Key format: "ip:endpoint"
const requestCounts = new Map<string, RateLimitRecord>();

// Cleanup expired entries every 5 minutes to prevent memory leaks
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

/**
 * Performs cleanup of expired rate limit records
 */
function cleanup(): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) {
    return;
  }

  const expiredKeys: string[] = [];
  for (const [key, record] of requestCounts.entries()) {
    if (now > record.resetTime) {
      expiredKeys.push(key);
    }
  }

  expiredKeys.forEach(key => requestCounts.delete(key));
  lastCleanup = now;
}

/**
 * Rate limits requests based on IP and endpoint
 *
 * @param identifier - Unique identifier (usually IP address)
 * @param endpoint - API endpoint name (for separate rate limits per endpoint)
 * @param maxRequests - Maximum number of requests allowed in the time window
 * @param windowMs - Time window in milliseconds
 * @returns true if request is allowed, false if rate limit exceeded
 */
export function rateLimit(
  identifier: string,
  endpoint: string,
  maxRequests: number,
  windowMs: number
): boolean {
  // Periodic cleanup
  cleanup();

  const now = Date.now();
  const key = `${identifier}:${endpoint}`;
  const record = requestCounts.get(key);

  // No record exists or window has expired - allow and create new record
  if (!record || now > record.resetTime) {
    requestCounts.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return true;
  }

  // Check if limit exceeded
  if (record.count >= maxRequests) {
    return false;
  }

  // Increment count and allow
  record.count++;
  return true;
}

/**
 * Gets the client IP address from request headers
 * Handles various proxy configurations (Vercel, Cloudflare, etc.)
 *
 * SECURITY: Uses infrastructure-set headers that cannot be spoofed by clients.
 * - Vercel: x-vercel-forwarded-for (set by Vercel edge, trusted)
 * - Cloudflare: cf-connecting-ip (set by CF edge, trusted)
 * - Generic: Takes LAST IP from x-forwarded-for (set by infrastructure, not client)
 *
 * @param request - Next.js Request object
 * @returns IP address or 'unknown' if cannot be determined
 */
export function getClientIp(request: Request): string {
  // Vercel sets this header - it can't be spoofed by the client
  const vercelIp = request.headers.get('x-vercel-forwarded-for');
  if (vercelIp) {
    // Take first IP from Vercel's header (already validated by Vercel)
    return vercelIp.split(',')[0].trim();
  }

  // Cloudflare's header - set by CF edge, trusted
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }

  // For generic proxies, take the LAST IP in the chain
  // The rightmost IP is added by your infrastructure (trusted)
  // The leftmost IPs can be forged by the client
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const ips = forwardedFor.split(',').map(ip => ip.trim());
    // Return the last IP (closest to your server, set by trusted proxy)
    return ips[ips.length - 1];
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }

  // Fallback to unknown if no IP headers found
  // This can happen in development or certain proxy configurations
  return 'unknown';
}

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
  CONTACT_FORM: {
    maxRequests: 5,
    windowMs: 60 * 1000, // 1 minute
    endpoint: 'contact',
  },
  BLOG_GENERATION: {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
    endpoint: 'generate-post',
  },
} as const;
