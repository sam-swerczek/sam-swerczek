# Sam Swerczek - Personal Website

A dual-purpose personal website showcasing Sam Swerczek as both a singer-songwriter and software engineer.

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (to be configured)
- **Deployment**: Vercel (planned)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.local.example .env.local
   ```

4. Update `.env.local` with your Supabase credentials (when available)

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── music/             # Music portfolio
│   ├── blog/              # Blog section
│   └── admin/             # Admin portal
├── components/            # React components
│   ├── layout/           # Header, Footer
│   ├── ui/               # Reusable UI components
│   ├── music/            # Music-specific components
│   ├── blog/             # Blog-specific components
│   └── admin/            # Admin-specific components
├── lib/                   # Utilities and configuration
│   ├── supabase/         # Supabase client setup
│   ├── types/            # TypeScript types
│   └── utils/            # Helper functions
└── public/               # Static assets
```

## Current Status

**Phase 1 Complete**: Project Setup & Foundation
- Next.js with TypeScript and Tailwind CSS configured
- Project structure established
- Basic routing implemented
- Layout components (Header, Footer) created
- Supabase client library installed

## Next Steps

See [PROJECT_STRATEGY.md](./PROJECT_STRATEGY.md) for the full development roadmap.

**Phase 2**: Landing Page
- Create hero section with name and tagline
- Add two prominent CTAs (Music / Engineering)
- Add subtle animations

**Phase 3**: Music Section
- Add Spotify embed
- Add YouTube video embeds
- Create social media links section
- Add Patreon CTA

**Phase 4**: Blog Section
- Set up Supabase database schema
- Create blog listing page
- Implement blog post detail page
- Add markdown rendering

**Phase 5**: Admin Authentication
- Set up Supabase Auth
- Create login page
- Implement protected routes

**Phase 6**: Admin Content Management
- Build blog post creation/editing interface
- Add image upload functionality
- Create site config management

## License

All rights reserved.
