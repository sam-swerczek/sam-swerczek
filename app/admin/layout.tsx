'use client';

import { ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthProvider, useAuthContext } from '@/components/providers/AuthProvider';
import Link from 'next/link';

function AdminLayoutContent({ children }: { children: ReactNode }) {
  const { user, signOut, loading } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    const { success } = await signOut();
    if (success) {
      router.push('/admin/login');
      router.refresh();
    }
  };

  // Don't show nav/header on login page
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background-navy">
      {/* Admin Header */}
      <header className="bg-background-secondary border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent-teal rounded-full animate-pulse"></div>
              <h1 className="text-xl font-bold text-text-primary">
                Admin Dashboard
              </h1>
            </div>

            <div className="flex items-center space-x-6">
              {user && (
                <>
                  <span className="text-sm text-text-secondary">
                    {user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    disabled={loading}
                    className="px-4 py-2 bg-background-primary hover:bg-gray-800 text-text-primary text-sm font-medium rounded-md border border-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-background-secondary"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Admin Navigation */}
      <nav className="bg-background-primary border-b border-gray-800">
        <div className="container mx-auto px-4">
          <ul className="flex space-x-1">
            <NavItem href="/admin" label="Dashboard" active={pathname === '/admin'} />
            <NavItem
              href="/admin/posts"
              label="Manage Posts"
              active={pathname.startsWith('/admin/posts')}
            />
            <NavItem
              href="/admin/songs"
              label="Manage Songs"
              active={pathname.startsWith('/admin/songs')}
            />
            <NavItem href="/admin/config" label="Site Config" active={pathname === '/admin/config'} />
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Admin Footer */}
      <footer className="bg-background-secondary border-t border-gray-800 mt-auto">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-sm text-text-secondary">
            Admin Panel | Sam Swerczek Personal Website
          </p>
        </div>
      </footer>
    </div>
  );
}

function NavItem({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <li>
      <Link
        href={href}
        className={`block px-4 py-3 text-sm font-medium transition-colors ${
          active
            ? 'text-accent-blue border-b-2 border-accent-blue'
            : 'text-text-secondary hover:text-text-primary hover:bg-background-secondary'
        }`}
      >
        {label}
      </Link>
    </li>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  );
}
