import { getPostStats, getAllPosts } from '@/lib/supabase/admin';
import Link from 'next/link';
import { Post } from '@/lib/types';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { redirect } from 'next/navigation';

export default async function AdminDashboard() {
  // Server-side authentication check
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Handle server component cookie limitations
          }
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Now safe to fetch admin data
  let stats = { total: 0, published: 0, drafts: 0 };
  let recentPosts: Post[] = [];

  try {
    stats = await getPostStats();
    const allPosts = await getAllPosts();
    recentPosts = allPosts.slice(0, 5);
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-text-primary mb-2">
          Welcome back!
        </h1>
        <p className="text-text-secondary">
          Manage your content and site configuration from this dashboard.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Posts"
          value={stats.total.toString()}
          description={`${stats.published} published, ${stats.drafts} drafts`}
          icon="📝"
        />
        <StatCard
          title="Published"
          value={stats.published.toString()}
          description="Live on your blog"
          icon="✅"
        />
        <StatCard
          title="Drafts"
          value={stats.drafts.toString()}
          description="Unpublished posts"
          icon="✏️"
        />
      </div>

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <div className="bg-background-secondary rounded-lg border border-gray-800 p-6 mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Recent Posts</h2>
          <div className="space-y-3">
            {recentPosts.map((post) => (
              <Link
                key={post.id}
                href={`/admin/posts/${post.id}`}
                className="block p-3 rounded-lg hover:bg-background-primary transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-text-primary font-medium group-hover:text-accent-blue transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-text-secondary mt-1">{post.excerpt}</p>
                  </div>
                  <span
                    className={`ml-4 px-2 py-1 text-xs rounded ${
                      post.published
                        ? 'bg-green-900/30 text-green-400'
                        : 'bg-yellow-900/30 text-yellow-400'
                    }`}
                  >
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-background-secondary rounded-lg border border-gray-800 p-6">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ActionCard
            href="/admin/posts/new"
            title="Create New Post"
            description="Write a new blog post"
            icon="+"
          />
          <ActionCard
            href="/admin/posts"
            title="Manage Posts"
            description="View and edit existing posts"
            icon="📄"
          />
          <ActionCard
            href="/admin/songs"
            title="Manage Songs"
            description="Add and organize your music"
            icon="🎵"
          />
          <ActionCard
            href="/admin/config"
            title="Site Configuration"
            description="Update social links and settings"
            icon="⚙️"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="bg-background-secondary rounded-lg border border-gray-800 p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-3xl font-bold text-text-primary mb-1">{value}</div>
      <p className="text-sm text-text-secondary">{description}</p>
    </div>
  );
}

function ActionCard({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      className="block bg-background-primary hover:bg-gray-800 rounded-lg border border-gray-700 p-4 transition-colors group"
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-10 h-10 bg-accent-blue/10 rounded-lg flex items-center justify-center text-accent-blue group-hover:bg-accent-blue/20 transition-colors">
          <span className="text-xl">{icon}</span>
        </div>
        <div>
          <h3 className="text-base font-semibold text-text-primary mb-1 group-hover:text-accent-blue transition-colors">
            {title}
          </h3>
          <p className="text-sm text-text-secondary">{description}</p>
        </div>
      </div>
    </Link>
  );
}
