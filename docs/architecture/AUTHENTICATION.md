# Admin Authentication System

This document describes the authentication system implemented for the Sam Swerczek personal website admin portal.

## Overview

The authentication system uses **Supabase Auth** with email/password authentication to protect admin routes. It includes:

- Login page with form validation
- Protected admin routes via middleware
- Session management with auto-refresh
- Logout functionality
- Auth context provider for easy access to auth state

## Architecture

### Components Created

#### 1. Authentication Hook (`lib/hooks/useAuth.ts`)
A custom React hook that manages authentication state and provides auth methods.

**Features:**
- Manages user state, loading state, and errors
- Listens to Supabase auth state changes
- Auto-refreshes user session
- Provides `signIn`, `signOut`, and `getUser` methods

**Usage:**
```tsx
const { user, loading, error, signIn, signOut } = useAuth();
```

#### 2. Auth Provider (`components/providers/AuthProvider.tsx`)
A React context provider that wraps the authentication hook and makes it available throughout the app.

**Features:**
- Provides auth context to child components
- Prevents usage outside of provider (throws error)
- Exports `useAuthContext` hook for consuming components

**Usage:**
```tsx
<AuthProvider>
  {children}
</AuthProvider>
```

#### 3. Login Page (`app/admin/login/page.tsx`)
A clean, accessible login form for admin authentication.

**Features:**
- Email and password input fields
- Form validation (client-side)
- Loading states with spinner animation
- Error message display with ARIA attributes
- Auto-redirect to `/admin` on successful login
- Disabled state when submitting
- Accessible labels and error announcements

**Design:**
- Muted color palette (dark background, blue accent)
- Professional, minimal design
- Responsive layout
- Smooth transitions

#### 4. Middleware (`middleware.ts` & `lib/supabase/middleware.ts`)
Next.js middleware that protects admin routes and manages session cookies.

**Protected Routes:**
- All `/admin/*` routes (except `/admin/login`)
- Redirects unauthenticated users to `/admin/login`
- Redirects authenticated users away from login page to `/admin`

**Features:**
- Uses Supabase SSR helpers for edge runtime compatibility
- Manages auth cookies properly
- Refreshes sessions automatically
- Works with Next.js Edge Runtime

#### 5. Admin Layout (`app/admin/layout.tsx`)
Custom layout for admin pages with navigation and logout.

**Features:**
- Admin header with user email display
- Logout button
- Navigation menu (Dashboard, Manage Posts, Site Config)
- Active route highlighting
- Different styling from public site (darker, utilitarian)
- Conditional rendering (no header/nav on login page)

**Design:**
- Dark background (`background-navy`)
- Professional admin interface
- Teal accent for status indicators
- Clear visual hierarchy

#### 6. Admin Dashboard (`app/admin/page.tsx`)
Updated dashboard with quick stats and action cards.

**Features:**
- Welcome message
- Quick stats (blog posts, drafts, views)
- Quick action cards linking to admin features
- Uses auth context to access user data

## Authentication Flow

### Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER REQUESTS /admin                         │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   MIDDLEWARE.TS       │
                    │  (Edge Runtime)       │
                    └───────────┬───────────┘
                                │
                                ▼
                ┌───────────────────────────────┐
                │  Check Session from Cookies   │
                │  (Supabase SSR Helper)        │
                └───────────┬───────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
        ┌─────────────┐         ┌─────────────┐
        │   No User   │         │  User Found │
        │   Found     │         │             │
        └──────┬──────┘         └──────┬──────┘
               │                       │
               ▼                       ▼
    ┌──────────────────┐    ┌──────────────────┐
    │ REDIRECT TO      │    │ PROCEED TO       │
    │ /admin/login     │    │ /admin/*         │
    └──────────────────┘    └──────────────────┘
               │                       │
               ▼                       ▼
    ┌──────────────────┐    ┌──────────────────┐
    │  LOGIN PAGE      │    │ ADMIN LAYOUT     │
    │  (Client)        │    │ with AuthProvider│
    └──────┬───────────┘    └──────────────────┘
           │                          │
           │                          ▼
           │                ┌──────────────────┐
           │                │ useAuth() Hook   │
           │                │ - Gets user data │
           │                │ - Manages state  │
           │                └──────────────────┘
           │                          │
           │                          ▼
           │                ┌──────────────────┐
           │                │ Show Dashboard,  │
           │                │ Navigation, etc. │
           │                └──────────────────┘
           │
           ▼
    ┌──────────────────┐
    │ User Enters      │
    │ Email/Password   │
    └──────┬───────────┘
           │
           ▼
    ┌──────────────────┐
    │ signIn() Called  │
    │ (useAuth hook)   │
    └──────┬───────────┘
           │
           ▼
    ┌──────────────────────────┐
    │ Supabase Auth API        │
    │ .signInWithPassword()    │
    └──────┬───────────────────┘
           │
           ├──────────┬──────────┐
           │          │          │
           ▼          ▼          ▼
      ┌────────┐ ┌────────┐ ┌────────┐
      │Success │ │Invalid │ │Network │
      │        │ │Creds   │ │Error   │
      └────┬───┘ └────┬───┘ └────┬───┘
           │          │          │
           │          ▼          ▼
           │     ┌─────────────────┐
           │     │ Show Error Msg  │
           │     │ User Can Retry  │
           │     └─────────────────┘
           │
           ▼
    ┌──────────────────┐
    │ Session Created  │
    │ Cookies Set      │
    └──────┬───────────┘
           │
           ▼
    ┌──────────────────┐
    │ Auth State       │
    │ Listener Fires   │
    └──────┬───────────┘
           │
           ▼
    ┌──────────────────┐
    │ Update Context   │
    │ user = {...}     │
    └──────┬───────────┘
           │
           ▼
    ┌──────────────────┐
    │ router.push()    │
    │ to /admin        │
    └──────┬───────────┘
           │
           ▼
    ┌──────────────────┐
    │ Middleware Runs  │
    │ Again (has user) │
    └──────┬───────────┘
           │
           ▼
    ┌──────────────────┐
    │ Shows Dashboard  │
    └──────────────────┘
```

### Component Relationship Diagram

```
┌──────────────────────────────────────────────────────┐
│                ROOT LAYOUT                           │
│  (app/layout.tsx)                                    │
│  - Global styles                                     │
│  - Public Header/Footer                              │
└──────────────────────────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼
┌──────────────┐           ┌──────────────────────────┐
│ PUBLIC PAGES │           │   ADMIN ROUTES           │
│              │           │   /admin/*               │
│ /, /blog,    │           │                          │
│ /music       │           └────────┬─────────────────┘
└──────────────┘                    │
                                    ▼
                        ┌───────────────────────┐
                        │  ADMIN LAYOUT         │
                        │  (app/admin/layout.tsx)│
                        └───────┬───────────────┘
                                │
                                ▼
                        ┌───────────────────────┐
                        │  <AuthProvider>       │
                        │  Wraps all admin pages│
                        └───────┬───────────────┘
                                │
                ┌───────────────┴───────────────┐
                │                               │
                ▼                               ▼
        ┌──────────────┐             ┌──────────────────┐
        │ LOGIN PAGE   │             │ PROTECTED PAGES  │
        │              │             │                  │
        │ Uses:        │             │ - Dashboard      │
        │ - useAuth()  │             │ - Posts Mgmt     │
        │ - signIn()   │             │ - Config         │
        │              │             │                  │
        │ (No header)  │             │ Uses:            │
        └──────────────┘             │ - useAuthContext()│
                                     │ - signOut()      │
                                     │                  │
                                     │ Shows:           │
                                     │ - Admin Header   │
                                     │ - Navigation     │
                                     │ - User Email     │
                                     │ - Logout Button  │
                                     └──────────────────┘
```

### Login Flow
1. User navigates to `/admin` (or any admin route)
2. Middleware checks for authenticated session
3. If not authenticated, redirects to `/admin/login`
4. User enters email and password
5. Form submits to Supabase Auth via `signIn` method
6. On success:
   - Session is stored in cookies
   - User state is updated in auth context
   - User is redirected to `/admin`
7. On failure:
   - Error message is displayed
   - User can retry

### Protected Route Access
1. User requests `/admin/*` route
2. Middleware runs on every request
3. Middleware checks Supabase session from cookies
4. If valid session:
   - User object is retrieved
   - Request proceeds to page
5. If no valid session:
   - User is redirected to `/admin/login`

### Logout Flow

```
┌─────────────────────────────────────────────────┐
│         User Clicks "Sign Out" Button           │
└─────────────────────┬───────────────────────────┘
                      │
                      ▼
        ┌──────────────────────────┐
        │  signOut() Called        │
        │  (from useAuthContext)   │
        └─────────────┬────────────┘
                      │
                      ▼
        ┌──────────────────────────┐
        │  Supabase:               │
        │  auth.signOut()          │
        └─────────────┬────────────┘
                      │
                      ▼
        ┌──────────────────────────┐
        │  - Cookies Cleared       │
        │  - Session Invalidated   │
        │  - Tokens Removed        │
        └─────────────┬────────────┘
                      │
                      ▼
        ┌──────────────────────────┐
        │  Auth State Listener:    │
        │  - Detects logout        │
        │  - Updates context       │
        │  - Sets user = null      │
        └─────────────┬────────────┘
                      │
                      ▼
        ┌──────────────────────────┐
        │  router.push()           │
        │  to /admin/login         │
        └─────────────┬────────────┘
                      │
                      ▼
        ┌──────────────────────────┐
        │  User Sees Login Page    │
        └──────────────────────────┘
```

### Session Management Flow

```
┌─────────────────────────────────────────────────┐
│           User Logs In Successfully             │
└─────────────────────┬───────────────────────────┘
                      │
                      ▼
        ┌──────────────────────────┐
        │  Supabase Creates:       │
        │  - Access Token (JWT)    │
        │  - Refresh Token         │
        │  - Session object        │
        └─────────────┬────────────┘
                      │
                      ▼
        ┌──────────────────────────┐
        │  Tokens Stored in:       │
        │  - httpOnly Cookies      │
        │  - Managed by Supabase   │
        │    SSR helpers           │
        └─────────────┬────────────┘
                      │
                      ▼
        ┌──────────────────────────┐
        │  On Each Request:        │
        │  - Middleware reads      │
        │    cookies               │
        │  - Validates session     │
        │  - Auto-refreshes if     │
        │    needed                │
        └─────────────┬────────────┘
                      │
                      ▼
        ┌──────────────────────────┐
        │  Session Valid Until:    │
        │  - User logs out         │
        │  - Token expires         │
        │  - Manual invalidation   │
        └──────────────────────────┘
```

**Key Points:**
- Sessions are automatically refreshed by Supabase
- Auth state listener updates context on session changes
- Cookies are managed by Supabase SSR helpers
- Session persists across page refreshes

## useAuth Hook Data Flow

```
┌─────────────────────────────────────────────────┐
│              useAuth() Hook                     │
│          (lib/hooks/useAuth.ts)                 │
└─────────────────────────────────────────────────┘
                    │
    ┌───────────────┼───────────────┐
    │               │               │
    ▼               ▼               ▼
┌─────────┐   ┌──────────┐   ┌──────────┐
│  State  │   │ Methods  │   │ Effects  │
└─────────┘   └──────────┘   └──────────┘
    │               │               │
    ▼               ▼               ▼
┌─────────┐   ┌──────────┐   ┌──────────────────┐
│ user    │   │ signIn() │   │ useEffect()      │
│ loading │   │ signOut()│   │ - Get initial    │
│ error   │   │ getUser()│   │   user           │
└─────────┘   └──────────┘   │ - Listen for     │
                              │   auth changes   │
                              └──────────────────┘
                                      │
                                      ▼
                              ┌──────────────────┐
                              │ Supabase Client  │
                              │ - auth.getUser() │
                              │ - onAuthState    │
                              │   Change()       │
                              └──────────────────┘
```

## Security Considerations

### Security Layers

```
┌──────────────────────────────────────────────────┐
│              Request to /admin/*                 │
└──────────────────┬───────────────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │   LAYER 1: Edge      │
        │   Middleware         │
        │   - Checks session   │
        │   - Redirects if no  │
        │     user             │
        └──────────┬───────────┘
                   │
                   ▼ (User authenticated)
        ┌──────────────────────┐
        │   LAYER 2: Server    │
        │   Components         │
        │   - Can use service  │
        │     role for admin   │
        │     queries          │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │   LAYER 3: Supabase  │
        │   RLS Policies       │
        │   - Database-level   │
        │     protection       │
        │   - Checks auth.uid()│
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │   Data Access        │
        │   Granted            │
        └──────────────────────┘
```

### Implemented
1. **Middleware Protection**: All admin routes (except login) require authentication
2. **CSRF Protection**: Built into Supabase Auth (no additional implementation needed)
3. **Secure Cookies**: Sessions stored in httpOnly cookies (managed by Supabase)
4. **Client-side Validation**: Form inputs validated before submission
5. **Error Handling**: Proper error messages without exposing sensitive info
6. **Loading States**: Prevent multiple submissions during auth operations
7. **Auto-redirect**: Logged-in users can't access login page
8. **Type Safety**: Full TypeScript typing for auth methods and state

### Environment Variables Required
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL (public)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key (public, respects RLS)
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key (server-only, bypasses RLS)

### Row-Level Security (RLS)
The Supabase database should have RLS policies configured:
- **Public read** access to published posts
- **Admin-only write** access to all tables
- Admin users identified by their auth user ID

## Assumptions About Supabase Setup

This implementation assumes the following Supabase configuration:

1. **Auth Settings:**
   - Email/password authentication is enabled
   - Email confirmation may be disabled for development (optional)
   - At least one admin user exists in `auth.users` table

2. **Database Tables:**
   - Tables follow the schema defined in `PROJECT_STRATEGY.md`
   - Row-Level Security (RLS) policies are enabled
   - Policies check `auth.uid()` for admin access

3. **Environment:**
   - Supabase project is created
   - Environment variables are set in `.env.local`
   - Project URL and keys are correctly configured

## Setup Instructions

### 1. Create Supabase Project
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Create a new project
3. Wait for database to be provisioned

### 2. Create Admin User
```sql
-- In Supabase SQL Editor
-- Create an admin user (replace with your email/password)
-- Note: This is typically done through Supabase Auth UI or API
```

Or use Supabase Dashboard:
1. Go to Authentication > Users
2. Click "Add User"
3. Enter email and password
4. Click "Create User"

### 3. Configure Environment Variables
1. Copy `.env.local.example` to `.env.local`
2. Fill in your Supabase credentials:
   - Get URL from Settings > API > Project URL
   - Get anon key from Settings > API > Project API keys
   - Get service role key from Settings > API > Project API keys

### 4. Test Authentication
1. Start dev server: `npm run dev`
2. Navigate to `http://localhost:3000/admin`
3. You should be redirected to `/admin/login`
4. Log in with your admin credentials
5. You should be redirected to `/admin` dashboard

## Testing Checklist

- [ ] Login page loads without errors
- [ ] Login form validates email format
- [ ] Login form shows loading state when submitting
- [ ] Invalid credentials show error message
- [ ] Valid credentials redirect to `/admin`
- [ ] Protected routes redirect to login when not authenticated
- [ ] Authenticated users can't access `/admin/login` (redirected to `/admin`)
- [ ] Admin layout shows user email
- [ ] Logout button works and redirects to login
- [ ] Session persists on page refresh
- [ ] Navigation works between admin pages
- [ ] All auth components are TypeScript error-free

## Future Enhancements

Potential improvements for the auth system:

1. **Password Reset**: Add "Forgot Password" flow with email
2. **Magic Link Login**: Alternative passwordless authentication
3. **Two-Factor Authentication**: Add 2FA for extra security
4. **Session Timeout**: Auto-logout after inactivity
5. **Role-Based Access**: Different permission levels (admin, editor, viewer)
6. **Audit Log**: Track admin actions for security
7. **Remember Me**: Option to extend session duration
8. **Social Login**: GitHub, Google OAuth for admins
9. **API Key Management**: Generate API keys for programmatic access
10. **Rate Limiting**: Prevent brute-force login attempts

## Troubleshooting

### Common Issues

**Problem**: "Invalid login credentials" error
- **Solution**: Verify user exists in Supabase Auth dashboard
- **Solution**: Check that email confirmation is not required (or user is confirmed)

**Problem**: Infinite redirect loop
- **Solution**: Check middleware logic, ensure cookies are being set
- **Solution**: Verify Supabase URL and keys are correct

**Problem**: "Failed to fetch" or network errors
- **Solution**: Check Supabase project is running
- **Solution**: Verify CORS settings in Supabase
- **Solution**: Check internet connection

**Problem**: TypeScript errors
- **Solution**: Run `npm install` to ensure all types are installed
- **Solution**: Check `@supabase/supabase-js` version compatibility

**Problem**: Session not persisting
- **Solution**: Check browser cookie settings (cookies must be enabled)
- **Solution**: Verify middleware is properly managing cookies
- **Solution**: Check Supabase session settings

## Files Modified/Created

### Created:
- `lib/hooks/useAuth.ts` - Authentication hook
- `components/providers/AuthProvider.tsx` - Auth context provider
- `lib/supabase/middleware.ts` - Supabase middleware helper
- `middleware.ts` - Next.js middleware for route protection
- `app/admin/layout.tsx` - Admin layout with navigation and logout
- `AUTHENTICATION.md` - This documentation

### Modified:
- `app/admin/login/page.tsx` - Replaced placeholder with functional login form
- `app/admin/page.tsx` - Enhanced dashboard with quick stats and actions
- `package.json` - Added `@supabase/ssr` dependency

## Dependencies Added

- `@supabase/ssr` (^0.7.0) - Supabase Server-Side Rendering helpers for Next.js middleware

## Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Auth with Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Supabase Row-Level Security](https://supabase.com/docs/guides/auth/row-level-security)
