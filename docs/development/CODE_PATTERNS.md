# Code Patterns & Organization

This document outlines the conventions, patterns, and best practices used throughout this codebase.

## Table of Contents
1. [Project Structure](#1-project-structure)
2. [Component Patterns](#2-component-patterns)
3. [Data Fetching Patterns](#3-data-fetching-patterns)
4. [Form Handling](#4-form-handling)
5. [Styling Conventions](#5-styling-conventions)
6. [TypeScript Usage](#6-typescript-usage)
7. [Code Reusability](#7-code-reusability)
8. [File Organization Examples](#8-file-organization-examples)

---

## 1. Project Structure

### Directory Organization

```
/Users/samswerczek/Projects/Personal_Page/
├── app/                        # Next.js App Router pages and layouts
│   ├── (pages)/
│   │   ├── blog/              # Blog listing and individual posts
│   │   ├── contact/           # Contact form page
│   │   └── music/             # Music showcase page
│   ├── admin/                 # Admin portal (auth-protected)
│   │   ├── posts/             # Post management
│   │   ├── config/            # Site configuration
│   │   └── login/             # Authentication
│   ├── api/                   # API route handlers
│   │   ├── contact/           # Contact form submission
│   │   └── generate-post/     # AI post generation
│   ├── layout.tsx             # Root layout with fonts and metadata
│   └── page.tsx               # Homepage
├── components/                 # Reusable React components
│   ├── admin/                 # Admin-specific components
│   ├── blog/                  # Blog-related components
│   ├── contact/               # Contact form components
│   ├── home/                  # Homepage sections
│   ├── layout/                # Header, Footer
│   ├── music/                 # Music embeds and social links
│   ├── providers/             # Context providers
│   └── ui/                    # Shared UI primitives
│       └── icons/             # Icon component library
├── lib/                       # Utilities, hooks, types
│   ├── hooks/                 # Custom React hooks
│   ├── supabase/              # Database client and queries
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Utility functions and styles
├── public/                    # Static assets
├── styles/                    # Global CSS
└── supabase/                  # Database migrations
```

### File Naming Conventions

- **Components**: PascalCase with descriptive names
  - `PostCard.tsx`, `ContactForm.tsx`, `HeroSection.tsx`
- **Utilities**: camelCase
  - `buttonStyles.ts`, `slugify.ts`, `formStyles.ts`
- **Hooks**: camelCase with `use` prefix
  - `useAuth.ts`, `useFormSubmit.ts`
- **Types**: `index.ts` in `/lib/types/` directory
- **Icons**: PascalCase with `Icon` suffix
  - `SpinnerIcon.tsx`, `CheckCircleIcon.tsx`

### Component Organization

Components are organized by **feature** and **purpose**:

#### Layout Components (`/components/layout/`)
Core structural components used across all pages.
```
/components/layout/
├── Header.tsx          # Navigation with active route highlighting
└── Footer.tsx          # Site footer with links
```

#### UI Primitives (`/components/ui/`)
Reusable, generic components that work anywhere.
```
/components/ui/
├── Alert.tsx           # Success/Error/Warning/Info messages
├── Button.tsx          # Button variants
├── Card.tsx            # Content card wrapper
├── FormField.tsx       # Form field with label and error
└── icons/              # Icon library (16 icons)
```

#### Feature-Specific Components
Organized by the page/feature they belong to.
```
/components/blog/       # Blog-specific components
/components/contact/    # Contact form components
/components/admin/      # Admin portal components
/components/home/       # Homepage sections
/components/music/      # Music page embeds
```

### Where Things Go

| Type | Location | Example |
|------|----------|---------|
| **Page Routes** | `/app/` | `/app/blog/page.tsx` |
| **Client Components** | `/app/` or `/components/` | `BlogClient.tsx`, `ContactForm.tsx` |
| **Server Components** | `/app/` | `/app/blog/page.tsx` |
| **Reusable Components** | `/components/` | `/components/ui/Alert.tsx` |
| **Custom Hooks** | `/lib/hooks/` | `/lib/hooks/useAuth.ts` |
| **Type Definitions** | `/lib/types/` | `/lib/types/index.ts` |
| **Utility Functions** | `/lib/utils/` | `/lib/utils/slugify.ts` |
| **Database Queries** | `/lib/supabase/` | `/lib/supabase/queries.ts` |
| **API Routes** | `/app/api/` | `/app/api/contact/route.ts` |

---

## 2. Component Patterns

### Server Components vs. Client Components

This project follows Next.js App Router patterns with a **clear separation** between server and client components.

#### Server Components (Default)
Server components **do not** have `'use client'` directive and handle:
- Data fetching
- Passing props to client components
- SEO metadata

**Example**: `/app/blog/page.tsx`
```typescript
import { getPublishedPosts, getAllTags } from '@/lib/supabase/queries';
import BlogClient from './BlogClient';

// Force dynamic rendering for fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BlogPage() {
  const allPosts = await getPublishedPosts();
  const allTags = await getAllTags();

  return <BlogClient initialPosts={allPosts} allTags={allTags} />;
}
```

#### Client Components
Client components **have** `'use client'` directive and handle:
- Interactive state
- Event handlers
- Browser-only APIs
- Hooks (`useState`, `useEffect`, custom hooks)

**Example**: `/app/blog/BlogClient.tsx`
```typescript
'use client';

import { useState } from 'react';
import type { Post } from '@/lib/types';

interface BlogClientProps {
  initialPosts: Post[];
  allTags: string[];
}

export default function BlogClient({ initialPosts, allTags }: BlogClientProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  // ... client-side filtering and interactions
}
```

### "Client" Suffix Pattern

Files with complex interactivity are split into two files:

1. **Server Component** (`page.tsx` or component name) - Data fetching
2. **Client Component** (`*Client.tsx`) - Interactivity

**Pattern Examples**:
- `/app/blog/page.tsx` → `/app/blog/BlogClient.tsx`
- `/app/admin/posts/new/page.tsx` → `/app/admin/posts/new/CreatePostClient.tsx`
- `/app/admin/posts/[id]/page.tsx` → `/app/admin/posts/[id]/EditPostClient.tsx`
- `components/home/HeroSection.tsx` → `components/home/HeroClient.tsx`

**New Pattern: Component-Level Split** (October 2025)

Previously, this pattern was primarily used at the page level. As of October 2025, we've extended it to individual components that need both server-side data fetching and client-side interactivity:

```typescript
// Server Component - Fetches configuration
// components/home/HeroSection.tsx
import { getSiteConfig } from '@/lib/supabase/queries';
import HeroClient from './HeroClient';

export default async function HeroSection() {
  const siteConfig = await getSiteConfig();
  const heroImageUrl = siteConfig.find(c => c.key === 'hero_image_url')?.value;

  return <HeroClient heroImageUrl={heroImageUrl} />;
}

// Client Component - Handles interactivity
// components/home/HeroClient.tsx
'use client';

export default function HeroClient({ heroImageUrl }: Props) {
  // Mouse tracking, animations, useState, useEffect, etc.
}
```

**Why extend this pattern?**
- Enables dynamic configuration for any component, not just pages
- Keeps client bundle size minimal
- Maintains server-side rendering benefits
- Clear separation of data fetching from presentation logic

### When to Use 'use client' Directive

Use `'use client'` when your component needs:
- React hooks (`useState`, `useEffect`, custom hooks)
- Event handlers (`onClick`, `onChange`, `onSubmit`)
- Browser APIs (`window`, `localStorage`, `navigator`)
- Third-party client libraries (form libraries, charts)

**Components that are client-side**:
- `ContactForm.tsx` (form state, event handlers)
- `PostForm.tsx` (form validation, state management)
- `Header.tsx` (`usePathname` for active route)
- `TagFilter.tsx` (click handlers)
- All hooks (`useAuth`, `useFormSubmit`)

### Component Composition

Components are **composable** and **single-purpose**.

**Good Example** - Composing smaller components:
```typescript
// ContactForm.tsx uses smaller primitives
<FormField id="name" label="Name" required>
  <input
    type="text"
    id="name"
    name="name"
    value={formData.name}
    onChange={handleChange}
    className={inputClassName()}
  />
</FormField>

{success && (
  <Alert type="success" message="Message sent successfully!" />
)}
```

### Props Patterns

#### Interface-Based Props
All component props are **typed with interfaces**:

```typescript
interface FormFieldProps {
  id: string;
  label: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  id,
  label,
  helperText,
  error,
  required = false,
  children,
  className = ''
}: FormFieldProps) {
  // ...
}
```

#### Optional Props with Defaults
```typescript
interface PostFormProps {
  post?: Post;                    // Optional existing post
  onSubmit: (data) => Promise<void>;
  isLoading?: boolean;            // Default: false
  initialData?: { /* ... */ };    // Optional AI-generated draft
}
```

#### Children Props
Components that wrap content use `children`:
```typescript
<FormField id="email" label="Email" required>
  <input type="email" {...props} />
</FormField>
```

---

## 3. Data Fetching Patterns

### Server-Side Queries in RSC

Server components fetch data directly using async functions.

**Pattern**: Queries in `/lib/supabase/queries.ts`
```typescript
// lib/supabase/queries.ts
import { supabase } from './client';
import type { Post } from '../types';

export async function getPublishedPosts(options?: {
  limit?: number;
  offset?: number;
  tags?: string[];
}) {
  let query = supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.tags && options.tags.length > 0) {
    query = query.overlaps('tags', options.tags);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching published posts:', error);
    return [];
  }

  return data as Post[];
}
```

**Usage in Server Component**:
```typescript
// app/blog/page.tsx
export default async function BlogPage() {
  const allPosts = await getPublishedPosts();
  const allTags = await getAllTags();

  return <BlogClient initialPosts={allPosts} allTags={allTags} />;
}
```

### Client-Side with Supabase Client

Client components use the browser Supabase client.

**Example from `useAuth` hook**:
```typescript
// lib/hooks/useAuth.ts
'use client';

import { supabase } from '@/lib/supabase/client';

export function useAuth() {
  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      // ...
    };
    initializeAuth();
  }, []);
}
```

### Error Handling Approach

**Server-Side**: Return empty/null on error, log to console
```typescript
if (error) {
  console.error('Error fetching posts:', error);
  return [];
}
```

**Client-Side**: Use error state and display to user
```typescript
const [error, setError] = useState<string | null>(null);

try {
  await submitFunction();
} catch (err) {
  const errorMessage = err instanceof Error ? err.message : 'An error occurred';
  setError(errorMessage);
}
```

### Loading States

**Client-side loading pattern**:
```typescript
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async () => {
  setIsLoading(true);
  try {
    await submitFn();
  } finally {
    setIsLoading(false);
  }
};

// In render:
<button disabled={isLoading}>
  {isLoading ? <SpinnerIcon /> : 'Submit'}
</button>
```

---

## 4. Form Handling

### useFormSubmit Custom Hook

**Centralized form submission logic** in `/lib/hooks/useFormSubmit.ts`.

**Hook Interface**:
```typescript
interface UseFormSubmitReturn<T> {
  handleSubmit: (submitFn: () => Promise<T>) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
  resetState: () => void;
}
```

**Usage Pattern**:
```typescript
'use client';

import { useFormSubmit } from '@/lib/hooks/useFormSubmit';

export default function ContactForm() {
  const [formData, setFormData] = useState({ /* ... */ });

  const { handleSubmit, isLoading, error, success } = useFormSubmit({
    successDuration: 5000,
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await handleSubmit(async () => {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setFormData({ /* reset to initial */ });
    });
  };

  return (
    <form onSubmit={onSubmit}>
      {/* form fields */}
      {success && <Alert type="success" message="Success!" />}
      {error && <Alert type="error" message={error} />}
      <button disabled={isLoading}>Submit</button>
    </form>
  );
}
```

### FormField Component Pattern

**Reusable form field wrapper** in `/components/ui/FormField.tsx`.

**Component**:
```typescript
interface FormFieldProps {
  id: string;
  label: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({ id, label, helperText, error, required, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id}>
        {label} {required && '*'}
        {helperText && <span className="text-xs text-text-secondary">{helperText}</span>}
      </label>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
```

**Usage**:
```typescript
<FormField id="email" label="Email" required error={errors.email}>
  <input
    type="email"
    id="email"
    name="email"
    value={formData.email}
    onChange={handleChange}
    className={inputClassName(!!errors.email)}
  />
</FormField>
```

### Validation Approach

**Client-side validation** before submission:

```typescript
// PostForm.tsx
const [errors, setErrors] = useState<Record<string, string>>({});

const validate = () => {
  const newErrors: Record<string, string> = {};

  if (!title.trim()) {
    newErrors.title = 'Title is required';
  }

  if (!slug.trim()) {
    newErrors.slug = 'Slug is required';
  } else if (!/^[a-z0-9-]+$/.test(slug)) {
    newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validate()) {
    return;
  }

  // Proceed with submission
};
```

### Server Actions Integration

**API Route Pattern** (`/app/api/contact/route.ts`):
```typescript
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // Validate
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Process (e.g., send email)
    await sendEmail({ name, email, message });

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully!',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
```

---

## 5. Styling Conventions

### Tailwind Utility Patterns

**Consistent spacing and sizing**:
- Padding: `p-4`, `p-6`, `p-8`, `px-6 py-3`
- Margins: `mb-6`, `mt-8`, `gap-4`
- Rounded corners: `rounded-lg` (most UI), `rounded-2xl` (cards)
- Borders: `border border-gray-800` (standard), `border-gray-700` (hover)

**Typography scale**:
```typescript
// Headings
"text-5xl md:text-7xl font-bold"      // Hero
"text-3xl font-bold"                   // Page titles
"text-2xl font-bold"                   // Section headings
"text-xl font-bold"                    // Subsections

// Body text
"text-base"                            // Standard body
"text-sm"                              // Helper text
"text-xs"                              // Fine print
```

### Shared Style Utilities

#### Button Styles (`/lib/utils/buttonStyles.ts`)

**Variants**:
```typescript
export const buttonVariants = {
  primary: "px-6 py-2 bg-accent-blue hover:bg-accent-teal text-white rounded-lg font-semibold transition-colors",
  secondary: "px-6 py-2 bg-background-secondary border border-gray-700 rounded-lg text-text-primary hover:bg-background-primary transition-colors",
  danger: "px-6 py-2 bg-red-900/30 border border-red-700 text-red-400 rounded-lg font-semibold hover:bg-red-900/50 transition-colors",
  filter: "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
  icon: "p-2 rounded-lg hover:bg-background-secondary transition-colors",
} as const;
```

**Usage**:
```typescript
import { getButtonClasses } from '@/lib/utils/buttonStyles';

<button className={getButtonClasses('primary')}>
  Submit
</button>

<button className={getButtonClasses('filter', isActive)}>
  Tag
</button>
```

#### Form Styles (`/lib/utils/formStyles.ts`)

**Shared input styles**:
```typescript
export const inputClassName = (hasError?: boolean) =>
  `w-full px-4 py-3 bg-background-primary border ${
    hasError ? 'border-red-500' : 'border-gray-700'
  } rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue transition-colors`;

export const textareaClassName = (hasError?: boolean) =>
  `${inputClassName(hasError)} resize-none`;

export const selectClassName = (hasError?: boolean) =>
  inputClassName(hasError);
```

**Usage**:
```typescript
import { inputClassName, textareaClassName } from '@/lib/utils/formStyles';

<input className={inputClassName(!!errors.email)} />
<textarea className={textareaClassName(!!errors.message)} />
```

### Icon Components

**Icon library** in `/components/ui/icons/`:
- 16 SVG icon components
- All use same `IconProps` interface
- Exported from `/components/ui/icons/index.ts`

**Icon Component Pattern**:
```typescript
// SpinnerIcon.tsx
interface IconProps {
  className?: string;
}

export function SpinnerIcon({ className = "animate-spin h-6 w-6" }: IconProps) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      {/* SVG paths */}
    </svg>
  );
}
```

**Available Icons**:
```typescript
// Import from barrel export
import {
  SpinnerIcon,
  CheckCircleIcon,
  XCircleIcon,
  WarningIcon,
  InfoIcon,
  ArrowRightIcon,
  CloseIcon,
  FilterIcon,
  TagIcon,
  BookIcon,
  CodeIcon,
  MusicIcon,
  ClockIcon,
  CalendarIcon,
  StarIcon,
  LightbulbIcon,
} from '@/components/ui/icons';
```

### Color Palette Usage

**From `tailwind.config.ts`**:

```typescript
colors: {
  background: {
    primary: '#1a1a1a',      // Dark charcoal
    secondary: '#2a2a2a',    // Lighter gray
    navy: '#0f1419',         // Deep navy (alternative)
  },
  text: {
    primary: '#e8e8e8',      // Off-white
    secondary: '#a0a0a0',    // Muted gray
  },
  accent: {
    blue: '#4a9eff',         // Subtle blue (primary CTA)
    teal: '#3dd6d0',         // Teal (hover state)
    gold: '#d4a574',         // Muted gold/amber (highlights)
  },
}
```

**Usage Patterns**:
- Primary backgrounds: `bg-background-primary`
- Card backgrounds: `bg-background-secondary`, `bg-background-secondary/50` (with transparency)
- Text: `text-text-primary` (headings, body), `text-text-secondary` (helper text)
- Accents: `text-accent-blue` (links), `bg-accent-blue` (buttons), `hover:bg-accent-teal`

### Responsive Design Patterns

**Mobile-first approach**:
```typescript
// Mobile → Desktop
"text-xl md:text-2xl"                 // Responsive text
"grid grid-cols-1 md:grid-cols-2"    // Responsive grid
"px-4 md:px-12"                       // Responsive spacing
"flex-col md:flex-row"                // Responsive layout
```

**Common breakpoints**:
- `md:` - 768px and up (tablet)
- No `sm:` breakpoint used (mobile-first base)

### Background Image Pattern

**Added:** October 2025

**Purpose:** Maintain split-screen brand identity (music/left, engineering/right) across pages

**Pattern:**

```typescript
// Music-related pages: Background on LEFT half
<div className="absolute left-0 top-0 w-1/2 h-screen overflow-hidden hidden md:block">
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background-primary/50 via-60% to-background-primary">
    <Image
      src="/path/to/music-background.jpg"
      alt=""
      fill
      className="object-cover"
      style={{ opacity: 0.15, filter: 'blur(3px) brightness(0.6)' }}
      priority={false}
    />
  </div>
</div>

// Engineering/Blog pages: Background on RIGHT half
<div className="absolute right-0 top-0 w-1/2 h-screen overflow-hidden hidden md:block">
  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-background-primary/50 via-60% to-background-primary">
    <Image
      src="/path/to/code-background.jpg"
      alt=""
      fill
      className="object-cover"
      style={{ opacity: 0.15, filter: 'blur(3px) brightness(0.6)' }}
      priority={false}
    />
  </div>
</div>
```

**Design Specifications:**

| Property | Value | Rationale |
|----------|-------|-----------|
| Position | `absolute` | Scrolls with content (not fixed) |
| Width | `w-1/2` | Half screen (left or right) |
| Height | `h-screen` | Viewport height only (not full page) |
| Opacity | `0.15` | Very subtle, doesn't overwhelm content |
| Blur | `blur(3px)` | Softens image, reduces distraction |
| Brightness | `brightness(0.6)` | Darkens image to blend with dark theme |
| Responsive | `hidden md:block` | Desktop only, hidden on mobile |
| Gradient Direction | `to-r` (left) or `to-l` (right) | Fades toward center |
| Gradient Stops | `via-60% to-background-primary` | Smooth transition to solid background |

**Usage Rules:**

1. **Music-related pages** → Use LEFT background with music/guitar imagery
2. **Engineering/Blog pages** → Use RIGHT background with code/tech imagery
3. **Homepage/Hybrid pages** → Can use BOTH backgrounds with bottom fade gradient
4. **Mobile** → Always hide backgrounds (`hidden md:block`)
5. **Z-Index** → Backgrounds should be behind content (default z-index)

**Example (Music Page):**
```typescript
export default function MusicPage() {
  return (
    <main className="relative">
      {/* Music Background - LEFT */}
      <div className="absolute left-0 top-0 w-1/2 h-screen overflow-hidden hidden md:block">
        {/* ... gradient and image ... */}
      </div>

      {/* Page Content */}
      <div className="relative z-10 container mx-auto px-4">
        {/* Your content here */}
      </div>
    </main>
  );
}
```

**Why This Pattern:**
- Reinforces split-screen brand identity (music/left, engineering/right)
- Maintains visual consistency across site
- Subtle enough to not distract from content
- Responsive (hidden on mobile for performance)
- Scrolls naturally with content

---

## 6. TypeScript Usage

### Type Definitions in lib/types

**Central type file**: `/lib/types/index.ts`

**Database Types** (match Supabase schema):
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

export interface SiteConfig {
  id: string;
  key: string;
  value: string;
  category: string;
  updated_at: string;
}
```

**Form Types** (for creating/updating):
```typescript
export type CreatePostData = Omit<Post, 'id' | 'created_at' | 'updated_at'>;
export type UpdatePostData = Partial<Omit<Post, 'id' | 'created_at' | 'updated_at'>>;
```

**API Response Types**:
```typescript
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
```

### Component Prop Typing

**Always use interfaces** for component props:
```typescript
interface BlogClientProps {
  initialPosts: Post[];
  allTags: string[];
}

export default function BlogClient({ initialPosts, allTags }: BlogClientProps) {
  // ...
}
```

**Props with functions**:
```typescript
interface PostFormProps {
  post?: Post;
  onSubmit: (postData: Omit<Post, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  isLoading?: boolean;
  initialData?: {
    title?: string;
    content?: string;
    // ...
  };
}
```

### Utility Function Typing

**Explicit return types**:
```typescript
// lib/utils/slugify.ts
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
```

**Generic types for reusability**:
```typescript
// lib/hooks/useFormSubmit.ts
export function useFormSubmit<T = unknown>(
  options: UseFormSubmitOptions = {}
): UseFormSubmitReturn<T> {
  // ...
}
```

### Database Type Safety

**Queries return typed data**:
```typescript
export async function getPublishedPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true);

  if (error) {
    return [];
  }

  return data as Post[];
}
```

**Type assertions when needed**:
```typescript
return data as Post[];  // Supabase returns `any`, we assert our type
```

---

## 7. Code Reusability

### Alert Component

**Flexible alert system** (`/components/ui/Alert.tsx`):

```typescript
interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  className?: string;
}
```

**Usage**:
```typescript
<Alert type="success" message="Post created successfully!" />
<Alert type="error" title="Failed to save" message={error} />
```

**Variants**: Different colors and icons for each type.

### FormField Component

**Consistent form fields** (`/components/ui/FormField.tsx`):

```typescript
<FormField id="title" label="Title" required error={errors.title}>
  <input {...props} />
</FormField>

<FormField
  id="slug"
  label="Slug"
  helperText="URL-friendly version"
  error={errors.slug}
>
  <input {...props} />
</FormField>
```

**Benefits**:
- Consistent label styling
- Automatic error display
- Helper text support
- Required indicator

### Icon Library

**16 reusable icon components**:
- Single source of truth in `/components/ui/icons/`
- Barrel export from `index.ts`
- Consistent `IconProps` interface
- All accept `className` prop

**Usage**:
```typescript
import { SpinnerIcon, CheckCircleIcon } from '@/components/ui/icons';

<SpinnerIcon className="h-5 w-5" />
<CheckCircleIcon className="w-6 h-6 text-green-500" />
```

### Custom Hooks

#### useFormSubmit Hook

**Location**: `/lib/hooks/useFormSubmit.ts`

**Purpose**: Manage form submission state (loading, error, success)

**Features**:
- Loading state management
- Error handling with user-friendly messages
- Auto-clearing success messages
- Optional success callback

#### useAuth Hook

**Location**: `/lib/hooks/useAuth.ts`

**Purpose**: Authentication state and methods

**Features**:
- Current user state
- Sign in / sign out methods
- Auth state change listener
- Error handling for auth failures

**Usage**:
```typescript
const { user, loading, signIn, signOut } = useAuth();

if (loading) return <Spinner />;
if (!user) return <LoginForm />;
```

### Style Utilities

**Shared style functions**:
- `buttonStyles.ts` - Button variant classes
- `formStyles.ts` - Input/textarea/select classes

**Benefits**:
- Consistent styling across the app
- Error state handling
- Easy to update globally

---

## 8. File Organization Examples

### Directory Tree Snippets

#### App Routes
```
app/
├── blog/
│   ├── [slug]/
│   │   └── page.tsx           # Server component: individual post
│   ├── BlogClient.tsx         # Client component: filtering & interactions
│   └── page.tsx               # Server component: data fetching
├── admin/
│   ├── posts/
│   │   ├── [id]/
│   │   │   ├── EditPostClient.tsx
│   │   │   └── page.tsx
│   │   ├── new/
│   │   │   ├── CreatePostClient.tsx
│   │   │   └── page.tsx
│   │   ├── ManagePostsClient.tsx
│   │   └── page.tsx
│   ├── layout.tsx             # Admin-specific layout
│   └── page.tsx               # Admin dashboard
├── api/
│   ├── contact/
│   │   └── route.ts           # POST handler
│   └── generate-post/
│       └── route.ts           # AI post generation
└── layout.tsx                 # Root layout
```

#### Components
```
components/
├── ui/
│   ├── Alert.tsx              # Reusable alert
│   ├── FormField.tsx          # Reusable form field
│   ├── Button.tsx
│   ├── Card.tsx
│   └── icons/
│       ├── index.ts           # Barrel export
│       ├── SpinnerIcon.tsx
│       ├── CheckCircleIcon.tsx
│       └── ...                # 14 more icons
├── blog/
│   ├── PostCard.tsx
│   ├── PostContent.tsx
│   ├── TagFilter.tsx
│   └── TagsList.tsx
├── contact/
│   └── ContactForm.tsx
└── layout/
    ├── Header.tsx
    └── Footer.tsx
```

#### Lib
```
lib/
├── hooks/
│   ├── useAuth.ts
│   └── useFormSubmit.ts
├── supabase/
│   ├── admin.ts               # Admin queries (server-only)
│   ├── client.ts              # Browser client
│   ├── server.ts              # Server client
│   ├── queries.ts             # Public queries
│   └── middleware.ts
├── types/
│   └── index.ts               # All TypeScript types
└── utils/
    ├── buttonStyles.ts
    ├── formStyles.ts
    └── slugify.ts
```

### Example File Paths for Common Patterns

| Pattern | File Path |
|---------|-----------|
| **Page with data fetching** | `/app/blog/page.tsx` |
| **Client interactivity** | `/app/blog/BlogClient.tsx` |
| **Form component** | `/components/contact/ContactForm.tsx` |
| **Reusable UI** | `/components/ui/Alert.tsx` |
| **Custom hook** | `/lib/hooks/useFormSubmit.ts` |
| **Database query** | `/lib/supabase/queries.ts` |
| **Type definition** | `/lib/types/index.ts` |
| **Utility function** | `/lib/utils/slugify.ts` |
| **API route** | `/app/api/contact/route.ts` |
| **Icon component** | `/components/ui/icons/SpinnerIcon.tsx` |

### Pattern: Server + Client Split

**Before (Single File - Anti-pattern)**:
```
app/blog/page.tsx  [mixed server/client code - hard to maintain]
```

**After (Split Pattern)**:
```
app/blog/
├── page.tsx          # Server component: async data fetching
└── BlogClient.tsx    # Client component: useState, onClick handlers
```

**Example**:

**Server** (`page.tsx`):
```typescript
import { getPublishedPosts } from '@/lib/supabase/queries';
import BlogClient from './BlogClient';

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  return <BlogClient initialPosts={posts} />;
}
```

**Client** (`BlogClient.tsx`):
```typescript
'use client';

import { useState } from 'react';

export default function BlogClient({ initialPosts }) {
  const [selectedTag, setSelectedTag] = useState(null);
  // ... interactive logic
}
```

---

## 9. Advanced Patterns

### React Hooks with Stable Callbacks

**Problem**: Callback dependencies that change frequently cause entire components to reinitialize.

**Example from YouTube Player Context**:

```typescript
// ANTI-PATTERN: Callback depends on state that changes frequently
const handleError = useCallback((event: YTPlayerEvent) => {
  if (retryCountRef.current < 3) {
    playerRef.current.loadVideoById(playerState.videoId); // ❌ State dependency
  }
}, [playerState.videoId]); // ❌ Recreates callback every track change

// This causes:
// 1. handleError callback recreates
// 2. initializePlayer (depends on handleError) recreates
// 3. useEffect (watches initializePlayer) triggers
// 4. Entire player reinitializes unnecessarily
```

**SOLUTION: Use refs to break dependency chain**

```typescript
// Use ref to hold current value without triggering recreations
const currentVideoIdRef = useRef<string>(DEFAULT_VIDEO_ID);

const handleError = useCallback((event: YTPlayerEvent) => {
  if (retryCountRef.current < 3) {
    playerRef.current.loadVideoById(currentVideoIdRef.current); // ✅ Ref access
  }
}, []); // ✅ Empty dependency array - never recreates

// Update ref when video changes (doesn't trigger callback recreation)
const loadTrack = useCallback((track: Song) => {
  currentVideoIdRef.current = track.youtube_video_id; // Update ref
  playerRef.current.loadVideoById(track.youtube_video_id);
}, []);
```

**When to use this pattern**:
- Callbacks that need access to frequently-changing values
- Event handlers in intervals/timers
- Third-party API integrations with callbacks
- Any situation where callback recreation causes performance issues

**Benefits**:
- Stable callback references prevent unnecessary reinitializations
- Maintains access to current values
- Cleaner dependency arrays
- Better performance

### Integrating Third-Party DOM-Manipulating Libraries

**Problem**: Libraries like YouTube IFrame API, Google Maps, etc. directly manipulate the DOM, causing React hydration errors.

**Error Example**:
```
Failed to execute 'insertBefore' on 'Node': The node before which
the new node is to be inserted is not a child of this node
```

**Root Cause**:
- YouTube API injects iframes into the DOM during React's hydration phase
- Server renders empty container, client expects empty container
- YouTube API adds children before React finishes hydration
- React reconciliation fails when it finds unexpected DOM nodes

**SOLUTION: Create container outside React's control**

```typescript
// In YouTubePlayerContext (or similar wrapper)
useEffect(() => {
  // 1. Create container using vanilla DOM APIs
  const playerContainer = document.createElement('div');
  playerContainer.id = 'youtube-player-container';
  playerContainer.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;';

  // 2. Append directly to document.body (outside React's tree)
  document.body.appendChild(playerContainer);

  // 3. Initialize third-party library on the external container
  const player = new YT.Player('youtube-player-container', {
    videoId: DEFAULT_VIDEO_ID,
    events: {
      onReady: handleReady,
      onStateChange: handleStateChange,
    },
  });

  // 4. Cleanup on unmount
  return () => {
    player.destroy();
    playerContainer.remove();
  };
}, []);
```

**Why This Works**:
- Container exists completely outside React's virtual DOM
- React never tries to reconcile changes made by third-party library
- No hydration errors because React never manages this element
- Library can manipulate DOM freely without conflicts

**When to use this pattern**:
- YouTube IFrame API
- Google Maps
- Canvas-based libraries
- Any library that directly manipulates the DOM
- Chart libraries that render to specific DOM nodes

**Industry Standard**:
This is the recommended approach by React and library maintainers for integrating DOM-manipulating third-party libraries.

### requestAnimationFrame for Smooth UI Updates

**Problem**: Direct event handlers on scroll/resize can cause janky UI updates and missed frames.

**Example from YouTube Player Positioning**:

```typescript
// BAD: Direct scroll handler causes jitter
const updatePosition = () => {
  const rect = videoContainerRef.current.getBoundingClientRect();
  playerContainer.style.left = `${rect.left}px`;
  playerContainer.style.top = `${rect.top}px`;
};

window.addEventListener('scroll', updatePosition); // ❌ Runs on every scroll event
```

**SOLUTION: Use requestAnimationFrame to batch updates**

```typescript
const videoContainerRef = useRef<HTMLDivElement>(null);
let rafId: number | null = null;

const updatePosition = () => {
  if (!videoContainerRef.current) return;

  const rect = videoContainerRef.current.getBoundingClientRect();

  // Round to prevent sub-pixel rendering issues
  const left = Math.round(rect.left);
  const top = Math.round(rect.top);
  const width = Math.round(rect.width);
  const height = Math.round(rect.height);

  playerContainer.style.position = 'fixed';
  playerContainer.style.left = `${left}px`;
  playerContainer.style.top = `${top}px`;
  playerContainer.style.width = `${width}px`;
  playerContainer.style.height = `${height}px`;
};

const handleScroll = () => {
  // Cancel any pending frame
  if (rafId) cancelAnimationFrame(rafId);

  // Schedule update for next frame
  rafId = requestAnimationFrame(updatePosition);
};

window.addEventListener('scroll', handleScroll, { passive: true }); // ✅ Batched updates

// Cleanup
return () => {
  if (rafId) cancelAnimationFrame(rafId);
  window.removeEventListener('scroll', handleScroll);
};
```

**Why This Works**:
- `requestAnimationFrame` batches updates to browser's refresh rate (~60fps)
- Prevents multiple calculations per frame
- Smooth tracking in all scroll directions
- `{ passive: true }` allows browser to optimize scroll performance

**When to use this pattern**:
- Scroll event handlers
- Resize event handlers
- Mouse move tracking
- Any high-frequency UI update
- Animation loops

**Additional Optimizations**:
- **Math.round()**: Prevents sub-pixel rendering artifacts
- **Passive listeners**: Allows browser to optimize without waiting for event handler
- **Cleanup**: Always cancel pending frames to prevent memory leaks

### Dynamic Positioning with getBoundingClientRect

**Problem**: Need to overlay an element that persists across pages over different display areas.

**Use Case**: YouTube player that shows on `/music` page but continues playing on other pages.

**SOLUTION: Use fixed positioning + getBoundingClientRect()**

```typescript
const videoContainerRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const playerContainer = document.getElementById('youtube-player-container');

  const updatePosition = () => {
    if (!videoContainerRef.current) return;

    // Get exact coordinates relative to viewport
    const rect = videoContainerRef.current.getBoundingClientRect();

    // Fixed positioning matches getBoundingClientRect coordinates
    playerContainer.style.position = 'fixed';
    playerContainer.style.left = `${Math.round(rect.left)}px`;
    playerContainer.style.top = `${Math.round(rect.top)}px`;
    playerContainer.style.width = `${Math.round(rect.width)}px`;
    playerContainer.style.height = `${Math.round(rect.height)}px`;
    playerContainer.style.pointerEvents = 'auto';
    playerContainer.style.zIndex = '10';
  };

  updatePosition();

  window.addEventListener('resize', updatePosition);
  window.addEventListener('scroll', handleScroll);

  // Cleanup: hide when navigating away
  return () => {
    playerContainer.style.left = '-9999px'; // Hide off-screen
    playerContainer.style.pointerEvents = 'none';
  };
}, []);
```

**Why fixed positioning?**
- `getBoundingClientRect()` returns coordinates relative to viewport
- `position: fixed` is also relative to viewport
- No complex offset calculations needed
- Works correctly with scrolling

**Why getBoundingClientRect?**
- Gives exact pixel coordinates
- Accounts for transforms, margins, padding
- Always accurate regardless of parent positioning
- Updates with page layout changes

**When to use this pattern**:
- Overlaying persistent elements
- Picture-in-picture video
- Floating toolbars
- Sticky elements that need precise positioning
- Cross-page UI elements

### Preventing SSR/CSR Mismatches with Mounted State

**Problem**: Client-only features cause hydration mismatches when rendered during SSR.

**Example from PlayerBar**:

```typescript
'use client';

export default function PlayerBar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until client-side mounted
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

**Why This Works**:
- Server renders `null` (no content)
- Client mounts and immediately renders `null` (matches server)
- After hydration completes, `useEffect` runs and sets `mounted = true`
- Component renders actual content
- No mismatch because both server and initial client render return `null`

**When to use this pattern**:
- Components that access browser-only APIs
- Components that depend on localStorage/sessionStorage
- Components that use window/document directly
- Any client-only feature that could cause hydration errors

**Alternative patterns**:
```typescript
// Using dynamic import with ssr: false
import dynamic from 'next/dynamic';

const PlayerBar = dynamic(() => import('./PlayerBar'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});
```

## Key Takeaways

1. **Clear Separation**: Server components fetch data, client components handle interactivity
2. **Type Safety**: All components, functions, and data are strongly typed
3. **Reusability**: Shared components (`Alert`, `FormField`), hooks (`useFormSubmit`, `useAuth`), and utilities
4. **Consistency**: Shared style utilities for buttons, forms, and colors
5. **Organization**: Feature-based component structure, centralized types and utilities
6. **Patterns**: Server/Client split, composable components, centralized data fetching
7. **Advanced Patterns**:
   - Use refs to break callback dependency chains
   - Create containers outside React for third-party DOM libraries
   - Use requestAnimationFrame for smooth high-frequency updates
   - Use getBoundingClientRect + fixed positioning for precise overlays
   - Use mounted state to prevent SSR/CSR mismatches

This structure scales well and makes it easy to find, update, and extend code.
