# Personal Portfolio & Blog

> A full-stack personal website combining music portfolio and engineering blog with AI-assisted content management

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Powered-green?style=flat&logo=supabase)](https://supabase.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel)](https://vercel.com/)

A modern personal website built with Next.js that serves dual purposes: showcasing music work and sharing engineering insights. Features a custom CMS with AI-powered blog post generation.

## Core Functionality

### Public Features

**Music Portfolio** (`/music`)
- Audio-only YouTube player with playlist support
- Streaming platform links (Spotify, Apple Music, YouTube Music)
- Featured performance videos
- Social media integration
- Upcoming shows section

**Engineering Blog** (`/blog`)
- Markdown-based blog posts with syntax highlighting
- Tag-based filtering and search
- Related posts recommendations
- SEO-optimized individual post pages

**Home Page** (`/`)
- Combined landing page for both audiences
- Featured works showcase
- Activity timeline (recent music & posts)
- Quick navigation to music or blog

**Contact Form** (`/contact`)
- Email delivery via Resend API
- Form validation
- Professional email formatting

### Admin Features

**Content Management** (`/admin/posts`)
- Create, edit, delete blog posts
- AI-powered draft generation using Claude API
- Markdown editor with live preview
- Tag management
- Publish/unpublish controls

**Music Management** (`/admin/songs`)
- Add/edit songs for the YouTube player
- Display order management
- Featured song selection
- YouTube video ID integration

**Site Configuration** (`/admin/config`)
- Dynamic site settings without redeployment
- Social media links
- Streaming platform URLs
- Featured video management

**Authentication**
- Supabase Auth with email/password
- Middleware-based route protection
- Row-level security (RLS) policies

## How It Works

### Routing Structure
```
/                    Landing page for both audiences
/music               Music portfolio page
/blog                Blog listing with filtering
/blog/[slug]         Individual blog post
/contact             Contact form
/admin               Admin dashboard (protected)
/admin/posts         Post management (protected)
/admin/songs         Song management (protected)
/admin/config        Site configuration (protected)
```

### Data Architecture
- **posts** table: Blog content with Markdown, tags, publish state
- **songs** table: YouTube playlist with metadata and ordering
- **site_config** table: Key-value pairs for dynamic settings
- Row-Level Security ensures public read, admin-only write

### AI Integration
The admin CMS includes Claude AI integration for blog post drafting:
- Prompt-based generation from brief descriptions
- Generates title, content, tags, and SEO metadata
- Integrates with existing editor workflow
- Optional - manual creation still fully supported

## Tech Stack

- **Framework**: Next.js 15 (App Router) with React Server Components
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL) with Row-Level Security
- **Authentication**: Supabase Auth
- **AI**: Anthropic Claude API (Sonnet 4)
- **Email**: Resend API
- **Testing**: Jest + React Testing Library
- **Deployment**: Vercel

## Project Structure

```
/app                      # Next.js App Router
  /admin                  # Protected admin routes
  /blog                   # Blog routes (listing + [slug])
  /music                  # Music portfolio
  /contact                # Contact form
  /api                    # API routes (AI generation, email)

/components               # React components
  /admin                  # Admin-specific components
  /blog                   # Blog components
  /home                   # Home page sections
  /layout                 # Header, Footer, Navigation
  /music                  # Music components (players, links)
  /ui                     # Reusable UI components

/lib                      # Utilities and config
  /supabase               # Database clients & queries
  /utils                  # Helper functions
  /types.ts               # TypeScript types

/supabase/migrations      # Database schema
```

## Documentation

Detailed technical documentation in `/docs`:
- [Architecture & Design](docs/ARCHITECTURE.md) - System design and patterns
- [Supabase Setup](docs/SUPABASE_SETUP.md) - Database configuration
- [Testing Strategy](docs/TESTING.md) - Test infrastructure
- [Deployment Guide](docs/DEPLOYMENT.md) - Vercel deployment

## Development

### Setup
```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.local.example .env.local
# Add your Supabase URL, keys, Anthropic API key, and Resend API key

# Run database migrations (see docs/SUPABASE_SETUP.md)

# Start dev server
npm run dev
```

### Testing
```bash
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

### Environment Variables
Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (admin operations)
- `ANTHROPIC_API_KEY` - Claude API key (for blog generation)
- `RESEND_API_KEY` - Resend API key (for contact form)
- `RESEND_FROM_EMAIL` - Verified sender email
- `CONTACT_TO_EMAIL` - Where to send contact form submissions

## License

All rights reserved. This code is provided for portfolio and educational purposes.
