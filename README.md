# Dual-Purpose Personal Website

> A production-grade personal portfolio built through AI pair programming with Claude Code

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Powered-green?style=flat&logo=supabase)](https://supabase.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel)](https://vercel.com/)

This is a modern full-stack personal website that serves two distinct audiences - music industry professionals and software engineering peers - through intelligent content routing, AI-assisted content creation, and a comprehensive admin CMS. The entire project was built collaboratively with Claude Code, demonstrating the power of AI-assisted development.

## What Makes This Interesting

### Dual-Audience Architecture
Rather than building separate sites, this project implements intelligent content routing to serve two completely different audiences (music portfolio vs. engineering blog) from a single codebase, with optimized experiences for each.

### AI-Powered Content Generation
The admin portal integrates Anthropic's Claude AI to generate complete blog post drafts - including title, content, tags, and SEO metadata - from simple prompts. This showcases practical AI integration in a real-world CMS.

### Modern Full-Stack Implementation
- **Next.js 15 App Router** with React Server Components and streaming SSR
- **Supabase** for authentication, database, and Row-Level Security
- **TypeScript** throughout for type safety
- **Comprehensive testing** with Jest and React Testing Library
- **Edge-ready middleware** for authentication and route protection

### Built Through AI Collaboration
Every feature - from database schema design to authentication flows to UI components - was developed through pair programming with Claude Code. The `/docs` folder contains the architectural decisions, flow diagrams, and setup guides that emerged from this collaborative process.

## Architecture Highlights

### Smart Routing & Content Strategy
```
/               Landing page with dual CTAs
/music          Curated music portfolio (Spotify, YouTube, social links)
/blog           Engineering blog with Markdown rendering
/blog/[slug]    Individual post pages with SEO optimization
/admin          Protected CMS with AI-assisted drafting
```

### Authentication & Security
- Supabase Auth with email/password
- Next.js middleware for route protection
- Row-Level Security (RLS) policies
- Server and client Supabase clients with proper session handling

### Database Schema
- **posts**: Blog content with versioning, tags, and publish states
- **site_config**: Dynamic configuration without redeployment
- **RLS policies**: Public read for published content, admin-only writes

### AI Integration
The `/api/generate-post` endpoint demonstrates practical LLM integration:
- Structured prompting for consistent output
- JSON response validation
- Error handling for API failures
- Integration with existing CMS workflow

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5.9 |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| AI | Anthropic Claude (Sonnet 4) |
| Email | Resend |
| Testing | Jest + React Testing Library |
| Deployment | Vercel |

## Key Features

- **Dual Content Routing**: Serve music and engineering audiences from one codebase
- **AI Blog Post Generator**: Claude-powered draft generation in the admin portal
- **Full CMS**: Create, edit, preview, and publish blog posts with Markdown support
- **Contact Form**: Resend integration for professional email delivery
- **Authentication**: Secure admin portal with Supabase Auth
- **Row-Level Security**: Database policies enforce access control
- **Responsive Design**: Mobile-first with Tailwind CSS
- **SEO Optimized**: Meta tags, structured data, and dynamic sitemaps
- **Type-Safe**: Full TypeScript coverage across frontend and backend
- **Tested**: Comprehensive test suite for components and utilities

## Documentation

Dive deeper into the technical implementation:

### Architecture & Design
- **[Architecture & Design Decisions](docs/ARCHITECTURE.md)** - System architecture, design patterns, and technical rationale
- **[Code Patterns & Organization](docs/CODE_PATTERNS.md)** - Coding conventions, component patterns, and project structure

### AI Collaboration
- **[AI Pair Programming Methodology](docs/AI_COLLABORATION.md)** - How this project was built with Claude Code
- **[Refactoring Journey](docs/REFACTORING_JOURNEY.md)** - Evolution from MVP to production-quality code

### Development & Operations
- **[Testing Strategy](docs/TESTING.md)** - Testing approach, infrastructure, and best practices
- **[Supabase Setup Guide](docs/SUPABASE_SETUP.md)** - Database configuration and schema setup
- **[Authentication System](docs/AUTHENTICATION.md)** - Auth implementation details
- **[Auth Flow Diagram](docs/AUTH_FLOW_DIAGRAM.md)** - Visual authentication flow
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Vercel deployment and environment configuration

## Project Structure

```
/app                      # Next.js App Router pages
  /admin                  # Protected admin portal
    /posts                # Post management CRUD
    /config               # Site configuration
    /login                # Authentication
  /blog                   # Public blog listing & posts
  /music                  # Music portfolio
  /contact                # Contact form
  /api                    # API routes
    /generate-post        # AI blog generation endpoint
    /contact              # Email sending endpoint

/components               # React components
  /admin                  # Admin UI components
  /blog                   # Blog UI components
  /contact                # Contact form components
  /home                   # Landing page sections
  /layout                 # Header, Footer, Navigation
  /music                  # Music portfolio components
  /ui                     # Reusable UI primitives

/lib                      # Utilities and configuration
  /supabase               # Database clients (browser, server, admin)
  /utils                  # Helper functions
  /hooks                  # Custom React hooks

/docs                     # Technical documentation
/supabase/migrations      # Database schema migrations
```

## Development

### Prerequisites
- Node.js 18+
- npm or pnpm
- Supabase account (free tier works)
- Anthropic API key (for AI features)

### Quick Start
```bash
# Clone the repository
git clone https://github.com/sam-swerczek/sam-swerczek.git
cd sam-swerczek

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase and Anthropic credentials

# Run database migrations
# See docs/SUPABASE_SETUP.md for detailed instructions

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the site.

### Testing
```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## Live Site

The production site is deployed on Vercel with automatic deployments from the `main` branch.

**Note:** This is a personal portfolio project. The repository demonstrates architecture and implementation patterns, but the live site is specific to Sam Swerczek's content.

## Lessons from AI Collaboration

This project was built entirely through pair programming with Claude Code. Key takeaways:

1. **Documentation as Development**: Writing clear docs (see `/docs`) helped clarify architecture before implementation
2. **Iterative Refinement**: AI excels at generating initial implementations that can be refined through conversation
3. **Type Safety**: TypeScript caught many errors that would have been harder to debug in plain JavaScript
4. **Test-Driven Thinking**: Explaining desired behavior for tests helped clarify requirements
5. **Schema-First Design**: Designing the database schema early provided a solid foundation for everything else

## Future Enhancements

Potential areas for expansion:

- **Analytics Dashboard**: View metrics for blog posts
- **Comments System**: Add threaded discussions to blog posts
- **Newsletter**: Email subscriptions for new posts
- **RSS Feed**: Syndication support
- **Search**: Full-text search across blog posts
- **Dark Mode**: User-selectable theme
- **Multi-language**: i18n support
- **Image Optimization**: Automatic resizing and WebP conversion
- **PWA**: Progressive Web App capabilities

## License

All rights reserved. This code is provided for portfolio and educational purposes.

---

**Built with:** Next.js, TypeScript, Supabase, Anthropic Claude, and a lot of AI-assisted iteration.
