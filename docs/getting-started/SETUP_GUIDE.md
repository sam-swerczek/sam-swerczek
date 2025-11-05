# Development Environment Setup

Complete guide to setting up your development environment.

## Database Configuration

### Supabase Project Creation

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose a project name, database password, and region
3. Wait for project provisioning (2-3 minutes)

### Running Migrations

The database schema is defined in `/supabase/migrations/`.

**Using Supabase CLI** (recommended):
```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

**Manual SQL execution**:
1. Go to Supabase Dashboard → SQL Editor
2. Copy content from `/supabase/migrations/001_initial_schema.sql`
3. Execute the SQL

### Row-Level Security (RLS)

All tables have RLS enabled. Key policies:

**Public access**:
- Anyone can view published posts
- Anyone can view site configuration

**Authenticated access**:
- Authenticated users can manage all posts
- Authenticated users can manage site configuration

Policies are defined in the migration files.

### Creating Admin User

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add user" → "Create new user"
3. Enter email and password
4. User can now access `/admin` routes

## API Keys Configuration

### Anthropic Claude API (Optional)

For AI-powered blog post generation:
1. Create account at https://console.anthropic.com/
2. Generate API key
3. Add to `.env.local` as `ANTHROPIC_API_KEY`

### Resend Email API (Optional)

For contact form emails:
1. Create account at https://resend.com
2. Verify your sending domain
3. Generate API key
4. Add to `.env.local`:
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL` (verified sender)
   - `CONTACT_TO_EMAIL` (where to receive contact form submissions)

## Deployment Configuration

See [Deployment Guide](./DEPLOYMENT.md) for Vercel deployment instructions.

---

**Troubleshooting**: See [Quick Start Guide](./QUICK_START.md#common-issues)
