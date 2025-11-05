# Sam Swerczek

> Software engineer, musician, and maker of things

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Powered-green?style=flat&logo=supabase)](https://supabase.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel)](https://vercel.com/)

## About This Project

This is my personal website—a place to share my thoughts on software engineering, showcase my music, and experiment with web technologies I find interesting. It's both a portfolio and a playground, built with Next.js and designed to serve two audiences: those interested in my engineering work and those who want to hear my music.

The site features a full-featured CMS for managing content, a custom YouTube-based music player, and is built with modern web technologies that I enjoy working with. It's also a testing ground for collaboration patterns with AI agents—something I document extensively.

## What's Inside

**Blog** - Technical articles about software engineering, web development, music production, and creative work. Features tag-based filtering, search, and AI-assisted content generation.

**Music Player** - Custom YouTube-based player with playlist management that provides continuous playback while navigating the site. Integrates with streaming platforms like Spotify and Apple Music.

**Admin Portal** - Full-featured CMS for managing blog posts, music content, and site configuration. Includes AI-powered blog post generation using Claude.

**AI-Assisted Development** - Documented collaboration patterns with AI agents, including architectural decisions, refactoring journeys, and development workflows.

## Tech Stack

**Core**: Next.js 15 · React 19 · TypeScript · Tailwind CSS

**Backend**: Supabase (PostgreSQL, Auth, RLS) · Next.js API Routes

**Integrations**: Claude AI (Anthropic) · Resend (Email) · YouTube IFrame API

**Animation**: Framer Motion · Custom CSS animations

**Deployment**: Vercel

## Documentation

Comprehensive documentation is available to help you understand the architecture, contribute, or learn from the patterns used:

### Getting Started
- **[Quick Start Guide](./docs/getting-started/QUICK_START.md)** - Run locally or deploy
- **[Setup Guide](./docs/getting-started/SETUP_GUIDE.md)** - Environment configuration
- **[Deployment](./docs/getting-started/DEPLOYMENT.md)** - Vercel deployment instructions

### Development
- **[Development Patterns](./docs/development/DEVELOPMENT_PATTERNS.md)** ← **START HERE** for feature development
- **[Code Patterns](./docs/development/CODE_PATTERNS.md)** - Specific code examples
- **[Design System](./docs/development/DESIGN_SYSTEM.md)** - Colors, typography, components
- **[Testing Strategy](./docs/development/TESTING.md)** - Testing infrastructure

### Architecture
- **[Architecture Overview](./docs/architecture/OVERVIEW.md)** - High-level system design
- **[Technical Architecture](./docs/architecture/TECHNICAL_ARCHITECTURE.md)** - Deep technical dive
- **[Authentication](./docs/architecture/AUTHENTICATION.md)** - Auth implementation
- **[YouTube Player](./docs/architecture/YOUTUBE_PLAYER.md)** - Player architecture

### Collaboration
- **[AI Agents Guide](./docs/collaboration/AI_AGENTS.md)** - Working with AI agents
- **[Contributing](./docs/collaboration/CONTRIBUTING.md)** - How to contribute

### Reference
- **[Design Decisions](./docs/reference/DESIGN_DECISIONS.md)** - Historical design choices
- **[Refactoring Journey](./docs/reference/REFACTORING_JOURNEY.md)** - Evolution of the codebase

**→ [Full Documentation Index](./docs/INDEX.md)**

## Quick Start

Want to run this locally?

```bash
git clone https://github.com/yourusername/personal-page
cd personal-page
npm install
npm run dev
```

For detailed setup including environment variables and database configuration, see the **[Quick Start Guide](./docs/getting-started/QUICK_START.md)**.

## Project Highlights

This project showcases several interesting technical implementations:

- **Server Components First** - Leverages Next.js 15 App Router with strategic use of Server and Client Components
- **Persistent Media Player** - YouTube player that continues playback during navigation without remounting
- **AI-Powered CMS** - Claude API integration for blog post generation
- **Row-Level Security** - Database-level security with Supabase RLS policies
- **Animation System** - Three-tier animation architecture (Tailwind, Framer Motion, custom)
- **Documented Patterns** - Extensive documentation of architectural decisions and development patterns

## Contributing

Contributions, suggestions, and feedback are welcome! Please see **[Contributing Guidelines](./docs/collaboration/CONTRIBUTING.md)** for details on the development workflow and how to work with AI agents on this project.

## License

All rights reserved. This code is provided for portfolio and educational purposes.

---

Built with ☕ and 🎵 by Sam Swerczek
