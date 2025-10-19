/**
 * Simple in-memory rate limiter for API routes
 *
 * TODO: This implementation is NOT suitable for serverless/Vercel deployments!
 * In serverless environments, the in-memory Map is recreated on every function invocation,
 * making rate limiting ineffective. This only works for:
 * - Local development
 * - Traditional server deployments (VPS, dedicated servers)
 * - Single-instance containers
 *
 * For production serverless deployments (Vercel, AWS Lambda, etc.), you MUST use:
 * - @upstash/ratelimit with Upstash Redis (recommended for Vercel)
 * - Vercel KV
 * - Redis with @upstash/redis
 *
 * This implementation uses a sliding window algorithm to track requests per user.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory store for rate limit data
// Map structure: identifier -> RateLimitRecord
const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (record.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 10 * 60 * 1000);

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Check if a request should be rate limited
 *
 * @param identifier - Unique identifier (e.g., user ID, IP address)
 * @param limit - Maximum number of requests allowed in the window
 * @param windowMs - Time window in milliseconds (default: 1 hour)
 * @returns RateLimitResult with success status and metadata
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 5,
  windowMs: number = 60 * 60 * 1000 // 1 hour
): RateLimitResult {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  // No previous record - create new one
  if (!record) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });

    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: now + windowMs,
    };
  }

  // Reset time has passed - create new window
  if (record.resetTime < now) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });

    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: now + windowMs,
    };
  }

  // Within current window - check if limit exceeded
  if (record.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: record.resetTime,
    };
  }

  // Increment count
  record.count++;
  rateLimitStore.set(identifier, record);

  return {
    success: true,
    limit,
    remaining: limit - record.count,
    reset: record.resetTime,
  };
}

/**
 * Create a rate limiter with specific settings
 *
 * @param limit - Maximum requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns Function that checks rate limit for an identifier
 */
export function createRateLimiter(limit: number, windowMs: number) {
  return (identifier: string) => checkRateLimit(identifier, limit, windowMs);
}

/**
 * Pre-configured rate limiters for different operations
 */
export const rateLimiters = {
  // Comment creation: 5 per hour (very restrictive to prevent spam)
  commentCreate: (identifier: string) =>
    checkRateLimit(identifier, 5, 60 * 60 * 1000),

  // Comment updates: 10 per hour (allow fixing mistakes)
  commentUpdate: (identifier: string) =>
    checkRateLimit(identifier, 10, 60 * 60 * 1000),

  // Comment deletion: 20 per hour (allow bulk cleanup)
  commentDelete: (identifier: string) =>
    checkRateLimit(identifier, 20, 60 * 60 * 1000),
};

/**
 * Format rate limit info for response headers (RFC 6585)
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toString(),
  };
}
