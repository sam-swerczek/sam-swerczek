# TODO: Testing Setup

## Fix npm cache permissions (requires manual intervention)

There's a permission issue with the npm cache that needs to be fixed before installing testing dependencies.

**Run this command manually:**
```bash
sudo chown -R 501:20 "/Users/samswerczek/.npm"
```

## Install Testing Dependencies

After fixing permissions, install Jest and React Testing Library:

```bash
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @types/jest
```

## Testing Setup Tasks

- [ ] Fix npm cache permissions (see command above)
- [ ] Install testing dependencies
- [ ] Create Jest configuration (`jest.config.js`)
- [ ] Create Jest setup file (`jest.setup.js`)
- [ ] Add test script to `package.json`
- [ ] Write tests for contact form functionality
- [ ] Write tests for critical page components (Hero, Navigation)
- [ ] Write tests for Supabase query functions
- [ ] Run tests to verify setup

## Critical Test Coverage Needed

### 1. Contact Form
- Form validation
- Form submission
- Error handling
- Success message display

### 2. Core Components
- HeroSection renders correctly
- Header navigation links
- Footer displays correctly

### 3. Data Fetching
- Supabase blog post queries
- Supabase config queries
- Error handling for failed queries

## Notes

- Focus on critical functionality that could break with changes
- Don't need to test every component, just the most important ones
- Integration tests > unit tests for this type of app
