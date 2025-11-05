# Testing Documentation

This document outlines the testing philosophy, infrastructure, and practices for the personal website project.

## Testing Philosophy

The testing approach for this project is **pragmatic and focused on critical paths**:

- **Quality over Quantity**: Focus on testing functionality that matters most to users
- **Integration over Unit**: Prioritize integration tests that verify component behavior in realistic scenarios
- **Maintainability First**: Write tests that are easy to understand, maintain, and refactor
- **Confidence for Refactoring**: Tests should enable confident code improvements without fear of breaking core functionality

The project maintains **97 passing tests** across critical user flows and core components.

## Testing Stack

The project uses a modern React testing stack:

- **Jest** (v30.2.0) - Test runner and assertion library
- **React Testing Library** (v16.3.0) - Component testing utilities that encourage good testing practices
- **@testing-library/jest-dom** (v6.9.1) - Custom Jest matchers for DOM assertions
- **@testing-library/user-event** (v14.6.1) - User interaction simulation
- **jest-environment-jsdom** (v30.2.0) - Browser-like environment for React component testing
- **marked** library - Used for markdown parsing, replacing custom implementations

## Test Coverage Areas

The test suite focuses on three primary areas:

### 1. Contact Form (97 tests total across all areas)
Comprehensive testing of the contact form includes:
- Form rendering and field validation
- User interactions and input handling
- Form submission flow with API mocking
- Success and error state handling
- Loading states and button disabling
- Accessibility features

**Key Test Files:**
- `/Users/samswerczek/Projects/Personal_Page/components/contact/__tests__/ContactForm.test.tsx` (664 lines, most comprehensive)

### 2. Core Components
Testing essential UI components:
- **HeroSection**: Landing page hero with navigation links
- **Header**: Site navigation
- **Footer**: Site footer links and information

**Key Test Files:**
- `/Users/samswerczek/Projects/Personal_Page/components/home/__tests__/HeroSection.test.tsx`
- `/Users/samswerczek/Projects/Personal_Page/components/layout/__tests__/Header.test.tsx`
- `/Users/samswerczek/Projects/Personal_Page/components/layout/__tests__/Footer.test.tsx`

### 3. Supabase Queries
Extensive mocking and testing of database queries:
- Published posts retrieval with filtering, pagination, and tag support
- Post lookup by slug
- Tag extraction and management
- Site configuration queries
- Featured and related posts
- Search functionality
- Slug availability checking

**Key Test Files:**
- `/Users/samswerczek/Projects/Personal_Page/lib/supabase/__tests__/queries.test.ts` (758 lines)

## Configuration

### Jest Configuration

The project uses Next.js-optimized Jest configuration:

```typescript
// jest.config.ts
import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
};

export default createJestConfig(config);
```

Key configuration features:
- **V8 coverage provider** for accurate code coverage reporting
- **jsdom environment** for browser-like DOM APIs
- **Path mapping** (`@/` alias) matching Next.js configuration
- **Flexible test matching** for both `__tests__/` folders and `.test.` files

### Test Setup

Global test setup includes mocking Next.js components:

```typescript
// jest.setup.ts
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() { /* ... */ },
  usePathname() { return '/'; },
  useSearchParams() { return new URLSearchParams(); },
}));

// Mock Next.js Image component
jest.mock('next/image', () => { /* ... */ });
```

## Running Tests

### NPM Scripts

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Example Output

```
Test Suites: 6 passed, 6 total
Tests:       97 passed, 97 total
Snapshots:   0 total
Time:        3.862 s
```

## Writing Tests

### Testing Patterns

#### 1. Component Rendering Tests

Test that components render with expected content:

```typescript
it('renders without crashing', () => {
  render(<HeroSection />);
  expect(screen.getByRole('heading', { name: /sam swerczek/i })).toBeInTheDocument();
});
```

#### 2. User Interaction Tests

Use `userEvent` to simulate real user interactions:

```typescript
it('allows user to type in name field', async () => {
  render(<ContactForm />);
  const user = userEvent.setup();

  const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
  await user.type(nameInput, 'John Doe');

  expect(nameInput.value).toBe('John Doe');
});
```

#### 3. Async Operations and Loading States

Test loading states during async operations:

```typescript
it('shows loading state during submission', async () => {
  render(<ContactForm />);
  const user = userEvent.setup();

  (global.fetch as jest.Mock).mockImplementation(
    () => new Promise((resolve) =>
      setTimeout(() => resolve({ ok: true, json: async () => ({}) }), 100)
    )
  );

  await fillForm(user);
  await user.click(screen.getByRole('button', { name: /send message/i }));

  await waitFor(() => {
    expect(screen.getByText(/sending.../i)).toBeInTheDocument();
  });
});
```

### Mocking Supabase

Supabase client is mocked using Jest's module mocking:

```typescript
jest.mock('../client', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

// In tests:
const mockQuery = {
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  order: jest.fn().mockResolvedValue({ data: mockPosts, error: null }),
};

(supabase.from as jest.Mock).mockReturnValue(mockQuery);
```

This pattern allows testing database queries without hitting a real database.

### Testing Async Functions

Always use `async/await` and `waitFor` for asynchronous operations:

```typescript
it('displays success message after successful submission', async () => {
  render(<ContactForm />);
  const user = userEvent.setup();

  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => ({ success: true }),
  });

  await fillForm(user);
  await user.click(screen.getByRole('button', { name: /send message/i }));

  await waitFor(() => {
    expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
  });
});
```

## Test Examples

### ContactForm Test Example

The ContactForm has the most comprehensive test coverage, demonstrating best practices:

```typescript
describe('Form Submission Flow', () => {
  const fillForm = async (user: ReturnType<typeof userEvent.setup>) => {
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const subjectInput = screen.getByLabelText(/subject/i);
    const messageInput = screen.getByLabelText(/message/i);

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(subjectInput, 'Test Subject');
    await user.type(messageInput, 'Test Message');
  };

  it('submits form with correct data when all fields are filled', async () => {
    render(<ContactForm />);
    const user = userEvent.setup();

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    await fillForm(user);

    const submitButton = screen.getByRole('button', { name: /send message/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        category: 'general',
        message: 'Test Message',
      }),
    });
  });
});
```

### Supabase Query Test Example

Testing database queries with comprehensive mocking:

```typescript
describe('getPublishedPosts', () => {
  it('should fetch all published posts with default options', async () => {
    const mockPosts: Post[] = [
      {
        id: '1',
        title: 'Test Post 1',
        slug: 'test-post-1',
        content: 'Content 1',
        excerpt: 'Excerpt 1',
        published: true,
        published_at: '2024-01-01T00:00:00Z',
        // ... other fields
      },
    ];

    const mockQuery = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: mockPosts, error: null }),
    };

    (supabase.from as jest.Mock).mockReturnValue(mockQuery);

    const result = await getPublishedPosts();

    expect(supabase.from).toHaveBeenCalledWith('posts');
    expect(mockQuery.select).toHaveBeenCalledWith('*');
    expect(mockQuery.eq).toHaveBeenCalledWith('published', true);
    expect(mockQuery.order).toHaveBeenCalledWith('published_at', { ascending: false });
    expect(result).toEqual(mockPosts);
  });
});
```

## Future Improvements

While the current test suite provides solid coverage of critical functionality, these areas could be expanded:

### 1. End-to-End Testing
Consider adding E2E tests using Playwright or Cypress to test:
- Complete user journeys (landing page to contact form submission)
- Blog navigation and reading experience
- Admin portal workflows
- Authentication flows

### 2. Visual Regression Testing
Implement visual regression testing to catch unintended UI changes:
- Screenshot comparison for critical pages
- Component appearance consistency
- Responsive design verification

### 3. Performance Testing
Add performance benchmarks for:
- Page load times
- Time to interactive (TTI)
- Largest contentful paint (LCP)
- First input delay (FID)

### 4. Accessibility Testing
Expand accessibility testing beyond basic checks:
- Screen reader compatibility testing
- Keyboard navigation verification
- ARIA attribute validation
- Color contrast verification

### 5. Additional Component Coverage
Add tests for:
- Blog post components
- Admin portal components
- Music page components
- Error boundaries

## Best Practices Summary

1. **Use descriptive test names** that explain what is being tested
2. **Arrange-Act-Assert pattern** for clear test structure
3. **Mock external dependencies** (API calls, database queries)
4. **Test user behavior**, not implementation details
5. **Use semantic queries** (`getByRole`, `getByLabelText`) over brittle selectors
6. **Test accessibility** as part of component testing
7. **Keep tests independent** - each test should be able to run in isolation
8. **Clean up after tests** with `beforeEach` and `afterEach` hooks
9. **Use helper functions** to reduce duplication in test code
10. **Test error states** as thoroughly as happy paths

---

*Last updated: 2025-10-04*
