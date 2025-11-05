# Development Patterns & Guidelines

**Purpose**: This document outlines the architectural patterns, design principles, and decision-making framework for developing features in this Next.js 15 personal website. Use this as your primary reference when building new features or refactoring existing code.

**Related Documentation**:
- [Technical Architecture](./architecture/TECHNICAL_ARCHITECTURE.md) - Deep technical implementation details
- [Design System](./DESIGN_SYSTEM.md) - Colors, typography, spacing, and components
- [Design Decisions](./reference/DESIGN_DECISIONS.md) - Historical decisions and rationale
- [Code Patterns](./CODE_PATTERNS.md) - Specific code examples and patterns

---

## Table of Contents

1. [Component Architecture Patterns](#component-architecture-patterns)
2. [Decision Trees](#decision-trees)
3. [Design System Quick Reference](#design-system-quick-reference)
4. [Animation System](#animation-system)
5. [Core Development Principles](#core-development-principles)
6. [Common Scenarios & Solutions](#common-scenarios--solutions)

---

## Component Architecture Patterns

We use **three standard patterns** for component composition. Understanding when to use each is critical for maintaining consistency.

### Pattern A: Self-Contained Pages (Default)

**Use When:**
- Page needs full control of rendering
- Minimal client interactivity required
- Most content is static or server-rendered

**Structure:**
```tsx
// app/example/page.tsx
export default async function ExamplePage() {
  const [data1, data2] = await Promise.all([
    fetchData1(),
    fetchData2(),
  ]);

  return (
    <div className="container mx-auto px-4 py-12">
      <Section1 data={data1} />
      <Section2 data={data2} />
      {/* Client components can be used inline when needed */}
      <ClientInteractiveButton onClick={handleClick} />
    </div>
  );
}
```

**Examples in Codebase:**
- `/app/music/page.tsx` - Music page with embedded content
- `/app/blog/[slug]/page.tsx` - Individual blog post pages

**Characteristics:**
- Server Component by default (no 'use client' directive)
- Data fetching with `Promise.all()` at the top
- Inline rendering of sections
- Client components sprinkled in as needed for interactivity

---

### Pattern B: Client Wrapper (For Highly Interactive Pages)

**Use When:**
- Page requires **3+ pieces of client state**
- Complex client-side filtering, sorting, or searching
- Multiple forms or interactive elements
- Client-side routing logic

**Structure:**
```tsx
// app/example/page.tsx (Server Component)
export default async function ExamplePage() {
  const data = await fetchData();
  return <ExampleClient data={data} />;
}

// app/example/ExampleClient.tsx (Client Component)
'use client';

export default function ExampleClient({ data }: Props) {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('date');

  // Complex interactive logic here
  return <div>{/* Interactive UI */}</div>;
}
```

**Examples in Codebase:**
- `/app/blog/page.tsx` → `BlogClient.tsx` - Blog listing with filters, tags, search
- `/app/contact/page.tsx` → `ContactPageClient.tsx` - Contact form with intent selection

**When NOT to Use:**
- Single piece of state (use Pattern A with inline client component)
- Simple button clicks (use Pattern A)
- No state management needed (use Pattern A)

---

### Pattern C: Layout with Data Props (Root Layouts Only)

**Use When:**
- Multiple layout variants needed across routes
- Different headers/footers for different sections
- Conditional rendering based on route
- Shared data needed across all pages

**Structure:**
```tsx
// app/layout.tsx (Server Component)
export default async function RootLayout({ children }) {
  const [configs, songs] = await Promise.all([
    getSiteConfigs(),
    getSongs(),
  ]);

  return (
    <YouTubePlayerProvider>
      <LayoutClient siteData={configs}>
        {children}
      </LayoutClient>
    </YouTubePlayerProvider>
  );
}

// components/layout/LayoutClient.tsx (Client Component)
'use client';

export default function LayoutClient({ siteData, children }: Props) {
  const pathname = usePathname();
  const isBlogPost = pathname.startsWith('/blog/') && pathname !== '/blog';

  return (
    <div className="min-h-screen flex flex-col">
      {isBlogPost ? (
        <BlogPostHeader heroImageUrl={siteData.heroImageUrl} />
      ) : (
        <Header heroImageUrl={siteData.heroImageUrl} />
      )}
      <main className="flex-grow">{children}</main>
      <Footer configs={siteData} />
    </div>
  );
}
```

**Key Principles:**
- Pass **data as props**, NOT JSX elements
- Let the client component handle conditional rendering
- Keep layout logic centralized in one place
- Single source of truth for shared data

**Current Implementation:**
- `/app/layout.tsx` - Root layout with header/footer variants

**⚠️ Important Refactoring Opportunity:**
The current implementation passes JSX as props which is fragile. The recommended pattern above (passing data) is more maintainable and should be adopted in future refactors.

---

## Decision Trees

### When to Create a New Component

```
┌─────────────────────────────────────┐
│ Need to create a new component?     │
└───────────┬─────────────────────────┘
            │
            ├─► Is it a PAGE component?
            ├─► Is it a LAYOUT component?
            └─► Is it a FEATURE component?
```

#### PAGE Component Decision

```
1. Start with SERVER component (default, no 'use client')
2. Fetch data with Promise.all() at top
3. Does page need extensive client state (3+)?

   YES → Use Pattern B (Client Wrapper)
   - Create separate ClientPage component
   - Pass fetched data as props
   - Example: BlogClient.tsx

   NO → Use Pattern A (Self-Contained)
   - Render inline with client components as needed
   - Example: music/page.tsx, blog/[slug]/page.tsx
```

**Decision Examples:**
- ✅ Blog listing with filters, sorting, search → **Pattern B** (multiple state variables)
- ✅ Music page displaying songs → **Pattern A** (minimal interaction)
- ✅ Contact form with intent cards → **Pattern B** (form state + intent selection)
- ✅ Individual blog post → **Pattern A** (mostly static with comments component)

---

#### LAYOUT Component Decision

```
1. Is this root layout?

   YES → Use Pattern C (Layout with Data Props)
   - Fetch shared config data
   - Pass data (not JSX) to client component
   - Handle conditional rendering in client

   NO → Use Pattern A (Standard Composition)
   - Use standard component composition
   - No special layout pattern needed
```

---

#### FEATURE Component Decision

```
1. Does it need interactivity?
   YES → Mark 'use client'
   NO  → Keep as server component

2. Where does data come from?
   - Parent already has it → Accept as props
   - Standalone usage → Fetch internally

3. Will it be reused in multiple contexts?
   YES → Props-based (more flexible)
   NO  → Can be self-fetching
```

**Examples:**
- Header component used in multiple layouts → **Props-based** (receives heroImageUrl)
- Standalone featured post section → **Self-fetching** (fetches its own data)
- Button with click handler → **Props-based** (receives onClick)
- Comment section → **Props-based** (receives postId)

---

### Client vs. Server Components

**Use Server Components when:**
- Fetching data from database/API
- Accessing backend resources directly
- Keeping sensitive logic/keys on server
- Reducing client-side JavaScript bundle
- No interactivity needed

**Mark as Client Component ('use client') when you need:**
- React hooks (useState, useEffect, useContext, useReducer)
- Browser APIs (window, localStorage, navigator)
- Event handlers (onClick, onChange, onSubmit)
- Interactivity and state management
- Third-party libraries that depend on browser APIs

**Pro Tip:** Start with Server Component by default, only add 'use client' when you encounter an error or need interactivity.

---

## Design System Quick Reference

### Color Palette & Semantic Meaning

```typescript
// Background Colors
bg-background-primary    // #1a1a1a - Dark charcoal (main background)
bg-background-secondary  // #2a2a2a - Lighter gray (cards, sections)
bg-background-navy       // #0f1419 - Deep navy (alternative background)

// Text Colors
text-text-primary        // #e8e8e8 - Off-white (main text)
text-text-secondary      // #a0a0a0 - Muted gray (secondary text)

// Accent Colors (SEMANTIC)
text-accent-blue         // #4a9eff - Music/Creative content
text-accent-teal         // #3dd6d0 - Engineering/Technical content
text-accent-gold         // #d4a574 - CTAs and emphasis
```

**Color Coding Principle:**
- **Blue** = Music, creative, performance content
- **Teal** = Engineering, technical, code content
- **Gold** = Calls-to-action, highlights, emphasis

**Always use these associations** to maintain visual consistency across the site.

---

### Typography Scale

| Use Case | Classes | Size | Weight |
|----------|---------|------|--------|
| Display (Hero) | `text-4xl lg:text-6xl font-bold` | 36-60px | Bold |
| H1 (Section) | `text-3xl md:text-4xl font-bold` | 30-36px | Bold |
| H2 (Subsection) | `text-2xl md:text-3xl font-bold` | 24-30px | Bold |
| H3 | `text-xl md:text-2xl font-semibold` | 20-24px | Semibold |
| Body Large | `text-lg font-light leading-relaxed` | 18px | Light |
| Body | `text-base leading-relaxed` | 16px | Normal |
| Small | `text-sm` | 14px | Normal |
| Caption | `text-xs` | 12px | Normal |

**Font Families:**
- **Headings**: `font-montserrat` (Montserrat - bold, distinctive)
- **Body**: `font-sans` (Inter - clean, readable)
- **Code**: `font-mono` (Fira Code - monospace)

**Guidelines:**
- Always use Montserrat for headings
- Use light weight (300) for long-form body text
- Include responsive sizing with `md:` breakpoint
- Use `leading-relaxed` for body text readability

---

### Spacing System

**Container Pattern:**
```tsx
<div className="container mx-auto px-4">
  <div className="max-w-6xl mx-auto">
    {/* Content */}
  </div>
</div>
```

**Section Padding:**
- Small: `py-12 md:py-16` (~48-64px)
- Medium: `py-16 md:py-24` (~64-96px)
- Large: `py-24 md:py-36` (~96-144px)
- Extra Large: `py-36 md:py-48` (~144-192px)

**Max Width Guidelines:**
- `max-w-7xl` - Wide grid layouts (homepage sections)
- `max-w-6xl` - Standard sections (most pages) **← DEFAULT**
- `max-w-4xl` - Blog posts, long-form content
- `max-w-3xl` - Forms, narrow content

**Component Spacing:**
- Tight: `gap-4` / `space-y-4` (16px)
- Moderate: `gap-6` / `space-y-6` (24px)
- Comfortable: `gap-8` / `space-y-8` (32px)
- Large: `gap-12` / `space-y-12` (48px)

---

### Button Component

**Location:** `/components/ui/Button.tsx`

**Variants:**
```tsx
variant="primary"    // Gradient fill with accent colors (default CTA)
variant="secondary"  // Border outline (secondary actions)
variant="accent"     // Solid gold background (primary actions)
variant="ghost"      // Transparent with border (hero CTAs)
```

**Sizes:**
```tsx
size="sm"   // Compact (px-4 py-2) - Tags, inline actions
size="md"   // Standard (px-6 py-3) - Most buttons ← DEFAULT
size="lg"   // Large (px-8 py-4) - Hero CTAs
```

**Usage Guidelines:**
- **Always use Button component** - avoid ad-hoc button implementations
- Include icons for visual interest (especially on CTAs)
- Always define hover and focus states
- Use `ghost` variant for transparent hero CTAs
- Use `accent` variant for primary page actions

**Example:**
```tsx
<Button
  variant="ghost"
  size="md"
  onClick={handleClick}
>
  <div className="flex items-center gap-3">
    <MusicIcon className="w-5 h-5 text-accent-blue" />
    <span>Listen to My Music</span>
  </div>
</Button>
```

---

## Animation System

### Three-Tier Architecture

#### **Tier 1: Tailwind CSS Utilities** (Simple, CSS-only)

**Use For:** Basic transitions, simple hover effects, simple entrance animations

**Available Animations:**
- `animate-fade-in` - Simple fade in (200ms)
- `animate-slide-in-from-right` - Right to left slide (300ms)
- `animate-slide-in-from-top-2` - Top to bottom with opacity (300ms)
- `animate-slide-down-fade` - Dropdown menu animation (200ms)

**Example:**
```tsx
<div className="animate-fade-in hover:scale-105 transition-transform">
  Fades in on mount, scales on hover
</div>
```

**When to Use:**
- Simple fade-ins on page load
- Hover effects (scale, opacity)
- Dropdown menus
- Loading states

---

#### **Tier 2: Framer Motion Variants** (Complex, Reusable)

**Use For:** Component entrance, staggered animations, scroll-triggered effects

**Location:** `/lib/config/animations.ts`

**Available Variants:**
- `containerVariants` - Staggered children animation
- `fadeUpVariants` - Fade up with scale
- `cardVariants` - Card entrance with index-based delay
- `slideInLeftVariants` - Slide from left
- `slideInRightVariants` - Slide from right
- `headerVariants` - Header entrance animation

**Example:**
```tsx
import { fadeUpVariants } from '@/lib/config/animations';
import { motion } from 'framer-motion';

<motion.div
  variants={fadeUpVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
>
  Fades up when scrolled into view
</motion.div>
```

**Staggered Children Example:**
```tsx
import { containerVariants, cardVariants } from '@/lib/config/animations';

<motion.div
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
>
  {items.map((item, i) => (
    <motion.div
      key={item.id}
      variants={cardVariants}
      custom={i}  // Index passed to variant for stagger
    >
      <Card {...item} />
    </motion.div>
  ))}
</motion.div>
```

**Always Respect Motion Preferences:**
```tsx
import { useReducedMotion } from 'framer-motion';

const shouldReduceMotion = useReducedMotion();
// All variants automatically adapt based on reduceMotion parameter
```

**When to Use:**
- Scroll-triggered entrance animations
- Staggered list/grid animations
- Complex multi-step animations
- When animation needs to adapt to reduced motion preferences

---

#### **Tier 3: Custom Inline Animations** (Unique Effects)

**Use For:** Special effects that are truly unique and don't fit reusable patterns

**Examples of Appropriate Custom Animations:**
1. **Activity Timeline Directional Slides** - Music cards from left, engineering from right (semantic meaning)
2. **Hero Split Background** - Interactive mouse-responsive dual backgrounds
3. **Floating Orbs** - Ambient background animation with specific timing

**Guidelines:**
- **Document WHY the animation is custom** (in code comments)
- Keep custom animations in the component file where they're used
- Don't create custom animations for patterns that could use Tier 1 or 2
- Consider extracting to Tier 2 if used more than once

---

### Animation Decision Tree

```
Does the animation need:

├─ Just a simple CSS transition?
│  → Use Tailwind utility classes (Tier 1)
│  Examples: fade-in, hover effects, simple slides
│
├─ Scroll-triggered entrance or staggered children?
│  → Use Framer Motion variants from config (Tier 2)
│  Examples: card grids, list items, section entrances
│
└─ Complex, truly unique interaction?
   → Custom inline animation with documentation (Tier 3)
   Examples: Activity timeline, hero split effect, floating orbs
```

---

### Animation Best Practices

1. **Always use `viewport={{ once: true }}`** for scroll-triggered animations
   - Prevents re-triggering on scroll up
   - Better performance

2. **Stagger children animations** with `containerVariants` for lists/grids
   - Creates elegant cascade effect
   - Use `custom={index}` to control timing

3. **Use cubic-bezier easing** for smooth, natural motion
   - Default: `[0.25, 0.46, 0.45, 0.94]`
   - Already configured in animation variants

4. **Duration guidelines:**
   - **Fast (200ms)**: Simple fades, hovers
   - **Medium (300-600ms)**: Slides, complex fades
   - **Slow (1000-1400ms)**: Dramatic entrances, hero animations

5. **Accessibility:** All animations must respect `prefers-reduced-motion`
   - Use `useReducedMotion()` hook
   - Variants automatically handle this

---

## Core Development Principles

### 1. Prefer Server Components by Default

Start with Server Components (no 'use client' directive) and only mark as Client Component when you need:
- React hooks
- Browser APIs
- Event handlers

```tsx
// ✅ Good: Server Component (default)
export default async function Page() {
  const data = await fetchData();
  return <div>{data.title}</div>;
}

// ⚠️ Only when needed: Client Component
'use client';
export default function InteractivePage() {
  const [state, setState] = useState();
  return <div>{state}</div>;
}
```

**Benefits:**
- Smaller JavaScript bundles
- Better SEO
- Faster initial page load
- Direct database access

---

### 2. Collocate Data with Usage

Fetch data close to where it's used, not multiple layers above.

```tsx
// ✅ Good: Fetch where you need it
export default async function BlogPage() {
  const posts = await getPosts();  // Used immediately below
  return <PostList posts={posts} />;
}

// ❌ Avoid: Fetching data far from usage
export default async function RootLayout() {
  const posts = await getPosts();  // Used 3 components deep
  return <Layout posts={posts}>...</Layout>;
}
```

**Exception:** Root layout CAN fetch shared configuration data (site settings, navigation)

---

### 3. Components Should Be Predictable

**Props-based components are predictable:**
```tsx
// ✅ Good: Clear inputs → outputs
function Header({ heroImageUrl, userName }: Props) {
  return <header>...</header>;
}
```

**Self-fetching components are opaque:**
```tsx
// ⚠️ Harder to reason about
async function Header() {
  const data = await fetchData();  // Hidden dependency
  return <header>...</header>;
}
```

**Guideline:** For reusable components, prefer props over internal fetching

---

### 4. One Component, One Responsibility

Break down large components into focused, composable pieces.

```tsx
// ❌ Bad: 400+ line component with multiple concerns
export default function BlogClient({ posts, tags, social }) {
  // Filtering + Featured post + Post list + Social links
  // 400+ lines...
}

// ✅ Good: Compose focused components
export default function BlogClient({ posts, tags, social }) {
  return (
    <>
      <FeaturedPost post={posts[0]} />
      <PostFilters tags={tags} onFilter={handleFilter} />
      <PostList posts={filteredPosts} />
      <SocialSection social={social} />
    </>
  );
}
```

**Guideline:** If a component exceeds **200 lines**, consider splitting it

---

### 5. Avoid "Magic" Patterns

Prefer explicit, clear patterns over clever React patterns.

```tsx
// ❌ Bad: Runtime prop injection via cloneElement
{cloneElement(footer, { isCompact: !isAtBottom })}

// ✅ Good: Explicit props
<Footer configs={configs} isCompact={!isAtBottom} />
```

**Avoid:**
- `cloneElement` for prop injection
- Render props when simpler patterns work
- HOCs (Higher-Order Components) for simple composition

---

### 6. Semantic Color Coding

Colors convey meaning consistently across the site.

- **Blue** (`accent-blue`) - Music, creative, performance content
- **Teal** (`accent-teal`) - Engineering, technical, code content
- **Gold** (`accent-gold`) - Calls-to-action, emphasis, highlights

**Examples:**
```tsx
// Music content - use blue
<MusicIcon className="text-accent-blue" />
<Card className="border-accent-blue/20 bg-accent-blue/5">

// Engineering content - use teal
<CodeIcon className="text-accent-teal" />
<Card className="border-accent-teal/20 bg-accent-teal/5">

// CTA button - use gold
<Button variant="accent" className="bg-accent-gold">
```

---

### 7. Mobile-First, Desktop-Enhanced

All styles start with mobile base, then enhance for larger screens.

```tsx
// ✅ Good: Mobile first, desktop enhanced
className="text-base md:text-lg lg:text-xl"
className="py-12 md:py-24 lg:py-36"
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// ❌ Avoid: Desktop first
className="lg:text-xl md:text-lg text-base"
```

**Breakpoints:**
- `md:` - 768px (tablet)
- `lg:` - 1024px (desktop)
- `xl:` - 1280px (large desktop)

---

### 8. Accessibility First

All UI must respect user preferences and accessibility standards.

**Motion Preferences:**
```tsx
import { useReducedMotion } from 'framer-motion';

const shouldReduceMotion = useReducedMotion();
// All animations automatically adapt
```

**Focus States:**
```tsx
// Always include focus-visible rings
className="focus-visible:ring-2 focus-visible:ring-accent-blue"
```

**Semantic HTML:**
```tsx
<button>     // For actions
<a>          // For navigation
<nav>        // For navigation sections
<main>       // For main content
<article>    // For blog posts
```

**Touch Targets:**
- Minimum **44x44px** for clickable elements
- Adequate spacing between interactive elements

---

## Common Scenarios & Solutions

### Scenario 1: Adding a New Page

**Question:** I need to add a new page. Which pattern should I use?

**Decision Process:**

1. **Does the page need 3+ pieces of client state?**
   - YES → Use **Pattern B** (Client Wrapper)
   - NO → Continue to step 2

2. **Does the page need any client interactivity?**
   - YES → Use **Pattern A** (Self-Contained) with inline client components
   - NO → Use **Pattern A** (Self-Contained) with all server components

**Example - New "Projects" Page:**

```tsx
// app/projects/page.tsx (Pattern A - Self-Contained)
export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">
        My Projects
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

// If ProjectCard needs interactivity, make it a client component
'use client';
function ProjectCard({ project }) {
  const [isHovered, setIsHovered] = useState(false);
  // ...
}
```

---

### Scenario 2: Adding a Header Variant

**Question:** I need a different header for the admin section. How do I implement this?

**Solution:** Extend Pattern C (Layout with Data Props)

```tsx
// app/admin/layout.tsx
export default function AdminLayout({ children }) {
  return (
    <div>
      <AdminHeader />  {/* Different header */}
      <main>{children}</main>
      {/* No footer for admin */}
    </div>
  );
}
```

**Note:** Admin layout inherits from root layout, so you're just overriding the specific parts that differ.

---

### Scenario 3: Component Needs Both Data Fetching and Interactivity

**Question:** My component needs to fetch data AND have client-side state. How do I structure this?

**Solution:** Use the **Hybrid Pattern** (Server wraps Client)

```tsx
// components/FeatureSection.tsx (Server Component)
export default async function FeatureSection() {
  const data = await fetchData();  // Server-side fetch
  return <FeatureSectionClient data={data} />;
}

// components/FeatureSectionClient.tsx (Client Component)
'use client';
export default function FeatureSectionClient({ data }) {
  const [selected, setSelected] = useState(data[0]);

  return (
    <div>
      {/* Interactive UI using fetched data */}
    </div>
  );
}
```

---

### Scenario 4: Creating a Reusable Animation

**Question:** I've written a custom animation that I'm using in multiple places. Should I extract it?

**Decision Process:**

1. **Is it used in 2+ places?**
   - YES → Extract to `/lib/config/animations.ts` (Tier 2)
   - NO → Keep inline (Tier 3)

2. **Is it a simple CSS transition?**
   - YES → Add to `tailwind.config.ts` (Tier 1)
   - NO → Use Framer Motion variant (Tier 2)

**Example - Extracting a Variant:**

```tsx
// lib/config/animations.ts
export const slideInBottomVariants = {
  hidden: (reduceMotion: boolean) => ({
    opacity: 0,
    y: reduceMotion ? 0 : 30,
  }),
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_TIMING.medium,
      ease: ANIMATION_TIMING.easeOutCubic,
    },
  },
};

// components/MyComponent.tsx
import { slideInBottomVariants } from '@/lib/config/animations';

<motion.div variants={slideInBottomVariants} initial="hidden" whileInView="visible">
  Content
</motion.div>
```

---

### Scenario 5: Styling a New Button

**Question:** I need a button with a specific style. Should I create a new variant or use the existing Button component?

**Decision Process:**

1. **Is this a one-off special button?**
   - YES → Use Button component with custom className
   - NO → Continue to step 2

2. **Will this button style be used in multiple places?**
   - YES → Add new variant to Button component
   - NO → Use existing variant with custom className

**Example - Custom Styling:**

```tsx
// One-off custom styling
<Button
  variant="ghost"
  size="md"
  className="border-accent-blue text-accent-blue hover:bg-accent-blue/10"
>
  Special Blue Button
</Button>

// If used multiple times, add to Button.tsx:
type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'ghost'
  | 'blue-outline'  // NEW
```

---

## Quick Reference Card

### Component Pattern Selector

| Scenario | Pattern | File Structure |
|----------|---------|----------------|
| Simple page, minimal interaction | A | `page.tsx` (Server) |
| Page with 3+ state variables | B | `page.tsx` (Server) → `PageClient.tsx` |
| Root layout with variants | C | `layout.tsx` → `LayoutClient.tsx` |
| Reusable component | Props-based | Single component file |
| Standalone feature | Self-fetching | Single component file |

---

### Animation Tier Selector

| Animation Type | Tier | Implementation |
|----------------|------|----------------|
| Simple fade/slide | 1 | Tailwind classes |
| Scroll-triggered entrance | 2 | Framer Motion variants |
| Staggered list | 2 | containerVariants + cardVariants |
| Unique custom effect | 3 | Inline Framer Motion |

---

### Color Association Guide

| Content Type | Color | Tailwind Class |
|--------------|-------|----------------|
| Music/Creative | Blue | `text-accent-blue` |
| Engineering/Technical | Teal | `text-accent-teal` |
| CTA/Emphasis | Gold | `text-accent-gold` |
| Primary Text | Off-white | `text-text-primary` |
| Secondary Text | Muted gray | `text-text-secondary` |

---

## Conclusion

These patterns emerged from real development challenges (like the blog header implementation). Following them will:

- **Reduce decision fatigue**: Clear patterns for common scenarios
- **Improve consistency**: Same problems solved the same way
- **Speed up development**: Less time wondering "how should I structure this?"
- **Ease onboarding**: New developers (or AI agents) can follow established patterns

**When in doubt:**
1. Check this document first
2. Look for similar examples in the codebase
3. Ask questions or discuss before creating new patterns

---

**Last Updated:** 2025-01-04
**Last Reviewed By:** lead-engineer, web-design-architect agents
