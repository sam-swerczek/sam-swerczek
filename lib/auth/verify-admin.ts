import { createRouteClient } from '@/lib/supabase/server';
import { isAdminEmail } from './admin-allowlist';

/**
 * Verify that the current request comes from an allow-listed admin.
 *
 * Reads the session from cookies (NOT the service-role client) and checks the
 * user's email against the ADMIN_EMAILS allowlist. Throws if the caller is not
 * an admin. This is defense-in-depth: admin server actions and API routes use
 * the service-role key (which bypasses RLS), so they must not rely on the
 * middleware alone to keep non-admin authenticated users (e.g. commenters) out.
 *
 * @returns the authenticated admin user
 * @throws Error if the caller is unauthenticated or not on the allowlist
 */
export async function verifyAdminAuth() {
  const authClient = await createRouteClient();
  const { data: { user }, error } = await authClient.auth.getUser();

  if (error || !isAdminEmail(user?.email)) {
    throw new Error('Unauthorized: admin access required');
  }

  return user;
}
