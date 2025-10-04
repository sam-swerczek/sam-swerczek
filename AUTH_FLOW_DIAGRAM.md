# Authentication Flow Diagram

## Visual Flow Chart

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

## Component Relationship Diagram

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

## Data Flow: useAuth Hook

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

## Security Layers

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

## Session Management Flow

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

## Logout Flow

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
