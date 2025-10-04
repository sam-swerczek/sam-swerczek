# Sam Swerczek Personal Website - Project Strategy

## Project Overview
A dual-purpose personal website showcasing Sam Swerczek as both a singer-songwriter and software engineer. The site serves two distinct audiences (music industry professionals/fans and engineering professionals) while maintaining a cohesive brand identity.

## Core Requirements

### Audiences
1. **Music Industry**: Venues, clients, fans looking for music content
2. **Engineering**: Recruiters, colleagues, tech community interested in blog posts and projects

### Key Features
- Intelligent routing between music and engineering content
- Admin portal for content management (blog posts, music links, videos)
- Clear CTAs for blog, music, videos, and social media
- Patreon support integration
- Professional, sleek, slightly futuristic design

## Technical Architecture

### Tech Stack
- **Frontend Framework**: Next.js 14+ (App Router)
  - React 18+
  - TypeScript for type safety
  - Client-side routing for smooth transitions
- **Styling**: Tailwind CSS
  - Muted color palette (grays, deep blues, subtle accents)
  - Responsive design (mobile-first)
  - Smooth animations and transitions
- **Backend**: Supabase
  - PostgreSQL database for blog posts, content metadata
  - Auth for admin portal (email/password or magic link)
  - Storage for images/media if needed
  - Row-level security for admin vs public access
- **Hosting**: Vercel
  - Auto-deploy from GitHub
  - Custom domain: samswerczek.com
  - Edge functions if needed
- **Version Control**: GitHub
  - Main branch for production
  - Feature branches for development

### Project Structure
```
/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── music/
│   │   └── page.tsx            # Music portfolio
│   ├── blog/
│   │   ├── page.tsx            # Blog listing
│   │   └── [slug]/
│   │       └── page.tsx        # Individual blog post
│   ├── admin/
│   │   ├── page.tsx            # Admin dashboard
│   │   ├── login/
│   │   │   └── page.tsx        # Admin login
│   │   └── posts/
│   │       ├── page.tsx        # Manage posts
│   │       ├── new/
│   │       │   └── page.tsx    # Create new post
│   │       └── [id]/
│   │           └── page.tsx    # Edit post
│   └── layout.tsx              # Root layout
├── components/
│   ├── ui/                     # Reusable UI components
│   ├── layout/                 # Header, Footer, Nav
│   ├── music/                  # Music-specific components
│   ├── blog/                   # Blog-specific components
│   └── admin/                  # Admin-specific components
├── lib/
│   ├── supabase/               # Supabase client & utilities
│   ├── utils/                  # Helper functions
│   └── types/                  # TypeScript types
├── public/                      # Static assets
└── styles/                      # Global styles
```

## Site Structure

### 1. Landing Page (`/`)
**Purpose**: First impression, drive users to choose music or engineering content

**Design Elements**:
- Hero section with name and tagline
- Two clear CTAs: "Explore Music" / "Engineering & Blog"
- Minimal, futuristic aesthetic
- Smooth scroll animations
- Perhaps: rotating/subtle background animations

**Technical**:
- Static page, no data fetching
- Optimized images
- Fast load time critical

### 2. Music Section (`/music`)
**Purpose**: Showcase music portfolio, drive engagement and bookings

**Content**:
- Embedded Spotify player or latest tracks
- YouTube video embeds (featured performances)
- Social media links:
  - Instagram
  - Facebook
  - TikTok (future)
- Patreon CTA (prominent)
- Maybe: Upcoming shows/gigs calendar
- Contact/booking information

**Technical**:
- Fetch social links from Supabase (editable via admin)
- Lazy load video embeds
- Responsive grid layout

### 3. Blog Section (`/blog`)
**Purpose**: Showcase engineering content, thought leadership

**Content**:
- Blog post listing (card layout)
- Filters/tags (engineering, books, projects, etc.)
- Search functionality (nice-to-have)
- Featured posts section
- LinkedIn link
- GitHub link

**Technical**:
- Fetch posts from Supabase
- Server-side rendering for SEO
- Pagination or infinite scroll
- Rich text rendering (markdown or similar)

### 4. Blog Post Detail (`/blog/[slug]`)
**Purpose**: Display individual blog posts

**Content**:
- Full blog post with rich formatting
- Publish date, tags
- Share buttons
- Related posts
- Comments (future consideration)

**Technical**:
- Dynamic routing based on slug
- SSR for SEO
- Metadata for social sharing (Open Graph)

### 5. Admin Portal (`/admin`)
**Purpose**: Content management for blog posts and site content

**Authentication**:
- Supabase Auth (email/password)
- Protected routes (middleware)
- Session management

**Features**:
- Dashboard overview
- Create/Edit/Delete blog posts
  - Rich text editor (Tiptap or similar)
  - Image upload
  - Tags/categories
  - Draft vs Published status
  - SEO fields (meta description, etc.)
- Manage music links/social media URLs
- Analytics overview (future)

**Technical**:
- Server actions for mutations
- Form validation
- Optimistic UI updates
- Protected API routes

## Database Schema (Supabase)

### Tables

#### `posts`
```sql
- id: uuid (primary key)
- created_at: timestamp
- updated_at: timestamp
- title: text
- slug: text (unique, indexed)
- content: text (markdown or JSON)
- excerpt: text
- published: boolean
- published_at: timestamp
- author_id: uuid (foreign key to auth.users)
- tags: text[] (array)
- featured_image_url: text
- meta_description: text
```

#### `site_config`
```sql
- id: uuid (primary key)
- key: text (unique, e.g., 'spotify_url', 'instagram_handle')
- value: text
- category: text (e.g., 'music_social', 'engineering_social')
- updated_at: timestamp
```

#### `media` (optional, for uploaded images)
```sql
- id: uuid (primary key)
- created_at: timestamp
- filename: text
- storage_path: text
- url: text
- uploaded_by: uuid (foreign key)
```

### Row-Level Security (RLS)
- Public read access to published posts
- Admin-only write access
- Admin-only access to site_config

## Design System

### Color Palette
- **Primary Background**: Dark charcoal (#1a1a1a) or deep navy (#0f1419)
- **Secondary Background**: Lighter gray (#2a2a2a)
- **Text Primary**: Off-white (#e8e8e8)
- **Text Secondary**: Muted gray (#a0a0a0)
- **Accent**: Subtle blue (#4a9eff) or teal (#3dd6d0)
- **Accent Secondary**: Muted gold/amber for CTAs (#d4a574)

### Typography
- **Headings**: Modern sans-serif (Inter, Outfit, or Space Grotesk)
- **Body**: Clean, readable (Inter or System UI)
- **Monospace**: For code blocks (Fira Code, JetBrains Mono)

### Spacing & Layout
- Consistent spacing scale (4px base)
- Max content width: 1200px
- Generous whitespace
- Clear visual hierarchy

### Components
- Buttons: Subtle hover states, smooth transitions
- Cards: Subtle borders or shadows, hover lift effect
- Links: Underline on hover, color transition
- Forms: Clean inputs, clear validation states

## Development Phases

### Phase 1: Project Setup & Foundation
**Goal**: Get Next.js project running with basic routing and styling

**Tasks**:
1. Initialize Next.js project with TypeScript and Tailwind
2. Set up project structure (folders, components)
3. Configure Tailwind with custom color palette
4. Create basic layout (Header, Footer)
5. Set up routing structure (/music, /blog, /admin)
6. Install and configure Supabase client
7. Set up environment variables

**Deliverable**: Working Next.js app with navigation between sections

### Phase 2: Landing Page
**Goal**: Create impressive first impression

**Tasks**:
1. Design hero section with name and tagline
2. Create two prominent CTAs (Music / Engineering)
3. Add subtle animations (fade-in, parallax, etc.)
4. Responsive design for mobile
5. Performance optimization

**Deliverable**: Polished landing page

### Phase 3: Music Section
**Goal**: Showcase music content and drive engagement

**Tasks**:
1. Create music page layout
2. Add Spotify embed component
3. Add YouTube video embed component
4. Create social media links section
5. Add Patreon CTA
6. Make social links editable via Supabase config
7. Responsive design

**Deliverable**: Complete music portfolio page

### Phase 4: Blog Section (Public)
**Goal**: Display blog posts for visitors

**Tasks**:
1. Design Supabase schema for posts
2. Create blog listing page with card layout
3. Implement blog post detail page
4. Add markdown/rich text rendering
5. Add tags/filtering
6. Implement SEO metadata
7. Add social share buttons

**Deliverable**: Public-facing blog with sample content

### Phase 5: Admin Portal - Authentication
**Goal**: Secure admin access

**Tasks**:
1. Set up Supabase Auth
2. Create login page
3. Implement protected routes middleware
4. Add logout functionality
5. Session management

**Deliverable**: Working authentication system

### Phase 6: Admin Portal - Content Management
**Goal**: Enable easy content creation and editing

**Tasks**:
1. Create admin dashboard
2. Build blog post creation form with rich text editor
3. Implement image upload functionality
4. Create post editing interface
5. Add delete functionality with confirmation
6. Create interface for managing site config (social links, etc.)
7. Draft vs Published workflow

**Deliverable**: Full-featured admin portal

### Phase 7: Polish & Optimization
**Goal**: Production-ready site

**Tasks**:
1. Performance audit and optimization
2. Accessibility audit (a11y)
3. SEO optimization
4. Add loading states and error handling
5. Cross-browser testing
6. Mobile responsiveness review
7. Add analytics (Vercel Analytics or similar)

**Deliverable**: Polished, production-ready site

### Phase 8: Deployment
**Goal**: Live site on custom domain

**Tasks**:
1. Create Supabase project and configure
2. Push to GitHub
3. Connect to Vercel
4. Configure environment variables
5. Set up custom domain (samswerczek.com)
6. SSL configuration
7. Test production deployment

**Deliverable**: Live website

## Future Enhancements
- Comments system for blog posts
- Email newsletter integration
- Show/gig calendar for music section
- Project showcase page for engineering
- Book recommendations page
- Dark/light mode toggle
- Enhanced analytics dashboard
- Search functionality
- RSS feed for blog
- Progressive Web App (PWA) features

## Success Metrics
- Fast load times (<2s initial load)
- Mobile-friendly (responsive across all devices)
- SEO-optimized (meta tags, structured data)
- Accessible (WCAG AA compliance)
- Easy content management (admin can add blog posts in <5 minutes)
- Professional impression for both audiences

## Guidelines for Sub-Agents

### When working on this project:
1. **Maintain consistency**: Use the established color palette, typography, and component patterns
2. **Follow the structure**: Keep files organized according to the project structure defined above
3. **TypeScript**: Always use TypeScript with proper typing
4. **Responsive design**: Every component should work on mobile, tablet, and desktop
5. **Performance**: Optimize images, lazy load where appropriate, minimize bundle size
6. **Accessibility**: Use semantic HTML, proper ARIA labels, keyboard navigation
7. **Code quality**: Write clean, documented code with clear naming conventions
8. **Security**: Never expose API keys, validate all inputs, protect admin routes
9. **Testing**: Test changes across browsers and devices before considering complete
10. **Documentation**: Update this file when making architectural changes

## Current Status
- **Phase**: Pre-development
- **Next Steps**: Initialize Next.js project with TypeScript and Tailwind CSS
