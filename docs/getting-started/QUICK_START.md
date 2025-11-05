# Quick Start Guide

Get the project running locally in minutes.

## Prerequisites

- Node.js 18+
- npm or yarn
- Git

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/personal-page
cd personal-page

# Install dependencies
npm install
```

## Environment Variables

Create `.env.local` in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Integration (Optional - for blog post generation)
ANTHROPIC_API_KEY=your_claude_api_key

# Email Service (Optional - for contact form)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
CONTACT_TO_EMAIL=your@email.com
```

**Where to get these values**:
- **Supabase keys**: Project Settings → API in Supabase dashboard
- **Anthropic API key**: https://console.anthropic.com/
- **Resend API key**: https://resend.com/api-keys

## Database Setup

See the [Setup Guide](./SETUP_GUIDE.md) for detailed database configuration instructions.

Quick version:
1. Create a Supabase project
2. Run migrations from `/supabase/migrations/`
3. Configure Row-Level Security (RLS) policies

## Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing

```bash
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

## Common Issues

### Port 3000 already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Supabase connection errors
- Verify your `.env.local` has correct URLs and keys
- Check that your Supabase project is active
- Ensure RLS policies are configured

### Build errors
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

## Next Steps

- Read [Development Patterns](../development/DEVELOPMENT_PATTERNS.md) to understand code structure
- Explore [Architecture Overview](../architecture/OVERVIEW.md) for system design
- Check [Contributing Guide](../collaboration/CONTRIBUTING.md) if you want to contribute

---

Need more help? See the [Full Documentation Index](../INDEX.md)
