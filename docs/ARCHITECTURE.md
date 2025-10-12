# Architecture Documentation

## Table of Contents
1. [System Architecture Overview](#system-architecture-overview)
2. [Next.js App Router Design](#nextjs-app-router-design)
3. [Supabase Integration](#supabase-integration)
4. [Authentication Architecture](#authentication-architecture)
5. [State Management](#state-management)
6. [API Routes & Server Actions](#api-routes--server-actions)
7. [Performance Considerations](#performance-considerations)
8. [Component Architecture](#component-architecture)
9. [Type Safety & Data Flow](#type-safety--data-flow)

---

## System Architecture Overview

### High-Level Request Flow

```
User Browser
    ↓
Next.js Edge Middleware (Auth Check)
    ↓
Next.js App Router (SSR/SSG)
    ↓
├─→ Server Components (Direct DB Access)
│   └─→ Supabase Client (Service Role)
│       └─→ PostgreSQL Database
│
└─→ Client Components (Browser)
    └─→ Supabase Client (Anon Key)
        └─→ PostgreSQL Database (via RLS)
```

### Architecture Principles

This application follows a **server-first architecture** that maximizes the benefits of React Server Components while maintaining interactive capabilities where needed:

1. **Server Components by default**: Most pages render on the server, reducing JavaScript bundle size and improving initial page load
2. **Strategic Client Components**: Interactive features (forms, filters, auth state) use Client Components with the `'use client'` directive
3. **Edge-first authentication**: Middleware runs at the edge to protect routes before they render
4. **Type-safe data layer**: Full TypeScript coverage from database to UI with shared type definitions

### Technology Stack

- **Frontend Framework**: Next.js 15.5+ (App Router)
- **UI Library**: React 19.2+
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **Email**: Resend API
- **AI Integration**: Anthropic Claude API
- **Type Safety**: TypeScript 5.x
- **Testing**: Jest + React Testing Library

---

## Next.js App Router Design

### Why App Router Over Pages Router

The decision to use the App Router (introduced in Next.js 13+) was deliberate:

1. **Server Components**: Ability to fetch data directly in components without prop drilling or client-side fetching
2. **Streaming & Suspense**: Built-in support for progressive rendering
3. **Nested Layouts**: Shared UI that doesn't re-render on navigation (admin layout, root layout)
4. **Improved Data Fetching**: Co-located data fetching with components that need it
5. **Edge-Ready**: Better support for edge middleware and edge runtime

### Server vs. Client Components Strategy

**Server Components (Default)**:
- `/app/page.tsx` - Homepage with static hero, about sections
- `/app/blog/page.tsx` - Blog listing (fetches posts server-side)
- `/app/blog/[slug]/page.tsx` - Individual blog posts
- `/app/music/page.tsx` - Music page with embedded content
- `/app/contact/page.tsx` - Contact form page structure
- `components/home/HeroSection.tsx` - Server wrapper for hero (fetches config)

**Why Server Components here?**
- No interactive state needed at the top level
- Data fetching can happen server-side
- SEO benefits from fully rendered HTML
- Smaller JavaScript bundles sent to client

**Client Components (Explicit)**:
- `BlogClient.tsx` - Blog filtering and tag selection
- `ManagePostsClient.tsx` - Admin post management with local state
- `AuthProvider.tsx` - Authentication context for admin panel
- `components/home/HeroClient.tsx` - Hero animations and mouse interactions
- Form components - Input handling and validation
- UI components with interactions (accordions, modals, filters)

**Why Client Components here?**
- Require React hooks (useState, useEffect, useContext)
- Need event handlers for user interactions
- Manage local UI state (filters, form inputs, modals)
- Subscribe to real-time updates (auth state changes)
- Handle browser-specific features (mouse tracking, animations)

### File-Based Routing Structure

```
app/
├── layout.tsx              # Root layout (Header, Footer, fonts)
├── page.tsx                # Homepage (/)
├── globals.css             # Global styles
│
├── blog/
│   ├── page.tsx           # Blog listing (/blog) - Server Component
│   ├── BlogClient.tsx     # Client component for filtering
│   ├── [slug]/
│   │   └── page.tsx       # Individual post (/blog/[slug])
│   └── components/        # Blog-specific components
│
├── music/
│   └── page.tsx           # Music page (/music)
│
├── contact/
│   └── page.tsx           # Contact form (/contact)
│
├── admin/
│   ├── layout.tsx         # Admin-specific layout (navigation, auth check)
│   ├── page.tsx           # Admin dashboard (/admin)
│   ├── login/
│   │   └── page.tsx       # Login page (/admin/login)
│   ├── posts/
│   │   ├── page.tsx       # Manage posts (/admin/posts)
│   │   ├── new/
│   │   │   └── page.tsx   # Create post (/admin/posts/new)
│   │   └── [id]/
│   │       └── page.tsx   # Edit post (/admin/posts/[id])
│   └── config/
│       └── page.tsx       # Site config (/admin/config)
│
└── api/
    ├── contact/
    │   └── route.ts       # POST /api/contact - Send email
    └── generate-post/
        └── route.ts       # POST /api/generate-post - AI generation
```

### Layout and Template Usage

**Root Layout** (`/app/layout.tsx`):
```typescript
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
```

**Why this structure?**
- Header and Footer persist across all pages (no re-render on navigation)
- Flexbox ensures footer stays at bottom
- Font loading happens once at root level

**Admin Layout** (`/app/admin/layout.tsx`):
```typescript
'use client';

export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  );
}
```

**Why Client Component?**
- Needs AuthProvider context
- Contains interactive navigation and sign-out functionality
- Conditionally renders based on authentication state

---

## Supabase Integration

### Database Schema

The database uses three primary tables defined in `/supabase/migrations/001_initial_schema.sql`:

**1. Posts Table**
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  author_id UUID REFERENCES auth.users(id),
  tags TEXT[] DEFAULT '{}',
  featured_image_url TEXT,
  meta_description TEXT
);
```

**Key Design Decisions**:
- `slug` is unique and validated with CHECK constraints (lowercase, hyphen-separated)
- `published_at` is automatically set by trigger when `published` changes to true
- `tags` stored as PostgreSQL array for efficient filtering
- `updated_at` automatically updated by trigger

**2. Site Config Table**
```sql
CREATE TABLE site_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  category TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Why this design?**
- Key-value store for flexible configuration
- Categories (e.g., 'music_social', 'engineering_social') for logical grouping
- All values stored as text (parsed as needed)
- Enables runtime configuration changes without code deploys

**Key Configuration Fields** (as of October 2025):

**1. General Settings** (top priority):
- `profile_image_url`: Profile/avatar image
- `hero_image_url`: Hero section background image (dynamic, fetched server-side)
- `contact_email`: General contact email
- `booking_email`: Music booking inquiries

**2. Streaming Music Platforms**:
- `spotify_url`: Spotify artist/album profile
- `apple_music_url`: Apple Music artist profile
- `itunes_url`: iTunes store link
- `youtube_music_url`: YouTube Music artist channel

**3. Social Media**:
- `instagram_music`: Instagram handle for music content
- `facebook_music`: Facebook page for music
- `tiktok_music`: TikTok profile (future)
- `twitter_url`: Twitter/X profile
- `patreon_url`: Patreon support page

**4. Professional Links**:
- `linkedin_url`: LinkedIn profile
- `github_url`: GitHub profile

**5. Featured Videos**:
- `youtube_video_1` through `youtube_video_4`: YouTube video IDs
- `youtube_video_1_title` through `youtube_video_4_title`: Video titles

**Admin Config Organization** (October 2025):
The admin site config interface is organized into these logical sections with clear visual separation. This structure:
- Improves discoverability of configuration options
- Groups related settings together
- Provides clear mental model for admins
- Scales well as new config options are added
- See `docs/DESIGN_DECISIONS.md` for detailed rationale

**Recent Additions** (October 2025):
- `hero_image_url`: Dynamic hero section background image, fetched server-side and passed to client component
- YouTube video title fields: Enables custom titles for featured videos instead of relying on YouTube API
- Streaming platform reorganization: Separated streaming (Spotify, Apple Music, etc.) from social media for clarity
- Featured Videos Quick Add: Admin can paste YouTube URL to auto-extract ID and fetch title

**3. Media Table**
```sql
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  url TEXT NOT NULL,
  mime_type TEXT,
  size_bytes INTEGER,
  alt_text TEXT,
  caption TEXT,
  uploaded_by UUID REFERENCES auth.users(id)
);
```

**Purpose**:
- Track uploaded files in Supabase Storage
- Store metadata for SEO (alt_text)
- Enable media library functionality for future enhancements

### Row-Level Security (RLS) Approach

**Philosophy**: Database-level security, not application-level

All tables have RLS enabled with specific policies:

**Public Access**:
```sql
-- Anyone can view published posts
CREATE POLICY "Public can view published posts"
  ON posts FOR SELECT TO public
  USING (published = true);

-- Anyone can view site config
CREATE POLICY "Public can view site config"
  ON site_config FOR SELECT TO public
  USING (true);
```

**Authenticated Access**:
```sql
-- Authenticated users can do everything with posts
CREATE POLICY "Authenticated users can view all posts"
  ON posts FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT TO authenticated
  WITH CHECK (true);
```

**Why RLS?**
- Security enforced at database level, not application code
- Works even if application layer is bypassed
- Supabase client automatically respects RLS based on auth context
- Future API clients automatically get same security

### Client Patterns

The application uses **three distinct Supabase clients** for different contexts:

#### 1. Browser Client (`/lib/supabase/client.ts`)

```typescript
import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
```

**When to use**:
- Client Components that need to query data
- Public data fetching in the browser
- Real-time subscriptions

**Security Context**:
- Uses anonymous key (safe to expose)
- Subject to RLS policies
- Can only see published posts (as public user)

**Example Usage**:
```typescript
// In queries.ts - used by Client Components
export async function getPublishedPosts() {
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false });

  return data as Post[];
}
```

#### 2. Server Client (`/lib/supabase/server.ts`)

```typescript
import { createClient } from '@supabase/supabase-js';

export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
```

**When to use**:
- Server Components
- API Routes
- Server Actions
- Admin operations

**Security Context**:
- Uses service role key (bypasses RLS)
- Full database access
- Never exposed to client

**Example Usage**:
```typescript
// In admin.ts - Server Actions
'use server';

export async function getAllPosts() {
  const supabase = createServerClient();

  const { data } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  return data as Post[];
}
```

#### 3. Middleware Client (`/lib/supabase/middleware.ts`)

```typescript
import { createServerClient } from '@supabase/ssr';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          // Update cookies in request and response
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protect routes based on user state
  if (pathname.startsWith('/admin') && !user) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return supabaseResponse;
}
```

**When to use**:
- Edge Middleware only
- Authentication checks before page renders
- Session cookie management

**Why special client?**
- Runs at edge (before page render)
- Manages cookies across request/response boundary
- Must use SSR cookie helpers from `@supabase/ssr`

### Query Organization

**`/lib/supabase/queries.ts`** - Public queries (browser client)
- `getPublishedPosts()` - Get published posts with optional filters
- `getPostBySlug()` - Get single post by slug
- `getSiteConfig()` - Get site configuration
- `getAllTags()` - Get all unique tags from published posts
- `searchPosts()` - Full-text search

**Why separate file?**
- Used by both Server and Client Components
- Uses anonymous key (safe for browser)
- Respects RLS (only sees published content)

**`/lib/supabase/admin.ts`** - Admin operations (server client)
- `getAllPosts()` - Get all posts (including drafts)
- `createPost()` - Create new post
- `updatePost()` - Update existing post
- `deletePost()` - Delete post
- `togglePostPublished()` - Publish/unpublish post
- All site config CRUD operations
- All media CRUD operations

**Why separate file?**
- Marked with `'use server'` directive
- Only runs on server
- Uses service role key (bypasses RLS)
- Includes `revalidatePath()` calls to clear cache

**Example of Cache Revalidation**:
```typescript
'use server';

export async function createPost(postData: Omit<Post, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createServerClient();

  const { data } = await supabase
    .from('posts')
    .insert([postData])
    .select()
    .single();

  // Tell Next.js to regenerate the /admin/posts page
  revalidatePath('/admin/posts');

  return data as Post;
}
```

---

## Authentication Architecture

### Supabase Auth Flow

**1. Email/Password Authentication**

```typescript
// User submits login form
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});
```

**What happens?**
1. Supabase validates credentials
2. Returns JWT access token + refresh token
3. Tokens stored in HTTP-only cookies
4. User session established

**2. Session Management**

Sessions are managed in three places:

**A. Middleware** (`/middleware.ts`):
```typescript
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

// In lib/supabase/middleware.ts
export async function updateSession(request: NextRequest) {
  const supabase = createServerClient(..., {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(cookiesToSet) { /* Update cookies */ },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  // Protect /admin routes
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return supabaseResponse;
}
```

**Why in middleware?**
- Runs at edge (before page renders)
- Checks auth before expensive page generation
- Protects routes at infrastructure level
- Refreshes session tokens automatically

**B. Client-Side Hook** (`/lib/hooks/useAuth.ts`):
```typescript
'use client';

export function useAuth() {
  const [authState, setAuthState] = useState({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setAuthState({ user, loading: false, error: null });
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAuthState({ user: session?.user ?? null, loading: false, error: null });
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading, error, signIn, signOut };
}
```

**Why this hook?**
- Provides reactive auth state to Client Components
- Automatically updates when user signs in/out
- Handles loading and error states
- Encapsulates auth logic

**C. Auth Provider** (`/components/providers/AuthProvider.tsx`):
```typescript
'use client';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }) {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
```

**Why Context?**
- Share auth state across admin components
- Avoid prop drilling
- Single source of truth for auth state in admin panel

### Public vs. Authenticated Routes

**Public Routes**:
- `/` - Homepage
- `/blog` - Blog listing
- `/blog/[slug]` - Blog posts
- `/music` - Music page
- `/contact` - Contact form

**Protected Routes** (require authentication):
- `/admin` - Admin dashboard
- `/admin/posts` - Manage posts
- `/admin/posts/new` - Create post
- `/admin/posts/[id]` - Edit post
- `/admin/config` - Site configuration

**Protection Layers**:

1. **Edge Middleware**: First line of defense
   - Redirects unauthenticated users to `/admin/login`
   - Prevents page render for unauthorized users

2. **Admin Layout**: Second layer
   - Wraps all admin routes in `AuthProvider`
   - Shows loading state while checking auth
   - Client-side enforcement

3. **Server Actions**: Third layer
   - Use service role key (not reliant on user auth)
   - Additional checks could be added for extra security

**Login Flow**:
```
1. User visits /admin/posts
   ↓
2. Middleware runs: No user found
   ↓
3. Redirect to /admin/login
   ↓
4. User enters credentials
   ↓
5. useAuth.signIn() called
   ↓
6. Supabase validates and returns session
   ↓
7. Cookies updated with session tokens
   ↓
8. User state updates via onAuthStateChange
   ↓
9. Redirect to /admin
   ↓
10. Middleware runs: User found
   ↓
11. Admin dashboard renders
```

**Logout Flow**:
```
1. User clicks "Sign Out"
   ↓
2. useAuth.signOut() called
   ↓
3. Supabase clears session
   ↓
4. Cookies cleared
   ↓
5. User state set to null
   ↓
6. Redirect to /admin/login
   ↓
7. Middleware runs: No user found
   ↓
8. Login page renders
```

---

## State Management

### Why No Global State Management Library?

This application **intentionally avoids** state management libraries like Redux, Zustand, or Jotai.

**Reasons**:

1. **Server Components render fresh data**: Most pages are Server Components that fetch directly from database
2. **No complex client-side state**: Limited interactive state (filters, forms)
3. **URL as state**: Routing handles navigation state
4. **Database as source of truth**: Mutations go straight to database, then revalidate
5. **Simpler mental model**: No action creators, reducers, selectors

### State Categories

#### 1. Server State (Database)

**What it is**: Data persisted in Supabase (posts, config, media)

**How it's managed**:
- Server Components fetch directly: `const posts = await getPublishedPosts()`
- Client Components fetch via Server Actions or API routes
- Mutations use Server Actions with `revalidatePath()`

**Example**:
```typescript
// Server Component - fetches fresh data on every request
export default async function BlogPage() {
  const posts = await getPublishedPosts(); // Direct database query
  const tags = await getAllTags();

  return <BlogClient initialPosts={posts} allTags={tags} />;
}

// Server Action - updates database and revalidates
'use server';

export async function deletePost(id: string) {
  const supabase = createServerClient();
  await supabase.from('posts').delete().eq('id', id);

  revalidatePath('/admin/posts'); // Clear cached page

  return true;
}
```

**Benefits**:
- Always shows latest data
- No stale cache issues
- No need to sync client state with server

#### 2. Local Component State

**What it is**: Transient UI state (form inputs, filters, modals)

**How it's managed**: React `useState` within Client Components

**Example**:
```typescript
'use client';

export default function BlogClient({ initialPosts, allTags }) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter posts by selected tag (derived state)
  const posts = selectedTag
    ? initialPosts.filter(post => post.tags?.includes(selectedTag))
    : initialPosts;

  return (
    <div>
      <TagFilter tags={allTags} selectedTag={selectedTag} onTagChange={setSelectedTag} />
      {posts.map(post => <PostCard key={post.id} post={post} />)}
    </div>
  );
}
```

**Why local state?**
- Only needed by this component
- Doesn't need to persist
- No sharing across routes

#### 3. URL State

**What it is**: Navigation and routing state

**How it's managed**: Next.js router + dynamic routes

**Example**:
```typescript
// Dynamic route: /blog/[slug]/page.tsx
export default async function BlogPostPage({ params }) {
  const post = await getPostBySlug(params.slug);
  return <article>{/* render post */}</article>;
}

// Programmatic navigation in Client Component
'use client';

export default function PostList({ posts }) {
  const router = useRouter();

  const handleEdit = (id: string) => {
    router.push(`/admin/posts/${id}`);
  };

  // ...
}
```

**Why URL state?**
- Shareable links
- Browser back/forward works
- SEO-friendly
- No need to persist in app state

#### 4. Auth State

**What it is**: Current user session

**How it's managed**:
- Middleware (server-side)
- `useAuth` hook + React Context (client-side)

**Example**:
```typescript
'use client';

export function AdminHeader() {
  const { user, signOut } = useAuthContext();

  return (
    <header>
      <span>{user?.email}</span>
      <button onClick={signOut}>Sign Out</button>
    </header>
  );
}
```

**Why Context for auth?**
- Needed by multiple admin components
- Changes infrequently
- Represents global session state

### Custom Hooks

#### `useAuth` (`/lib/hooks/useAuth.ts`)

**Purpose**: Manage authentication state and operations

**Features**:
- Fetches current user on mount
- Subscribes to auth state changes
- Provides `signIn` and `signOut` methods
- Handles loading and error states

**When to use**: Any Client Component that needs auth info

#### `useFormSubmit` (`/lib/hooks/useFormSubmit.ts`)

**Purpose**: Standardize form submission handling

**Features**:
```typescript
const { handleSubmit, isLoading, error, success } = useFormSubmit({
  onSuccess: () => console.log('Saved!'),
  successDuration: 3000,
});

await handleSubmit(async () => {
  await createPost(formData);
});
```

**What it provides**:
- Loading state during submission
- Error handling and display
- Success state with auto-reset
- Optional success callback

**Benefits**:
- DRY principle for forms
- Consistent UX across forms
- Error handling in one place

---

## API Routes & Server Actions

### API Route: Contact Form

**Location**: `/app/api/contact/route.ts`

**Method**: POST

**Purpose**: Send contact form submissions via email using Resend

**Flow**:
```typescript
export async function POST(request: Request) {
  const { name, email, subject, category, message } = await request.json();

  // Get contact email from site config
  const config = await getSiteConfig('general');
  const contactEmail = config.find(c => c.key === 'contact_email')?.value;

  // Send email via Resend
  await resend.emails.send({
    from: 'Contact Form <onboarding@resend.dev>',
    to: contactEmail,
    subject: `[${category}] ${subject}`,
    replyTo: email,
    html: `...`,
  });

  return NextResponse.json({ success: true });
}
```

**Why API Route?**
- Needs to call external service (Resend)
- POST endpoint for form submission
- Can't use Server Action (form is on public page)
- Need to return JSON response

### API Route: AI Post Generation

**Location**: `/app/api/generate-post/route.ts`

**Method**: POST

**Purpose**: Generate blog post drafts using Claude AI

**Flow**:
```typescript
export async function POST(request: NextRequest) {
  const { prompt } = await request.json();

  // Call Claude API
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [{
      role: 'user',
      content: `You are a technical writer. Generate a blog post about: ${prompt}...`,
    }],
  });

  // Parse Claude's response
  const generatedPost = JSON.parse(responseText);

  // Generate slug from title
  const slug = generateSlug(generatedPost.title);

  return NextResponse.json({
    title: generatedPost.title,
    slug,
    excerpt: generatedPost.excerpt,
    content: generatedPost.content,
    tags: generatedPost.tags,
  });
}
```

**Why API Route?**
- Integrates with external AI service
- Long-running operation (streaming could be added)
- Returns structured data
- Called from Client Component form

### Server Actions vs. API Routes

**Server Actions** (`'use server'` functions in `/lib/supabase/admin.ts`):

**When to use**:
- Database mutations (create, update, delete)
- Operations that need to revalidate pages
- Admin operations

**Example**:
```typescript
'use server';

export async function createPost(postData: CreatePostData) {
  const supabase = createServerClient();

  const { data } = await supabase.from('posts').insert([postData]).select().single();

  revalidatePath('/admin/posts'); // Clear cache

  return data as Post;
}
```

**Benefits**:
- Type-safe (TypeScript end-to-end)
- Direct database access
- Built-in with Next.js
- Can call `revalidatePath()` / `revalidateTag()`

**API Routes** (`/app/api/*/route.ts`):

**When to use**:
- External service integrations (Resend, Anthropic)
- Webhooks from third-party services
- Custom response formats
- Rate limiting or complex middleware

**Example**:
```typescript
export async function POST(request: Request) {
  const data = await request.json();
  const result = await externalService.doSomething(data);
  return NextResponse.json({ result });
}
```

**Benefits**:
- Full control over request/response
- Can set custom headers
- Standard HTTP semantics
- Can be called from anywhere (not just Next.js)

---

## Performance Considerations

### Static Generation Strategy

**Force Dynamic Routes**:
```typescript
// /app/blog/page.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BlogPage() {
  const posts = await getPublishedPosts(); // Fresh data every request
  return <BlogClient initialPosts={posts} />;
}
```

**Why force dynamic?**
- Blog posts change frequently
- Want to show latest content immediately
- Admin can publish and see changes right away

**When we DO use static generation**:
- Homepage components (mostly static content)
- Music page (embedded content rarely changes)
- Contact page (static form structure)

**Future optimization**: Implement ISR (Incremental Static Regeneration) with `revalidate: 60` to cache for 60 seconds

### Server Components Benefits

**1. Zero JavaScript for Static Content**

```typescript
// This entire component renders to HTML, no JS shipped
export default function HeroSection() {
  return (
    <section>
      <h1>Welcome</h1>
      <p>Static content here</p>
    </section>
  );
}
```

**Result**: ~0 KB JavaScript for hero section

**2. Direct Database Access**

```typescript
// No API route needed, direct DB query
export default async function BlogPage() {
  const posts = await getPublishedPosts(); // Runs on server
  return <BlogClient initialPosts={posts} />;
}
```

**Benefits**:
- No round-trip to API
- Reduced latency
- Less code duplication

**3. Waterfall Prevention**

**Bad (Client Components)**:
```typescript
function BadBlogPage() {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    // Waterfall: posts then tags
    fetch('/api/posts').then(res => {
      setPosts(res.data);
      fetch('/api/tags').then(res => setTags(res.data));
    });
  }, []);
}
```

**Good (Server Components)**:
```typescript
export default async function BlogPage() {
  // Parallel fetching
  const [posts, tags] = await Promise.all([
    getPublishedPosts(),
    getAllTags(),
  ]);

  return <BlogClient initialPosts={posts} allTags={tags} />;
}
```

### Code Splitting

**Automatic Splitting**:
- Next.js automatically splits Client Components
- Each `'use client'` boundary creates a split point

**Example**:
```typescript
// /app/admin/posts/page.tsx (Server Component)
import ManagePostsClient from './ManagePostsClient'; // Lazy loaded

export default async function ManagePostsPage() {
  const posts = await getAllPosts();
  return <ManagePostsClient initialPosts={posts} />;
}
```

**Result**:
- `ManagePostsClient` only loaded on `/admin/posts` route
- Not included in homepage bundle
- Smaller initial load

**Dynamic Imports** (when needed):
```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Spinner />,
  ssr: false, // Don't render on server
});
```

### Image Optimization

**Next.js Image Component**:
```typescript
import Image from 'next/image';

<Image
  src={post.featured_image_url}
  alt={post.title}
  width={800}
  height={400}
  quality={90}
  placeholder="blur"
  blurDataURL="data:image/..."
/>
```

**Optimizations**:
- Automatic WebP/AVIF format
- Responsive image sizes
- Lazy loading by default
- Blur placeholder during load

**Remote Patterns** (`next.config.js`):
```javascript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'images.unsplash.com' },
    { protocol: 'https', hostname: '*.supabase.co' },
  ],
}
```

**Why whitelist?**
- Security: Only allow known image sources
- Performance: Prevent abuse of image optimization

### Database Query Optimization

**1. Indexes** (from schema):
```sql
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_published ON posts(published);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);
```

**Impact**:
- Fast slug lookups for individual posts
- Fast filtering by published status
- Fast ordering by publish date
- Fast tag filtering with GIN index

**2. Selective Queries**:
```typescript
// Good: Only select needed columns
const { data } = await supabase
  .from('posts')
  .select('id, title, slug, excerpt, tags, published_at')
  .eq('published', true);

// Avoid: SELECT * unless you need all columns
```

**3. Pagination** (ready for future):
```typescript
export async function getPublishedPosts(options?: {
  limit?: number;
  offset?: number;
}) {
  let query = supabase.from('posts').select('*').eq('published', true);

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(
      options.offset,
      options.offset + (options.limit || 10) - 1
    );
  }

  return query;
}
```

---

## Component Architecture

### Organization Strategy

```
components/
├── admin/          # Admin-specific components
│   ├── PostList.tsx
│   ├── PostForm.tsx
│   └── SiteConfigForm.tsx
│
├── blog/           # Blog-specific components
│   ├── PostCard.tsx
│   ├── TagFilter.tsx
│   └── PostContent.tsx
│
├── contact/        # Contact form components
│   └── ContactForm.tsx
│
├── home/           # Homepage sections
│   ├── HeroSection.tsx
│   ├── AboutSection.tsx
│   ├── FeaturedBlog.tsx
│   └── NavigationSection.tsx
│
├── layout/         # Shared layout components
│   ├── Header.tsx
│   ├── HeaderNav.tsx
│   ├── Footer.tsx
│   └── PlayerBar.tsx  # Mini-player wrapper
│
├── music/          # Music page components
│   ├── YouTubePlayerContainer.tsx  # Persistent player container
│   ├── YouTubePlayerFull.tsx       # Full player for /music page
│   ├── YouTubePlayerMini.tsx       # Mini player for header
│   ├── StreamingLinks.tsx          # Multi-platform links
│   └── hooks/
│       └── useYouTubePlayer.ts     # Player state hook
│
├── providers/      # Context providers
│   └── AuthProvider.tsx
│
└── ui/             # Reusable UI components
    ├── Card.tsx
    ├── FormField.tsx
    ├── Alert.tsx
    └── icons/      # Icon components
        ├── CheckCircleIcon.tsx
        ├── ArrowRightIcon.tsx
        ├── PlayIcon.tsx
        ├── PauseIcon.tsx
        ├── VolumeIcon.tsx
        ├── ExpandIcon.tsx
        └── ...
```

**Principles**:
1. **Feature-based folders**: Components grouped by feature (blog, admin, music)
2. **Shared UI components**: Generic, reusable components in `/ui`
3. **Colocation**: Components close to where they're used
4. **Single responsibility**: Each component has one clear purpose

### Component Patterns

**1. Server Component (default)**:
```typescript
// No directive needed, Server Component by default
export default function PostCard({ post }: { post: Post }) {
  return (
    <article>
      <h2>{post.title}</h2>
      <p>{post.excerpt}</p>
    </article>
  );
}
```

**2. Client Component**:
```typescript
'use client';

export default function TagFilter({ tags, selectedTag, onTagChange }) {
  return (
    <div>
      {tags.map(tag => (
        <button
          key={tag}
          onClick={() => onTagChange(tag)}
          className={selectedTag === tag ? 'active' : ''}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
```

**3. Hybrid Pattern (Server wraps Client)**:
```typescript
// Server Component
export default async function BlogPage() {
  const posts = await getPublishedPosts(); // Server-side fetch

  return <BlogClient initialPosts={posts} />; // Pass to Client Component
}

// Client Component
'use client';

export default function BlogClient({ initialPosts }) {
  const [selectedTag, setSelectedTag] = useState(null);

  const posts = selectedTag
    ? initialPosts.filter(p => p.tags.includes(selectedTag))
    : initialPosts;

  return (
    <div>
      <TagFilter onTagChange={setSelectedTag} />
      {posts.map(post => <PostCard key={post.id} post={post} />)}
    </div>
  );
}
```

**Why this pattern?**
- Server Component fetches data (can't be done in Client Component)
- Client Component handles interactivity (can't be done in Server Component)
- Best of both worlds

**4. Hero Section Pattern (Server/Client Split with Dynamic Config)**:

This pattern was introduced in October 2025 to optimize the hero section with dynamic configuration.

```typescript
// components/home/HeroSection.tsx - Server Component
import { getSiteConfig } from '@/lib/supabase/queries';
import HeroClient from './HeroClient';

export default async function HeroSection() {
  const siteConfig = await getSiteConfig();
  const heroImageUrl = siteConfig.find(c => c.key === 'hero_image_url')?.value;

  return <HeroClient heroImageUrl={heroImageUrl} />;
}

// components/home/HeroClient.tsx - Client Component
'use client';

import { useEffect, useState } from 'react';

interface HeroClientProps {
  heroImageUrl?: string;
}

export default function HeroClient({ heroImageUrl }: HeroClientProps) {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

  // Handle animations, mouse tracking, etc.
  return (
    <div onMouseMove={handleMouseMove}>
      {/* Interactive hero content */}
    </div>
  );
}
```

**Why this pattern?**
- **Server-side config fetching**: Hero image URL retrieved from database at build/request time
- **Client-side interactivity**: Mouse tracking, animations, fade-ins handled in browser
- **Zero client JavaScript for data**: Configuration data is fetched once on server
- **Dynamic updates**: Changing hero image in admin panel reflects immediately
- **Performance optimized**: Heavy animations only load after component mounts

**Benefits of this approach**:
1. Reduces client bundle size (no data fetching code in browser)
2. Enables server-side caching of configuration
3. Maintains interactive user experience
4. Separates concerns: data fetching vs. presentation
5. Easy to test each layer independently

### Testing Strategy

**Unit Tests** (with Jest + React Testing Library):

```typescript
// components/home/__tests__/HeroSection.test.tsx
import { render, screen } from '@testing-library/react';
import HeroSection from '../HeroSection';

describe('HeroSection', () => {
  it('renders the hero title', () => {
    render(<HeroSection />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});
```

**What we test**:
- Component rendering
- User interactions (clicks, form submissions)
- Conditional rendering
- Accessibility

**What we don't test**:
- Server Actions (integration tests would be better)
- Database queries (covered by Supabase)

---

## Type Safety & Data Flow

### Type Definitions

**Location**: `/lib/types/index.ts`

**Database Types** (match schema):
```typescript
export interface Post {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  published: boolean;
  published_at: string | null;
  author_id: string;
  tags: string[];
  featured_image_url: string | null;
  meta_description: string | null;
}
```

**Form Types** (for mutations):
```typescript
export type CreatePostData = Omit<Post, 'id' | 'created_at' | 'updated_at'>;
export type UpdatePostData = Partial<Omit<Post, 'id' | 'created_at' | 'updated_at'>>;
```

**Why separate types?**
- `CreatePostData`: New posts don't have id/timestamps (generated by DB)
- `UpdatePostData`: Partial allows updating individual fields

### Type Flow

```
Database Schema (SQL)
    ↓
TypeScript Interfaces (/lib/types/index.ts)
    ↓
Server Actions (/lib/supabase/admin.ts)
    ↓
Server Components (/app/**/page.tsx)
    ↓
Client Components (props with types)
    ↓
UI Components (strongly typed props)
```

**Example**:
```typescript
// 1. Type definition
interface Post { id: string; title: string; /* ... */ }

// 2. Server Action (returns typed data)
export async function getPostById(id: string): Promise<Post> {
  const supabase = createServerClient();
  const { data } = await supabase.from('posts').select('*').eq('id', id).single();
  return data as Post;
}

// 3. Server Component (typed async function)
export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post: Post = await getPostById(params.id);
  return <EditPostClient post={post} />;
}

// 4. Client Component (typed props)
export default function EditPostClient({ post }: { post: Post }) {
  return <PostForm initialData={post} />;
}

// 5. Form Component (typed props)
export default function PostForm({ initialData }: { initialData: Post }) {
  const [title, setTitle] = useState<string>(initialData.title);
  // TypeScript ensures title is string
}
```

**Benefits**:
- Catch errors at compile time
- IntelliSense in editor
- Refactoring confidence
- Self-documenting code

---

## YouTube Player Architecture

**Last Updated:** October 11, 2025

### Overview

The YouTube player system provides continuous music playback across all pages with a video-first architecture. Video is displayed on the `/music` page while audio continues playing on all other pages. The system never unmounts or reinitializes the YouTube iframe, ensuring seamless playback during navigation.

### Core Architectural Principles

1. **Single Persistent Container**: The YouTube iframe container (`#youtube-player-container`) lives in the root layout and never unmounts during normal navigation
2. **CSS-Only Positioning**: Video is shown/hidden using CSS positioning, never conditional rendering
3. **Video-First**: All tracks are treated as video content (no audio/video distinction)
4. **Dynamic Overlay**: On `/music` page, the container is positioned over the display area using `getBoundingClientRect()`
5. **Never Move the Iframe**: The iframe is never moved in the DOM; positioning is handled purely through CSS

### Component Hierarchy

```
app/layout.tsx
├── YouTubePlayerProvider (Context)
│   └── Creates player outside React DOM
├── Header
├── PlayerBar
│   └── YouTubePlayerMini
└── page content
    └── YouTubePlayerFull (on /music page only)
        └── Positions global container via CSS

#youtube-player-container (created via document.createElement)
└── YouTube IFrame (injected by YouTube API)
```

### Key Components

#### 1. YouTubePlayerContext (`lib/contexts/YouTubePlayerContext.tsx`)

**Purpose**: Global state management for the YouTube player

**Critical Implementation Detail - Player Container Outside React**:

```typescript
// The player container is created OUTSIDE React's DOM control
// This prevents React hydration errors with YouTube's iframe manipulation

useEffect(() => {
  // Create container using vanilla DOM APIs
  const playerContainer = document.createElement('div');
  playerContainer.id = 'youtube-player-container';
  playerContainer.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;';
  document.body.appendChild(playerContainer);

  // Initialize YouTube player
  const player = new YT.Player('youtube-player-container', {
    videoId: DEFAULT_VIDEO_ID,
    playerVars: { /* ... */ },
    events: {
      onReady: handleReady,
      onStateChange: handleStateChange,
      onError: handleError,
    },
  });

  // Cleanup
  return () => {
    player.destroy();
    playerContainer.remove();
  };
}, []);
```

**Why This Approach?**
- YouTube IFrame API directly manipulates the DOM by injecting iframes
- If the container is managed by React, this causes hydration errors during SSR
- Creating the container outside React's virtual DOM prevents reconciliation conflicts
- This is the industry-standard pattern for integrating DOM-manipulating third-party libraries

**State Managed**:
- Current video/track information
- Playback state (playing, paused, buffering)
- Volume and current time
- Playlist and current track index
- First-visit flag and user preferences

**Critical Fix - Callback Dependencies**:

Previously, the player would reinitialize on every track change due to callback dependencies:

```typescript
// BEFORE (caused reinitialization):
const handleError = useCallback((event: YTPlayerEvent) => {
  // Depended on playerState.videoId
  if (retryCountRef.current < 3) {
    playerRef.current.loadVideoById(playerState.videoId); // ❌ Dependency
  }
}, [playerState.videoId]); // ❌ Changes on every track

// AFTER (stable callback):
const currentVideoIdRef = useRef<string>(DEFAULT_VIDEO_ID);

const handleError = useCallback((event: YTPlayerEvent) => {
  // Uses ref instead of state
  if (retryCountRef.current < 3) {
    playerRef.current.loadVideoById(currentVideoIdRef.current); // ✅ Ref
  }
}, []); // ✅ Empty deps - never recreates
```

**Why This Fix Works**:
1. `handleError` depends on `playerState.videoId` → callback recreates on videoId change
2. `initializePlayer` depends on `handleError` → recreates when callback changes
3. `useEffect` watches `initializePlayer` → triggers on recreation
4. Player reinitializes unnecessarily

Using `currentVideoIdRef.current` breaks this dependency chain without losing access to the current video ID.

**Methods Provided**:
- `play()`, `pause()`, `setVolume()`, `seekTo()`
- `loadTrack(track: Song)` - Load and display track metadata
- `next()`, `previous()` - Playlist navigation
- `setPlaylist(tracks: Song[])` - Initialize playlist
- `jumpToTrack(index: number)` - Jump to specific track

#### 2. YouTubePlayerContainer (`components/music/YouTubePlayerContainer.tsx`)

**Purpose**: Provides the stable DOM container where YouTube IFrame API initializes the player

**Implementation**:
```typescript
export default function YouTubePlayerContainer() {
  return (
    <div
      id="youtube-player-container"
      className="fixed left-[-9999px] top-0 w-[640px] h-[360px] pointer-events-none"
      aria-hidden="true"
    />
  );
}
```

**Note**: As of the latest refactor, this container is no longer rendered by React. It's created directly in the DOM by `YouTubePlayerContext` using `document.createElement()`. This component file may be deprecated.

**Key Points**:
- Never conditionally rendered (always in DOM)
- Positioning controlled dynamically by `YouTubePlayerFull` component
- Hidden off-screen when not on `/music` page (`left: -9999px`)
- Overlays video display area when on `/music` page
- `pointer-events-none` by default, enabled when visible

#### 3. YouTubePlayerFull (`components/music/YouTubePlayerFull.tsx`)

**Purpose**: Main player UI on `/music` page. Controls the positioning of the global container.

**Critical Implementation - Dynamic Positioning**:

```typescript
const videoContainerRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const playerContainer = document.getElementById('youtube-player-container');

  if (!playerContainer || !videoContainerRef.current) return;

  let rafId: number | null = null;

  // Position the container to overlay the video display area
  const updatePosition = () => {
    if (!videoContainerRef.current) return;

    const rect = videoContainerRef.current.getBoundingClientRect();

    // Round values to prevent sub-pixel rendering issues
    const left = Math.round(rect.left);
    const top = Math.round(rect.top);
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);

    playerContainer.style.position = 'fixed';
    playerContainer.style.left = `${left}px`;
    playerContainer.style.top = `${top}px`;
    playerContainer.style.width = `${width}px`;
    playerContainer.style.height = `${height}px`;
    playerContainer.style.pointerEvents = 'auto';
    playerContainer.style.zIndex = '10';
  };

  // Use requestAnimationFrame for smooth scroll tracking
  const handleScroll = () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(updatePosition);
  };

  updatePosition();

  window.addEventListener('resize', updatePosition);
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Cleanup: hide container when leaving /music page
  return () => {
    if (rafId) cancelAnimationFrame(rafId);
    window.removeEventListener('resize', updatePosition);
    window.removeEventListener('scroll', handleScroll);

    playerContainer.style.left = '-9999px';
    playerContainer.style.pointerEvents = 'none';
  };
}, []);
```

**Why This Approach**:

1. **getBoundingClientRect()** gives exact pixel coordinates relative to viewport
2. **Math.round()** prevents sub-pixel rendering artifacts
3. **requestAnimationFrame** batches updates for smooth 60fps scrolling
4. **Fixed positioning** allows overlay without DOM manipulation
5. **Cleanup function** hides container when component unmounts (navigation away)

**Technical Decisions**:

| Decision | Rationale |
|----------|-----------|
| **Never move iframe with appendChild()** | YouTube API's internal event handlers break, causing cross-origin errors |
| **requestAnimationFrame for scroll** | Prevents jitter, handles rapid scroll changes smoothly |
| **Fixed positioning vs absolute** | Fixed is always relative to viewport, matching getBoundingClientRect coordinates |
| **Round pixel values** | Prevents sub-pixel rendering issues and unnecessary layout recalculations |

#### 4. YouTubePlayerMini (`components/music/YouTubePlayerMini.tsx`)

**Purpose**: Persistent mini-player in header area across all pages

**Features**:
- Album cover thumbnail display
- Play/pause button
- Volume control slider
- Progress bar
- Next/previous buttons for playlist navigation
- Expand button to navigate to `/music` page

**Enhancements** (October 2025):
- Added `next()` and `previous()` buttons using context methods
- Removed video badge display (no longer needed with video-first architecture)
- Enhanced with expand button for better navigation UX

#### 5. PlayerBar (`components/layout/PlayerBar.tsx`)

**Purpose**: Wrapper component for the mini-player

**Implementation**:
```typescript
'use client';

export default function PlayerBar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="border-b border-gray-800">
      <div className="container mx-auto px-4">
        <YouTubePlayerMini />
      </div>
    </div>
  );
}
```

**Why Client Component with Mounted Check**:
- Prevents SSR/CSR mismatch
- Ensures player only renders in browser
- Uses same container styling as Header for alignment

### Data Flow

```
User Action (e.g., click play on /music page)
    ↓
YouTubePlayerFull calls context.play()
    ↓
YouTubePlayerContext updates state and calls playerRef.current.playVideo()
    ↓
YouTube IFrame API plays video
    ↓
YouTube API fires onStateChange event
    ↓
YouTubePlayerContext.handleStateChange updates state
    ↓
All components using useYouTubePlayer() hook receive updated state
    ↓
UI updates across all pages (mini-player shows playing state)
```

### User Flow Examples

#### Scenario 1: Playing Music While Browsing

1. User visits `/music` page
2. Selects a song from playlist
3. Video displays in full player with controls
4. User navigates to `/blog` page
5. `YouTubePlayerFull` cleanup function runs
6. Video container moves off-screen (`left: -9999px`)
7. Audio continues playing seamlessly (same YouTube player instance)
8. Mini-player in header shows current track info and controls
9. User clicks expand button in mini-player
10. Navigates back to `/music` page
11. `YouTubePlayerFull` mounts and repositions container
12. Video reappears in exact same playback position

#### Scenario 2: Using Mini-Player Controls

1. User on homepage, music playing (mini-player visible in header)
2. Clicks next button in mini-player
3. Context loads next track in playlist using `next()` method
4. YouTube player loads new video ID (hidden off-screen)
5. Mini-player updates to show new track info
6. User clicks previous button
7. Returns to previous track using `previous()` method
8. All without visiting `/music` page

### Performance Considerations

1. **Scroll Performance**:
   - Used `{ passive: true }` on scroll listener for better browser optimization
   - Prevents scroll blocking

2. **Memory Management**:
   - Properly cancels `requestAnimationFrame` calls on cleanup
   - Clears intervals when player pauses

3. **Reflow Prevention**:
   - Rounding coordinates prevents unnecessary layout recalculations
   - Fixed positioning avoids reflow triggers

4. **Overflow Clipping**:
   - Added `overflow-hidden` to prevent render layer issues

### Testing Checklist

When testing or modifying this system, verify:

- [ ] Video displays on `/music` page within container bounds
- [ ] Playback continues when navigating to other pages
- [ ] Audio continues playing on all pages
- [ ] Video reappears when returning to `/music` page
- [ ] No playback interruption during navigation
- [ ] Scroll tracking is smooth in both directions
- [ ] Resize handling works correctly
- [ ] Next/previous buttons work from mini-player
- [ ] Volume persists across navigation
- [ ] Progress bar shows correct position
- [ ] Loading states display properly
- [ ] No React hydration errors in console

### Database Schema

**Songs Table** (tracks stored in Supabase):

```sql
CREATE TABLE songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album_cover_url TEXT,
  youtube_video_id TEXT NOT NULL,
  content_type TEXT, -- 'video' (legacy field, ignored in frontend)
  duration_seconds INTEGER,
  tags TEXT[],
  release_date DATE,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  spotify_url TEXT,
  apple_music_url TEXT
);
```

**Key Notes**:
- `content_type` field still exists for backward compatibility but is ignored in the frontend
- All tracks are treated as video content in the new architecture
- Can be removed in a future database migration

### Files Modified in This Architecture

1. `/lib/contexts/YouTubePlayerContext.tsx` - Core state management and player initialization
2. `/components/music/YouTubePlayerContainer.tsx` - Persistent container (may be deprecated)
3. `/components/music/YouTubePlayerFull.tsx` - Full player UI and positioning logic
4. `/components/music/YouTubePlayerMini.tsx` - Mini player enhancements
5. `/components/layout/PlayerBar.tsx` - Layout wrapper with mounted check
6. `/app/layout.tsx` - Added `YouTubePlayerProvider` and `YouTubePlayerContainer`
7. `/components/ui/icons/*` - Added `PlayIcon`, `PauseIcon`, `VolumeIcon`, `ExpandIcon`

**Files Deleted**:
- `/components/music/YouTubePlayerEmbed.tsx` - No longer needed with new architecture

### Known Limitations

1. **Browser Autoplay Policies**: First-visit autoplay may be blocked by browser policies
2. **Single Player Instance**: Cannot have multiple independent YouTube players on the same page
3. **No Multi-Track Queue**: Current implementation plays one track at a time (playlist is managed but not auto-advanced)
4. **Progress Bar Scrubbing**: Currently display-only in mini-player (full player has scrubbing)

### Future Enhancements

Potential improvements that could be built on this architecture:

1. **Picture-in-Picture Mode**: Use browser PiP API to float video while browsing
2. **Keyboard Shortcuts**: Space for play/pause, arrow keys for next/prev
3. **Auto-Advance**: Automatically play next track when current ends
4. **Video Quality Selector**: Allow users to choose resolution
5. **Playlist Shuffle**: Randomize playback order
6. **Queue System**: Allow adding tracks to play next
7. **Playback History**: Track what user has listened to
8. **Lyrics Integration**: Display synchronized lyrics

### Troubleshooting

**Problem**: React hydration error `insertBefore` node error

**Solution**: Ensure YouTube player container is created outside React's DOM using `document.createElement()` as shown in the YouTubePlayerContext implementation above.

**Problem**: Video not appearing on `/music` page

**Solution**: Check that `YouTubePlayerFull`'s positioning logic is running and `videoContainerRef` is properly attached to the display area div.

**Problem**: Playback stops when navigating between pages

**Solution**: Verify that the YouTube player container is never unmounted and that the context provider wraps the entire application in the root layout.

**Problem**: Volume or playback position not persisting

**Solution**: Check localStorage for `youtube-player-prefs` and ensure `savePreferences()` is being called in the context.

---

## Future Enhancements

### Potential Architecture Improvements

1. **React Query for Client-Side Caching**
   - Cache blog posts on client
   - Optimistic updates for better UX
   - Background refetching

2. **Incremental Static Regeneration**
   - Cache blog pages for 60 seconds
   - Reduce database load
   - Faster page loads

3. **Edge Functions for API Routes**
   - Deploy contact/generate APIs to edge
   - Lower latency globally
   - Better scalability

4. **Real-Time Subscriptions**
   - Live preview of post edits
   - Real-time view count
   - Collaborative editing

5. **Advanced Caching Strategy**
   - Redis for session storage
   - CDN caching for static assets
   - Query result caching

---

## Conclusion

This architecture prioritizes:

- **Developer Experience**: Type safety, clear patterns, minimal boilerplate
- **Performance**: Server Components, edge middleware, optimized queries
- **Security**: RLS at database level, middleware auth checks, secure API keys
- **Maintainability**: Separation of concerns, clear file structure, documented decisions
- **Scalability**: Stateless design, horizontal scaling ready, edge-compatible

The combination of Next.js App Router + Supabase + TypeScript provides a modern, scalable foundation for a personal website with admin capabilities, AI features, and excellent performance characteristics.
