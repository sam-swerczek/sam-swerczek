/**
 * Admin allowlist helpers.
 *
 * Any Google account can authenticate (to leave comments), so authentication
 * alone must NOT grant admin access. Admin status is determined solely by
 * membership in the ADMIN_EMAILS allowlist.
 *
 * These are pure functions that only read process.env, so they are safe to
 * import from the Edge middleware as well as Node route handlers / server
 * actions. ADMIN_EMAILS is server-only (never prefixed NEXT_PUBLIC_).
 */

/** Parse ADMIN_EMAILS into a normalized (trimmed, lowercased) list. */
export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

/** True only if the given email is on the admin allowlist. */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
}
