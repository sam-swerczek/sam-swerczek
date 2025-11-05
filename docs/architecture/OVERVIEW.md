# Architecture Overview

High-level system design and key architectural decisions.

## System Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ↓
┌─────────────────────────────┐
│  Next.js App (Vercel Edge)  │
│  ┌───────────────────────┐  │
│  │  Middleware (Auth)    │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │  Server Components    │──┼──→ Supabase
│  │  (Data Fetching)      │  │    (PostgreSQL + Auth)
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │  Client Components    │  │
│  │  (Interactivity)      │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │  API Routes           │──┼──→ External APIs
│  │  (AI, Email)          │  │    (Claude, Resend)
│  └───────────────────────┘  │
└─────────────────────────────┘
```

## Key Architectural Decisions

### 1. Server Components First

**Decision**: Use React Server Components by default, Client Components only when needed.

**Rationale**:
- Reduces JavaScript bundle size
- Improves SEO and initial page load
- Allows direct database access
- Better performance on low-powered devices

**Implementation**: See [Component Patterns](../development/DEVELOPMENT_PATTERNS.md#component-architecture-patterns)

### 2. Three Component Composition Patterns

**Decision**: Standardize on three patterns for different scenarios.

**Patterns**:
- **Pattern A**: Self-Contained Pages (most pages)
- **Pattern B**: Client Wrapper (highly interactive pages)
- **Pattern C**: Layout with Data Props (root layouts only)

**Rationale**: Eliminates decision fatigue, provides clear guidelines for new features.

**Details**: See [Development Patterns](../development/DEVELOPMENT_PATTERNS.md)

### 3. Database-Level Security

**Decision**: Use Supabase Row-Level Security (RLS) policies instead of application-level security.

**Rationale**:
- Security enforced at database level (can't be bypassed)
- Works even if application code has vulnerabilities
- Future API clients automatically inherit security
- Supabase client respects RLS based on auth context

**Implementation**: See [Authentication Architecture](./AUTHENTICATION.md)

### 4. Persistent YouTube Player

**Decision**: Single YouTube iframe that never unmounts during navigation.

**Rationale**:
- Seamless audio playback while browsing
- No interruption when navigating pages
- Video displays on `/music` page, hidden elsewhere
- Better UX than recreating player on each page

**Implementation**: See [YouTube Player Architecture](./YOUTUBE_PLAYER.md)

### 5. Three-Tier Animation System

**Decision**: Animations organized into three tiers based on complexity.

**Tiers**:
1. **Tailwind CSS** - Simple transitions
2. **Framer Motion Config** - Complex, reusable animations
3. **Custom Inline** - Unique effects only

**Rationale**: Reduces code duplication, maintains consistency, respects user motion preferences.

**Details**: See [Animation System](../development/DEVELOPMENT_PATTERNS.md#animation-system)

## Technology Choices

### Why Next.js 15 App Router?

- Server Components for better performance
- Built-in API routes for backend logic
- Edge middleware for authentication
- Excellent Vercel deployment integration
- React 19 features (Server Actions, streaming)

### Why Supabase?

- PostgreSQL database (robust, mature)
- Built-in authentication
- Row-Level Security policies
- Real-time subscriptions (future use)
- Generous free tier

### Why TypeScript?

- Catch errors at compile time
- IntelliSense in editor
- Self-documenting code
- Easier refactoring

### Why Tailwind CSS?

- Utility-first approach
- No CSS naming conventions needed
- Responsive design built-in
- Smaller bundle size than component libraries
- Consistent design system

## Data Flow

### Public Page Request
```
User requests /blog
    ↓
Next.js Middleware runs (no auth needed, continues)
    ↓
Server Component fetches posts from Supabase
    ↓
Server renders HTML
    ↓
Browser receives fully rendered page
    ↓
Client Components hydrate for interactivity
```

### Admin Page Request
```
User requests /admin/posts
    ↓
Next.js Middleware checks authentication
    ├─ No auth → Redirect to /admin/login
    └─ Authenticated → Continue
        ↓
Server Component fetches data (service role key)
        ↓
Client Component wraps for interactivity
        ↓
User can create/edit/delete posts
        ↓
Server Actions handle mutations + revalidate cache
```

## Performance Considerations

### Bundle Splitting

- Automatic code splitting at `'use client'` boundaries
- Admin components not loaded on public pages
- Dynamic imports for heavy components

### Image Optimization

- Next.js Image component for automatic optimization
- WebP/AVIF format conversion
- Responsive image sizes
- Lazy loading by default

### Database Query Optimization

- PostgreSQL indexes on frequently queried columns
- Selective column queries (not SELECT *)
- Pagination ready (limit/offset support)

## Security

### Multiple Layers

1. **Edge Middleware**: First line of defense (route protection)
2. **RLS Policies**: Database-level security
3. **API Route Validation**: Input validation and sanitization

### Secrets Management

- Environment variables never exposed to client
- Service role key only used server-side
- Anonymous key safe for browser (RLS enforced)

## Scalability

### Horizontal Scaling

- Stateless design (no server-side sessions)
- Edge middleware runs globally
- Vercel auto-scales based on traffic
- Supabase handles connection pooling

### Future Improvements

- Implement ISR (Incremental Static Regeneration) for caching
- Add CDN for static assets
- Use React Query for client-side caching
- Implement Redis for session storage

---

## Deep Dives

- **[Technical Architecture](./TECHNICAL_ARCHITECTURE.md)** - Detailed implementation
- **[Authentication](./AUTHENTICATION.md)** - Auth flow and security
- **[YouTube Player](./YOUTUBE_PLAYER.md)** - Player architecture
- **[Development Patterns](../development/DEVELOPMENT_PATTERNS.md)** - Component patterns

---

Last updated: 2025-01-05
