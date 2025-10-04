# Deployment Guide - Personal Website

This guide will walk you through deploying your personal website to Vercel.

## Prerequisites

- Git repository initialized (✓ already done)
- Supabase project set up (✓ already done)
- Vercel account (sign up at https://vercel.com if needed)
- Production build tested locally (✓ already done)

## Step 1: Prepare for Deployment

### 1.1 Verify .gitignore

Make sure your `.gitignore` file includes:
```
.env.local
.env*.local
node_modules/
.next/
```

This ensures your secrets are never committed to Git.

### 1.2 Commit Your Changes

```bash
git add .
git commit -m "Prepare for deployment"
```

### 1.3 Push to GitHub

If you haven't already, create a GitHub repository and push your code:

```bash
# Create a new repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### 2.1 Import Project

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Next.js project

### 2.2 Configure Environment Variables

In the Vercel project settings, add these environment variables:

| Variable Name | Value | Where to Find |
|--------------|-------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | https://app.supabase.com/project/_/settings/api |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | https://app.supabase.com/project/_/settings/api |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | https://app.supabase.com/project/_/settings/api |
| `ANTHROPIC_API_KEY` | Your Anthropic API key | https://console.anthropic.com/ |
| `NEXT_PUBLIC_SITE_URL` | Your Vercel deployment URL | Will be provided after first deployment (e.g., https://your-project.vercel.app) |

**Important:** For the first deployment, you can set `NEXT_PUBLIC_SITE_URL` to a placeholder like `https://placeholder.vercel.app`. You'll update this after your first deployment.

### 2.3 Deploy

Click "Deploy" and wait for Vercel to build and deploy your site.

## Step 3: Post-Deployment Configuration

### 3.1 Update NEXT_PUBLIC_SITE_URL

1. After deployment completes, copy your Vercel deployment URL
2. Go to Vercel project settings > Environment Variables
3. Update `NEXT_PUBLIC_SITE_URL` with your actual Vercel URL
4. Redeploy the project

### 3.2 Update Supabase Authentication Settings

1. Go to your Supabase dashboard: https://app.supabase.com/project/_/auth/url-configuration
2. Add your Vercel URL to:
   - **Site URL**: `https://your-project.vercel.app`
   - **Redirect URLs**: Add `https://your-project.vercel.app/**` (wildcard)
3. Save the changes

### 3.3 Test Your Deployment

Visit your deployed site and test:

- [ ] Landing page loads correctly
- [ ] Music section displays properly
- [ ] Blog page shows published posts from Supabase
- [ ] Admin login works at `/admin/login`
- [ ] Can create/edit posts in admin portal
- [ ] AI blog post generation works

## Step 4: Custom Domain (Optional)

### 4.1 Add Custom Domain in Vercel

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain (e.g., `samswerczek.com`)
4. Follow Vercel's instructions to update your DNS settings

### 4.2 Update Environment Variables

After adding a custom domain:

1. Update `NEXT_PUBLIC_SITE_URL` in Vercel to your custom domain
2. Update Supabase redirect URLs to include your custom domain
3. Redeploy

## Troubleshooting

### Build Fails

- Check the build logs in Vercel dashboard
- Ensure all environment variables are set correctly
- Try running `npm run build` locally to reproduce the error

### Authentication Not Working

- Verify Supabase redirect URLs include your Vercel domain
- Check that `NEXT_PUBLIC_SITE_URL` matches your actual deployment URL
- Clear browser cache and cookies

### AI Generation Fails

- Verify `ANTHROPIC_API_KEY` is set correctly
- Check your Anthropic account has sufficient credits
- Review the API logs in Vercel Functions tab

### Database Connection Issues

- Verify Supabase keys are correct
- Check Supabase project is active
- Review Row Level Security (RLS) policies in Supabase

## Continuous Deployment

Vercel automatically deploys:
- **Main branch**: Deploys to production
- **Other branches**: Creates preview deployments

Simply push to GitHub and Vercel will handle the rest!

## Environment Variable Checklist

Before going live, verify all these are set in Vercel:

- [x] `NEXT_PUBLIC_SUPABASE_URL`
- [x] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [x] `SUPABASE_SERVICE_ROLE_KEY`
- [x] `ANTHROPIC_API_KEY`
- [x] `NEXT_PUBLIC_SITE_URL`

## Support

If you encounter issues:
- Check Vercel deployment logs
- Review Supabase logs
- Check browser console for errors
