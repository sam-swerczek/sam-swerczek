import { Post } from '../types';

export const mockPosts: Post[] = [
  {
    id: '1',
    created_at: '2024-09-15T10:00:00Z',
    updated_at: '2024-09-15T10:00:00Z',
    title: 'TypeScript Utility Types: Beyond the Basics',
    slug: 'typescript-utility-types-beyond-basics',
    content: `
TypeScript's utility types are powerful tools that can dramatically improve your code's type safety and developer experience. While most developers are familiar with \`Partial\` and \`Pick\`, there's a whole world of advanced patterns waiting to be explored.

## The Power of Mapped Types

Mapped types allow you to transform existing types into new ones. Here's a practical example:

\`\`\`typescript
type ReadonlyDeep<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? ReadonlyDeep<T[K]>
    : T[K];
};
\`\`\`

This creates a deeply readonly version of any type, perfect for immutable data structures.

## Conditional Types in Action

Conditional types let you create types that change based on conditions:

\`\`\`typescript
type ApiResponse<T> = T extends { error: string }
  ? { success: false; error: string }
  : { success: true; data: T };
\`\`\`

## Template Literal Types

One of my favorite recent additions to TypeScript:

\`\`\`typescript
type EventName<T extends string> = \`on\${Capitalize<T>}\`;
type ClickEvent = EventName<'click'>; // 'onClick'
\`\`\`

These patterns have transformed how I write type-safe code. The key is understanding when to use each tool and how they compose together.

## Practical Applications

In real-world applications, combining these utilities creates robust, self-documenting APIs. For example, when building a state management system, you can use these patterns to ensure type safety across actions, reducers, and selectors without manual type annotations.

The investment in learning these patterns pays dividends in reduced bugs and improved developer experience.
    `,
    excerpt: 'Explore advanced TypeScript utility types and patterns that go beyond the basics, from mapped types to template literals.',
    published: true,
    published_at: '2024-09-15T10:00:00Z',
    author_id: 'sam',
    tags: ['TypeScript', 'Engineering', 'Best Practices'],
    featured_image_url: null,
    meta_description: 'Deep dive into advanced TypeScript utility types including mapped types, conditional types, and template literal types.',
  },
  {
    id: '2',
    created_at: '2024-08-22T14:30:00Z',
    updated_at: '2024-08-22T14:30:00Z',
    title: 'Building Resilient React Components',
    slug: 'building-resilient-react-components',
    content: `
Writing React components that stand the test of time requires thinking beyond just "does it work?" We need to consider resilience, maintainability, and developer experience.

## The Resilience Mindset

A resilient component handles edge cases gracefully, provides clear error boundaries, and fails in predictable ways. Here's what I've learned building production applications:

### 1. Error Boundaries Are Your Friend

Every major component tree should have an error boundary:

\`\`\`typescript
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <FallbackUI />;
    }
    return this.props.children;
  }
}
\`\`\`

### 2. Loading States Matter

Don't just show spinners. Show skeleton screens, progressive content, or cached data:

\`\`\`typescript
function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading, error } = useUser(userId);

  if (error) return <ErrorMessage error={error} />;
  if (isLoading) return <UserSkeleton />;

  return <ProfileView user={data} />;
}
\`\`\`

### 3. Accessibility from the Start

Building accessible components isn't extra work—it's building correctly:

- Semantic HTML
- Proper ARIA labels
- Keyboard navigation
- Focus management

## Composition Over Complexity

The best components are composed from smaller, focused pieces. Instead of one monolithic component, break it down:

\`\`\`typescript
function ProductCard() {
  return (
    <Card>
      <Card.Image />
      <Card.Content>
        <Card.Title />
        <Card.Description />
      </Card.Content>
      <Card.Actions />
    </Card>
  );
}
\`\`\`

This pattern makes components easier to test, modify, and understand.

## Testing for Resilience

Your tests should cover edge cases, not just happy paths. Test loading states, error states, empty states, and accessibility.

Building resilient components takes discipline, but the payoff is enormous: fewer bugs, happier users, and code that lasts.
    `,
    excerpt: 'Learn patterns for building React components that are resilient, maintainable, and provide excellent user experience.',
    published: true,
    published_at: '2024-08-22T14:30:00Z',
    author_id: 'sam',
    tags: ['React', 'Engineering', 'Best Practices', 'Accessibility'],
    featured_image_url: null,
    meta_description: 'Best practices for building resilient React components including error boundaries, loading states, and accessibility.',
  },
  {
    id: '3',
    created_at: '2024-07-10T09:00:00Z',
    updated_at: '2024-07-10T09:00:00Z',
    title: 'Book Notes: "The Pragmatic Programmer"',
    slug: 'book-notes-pragmatic-programmer',
    content: `
"The Pragmatic Programmer" by Andrew Hunt and David Thomas is one of those rare technical books that remains relevant decades after publication. Here are my key takeaways and how they've influenced my work.

## DRY: Don't Repeat Yourself

This principle goes deeper than just avoiding copy-paste code. It's about identifying duplication of knowledge and intent:

- Database schema duplication in your ORM models
- Business logic scattered across frontend and backend
- Configuration duplicated between environments

Every piece of knowledge should have a single, authoritative representation in your system.

## The Power of Plain Text

Hunt and Thomas advocate for plain text as a universal format. Years later, this advice has proven prescient:

- Configuration as code (Terraform, CloudFormation)
- Infrastructure as code
- Documentation as Markdown
- Logs as structured JSON

Plain text is human-readable, version-controllable, and tool-friendly.

## Tracer Bullets vs. Prototypes

One concept that changed how I approach projects: tracer bullets are not prototypes.

**Prototypes** are throwaway experiments to answer questions.

**Tracer bullets** are minimal but complete implementations that you build upon.

When starting a new feature, I build a tracer bullet: a thin vertical slice that touches every layer of the system. This reveals integration issues early and provides a foundation to build on.

## Design by Contract

Preconditions, postconditions, and invariants aren't just academic concepts. They're powerful tools for preventing bugs:

\`\`\`typescript
function withdraw(amount: number): void {
  // Precondition
  assert(amount > 0, "Amount must be positive");
  assert(this.balance >= amount, "Insufficient funds");

  this.balance -= amount;

  // Postcondition
  assert(this.balance >= 0, "Balance cannot be negative");
}
\`\`\`

## Continuous Learning

Perhaps the most important lesson: invest regularly in your knowledge portfolio. Learn a new language every year, read technical and non-technical books, experiment with different technologies.

This book itself is part of that investment. Twenty years after publication, it's still teaching me new lessons on each re-read.

## Application to Modern Development

These principles map beautifully to modern practices:

- DRY → Single source of truth in state management
- Plain text → Configuration as code
- Tracer bullets → MVP and iterative development
- Design by contract → TypeScript and runtime validation
- Tool building → CLI tools, scripts, automation

The pragmatic approach isn't about following rules—it's about adapting principles to solve real problems effectively.
    `,
    excerpt: 'Key takeaways from "The Pragmatic Programmer" and how its timeless principles apply to modern software development.',
    published: true,
    published_at: '2024-07-10T09:00:00Z',
    author_id: 'sam',
    tags: ['Books', 'Engineering', 'Career'],
    featured_image_url: null,
    meta_description: 'Book notes and reflections on "The Pragmatic Programmer" and its application to modern software development.',
  },
  {
    id: '4',
    created_at: '2024-06-05T16:45:00Z',
    updated_at: '2024-06-05T16:45:00Z',
    title: 'The Art of Code Review: Beyond Finding Bugs',
    slug: 'art-of-code-review',
    content: `
Code review is one of the most important practices in software development, yet it's often reduced to a simple "LGTM" or a nitpick about formatting. Great code review is an art that improves code quality, spreads knowledge, and builds team culture.

## What to Look For

Beyond syntax and bugs, effective code reviews examine:

### Architecture and Design
- Does this change fit the existing architecture?
- Are we solving the right problem?
- Is this the simplest solution that could work?

### Maintainability
- Will someone understand this in six months?
- Are names clear and intentional?
- Is the complexity justified?

### Testing
- Are edge cases covered?
- Can this break in production?
- Are tests testing the right things?

### Performance and Security
- Are there obvious performance issues?
- Are we validating inputs?
- Could this leak sensitive data?

## How to Give Feedback

The way you deliver feedback matters as much as the feedback itself:

**Ask questions instead of making demands:**
- "Could we simplify this by...?" vs. "This is too complex"
- "What happens if userId is null?" vs. "This will break"

**Explain the why:**
- "Let's extract this into a hook so we can reuse it in the dashboard"
- "Moving this to a constant makes it easier to update across the app"

**Distinguish between preferences and problems:**
- "NIT: I prefer early returns, but this is fine"
- "BLOCKER: This creates a SQL injection vulnerability"

**Celebrate good work:**
- "This abstraction is really clean"
- "Great test coverage on the edge cases"

## How to Receive Feedback

Receiving code review feedback well is equally important:

- **Assume good intent** - Reviewers are trying to help, not criticize
- **Ask for clarification** - If you don't understand, ask
- **Push back respectfully** - If you disagree, explain your reasoning
- **Learn from patterns** - If you get the same feedback repeatedly, internalize it

## The Review Process

A good review process balances thoroughness with velocity:

1. **Small PRs** - Easier to review, faster to merge
2. **Self-review first** - Catch obvious issues before requesting review
3. **Clear descriptions** - Explain what and why
4. **Timely reviews** - Don't let PRs sit for days
5. **Follow-up** - Address feedback promptly

## Building Team Culture

Code review shapes team culture:

- **Shared ownership** - Everyone is responsible for code quality
- **Knowledge sharing** - Junior devs learn from senior devs and vice versa
- **Standards emergence** - Patterns and conventions evolve naturally
- **Psychological safety** - Foster an environment where it's safe to make mistakes

## Automation and Tools

Automate what you can to focus on what matters:

- **Linters** for formatting and style
- **Type checkers** for type safety
- **CI/CD** for builds and tests
- **Security scanners** for vulnerabilities

This frees reviewers to focus on logic, architecture, and design.

## The Long Game

Great code review is an investment that pays dividends:

- Fewer bugs reach production
- Code quality improves over time
- Knowledge spreads across the team
- New team members onboard faster
- Technical debt accumulates slower

Code review isn't a gate to slow down development—it's a practice that makes development better.
    `,
    excerpt: 'Effective code review goes beyond finding bugs. Learn how to give and receive feedback that improves code quality and builds team culture.',
    published: true,
    published_at: '2024-06-05T16:45:00Z',
    author_id: 'sam',
    tags: ['Engineering', 'Best Practices', 'Team'],
    featured_image_url: null,
    meta_description: 'A comprehensive guide to effective code review, including how to give feedback, receive feedback, and build team culture.',
  },
  {
    id: '5',
    created_at: '2024-05-18T11:20:00Z',
    updated_at: '2024-05-18T11:20:00Z',
    title: 'Server Components vs Client Components in Next.js',
    slug: 'server-vs-client-components-nextjs',
    content: `
Next.js 13+ introduced React Server Components, fundamentally changing how we think about building applications. Understanding when to use server vs client components is crucial for building performant, scalable apps.

## The Mental Model

The key insight: **Start with server components by default**. Only reach for client components when you need interactivity, browser APIs, or state management.

### Server Components (Default)

Server components run only on the server and send HTML to the client:

\`\`\`typescript
// app/posts/page.tsx
async function PostsPage() {
  const posts = await db.query('SELECT * FROM posts');

  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
\`\`\`

**Benefits:**
- Zero JavaScript sent to client
- Direct database access
- Secure (API keys stay on server)
- SEO-friendly
- Fast initial load

**Limitations:**
- No useState, useEffect, or other hooks
- No browser APIs
- No event handlers

### Client Components

Add \`'use client'\` when you need interactivity:

\`\`\`typescript
'use client';

function LikeButton({ postId }: { postId: string }) {
  const [likes, setLikes] = useState(0);

  const handleLike = async () => {
    await fetch(\`/api/posts/\${postId}/like\`, { method: 'POST' });
    setLikes(prev => prev + 1);
  };

  return (
    <button onClick={handleLike}>
      Like ({likes})
    </button>
  );
}
\`\`\`

**Use client components for:**
- User interactions (clicks, inputs, etc.)
- State management (useState, useReducer)
- Browser APIs (localStorage, window, etc.)
- Effects (useEffect, useLayoutEffect)
- Custom hooks that use the above

## Composition Patterns

The power comes from composing server and client components effectively:

### Pattern 1: Client Component Islands

Embed interactive client components within server components:

\`\`\`typescript
// Server component
async function BlogPost({ slug }: { slug: string }) {
  const post = await getPost(slug);

  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
      {/* Client component island */}
      <LikeButton postId={post.id} />
    </article>
  );
}
\`\`\`

### Pattern 2: Passing Server Components as Props

You can pass server components to client components as children:

\`\`\`typescript
// Client component
'use client';
function Tabs({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState(0);
  // Tab switching logic...
  return <div>{children}</div>;
}

// Server component
async function Page() {
  const data = await fetchData();

  return (
    <Tabs>
      <ServerDataView data={data} />
    </Tabs>
  );
}
\`\`\`

### Pattern 3: Selective Hydration

Split components to minimize client JavaScript:

\`\`\`typescript
// Mostly static, server component
function ProductCard({ product }: { product: Product }) {
  return (
    <div>
      <Image src={product.image} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      {/* Only the button needs interactivity */}
      <AddToCartButton productId={product.id} />
    </div>
  );
}
\`\`\`

## Data Fetching Patterns

Server components enable new data fetching patterns:

### Parallel Data Fetching

\`\`\`typescript
async function Dashboard() {
  // These fetch in parallel
  const [user, posts, stats] = await Promise.all([
    getUser(),
    getPosts(),
    getStats(),
  ]);

  return (
    <div>
      <UserProfile user={user} />
      <PostsList posts={posts} />
      <StatsPanel stats={stats} />
    </div>
  );
}
\`\`\`

### Sequential Data Fetching

\`\`\`typescript
async function UserPosts({ userId }: { userId: string }) {
  const user = await getUser(userId);
  const posts = await getUserPosts(user.id);

  return <PostsList posts={posts} />;
}
\`\`\`

## Common Pitfalls

**1. Making everything a client component**
Don't add \`'use client'\` to the root layout unless necessary. Push it down to the smallest component that needs it.

**2. Fetching data in client components**
Prefer server components for data fetching. Use client components only for interactive UI.

**3. Passing complex objects to client components**
Keep props simple and serializable. No functions, no Date objects.

## Performance Benefits

The impact is significant:

- **Reduced bundle size** - Only interactive components ship JavaScript
- **Faster initial load** - Less JavaScript to parse and execute
- **Better SEO** - Content is in the initial HTML
- **Improved Core Web Vitals** - Faster LCP, lower CLS

## The Future

Server components represent a fundamental shift in web development. By default, we send HTML. JavaScript becomes opt-in for interactivity.

This isn't just a performance optimization—it's a new way of thinking about client-server boundaries that makes apps faster and simpler.
    `,
    excerpt: 'Understanding React Server Components in Next.js 13+: when to use server vs client components, composition patterns, and performance benefits.',
    published: true,
    published_at: '2024-05-18T11:20:00Z',
    author_id: 'sam',
    tags: ['Next.js', 'React', 'Engineering', 'Performance'],
    featured_image_url: null,
    meta_description: 'Comprehensive guide to React Server Components in Next.js, including patterns, best practices, and performance benefits.',
  },
  {
    id: '6',
    created_at: '2024-04-12T13:00:00Z',
    updated_at: '2024-04-12T13:00:00Z',
    title: 'Why I Use Linear for Project Management',
    slug: 'why-i-use-linear',
    content: `
After years of using Jira, Trello, Asana, and various other project management tools, I've settled on Linear for my personal and team projects. Here's why it's become indispensable to my workflow.

## Speed is a Feature

Linear is *fast*. Not just fast for a web app—fast, period. Every action feels instantaneous:

- Creating issues
- Updating status
- Searching
- Navigation

When your tools are slow, you avoid using them. When they're fast, they disappear and let you focus on the work.

## Keyboard-First Design

Almost everything can be done via keyboard:

- \`C\` to create issue
- \`/\` to search
- \`Cmd+K\` for command palette
- Vim-style navigation

Once you learn the shortcuts, the UI fades away. You're just managing your work, not clicking through menus.

## Clean, Focused Interface

Linear's interface is beautiful but more importantly, it's **uncluttered**:

- No overwhelming sidebars
- No navigation mystery meat
- Clear hierarchy
- Generous whitespace

The design gets out of your way and lets you think about your work.

## Smart Defaults

Linear makes good assumptions about how software teams work:

- Issues flow through defined states (Backlog → Todo → In Progress → Done)
- Issues can be organized in cycles (sprints) or projects
- Priorities are simple (None, Low, Medium, High, Urgent)
- Built-in views for common workflows

You can customize, but the defaults are so good you rarely need to.

## GitHub Integration

The GitHub integration is seamless:

- Branch names auto-generated from issue titles
- PRs link automatically to issues
- Issue status updates when PR is merged
- All without manual work

This closes the loop between planning and execution.

## Workflow Automation

Linear's automations are powerful but simple:

- Auto-assign issues based on labels
- Auto-update status when PR is opened
- Auto-archive old issues
- Custom workflows for your team

Set it up once, forget about it.

## What It's Missing

Linear isn't perfect:

- **No time tracking** - Use Toggl separately
- **Limited reporting** - Basic insights only
- **Opinionated** - The structure is somewhat rigid

But these "limitations" keep the tool focused and fast.

## Who Should Use Linear

Linear is perfect for:

- Software engineering teams
- Anyone who values speed and keyboard shortcuts
- Teams using GitHub
- Projects that fit the issue/cycle/project model

It's less suitable for:

- Non-technical teams
- Complex project dependencies
- Heavy gantt chart users
- Teams needing extensive customization

## The Philosophy

Linear embodies a philosophy: **tools should be fast, focused, and beautiful**. They should enhance your workflow without becoming the workflow itself.

It's not just project management software—it's a statement about how software should feel to use.

After a year with Linear, I can't imagine going back to slower, more complex tools. Speed matters. Clarity matters. Linear gets both right.
    `,
    excerpt: 'Why Linear has become my go-to project management tool: speed, keyboard-first design, and a philosophy that tools should enhance workflow.',
    published: true,
    published_at: '2024-04-12T13:00:00Z',
    author_id: 'sam',
    tags: ['Tools', 'Productivity', 'Engineering'],
    featured_image_url: null,
    meta_description: 'A review of Linear project management tool and why it has become essential for modern software development teams.',
  },
];

// Helper function to get a post by slug
export function getPostBySlug(slug: string): Post | undefined {
  return mockPosts.find(post => post.slug === slug);
}

// Helper function to get all published posts
export function getPublishedPosts(): Post[] {
  return mockPosts
    .filter(post => post.published)
    .sort((a, b) => new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime());
}

// Helper function to get all unique tags
export function getAllTags(): string[] {
  const tags = new Set<string>();
  mockPosts.forEach(post => {
    post.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
}

// Helper function to filter posts by tag
export function getPostsByTag(tag: string): Post[] {
  return mockPosts
    .filter(post => post.published && post.tags.includes(tag))
    .sort((a, b) => new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime());
}
