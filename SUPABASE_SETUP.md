# Supabase Setup Guide

This guide will walk you through setting up Supabase for your personal website, including creating the project, configuring the database, and connecting it to your Next.js application.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm installed
- This Next.js project cloned and dependencies installed

## Step 1: Create a Supabase Project

1. **Log in to Supabase**
   - Go to [app.supabase.com](https://app.supabase.com)
   - Log in or create an account

2. **Create a New Project**
   - Click "New Project"
   - Fill in the project details:
     - **Name**: `sam-swerczek-website` (or your preferred name)
     - **Database Password**: Create a strong password and **save it securely**
     - **Region**: Choose the region closest to your target audience (e.g., `us-east-1` for US East Coast)
     - **Pricing Plan**: Free tier is sufficient to start
   - Click "Create new project"
   - Wait 2-3 minutes for the project to be provisioned

## Step 2: Get Your API Keys

Once your project is ready:

1. **Navigate to Project Settings**
   - Click on the gear icon (⚙️) in the left sidebar
   - Go to "API" section

2. **Copy Your Credentials**
   You'll need three values:

   - **Project URL**:
     - Found under "Project URL"
     - Format: `https://xxxxxxxxxxxxx.supabase.co`

   - **Anon/Public Key** (NEXT_PUBLIC_SUPABASE_ANON_KEY):
     - Found under "Project API keys" → "anon public"
     - This is safe to use in client-side code
     - Starts with `eyJ...`

   - **Service Role Key** (SUPABASE_SERVICE_ROLE_KEY):
     - Found under "Project API keys" → "service_role"
     - ⚠️ **NEVER expose this key in client-side code**
     - Only use this in server-side code
     - Starts with `eyJ...`

## Step 3: Configure Environment Variables

1. **Create `.env.local` file**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Update `.env.local` with your Supabase credentials**
   ```bash
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   # Site Configuration
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

3. **Verify the file is ignored by git**
   - Check that `.env.local` is in your `.gitignore` file
   - Never commit this file to version control

## Step 4: Run Database Migrations

1. **Navigate to SQL Editor in Supabase Dashboard**
   - In your Supabase project dashboard
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

2. **Run the Initial Schema Migration**
   - Copy the contents of `supabase/migrations/001_initial_schema.sql`
   - Paste it into the SQL editor
   - Click "Run" or press `Cmd/Ctrl + Enter`
   - You should see a success message

3. **Verify the Schema**
   - Click "Table Editor" in the left sidebar
   - You should see the following tables:
     - `posts`
     - `site_config`
     - `media` (optional)

## Step 5: Set Up Row Level Security (RLS)

The migration already includes RLS policies, but here's what was configured:

### Posts Table
- **Public Read Access**: Anyone can read published posts
  ```sql
  SELECT access for posts where published = true
  ```
- **Admin Write Access**: Only authenticated users can create/update/delete posts
  ```sql
  INSERT, UPDATE, DELETE access for authenticated users
  ```

### Site Config Table
- **Public Read Access**: Anyone can read site configuration
  ```sql
  SELECT access for all users
  ```
- **Admin Write Access**: Only authenticated users can modify config
  ```sql
  INSERT, UPDATE, DELETE access for authenticated users
  ```

### Media Table
- **Public Read Access**: Anyone can view media URLs
- **Admin Upload Access**: Only authenticated users can upload

## Step 6: Set Up Authentication

1. **Configure Email Auth**
   - Go to "Authentication" → "Providers" in the Supabase dashboard
   - Enable "Email" provider (should be enabled by default)

2. **Create Your Admin User**
   - Go to "Authentication" → "Users"
   - Click "Add user" → "Create new user"
   - Enter your email and a strong password
   - Click "Create user"
   - ✅ This is the account you'll use to log into `/admin`

3. **Configure Email Templates (Optional)**
   - Go to "Authentication" → "Email Templates"
   - Customize the email templates for password reset, confirmation, etc.

## Step 7: Configure Storage (Optional - for image uploads)

If you plan to upload images through the admin portal:

1. **Create a Storage Bucket**
   - Go to "Storage" in the Supabase dashboard
   - Click "New bucket"
   - Name it `blog-images` or `media`
   - Make it **public** (so images can be accessed via URL)
   - Click "Create bucket"

2. **Set Up Storage Policies**
   - Click on the bucket
   - Go to "Policies"
   - Add policies for:
     - **Public read access**: Anyone can view images
     - **Authenticated upload**: Only authenticated users can upload

## Step 8: Test the Connection

1. **Start your development server**
   ```bash
   npm run dev
   ```

2. **Test the Supabase connection**
   - Open your browser to `http://localhost:3000`
   - Check the browser console for any errors
   - The Supabase client should connect successfully

3. **Test a query (optional)**
   - Create a test file to verify the connection:
   ```typescript
   // test/supabase-test.ts
   import { supabase } from '@/lib/supabase/client';

   async function testConnection() {
     const { data, error } = await supabase.from('posts').select('count');
     console.log('Connection test:', { data, error });
   }
   ```

## Step 9: Seed Sample Data (Optional)

To test with sample blog posts:

1. **Go to SQL Editor in Supabase**
2. **Run this query to insert sample posts:**
   ```sql
   INSERT INTO posts (title, slug, content, excerpt, published, published_at, author_id, tags, meta_description)
   VALUES
   (
     'Welcome to My Blog',
     'welcome-to-my-blog',
     '# Welcome\n\nThis is my first blog post!',
     'Welcome to my personal website where I share thoughts on engineering and music.',
     true,
     NOW(),
     (SELECT id FROM auth.users LIMIT 1),
     ARRAY['general', 'welcome'],
     'Welcome to my personal blog covering software engineering and music.'
   );
   ```

3. **Verify the data**
   - Go to "Table Editor" → "posts"
   - You should see your sample post

## Step 10: Production Deployment

When deploying to Vercel:

1. **Add Environment Variables to Vercel**
   - Go to your Vercel project settings
   - Navigate to "Environment Variables"
   - Add the same variables from `.env.local`:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `NEXT_PUBLIC_SITE_URL` (update to your production URL)

2. **Update Supabase Auth Settings**
   - In Supabase dashboard → "Authentication" → "URL Configuration"
   - Add your production URL to "Site URL"
   - Add your production URL to "Redirect URLs"

3. **Update CORS Settings (if needed)**
   - Go to "Settings" → "API"
   - Add your production domain to allowed origins

## Troubleshooting

### Connection Issues
- **Error: "Invalid API key"**
  - Double-check your API keys in `.env.local`
  - Ensure you're using the correct project URL
  - Restart your dev server after changing env variables

- **Error: "Failed to fetch"**
  - Check your internet connection
  - Verify the Supabase project is running (not paused)
  - Check for CORS issues in browser console

### Authentication Issues
- **Can't log in to admin**
  - Verify you created a user in Supabase Auth dashboard
  - Check that the email/password are correct
  - Ensure RLS policies are properly configured

### Database Issues
- **Error: "permission denied for table posts"**
  - Verify RLS policies are enabled
  - Check that you're authenticated when making writes
  - Use the service role key for admin operations

- **Error: "relation 'posts' does not exist"**
  - Ensure you ran the migration SQL
  - Check the SQL Editor for any error messages
  - Verify you're connected to the correct project

## Next Steps

✅ Supabase is now configured! You can:
- Start building the admin portal authentication (Phase 6)
- Create blog posts through the admin interface
- Fetch and display posts on the public blog
- Upload images to Supabase Storage
- Configure site settings in the `site_config` table

## Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

## Support

If you encounter issues:
1. Check the [Supabase Discord](https://discord.supabase.com)
2. Review the [Supabase GitHub Discussions](https://github.com/orgs/supabase/discussions)
3. Check the browser console and network tab for errors
4. Verify environment variables are loaded correctly
