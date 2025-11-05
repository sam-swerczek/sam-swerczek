# Contributing Guidelines

Welcome! This guide explains how to contribute to this project, whether you're human or AI.

## Development Workflow

### 1. Setting Up

```bash
git clone https://github.com/yourusername/personal-page
cd personal-page
npm install
```

See [Quick Start Guide](../getting-started/QUICK_START.md) for detailed setup.

### 2. Creating a Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates

### 3. Development Principles

Follow the patterns documented in [Development Patterns](../development/DEVELOPMENT_PATTERNS.md):

- **Start with Server Components** (mark `'use client'` only when needed)
- **Use established component patterns** (Self-Contained, Client Wrapper, Layout)
- **Follow the design system** (colors, typography, spacing)
- **Respect animation tiers** (Tailwind → Framer Config → Custom)

### 4. Code Style

**TypeScript**:
- Strict mode enabled
- Use type annotations for function parameters and returns
- Prefer interfaces over types for object shapes

**Components**:
- One component per file (except small helper components)
- Props interfaces named `{ComponentName}Props`
- Use descriptive names (not abbreviations)

**Naming Conventions**:
```typescript
// Components
MyComponent.tsx

// Utilities
formatDate.ts

// Hooks
useAuth.ts

// Types
types.ts (or types/index.ts)
```

### 5. Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

**What to test**:
- Component rendering
- User interactions
- Conditional logic
- Accessibility

**What not to test**:
- Server Actions (covered by integration tests)
- Database queries (Supabase handles this)
- Third-party library behavior

### 6. Committing Changes

**Commit message format**:
```
type: brief description

Longer explanation if needed (optional)

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

**Types**:
- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code refactoring
- `docs` - Documentation changes
- `style` - Formatting, missing semicolons, etc.
- `test` - Adding or updating tests
- `chore` - Build process, dependencies

**Examples**:
```
feat: add dark mode toggle to user settings

fix: resolve YouTube player not loading on Safari

refactor: standardize Header component to use props pattern

docs: update development patterns with animation examples
```

### 7. Creating Pull Requests

```bash
# Push your branch
git push origin feature/your-feature-name

# Create PR using GitHub CLI (optional)
gh pr create --title "Add dark mode toggle" --body "Implements user-requested dark mode feature"
```

**PR Description Template**:
```markdown
## Summary
Brief description of what this PR does

## Changes
- List of key changes
- Another change

## Testing
How to test this feature:
1. Step one
2. Step two

## Screenshots (if applicable)
[Add screenshots of UI changes]

🤖 Generated with Claude Code
```

---

## Working with AI Agents

This project extensively uses AI agents (Claude Code) for development. See [AI Agents Guide](./AI_AGENTS.md) for:

- How to work with different specialized agents
- When to delegate to specific agents
- Best practices for AI collaboration
- Patterns that have worked well

**Key Agents**:
- `@agent-lead-engineer` - Architecture decisions, refactoring
- `@agent-web-design-architect` - Design system, UI/UX
- `@agent-documentation-maintainer` - Documentation updates
- `@agent-security-auditor` - Security reviews

**When to Consult Agents**:
- Before implementing major features
- Before committing changes (security + architecture review)
- When unsure about patterns to use
- For code reviews and refactoring suggestions

---

## Code Review Checklist

Before creating a PR, ensure:

- [ ] Code follows established patterns (see DEVELOPMENT_PATTERNS.md)
- [ ] Tests written and passing
- [ ] TypeScript has no errors
- [ ] Components use proper client/server boundaries
- [ ] Animations respect reduced motion preferences
- [ ] Accessibility considerations addressed (ARIA labels, keyboard nav)
- [ ] No hardcoded secrets or API keys
- [ ] Documentation updated if needed
- [ ] Security review completed (for sensitive changes)

---

## Getting Help

- **Documentation**: Check [Documentation Index](../INDEX.md) first
- **Patterns**: See [Development Patterns](../development/DEVELOPMENT_PATTERNS.md)
- **Architecture**: See [Architecture Overview](../architecture/OVERVIEW.md)
- **AI Agents**: See [AI Agents Guide](./AI_AGENTS.md)

---

**Questions?** Open an issue or reach out to the maintainer.

Last updated: 2025-01-05
