# Design System

The visual language and component standards for the Sam Swerczek personal website.

---

## Color Palette

### Brand Colors

```css
/* Primary Backgrounds */
background-primary: #1a1a2e      /* Dark navy blue - main background */
background-secondary: #16213e    /* Darker navy - cards, sections */
background-navy: #0f1419         /* Darkest - admin interface */

/* Accent Colors */
accent-primary: #00bfa5          /* Teal - primary actions, highlights */
accent-secondary: #64ffda        /* Light teal - hover states */
accent-tertiary: #a78bfa         /* Purple - secondary actions */

/* Text Colors */
text-primary: #e2e8f0            /* Light gray - body text */
text-secondary: #94a3b8          /* Medium gray - secondary text */
text-muted: #64748b              /* Muted gray - labels, metadata */

/* Semantic Colors */
success: #10b981                 /* Green - success states */
warning: #f59e0b                 /* Amber - warning states */
error: #ef4444                   /* Red - error states */
info: #3b82f6                    /* Blue - informational */
```

### Color Usage Guidelines

**Backgrounds:**
- Use `background-primary` for main page background
- Use `background-secondary` for cards, elevated surfaces
- Use `background-navy` for admin interface only

**Accents:**
- Use `accent-primary` (teal) for primary CTAs, links, active states
- Use `accent-secondary` for hover states on teal elements
- Use `accent-tertiary` (purple) for secondary actions, badges

**Text:**
- Use `text-primary` for headings and body text
- Use `text-secondary` for supporting text, labels
- Use `text-muted` for timestamps, metadata

**Semantic:**
- Use semantic colors only for their intended purpose (success/warning/error/info)
- Never use semantic colors for decorative purposes

---

## Typography

### Font Families

```css
font-sans: 'Inter', system-ui, sans-serif     /* Primary text */
font-mono: 'Fira Code', monospace             /* Code blocks */
```

### Type Scale

```css
/* Headings */
text-4xl: 2.25rem (36px)    /* Page titles */
text-3xl: 1.875rem (30px)   /* Section headings */
text-2xl: 1.5rem (24px)     /* Subsection headings */
text-xl: 1.25rem (20px)     /* Card titles */

/* Body */
text-lg: 1.125rem (18px)    /* Large body text, introductions */
text-base: 1rem (16px)      /* Default body text */
text-sm: 0.875rem (14px)    /* Small text, labels */
text-xs: 0.75rem (12px)     /* Micro text, timestamps */
```

### Font Weights

```css
font-light: 300        /* Sparingly, for large display text */
font-normal: 400       /* Body text */
font-medium: 500       /* Emphasized text */
font-semibold: 600     /* Subheadings, labels */
font-bold: 700         /* Headings */
```

### Usage Guidelines

**Headings:**
- Page titles: `text-4xl` + `font-bold`
- Section headings: `text-3xl` + `font-semibold`
- Subsections: `text-2xl` + `font-semibold`
- Card titles: `text-xl` + `font-medium`

**Body Text:**
- Default body: `text-base` + `font-normal`
- Introduction paragraphs: `text-lg` + `font-normal`
- Labels: `text-sm` + `font-medium`
- Metadata: `text-xs` + `text-muted`

---

## Spacing System

### Scale

```css
0: 0px
1: 0.25rem (4px)
2: 0.5rem (8px)
3: 0.75rem (12px)
4: 1rem (16px)
5: 1.25rem (20px)
6: 1.5rem (24px)
8: 2rem (32px)
10: 2.5rem (40px)
12: 3rem (48px)
16: 4rem (64px)
20: 5rem (80px)
24: 6rem (96px)
```

### Usage Guidelines

**Component Padding:**
- Small components (buttons, badges): `px-3 py-2` or `px-4 py-2`
- Medium components (cards): `p-6` or `p-8`
- Large components (sections): `p-12` or `p-16`

**Component Spacing:**
- Between small elements: `gap-2` or `gap-3`
- Between medium elements: `gap-4` or `gap-6`
- Between large elements: `gap-8` or `gap-12`

**Section Spacing:**
- Between sections: `mb-16` or `mb-20`
- Between subsections: `mb-8` or `mb-12`
- Between paragraphs: `mb-4` or `mb-6`

---

## Animation System

### Three-Tier Architecture

#### Tier 1: Tailwind CSS Transitions
For simple, single-property transitions.

```css
/* Hover effects */
hover:opacity-80 transition-opacity duration-200
hover:scale-105 transition-transform duration-200
hover:bg-accent-secondary transition-colors duration-200

/* Focus states */
focus:ring-2 focus:ring-accent-primary transition-all duration-150
```

**When to use:**
- Simple hover effects
- Focus states
- Color transitions
- Opacity changes

#### Tier 2: Framer Motion Config
For complex, reusable animations from `/lib/config/animations.ts`.

```typescript
import {
  fadeInVariants,
  slideInLeftVariants,
  slideInRightVariants,
  scaleInVariants
} from '@/lib/config/animations';

<motion.div
  variants={fadeInVariants}
  custom={shouldReduceMotion}
  initial="hidden"
  animate="visible"
/>
```

**Available Variants:**
- `fadeInVariants` - Simple fade in
- `slideInLeftVariants` - Slide from left
- `slideInRightVariants` - Slide from right
- `slideInUpVariants` - Slide from bottom
- `scaleInVariants` - Scale up from center

**When to use:**
- Page transitions
- Component entrances
- Scroll-triggered animations
- Staggered list animations

#### Tier 3: Custom Inline Animations
For unique, one-off effects.

```typescript
<motion.div
  initial={{ opacity: 0, rotate: -180 }}
  animate={{ opacity: 1, rotate: 0 }}
  transition={{
    duration: 0.8,
    ease: [0.25, 0.46, 0.45, 0.94]
  }}
/>
```

**When to use:**
- Unique feature-specific animations
- Complex orchestrated sequences
- Animations that don't fit existing patterns

### Animation Timing

```typescript
ANIMATION_TIMING = {
  instant: 0.1,           // 100ms - feedback
  fast: 0.2,              // 200ms - micro-interactions
  normal: 0.3,            // 300ms - standard transitions
  slow: 1.4,              // 1400ms - dramatic entrances

  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  easeOutCubic: [0.25, 0.46, 0.45, 0.94]
};
```

### Accessibility

**Always respect reduced motion preference:**

```typescript
const shouldReduceMotion = useReducedMotion();

// In variants
hidden: (reduceMotion: boolean) => ({
  opacity: 0,
  x: reduceMotion ? 0 : -100,  // No movement if reduced motion
  scale: reduceMotion ? 1 : 0.92
})
```

---

## Button Components

### Button Variants

#### Primary Button
```jsx
<button className="px-6 py-3 bg-accent-primary text-white font-medium rounded-lg hover:bg-accent-secondary transition-colors duration-200">
  Primary Action
</button>
```

#### Secondary Button
```jsx
<button className="px-6 py-3 bg-background-secondary text-text-primary font-medium rounded-lg border border-accent-primary hover:bg-accent-primary/10 transition-colors duration-200">
  Secondary Action
</button>
```

#### Ghost Button
```jsx
<button className="px-4 py-2 text-accent-primary font-medium hover:bg-accent-primary/10 rounded-lg transition-colors duration-200">
  Ghost Action
</button>
```

#### Danger Button
```jsx
<button className="px-6 py-3 bg-error text-white font-medium rounded-lg hover:bg-error/80 transition-colors duration-200">
  Delete
</button>
```

### Button Sizes

```jsx
/* Small */
<button className="px-3 py-1.5 text-sm">Small</button>

/* Medium (default) */
<button className="px-6 py-3 text-base">Medium</button>

/* Large */
<button className="px-8 py-4 text-lg">Large</button>
```

### Button States

```jsx
/* Loading */
<button disabled className="opacity-50 cursor-wait">
  <Spinner /> Loading...
</button>

/* Disabled */
<button disabled className="opacity-50 cursor-not-allowed">
  Disabled
</button>

/* Active */
<button className="ring-2 ring-accent-primary">
  Active
</button>
```

---

## Card Components

### Base Card

```jsx
<div className="bg-background-secondary rounded-lg p-6 border border-gray-800">
  {/* Card content */}
</div>
```

### Elevated Card

```jsx
<div className="bg-background-secondary rounded-lg p-6 shadow-lg border border-gray-800 hover:shadow-xl transition-shadow duration-200">
  {/* Card content */}
</div>
```

### Interactive Card

```jsx
<div className="bg-background-secondary rounded-lg p-6 border border-gray-800 hover:border-accent-primary hover:scale-[1.02] transition-all duration-200 cursor-pointer">
  {/* Card content */}
</div>
```

---

## Form Elements

### Input Fields

```jsx
<input
  type="text"
  className="w-full px-4 py-2 bg-background-secondary border border-gray-700 rounded-lg text-text-primary focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/50 transition-all duration-150"
  placeholder="Enter text..."
/>
```

### Text Areas

```jsx
<textarea
  className="w-full px-4 py-2 bg-background-secondary border border-gray-700 rounded-lg text-text-primary focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/50 transition-all duration-150 resize-none"
  rows={4}
  placeholder="Enter text..."
/>
```

### Select Dropdowns

```jsx
<select className="w-full px-4 py-2 bg-background-secondary border border-gray-700 rounded-lg text-text-primary focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/50 transition-all duration-150">
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

### Labels

```jsx
<label className="block text-sm font-medium text-text-secondary mb-2">
  Field Label
</label>
```

### Error States

```jsx
<input
  className="w-full px-4 py-2 bg-background-secondary border-2 border-error rounded-lg text-text-primary focus:border-error focus:ring-2 focus:ring-error/50"
  aria-invalid="true"
  aria-describedby="error-message"
/>
<p id="error-message" className="mt-1 text-sm text-error">
  This field is required
</p>
```

---

## Layout Patterns

### Container Widths

```css
max-w-7xl      /* Main content container (1280px) */
max-w-4xl      /* Blog posts, long-form content (896px) */
max-w-2xl      /* Narrow content (672px) */
```

### Responsive Breakpoints

```css
sm: 640px      /* Tablet portrait */
md: 768px      /* Tablet landscape */
lg: 1024px     /* Desktop */
xl: 1280px     /* Large desktop */
2xl: 1536px    /* Extra large desktop */
```

### Grid Patterns

```jsx
/* Two-column grid */
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Grid items */}
</div>

/* Three-column grid */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Grid items */}
</div>

/* Four-column grid */
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {/* Grid items */}
</div>
```

---

## Accessibility Guidelines

### Keyboard Navigation

- All interactive elements must be focusable
- Focus states must be clearly visible
- Tab order should follow visual hierarchy
- Provide keyboard shortcuts for common actions

### ARIA Labels

```jsx
/* Icon buttons */
<button aria-label="Play video">
  <PlayIcon />
</button>

/* Form fields */
<label htmlFor="email">Email Address</label>
<input id="email" type="email" aria-required="true" />

/* Error messages */
<div role="alert" aria-live="polite">
  Error message
</div>
```

### Color Contrast

- Text must have at least 4.5:1 contrast ratio
- Large text (18px+) must have at least 3:1 contrast ratio
- Interactive elements must have sufficient contrast in all states

### Motion Sensitivity

- Always check `useReducedMotion()` before animating
- Provide static alternatives for animated content
- Never use motion for critical information

---

## Icon System

### Icon Guidelines

- Use consistent stroke width (1.5-2px)
- Size icons appropriately for context:
  - Small: 16px (inline text)
  - Medium: 20-24px (buttons, UI elements)
  - Large: 32-48px (features, sections)
- Maintain consistent visual weight
- Use semantic meaning (play = ▶, pause = ⏸, etc.)

---

## Image Guidelines

### Optimization

- Use Next.js Image component for automatic optimization
- Provide appropriate sizes for responsive layouts
- Use WebP/AVIF formats when possible
- Implement lazy loading for below-fold images

### Aspect Ratios

```css
aspect-square      /* 1:1 - Profile images, album covers */
aspect-video       /* 16:9 - Featured images, hero sections */
aspect-[4/3]       /* 4:3 - Blog post images */
```

---

## Background System

### Split-Screen Backgrounds

**Music pages (left side):**
```jsx
<div className="absolute left-0 top-0 w-1/2 h-screen overflow-hidden hidden md:block">
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background-primary/50 via-60% to-background-primary">
    <Image
      src="/music-background.jpg"
      style={{ opacity: 0.15, filter: 'blur(3px) brightness(0.6)' }}
      fill
    />
  </div>
</div>
```

**Engineering/blog pages (right side):**
```jsx
<div className="absolute right-0 top-0 w-1/2 h-screen overflow-hidden hidden md:block">
  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-background-primary/50 via-60% to-background-primary">
    <Image
      src="/code-background.jpg"
      style={{ opacity: 0.15, filter: 'blur(3px) brightness(0.6)' }}
      fill
    />
  </div>
</div>
```

**Guidelines:**
- Opacity: 15% max
- Blur: 3px
- Brightness: 0.6
- Hidden on mobile (`hidden md:block`)
- Height: viewport only (`h-screen`)

---

## Usage Examples

### Creating a New Section

```jsx
<section className="py-20 px-6">
  <div className="max-w-7xl mx-auto">
    <motion.h2
      className="text-4xl font-bold text-text-primary mb-12"
      variants={fadeInVariants}
      initial="hidden"
      animate="visible"
    >
      Section Title
    </motion.h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Section content */}
    </div>
  </div>
</section>
```

### Creating a Card

```jsx
<motion.div
  className="bg-background-secondary rounded-lg p-6 border border-gray-800 hover:border-accent-primary transition-colors duration-200"
  variants={scaleInVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
>
  <h3 className="text-xl font-semibold text-text-primary mb-3">
    Card Title
  </h3>
  <p className="text-base text-text-secondary">
    Card description
  </p>
</motion.div>
```

---

## References

- [Development Patterns](./DEVELOPMENT_PATTERNS.md) - Component architecture
- [Design Decisions](../reference/DESIGN_DECISIONS.md) - Historical context
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)

---

Last updated: 2025-01-05
